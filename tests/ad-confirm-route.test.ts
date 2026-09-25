import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

const requireMutatingRequest = vi.fn();
const requireMerchantAdmin = vi.fn();
const adRequestFindFirst = vi.fn();
const campaignUpdate = vi.fn();
const adRequestUpdate = vi.fn();
const paymentUpsert = vi.fn();
const createCampaignCheckoutSession = vi.fn();
const getQuotaUsage = vi.fn();
const resolvePlanTier = vi.fn();
const executeRaw = vi.fn();

class FakeStripeNotConfiguredError extends Error {}

vi.mock("@/lib/api-guard", () => ({ requireMutatingRequest, requireMerchantAdmin }));
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
    $transaction: async (callback: (client: unknown) => Promise<unknown>) =>
      callback({
        campaign: { update: campaignUpdate },
        adRequest: { update: adRequestUpdate },
        campaignPayment: { upsert: paymentUpsert },
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
      expect.objectContaining({ create: expect.objectContaining({ status: "PENDING", amountCents: expected }) }),
    );
    expect(campaignUpdate).toHaveBeenCalledWith(expect.objectContaining({ data: expect.objectContaining({ status: "PAYMENT_REQUIRED" }) }));
    expect(adRequestUpdate).not.toHaveBeenCalled();
  });

  it("couverte par le quota Insight : aucun paiement Stripe, jours consommés d'un bloc", async () => {
    resolvePlanTier.mockResolvedValue("insight");
    adRequestFindFirst.mockResolvedValueOnce(adRequest(3));
    executeRaw.mockResolvedValueOnce(1);
    const { POST } = await import("../src/app/api/merchant/ads/[id]/confirm/route");
    const response = await POST(req(), { params: Promise.resolve({ id: "ad_1" }) });
    expect(response.status).toBe(200);
    expect(createCampaignCheckoutSession).not.toHaveBeenCalled();
    expect(adRequestUpdate).toHaveBeenCalledWith({ where: { id: "ad_1" }, data: { status: "SCHEDULED" } });
    // le montant de consommation (3 jours) est passé au UPDATE conditionnel
    expect(executeRaw.mock.calls[0]).toContain(3);
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
});
