import { describe, expect, it } from "vitest";
import { LoyaltyError, applyAdjustment, applyEarnVisit, applyRedeemReward, computeLoyalty } from "../src/lib/loyalty";

describe("calcul des points et récompenses", () => {
  it("calcule la progression et la disponibilité", () => {
    expect(computeLoyalty(7, 10)).toEqual({
      points: 7,
      visitsRequired: 10,
      rewardAvailable: false,
      progressLabel: "7 / 10 passages",
    });
    expect(computeLoyalty(10, 10).rewardAvailable).toBe(true);
  });

  it("ajoute un passage", () => {
    const next = applyEarnVisit(7, 10);
    expect(next.points).toBe(8);
    expect(next.delta).toBe(1);
    expect(next.rewardAvailable).toBe(false);
  });

  it("débite X points lors d'une récompense", () => {
    const next = applyRedeemReward(10, 10);
    expect(next.points).toBe(0);
    expect(next.delta).toBe(-10);
    expect(next.rewardAvailable).toBe(false);
  });

  it("refuse une récompense si le seuil n'est pas atteint", () => {
    expect(() => applyRedeemReward(9, 10)).toThrow(LoyaltyError);
  });

  it("exige un motif pour un ajustement", () => {
    expect(() => applyAdjustment(5, 2, "", 10)).toThrow(/motif/);
    expect(applyAdjustment(5, -2, "erreur de caisse", 10).points).toBe(3);
  });
});
