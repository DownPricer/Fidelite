import { describe, expect, it } from "vitest";
import { LoyaltyMode } from "@prisma/client";
import { decideRewardRemoval, updateDraftRewardsForRemoval } from "@/lib/loyalty-reward-removal";

describe("loyalty reward removal", () => {
  it("supprime définitivement un avantage sans historique", () => {
    const decision = decideRewardRemoval({ transactions: 0, entitlements: 0 });
    const draft = {
      mode: "VISITS" as const,
      rewards: [
        { id: "reward-1", name: "Produit offert", isActive: true },
        { id: "reward-2", name: "Remise", isActive: true },
      ],
    };

    expect(decision.action).toBe("delete");
    expect(updateDraftRewardsForRemoval(draft, "reward-1", decision, "2026-09-22T00:00:00.000Z")).toEqual({
      mode: "VISITS",
      rewards: [{ id: "reward-2", name: "Remise", isActive: true }],
    });
  });

  it("archive un avantage qui a des transactions ou récompenses déjà attribuées", () => {
    const archivedAt = "2026-09-22T00:00:00.000Z";
    const transactionDecision = decideRewardRemoval({ transactions: 1, entitlements: 0 });
    const entitlementDecision = decideRewardRemoval({ transactions: 0, entitlements: 1 });
    const draft = {
      mode: LoyaltyMode.POINTS_BY_AMOUNT,
      rewards: [{ id: "reward-1", name: "Produit offert", isActive: true }],
    };

    expect(transactionDecision.action).toBe("archive");
    expect(entitlementDecision.action).toBe("archive");
    expect(updateDraftRewardsForRemoval(draft, "reward-1", transactionDecision, archivedAt)).toEqual({
      mode: LoyaltyMode.POINTS_BY_AMOUNT,
      rewards: [{ id: "reward-1", name: "Produit offert", isActive: false, archivedAt }],
    });
  });
});
