import type { LoyaltyMode } from "@prisma/client";
import type { LoyaltyUnit } from "./loyalty-labels";
import type { EvaluatedReward } from "./loyalty-rewards";

export const REWARD_ALMOST_THRESHOLD_PERCENT = 80;

export type RewardProgressVisualState = "empty" | "progress" | "almost" | "unlocked";

export type MerchantRewardProgressTarget = {
  id: string;
  name: string;
  description: string | null;
  threshold: number;
  current: number;
  remaining: number;
  percent: number;
  unit: LoyaltyUnit;
  mode: LoyaltyMode;
  visualState: RewardProgressVisualState;
  statusHeadline: string;
  statusText: string;
};

export type CustomerMerchantRewardProgress = {
  merchantId: string;
  merchantName: string;
  merchantSlug: string;
  balance: number;
  mode: LoyaltyMode;
  unit: LoyaltyUnit;
  nextTarget: MerchantRewardProgressTarget | null;
  availableRewards: EvaluatedReward[];
  upcomingRewards: EvaluatedReward[];
  laterRewards: EvaluatedReward[];
};
