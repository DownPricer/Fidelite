import type { LoyaltyMode, LoyaltyReward, LoyaltyProgram } from "@prisma/client";

export type RoundingMode = "floor" | "round" | "decimal";

export type AmountTier = {
  id: string;
  minAmount: number;
  maxAmount: number | null;
  earnValue: number;
};

export type ProgramRules = {
  visitsPerScan?: number;
  minPurchase?: number;
  minIntervalMinutes?: number;
  maxPerDay?: number;
  manualPassageAllowed?: boolean;
  passageExpiryMonths?: number | null;
  pointsPerAmount?: number;
  amountForPoints?: number;
  rounding?: RoundingMode;
  maxPointsPerTx?: number;
  maxPointsPerDay?: number;
  pointsExpiryMonths?: number | null;
  fixedPointsPerPurchase?: number;
  minIntervalFixed?: number;
  amountTiers?: AmountTier[];
  requirePurchaseAmount?: boolean;
  correctionRequiresReason?: boolean;
  confirmAboveThreshold?: number;
};

export type ProgramConfig = {
  mode: LoyaltyMode;
  rules: ProgramRules;
  rewards: RewardConfig[];
};

export type RewardConfig = {
  id: string;
  name: string;
  description?: string | null;
  iconUrl?: string | null;
  rewardType: string;
  threshold: number;
  thresholdUnit: "visits" | "points";
  value?: number | null;
  minPurchase?: number | null;
  maxDiscount?: number | null;
  isActive: boolean;
  sortOrder: number;
  validFrom?: string | null;
  validUntil?: string | null;
  maxUsesPerCustomer?: number | null;
  reuseDelayDays?: number | null;
  globalLimit?: number | null;
};

export type SimulateInput = {
  purchaseAmount?: number;
  currentBalance: number;
  visitCount?: number;
};

export type SimulateResult = {
  earned: number;
  newBalance: number;
  unitLabel: string;
  nextReward: RewardConfig | null;
  remainingToNext: number | null;
  unlockedReward: RewardConfig | null;
  label: string;
};

export const DEFAULT_RULES: Record<LoyaltyMode, ProgramRules> = {
  VISITS: {
    visitsPerScan: 1,
    minPurchase: 0,
    minIntervalMinutes: 0,
    maxPerDay: 0,
    manualPassageAllowed: true,
    passageExpiryMonths: null,
  },
  POINTS_BY_AMOUNT: {
    pointsPerAmount: 1,
    amountForPoints: 1,
    minPurchase: 0,
    rounding: "floor",
    maxPointsPerTx: 0,
    maxPointsPerDay: 0,
    pointsExpiryMonths: null,
    requirePurchaseAmount: true,
  },
  FIXED_POINTS: {
    fixedPointsPerPurchase: 20,
    minPurchase: 0,
    minIntervalFixed: 0,
    maxPerDay: 0,
    pointsExpiryMonths: null,
  },
  AMOUNT_TIERS: {
    amountTiers: [
      { id: "t1", minAmount: 0, maxAmount: 19.99, earnValue: 1 },
      { id: "t2", minAmount: 20, maxAmount: 49.99, earnValue: 2 },
      { id: "t3", minAmount: 50, maxAmount: null, earnValue: 3 },
    ],
    minPurchase: 0,
    maxPerDay: 0,
  },
};

export function rewardFromDb(r: LoyaltyReward): RewardConfig {
  return {
    id: r.id,
    name: r.name,
    description: r.description,
    iconUrl: r.iconUrl,
    rewardType: r.rewardType,
    threshold: r.threshold,
    thresholdUnit: r.thresholdUnit === "points" ? "points" : "visits",
    value: r.value,
    minPurchase: r.minPurchase,
    maxDiscount: r.maxDiscount,
    isActive: r.isActive,
    sortOrder: r.sortOrder,
    validFrom: r.validFrom?.toISOString() ?? null,
    validUntil: r.validUntil?.toISOString() ?? null,
    maxUsesPerCustomer: r.maxUsesPerCustomer,
    reuseDelayDays: r.reuseDelayDays,
    globalLimit: r.globalLimit,
  };
}

export function programToConfig(program: LoyaltyProgram & { rewards?: LoyaltyReward[] }): ProgramConfig {
  const mode = program.mode ?? "VISITS";
  const stored = program.config as ProgramRules | null;
  const rules = { ...DEFAULT_RULES[mode], ...(stored ?? {}) };
  return {
    mode,
    rules,
    rewards: (program.rewards ?? []).sort((a, b) => a.sortOrder - b.sortOrder).map(rewardFromDb),
  };
}

export function unitLabel(mode: LoyaltyMode) {
  if (mode === "VISITS" || mode === "AMOUNT_TIERS") return "passages";
  return "points";
}

export function computeEarn(mode: LoyaltyMode, rules: ProgramRules, purchaseAmount = 0): number {
  switch (mode) {
    case "VISITS":
      return Math.max(0, rules.visitsPerScan ?? 1);
    case "POINTS_BY_AMOUNT": {
      const min = rules.minPurchase ?? 0;
      if (purchaseAmount < min) return 0;
      const ratio = (rules.pointsPerAmount ?? 1) / Math.max(0.01, rules.amountForPoints ?? 1);
      let pts = purchaseAmount * ratio;
      if (rules.rounding === "floor") pts = Math.floor(pts);
      else if (rules.rounding === "round") pts = Math.round(pts);
      if (rules.maxPointsPerTx && rules.maxPointsPerTx > 0) pts = Math.min(pts, rules.maxPointsPerTx);
      return Math.max(0, pts);
    }
    case "FIXED_POINTS": {
      const min = rules.minPurchase ?? 0;
      if (purchaseAmount < min && min > 0) return 0;
      return Math.max(0, rules.fixedPointsPerPurchase ?? 0);
    }
    case "AMOUNT_TIERS": {
      const tiers = [...(rules.amountTiers ?? [])].sort((a, b) => a.minAmount - b.minAmount);
      const tier = tiers.find((t) => purchaseAmount >= t.minAmount && (t.maxAmount === null || purchaseAmount <= t.maxAmount));
      return tier?.earnValue ?? 0;
    }
    default:
      return 0;
  }
}

export function nextReward(rewards: RewardConfig[], balance: number, mode: LoyaltyMode): RewardConfig | null {
  const unit = mode === "VISITS" || mode === "AMOUNT_TIERS" ? "visits" : "points";
  const active = rewards.filter((r) => r.isActive && r.thresholdUnit === unit);
  return active.find((r) => balance < r.threshold) ?? null;
}

export function simulateProgram(config: ProgramConfig, input: SimulateInput): SimulateResult {
  const earned = computeEarn(config.mode, config.rules, input.purchaseAmount ?? 0);
  const newBalance = input.currentBalance + earned;
  const unit = unitLabel(config.mode);
  const next = nextReward(config.rewards, newBalance, config.mode);
  const unlocked = config.rewards.find(
    (r) => r.isActive && r.threshold <= newBalance && r.threshold > input.currentBalance,
  ) ?? null;

  let label = `+${earned} ${unit} → nouveau solde : ${newBalance} ${unit}`;
  if (input.purchaseAmount && input.purchaseAmount > 0) {
    label = `Achat de ${input.purchaseAmount.toFixed(0)} € → ${label}`;
  }
  if (next) {
    label += ` → encore ${next.threshold - newBalance} ${unit} avant « ${next.name} »`;
  }

  return {
    earned,
    newBalance,
    unitLabel: unit,
    nextReward: next,
    remainingToNext: next ? next.threshold - newBalance : null,
    unlockedReward: unlocked,
    label,
  };
}

export function validateTiers(tiers: AmountTier[]): string | null {
  const sorted = [...tiers].sort((a, b) => a.minAmount - b.minAmount);
  for (let i = 0; i < sorted.length; i++) {
    const t = sorted[i]!;
    if (t.maxAmount !== null && t.maxAmount < t.minAmount) return "Un palier a un maximum inférieur au minimum.";
    if (i > 0) {
      const prev = sorted[i - 1]!;
      if (prev.maxAmount === null) return "Un palier illimité ne peut pas être suivi d'un autre.";
      if (t.minAmount > prev.maxAmount + 0.01) return "Trou détecté entre les paliers.";
      if (t.minAmount <= prev.maxAmount && t.minAmount >= prev.minAmount) return "Chevauchement entre paliers.";
    }
  }
  return null;
}

export function legacyVisitsRequired(program: { visitsRequired: number; rewardLabel: string; rewards?: LoyaltyReward[] }) {
  if (program.rewards?.length) return program.rewards[0]!.threshold;
  return program.visitsRequired;
}

export function legacyRewardLabel(program: { rewardLabel: string; rewards?: LoyaltyReward[] }) {
  if (program.rewards?.length) return program.rewards[0]!.name;
  return program.rewardLabel;
}
