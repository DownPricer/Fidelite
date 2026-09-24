import { beforeEach, describe, expect, it, vi } from "vitest";

const campaignQuotaUsageUpsert = vi.fn();
const executeRaw = vi.fn();
const campaignQuotaUsageFindUnique = vi.fn();
const merchantSubscriptionFindUnique = vi.fn();

vi.mock("../src/lib/prisma", () => ({
  prisma: {
    campaignQuotaUsage: {
      findUnique: (...args: unknown[]) => campaignQuotaUsageFindUnique(...args),
    },
    merchantSubscription: {
      findUnique: (...args: unknown[]) => merchantSubscriptionFindUnique(...args),
    },
  },
}));

const {
  INCLUDED_QUOTAS,
  CAMPAIGN_PRICE_CENTS,
  includedQuotaFor,
  isNetworkQuotaKind,
  calendarPeriodKeyEuropeParis,
  resolveQuotaPeriodKey,
  tryConsumeIncludedQuota,
  refundIncludedQuota,
  getQuotaUsage,
  resolvePlanTier,
} = await import("../src/lib/campaign-quota");

function fakeTx() {
  return {
    campaignQuotaUsage: { upsert: (...args: unknown[]) => campaignQuotaUsageUpsert(...args) },
    $executeRaw: (...args: unknown[]) => executeRaw(...args),
  } as never;
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe("quotas inclus (Partie 8)", () => {
  it("Fidelo normal : 1 notification + 1 e-mail, rien d'autre inclus", () => {
    expect(INCLUDED_QUOTAS.normal).toEqual({ MEMBER_NOTIFICATION: 1, MEMBER_EMAIL: 1 });
  });

  it("Fidelo Insight : 3 notifications + 3 e-mails (pas dix) + 3 jours sponsorisés", () => {
    expect(INCLUDED_QUOTAS.insight).toEqual({
      MEMBER_NOTIFICATION: 3,
      MEMBER_EMAIL: 3,
      SPONSORED_DAY: 3,
    });
  });

  it("les campagnes réseau ne sont jamais incluses, même avec Insight", () => {
    expect(includedQuotaFor("insight", "NETWORK_NOTIFICATION")).toBe(0);
    expect(includedQuotaFor("insight", "NETWORK_EMAIL")).toBe(0);
    expect(includedQuotaFor("normal", "NETWORK_NOTIFICATION")).toBe(0);
    expect(isNetworkQuotaKind("NETWORK_NOTIFICATION")).toBe(true);
    expect(isNetworkQuotaKind("NETWORK_EMAIL")).toBe(true);
    expect(isNetworkQuotaKind("MEMBER_EMAIL")).toBe(false);
  });

  it("tarifs exacts en centimes (Partie 8)", () => {
    expect(CAMPAIGN_PRICE_CENTS).toEqual({
      MEMBER_NOTIFICATION: 99,
      MEMBER_EMAIL: 50,
      NETWORK_NOTIFICATION: 199,
      NETWORK_EMAIL: 120,
      SPONSORED_AD_PER_DAY: 500,
    });
  });
});

describe("période de quota (Europe/Paris)", () => {
  it("calcule le mois calendaire Europe/Paris même proche de minuit UTC", () => {
    // 2026-01-31T23:30:00Z = 2026-02-01T00:30 en Europe/Paris (hiver, UTC+1)
    expect(calendarPeriodKeyEuropeParis(new Date("2026-01-31T23:30:00.000Z"))).toBe("2026-02");
  });

  it("utilise la période d'abonnement quand elle existe, sinon le mois calendaire", () => {
    const subStart = new Date("2026-03-15T00:00:00.000Z");
    expect(
      resolveQuotaPeriodKey({ now: new Date("2026-03-20T00:00:00.000Z"), subscriptionPeriodStart: subStart }),
    ).toBe("sub-2026-03-15");
    expect(resolveQuotaPeriodKey({ now: new Date("2026-03-20T00:00:00.000Z") })).toBe("2026-03");
  });
});

describe("consommation atomique des quotas", () => {
  it("consomme un crédit quand la limite n'est pas atteinte", async () => {
    executeRaw.mockResolvedValueOnce(1);
    const ok = await tryConsumeIncludedQuota(fakeTx(), {
      merchantId: "m1",
      kind: "MEMBER_NOTIFICATION",
      periodKey: "2026-09",
      limit: 1,
    });
    expect(ok).toBe(true);
    expect(campaignQuotaUsageUpsert).toHaveBeenCalledTimes(1);
    expect(executeRaw).toHaveBeenCalledTimes(1);
  });

  it("refuse (sans lever) quand la limite est déjà consommée", async () => {
    executeRaw.mockResolvedValueOnce(0);
    const ok = await tryConsumeIncludedQuota(fakeTx(), {
      merchantId: "m1",
      kind: "MEMBER_NOTIFICATION",
      periodKey: "2026-09",
      limit: 1,
    });
    expect(ok).toBe(false);
  });

  it("refuse immédiatement sans requête quand la limite est 0 (ex. quota réseau)", async () => {
    const ok = await tryConsumeIncludedQuota(fakeTx(), {
      merchantId: "m1",
      kind: "NETWORK_NOTIFICATION",
      periodKey: "2026-09",
      limit: 0,
    });
    expect(ok).toBe(false);
    expect(campaignQuotaUsageUpsert).not.toHaveBeenCalled();
    expect(executeRaw).not.toHaveBeenCalled();
  });

  it("le remboursement ne descend jamais sous 0 (GREATEST(0, count-1))", async () => {
    await refundIncludedQuota(fakeTx(), { merchantId: "m1", kind: "MEMBER_EMAIL", periodKey: "2026-09" });
    expect(executeRaw).toHaveBeenCalledTimes(1);
    const sql = String(executeRaw.mock.calls[0]?.[0]);
    expect(sql).toContain("GREATEST(0,");
  });
});

describe("lecture du forfait et de la consommation", () => {
  it("normal par défaut quand insightEnabled est false ou l'abonnement absent", async () => {
    merchantSubscriptionFindUnique.mockResolvedValueOnce({ insightEnabled: false });
    expect(await resolvePlanTier("m1")).toBe("normal");
    merchantSubscriptionFindUnique.mockResolvedValueOnce(null);
    expect(await resolvePlanTier("m1")).toBe("normal");
  });

  it("insight quand insightEnabled est true", async () => {
    merchantSubscriptionFindUnique.mockResolvedValueOnce({ insightEnabled: true });
    expect(await resolvePlanTier("m1")).toBe("insight");
  });

  it("getQuotaUsage renvoie 0 quand aucune ligne n'existe encore", async () => {
    campaignQuotaUsageFindUnique.mockResolvedValueOnce(null);
    expect(await getQuotaUsage({ merchantId: "m1", kind: "MEMBER_EMAIL", periodKey: "2026-09" })).toBe(0);
  });
});
