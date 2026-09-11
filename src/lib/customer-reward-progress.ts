import type { LoyaltyMode } from "@prisma/client";
import { getActiveMerchantLoyaltyContext } from "./loyalty-context";
import { evaluateCustomerRewards } from "./loyalty-commit";
import { formatUnitCount, loyaltyUnitForMode, type LoyaltyUnit } from "./loyalty-labels";
import { nextReward, programToConfig } from "./loyalty-program";
import { prisma } from "./prisma";
import type { EvaluatedReward } from "./loyalty-rewards";
import {
  REWARD_ALMOST_THRESHOLD_PERCENT,
  type CustomerMerchantRewardProgress,
  type MerchantRewardProgressTarget,
  type RewardProgressVisualState,
} from "./customer-reward-progress-types";

export {
  REWARD_ALMOST_THRESHOLD_PERCENT,
  type CustomerMerchantRewardProgress,
  type MerchantRewardProgressTarget,
  type RewardProgressVisualState,
} from "./customer-reward-progress-types";
export { progressLineForTarget } from "./customer-reward-progress-view";

function resolveVisualState(percent: number, unlocked: boolean): RewardProgressVisualState {
  if (unlocked) return "unlocked";
  if (percent >= REWARD_ALMOST_THRESHOLD_PERCENT) return "almost";
  return "progress";
}

function buildTargetView(input: {
  reward: EvaluatedReward;
  balance: number;
  mode: LoyaltyMode;
  unit: LoyaltyUnit;
  merchantName: string;
}): MerchantRewardProgressTarget {
  const threshold = input.reward.threshold;
  const current = input.balance;
  const remaining = Math.max(0, threshold - current);
  const percent =
    threshold > 0 ? Math.min(100, Math.round((current / threshold) * 100)) : current >= threshold ? 100 : 0;
  const unlocked = input.reward.available;
  const visualState = resolveVisualState(percent, unlocked);
  const unitLabel = input.unit;

  let statusHeadline = "Prochain avantage";
  let statusText = `Encore ${formatUnitCount(remaining, unitLabel)} avant votre prochain avantage`;

  if (visualState === "almost") {
    statusHeadline = "Bientôt débloqué";
    statusText =
      unitLabel === "passages"
        ? `Plus que ${remaining} passage${remaining > 1 ? "s" : ""} !`
        : `Plus que ${remaining} point${remaining > 1 ? "s" : ""} !`;
  } else if (visualState === "unlocked") {
    statusHeadline = "Avantage débloqué";
    statusText = `Vous pouvez maintenant obtenir ${input.reward.name.toLowerCase()}.`;
  }

  return {
    id: input.reward.id,
    name: input.reward.name,
    description: input.reward.description,
    threshold,
    current,
    remaining,
    percent,
    unit: input.unit,
    mode: input.mode,
    visualState,
    statusHeadline,
    statusText,
  };
}

export async function getCustomerMerchantRewardProgress(input: {
  userId: string;
  merchantSlug?: string;
  merchantId?: string;
}): Promise<CustomerMerchantRewardProgress | null> {
  let merchantId = input.merchantId;
  if (!merchantId && input.merchantSlug) {
    const merchant = await prisma.merchant.findFirst({
      where: { slug: input.merchantSlug, isActive: true },
      select: { id: true, name: true, slug: true },
    });
    if (!merchant) return null;
    merchantId = merchant.id;
  }
  if (!merchantId) return null;

  const membership = await prisma.customerMembership.findFirst({
    where: { userId: input.userId, merchantId, removedAt: null, merchant: { isActive: true } },
    select: { id: true, points: true, merchant: { select: { id: true, name: true, slug: true } } },
  });
  if (!membership) return null;

  const context = await getActiveMerchantLoyaltyContext(merchantId);
  if (!context?.isOperational) return null;

  const config = programToConfig(context.program, { activeOnly: true, filterByMode: true });
  const evaluated = await evaluateCustomerRewards({
    config,
    balance: membership.points,
    merchantName: membership.merchant.name,
    customerMembershipId: membership.id,
    merchantId,
    grantCreatedAt: new Date(0),
  });

  const unit = loyaltyUnitForMode(context.mode);
  const availableRewards = evaluated.filter((reward) => reward.available);
  const locked = evaluated.filter((reward) => !reward.available && reward.status !== "Expiré" && reward.status !== "Utilisé");
  const upcomingConfig = nextReward(config.rewards, membership.points, context.mode);
  const nextEvaluated =
    upcomingConfig != null
      ? evaluated.find((reward) => reward.id === upcomingConfig.id) ??
        locked.find((reward) => reward.id === upcomingConfig.id) ??
        null
      : null;

  const nextTarget = nextEvaluated
    ? buildTargetView({
        reward: nextEvaluated,
        balance: membership.points,
        mode: context.mode,
        unit,
        merchantName: membership.merchant.name,
      })
    : availableRewards.length > 0
      ? buildTargetView({
          reward: availableRewards[0]!,
          balance: membership.points,
          mode: context.mode,
          unit,
          merchantName: membership.merchant.name,
        })
      : null;

  const upcomingRewards = locked.filter(
    (reward) => reward.status === "Bientôt disponible" || reward.status === "En attente",
  );
  const laterRewards = locked.filter((reward) => !upcomingRewards.some((row) => row.id === reward.id));

  return {
    merchantId: membership.merchant.id,
    merchantName: membership.merchant.name,
    merchantSlug: membership.merchant.slug,
    balance: membership.points,
    mode: context.mode,
    unit,
    nextTarget,
    availableRewards,
    upcomingRewards,
    laterRewards,
  };
}
