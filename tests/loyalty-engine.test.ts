import { describe, expect, it } from "vitest";
import {
  buildNextBenefit,
  centsToEarnAtLeast,
  evaluateEarn,
  remainingPurchasesToReward,
} from "../src/lib/loyalty-engine";
import { DEFAULT_RULES, computeEarnFromCents } from "../src/lib/loyalty-program";

const emptyHistory = { lastEarnAt: null, earnCountToday: 0, pointsEarnedToday: 0 };

describe("passages VISITS", () => {
  const rules = { ...DEFAULT_RULES.VISITS, minPurchase: 15, minIntervalMinutes: 10, maxPerDay: 2 };

  it("accepte un montant suffisant", () => {
    const result = evaluateEarn({
      mode: "VISITS",
      rules,
      currentBalance: 6,
      purchaseAmountCents: 1800,
      history: emptyHistory,
    });
    expect(result.ok).toBe(true);
    expect(result.earned).toBe(1);
    expect(result.newBalance).toBe(7);
  });

  it("refuse un montant insuffisant avec le détail", () => {
    const result = evaluateEarn({
      mode: "VISITS",
      rules,
      currentBalance: 6,
      purchaseAmountCents: 1000,
      history: emptyHistory,
    });
    expect(result.ok).toBe(false);
    expect(result.block?.title).toBe("Montant insuffisant");
    expect(result.block?.details.join(" ")).toMatch(/15,00/);
    expect(result.block?.details.join(" ")).toMatch(/10,00/);
    expect(result.block?.details.join(" ")).toMatch(/5,00/);
  });

  it("refuse le délai minimum", () => {
    const result = evaluateEarn({
      mode: "VISITS",
      rules,
      currentBalance: 6,
      purchaseAmountCents: 1800,
      history: { ...emptyHistory, lastEarnAt: new Date("2026-09-10T10:00:00.000Z") },
      now: new Date("2026-09-10T10:04:00.000Z"),
    });
    expect(result.ok).toBe(false);
    expect(result.block?.details.join(" ")).toMatch(/4 minute/);
    expect(result.block?.details.join(" ")).toMatch(/6 minute/);
  });

  it("refuse la limite quotidienne", () => {
    const result = evaluateEarn({
      mode: "VISITS",
      rules,
      currentBalance: 6,
      purchaseAmountCents: 1800,
      history: { lastEarnAt: null, earnCountToday: 2, pointsEarnedToday: 2 },
    });
    expect(result.ok).toBe(false);
    expect(result.block?.message).toMatch(/2 passages maximum/);
  });

  it("refuse une seconde validation déjà enregistrée via le même historique immédiat", () => {
    const first = evaluateEarn({
      mode: "VISITS",
      rules: DEFAULT_RULES.VISITS,
      currentBalance: 6,
      history: emptyHistory,
    });
    const second = evaluateEarn({
      mode: "VISITS",
      rules: { ...DEFAULT_RULES.VISITS, minIntervalMinutes: 5 },
      currentBalance: 7,
      history: { lastEarnAt: new Date(), earnCountToday: 1, pointsEarnedToday: 1 },
    });
    expect(first.ok).toBe(true);
    expect(second.ok).toBe(false);
  });
});

describe("points selon le montant", () => {
  const rules = {
    ...DEFAULT_RULES.POINTS_BY_AMOUNT,
    pointsPerAmount: 1,
    amountForPoints: 1,
    rounding: "floor" as const,
    minPurchase: 10,
    maxPointsPerTx: 40,
    maxPointsPerDay: 50,
  };

  it("calcule le gain normal", () => {
    expect(computeEarnFromCents("POINTS_BY_AMOUNT", rules, 2800).earned).toBe(28);
    const result = evaluateEarn({
      mode: "POINTS_BY_AMOUNT",
      rules,
      currentBalance: 452,
      purchaseAmountCents: 2800,
      history: emptyHistory,
    });
    expect(result.ok).toBe(true);
    expect(result.earned).toBe(28);
    expect(result.newBalance).toBe(480);
  });

  it("arrondit à l'inférieur", () => {
    expect(computeEarnFromCents("POINTS_BY_AMOUNT", { ...rules, rounding: "floor" }, 1250).earned).toBe(12);
  });

  it("arrondit au plus proche", () => {
    expect(computeEarnFromCents("POINTS_BY_AMOUNT", { ...rules, rounding: "round" }, 1250).earned).toBe(13);
  });

  it("refuse le minimum d'achat", () => {
    const result = evaluateEarn({
      mode: "POINTS_BY_AMOUNT",
      rules,
      currentBalance: 0,
      purchaseAmountCents: 500,
      history: emptyHistory,
    });
    expect(result.ok).toBe(false);
    expect(result.block?.code).toBe("min_purchase");
  });

  it("respecte le maximum par transaction", () => {
    expect(computeEarnFromCents("POINTS_BY_AMOUNT", rules, 8000).earned).toBe(40);
  });

  it("respecte le maximum quotidien", () => {
    const result = evaluateEarn({
      mode: "POINTS_BY_AMOUNT",
      rules,
      currentBalance: 0,
      purchaseAmountCents: 2800,
      history: { lastEarnAt: null, earnCountToday: 1, pointsEarnedToday: 50 },
    });
    expect(result.ok).toBe(false);
    expect(result.block?.message).toMatch(/50 points maximum/);
  });
});

describe("points fixes", () => {
  const rules = { ...DEFAULT_RULES.FIXED_POINTS, fixedPointsPerPurchase: 20, minPurchase: 10, minIntervalFixed: 30, maxPerDay: 3 };

  it("crédite le gain fixe", () => {
    const result = evaluateEarn({
      mode: "FIXED_POINTS",
      rules,
      currentBalance: 40,
      purchaseAmountCents: 1500,
      history: emptyHistory,
    });
    expect(result.ok).toBe(true);
    expect(result.earned).toBe(20);
  });

  it("vérifie le montant minimum et le délai", () => {
    expect(
      evaluateEarn({
        mode: "FIXED_POINTS",
        rules,
        currentBalance: 0,
        purchaseAmountCents: 500,
        history: emptyHistory,
      }).ok,
    ).toBe(false);
    expect(
      evaluateEarn({
        mode: "FIXED_POINTS",
        rules,
        currentBalance: 0,
        purchaseAmountCents: 1500,
        history: { lastEarnAt: new Date(Date.now() - 5 * 60_000), earnCountToday: 0, pointsEarnedToday: 0 },
      }).ok,
    ).toBe(false);
  });

  it("estime exactement le nombre d'achats restants", () => {
    expect(remainingPurchasesToReward("FIXED_POINTS", rules, 60, 20)).toBe(3);
    const next = buildNextBenefit(
      [{ id: "r1", name: "5 € de réduction", threshold: 100, thresholdUnit: "points", rewardType: "FIXED_DISCOUNT", isActive: true, sortOrder: 0 }],
      40,
      "FIXED_POINTS",
      rules,
      20,
    );
    expect(next?.remainingPurchases).toBe(3);
  });
});

describe("paliers de montant", () => {
  const rules = { ...DEFAULT_RULES.AMOUNT_TIERS };

  it("applique chaque palier et la limite exacte", () => {
    expect(computeEarnFromCents("AMOUNT_TIERS", rules, 1999).earned).toBe(1);
    expect(computeEarnFromCents("AMOUNT_TIERS", rules, 2000).earned).toBe(2);
    expect(computeEarnFromCents("AMOUNT_TIERS", rules, 4999).earned).toBe(2);
    expect(computeEarnFromCents("AMOUNT_TIERS", rules, 4200).earned).toBe(2);
    expect(computeEarnFromCents("AMOUNT_TIERS", rules, 5000).earned).toBe(3);
  });

  it("refuse un montant hors palier", () => {
    const result = evaluateEarn({
      mode: "AMOUNT_TIERS",
      rules: {
        ...rules,
        amountTiers: [{ id: "t1", minAmount: 10, maxAmount: 19.99, earnValue: 1 }],
      },
      currentBalance: 0,
      purchaseAmountCents: 500,
      history: emptyHistory,
    });
    expect(result.ok).toBe(false);
    expect(result.block?.code).toBe("no_tier");
  });

  it("refuse une configuration avec trou ou chevauchement", () => {
    const result = evaluateEarn({
      mode: "AMOUNT_TIERS",
      rules: {
        ...rules,
        amountTiers: [
          { id: "t1", minAmount: 10, maxAmount: 19.99, earnValue: 1 },
          { id: "t2", minAmount: 30, maxAmount: null, earnValue: 2 },
        ],
      },
      currentBalance: 0,
      purchaseAmountCents: 2500,
      history: emptyHistory,
    });
    expect(result.ok).toBe(false);
    expect(result.block?.code).toBe("tiers_invalid");
  });

  it("annonce le palier suivant", () => {
    const result = evaluateEarn({
      mode: "AMOUNT_TIERS",
      rules,
      currentBalance: 0,
      purchaseAmountCents: 4200,
      history: emptyHistory,
    });
    expect(result.ok).toBe(true);
    expect(result.nextTierHint).toMatch(/8,00/);
    expect(result.ruleApplied).toMatch(/20,00/);
  });
});

describe("sécurité du moteur", () => {
  it("refuse un commerce inactif et un programme inactif", () => {
    expect(
      evaluateEarn({
        mode: "VISITS",
        rules: DEFAULT_RULES.VISITS,
        currentBalance: 0,
        history: emptyHistory,
        merchantActive: false,
      }).block?.code,
    ).toBe("merchant_inactive");
    expect(
      evaluateEarn({
        mode: "VISITS",
        rules: DEFAULT_RULES.VISITS,
        currentBalance: 0,
        history: emptyHistory,
        programActive: false,
      }).block?.code,
    ).toBe("program_inactive");
  });
});

describe("estimations", () => {
  it("calcule un équivalent euros exact pour les points au taux", () => {
    expect(centsToEarnAtLeast(10, { pointsPerAmount: 1, amountForPoints: 1, rounding: "floor" })).toBe(1000);
  });

  it("n'estime pas en euros si le plafond transactionnel empêche un calcul sûr", () => {
    expect(centsToEarnAtLeast(50, { pointsPerAmount: 1, amountForPoints: 1, maxPointsPerTx: 20, rounding: "floor" })).toBeNull();
  });
});
