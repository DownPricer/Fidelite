import { Prisma, type LoyaltyMode, type LoyaltyProgram, type LoyaltyReward } from "@prisma/client";
import { buildCustomerProgramView, getActiveMerchantLoyaltyContext } from "./loyalty-context";
import { rewardFromDb, thresholdUnitForMode, type RewardConfig } from "./loyalty-program";
import {
  normalizeResolvedPublishedTemplate,
  resolvePublishedMerchantCardTemplate,
} from "./merchant-card-template-service";

export const MAX_CONFIGURED_REWARDS = 10;
export const REWARD_LIMIT_MESSAGE = "Vous avez atteint la limite de 10 avantages pour ce programme.";

export type LoyaltyDraftReward = Omit<RewardConfig, "id" | "thresholdUnit"> & {
  id?: string;
  thresholdUnit: string;
};

export type LoyaltyProgramDraft = {
  mode: LoyaltyMode;
  rules: Record<string, unknown>;
  rewards: LoyaltyDraftReward[];
};

export type ModeChangeDecision =
  | { action: "ARCHIVE_OLD" }
  | { action: "CONVERT"; rewards: LoyaltyDraftReward[] };

type ProgramWithRewards = LoyaltyProgram & { rewards: LoyaltyReward[] };

export function countConfiguredRewards(
  rewards: Array<{ archivedAt?: string | Date | null; thresholdUnit?: string }>,
  mode?: LoyaltyMode,
) {
  const unit = mode ? thresholdUnitForMode(mode) : null;
  return rewards.filter((reward) => !reward.archivedAt && (!unit || reward.thresholdUnit === unit)).length;
}

export function assertRewardLimit(
  rewards: Array<{ archivedAt?: string | Date | null; thresholdUnit?: string }>,
  mode?: LoyaltyMode,
) {
  if (countConfiguredRewards(rewards, mode) > MAX_CONFIGURED_REWARDS) {
    throw new Error(REWARD_LIMIT_MESSAGE);
  }
}

export function modeChangeRequiresRewardDecision(previousMode: LoyaltyMode, nextMode: LoyaltyMode) {
  return previousMode !== nextMode;
}

export function convertLoyaltyBalance(input: {
  oldBalance: number;
  oldThreshold: number;
  newThreshold: number;
}) {
  if (!Number.isFinite(input.oldBalance) || !Number.isFinite(input.oldThreshold) || !Number.isFinite(input.newThreshold)) {
    throw new Error("Les valeurs de conversion doivent être des nombres finis.");
  }
  const oldBalance = Math.max(0, Math.trunc(input.oldBalance));
  const oldThreshold = Math.trunc(input.oldThreshold);
  const newThreshold = Math.max(0, Math.trunc(input.newThreshold));
  if (oldThreshold <= 0) {
    throw new Error("Le seuil d'origine doit être strictement positif.");
  }
  if (newThreshold <= 0 || oldBalance === 0) return 0;
  return Math.max(0, Math.ceil((oldBalance / oldThreshold) * newThreshold));
}

function buildConversionMappings(program: ProgramWithRewards, rewards: LoyaltyDraftReward[]) {
  const byId = new Map(program.rewards.map((reward) => [reward.id, reward]));
  const mappings = rewards
    .map((reward) => {
      const oldReward = reward.id ? byId.get(reward.id) : undefined;
      if (!oldReward) return null;
      return { oldReward, newReward: reward };
    })
    .filter((row): row is NonNullable<typeof row> => Boolean(row))
    .sort((a, b) => a.oldReward.threshold - b.oldReward.threshold);

  for (let i = 1; i < mappings.length; i += 1) {
    const prev = mappings[i - 1]!;
    const current = mappings[i]!;
    if (current.newReward.threshold <= prev.newReward.threshold) {
      throw new Error("Les nouveaux seuils doivent conserver l'ordre croissant des anciens avantages.");
    }
  }
  return mappings;
}

function conversionReference(
  mappings: ReturnType<typeof buildConversionMappings>,
  oldBalance: number,
) {
  return (
    mappings.find((mapping) => mapping.oldReward.threshold > oldBalance) ??
    mappings[mappings.length - 1] ??
    null
  );
}

function activeEligibleRewards(program: ProgramWithRewards, now: Date) {
  const unit = thresholdUnitForMode(program.mode);
  return program.rewards.filter((reward) => {
    if (reward.archivedAt || !reward.isActive) return false;
    if (reward.thresholdUnit !== unit) return false;
    if (reward.validFrom && reward.validFrom > now) return false;
    if (reward.validUntil && reward.validUntil < now) return false;
    return true;
  });
}

export async function createAcquiredRewardEntitlements(
  tx: Prisma.TransactionClient,
  input: {
    program: ProgramWithRewards;
    merchantId: string;
    now: Date;
  },
) {
  const rewards = activeEligibleRewards(input.program, input.now);
  if (!rewards.length) return 0;

  const memberships = await tx.customerMembership.findMany({
    where: {
      merchantId: input.merchantId,
      removedAt: null,
      points: { gte: Math.min(...rewards.map((reward) => reward.threshold)) },
    },
    select: { id: true, points: true },
  });

  let created = 0;
  for (const membership of memberships) {
    for (const reward of rewards) {
      if (membership.points < reward.threshold) continue;
      await tx.customerRewardEntitlement.upsert({
        where: {
          customerMembershipId_originalRewardId_originalProgramVersion: {
            customerMembershipId: membership.id,
            originalRewardId: reward.id,
            originalProgramVersion: input.program.version,
          },
        },
        update: {},
        create: {
          customerMembershipId: membership.id,
          merchantId: input.merchantId,
          originalRewardId: reward.id,
          originalRewardName: reward.name,
          originalDescription: reward.description,
          originalMode: input.program.mode,
          originalUnit: thresholdUnitForMode(input.program.mode),
          originalThreshold: reward.threshold,
          historicalBalance: membership.points,
          originalProgramId: input.program.id,
          originalProgramVersion: input.program.version,
          acquiredAt: input.now,
          expiresAt: reward.validUntil,
          status: "AVAILABLE",
          metadata: {
            rewardType: reward.rewardType,
            value: reward.value,
            minPurchase: reward.minPurchase,
            maxDiscount: reward.maxDiscount,
            maxUsesPerCustomer: reward.maxUsesPerCustomer,
            reuseDelayDays: reward.reuseDelayDays,
            globalLimit: reward.globalLimit,
            conditions: reward.conditions ?? null,
          },
        },
      });
      created += 1;
    }
  }
  return created;
}

function rewardData(programId: string, reward: LoyaltyDraftReward, sortOrder: number) {
  return {
    programId,
    name: reward.name,
    description: reward.description,
    rewardType: (reward.rewardType as "CUSTOM") ?? "CUSTOM",
    threshold: reward.threshold,
    thresholdUnit: reward.thresholdUnit,
    value: reward.value,
    minPurchase: reward.minPurchase,
    maxDiscount: reward.maxDiscount,
    isActive: reward.isActive ?? true,
    sortOrder: reward.sortOrder ?? sortOrder,
    validFrom: reward.validFrom ? new Date(reward.validFrom) : null,
    validUntil: reward.validUntil ? new Date(reward.validUntil) : null,
    maxUsesPerCustomer: reward.maxUsesPerCustomer,
    reuseDelayDays: reward.reuseDelayDays,
    globalLimit: reward.globalLimit,
    archivedAt: reward.archivedAt ? new Date(reward.archivedAt) : null,
  };
}

async function publishRewardsWithoutModeChange(
  tx: Prisma.TransactionClient,
  program: ProgramWithRewards,
  rewards: LoyaltyDraftReward[],
) {
  const knownIds = new Set(program.rewards.map((reward) => reward.id));
  for (const [i, reward] of rewards.entries()) {
    if (reward.id && knownIds.has(reward.id)) {
      await tx.loyaltyReward.update({
        where: { id: reward.id },
        data: rewardData(program.id, reward, i),
      });
    } else {
      await tx.loyaltyReward.create({ data: rewardData(program.id, reward, i) });
    }
  }
}

async function publishRewardsAfterModeChange(
  tx: Prisma.TransactionClient,
  program: ProgramWithRewards,
  decision: ModeChangeDecision,
  _fallbackRewards: LoyaltyDraftReward[],
  now: Date,
) {
  await tx.loyaltyReward.updateMany({
    where: { programId: program.id, archivedAt: null },
    data: { archivedAt: now, isActive: false },
  });

  const rewards = decision.action === "CONVERT" ? decision.rewards : [];
  for (const [i, reward] of rewards.entries()) {
    await tx.loyaltyReward.create({
      data: rewardData(program.id, { ...reward, id: undefined }, i),
    });
  }
}

export async function publishLoyaltyProgram(input: {
  tx: Prisma.TransactionClient;
  program: ProgramWithRewards;
  merchant: { id: string; slug: string; name: string } | null;
  draft: LoyaltyProgramDraft;
  actorId: string;
  decision?: ModeChangeDecision;
  now?: Date;
}) {
  const now = input.now ?? new Date();
  const modeChanged = modeChangeRequiresRewardDecision(input.program.mode, input.draft.mode);
  if (modeChanged && !input.decision) {
    return { requiresRewardDecision: true as const, modeChanged };
  }

  const rewardsToValidate = modeChanged
    ? input.decision?.action === "CONVERT"
      ? input.decision.rewards
      : []
    : input.draft.rewards;
  assertRewardLimit(rewardsToValidate, input.draft.mode);

  const nextVersion = input.program.version + 1;
  const firstReward = rewardsToValidate.find((reward) => !reward.archivedAt);
  let entitlementCount = 0;

  if (modeChanged && input.decision?.action === "ARCHIVE_OLD") {
    entitlementCount = await createAcquiredRewardEntitlements(input.tx, {
      program: input.program,
      merchantId: input.program.merchantId,
      now,
    });
  }

  if (modeChanged && input.decision?.action === "CONVERT") {
    const nextUnit = thresholdUnitForMode(input.draft.mode);
    const incompatibleConvertedReward = input.decision.rewards.find(
      (reward) => !reward.archivedAt && reward.thresholdUnit !== nextUnit,
    );
    if (incompatibleConvertedReward) {
      throw new Error("Certains avantages appartiennent à votre ancien programme. Choisissez un équivalent pour terminer leur conversion.");
    }
    const mappings = buildConversionMappings(input.program, input.decision.rewards);
    const activeOldRewards = activeEligibleRewards(input.program, now);
    const missingTimeless = activeOldRewards.find(
      (reward) => !reward.validUntil && !mappings.some((mapping) => mapping.oldReward.id === reward.id),
    );
    if (missingTimeless) {
      throw new Error("Certains avantages appartiennent à votre ancien programme. Choisissez un équivalent pour terminer leur conversion.");
    }
    if (!mappings.length && activeOldRewards.length) {
      throw new Error("Certains avantages appartiennent à votre ancien programme. Choisissez un équivalent pour terminer leur conversion.");
    }

    const memberships = await input.tx.customerMembership.findMany({
      where: { merchantId: input.program.merchantId, removedAt: null },
      select: { id: true, points: true },
    });
    const auditRows = [];
    for (const membership of memberships) {
      const reference = conversionReference(mappings, membership.points);
      if (!reference) continue;
      const result = convertLoyaltyBalance({
        oldBalance: membership.points,
        oldThreshold: reference.oldReward.threshold,
        newThreshold: reference.newReward.threshold,
      });
      await input.tx.customerMembership.update({
        where: { id: membership.id },
        data: { points: result },
      });
      auditRows.push({
        membershipId: membership.id,
        oldBalance: membership.points,
        oldThreshold: reference.oldReward.threshold,
        newThreshold: reference.newReward.threshold,
        ratio: membership.points / reference.oldReward.threshold,
        result,
      });
    }
    await input.tx.auditLog.create({
      data: {
        actorId: input.actorId,
        merchantId: input.program.merchantId,
        action: "LOYALTY_PROGRAM_BALANCE_CONVERSION",
        metadata: {
          previousMode: input.program.mode,
          nextMode: input.draft.mode,
          mappings: mappings.map((mapping) => ({
            oldRewardId: mapping.oldReward.id,
            oldThreshold: mapping.oldReward.threshold,
            newThreshold: mapping.newReward.threshold,
          })),
          balances: auditRows,
        },
      },
    });
  }

  await input.tx.loyaltyProgram.update({
    where: { id: input.program.id },
    data: {
      mode: input.draft.mode,
      config: input.draft.rules as Prisma.InputJsonValue,
      draftConfig: Prisma.JsonNull,
      status: "ACTIVE",
      version: nextVersion,
      publishedAt: now,
      visitsRequired: firstReward?.threshold ?? input.program.visitsRequired,
      rewardLabel: firstReward?.name ?? input.program.rewardLabel,
    },
  });

  if (modeChanged) {
    await publishRewardsAfterModeChange(input.tx, input.program, input.decision!, input.draft.rewards, now);
  } else {
    await publishRewardsWithoutModeChange(input.tx, input.program, input.draft.rewards);
  }

  const fresh = await input.tx.loyaltyProgram.findUnique({
    where: { id: input.program.id },
    include: { rewards: true },
  });

  await input.tx.loyaltyProgramVersion.create({
    data: {
      programId: input.program.id,
      version: nextVersion,
      mode: input.draft.mode,
      config: input.draft.rules as Prisma.InputJsonValue,
      rewards: (fresh?.rewards.map(rewardFromDb) ?? []) as Prisma.InputJsonValue,
      publishedBy: input.actorId,
    },
  });

  if (input.merchant) {
    const loyaltyContext = await getActiveMerchantLoyaltyContext(input.merchant.id, input.tx);
    const publishedCardTemplate = await resolvePublishedMerchantCardTemplate(input.merchant.id, input.draft.mode, input.tx);
    const cardTemplatePayload = normalizeResolvedPublishedTemplate(publishedCardTemplate);
    const memberships = await input.tx.customerMembership.findMany({
      where: { merchantId: input.merchant.id, removedAt: null },
      select: { id: true, userId: true, points: true },
    });
    for (const membership of memberships) {
      const programView = loyaltyContext ? buildCustomerProgramView(loyaltyContext, membership.points) : null;
      await input.tx.walletEvent.create({
        data: {
          userId: membership.userId,
          merchantId: input.merchant.id,
          customerMembershipId: membership.id,
          type: "MERCHANT_CARD_UPDATED",
          payload: {
            slug: input.merchant.slug,
            merchantName: input.merchant.name,
            loyaltyMode: input.draft.mode,
            programVersion: nextVersion,
            points: membership.points,
            visitsRequired: programView?.progressTarget ?? firstReward?.threshold ?? input.program.visitsRequired,
            rewardLabel: programView?.rewards[0]?.name ?? firstReward?.name ?? input.program.rewardLabel,
            programTitle: programView?.programTitle ?? null,
            programDescription: programView?.programDescription ?? null,
            minimumPurchaseLabel: programView?.minimumPurchaseLabel ?? null,
            templateId: publishedCardTemplate?.id ?? null,
            templateVersion: publishedCardTemplate?.version ?? null,
            usedFallback: publishedCardTemplate?.usedFallback ?? false,
            cardTemplate: cardTemplatePayload,
            refreshOnly: true,
          },
        },
      });
    }
  }

  return { requiresRewardDecision: false as const, modeChanged, version: nextVersion, entitlementCount };
}
