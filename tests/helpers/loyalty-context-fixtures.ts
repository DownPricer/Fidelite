import type { LoyaltyMode, LoyaltyProgram, LoyaltyReward } from "@prisma/client";
import type { ActiveMerchantLoyaltyContext } from "@/lib/loyalty-context";
import { progressTargetForBalance } from "@/lib/loyalty-context";
import { programToConfig } from "@/lib/loyalty-program";
import { loyaltyUnitForMode, modeTitle, programEarnDescription, programMinimumPurchaseLabel } from "@/lib/loyalty-labels";

export function mockLoyaltyProgram(
  overrides: Partial<LoyaltyProgram> & {
    merchantId?: string;
    mode?: LoyaltyMode;
    rewards?: Partial<LoyaltyReward>[];
  } = {},
): LoyaltyProgram & { rewards: LoyaltyReward[] } {
  const mode = overrides.mode ?? "VISITS";
  const merchantId = overrides.merchantId ?? "m1";
  const programId = overrides.id ?? "p1";
  const now = new Date();
  const rewards = (overrides.rewards ?? []).map((reward, index) => ({
    id: reward.id ?? `reward-${index}`,
    programId,
    name: reward.name ?? "Récompense",
    description: null,
    iconUrl: null,
    rewardType: "CUSTOM" as const,
    threshold: reward.threshold ?? 10,
    thresholdUnit: (reward.thresholdUnit ?? (mode === "VISITS" ? "visits" : "points")) as "visits" | "points",
    value: null,
    minPurchase: null,
    maxDiscount: null,
    isActive: reward.isActive ?? true,
    sortOrder: index,
    validFrom: null,
    validUntil: null,
    maxUsesPerCustomer: null,
    reuseDelayDays: null,
    globalLimit: null,
    conditions: null,
    createdAt: now,
    updatedAt: now,
  }));

  const { rewards: rewardOverrides, ...programOverrides } = overrides;

  return {
    id: programId,
    merchantId,
    mode,
    status: "ACTIVE",
    visitsRequired: 10,
    rewardLabel: "Boisson offerte",
    config: { visitsPerScan: 1, minPurchase: 0 },
    draftConfig: null,
    version: 1,
    publishedAt: new Date(),
    scheduledAt: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    rewards: rewardOverrides !== undefined ? rewards : [],
    ...programOverrides,
  };
}

export function mockActiveMerchant(
  merchantId = "m1",
  overrides: Partial<ActiveMerchantLoyaltyContext["merchant"]> = {},
) {
  return {
    id: merchantId,
    name: "Café Demo",
    slug: "cafe-demo",
    logoUrl: null,
    primaryColor: "#875BFF",
    isActive: true,
    status: "ACTIVE" as const,
    ...overrides,
  };
}

export function mockLoyaltyContext(
  program: LoyaltyProgram & { rewards: LoyaltyReward[] },
  merchant = mockActiveMerchant(program.merchantId),
): ActiveMerchantLoyaltyContext {
  const config = programToConfig(program, { activeOnly: true, filterByMode: true });
  return {
    merchant,
    program,
    programId: program.id,
    programVersion: program.version,
    mode: config.mode,
    config,
    unit: loyaltyUnitForMode(config.mode),
    isOperational: true,
    publishedAt: program.publishedAt,
    cardTemplate: null,
    cardTemplateMeta: null,
    rewards: config.rewards,
    progressTarget: progressTargetForBalance(config, 0),
    primaryRewardLabel: config.rewards[0]?.name ?? null,
    programTitle: modeTitle(config.mode),
    programDescription: programEarnDescription(config.mode, config.rules),
    minimumPurchaseLabel: programMinimumPurchaseLabel(config.rules),
  };
}
