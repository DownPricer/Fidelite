import { beforeEach, describe, expect, it, vi } from "vitest";

const constructStripeWebhookEvent = vi.fn();
const stripeWebhookEventCreate = vi.fn();
const stripeWebhookEventDelete = vi.fn();
const creditTopup = vi.fn();
const ledgerUpdateMany = vi.fn();
const campaignPaymentFindUnique = vi.fn();
const campaignPaymentUpdate = vi.fn();
const campaignFindUnique = vi.fn();
const campaignUpdate = vi.fn();
const adRequestFindUnique = vi.fn();
const adRequestUpdate = vi.fn();
const writeAudit = vi.fn();

vi.mock("@/lib/stripe", () => ({
  constructStripeWebhookEvent: (...args: unknown[]) => constructStripeWebhookEvent(...args),
  StripeNotConfiguredError: class extends Error {},
}));
vi.mock("@/lib/audit", () => ({ writeAudit: (...args: unknown[]) => writeAudit(...args) }));
vi.mock("@/lib/campaign-quota", () => ({ refundIncludedQuota: vi.fn() }));
vi.mock("@/lib/marketing-balance", () => ({ creditTopup: (...args: unknown[]) => creditTopup(...args) }));

function tx() {
  return {
    campaignPayment: { findUnique: campaignPaymentFindUnique, update: campaignPaymentUpdate },
    campaign: { findUnique: campaignFindUnique, update: campaignUpdate },
    adRequest: { findUnique: adRequestFindUnique, update: adRequestUpdate },
  };
}

vi.mock("@/lib/prisma", () => ({
  prisma: {
    stripeWebhookEvent: {
      create: (...args: unknown[]) => stripeWebhookEventCreate(...args),
      delete: (...args: unknown[]) => stripeWebhookEventDelete(...args),
    },
    marketingLedgerEntry: { updateMany: (...args: unknown[]) => ledgerUpdateMany(...args) },
    $transaction: async (callback: (client: unknown) => Promise<unknown>) => callback(tx()),
  },
}));

function post(event: unknown) {
  constructStripeWebhookEvent.mockReturnValue(event);
  return import("../src/app/api/stripe/webhook/route").then(({ POST }) =>
    POST(new Request("http://localhost:3000/api/stripe/webhook", { method: "POST", headers: { "stripe-signature": "sig" }, body: "{}" })),
  );
}

const topupSession = (overrides: Record<string, unknown> = {}) => ({
  id: "cs_topup",
  payment_status: "paid",
  amount_total: 1000,
  payment_intent: "pi_topup",
  metadata: { kind: "MARKETING_TOPUP", merchantId: "m1", ledgerEntryId: "led_1" },
  ...overrides,
});

const adSession = (overrides: Record<string, unknown> = {}) => ({
  id: "cs_ad",
  payment_status: "paid",
  amount_total: 1500,
  payment_intent: "pi_ad",
  metadata: { campaignId: "camp_ad", merchantId: "m1", campaignType: "SPONSORED_AD" },
  ...overrides,
});

beforeEach(() => {
  vi.clearAllMocks();
  stripeWebhookEventCreate.mockResolvedValue({});
  stripeWebhookEventDelete.mockResolvedValue({});
  creditTopup.mockResolvedValue("credited");
});

describe("webhook — recharge du solde marketing", () => {
  it("paiement confirmé : crédite via creditTopup avec la session et le montant Stripe", async () => {
    const response = await post({ id: "evt_1", type: "checkout.session.completed", data: { object: topupSession() } });
    expect(response.status).toBe(200);
    expect(creditTopup).toHaveBeenCalledWith(
      expect.anything(),
      { checkoutSessionId: "cs_topup", paymentIntentId: "pi_topup", amountPaidCents: 1000 },
    );
  });

  it("session non payée (payment_status != paid) : rien n'est crédité", async () => {
    await post({ id: "evt_2", type: "checkout.session.completed", data: { object: topupSession({ payment_status: "unpaid" }) } });
    expect(creditTopup).not.toHaveBeenCalled();
  });

  it("événement rejoué (même event.id) : 200 et aucun second crédit", async () => {
    await post({ id: "evt_3", type: "checkout.session.completed", data: { object: topupSession() } });
    stripeWebhookEventCreate.mockRejectedValueOnce(new Error("unique"));
    const replay = await post({ id: "evt_3", type: "checkout.session.completed", data: { object: topupSession() } });
    expect(replay.status).toBe(200);
    expect(creditTopup).toHaveBeenCalledTimes(1);
  });

  it("nouvel événement pour une recharge déjà créditée : creditTopup reste idempotent (« already »), pas d'audit", async () => {
    creditTopup.mockResolvedValueOnce("already");
    await post({ id: "evt_4", type: "checkout.session.completed", data: { object: topupSession() } });
    expect(writeAudit).not.toHaveBeenCalled();
  });

  it("montant Stripe incohérent : erreur 500 et l'événement est libéré pour un rejeu, rien n'est crédité", async () => {
    creditTopup.mockResolvedValueOnce("amount_mismatch");
    const response = await post({ id: "evt_5", type: "checkout.session.completed", data: { object: topupSession() } });
    expect(response.status).toBe(500);
    expect(stripeWebhookEventDelete).toHaveBeenCalledWith({ where: { id: "evt_5" } });
  });

  it("session expirée (paiement annulé) : la recharge en attente est annulée, aucun crédit", async () => {
    await post({ id: "evt_6", type: "checkout.session.expired", data: { object: topupSession({ payment_status: "unpaid" }) } });
    expect(ledgerUpdateMany).toHaveBeenCalledWith({
      where: { stripeCheckoutSessionId: "cs_topup", type: "TOPUP", status: "PENDING" },
      data: { status: "CANCELLED" },
    });
    expect(creditTopup).not.toHaveBeenCalled();
  });

  it("paiement refusé : la recharge passe en échec, aucun crédit", async () => {
    await post({
      id: "evt_7",
      type: "payment_intent.payment_failed",
      data: { object: { metadata: { kind: "MARKETING_TOPUP", ledgerEntryId: "led_1" } } },
    });
    expect(ledgerUpdateMany).toHaveBeenCalledWith({
      where: { id: "led_1", type: "TOPUP", status: "PENDING" },
      data: { status: "FAILED" },
    });
    expect(creditTopup).not.toHaveBeenCalled();
  });
});

describe("webhook — mise en avant payée (5 € × jours)", () => {
  const pendingPayment = { id: "pay_ad", status: "PENDING", amountCents: 1500, stripeCheckoutSessionId: "cs_ad" };

  it("paiement confirmé : l'annonce validée passe SCHEDULED, la campagne aussi", async () => {
    campaignPaymentFindUnique.mockResolvedValueOnce(pendingPayment);
    campaignFindUnique.mockResolvedValueOnce({ id: "camp_ad", merchantId: "m1", channel: "SPONSORED_AD", audienceType: null });
    adRequestFindUnique.mockResolvedValueOnce({ id: "ad_1", status: "APPROVED" });

    await post({ id: "evt_10", type: "checkout.session.completed", data: { object: adSession() } });

    expect(campaignPaymentUpdate).toHaveBeenCalledWith(expect.objectContaining({ data: expect.objectContaining({ status: "PAID" }) }));
    expect(adRequestUpdate).toHaveBeenCalledWith({ where: { id: "ad_1" }, data: { status: "SCHEDULED" } });
    expect(campaignUpdate).toHaveBeenCalledWith({ where: { id: "camp_ad" }, data: { status: "SCHEDULED" } });
  });

  it("montant Stripe différent de 5 € × jours enregistré : rien n'est activé", async () => {
    campaignPaymentFindUnique.mockResolvedValueOnce(pendingPayment);
    const response = await post({ id: "evt_11", type: "checkout.session.completed", data: { object: adSession({ amount_total: 500 }) } });
    expect(response.status).toBe(500);
    expect(campaignPaymentUpdate).not.toHaveBeenCalled();
    expect(adRequestUpdate).not.toHaveBeenCalled();
  });

  it("session obsolète (paiement relancé avec une autre session) : rien n'est activé", async () => {
    campaignPaymentFindUnique.mockResolvedValueOnce({ ...pendingPayment, stripeCheckoutSessionId: "cs_newer" });
    await post({ id: "evt_12", type: "checkout.session.completed", data: { object: adSession() } });
    expect(campaignPaymentUpdate).not.toHaveBeenCalled();
    expect(campaignUpdate).not.toHaveBeenCalled();
  });

  it("session non payée : rien n'est activé", async () => {
    await post({ id: "evt_13", type: "checkout.session.completed", data: { object: adSession({ payment_status: "unpaid" }) } });
    expect(campaignPaymentFindUnique).not.toHaveBeenCalled();
    expect(adRequestUpdate).not.toHaveBeenCalled();
  });

  it("déjà payée (rejeu) : aucune seconde activation", async () => {
    campaignPaymentFindUnique.mockResolvedValueOnce({ ...pendingPayment, status: "PAID" });
    await post({ id: "evt_14", type: "checkout.session.completed", data: { object: adSession() } });
    expect(adRequestUpdate).not.toHaveBeenCalled();
    expect(campaignUpdate).not.toHaveBeenCalled();
  });

  it("paiement annulé/expiré : le paiement est annulé mais la mise en avant reste « à payer », rien d'activé", async () => {
    campaignPaymentFindUnique.mockResolvedValueOnce(pendingPayment);
    await post({ id: "evt_15", type: "checkout.session.expired", data: { object: adSession({ payment_status: "unpaid" }) } });
    expect(campaignPaymentUpdate).toHaveBeenCalledWith({ where: { id: "pay_ad" }, data: { status: "CANCELLED" } });
    expect(campaignUpdate).not.toHaveBeenCalled();
    expect(adRequestUpdate).not.toHaveBeenCalled();
  });

  it("paiement refusé : le paiement est en échec, la mise en avant n'est pas activée", async () => {
    campaignPaymentFindUnique.mockResolvedValueOnce(pendingPayment);
    await post({
      id: "evt_16",
      type: "payment_intent.payment_failed",
      data: { object: { metadata: { campaignId: "camp_ad", campaignType: "SPONSORED_AD" }, last_payment_error: { message: "Refusée" } } },
    });
    expect(campaignPaymentUpdate).toHaveBeenCalledWith(expect.objectContaining({ data: expect.objectContaining({ status: "FAILED" }) }));
    expect(campaignUpdate).not.toHaveBeenCalled();
  });
});
