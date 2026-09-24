import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

const requireMutatingRequest = vi.fn();
const requireMerchantAdmin = vi.fn();
const ledgerCreate = vi.fn();
const ledgerUpdate = vi.fn();
const createMarketingTopupCheckoutSession = vi.fn();
const writeAudit = vi.fn();

class FakeStripeNotConfiguredError extends Error {}

vi.mock("@/lib/api-guard", () => ({ requireMutatingRequest, requireMerchantAdmin }));
vi.mock("@/lib/audit", () => ({ writeAudit }));
vi.mock("@/lib/rate-limit", () => ({
  LIMITS: { scan: { limit: 40, windowMs: 60_000 } },
  rateLimit: () => ({ ok: true as const, remaining: 1 }),
}));
vi.mock("@/lib/stripe", () => ({
  createMarketingTopupCheckoutSession: (...args: unknown[]) => createMarketingTopupCheckoutSession(...args),
  StripeNotConfiguredError: FakeStripeNotConfiguredError,
}));
vi.mock("@/lib/prisma", () => ({
  prisma: {
    marketingLedgerEntry: {
      create: (...args: unknown[]) => ledgerCreate(...args),
      update: (...args: unknown[]) => ledgerUpdate(...args),
      findMany: vi.fn(async () => []),
    },
    marketingBalance: { findUnique: vi.fn(async () => ({ balanceCents: 250 })) },
  },
}));

function req(body: unknown) {
  return new NextRequest("http://localhost:3000/api/merchant/marketing-balance", {
    method: "POST",
    headers: { "Content-Type": "application/json", origin: "http://localhost:3000" },
    body: JSON.stringify(body),
  });
}

beforeEach(() => {
  vi.clearAllMocks();
  requireMutatingRequest.mockResolvedValue({ error: null });
  requireMerchantAdmin.mockResolvedValue({ error: null, user: { id: "u1" }, membership: { merchantId: "merchant_A" } });
  ledgerCreate.mockImplementation(async ({ data }: { data: Record<string, unknown> }) => ({ id: "led_1", ...data }));
  createMarketingTopupCheckoutSession.mockResolvedValue({ id: "cs_test_1", url: "https://checkout.stripe.test/cs_test_1" });
});

describe("POST /api/merchant/marketing-balance", () => {
  it.each([500, 1000, 2000, 3750])("recharge de %i centimes : le montant envoyé à Stripe est exactement celui-ci", async (amountCents) => {
    const { POST } = await import("../src/app/api/merchant/marketing-balance/route");
    const response = await POST(req({ amountCents }));
    const payload = (await response.json()) as { checkoutUrl: string; amountCents: number };

    expect(response.status).toBe(200);
    expect(payload.checkoutUrl).toContain("checkout.stripe.test");
    expect(createMarketingTopupCheckoutSession).toHaveBeenCalledWith(
      expect.objectContaining({ merchantId: "merchant_A", ledgerEntryId: "led_1", amountCents }),
    );
    // Historique : l'entrée est PENDING, rien n'est crédité par cette route.
    expect(ledgerCreate).toHaveBeenCalledWith({
      data: expect.objectContaining({ merchantId: "merchant_A", type: "TOPUP", status: "PENDING", amountCents }),
    });
    expect(ledgerUpdate).toHaveBeenCalledWith(
      expect.objectContaining({ data: { stripeCheckoutSessionId: "cs_test_1" } }),
    );
  });

  it.each([0, 499, -1000, 1000.5, 50_001, "1000", null])("refuse le montant invalide %s (400) sans appeler Stripe", async (amountCents) => {
    const { POST } = await import("../src/app/api/merchant/marketing-balance/route");
    const response = await POST(req({ amountCents }));
    expect(response.status).toBe(400);
    expect(createMarketingTopupCheckoutSession).not.toHaveBeenCalled();
    expect(ledgerCreate).not.toHaveBeenCalled();
  });

  it("le commerce vient de la session, jamais du body", async () => {
    const { POST } = await import("../src/app/api/merchant/marketing-balance/route");
    await POST(req({ amountCents: 500, merchantId: "merchant_B" }));
    expect(createMarketingTopupCheckoutSession).toHaveBeenCalledWith(expect.objectContaining({ merchantId: "merchant_A" }));
  });

  it("Stripe non configuré : 503 et l'entrée créée est annulée", async () => {
    createMarketingTopupCheckoutSession.mockRejectedValueOnce(new FakeStripeNotConfiguredError());
    const { POST } = await import("../src/app/api/merchant/marketing-balance/route");
    const response = await POST(req({ amountCents: 500 }));
    expect(response.status).toBe(503);
    expect(ledgerUpdate).toHaveBeenCalledWith(expect.objectContaining({ data: { status: "CANCELLED" } }));
  });

  it("GET renvoie le solde et les montants proposés", async () => {
    const { GET } = await import("../src/app/api/merchant/marketing-balance/route");
    const response = await GET(new Request("http://localhost:3000/api/merchant/marketing-balance"));
    const payload = (await response.json()) as { balanceCents: number; presetsCents: number[]; minTopupCents: number };
    expect(payload).toMatchObject({ balanceCents: 250, presetsCents: [500, 1000, 2000], minTopupCents: 500 });
  });
});
