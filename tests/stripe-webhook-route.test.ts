import { beforeEach, describe, expect, it, vi } from "vitest";

const constructStripeWebhookEvent = vi.fn();
const stripeWebhookEventCreate = vi.fn();
const campaignPaymentFindUnique = vi.fn();
const campaignPaymentFindFirst = vi.fn();
const campaignPaymentUpdate = vi.fn();
const campaignFindUnique = vi.fn();
const campaignUpdate = vi.fn();
const writeAudit = vi.fn();
const refundIncludedQuota = vi.fn();

class FakeStripeNotConfiguredError extends Error {}

vi.mock("@/lib/stripe", () => ({
  constructStripeWebhookEvent: (...args: unknown[]) => constructStripeWebhookEvent(...args),
  StripeNotConfiguredError: FakeStripeNotConfiguredError,
}));

vi.mock("@/lib/audit", () => ({ writeAudit: (...args: unknown[]) => writeAudit(...args) }));

vi.mock("@/lib/campaign-quota", () => ({
  refundIncludedQuota: (...args: unknown[]) => refundIncludedQuota(...args),
}));

function tx() {
  return {
    campaignPayment: {
      findUnique: campaignPaymentFindUnique,
      findFirst: campaignPaymentFindFirst,
      update: campaignPaymentUpdate,
    },
    campaign: {
      findUnique: campaignFindUnique,
      update: campaignUpdate,
    },
  };
}

vi.mock("@/lib/prisma", () => ({
  prisma: {
    stripeWebhookEvent: { create: (...args: unknown[]) => stripeWebhookEventCreate(...args) },
    $transaction: async (callback: (client: unknown) => Promise<unknown>) => callback(tx()),
  },
}));

function makeReq(body: string, signature: string | null = "sig_test") {
  const headers: Record<string, string> = {};
  if (signature) headers["stripe-signature"] = signature;
  return new Request("http://localhost:3000/api/stripe/webhook", {
    method: "POST",
    headers,
    body,
  });
}

beforeEach(() => {
  vi.clearAllMocks();
  stripeWebhookEventCreate.mockResolvedValue({});
});

describe("POST /api/stripe/webhook", () => {
  it("refuse une signature invalide (400)", async () => {
    constructStripeWebhookEvent.mockImplementation(() => {
      throw new Error("bad signature");
    });
    const { POST } = await import("../src/app/api/stripe/webhook/route");
    const response = await POST(makeReq("{}"));
    expect(response.status).toBe(400);
  });

  it("renvoie 503 avec un code clair quand Stripe n'est pas configuré", async () => {
    constructStripeWebhookEvent.mockImplementation(() => {
      throw new FakeStripeNotConfiguredError("not configured");
    });
    const { POST } = await import("../src/app/api/stripe/webhook/route");
    const response = await POST(makeReq("{}"));
    const payload = (await response.json()) as { code: string };
    expect(response.status).toBe(503);
    expect(payload.code).toBe("STRIPE_NOT_CONFIGURED");
  });

  it("idempotent : un event.id déjà vu répond 200 sans rejouer le traitement", async () => {
    constructStripeWebhookEvent.mockReturnValue({ id: "evt_1", type: "checkout.session.completed", data: { object: {} } });
    stripeWebhookEventCreate.mockRejectedValueOnce(new Error("unique constraint"));

    const { POST } = await import("../src/app/api/stripe/webhook/route");
    const response = await POST(makeReq("{}"));
    const payload = (await response.json()) as { ok: boolean; replay: boolean };

    expect(response.status).toBe(200);
    expect(payload.replay).toBe(true);
    expect(campaignPaymentFindUnique).not.toHaveBeenCalled();
  });

  it("checkout.session.completed marque le paiement payé et programme la campagne membres", async () => {
    constructStripeWebhookEvent.mockReturnValue({
      id: "evt_2",
      type: "checkout.session.completed",
      data: {
        object: {
          id: "cs_test_1",
          payment_intent: "pi_1",
          metadata: { campaignId: "camp_1" },
        },
      },
    });
    campaignPaymentFindUnique.mockResolvedValueOnce({ id: "pay_1", status: "PENDING", amountCents: 500 });
    campaignFindUnique.mockResolvedValueOnce({
      id: "camp_1",
      merchantId: "m1",
      channel: "IN_APP_PUSH",
      audienceType: "MERCHANT_MEMBERS",
    });

    const { POST } = await import("../src/app/api/stripe/webhook/route");
    const response = await POST(makeReq("{}"));

    expect(response.status).toBe(200);
    expect(campaignPaymentUpdate).toHaveBeenCalledWith(
      expect.objectContaining({ data: expect.objectContaining({ status: "PAID" }) }),
    );
    expect(campaignUpdate).toHaveBeenCalledWith(
      expect.objectContaining({ data: { status: "SCHEDULED" } }),
    );
  });

  it("checkout.session.completed envoie une campagne réseau en PENDING_REVIEW, pas directement SCHEDULED", async () => {
    constructStripeWebhookEvent.mockReturnValue({
      id: "evt_3",
      type: "checkout.session.completed",
      data: { object: { id: "cs_2", payment_intent: "pi_2", metadata: { campaignId: "camp_2" } } },
    });
    campaignPaymentFindUnique.mockResolvedValueOnce({ id: "pay_2", status: "PENDING", amountCents: 1500 });
    campaignFindUnique.mockResolvedValueOnce({
      id: "camp_2",
      merchantId: "m1",
      channel: "IN_APP_PUSH",
      audienceType: "NETWORK_LOCAL",
    });

    const { POST } = await import("../src/app/api/stripe/webhook/route");
    await POST(makeReq("{}"));

    expect(campaignUpdate).toHaveBeenCalledWith(
      expect.objectContaining({ data: { status: "PENDING_REVIEW" } }),
    );
  });

  it("ne rejoue jamais un paiement déjà marqué PAID (idempotence métier en plus de l'idempotence webhook)", async () => {
    constructStripeWebhookEvent.mockReturnValue({
      id: "evt_4",
      type: "checkout.session.completed",
      data: { object: { id: "cs_3", metadata: { campaignId: "camp_3" } } },
    });
    campaignPaymentFindUnique.mockResolvedValueOnce({ id: "pay_3", status: "PAID" });

    const { POST } = await import("../src/app/api/stripe/webhook/route");
    await POST(makeReq("{}"));

    expect(campaignPaymentUpdate).not.toHaveBeenCalled();
    expect(campaignFindUnique).not.toHaveBeenCalled();
  });

  it("payment_intent.payment_failed marque le paiement et la campagne en échec", async () => {
    constructStripeWebhookEvent.mockReturnValue({
      id: "evt_5",
      type: "payment_intent.payment_failed",
      data: {
        object: {
          metadata: { campaignId: "camp_4" },
          last_payment_error: { message: "Carte refusée." },
        },
      },
    });
    campaignPaymentFindUnique.mockResolvedValueOnce({ id: "pay_4", status: "PENDING" });

    const { POST } = await import("../src/app/api/stripe/webhook/route");
    await POST(makeReq("{}"));

    expect(campaignPaymentUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ status: "FAILED", failureReason: "Carte refusée." }),
      }),
    );
    expect(campaignUpdate).toHaveBeenCalledWith(expect.objectContaining({ data: { status: "FAILED" } }));
  });

  it("charge.refunded annule la campagne et restitue le quota consommé s'il y en avait un", async () => {
    constructStripeWebhookEvent.mockReturnValue({
      id: "evt_6",
      type: "charge.refunded",
      data: { object: { payment_intent: "pi_9" } },
    });
    campaignPaymentFindFirst.mockResolvedValueOnce({ id: "pay_5", campaignId: "camp_5", status: "PAID" });
    campaignFindUnique.mockResolvedValueOnce({
      id: "camp_5",
      merchantId: "m1",
      quotaKind: "MEMBER_EMAIL",
      quotaPeriodKey: "2026-09",
      quotaConsumedAt: new Date(),
    });

    const { POST } = await import("../src/app/api/stripe/webhook/route");
    await POST(makeReq("{}"));

    expect(campaignPaymentUpdate).toHaveBeenCalledWith(
      expect.objectContaining({ data: expect.objectContaining({ status: "REFUNDED" }) }),
    );
    expect(campaignUpdate).toHaveBeenCalledWith(expect.objectContaining({ data: { status: "CANCELLED" } }));
    expect(refundIncludedQuota).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ merchantId: "m1", kind: "MEMBER_EMAIL", periodKey: "2026-09" }),
    );
  });
});
