import type { LoyaltyMode } from "@prisma/client";

export type LoyaltyRewardDraft = {
  mode?: LoyaltyMode;
  rules?: Record<string, unknown>;
  rewards?: Array<Record<string, unknown>>;
};

export type RewardRemovalDecision = {
  hasHistory: boolean;
  action: "delete" | "archive";
};

export function decideRewardRemoval(input: { transactions: number; entitlements: number }): RewardRemovalDecision {
  const hasHistory = input.transactions > 0 || input.entitlements > 0;
  return { hasHistory, action: hasHistory ? "archive" : "delete" };
}

export function updateDraftRewardsForRemoval(
  draft: LoyaltyRewardDraft | null,
  rewardId: string,
  decision: RewardRemovalDecision,
  archivedAtIso: string,
) {
  if (!draft?.rewards?.some((item) => item.id === rewardId)) return null;
  return {
    ...draft,
    rewards:
      decision.action === "archive"
        ? draft.rewards.map((item) =>
            item.id === rewardId ? { ...item, archivedAt: archivedAtIso, isActive: false } : item,
          )
        : draft.rewards.filter((item) => item.id !== rewardId),
  };
}
