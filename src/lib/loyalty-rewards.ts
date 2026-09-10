import type { LoyaltyMode } from "@prisma/client";
import { formatEurosFromCents, eurosToCents } from "./money";
import type { RewardConfig } from "./loyalty-program";
import { unitLabel } from "./loyalty-program";

export type RewardStatus =
  | "Disponible"
  | "Bientôt disponible"
  | "Utilisé"
  | "Expiré"
  | "En attente"
  | "Indisponible";

export type RewardConditions = {
  stackable?: boolean;
  earnOnRedeem?: boolean;
  exclusive?: boolean;
};

export type RewardUsage = {
  customerUseCount: number;
  lastRedeemAt: Date | null;
  globalUseCount: number;
  redeemsInCurrentGrant: number;
};

export type EvaluatedReward = {
  id: string;
  name: string;
  description: string | null;
  cost: number;
  costLabel: string;
  merchantName: string;
  expiresAt: string | null;
  expiresLabel: string | null;
  conditions: string[];
  status: RewardStatus;
  available: boolean;
  reason: string | null;
  threshold: number;
  thresholdUnit: "visits" | "points";
  minPurchaseCents: number | null;
  stackable: boolean;
};

export function parseRewardConditions(raw: unknown): RewardConditions {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return {};
  const value = raw as Record<string, unknown>;
  const conditions: RewardConditions = {};
  if (typeof value.stackable === "boolean") conditions.stackable = value.stackable;
  if (typeof value.earnOnRedeem === "boolean") conditions.earnOnRedeem = value.earnOnRedeem;
  if (typeof value.exclusive === "boolean") conditions.exclusive = value.exclusive;
  return conditions;
}

export function rewardIsStackable(_reward: RewardConfig, rawConditions?: unknown): boolean {
  const parsed = parseRewardConditions(rawConditions);
  if (parsed.exclusive === true) return false;
  if (parsed.stackable === true) return true;
  return false;
}

function unitForReward(mode: LoyaltyMode, reward: RewardConfig) {
  if (reward.thresholdUnit === "points" || reward.thresholdUnit === "visits") {
    return reward.thresholdUnit === "points" ? "points" : "passages";
  }
  return unitLabel(mode);
}

export function evaluateReward(input: {
  reward: RewardConfig;
  mode: LoyaltyMode;
  balance: number;
  now?: Date;
  merchantName: string;
  purchaseAmountCents?: number;
  usage: RewardUsage;
  rawConditions?: unknown;
}): EvaluatedReward {
  const now = input.now ?? new Date();
  const reward = input.reward;
  const unit = unitForReward(input.mode, reward);
  const conditions: string[] = [];
  const minPurchaseCents =
    reward.minPurchase !== null && reward.minPurchase !== undefined && reward.minPurchase > 0
      ? eurosToCents(reward.minPurchase)
      : null;

  if (reward.threshold > 0) {
    conditions.push(`Seuil : ${reward.threshold} ${unit}`);
  }
  if (minPurchaseCents !== null) {
    conditions.push(`Montant minimum : ${formatEurosFromCents(minPurchaseCents)}`);
  }
  if (reward.maxUsesPerCustomer) {
    conditions.push(`Limite : ${reward.maxUsesPerCustomer} utilisation${reward.maxUsesPerCustomer > 1 ? "s" : ""} par client`);
  }
  if (reward.reuseDelayDays) {
    conditions.push(`Délai de réutilisation : ${reward.reuseDelayDays} jour${reward.reuseDelayDays > 1 ? "s" : ""}`);
  }
  if (reward.globalLimit) {
    conditions.push(`Stock : ${Math.max(0, reward.globalLimit - input.usage.globalUseCount)} / ${reward.globalLimit}`);
  }

  const stackable = rewardIsStackable(reward, input.rawConditions);
  if (!stackable) {
    conditions.push("Non cumulable avec un autre avantage sur cette visite");
  }

  const expiresAt = reward.validUntil ?? null;
  const expiresLabel = expiresAt
    ? `Expire le ${new Date(expiresAt).toLocaleDateString("fr-FR")}`
    : null;

  const base = {
    id: reward.id,
    name: reward.name,
    description: reward.description ?? null,
    cost: reward.threshold,
    costLabel: `${reward.threshold} ${unit}`,
    merchantName: input.merchantName,
    expiresAt,
    expiresLabel,
    conditions,
    threshold: reward.threshold,
    thresholdUnit: reward.thresholdUnit,
    minPurchaseCents,
    stackable,
  };

  if (!reward.isActive) {
    return { ...base, status: "Indisponible", available: false, reason: "Cet avantage n'est plus actif." };
  }

  if (reward.validUntil && new Date(reward.validUntil) < now) {
    return { ...base, status: "Expiré", available: false, reason: "Cet avantage a expiré." };
  }

  if (reward.validFrom && new Date(reward.validFrom) > now) {
    return {
      ...base,
      status: "En attente",
      available: false,
      reason: `Disponible à partir du ${new Date(reward.validFrom).toLocaleDateString("fr-FR")}.`,
    };
  }

  if (reward.maxUsesPerCustomer && input.usage.customerUseCount >= reward.maxUsesPerCustomer) {
    return {
      ...base,
      status: "Utilisé",
      available: false,
      reason: "Limite d'utilisation atteinte pour ce client.",
    };
  }

  if (reward.globalLimit && input.usage.globalUseCount >= reward.globalLimit) {
    return { ...base, status: "Indisponible", available: false, reason: "Stock épuisé." };
  }

  if (reward.reuseDelayDays && input.usage.lastRedeemAt) {
    const waitMs = reward.reuseDelayDays * 24 * 60 * 60 * 1000;
    const eligibleAt = input.usage.lastRedeemAt.getTime() + waitMs;
    if (eligibleAt > now.getTime()) {
      const remainingHours = Math.ceil((eligibleAt - now.getTime()) / 3_600_000);
      return {
        ...base,
        status: "Indisponible",
        available: false,
        reason: `Délai de réutilisation non écoulé. Réessayez dans ${remainingHours} h.`,
      };
    }
  }

  if (!stackable && input.usage.redeemsInCurrentGrant > 0) {
    return {
      ...base,
      status: "Indisponible",
      available: false,
      reason: "Les avantages ne sont pas cumulables lors de la même visite.",
    };
  }

  if (input.balance < reward.threshold) {
    const missing = reward.threshold - input.balance;
    return {
      ...base,
      status: "Bientôt disponible",
      available: false,
      reason: `Encore ${missing} ${unit} pour obtenir « ${reward.name} ».`,
    };
  }

  if (minPurchaseCents !== null && (input.purchaseAmountCents === undefined || input.purchaseAmountCents < minPurchaseCents)) {
    return {
      ...base,
      status: "Indisponible",
      available: false,
      reason: `Montant minimum requis : ${formatEurosFromCents(minPurchaseCents)}.`,
    };
  }

  return { ...base, status: "Disponible", available: true, reason: null };
}

export function sortEvaluatedRewards(rewards: EvaluatedReward[]) {
  const rank: Record<RewardStatus, number> = {
    Disponible: 0,
    "Bientôt disponible": 1,
    "En attente": 2,
    Indisponible: 3,
    Utilisé: 4,
    Expiré: 5,
  };
  return [...rewards].sort((a, b) => rank[a.status] - rank[b.status] || a.name.localeCompare(b.name, "fr"));
}
