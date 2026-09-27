import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

const requireMutatingRequest = vi.fn();
const requireMerchantAdmin = vi.fn();
const campaignFindFirst = vi.fn();
const merchantFindUnique = vi.fn();
const campaignUpdate = vi.fn();
const campaignUpdateMany = vi.fn();
const debitForCampaign = vi.fn();
const getMarketingBalanceCents = vi.fn();
const writeAudit = vi.fn();
const estimateMerchantMembersAudience = vi.fn();
const estimateNetworkLocalAudience = vi.fn();
const getQuotaUsage = vi.fn();
const rateLimit = vi.fn(() => ({ ok: true as const, remaining: 1 }));

vi.mock("@/lib/api-guard", () => ({ requireMutatingRequest, requireMerchantAdmin }));
vi.mock("@/lib/audit", () => ({ writeAudit }));
const stripeMode = { active: "TEST" as "TEST" | "LIVE", allowed: true, configured: true };
vi.mock("@/lib/stripe-mode", () => ({
  getActiveStripeMode: () => stripeMode.active,
  isPaymentAllowedForMerchant: () => stripeMode.allowed,
  isStripeConfigured: () => stripeMode.configured,
}));
vi.mock("@/lib/marketing-balance", () => ({
  debitForCampaign: (...args: unknown[]) => debitForCampaign(...args),
  getMarketingBalanceCents: (...args: unknown[]) => getMarketingBalanceCents(...args),
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
    campaign: {
      update: (...args: unknown[]) => campaignUpdate(...args),
      updateMany: (...args: unknown[]) => campaignUpdateMany(...args),
    },
    campaignQuotaUsage: { upsert: vi.fn() },
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
  stripeMode.active = "TEST";
  stripeMode.allowed = true;
  stripeMode.configured = true;
  requireMutatingRequest.mockResolvedValue({ error: null });
  requireMerchantAdmin.mockResolvedValue({
    error: null,
    user: { id: "staff_1" },
    membership: { merchantId: "merchant_A" },
  });
  merchantFindUnique.mockResolvedValue({ id: "merchant_A", name: "Café Demo", city: "Lyon", postalCode: "69001" });
  estimateMerchantMembersAudience.mockResolvedValue({ estimatedRecipients: 12 });
  getQuotaUsage.mockResolvedValue(0);
  getMarketingBalanceCents.mockResolvedValue(1000);
  campaignUpdateMany.mockResolvedValue({ count: 1 });
  debitForCampaign.mockResolvedValue({ ok: true, balanceAfterCents: 801 });
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
    expect(debitForCampaign).not.toHaveBeenCalled(); // couvert par le quota : jamais facturé
    expect(campaignUpdate).toHaveBeenCalledWith(
      expect.objectContaining({ data: expect.objectContaining({ status: "SCHEDULED", priceCents: 0 }) }),
    );
  });
});

const paidMemberCampaign = { ...baseCampaign };

describe("POST /api/merchant/campaigns/[id]/confirm — solde marketing", () => {
  it("réseau (notification secteur) : débite exactement 1,99 € et envoie en modération", async () => {
    campaignFindFirst.mockResolvedValueOnce({
      ...baseCampaign,
      audienceType: "NETWORK_LOCAL",
      quotaKind: "NETWORK_NOTIFICATION",
    });
    estimateNetworkLocalAudience.mockResolvedValueOnce({ estimatedRecipients: 40 });

    const { POST } = await import("../src/app/api/merchant/campaigns/[id]/confirm/route");
    const response = await POST(req(), { params: Promise.resolve({ id: "camp_1" }) });
    const payload = (await response.json()) as { requiresPayment: boolean; amountCents: number };

    expect(response.status).toBe(200);
    expect(payload).toMatchObject({ requiresPayment: true, amountCents: 199 });
    expect(debitForCampaign).toHaveBeenCalledTimes(1);
    expect(debitForCampaign).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ merchantId: "merchant_A", mode: "TEST", campaignId: "camp_1", amountCents: 199 }),
    );
    expect(getMarketingBalanceCents).toHaveBeenCalledWith("merchant_A", "TEST");
    expect(campaignUpdateMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: "camp_1", status: "DRAFT" },
        data: expect.objectContaining({ status: "PENDING_REVIEW", priceCents: 199, fundingMode: "TEST" }),
      }),
    );
  });

  it("e-mail prospects : 1,20 € ; e-mail membres hors quota : 0,50 € ; notification membres hors quota : 0,99 €", async () => {
    const { POST } = await import("../src/app/api/merchant/campaigns/[id]/confirm/route");
    const cases = [
      { channel: "EMAIL", audienceType: "NETWORK_LOCAL", quotaKind: "NETWORK_EMAIL", expected: 120 },
      { channel: "EMAIL", audienceType: "MERCHANT_MEMBERS", quotaKind: "MEMBER_EMAIL", expected: 50 },
      { channel: "IN_APP_PUSH", audienceType: "MERCHANT_MEMBERS", quotaKind: "MEMBER_NOTIFICATION", expected: 99 },
    ] as const;
    for (const c of cases) {
      debitForCampaign.mockClear();
      getQuotaUsage.mockResolvedValue(1); // quota gratuit du forfait normal (1) épuisé
      estimateNetworkLocalAudience.mockResolvedValue({ estimatedRecipients: 5 });
      campaignFindFirst.mockResolvedValueOnce({ ...paidMemberCampaign, ...c });
      const response = await POST(req(), { params: Promise.resolve({ id: "camp_1" }) });
      expect(response.status).toBe(200);
      expect(debitForCampaign).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({ amountCents: c.expected }),
      );
    }
  });

  it("solde insuffisant : 402, aucune campagne confirmée, aucun audit de confirmation", async () => {
    campaignFindFirst.mockResolvedValueOnce({
      ...baseCampaign,
      audienceType: "NETWORK_LOCAL",
      quotaKind: "NETWORK_NOTIFICATION",
    });
    estimateNetworkLocalAudience.mockResolvedValueOnce({ estimatedRecipients: 40 });
    getMarketingBalanceCents.mockResolvedValue(100);
    debitForCampaign.mockResolvedValueOnce({ ok: false });

    const { POST } = await import("../src/app/api/merchant/campaigns/[id]/confirm/route");
    const response = await POST(req(), { params: Promise.resolve({ id: "camp_1" }) });
    const payload = (await response.json()) as { code: string; requiredCents: number };

    expect(response.status).toBe(402);
    expect(payload.code).toBe("INSUFFICIENT_BALANCE");
    expect(payload.requiredCents).toBe(199);
    expect(writeAudit).not.toHaveBeenCalled();
  });

  it("confirmation rejouée/concurrente : un seul débit (la réclamation DRAFT échoue → 409, pas de débit)", async () => {
    campaignFindFirst.mockResolvedValueOnce({
      ...baseCampaign,
      audienceType: "NETWORK_LOCAL",
      quotaKind: "NETWORK_NOTIFICATION",
    });
    estimateNetworkLocalAudience.mockResolvedValueOnce({ estimatedRecipients: 40 });
    campaignUpdateMany.mockResolvedValueOnce({ count: 0 });

    const { POST } = await import("../src/app/api/merchant/campaigns/[id]/confirm/route");
    const response = await POST(req(), { params: Promise.resolve({ id: "camp_1" }) });

    expect(response.status).toBe(409);
    expect(debitForCampaign).not.toHaveBeenCalled();
  });

  it("le prix et l'audience viennent uniquement du serveur : montant et audience du body ignorés", async () => {
    campaignFindFirst.mockResolvedValueOnce({
      ...baseCampaign,
      audienceType: "NETWORK_LOCAL",
      quotaKind: "NETWORK_NOTIFICATION",
    });
    estimateNetworkLocalAudience.mockResolvedValueOnce({ estimatedRecipients: 40 });

    const { POST } = await import("../src/app/api/merchant/campaigns/[id]/confirm/route");
    await POST(req({ amountCents: 1, audienceType: "MERCHANT_MEMBERS", estimatedRecipients: 99999 }), {
      params: Promise.resolve({ id: "camp_1" }),
    });

    expect(debitForCampaign).toHaveBeenCalledWith(expect.anything(), expect.objectContaining({ amountCents: 199 }));
    expect(estimateNetworkLocalAudience).toHaveBeenCalledWith(
      expect.objectContaining({ id: "merchant_A" }),
      "IN_APP_PUSH",
    );
    expect(campaignUpdateMany).toHaveBeenCalledWith(
      expect.objectContaining({ data: expect.objectContaining({ estimatedRecipients: 40 }) }),
    );
  });

  it("mode réel : le solde et le débit sont ceux du mode LIVE, la campagne est marquée LIVE", async () => {
    stripeMode.active = "LIVE";
    campaignFindFirst.mockResolvedValueOnce({ ...baseCampaign, audienceType: "NETWORK_LOCAL", quotaKind: "NETWORK_NOTIFICATION" });
    estimateNetworkLocalAudience.mockResolvedValueOnce({ estimatedRecipients: 40 });

    const { POST } = await import("../src/app/api/merchant/campaigns/[id]/confirm/route");
    const response = await POST(req(), { params: Promise.resolve({ id: "camp_1" }) });

    expect(response.status).toBe(200);
    expect(getMarketingBalanceCents).toHaveBeenCalledWith("merchant_A", "LIVE");
    expect(debitForCampaign).toHaveBeenCalledWith(expect.anything(), expect.objectContaining({ mode: "LIVE", amountCents: 199 }));
    expect(campaignUpdateMany).toHaveBeenCalledWith(
      expect.objectContaining({ data: expect.objectContaining({ fundingMode: "LIVE" }) }),
    );
  });

  it("mode test : un commerce non autorisé ne peut pas obtenir de campagne payée (403, aucun débit)", async () => {
    stripeMode.allowed = false;
    campaignFindFirst.mockResolvedValueOnce({ ...baseCampaign, audienceType: "NETWORK_LOCAL", quotaKind: "NETWORK_NOTIFICATION" });
    estimateNetworkLocalAudience.mockResolvedValueOnce({ estimatedRecipients: 40 });

    const { POST } = await import("../src/app/api/merchant/campaigns/[id]/confirm/route");
    const response = await POST(req(), { params: Promise.resolve({ id: "camp_1" }) });
    const payload = (await response.json()) as { code: string };

    expect(response.status).toBe(403);
    expect(payload.code).toBe("TEST_MODE_RESTRICTED");
    expect(debitForCampaign).not.toHaveBeenCalled();
    expect(campaignUpdateMany).not.toHaveBeenCalled();
  });

  it("mode test : le quota gratuit reste utilisable par tous les commerces (comportement existant)", async () => {
    stripeMode.allowed = false;
    campaignFindFirst.mockResolvedValueOnce(baseCampaign);
    const { POST } = await import("../src/app/api/merchant/campaigns/[id]/confirm/route");
    const response = await POST(req(), { params: Promise.resolve({ id: "camp_1" }) });
    expect(response.status).toBe(200);
    expect(campaignUpdate).toHaveBeenCalledWith(
      expect.objectContaining({ data: expect.objectContaining({ status: "SCHEDULED", priceCents: 0 }) }),
    );
    expect(campaignUpdate.mock.calls[0][0].data.fundingMode).toBeUndefined();
  });

  it("mode test : le commerce de test autorisé ne diffuse jamais réellement, même via le quota gratuit", async () => {
    // stripeMode.allowed reste true (valeur par défaut de beforeEach) : ce commerce EST le commerce
    // de test. Sa campagne « gratuite » doit être marquée fundingMode: TEST pour que le worker la
    // simule au lieu d'envoyer une vraie notification/e-mail (voir campaign-worker.ts).
    campaignFindFirst.mockResolvedValueOnce(baseCampaign);
    const { POST } = await import("../src/app/api/merchant/campaigns/[id]/confirm/route");
    const response = await POST(req(), { params: Promise.resolve({ id: "camp_1" }) });
    expect(response.status).toBe(200);
    expect(campaignUpdate).toHaveBeenCalledWith(
      expect.objectContaining({ data: expect.objectContaining({ status: "SCHEDULED", priceCents: 0, fundingMode: "TEST" }) }),
    );
  });

  it("mode réel : le quota gratuit ne marque jamais fundingMode (diffusion réelle normale)", async () => {
    stripeMode.active = "LIVE";
    campaignFindFirst.mockResolvedValueOnce(baseCampaign);
    const { POST } = await import("../src/app/api/merchant/campaigns/[id]/confirm/route");
    const response = await POST(req(), { params: Promise.resolve({ id: "camp_1" }) });
    expect(response.status).toBe(200);
    expect(campaignUpdate.mock.calls[0][0].data.fundingMode).toBeUndefined();
  });
});
