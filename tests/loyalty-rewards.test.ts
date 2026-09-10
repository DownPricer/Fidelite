import { describe, expect, it } from "vitest";
import { evaluateReward } from "../src/lib/loyalty-rewards";
import type { RewardConfig } from "../src/lib/loyalty-program";

const reward: RewardConfig = {
  id: "r1",
  name: "Boisson offerte",
  description: "Une boisson au choix",
  rewardType: "FREE_PRODUCT",
  threshold: 10,
  thresholdUnit: "visits",
  isActive: true,
  sortOrder: 0,
  minPurchase: 12,
  maxUsesPerCustomer: 1,
  reuseDelayDays: 7,
  globalLimit: 5,
  validFrom: "2026-01-01T00:00:00.000Z",
  validUntil: "2026-12-31T23:59:59.000Z",
};

const usage = {
  customerUseCount: 0,
  lastRedeemAt: null,
  globalUseCount: 0,
  redeemsInCurrentGrant: 0,
};

describe("avantages", () => {
  it("est disponible si toutes les conditions sont respectées", () => {
    const result = evaluateReward({
      reward,
      mode: "VISITS",
      balance: 10,
      merchantName: "Café Demo",
      purchaseAmountCents: 1500,
      usage,
      now: new Date("2026-09-10T10:00:00.000Z"),
    });
    expect(result.available).toBe(true);
    expect(result.status).toBe("Disponible");
  });

  it("reste bientôt disponible si le solde est insuffisant", () => {
    const result = evaluateReward({
      reward,
      mode: "VISITS",
      balance: 7,
      merchantName: "Café Demo",
      purchaseAmountCents: 1500,
      usage,
      now: new Date("2026-09-10T10:00:00.000Z"),
    });
    expect(result.status).toBe("Bientôt disponible");
    expect(result.reason).toMatch(/3 passages/);
  });

  it("expire après la date de fin", () => {
    const result = evaluateReward({
      reward,
      mode: "VISITS",
      balance: 10,
      merchantName: "Café Demo",
      purchaseAmountCents: 1500,
      usage,
      now: new Date("2027-01-02T10:00:00.000Z"),
    });
    expect(result.status).toBe("Expiré");
  });

  it("marque utilisé si la limite client est atteinte", () => {
    const result = evaluateReward({
      reward,
      mode: "VISITS",
      balance: 10,
      merchantName: "Café Demo",
      purchaseAmountCents: 1500,
      usage: { ...usage, customerUseCount: 1 },
      now: new Date("2026-09-10T10:00:00.000Z"),
    });
    expect(result.status).toBe("Utilisé");
  });

  it("refuse un stock épuisé", () => {
    const result = evaluateReward({
      reward,
      mode: "VISITS",
      balance: 10,
      merchantName: "Café Demo",
      purchaseAmountCents: 1500,
      usage: { ...usage, globalUseCount: 5 },
      now: new Date("2026-09-10T10:00:00.000Z"),
    });
    expect(result.status).toBe("Indisponible");
    expect(result.reason).toMatch(/Stock épuisé/);
  });

  it("empêche une double utilisation sur la même visite", () => {
    const result = evaluateReward({
      reward,
      mode: "VISITS",
      balance: 20,
      merchantName: "Café Demo",
      purchaseAmountCents: 1500,
      usage: { ...usage, redeemsInCurrentGrant: 1 },
      now: new Date("2026-09-10T10:00:00.000Z"),
      rawConditions: { stackable: false },
    });
    expect(result.available).toBe(false);
    expect(result.reason).toMatch(/cumulables/);
  });

  it("reste en attente avant la date de début", () => {
    const result = evaluateReward({
      reward: { ...reward, validFrom: "2026-10-01T00:00:00.000Z" },
      mode: "VISITS",
      balance: 10,
      merchantName: "Café Demo",
      purchaseAmountCents: 1500,
      usage,
      now: new Date("2026-09-10T10:00:00.000Z"),
    });
    expect(result.status).toBe("En attente");
  });
});
