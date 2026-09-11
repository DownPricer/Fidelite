import type { LoyaltyMode, LoyaltyProgram, LoyaltyReward } from "@prisma/client";
import { LoyaltyError } from "./loyalty";
import {
  evaluateEarn,
  isPurchaseAmountRequired,
  type NextBenefitView,
} from "./loyalty-engine";
import {
  buildCustomerProgramView,
  progressTargetForBalance,
  type ActiveMerchantLoyaltyContext,
} from "./loyalty-context";
import {
  balanceLabel,
  earnActionLabel,
  earnGainLabel,
  progressBalanceLabel,
  rewardThresholdLabel,
} from "./loyalty-labels";
import { programToConfig, type ProgramRules } from "./loyalty-program";
import { eurosToCents } from "./money";
import { prisma } from "./prisma";
import type { EvaluatedReward } from "./loyalty-rewards";

export type CaisseProgramSnapshot = {
  mode: LoyaltyMode;
  points: number;
  threshold: number;
  rewardLabel: string;
  rewardAvailable: boolean;
  progressLabel: string;
  unitLabel: string;
  requirePurchaseAmount: boolean;
  earnPreviewLabel: string;
  nextRewardLabel: string | null;
};

export function buildProgramSnapshot(
  points: number,
  program: LoyaltyProgram & { rewards?: LoyaltyReward[] },
): CaisseProgramSnapshot {
  const config = programToConfig(program, { activeOnly: true, filterByMode: true });
  const threshold = progressTargetForBalance(config, points);
  const primaryReward = config.rewards[0] ?? null;
  const rewardLabel = primaryReward?.name ?? "Avantage";
  const unit = config.mode === "VISITS" || config.mode === "AMOUNT_TIERS" ? "passages" : "points";
  const upcoming = config.rewards.find((reward) => reward.isActive && points < reward.threshold) ?? null;

  return {
    mode: config.mode,
    points,
    threshold,
    rewardLabel,
    rewardAvailable: config.rewards.some((reward) => reward.isActive && points >= reward.threshold),
    progressLabel: progressBalanceLabel(config.mode, points, threshold),
    unitLabel: unit,
    requirePurchaseAmount: isPurchaseAmountRequired(config.mode, config.rules),
    earnPreviewLabel: earnActionLabel(config.mode),
    nextRewardLabel: upcoming
      ? `Encore ${Math.max(0, upcoming.threshold - points)} ${unit} avant « ${upcoming.name} »`
      : null,
  };
}

export function buildProgramSnapshotFromContext(
  points: number,
  context: ActiveMerchantLoyaltyContext,
): CaisseProgramSnapshot {
  const view = buildCustomerProgramView(context, points);
  const primaryReward = context.rewards[0] ?? null;
  const fixedPreview =
    context.mode === "FIXED_POINTS"
      ? earnGainLabel(context.mode, context.config.rules.fixedPointsPerPurchase ?? 0)
      : earnActionLabel(context.mode);

  return {
    mode: context.mode,
    points,
    threshold: view.progressTarget,
    rewardLabel: primaryReward?.name ?? "Avantage",
    rewardAvailable: context.rewards.some((reward) => reward.isActive && points >= reward.threshold),
    progressLabel: progressBalanceLabel(context.mode, points, view.progressTarget),
    unitLabel: context.unit,
    requirePurchaseAmount: isPurchaseAmountRequired(context.mode, context.config.rules),
    earnPreviewLabel: fixedPreview,
    nextRewardLabel: view.upcomingRewardName
      ? `Encore ${view.upcomingRemaining ?? 0} ${context.unit} avant « ${view.upcomingRewardName} »`
      : null,
  };
}

export function publicScanPayload(input: {
  grantId: string;
  firstName: string;
  lastName?: string | null;
  context: ActiveMerchantLoyaltyContext;
  points: number;
  expiresAt: string;
  cardJustCreated?: boolean;
  rewards?: EvaluatedReward[];
  nextBenefit?: NextBenefitView | null;
}) {
  const snapshot = buildProgramSnapshotFromContext(input.points, input.context);
  const lastName = input.lastName ?? "";
  return {
    grantId: input.grantId,
    firstName: input.firstName,
    lastName,
    customerName: [input.firstName, lastName].filter(Boolean).join(" ").trim(),
    points: snapshot.points,
    visitsRequired: snapshot.threshold,
    rewardLabel: snapshot.rewardLabel,
    rewardAvailable: snapshot.rewardAvailable,
    progressLabel: snapshot.progressLabel,
    expiresAt: input.expiresAt,
    cardJustCreated: input.cardJustCreated ?? false,
    programMode: snapshot.mode,
    unitLabel: snapshot.unitLabel,
    requirePurchaseAmount: snapshot.requirePurchaseAmount,
    earnPreviewLabel: snapshot.earnPreviewLabel,
    nextRewardLabel: snapshot.nextRewardLabel,
    rewards: input.rewards ?? [],
    nextBenefit: input.nextBenefit ?? null,
    programTitle: input.context.programTitle,
    programDescription: input.context.programDescription,
    minimumPurchaseLabel: input.context.minimumPurchaseLabel,
    balanceLabel: balanceLabel(input.context.mode, input.points),
    configuredRewards: input.context.rewards.map((reward) => ({
      id: reward.id,
      name: reward.name,
      threshold: reward.threshold,
      thresholdLabel: rewardThresholdLabel(
        reward.threshold,
        reward.thresholdUnit === "points" ? "points" : "passages",
        reward.name,
      ),
    })),
  };
}

export async function assertEarnProgramRules(input: {
  customerMembershipId: string;
  merchantId: string;
  mode: LoyaltyMode;
  rules: ProgramRules;
  purchaseAmount?: number;
  purchaseAmountCents?: number;
}) {
  const cents =
    input.purchaseAmountCents ??
    (input.purchaseAmount !== undefined ? eurosToCents(input.purchaseAmount) : undefined);

  const early = evaluateEarn({
    mode: input.mode,
    rules: input.rules,
    currentBalance: 0,
    purchaseAmountCents: cents,
    history: { lastEarnAt: null, earnCountToday: 0, pointsEarnedToday: 0 },
  });
  if (
    !early.ok &&
    (early.block?.code === "amount_required" ||
      early.block?.code === "min_purchase" ||
      early.block?.code === "no_earn" ||
      early.block?.code === "no_tier" ||
      early.block?.code === "tiers_invalid")
  ) {
    throw new LoyaltyError(
      [early.block?.title, ...(early.block?.details.length ? early.block.details : [early.block?.message ?? ""])]
        .filter(Boolean)
        .join("\n"),
    );
  }

  const last = await prisma.loyaltyTransaction.findFirst({
    where: {
      customerMembershipId: input.customerMembershipId,
      merchantId: input.merchantId,
      type: "EARN_VISIT",
      status: "COMPLETED",
    },
    orderBy: { createdAt: "desc" },
  });
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const today = await prisma.loyaltyTransaction.findMany({
    where: {
      customerMembershipId: input.customerMembershipId,
      merchantId: input.merchantId,
      type: "EARN_VISIT",
      status: "COMPLETED",
      createdAt: { gte: start },
    },
    select: { pointsDelta: true },
  });

  const evaluation = evaluateEarn({
    mode: input.mode,
    rules: input.rules,
    currentBalance: 0,
    purchaseAmountCents: cents,
    history: {
      lastEarnAt: last?.createdAt ?? null,
      earnCountToday: today.length,
      pointsEarnedToday: today.reduce((sum, tx) => sum + Math.max(0, tx.pointsDelta), 0),
    },
  });
  if (!evaluation.ok) {
    throw new LoyaltyError(
      [evaluation.block?.title, ...(evaluation.block?.details.length ? evaluation.block.details : [evaluation.block?.message ?? ""])]
        .filter(Boolean)
        .join("\n"),
    );
  }
}

export function sanitizeEarnResponse(result: {
  firstName: string;
  lastName?: string;
  points: number;
  visitsRequired: number;
  rewardLabel: string;
  snapshot: { progressLabel: string; rewardAvailable: boolean };
}) {
  return {
    firstName: result.firstName,
    lastName: result.lastName ?? "",
    points: result.points,
    visitsRequired: result.visitsRequired,
    rewardLabel: result.rewardLabel,
    snapshot: {
      progressLabel: result.snapshot.progressLabel,
      rewardAvailable: result.snapshot.rewardAvailable,
    },
  };
}
