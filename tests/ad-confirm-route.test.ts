import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

const requireMutatingRequest = vi.fn();
const requireMerchantAdmin = vi.fn();
const adRequestFindFirst = vi.fn();
const campaignUpdate = vi.fn();
const adRequestUpdate = vi.fn();
const adRequestUpdateMany = vi.fn();
const paymentUpsert = vi.fn();
const createCampaignCheckoutSession = vi.fn();
const getQuotaUsage = vi.fn();
const resolvePlanTier = vi.fn();
const executeRaw = vi.fn();

class FakeStripeNotConfiguredError extends Error {}

vi.mock("@/lib/api-guard", () => ({ requireMutatingRequest, requireMerchantAdmin }));
const stripeMode = { active: "TEST" as "TEST" | "LIVE", allowed: true, configured: true };
vi.mock("@/lib/stripe-mode", () => ({
  getActiveStripeMode: () => stripeMode.active,
  isPaymentAllowedForMerchant: () => stripeMode.allowed,
  isStripeConfigured: () => stripeMode.configured,
}));
vi.mock("@/lib/ad-visual-workflow", () => ({ notifyMerchant: vi.fn() }));
vi.mock("@/lib/audit", () => ({ writeAudit: vi.fn() }));
vi.mock("@/lib/stripe", () => ({
  createCampaignCheckoutSession: (...args: unknown[]) => createCampaignCheckoutSession(...args),
  StripeNotConfiguredError: FakeStripeNotConfiguredError,
}));
vi.mock("@/lib/campaign-quota", async () => {
  const actual = await vi.importActual<typeof import("../src/lib/campaign-quota")>("../src/lib/campaign-quota");
  return {
    ...actual,
    getQuotaUsage: (...args: unknown[]) => getQuotaUsage(...args),
    resolvePlanTier: (...args: unknown[]) => resolvePlanTier(...args),
  };
});
vi.mock("@/lib/prisma", () => ({
  prisma: {
    adRequest: { findFirst: (...args: unknown[]) => adRequestFindFirst(...args) },
    marketingLedgerEntry: { findUnique: vi.fn().mockResolvedValue(null) },
    marketingBalance: { findUnique: vi.fn().mockResolvedValue(null) },
    $transaction: async (callback: (client: unknown) => Promise<unknown>) =>
      callback({
        campaign: { update: campaignUpdate },
        adRequest: { update: adRequestUpdate, updateMany: adRequestUpdateMany },
        campaignPayment: { upsert: paymentUpsert, updateMany: vi.fn() },
        campaignQuotaUsage: { upsert: vi.fn() },
        $executeRaw: executeRaw,
      }),
  },
}));

const DAY = 86_400_000;
function adRequest(days: number, overrides: Record<string, unknown> = {}) {
  const startDate = new Date("2026-10-01T00:00:00Z");
  return {
    id: "ad_1",
    merchantId: "merchant_A",
    status: "APPROVED",
    finalImageUrl: "/final.png",
    startDate,
    endDate: new Date(startDate.getTime() + days * DAY),
    campaign: { id: "camp_ad" },
    ...overrides,
  };
}

function req() {
  return new NextRequest("http://localhost:3000/api/merchant/ads/ad_1/confirm", {
    method: "POST",
    headers: { origin: "http://localhost:3000" },
  });
}

beforeEach(() => {
  vi.clearAllMocks();
  adRequestUpdateMany.mockResolvedValue({ count: 1 });
  stripeMode.active = "TEST";
  stripeMode.allowed = true;
  stripeMode.configured = true;
  requireMutatingRequest.mockResolvedValue({ error: null });
  requireMerchantAdmin.mockResolvedValue({ error: null, user: { id: "u1" }, membership: { merchantId: "merchant_A" } });
  resolvePlanTier.mockResolvedValue("normal");
  getQuotaUsage.mockResolvedValue(0);
  createCampaignCheckoutSession.mockResolvedValue({ id: "cs_ad", url: "https://checkout.stripe.test/cs_ad" });
});

describe("POST /api/merchant/ads/[id]/confirm — 5 € par jour", () => {
  it.each([
    [1, 500],
    [3, 1500],
    [7, 3500],
  ])("%i jour(s) : Stripe reçoit %i centimes, quantité = jours", async (days, expected) => {
    adRequestFindFirst.mockResolvedValueOnce(adRequest(days));
    const { POST } = await import("../src/app/api/merchant/ads/[id]/confirm/route");
    const response = await POST(req(), { params: Promise.resolve({ id: "ad_1" }) });
    const payload = (await response.json()) as { checkoutUrl: string; amountCents: number };

    expect(response.status).toBe(200);
    expect(payload.amountCents).toBe(expected);
    expect(createCampaignCheckoutSession).toHaveBeenCalledWith(
      expect.objectContaining({ amountCents: expected, quantity: days, campaignType: "SPONSORED_AD" }),
    );
    // En attente : la mise en avant n'est PAS programmée avant le webhook signé.
    expect(paymentUpsert).toHaveBeenCalledWith(
      expect.objectContaining({ create: expect.objectContaining({ status: "PENDING", amountCents: expected, mode: "TEST" }) }),
    );
    expect(campaignUpdate).toHaveBeenCalledWith(expect.objectContaining({ data: expect.objectContaining({ status: "PAYMENT_REQUIRED" }) }));
    expect(adRequestUpdateMany).not.toHaveBeenCalled();
  });

  it("couverte par le quota Insight (commerce réel) : aucun paiement Stripe, jours consommés d'un bloc, publiée normalement", async () => {
    stripeMode.allowed = false; // ce commerce n'est PAS le commerce de test : diffusion réelle normale
    resolvePlanTier.mockResolvedValue("insight");
    adRequestFindFirst.mockResolvedValueOnce(adRequest(3));
    executeRaw.mockResolvedValueOnce(1);
    const { POST } = await import("../src/app/api/merchant/ads/[id]/confirm/route");
    const response = await POST(req(), { params: Promise.resolve({ id: "ad_1" }) });
    expect(response.status).toBe(200);
    expect(createCampaignCheckoutSession).not.toHaveBeenCalled();
    expect(adRequestUpdateMany).toHaveBeenCalledWith({ where: { id: "ad_1", status: "APPROVED" }, data: { status: "SCHEDULED", fundingMode: undefined } });
    // le montant de consommation (3 jours) est passé au UPDATE conditionnel
    expect(executeRaw.mock.calls[0]).toContain(3);
  });

  it("couverte par le quota Insight du commerce de test : jamais publiée réellement (fundingMode: TEST)", async () => {
    // stripeMode.allowed reste true (défaut) : ce commerce EST le commerce de test.
    resolvePlanTier.mockResolvedValue("insight");
    adRequestFindFirst.mockResolvedValueOnce(adRequest(3));
    executeRaw.mockResolvedValueOnce(1);
    const { POST } = await import("../src/app/api/merchant/ads/[id]/confirm/route");
    const response = await POST(req(), { params: Promise.resolve({ id: "ad_1" }) });
    expect(response.status).toBe(200);
    expect(createCampaignCheckoutSession).not.toHaveBeenCalled();
    expect(adRequestUpdateMany).toHaveBeenCalledWith({ where: { id: "ad_1", status: "APPROVED" }, data: { status: "SCHEDULED", fundingMode: "TEST" } });
    expect(campaignUpdate).toHaveBeenCalledWith(
      expect.objectContaining({ data: expect.objectContaining({ fundingMode: "TEST" }) }),
    );
  });

  it("annonce non validée par Fideto : refus, aucun paiement", async () => {
    adRequestFindFirst.mockResolvedValueOnce(adRequest(3, { status: "PENDING_REVIEW" }));
    const { POST } = await import("../src/app/api/merchant/ads/[id]/confirm/route");
    const response = await POST(req(), { params: Promise.resolve({ id: "ad_1" }) });
    expect(response.status).toBe(409);
    expect(createCampaignCheckoutSession).not.toHaveBeenCalled();
  });

  it("Stripe indisponible : 503 et aucune écriture", async () => {
    adRequestFindFirst.mockResolvedValueOnce(adRequest(2));
    createCampaignCheckoutSession.mockRejectedValueOnce(new FakeStripeNotConfiguredError());
    const { POST } = await import("../src/app/api/merchant/ads/[id]/confirm/route");
    const response = await POST(req(), { params: Promise.resolve({ id: "ad_1" }) });
    expect(response.status).toBe(503);
    expect(paymentUpsert).not.toHaveBeenCalled();
  });

  it("mode réel : le paiement est enregistré en LIVE", async () => {
    stripeMode.active = "LIVE";
    adRequestFindFirst.mockResolvedValueOnce(adRequest(2));
    const { POST } = await import("../src/app/api/merchant/ads/[id]/confirm/route");
    await POST(req(), { params: Promise.resolve({ id: "ad_1" }) });
    expect(paymentUpsert).toHaveBeenCalledWith(
      expect.objectContaining({ create: expect.objectContaining({ mode: "LIVE" }), update: expect.objectContaining({ mode: "LIVE" }) }),
    );
  });

  it("mode test : un commerce non autorisé ne peut pas payer une mise en avant (403)", async () => {
    stripeMode.allowed = false;
    adRequestFindFirst.mockResolvedValueOnce(adRequest(2));
    const { POST } = await import("../src/app/api/merchant/ads/[id]/confirm/route");
    const response = await POST(req(), { params: Promise.resolve({ id: "ad_1" }) });
    expect(response.status).toBe(403);
    expect(createCampaignCheckoutSession).not.toHaveBeenCalled();
    expect(paymentUpsert).not.toHaveBeenCalled();
  });
});
