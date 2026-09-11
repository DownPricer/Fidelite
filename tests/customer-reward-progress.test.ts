import { describe, expect, it } from "vitest";
import {
  REWARD_ALMOST_THRESHOLD_PERCENT,
  type MerchantRewardProgressTarget,
} from "@/lib/customer-reward-progress-types";

function target(percent: number, unlocked = false): MerchantRewardProgressTarget {
  return {
    id: "r1",
    name: "Café offert",
    description: null,
    threshold: 30,
    current: Math.round((percent / 100) * 30),
    remaining: Math.max(0, 30 - Math.round((percent / 100) * 30)),
    percent,
    unit: "points",
    mode: "POINTS_BY_AMOUNT",
    visualState: unlocked ? "unlocked" : percent >= REWARD_ALMOST_THRESHOLD_PERCENT ? "almost" : "progress",
    statusHeadline: unlocked ? "Avantage débloqué" : percent >= REWARD_ALMOST_THRESHOLD_PERCENT ? "Bientôt débloqué" : "Prochain avantage",
    statusText: "test",
  };
}

describe("customer reward progress thresholds", () => {
  it("utilise 80 % comme seuil Bientôt débloqué", () => {
    expect(REWARD_ALMOST_THRESHOLD_PERCENT).toBe(80);
    expect(target(79).visualState).toBe("progress");
    expect(target(80).visualState).toBe("almost");
  });

  it("marque un avantage disponible comme débloqué", () => {
    expect(target(100, true).visualState).toBe("unlocked");
  });
});
