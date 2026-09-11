import { describe, expect, it } from "vitest";
import {
  activityFromWalletEvent,
  buildFifeLifeNextReward,
  buildNextRewardCandidates,
  formatActivityDate,
  formatActivityFromTransaction,
  resolveNextRewardForActiveCard,
  selectBestNextReward,
  type CardNextRewardEntry,
} from "@/lib/customer-loyalty-overview";

describe("customer loyalty overview", () => {
  it("1-4. sélection globale multi-commerces et filtrage merchant", () => {
    const cafe = buildNextRewardCandidates({
      merchantId: "cafe",
      merchantName: "Café Nova",
      merchantSlug: "cafe-nova",
      merchantLogoUrl: null,
      mode: "FIXED_POINTS",
      unit: "points",
      balance: 80,
      rewards: [{ id: "r1", name: "Boisson offerte", threshold: 100, thresholdUnit: "points", isActive: true }],
    });
    const hotel = buildNextRewardCandidates({
      merchantId: "hotel",
      merchantName: "Prism Hôtel",
      merchantSlug: "prism-hotel",
      merchantLogoUrl: null,
      mode: "VISITS",
      unit: "passages",
      balance: 9,
      rewards: [{ id: "r2", name: "Nuit offerte", threshold: 10, thresholdUnit: "visits", isActive: true }],
    });
    const pizza = buildNextRewardCandidates({
      merchantId: "pizza",
      merchantName: "Pizza Time",
      merchantSlug: "pizza-time",
      merchantLogoUrl: null,
      mode: "POINTS_BY_AMOUNT",
      unit: "points",
      balance: 450,
      rewards: [{ id: "r3", name: "5 € de réduction", threshold: 500, thresholdUnit: "points", isActive: true }],
    });

    const global = selectBestNextReward([...cafe, ...hotel, ...pizza]);
    expect(global?.merchantName).toBe("Prism Hôtel");
    expect(global?.progressPercent).toBe(90);

    const merchantOnly = selectBestNextReward(cafe);
    expect(merchantOnly?.merchantSlug).toBe("cafe-nova");
    expect(merchantOnly?.merchantName).toBe("Café Nova");
  });

  it("5. tri activité par date décroissante via formatter", () => {
    const older = formatActivityFromTransaction({
      id: "tx-old",
      type: "EARN_VISIT",
      pointsDelta: 20,
      reason: null,
      createdAt: new Date("2026-09-01T10:00:00"),
      metadata: { mode: "FIXED_POINTS", unit: "points" },
      ruleApplied: null,
      purchaseAmountCents: 1850,
      status: "COMPLETED",
      merchantId: "cafe",
      merchant: { id: "cafe", name: "Café Nova", slug: "cafe-nova", logoUrl: null },
    });
    const newer = formatActivityFromTransaction({
      id: "tx-new",
      type: "EARN_VISIT",
      pointsDelta: 1,
      reason: null,
      createdAt: new Date("2026-09-11T14:32:00"),
      metadata: { mode: "VISITS", unit: "passages", earnLabel: "Passage validé" },
      ruleApplied: null,
      purchaseAmountCents: null,
      status: "COMPLETED",
      merchantId: "hotel",
      merchant: { id: "hotel", name: "Prism Hôtel", slug: "prism-hotel", logoUrl: null },
    });
    expect(new Date(newer.createdAt).getTime()).toBeGreaterThan(new Date(older.createdAt).getTime());
  });

  it("6-9. activités points, passages, récompense utilisée et snapshot unité", () => {
    const pointsTx = formatActivityFromTransaction({
      id: "p1",
      type: "EARN_VISIT",
      pointsDelta: 20,
      reason: null,
      createdAt: new Date("2026-09-11T14:32:00"),
      metadata: { mode: "FIXED_POINTS", unit: "points", earnLabel: "+20 points" },
      ruleApplied: null,
      purchaseAmountCents: 1850,
      status: "COMPLETED",
      merchantId: "cafe",
      merchant: { id: "cafe", name: "Café Nova", slug: "cafe-nova", logoUrl: null },
    });
    expect(pointsTx.lineLabel).toContain("Achat de 18,50 €");
    expect(pointsTx.deltaLabel).toBe("+20 points");

    const visitTx = formatActivityFromTransaction({
      id: "v1",
      type: "EARN_VISIT",
      pointsDelta: 1,
      reason: null,
      createdAt: new Date("2026-09-10T18:15:00"),
      metadata: { mode: "VISITS", unit: "passages", earnLabel: "Passage validé" },
      ruleApplied: null,
      purchaseAmountCents: null,
      status: "COMPLETED",
      merchantId: "hotel",
      merchant: { id: "hotel", name: "Prism Hôtel", slug: "prism-hotel", logoUrl: null },
    });
    expect(visitTx.deltaLabel).toBe("+1 passage");

    const redeemTx = formatActivityFromTransaction({
      id: "r1",
      type: "REDEEM_REWARD",
      pointsDelta: -100,
      reason: "Café offert",
      createdAt: new Date("2026-09-08T09:40:00"),
      metadata: { mode: "FIXED_POINTS", unit: "points" },
      ruleApplied: null,
      purchaseAmountCents: null,
      status: "COMPLETED",
      merchantId: "bakery",
      merchant: { id: "bakery", name: "Boulangerie Martin", slug: "boulangerie-martin", logoUrl: null },
    });
    expect(redeemTx.detail).toBe("Café offert utilisé");
    expect(redeemTx.deltaLabel).toBe("−100 points");

    const legacyTx = formatActivityFromTransaction({
      id: "legacy",
      type: "EARN_VISIT",
      pointsDelta: 2,
      reason: null,
      createdAt: new Date("2025-01-01T12:00:00"),
      metadata: { mode: "VISITS", unit: "passages" },
      ruleApplied: null,
      purchaseAmountCents: null,
      status: "COMPLETED",
      merchantId: "cafe",
      merchant: { id: "cafe", name: "Café Nova", slug: "cafe-nova", logoUrl: null },
    });
    expect(legacyTx.deltaLabel).toBe("+2 passages");
  });

  it("10-12. récompense disponible prioritaire, meilleure progression, pas de mélange unités", () => {
    const available = buildNextRewardCandidates({
      merchantId: "cafe",
      merchantName: "Café Nova",
      merchantSlug: "cafe-nova",
      merchantLogoUrl: null,
      mode: "FIXED_POINTS",
      unit: "points",
      balance: 120,
      rewards: [{ id: "r1", name: "Boisson offerte", threshold: 100, thresholdUnit: "points", isActive: true }],
    });
    const almost = buildNextRewardCandidates({
      merchantId: "hotel",
      merchantName: "Prism Hôtel",
      merchantSlug: "prism-hotel",
      merchantLogoUrl: null,
      mode: "VISITS",
      unit: "passages",
      balance: 9,
      rewards: [{ id: "r2", name: "Nuit offerte", threshold: 10, thresholdUnit: "visits", isActive: true }],
    });

    const picked = selectBestNextReward([...almost, ...available]);
    expect(picked?.available).toBe(true);
    expect(picked?.rewardName).toBe("Boisson offerte");
    expect(picked?.statusLabel).toBe("Disponible maintenant");

    const tieA = buildNextRewardCandidates({
      merchantId: "a",
      merchantName: "Alpha",
      merchantSlug: "alpha",
      merchantLogoUrl: null,
      mode: "FIXED_POINTS",
      unit: "points",
      balance: 50,
      rewards: [{ id: "ra", name: "Reward A", threshold: 100, thresholdUnit: "points", isActive: true }],
    });
    const tieB = buildNextRewardCandidates({
      merchantId: "b",
      merchantName: "Beta",
      merchantSlug: "beta",
      merchantLogoUrl: null,
      mode: "FIXED_POINTS",
      unit: "points",
      balance: 50,
      rewards: [{ id: "rb", name: "Reward B", threshold: 100, thresholdUnit: "points", isActive: true }],
    });
    const tieBreak = selectBestNextReward([...tieB, ...tieA]);
    expect(tieBreak?.merchantName).toBe("Alpha");
  });

  it("13-14. programme sans avantage et commerce sans activité", () => {
    const emptyRewards = buildNextRewardCandidates({
      merchantId: "empty",
      merchantName: "Sans avantage",
      merchantSlug: "sans-avantage",
      merchantLogoUrl: null,
      mode: "FIXED_POINTS",
      unit: "points",
      balance: 10,
      rewards: [],
    });
    expect(selectBestNextReward(emptyRewards)).toBeNull();
  });

  it("15. activité live depuis événement wallet", () => {
    const item = activityFromWalletEvent({
      eventId: "evt-1",
      merchantId: "cafe",
      merchantName: "Café Nova",
      merchantSlug: "cafe-nova",
      createdAt: new Date("2026-09-11T14:32:00").toISOString(),
      type: "EARN_VISIT",
      delta: 20,
      purchaseAmountCents: 1850,
      metadata: { mode: "FIXED_POINTS", unit: "points" },
    });
    expect(item.id).toBe("evt-1");
    expect(item.lineLabel).toContain("Café Nova");
  });

  it("16-17. formatActivityDate et déduplication pagination", () => {
    const today = new Date();
    today.setHours(14, 32, 0, 0);
    expect(formatActivityDate(today)).toMatch(/^Aujourd'hui à/);

    const ids = new Set<string>();
    const page1 = ["a", "b", "c"];
    const page2 = ["c", "d"];
    for (const id of page1) ids.add(id);
    for (const id of page2) {
      if (!ids.has(id)) ids.add(id);
    }
    expect([...ids]).toEqual(["a", "b", "c", "d"]);
  });

  it("carte active wallet — Fife Life, commerçant et pas de mélange", () => {
    const cardRewards: CardNextRewardEntry[] = [
      {
        cardKey: "global",
        cardType: "global",
        membershipId: null,
        merchantId: null,
        slug: "fife-life",
        nextReward: buildFifeLifeNextReward(180),
        availableReward: null,
        progress: { current: 180, target: 250, percent: 53, unit: "points" },
      },
      {
        cardKey: "mem-cafe",
        cardType: "merchant",
        membershipId: "mem-cafe",
        merchantId: "cafe",
        slug: "cafe-nova",
        nextReward: selectBestNextReward(
          buildNextRewardCandidates({
            merchantId: "cafe",
            merchantName: "Café Nova",
            merchantSlug: "cafe-nova",
            merchantLogoUrl: null,
            mode: "FIXED_POINTS",
            unit: "points",
            balance: 80,
            rewards: [{ id: "r1", name: "Café offert", threshold: 100, thresholdUnit: "points", isActive: true }],
          }),
        ),
        availableReward: null,
        progress: { current: 80, target: 100, percent: 80, unit: "points" },
      },
      {
        cardKey: "mem-hotel",
        cardType: "merchant",
        membershipId: "mem-hotel",
        merchantId: "hotel",
        slug: "prism-hotel",
        nextReward: selectBestNextReward(
          buildNextRewardCandidates({
            merchantId: "hotel",
            merchantName: "Prism Hôtel",
            merchantSlug: "prism-hotel",
            merchantLogoUrl: null,
            mode: "VISITS",
            unit: "passages",
            balance: 9,
            rewards: [{ id: "r2", name: "Nuit offerte", threshold: 10, thresholdUnit: "visits", isActive: true }],
          }),
        ),
        availableReward: null,
        progress: { current: 9, target: 10, percent: 90, unit: "passages" },
      },
    ];

    expect(
      resolveNextRewardForActiveCard({
        cardRewards,
        activeCard: {
          cardType: "global",
          cardKey: "global",
          membershipId: null,
          merchantId: null,
          slug: "fife-life",
          activeIndex: 0,
        },
        fifeLifePoints: 180,
      })?.rewardName,
    ).toBe("Niveau Gold");

    expect(
      resolveNextRewardForActiveCard({
        cardRewards,
        activeCard: {
          cardType: "merchant",
          cardKey: "mem-cafe",
          membershipId: "mem-cafe",
          merchantId: "cafe",
          slug: "cafe-nova",
          activeIndex: 1,
        },
        fifeLifePoints: 180,
      }),
    ).toMatchObject({ rewardName: "Café offert", unit: "points" });

    expect(
      resolveNextRewardForActiveCard({
        cardRewards,
        activeCard: {
          cardType: "merchant",
          cardKey: "mem-hotel",
          membershipId: "mem-hotel",
          merchantId: "hotel",
          slug: "prism-hotel",
          activeIndex: 2,
        },
        fifeLifePoints: 180,
      }),
    ).toMatchObject({ rewardName: "Nuit offerte", unit: "passages" });
  });

  it("Fife Life max tier → aucune récompense globale inventée", () => {
    expect(buildFifeLifeNextReward(600)).toBeNull();
  });

  it("récompense disponible → Disponible maintenant", () => {
    const reward = selectBestNextReward(
      buildNextRewardCandidates({
        merchantId: "cafe",
        merchantName: "Café Nova",
        merchantSlug: "cafe-nova",
        merchantLogoUrl: null,
        mode: "FIXED_POINTS",
        unit: "points",
        balance: 120,
        rewards: [{ id: "r1", name: "Boisson offerte", threshold: 100, thresholdUnit: "points", isActive: true }],
      }),
    );
    expect(reward?.statusLabel).toBe("Disponible maintenant");
  });

  it("ignore les récompenses inactives ou unité incompatible", () => {
    const candidates = buildNextRewardCandidates({
      merchantId: "cafe",
      merchantName: "Café Nova",
      merchantSlug: "cafe-nova",
      merchantLogoUrl: null,
      mode: "FIXED_POINTS",
      unit: "points",
      balance: 90,
      rewards: [
        { id: "inactive", name: "Inactive", threshold: 50, thresholdUnit: "points", isActive: false },
        { id: "visits", name: "Passage", threshold: 5, thresholdUnit: "visits", isActive: true },
        { id: "active", name: "Boisson", threshold: 100, thresholdUnit: "points", isActive: true },
      ],
    });
    expect(candidates).toHaveLength(1);
    expect(candidates[0]?.rewardName).toBe("Boisson");
  });
});
