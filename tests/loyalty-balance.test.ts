import { describe, expect, it } from "vitest";
import { incrementBalanceData, loyaltyBalanceForMode } from "@/lib/loyalty-balance";

describe("soldes fidélité par unité", () => {
  it("lit le solde points pour POINTS_BY_AMOUNT et FIXED_POINTS", () => {
    const membership = { points: 99, pointsBalance: 5, visitsBalance: 2 };
    expect(loyaltyBalanceForMode(membership, "POINTS_BY_AMOUNT")).toBe(5);
    expect(loyaltyBalanceForMode(membership, "FIXED_POINTS")).toBe(5);
  });

  it("lit le solde passages pour VISITS et AMOUNT_TIERS sans réinterpréter les points", () => {
    const membership = { points: 5, pointsBalance: 5, visitsBalance: 0 };
    expect(loyaltyBalanceForMode(membership, "VISITS")).toBe(0);
    expect(loyaltyBalanceForMode(membership, "AMOUNT_TIERS")).toBe(0);
  });

  it("prépare une incrémentation limitée à l'unité active", () => {
    expect(incrementBalanceData("VISITS", 1)).toMatchObject({
      visitsBalance: { increment: 1 },
      points: { increment: 1 },
    });
    expect(incrementBalanceData("POINTS_BY_AMOUNT", 2)).toMatchObject({
      pointsBalance: { increment: 2 },
      points: { increment: 2 },
    });
  });
});
