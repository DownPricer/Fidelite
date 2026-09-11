import type { LoyaltyMode, LoyaltyProgram, LoyaltyReward, Merchant, Prisma } from "@prisma/client";
import {
  programToConfig,
  type ProgramConfig,
  type RewardConfig,
} from "./loyalty-program";
import { loyaltyUnitForMode, modeTitle, programEarnDescription, programMinimumPurchaseLabel } from "./loyalty-labels";
import {
  normalizeResolvedPublishedTemplate,
  resolvePublishedMerchantCardTemplate,
  type ResolvedPublishedCardTemplate,
} from "./merchant-card-template-service";
import { buildNextBenefit } from "./loyalty-engine";
import { computeEarnFromCents, nextReward } from "./loyalty-program";
import { prisma } from "./prisma";

const LOG_PREFIX = "[loyalty-context]";

export type ActiveMerchantLoyaltyContext = {
  merchant: Pick<Merchant, "id" | "name" | "slug" | "logoUrl" | "primaryColor" | "isActive" | "status">;
  program: LoyaltyProgram & { rewards: LoyaltyReward[] };
  programId: string;
  programVersion: number;
  mode: LoyaltyMode;
  config: ProgramConfig;
  unit: ReturnType<typeof loyaltyUnitForMode>;
  isOperational: boolean;
  publishedAt: Date | null;
  cardTemplate: ReturnType<typeof normalizeResolvedPublishedTemplate>;
  cardTemplateMeta: ResolvedPublishedCardTemplate | null;
  rewards: RewardConfig[];
  progressTarget: number;
  primaryRewardLabel: string | null;
  programTitle: string;
  programDescription: string;
  minimumPurchaseLabel: string | null;
};

function isMerchantOperational(merchant: Pick<Merchant, "isActive" | "status">) {
  if (!merchant.isActive) return false;
  if (merchant.status === "SUSPENDED" || merchant.status === "ARCHIVED") return false;
  return true;
}

function isProgramOperational(program: Pick<LoyaltyProgram, "status">) {
  return program.status === "ACTIVE";
}

export function progressTargetForBalance(config: ProgramConfig, balance: number): number {
  const unit = loyaltyUnitForMode(config.mode);
  const active = config.rewards.filter(
    (reward) => reward.isActive && reward.thresholdUnit === unit,
  );
  const upcoming = nextReward(config.rewards, balance, config.mode);
  if (upcoming) return upcoming.threshold;
  if (active.length) return Math.max(...active.map((reward) => reward.threshold));
  if (config.mode === "VISITS") return Math.max(1, active[0]?.threshold ?? 10);
  return Math.max(1, active[0]?.threshold ?? 0);
}

export function buildCustomerProgramView(
  context: ActiveMerchantLoyaltyContext,
  balance: number,
) {
  const target = progressTargetForBalance(context.config, balance);
  const upcoming = nextReward(context.rewards, balance, context.mode);
  const nextBenefit = buildNextBenefit(
    context.rewards,
    balance,
    context.mode,
    context.config.rules,
    computeEarnFromCents(context.mode, context.config.rules, 0).earned,
  );

  return {
    mode: context.mode,
    unit: context.unit,
    balance,
    progressTarget: target,
    programTitle: context.programTitle,
    programDescription: context.programDescription,
    minimumPurchaseLabel: context.minimumPurchaseLabel,
    rewards: context.rewards.map((reward) => ({
      id: reward.id,
      name: reward.name,
      threshold: reward.threshold,
      thresholdUnit: reward.thresholdUnit,
      description: reward.description ?? null,
    })),
    nextBenefit,
    upcomingRewardName: upcoming?.name ?? null,
    upcomingRemaining: upcoming ? Math.max(0, upcoming.threshold - balance) : null,
  };
}

function logContext(context: ActiveMerchantLoyaltyContext) {
  console.info(LOG_PREFIX, "commerce", {
    merchantId: context.merchant.id,
    slug: context.merchant.slug,
  });
  console.info(LOG_PREFIX, "programme actif", {
    programId: context.programId,
    status: context.program.status,
  });
  console.info(LOG_PREFIX, "mode actif", { mode: context.mode });
  console.info(LOG_PREFIX, "version active", { version: context.programVersion });
  console.info(LOG_PREFIX, "gabarit sélectionné", {
    templateId: context.cardTemplateMeta?.id ?? null,
    cardSlot: context.cardTemplateMeta?.cardSlot ?? null,
    usedFallback: context.cardTemplateMeta?.usedFallback ?? false,
  });
  console.info(LOG_PREFIX, "récompenses sélectionnées", {
    count: context.rewards.length,
    names: context.rewards.map((reward) => reward.name),
  });
}

async function resolveContextFromProgram(
  merchant: Pick<Merchant, "id" | "name" | "slug" | "logoUrl" | "primaryColor" | "isActive" | "status">,
  program: LoyaltyProgram & { rewards: LoyaltyReward[] },
  db: Prisma.TransactionClient | typeof prisma,
): Promise<ActiveMerchantLoyaltyContext> {
  if (program.status !== "ACTIVE") {
    console.warn(LOG_PREFIX, "programme non actif — utilisation de la dernière version publiée", {
      merchantId: merchant.id,
      status: program.status,
      version: program.version,
    });
  }

  const config = programToConfig(program, { activeOnly: true, filterByMode: true });
  const cardTemplateMeta = await resolvePublishedMerchantCardTemplate(merchant.id, config.mode, db);
  const cardTemplate = normalizeResolvedPublishedTemplate(cardTemplateMeta);
  const rewards = config.rewards;
  const progressTarget = progressTargetForBalance(config, 0);
  const primaryRewardLabel = rewards[0]?.name ?? null;

  const context: ActiveMerchantLoyaltyContext = {
    merchant,
    program,
    programId: program.id,
    programVersion: program.version,
    mode: config.mode,
    config,
    unit: loyaltyUnitForMode(config.mode),
    isOperational: isMerchantOperational(merchant) && isProgramOperational(program),
    publishedAt: program.publishedAt,
    cardTemplate,
    cardTemplateMeta,
    rewards,
    progressTarget,
    primaryRewardLabel,
    programTitle: modeTitle(config.mode),
    programDescription: programEarnDescription(config.mode, config.rules),
    minimumPurchaseLabel: programMinimumPurchaseLabel(config.rules),
  };

  logContext(context);
  return context;
}

export async function getActiveMerchantLoyaltyContext(
  merchantId: string,
  db: Prisma.TransactionClient | typeof prisma = prisma,
): Promise<ActiveMerchantLoyaltyContext | null> {
  const merchant = await db.merchant.findUnique({
    where: { id: merchantId },
    select: {
      id: true,
      name: true,
      slug: true,
      logoUrl: true,
      primaryColor: true,
      isActive: true,
      status: true,
    },
  });
  if (!merchant) return null;

  const program = await db.loyaltyProgram.findUnique({
    where: { merchantId },
    include: { rewards: { orderBy: { sortOrder: "asc" } } },
  });
  if (!program) return null;

  return resolveContextFromProgram(merchant, program, db);
}

export async function getActiveMerchantLoyaltyContextBySlug(
  slug: string,
  db: Prisma.TransactionClient | typeof prisma = prisma,
): Promise<ActiveMerchantLoyaltyContext | null> {
  const merchant = await db.merchant.findFirst({
    where: { slug, isActive: true },
    select: {
      id: true,
      name: true,
      slug: true,
      logoUrl: true,
      primaryColor: true,
      isActive: true,
      status: true,
    },
  });
  if (!merchant) return null;
  return getActiveMerchantLoyaltyContext(merchant.id, db);
}

export function assertGrantMatchesActiveProgram(
  grant: { programVersion?: number | null; programMode?: LoyaltyMode | null; programId?: string | null },
  context: ActiveMerchantLoyaltyContext,
) {
  if (grant.programId && grant.programId !== context.programId) {
    throw new Error("Le programme a changé depuis le scan. Rescannez le client.");
  }
  if (grant.programVersion != null && grant.programVersion !== context.programVersion) {
    throw new Error("Le programme a changé depuis le scan. Rescannez le client.");
  }
  if (grant.programMode && grant.programMode !== context.mode) {
    throw new Error("Le programme a changé depuis le scan. Rescannez le client.");
  }
}
