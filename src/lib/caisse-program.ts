import type { LoyaltyMode, LoyaltyProgram, LoyaltyReward } from "@prisma/client";
import { LoyaltyError } from "./loyalty";
import {
  computeEarn,
  legacyRewardLabel,
  legacyVisitsRequired,
  nextReward,
  programToConfig,
  type ProgramRules,
  unitLabel,
} from "./loyalty-program";
import { prisma } from "./prisma";

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
  const config = programToConfig(program);
  const threshold = legacyVisitsRequired(program);
  const rewardLabel = legacyRewardLabel(program);
  const unit = unitLabel(config.mode);
  const rewardAvailable = points >= threshold;
  const upcoming = nextReward(config.rewards, points, config.mode);

  let progressLabel: string;
  if (config.mode === "VISITS" || config.mode === "AMOUNT_TIERS") {
    progressLabel = `${points} / ${threshold} passages`;
  } else {
    progressLabel = `${points} ${unit}`;
  }

  const requirePurchaseAmount =
    config.mode === "POINTS_BY_AMOUNT" ||
    config.mode === "AMOUNT_TIERS" ||
    Boolean(config.rules.requirePurchaseAmount);

  let earnPreviewLabel = "+1 passage";
  if (config.mode === "VISITS") {
    const n = config.rules.visitsPerScan ?? 1;
    earnPreviewLabel = n === 1 ? "+1 passage" : `+${n} passages`;
  } else if (config.mode === "FIXED_POINTS") {
    earnPreviewLabel = `+${config.rules.fixedPointsPerPurchase ?? 0} points`;
  } else if (config.mode === "POINTS_BY_AMOUNT") {
    earnPreviewLabel = "Ajouter les points";
  } else if (config.mode === "AMOUNT_TIERS") {
    earnPreviewLabel = "Valider l'achat";
  }

  return {
    mode: config.mode,
    points,
    threshold,
    rewardLabel,
    rewardAvailable,
    progressLabel,
    unitLabel: unit,
    requirePurchaseAmount,
    earnPreviewLabel,
    nextRewardLabel: upcoming ? `Encore ${Math.max(0, upcoming.threshold - points)} ${unit} avant « ${upcoming.name} »` : null,
  };
}

export function publicScanPayload(input: {
  grantId: string;
  firstName: string;
  program: LoyaltyProgram & { rewards?: LoyaltyReward[] };
  points: number;
  expiresAt: string;
  cardJustCreated?: boolean;
}) {
  const snapshot = buildProgramSnapshot(input.points, input.program);
  return {
    grantId: input.grantId,
    firstName: input.firstName,
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
  };
}

export async function assertEarnProgramRules(input: {
  customerMembershipId: string;
  merchantId: string;
  mode: LoyaltyMode;
  rules: ProgramRules;
  purchaseAmount?: number;
}) {
  const minInterval =
    input.mode === "FIXED_POINTS"
      ? input.rules.minIntervalFixed ?? 0
      : input.rules.minIntervalMinutes ?? 0;

  if (minInterval > 0) {
    const last = await prisma.loyaltyTransaction.findFirst({
      where: {
        customerMembershipId: input.customerMembershipId,
        merchantId: input.merchantId,
        type: "EARN_VISIT",
        status: "COMPLETED",
      },
      orderBy: { createdAt: "desc" },
    });
    if (last && Date.now() - last.createdAt.getTime() < minInterval * 60_000) {
      throw new LoyaltyError(`Attendez ${minInterval} min entre deux passages.`);
    }
  }

  const maxPerDay = input.rules.maxPerDay ?? input.rules.maxPointsPerDay ?? 0;
  if (maxPerDay > 0) {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const count = await prisma.loyaltyTransaction.count({
      where: {
        customerMembershipId: input.customerMembershipId,
        merchantId: input.merchantId,
        type: "EARN_VISIT",
        status: "COMPLETED",
        createdAt: { gte: start },
      },
    });
    if (count >= maxPerDay) {
      throw new LoyaltyError("Limite quotidienne atteinte pour ce client.");
    }
  }

  if (
    (input.mode === "POINTS_BY_AMOUNT" || input.mode === "AMOUNT_TIERS") &&
    (input.purchaseAmount === undefined || input.purchaseAmount <= 0)
  ) {
    throw new LoyaltyError("Indiquez le montant de l'achat.");
  }

  const minPurchase = input.rules.minPurchase ?? 0;
  if (minPurchase > 0 && (input.purchaseAmount ?? 0) < minPurchase) {
    throw new LoyaltyError(`Montant minimum : ${minPurchase.toFixed(2)} €.`);
  }

  const earned = computeEarn(input.mode, input.rules, input.purchaseAmount ?? 0);
  if (earned <= 0) {
    throw new LoyaltyError("Aucun gain applicable pour cette transaction.");
  }
}

export function sanitizeEarnResponse(result: {
  firstName: string;
  points: number;
  visitsRequired: number;
  rewardLabel: string;
  snapshot: { progressLabel: string; rewardAvailable: boolean };
}) {
  return {
    firstName: result.firstName,
    points: result.points,
    visitsRequired: result.visitsRequired,
    rewardLabel: result.rewardLabel,
    snapshot: {
      progressLabel: result.snapshot.progressLabel,
      rewardAvailable: result.snapshot.rewardAvailable,
    },
  };
}
