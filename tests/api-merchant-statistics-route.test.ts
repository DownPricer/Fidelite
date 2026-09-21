import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

const requireMerchantStatsAccess = vi.fn();
const getFreeMerchantStats = vi.fn();
const getInsightPremium = vi.fn();
const getLockedInsightPlaceholder = vi.fn();
const findUniqueSubscription = vi.fn();

vi.mock("@/lib/api-guard", () => ({
  requireMerchantStatsAccess,
}));

vi.mock("@/lib/insight-stats", () => ({
  getFreeMerchantStats,
  getInsightPremium,
  getLockedInsightPlaceholder,
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    merchantSubscription: { findUnique: findUniqueSubscription },
  },
}));

const REAL_PLACEHOLDER = { overview: { activeClients: 128, returningClients: 64, visits: 342, changePct: 12 } };
const REAL_PREMIUM = { overview: { totalClients: { current: 42, previous: 40, changePct: 5 } } };
const FREE_STATS = { totalClients: 42, activeClients30d: 10, newClientsThisWeek: 2, passagesThisWeek: 5, scansValidatedThisWeek: 6, passagesSeries: [], revenue: null };

function makeGet(query = "period=30d") {
  return new NextRequest(`http://localhost:3000/api/merchant/statistics?${query}`, { method: "GET" });
}

describe("GET /api/merchant/statistics", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getFreeMerchantStats.mockResolvedValue(FREE_STATS);
    getInsightPremium.mockResolvedValue(REAL_PREMIUM);
    getLockedInsightPlaceholder.mockReturnValue(REAL_PLACEHOLDER);
  });

  it("refuse l'accès à un employé sans la permission viewStatistics", async () => {
    requireMerchantStatsAccess.mockResolvedValue({ error: new Response(JSON.stringify({ error: "Accès refusé." }), { status: 403 }) });

    const { GET } = await import("../src/app/api/merchant/statistics/route");
    const response = await GET(makeGet());

    expect(response.status).toBe(403);
    expect(getFreeMerchantStats).not.toHaveBeenCalled();
  });

  it("ne renvoie que les statistiques gratuites et des placeholders quand Insight n'est pas activé", async () => {
    requireMerchantStatsAccess.mockResolvedValue({
      error: null,
      user: { id: "u1" },
      membership: { merchantId: "merchant_1" },
    });
    findUniqueSubscription.mockResolvedValue({ insightEnabled: false });

    const { GET } = await import("../src/app/api/merchant/statistics/route");
    const response = await GET(makeGet());
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.locked).toBe(true);
    expect(payload.premium).toBeNull();
    expect(payload.previewPlaceholder).toEqual(REAL_PLACEHOLDER);
    expect(payload.free).toEqual(FREE_STATS);
    // Aucune vraie donnée premium ne doit jamais être calculée pour un commerce non abonné.
    expect(getInsightPremium).not.toHaveBeenCalled();
  });

  it("renvoie les statistiques premium réelles pour un commerce avec Insight activé", async () => {
    requireMerchantStatsAccess.mockResolvedValue({
      error: null,
      user: { id: "u1" },
      membership: { merchantId: "merchant_1" },
    });
    findUniqueSubscription.mockResolvedValue({ insightEnabled: true });

    const { GET } = await import("../src/app/api/merchant/statistics/route");
    const response = await GET(makeGet());
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.locked).toBe(false);
    expect(payload.premium).toEqual(REAL_PREMIUM);
    expect(payload.previewPlaceholder).toBeNull();
  });

  it("isole les commerces : le merchantId vient toujours de la session, jamais de la query", async () => {
    requireMerchantStatsAccess.mockResolvedValue({
      error: null,
      user: { id: "u1" },
      membership: { merchantId: "merchant_1" },
    });
    findUniqueSubscription.mockResolvedValue({ insightEnabled: true });

    const { GET } = await import("../src/app/api/merchant/statistics/route");
    await GET(makeGet("period=30d&merchantId=merchant_evil"));

    expect(getFreeMerchantStats).toHaveBeenCalledWith("merchant_1", expect.anything());
    expect(getInsightPremium).toHaveBeenCalledWith("merchant_1", expect.anything());
  });
});
