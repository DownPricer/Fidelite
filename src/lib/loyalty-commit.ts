import { LoyaltyTxType, Prisma, type LoyaltyMode, type LoyaltyProgram, type LoyaltyReward } from "@prisma/client";
import { LoyaltyError } from "./loyalty";
import {
  assertEvaluationOk,
  buildNextBenefit,
  earnPreviewLines,
  evaluateEarn,
  primaryEarnLabel,
  progressLabelFor,
  remainingPurchasesToReward,
  type EarnHistory,
  type LoyaltyAction,
  type LoyaltyBlock,
  type NextBenefitView,
} from "./loyalty-engine";
import { applyLoyaltyAction } from "./loyalty-service";
import {
  computeEarnFromCents,
  legacyRewardLabel,
  legacyVisitsRequired,
  programToConfig,
  unitLabel,
  type ProgramConfig,
} from "./loyalty-program";
import {
  evaluateReward,
  sortEvaluatedRewards,
  type EvaluatedReward,
  type RewardUsage,
} from "./loyalty-rewards";
import { formatEurosFromCents, purchaseAmountCentsFromUnknown } from "./money";
import { prisma } from "./prisma";

export const CAISSE_GRANT_TTL_MS = 15 * 60 * 1000;

type ProgramWithRewards = LoyaltyProgram & { rewards: LoyaltyReward[] };

export type LoyaltyTransactionView = {
  ok: boolean;
  action: LoyaltyAction;
  committed: boolean;
  firstName: string;
  lastName: string;
  customerName: string;
  points: number;
  previousPoints: number;
  visitsRequired: number;
  rewardLabel: string;
  progressLabel: string;
  unitLabel: string;
  programMode: LoyaltyMode;
  purchaseAmountCents: number;
  purchaseAmountLabel: string | null;
  earned: number;
  earnLabel: string | null;
  newBalanceLabel: string;
  ruleApplied: string | null;
  block: LoyaltyBlock | null;
  previewLines: string[];
  primaryActionLabel: string;
  amountRequired: boolean;
  nextTierHint: string | null;
  appliedTierLabel: string | null;
  rewards: EvaluatedReward[];
  nextBenefit: NextBenefitView | null;
  unlockedRewards: EvaluatedReward[];
  successTitle: string | null;
  successMessage: string | null;
  snapshot: { progressLabel: string; rewardAvailable: boolean };
  merchantName: string;
  grantExpiresAt: string;
  redeem?: {
    rewardId: string;
    rewardName: string;
    cost: number;
    costLabel: string;
    previousPoints: number;
    nextPoints: number;
  };
};

function customerName(firstName: string, lastName: string | null | undefined) {
  return [firstName, lastName].filter(Boolean).join(" ").trim();
}

function startOfDay(now: Date) {
  const start = new Date(now);
  start.setHours(0, 0, 0, 0);
  return start;
}

function isProgramActive(program: LoyaltyProgram) {
  return program.status === "ACTIVE";
}

function isMerchantActive(merchant: { isActive: boolean; status?: string }) {
  if (!merchant.isActive) return false;
  if (merchant.status === "SUSPENDED" || merchant.status === "ARCHIVED") return false;
  return true;
}

async function lockMembership(tx: Prisma.TransactionClient, membershipId: string) {
  await tx.$queryRaw`SELECT id FROM "CustomerMembership" WHERE id = ${membershipId} FOR UPDATE`;
}

async function loadEarnHistory(
  db: Prisma.TransactionClient | typeof prisma,
  input: { customerMembershipId: string; merchantId: string; now: Date },
): Promise<EarnHistory> {
  const last = await db.loyaltyTransaction.findFirst({
    where: {
      customerMembershipId: input.customerMembershipId,
      merchantId: input.merchantId,
      type: "EARN_VISIT",
      status: "COMPLETED",
    },
    orderBy: { createdAt: "desc" },
  });
  const today = await db.loyaltyTransaction.findMany({
    where: {
      customerMembershipId: input.customerMembershipId,
      merchantId: input.merchantId,
      type: "EARN_VISIT",
      status: "COMPLETED",
      createdAt: { gte: startOfDay(input.now) },
    },
    select: { pointsDelta: true },
  });
  return {
    lastEarnAt: last?.createdAt ?? null,
    earnCountToday: today.length,
    pointsEarnedToday: today.reduce((sum, tx) => sum + Math.max(0, tx.pointsDelta), 0),
  };
}

async function loadRewardUsage(
  db: Prisma.TransactionClient | typeof prisma,
  input: {
    rewardId: string;
    customerMembershipId: string;
    merchantId: string;
    grantCreatedAt: Date;
  },
): Promise<RewardUsage> {
  const [customerUseCount, last, globalUseCount, redeemsInCurrentGrant] = await Promise.all([
    db.loyaltyTransaction.count({
      where: {
        rewardId: input.rewardId,
        customerMembershipId: input.customerMembershipId,
        type: "REDEEM_REWARD",
        status: "COMPLETED",
      },
    }),
    db.loyaltyTransaction.findFirst({
      where: {
        rewardId: input.rewardId,
        customerMembershipId: input.customerMembershipId,
        type: "REDEEM_REWARD",
        status: "COMPLETED",
      },
      orderBy: { createdAt: "desc" },
    }),
    db.loyaltyTransaction.count({
      where: {
        rewardId: input.rewardId,
        merchantId: input.merchantId,
        type: "REDEEM_REWARD",
        status: "COMPLETED",
      },
    }),
    db.loyaltyTransaction.count({
      where: {
        customerMembershipId: input.customerMembershipId,
        merchantId: input.merchantId,
        type: "REDEEM_REWARD",
        status: "COMPLETED",
        createdAt: { gte: input.grantCreatedAt },
      },
    }),
  ]);
  return {
    customerUseCount,
    lastRedeemAt: last?.createdAt ?? null,
    globalUseCount,
    redeemsInCurrentGrant,
  };
}

export async function evaluateCustomerRewards(input: {
  config: ProgramConfig;
  balance: number;
  merchantName: string;
  purchaseAmountCents?: number;
  customerMembershipId: string;
  merchantId: string;
  grantCreatedAt: Date;
  now?: Date;
  db?: Prisma.TransactionClient | typeof prisma;
}) {
  const db = input.db ?? prisma;
  const now = input.now ?? new Date();
  const evaluated: EvaluatedReward[] = [];
  for (const reward of input.config.rewards) {
    const usage = await loadRewardUsage(db, {
      rewardId: reward.id,
      customerMembershipId: input.customerMembershipId,
      merchantId: input.merchantId,
      grantCreatedAt: input.grantCreatedAt,
    });
    evaluated.push(
      evaluateReward({
        reward,
        mode: input.config.mode,
        balance: input.balance,
        now,
        merchantName: input.merchantName,
        purchaseAmountCents: input.purchaseAmountCents,
        usage,
        rawConditions: reward.conditions,
      }),
    );
  }
  return sortEvaluatedRewards(evaluated);
}

function appliedTierLabel(evaluation: ReturnType<typeof evaluateEarn>) {
  if (!evaluation.appliedTier) return null;
  const maxLabel =
    evaluation.appliedTier.maxAmountCents === null
      ? "et plus"
      : formatEurosFromCents(evaluation.appliedTier.maxAmountCents);
  return `de ${formatEurosFromCents(evaluation.appliedTier.minAmountCents)} à ${maxLabel}`;
}

function buildView(input: {
  action: LoyaltyAction;
  committed: boolean;
  firstName: string;
  lastName: string;
  points: number;
  previousPoints: number;
  program: ProgramWithRewards;
  merchantName: string;
  grantExpiresAt: Date;
  purchaseAmountCents: number;
  evaluation?: ReturnType<typeof evaluateEarn>;
  rewards: EvaluatedReward[];
  nextBenefit: NextBenefitView | null;
  unlockedRewards?: EvaluatedReward[];
  redeem?: LoyaltyTransactionView["redeem"];
  block?: LoyaltyBlock | null;
}): LoyaltyTransactionView {
  const config = programToConfig(input.program);
  const threshold = legacyVisitsRequired(input.program);
  const unit = unitLabel(config.mode);
  const progress = progressLabelFor(config.mode, input.points, threshold);
  const evaluation = input.evaluation;
  const earned = evaluation?.ok ? evaluation.earned : 0;
  const nextBenefit = input.nextBenefit;
  if (nextBenefit && evaluation?.ok) {
    nextBenefit.remainingPurchases = remainingPurchasesToReward(
      config.mode,
      config.rules,
      nextBenefit.remaining,
      evaluation.earned,
    );
  }

  const previewLines = evaluation
    ? earnPreviewLines(evaluation, nextBenefit)
    : input.redeem
      ? [
          `Avantage : ${input.redeem.rewardName}`,
          `Coût : ${input.redeem.costLabel}`,
          `Solde actuel : ${input.redeem.previousPoints} ${unit}`,
          `Nouveau solde : ${input.redeem.nextPoints} ${unit}`,
        ]
      : [];

  let successTitle: string | null = null;
  let successMessage: string | null = null;
  if (input.committed && input.action === "EARN" && evaluation?.ok) {
    successTitle =
      config.mode === "VISITS" || config.mode === "AMOUNT_TIERS"
        ? "Passage validé"
        : `+${evaluation.earned} ${unit} ajoutés`;
    successMessage = `Nouveau solde : ${progress}`;
  }
  if (input.committed && input.action === "REDEEM" && input.redeem) {
    successTitle = "Avantage utilisé";
    successMessage = `Nouveau solde : ${progress}`;
  }

  return {
    ok: !input.block && (evaluation ? evaluation.ok : true),
    action: input.action,
    committed: input.committed,
    firstName: input.firstName,
    lastName: input.lastName,
    customerName: customerName(input.firstName, input.lastName),
    points: input.points,
    previousPoints: input.previousPoints,
    visitsRequired: threshold,
    rewardLabel: legacyRewardLabel(input.program),
    progressLabel: progress,
    unitLabel: unit,
    programMode: config.mode,
    purchaseAmountCents: input.purchaseAmountCents,
    purchaseAmountLabel:
      input.purchaseAmountCents > 0 ? formatEurosFromCents(input.purchaseAmountCents) : null,
    earned,
    earnLabel: evaluation?.ok ? `+${evaluation.earned} ${unit}` : null,
    newBalanceLabel:
      config.mode === "VISITS" || config.mode === "AMOUNT_TIERS"
        ? `${input.points} / ${threshold} passages`
        : `${input.points} ${unit}`,
    ruleApplied: evaluation?.ruleApplied ?? input.block?.title ?? null,
    block: input.block ?? evaluation?.block ?? null,
    previewLines,
    primaryActionLabel: primaryEarnLabel(config.mode, evaluation?.ok ? evaluation.earned : undefined),
    amountRequired: evaluation?.amountRequired ?? false,
    nextTierHint: evaluation?.nextTierHint ?? null,
    appliedTierLabel: evaluation ? appliedTierLabel(evaluation) : null,
    rewards: input.rewards,
    nextBenefit,
    unlockedRewards: input.unlockedRewards ?? [],
    successTitle,
    successMessage,
    snapshot: {
      progressLabel: progress,
      rewardAvailable: input.rewards.some((reward) => reward.available),
    },
    merchantName: input.merchantName,
    grantExpiresAt: input.grantExpiresAt.toISOString(),
    redeem: input.redeem,
  };
}

async function loadGrantContext(input: {
  grantId: string;
  actorUserId: string;
  merchantId: string;
  db?: Prisma.TransactionClient | typeof prisma;
}) {
  const db = input.db ?? prisma;
  const grant = await db.caisseGrant.findFirst({
    where: {
      id: input.grantId,
      actorUserId: input.actorUserId,
      merchantId: input.merchantId,
    },
  });
  if (!grant || grant.expiresAt < new Date()) {
    throw new LoyaltyError("Session de scan expirée. Scannez à nouveau le client.");
  }

  const membership = await db.customerMembership.findFirst({
    where: { id: grant.customerMembershipId, merchantId: input.merchantId },
    include: {
      user: true,
      merchant: { include: { program: { include: { rewards: true } } } },
    },
  });
  if (!membership?.merchant.program) {
    throw new LoyaltyError("Carte introuvable.");
  }
  if (membership.merchantId !== input.merchantId || grant.merchantId !== input.merchantId) {
    throw new LoyaltyError("Ce client n'appartient pas à ce commerce.");
  }
  return { grant, membership, program: membership.merchant.program };
}

async function assembleView(input: {
  action: LoyaltyAction;
  committed: boolean;
  grant: { createdAt: Date; expiresAt: Date };
  membership: {
    id: string;
    points: number;
    user: { firstName: string; lastName: string | null };
    merchant: { name: string; isActive: boolean; status: string };
  };
  program: ProgramWithRewards;
  purchaseAmountCents?: number;
  rewardId?: string;
  db?: Prisma.TransactionClient | typeof prisma;
  now?: Date;
  previousPoints?: number;
  earnEvaluation?: ReturnType<typeof evaluateEarn>;
}): Promise<LoyaltyTransactionView> {
  const db = input.db ?? prisma;
  const now = input.now ?? new Date();
  const config = programToConfig(input.program);
  const history = await loadEarnHistory(db, {
    customerMembershipId: input.membership.id,
    merchantId: input.program.merchantId,
    now,
  });
  const evaluation =
    input.earnEvaluation ??
    evaluateEarn({
      mode: config.mode,
      rules: config.rules,
      currentBalance: input.previousPoints ?? input.membership.points,
      purchaseAmountCents: input.purchaseAmountCents,
      history,
      now,
      programActive: isProgramActive(input.program),
      merchantActive: isMerchantActive(input.membership.merchant),
    });

  const rewards = await evaluateCustomerRewards({
    config,
    balance: input.membership.points,
    merchantName: input.membership.merchant.name,
    purchaseAmountCents: input.purchaseAmountCents,
    customerMembershipId: input.membership.id,
    merchantId: input.program.merchantId,
    grantCreatedAt: input.grant.createdAt,
    now,
    db,
  });

  const nextBenefit = buildNextBenefit(
    config.rewards,
    input.membership.points,
    config.mode,
    config.rules,
    evaluation.ok ? evaluation.earned : computeEarnFromCents(config.mode, config.rules, 0).earned,
  );

  let redeem: LoyaltyTransactionView["redeem"];
  let block = evaluation.block;
  if (input.action === "REDEEM") {
    const target = input.rewardId
      ? rewards.find((reward) => reward.id === input.rewardId)
      : rewards.find((reward) => reward.available) ?? rewards[0];
    if (!target) {
      block = {
        code: "reward_missing",
        title: "Avantage introuvable",
        message: "Aucun avantage n'est disponible pour ce client.",
        details: [],
      };
    } else if (!target.available) {
      block = {
        code: "reward_unavailable",
        title: target.status,
        message: target.reason ?? "Cet avantage ne peut pas être utilisé.",
        details: target.conditions,
      };
    } else {
      redeem = {
        rewardId: target.id,
        rewardName: target.name,
        cost: target.cost,
        costLabel: target.costLabel,
        previousPoints: input.membership.points,
        nextPoints: input.membership.points - target.cost,
      };
      block = null;
    }
  }

  return buildView({
    action: input.action,
    committed: input.committed,
    firstName: input.membership.user.firstName,
    lastName: input.membership.user.lastName ?? "",
    points: input.membership.points,
    previousPoints: input.previousPoints ?? input.membership.points,
    program: input.program,
    merchantName: input.membership.merchant.name,
    grantExpiresAt: input.grant.expiresAt,
    purchaseAmountCents: input.purchaseAmountCents ?? 0,
    evaluation: input.action === "EARN" ? evaluation : undefined,
    rewards,
    nextBenefit,
    block,
    redeem,
  });
}

export async function previewLoyaltyTransaction(input: {
  grantId: string;
  actorUserId: string;
  merchantId: string;
  action: LoyaltyAction;
  purchaseAmountCents?: number;
  purchaseAmount?: number;
  rewardId?: string;
}) {
  const cents = purchaseAmountCentsFromUnknown({
    purchaseAmountCents: input.purchaseAmountCents,
    purchaseAmount: input.purchaseAmount,
  });
  const ctx = await loadGrantContext(input);
  return assembleView({
    action: input.action,
    committed: false,
    grant: ctx.grant,
    membership: ctx.membership,
    program: ctx.program,
    purchaseAmountCents: cents,
    rewardId: input.rewardId,
  });
}

export async function commitLoyaltyTransaction(input: {
  grantId: string;
  actorUserId: string;
  merchantId: string;
  action: LoyaltyAction;
  purchaseAmountCents?: number;
  purchaseAmount?: number;
  rewardId?: string;
  idempotencyKey: string;
  ip?: string;
  userAgent?: string;
}) {
  const cents = purchaseAmountCentsFromUnknown({
    purchaseAmountCents: input.purchaseAmountCents,
    purchaseAmount: input.purchaseAmount,
  });

  return prisma.$transaction(async (tx) => {
    const existing = await tx.loyaltyTransaction.findUnique({
      where: { idempotencyKey: input.idempotencyKey },
    });
    if (existing) {
      if (existing.merchantId !== input.merchantId || existing.performedByUserId !== input.actorUserId) {
        throw new LoyaltyError("Clé d'idempotence déjà utilisée.");
      }
      const ctx = await loadGrantContext({ ...input, db: tx });
      await lockMembership(tx, ctx.membership.id);
      const replayedEarn = (existing.balanceAfter ?? ctx.membership.points) - (existing.balanceBefore ?? ctx.membership.points);
      const view = await assembleView({
        action: input.action,
        committed: true,
        grant: ctx.grant,
        membership: { ...ctx.membership, points: existing.balanceAfter ?? ctx.membership.points },
        program: ctx.program,
        purchaseAmountCents: existing.purchaseAmountCents ?? cents,
        rewardId: existing.rewardId ?? input.rewardId,
        db: tx,
        previousPoints: existing.balanceBefore ?? ctx.membership.points,
        earnEvaluation:
          input.action === "EARN"
            ? {
                ok: true,
                earned: Math.max(0, replayedEarn),
                newBalance: existing.balanceAfter ?? ctx.membership.points,
                unit: "points",
                purchaseAmountCents: existing.purchaseAmountCents ?? cents ?? 0,
                ruleApplied: existing.ruleApplied ?? "Validation déjà enregistrée",
                appliedTier: null,
                nextTierHint: null,
                remainingPurchasesToNext: null,
                block: null,
                amountRequired: false,
              }
            : undefined,
      });
      return view;
    }

    const ctx = await loadGrantContext({ ...input, db: tx });
    await lockMembership(tx, ctx.membership.id);

    const membership = await tx.customerMembership.findFirst({
      where: { id: ctx.membership.id, merchantId: input.merchantId },
      include: {
        user: true,
        merchant: { include: { program: { include: { rewards: true } } } },
      },
    });
    if (!membership?.merchant.program) {
      throw new LoyaltyError("Carte introuvable.");
    }
    const program = membership.merchant.program;

    if (input.action === "EARN") {
      if (ctx.grant.earnCommittedAt) {
        throw new LoyaltyError("Cette validation a déjà été enregistrée.");
      }
      const preview = await assembleView({
        action: "EARN",
        committed: false,
        grant: ctx.grant,
        membership,
        program,
        purchaseAmountCents: cents,
        db: tx,
      });
      assertEvaluationOk({
        ok: preview.ok,
        earned: preview.earned,
        newBalance: preview.points + preview.earned,
        unit: preview.unitLabel,
        purchaseAmountCents: preview.purchaseAmountCents,
        ruleApplied: preview.ruleApplied ?? "",
        appliedTier: null,
        nextTierHint: preview.nextTierHint,
        remainingPurchasesToNext: null,
        block: preview.block,
        amountRequired: preview.amountRequired,
      });

      let persisted;
      try {
        persisted = await applyLoyaltyAction({
          tx,
          membershipId: membership.id,
          merchantId: input.merchantId,
          actorId: input.actorUserId,
          type: LoyaltyTxType.EARN_VISIT,
          purchaseAmountCents: cents,
          idempotencyKey: input.idempotencyKey,
          ruleApplied: preview.ruleApplied ?? undefined,
          precomputedDelta: preview.earned,
          ip: input.ip,
          userAgent: input.userAgent,
        });
      } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
          throw new LoyaltyError("Cette validation a déjà été enregistrée.");
        }
        throw error;
      }

      const expiresAt = new Date(Date.now() + CAISSE_GRANT_TTL_MS);
      await tx.caisseGrant.update({
        where: { id: ctx.grant.id },
        data: {
          earnCommittedAt: new Date(),
          earnTransactionId: persisted.transactionId,
          expiresAt,
        },
      });

      const after = await assembleView({
        action: "EARN",
        committed: true,
        grant: { ...ctx.grant, expiresAt },
        membership: { ...membership, points: persisted.points },
        program,
        purchaseAmountCents: cents,
        db: tx,
        previousPoints: persisted.previousPoints,
        earnEvaluation: {
          ok: true,
          earned: preview.earned,
          newBalance: persisted.points,
          unit: preview.unitLabel,
          purchaseAmountCents: preview.purchaseAmountCents,
          ruleApplied: preview.ruleApplied ?? "",
          appliedTier: null,
          nextTierHint: preview.nextTierHint,
          remainingPurchasesToNext: null,
          block: null,
          amountRequired: preview.amountRequired,
        },
      });
      const unlocked = after.rewards.filter(
        (reward) =>
          reward.status === "Disponible" &&
          reward.threshold > persisted.previousPoints &&
          reward.threshold <= persisted.points,
      );
      return { ...after, unlockedRewards: unlocked, earned: preview.earned, ok: true };
    }

    const preview = await assembleView({
      action: "REDEEM",
      committed: false,
      grant: ctx.grant,
      membership,
      program,
      purchaseAmountCents: cents,
      rewardId: input.rewardId,
      db: tx,
    });
    if (!preview.ok || !preview.redeem) {
      throw new LoyaltyError(preview.block?.message ?? "Cet avantage ne peut pas être utilisé.");
    }

    let persisted;
    try {
      persisted = await applyLoyaltyAction({
        tx,
        membershipId: membership.id,
        merchantId: input.merchantId,
        actorId: input.actorUserId,
        type: LoyaltyTxType.REDEEM_REWARD,
        rewardId: preview.redeem.rewardId,
        purchaseAmountCents: cents,
        idempotencyKey: input.idempotencyKey,
        ruleApplied: `Utilisation de « ${preview.redeem.rewardName} »`,
        precomputedDelta: -preview.redeem.cost,
        reason: `Utilisation de « ${preview.redeem.rewardName} »`,
        ip: input.ip,
        userAgent: input.userAgent,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
        throw new LoyaltyError("Cette validation a déjà été enregistrée.");
      }
      throw error;
    }

    const expiresAt = new Date(Date.now() + CAISSE_GRANT_TTL_MS);
    await tx.caisseGrant.update({
      where: { id: ctx.grant.id },
      data: { expiresAt },
    });

    return assembleView({
      action: "REDEEM",
      committed: true,
      grant: { ...ctx.grant, expiresAt },
      membership: { ...membership, points: persisted.points },
      program,
      purchaseAmountCents: cents,
      rewardId: preview.redeem.rewardId,
      db: tx,
      previousPoints: persisted.previousPoints,
    });
  });
}

export { customerName };
