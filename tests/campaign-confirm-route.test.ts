import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

const requireMutatingRequest = vi.fn();
const requireMerchantAdmin = vi.fn();
const campaignFindFirst = vi.fn();
const merchantFindUnique = vi.fn();
const campaignUpdate = vi.fn();
const campaignPaymentCreate = vi.fn();
const writeAudit = vi.fn();
const createCampaignCheckoutSession = vi.fn();
const estimateMerchantMembersAudience = vi.fn();
const estimateNetworkLocalAudience = vi.fn();
const getQuotaUsage = vi.fn();
const rateLimit = vi.fn(() => ({ ok: true as const, remaining: 1 }));

class FakeStripeNotConfiguredError extends Error {}

vi.mock("@/lib/api-guard", () => ({ requireMutatingRequest, requireMerchantAdmin }));
vi.mock("@/lib/audit", () => ({ writeAudit }));
vi.mock("@/lib/stripe", () => ({
  createCampaignCheckoutSession: (...args: unknown[]) => createCampaignCheckoutSession(...args),
  StripeNotConfiguredError: FakeStripeNotConfiguredError,
}));
vi.mock("@/lib/campaign-audience", () => ({
  estimateMerchantMembersAudience: (...args: unknown[]) => estimateMerchantMembersAudience(...args),
  estimateNetworkLocalAudience: (...args: unknown[]) => estimateNetworkLocalAudience(...args),
}));
vi.mock("@/lib/rate-limit", () => ({
  LIMITS: { scan: { limit: 40, windowMs: 60_000 } },
  rateLimit: (...args: unknown[]) => rateLimit(...(args as [string, number, number])),
}));
vi.mock("@/lib/campaign-quota", async () => {
  const actual = await vi.importActual<typeof import("../src/lib/campaign-quota")>("../src/lib/campaign-quota");
  return {
    ...actual,
    getQuotaUsage: (...args: unknown[]) => getQuotaUsage(...args),
    resolvePlanTier: vi.fn(async () => "normal"),
  };
});

function tx() {
  return {
    campaign: { update: (...args: unknown[]) => campaignUpdate(...args) },
    campaignQuotaUsage: { upsert: vi.fn() },
    campaignPayment: { create: (...args: unknown[]) => campaignPaymentCreate(...args) },
    $executeRaw: vi.fn(async () => 1), // simule un crédit de quota disponible par défaut
  };
}

vi.mock("@/lib/prisma", () => ({
  prisma: {
    campaign: { findFirst: (...args: unknown[]) => campaignFindFirst(...args) },
    merchant: { findUnique: (...args: unknown[]) => merchantFindUnique(...args) },
    $transaction: async (callback: (client: unknown) => Promise<unknown>) => callback(tx()),
  },
}));

function req(body?: unknown) {
  return new NextRequest("http://localhost:3000/api/merchant/campaigns/camp_1/confirm", {
    method: "POST",
    headers: { "Content-Type": "application/json", origin: "http://localhost:3000" },
    body: JSON.stringify(body ?? {}),
  });
}

const baseCampaign = {
  id: "camp_1",
  merchantId: "merchant_A",
  channel: "IN_APP_PUSH" as const,
  audienceType: "MERCHANT_MEMBERS" as const,
  status: "DRAFT" as const,
  title: "Titre",
  body: "Message",
  quotaKind: "MEMBER_NOTIFICATION" as const,
};

beforeEach(() => {
  vi.clearAllMocks();
  requireMutatingRequest.mockResolvedValue({ error: null });
  requireMerchantAdmin.mockResolvedValue({
    error: null,
    user: { id: "staff_1" },
    membership: { merchantId: "merchant_A" },
  });
  merchantFindUnique.mockResolvedValue({ id: "merchant_A", name: "Café Demo", city: "Lyon", postalCode: "69001" });
  estimateMerchantMembersAudience.mockResolvedValue({ estimatedRecipients: 12 });
  getQuotaUsage.mockResolvedValue(0);
  campaignUpdate.mockImplementation(async ({ data }: { data: Record<string, unknown> }) => ({
    ...baseCampaign,
    ...data,
  }));
});

describe("POST /api/merchant/campaigns/[id]/confirm — isolation & sécurité", () => {
  it("404 si la campagne appartient à un autre commerce (isolation stricte)", async () => {
    campaignFindFirst.mockResolvedValueOnce(null); // findFirst filtré par merchantId : jamais trouvée pour un autre commerçant
    const { POST } = await import("../src/app/api/merchant/campaigns/[id]/confirm/route");
    const response = await POST(req(), { params: Promise.resolve({ id: "camp_1" }) });
    expect(response.status).toBe(404);
    expect(campaignFindFirst).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: "camp_1", merchantId: "merchant_A" } }),
    );
  });

  it("refuse de reconfirmer une campagne déjà confirmée", async () => {
    campaignFindFirst.mockResolvedValueOnce({ ...baseCampaign, status: "SCHEDULED" });
    const { POST } = await import("../src/app/api/merchant/campaigns/[id]/confirm/route");
    const response = await POST(req(), { params: Promise.resolve({ id: "camp_1" }) });
    expect(response.status).toBe(409);
  });

  it("refuse un contenu vide", async () => {
    campaignFindFirst.mockResolvedValueOnce({ ...baseCampaign, title: "" });
    const { POST } = await import("../src/app/api/merchant/campaigns/[id]/confirm/route");
    const response = await POST(req(), { params: Promise.resolve({ id: "camp_1" }) });
    expect(response.status).toBe(400);
  });
});

describe("POST /api/merchant/campaigns/[id]/confirm — quota gratuit", () => {
  it("consomme le quota et programme directement, sans paiement", async () => {
    campaignFindFirst.mockResolvedValueOnce(baseCampaign);
    const { POST } = await import("../src/app/api/merchant/campaigns/[id]/confirm/route");
    const response = await POST(req(), { params: Promise.resolve({ id: "camp_1" }) });
    const payload = (await response.json()) as { requiresPayment: boolean };

    expect(response.status).toBe(200);
    expect(payload.requiresPayment).toBe(false);
    expect(createCampaignCheckoutSession).not.toHaveBeenCalled();
    expect(campaignUpdate).toHaveBeenCalledWith(
      expect.objectContaining({ data: expect.objectContaining({ status: "SCHEDULED", priceCents: 0 }) }),
    );
  });
});

describe("POST /api/merchant/campaigns/[id]/confirm — paiement requis", () => {
  it("réseau : toujours payant même sans consommation de quota membre, crée une session Stripe avec les métadonnées", async () => {
    campaignFindFirst.mockResolvedValueOnce({
      ...baseCampaign,
      audienceType: "NETWORK_LOCAL",
      quotaKind: "NETWORK_NOTIFICATION",
    });
    estimateNetworkLocalAudience.mockResolvedValueOnce({ estimatedRecipients: 40 });
    createCampaignCheckoutSession.mockResolvedValueOnce({ id: "cs_1", url: "https://checkout.stripe.test/cs_1" });

    const { POST } = await import("../src/app/api/merchant/campaigns/[id]/confirm/route");
    const response = await POST(req(), { params: Promise.resolve({ id: "camp_1" }) });
    const payload = (await response.json()) as { requiresPayment: boolean; checkoutUrl: string; amountCents: number };

    expect(response.status).toBe(200);
    expect(payload.requiresPayment).toBe(true);
    expect(payload.amountCents).toBe(1500);
    expect(createCampaignCheckoutSession).toHaveBeenCalledWith(
      expect.objectContaining({ campaignId: "camp_1", merchantId: "merchant_A", amountCents: 1500 }),
    );
    expect(campaignPaymentCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ status: "PENDING", stripeCheckoutSessionId: "cs_1", amountCents: 1500 }),
      }),
    );
  });

  it("le prix vient uniquement du serveur : un montant envoyé dans le body est ignoré", async () => {
    campaignFindFirst.mockResolvedValueOnce({
      ...baseCampaign,
      audienceType: "NETWORK_LOCAL",
      quotaKind: "NETWORK_NOTIFICATION",
    });
    estimateNetworkLocalAudience.mockResolvedValueOnce({ estimatedRecipients: 40 });
    createCampaignCheckoutSession.mockResolvedValueOnce({ id: "cs_2", url: "https://checkout.stripe.test/cs_2" });

    const { POST } = await import("../src/app/api/merchant/campaigns/[id]/confirm/route");
    await POST(req({ amountCents: 1 }), { params: Promise.resolve({ id: "camp_1" }) });

    expect(createCampaignCheckoutSession).toHaveBeenCalledWith(expect.objectContaining({ amountCents: 1500 }));
  });

  it("503 clair quand Stripe n'est pas configuré, sans écrire d'état payant en base", async () => {
    campaignFindFirst.mockResolvedValueOnce({
      ...baseCampaign,
      audienceType: "NETWORK_LOCAL",
      quotaKind: "NETWORK_NOTIFICATION",
    });
    estimateNetworkLocalAudience.mockResolvedValueOnce({ estimatedRecipients: 40 });
    createCampaignCheckoutSession.mockRejectedValueOnce(new FakeStripeNotConfiguredError());

    const { POST } = await import("../src/app/api/merchant/campaigns/[id]/confirm/route");
    const response = await POST(req(), { params: Promise.resolve({ id: "camp_1" }) });
    const payload = (await response.json()) as { code: string };

    expect(response.status).toBe(503);
    expect(payload.code).toBe("STRIPE_NOT_CONFIGURED");
    expect(campaignPaymentCreate).not.toHaveBeenCalled();
    expect(campaignUpdate).not.toHaveBeenCalled();
  });
});
