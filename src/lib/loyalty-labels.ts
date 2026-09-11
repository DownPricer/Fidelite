import type { LoyaltyMode } from "@prisma/client";
import { formatEurosFromCents } from "./money";
import { minPurchaseCents, type ProgramRules } from "./loyalty-program";

export type LoyaltyUnit = "points" | "passages";

export function loyaltyUnitForMode(mode: LoyaltyMode): LoyaltyUnit {
  if (mode === "VISITS" || mode === "AMOUNT_TIERS") return "passages";
  return "points";
}

export function formatUnitCount(count: number, unit: LoyaltyUnit): string {
  const safe = Math.abs(Math.trunc(count));
  if (unit === "passages") {
    return `${safe} passage${safe > 1 ? "s" : ""}`;
  }
  return `${safe} point${safe > 1 ? "s" : ""}`;
}

export function formatSignedUnitDelta(delta: number, unit: LoyaltyUnit): string {
  const prefix = delta > 0 ? "+" : delta < 0 ? "−" : "";
  return `${prefix}${formatUnitCount(Math.abs(delta), unit)}`;
}

export function modeTitle(mode: LoyaltyMode): string {
  switch (mode) {
    case "VISITS":
      return "Par passages";
    case "POINTS_BY_AMOUNT":
      return "Points selon le montant";
    case "FIXED_POINTS":
      return "Points fixes par achat";
    case "AMOUNT_TIERS":
      return "Paliers de montant";
    default:
      return "Programme fidélité";
  }
}

export function balanceLabel(mode: LoyaltyMode, balance: number): string {
  const unit = loyaltyUnitForMode(mode);
  if (mode === "VISITS" || mode === "AMOUNT_TIERS") {
    return `${balance} ${unit === "passages" ? "passage" : "point"}${balance > 1 ? "s" : ""}`;
  }
  return formatUnitCount(balance, "points");
}

export function progressBalanceLabel(mode: LoyaltyMode, balance: number, target: number): string {
  const unit = loyaltyUnitForMode(mode);
  if (mode === "VISITS" || mode === "AMOUNT_TIERS") {
    return `${balance} / ${target} passages`;
  }
  return `${balance} points`;
}

export function earnActionLabel(mode: LoyaltyMode, earned?: number): string {
  if (mode === "VISITS") {
    if (earned === undefined) return "Valider le passage";
    return earned === 1 ? "Valider le passage" : `Valider +${earned} passages`;
  }
  if (mode === "AMOUNT_TIERS") {
    if (earned !== undefined && earned > 0) {
      return earned === 1 ? "Valider le gain" : `Valider +${earned} passages`;
    }
    return "Valider le gain";
  }
  if (earned !== undefined && earned > 0) {
    return earned === 1 ? "Valider +1 point" : `Valider +${earned} points`;
  }
  if (mode === "FIXED_POINTS") return "Valider les points";
  return "Valider les points";
}

export function earnGainLabel(mode: LoyaltyMode, earned: number): string {
  const unit = loyaltyUnitForMode(mode);
  if (mode === "FIXED_POINTS") {
    return earned === 1 ? "+1 point par achat" : `+${earned} points par achat`;
  }
  if (mode === "POINTS_BY_AMOUNT") {
    return earned === 1 ? "+1 point" : `+${earned} points`;
  }
  if (mode === "VISITS" || mode === "AMOUNT_TIERS") {
    return earned === 1 ? "+1 passage" : `+${earned} passages`;
  }
  return formatSignedUnitDelta(earned, unit);
}

export function rewardThresholdLabel(threshold: number, unit: LoyaltyUnit, rewardName: string): string {
  const qty = formatUnitCount(threshold, unit);
  return `${qty} = ${rewardName}`;
}

export function programEarnDescription(mode: LoyaltyMode, rules: ProgramRules): string {
  switch (mode) {
    case "VISITS": {
      const perScan = Math.max(1, Math.trunc(rules.visitsPerScan ?? 1));
      return perScan === 1 ? "1 passage par validation" : `${perScan} passages par validation`;
    }
    case "POINTS_BY_AMOUNT":
      return `${rules.pointsPerAmount ?? 1} point(s) pour ${(rules.amountForPoints ?? 1).toLocaleString("fr-FR")} € d'achat`;
    case "FIXED_POINTS":
      return `${rules.fixedPointsPerPurchase ?? 0} point${(rules.fixedPointsPerPurchase ?? 0) > 1 ? "s" : ""} par achat`;
    case "AMOUNT_TIERS":
      return "Gain selon le palier de montant";
    default:
      return "";
  }
}

export function programMinimumPurchaseLabel(rules: ProgramRules): string | null {
  const cents = minPurchaseCents(rules);
  if (cents <= 0) return null;
  return `Minimum d'achat : ${formatEurosFromCents(cents)}`;
}

export type HistoryTxMetadata = {
  mode?: LoyaltyMode;
  unit?: LoyaltyUnit;
  displayLabel?: string;
  earnLabel?: string;
};

export function historyEntryLabel(input: {
  type: string;
  pointsDelta: number;
  reason?: string | null;
  metadata?: HistoryTxMetadata | null;
  ruleApplied?: string | null;
}): { title: string; deltaLabel: string } {
  const meta = input.metadata ?? null;
  const unit = meta?.unit ?? "passages";
  const deltaLabel = formatSignedUnitDelta(input.pointsDelta, unit);

  if (meta?.displayLabel) {
    return { title: meta.displayLabel, deltaLabel };
  }

  if (input.type === "REDEEM_REWARD") {
    return { title: input.reason ? `Récompense · ${input.reason}` : "Récompense utilisée", deltaLabel };
  }
  if (input.type === "ADJUSTMENT") {
    return { title: input.reason ? `Ajustement · ${input.reason}` : "Ajustement", deltaLabel };
  }
  if (input.type === "CANCEL") {
    return { title: "Annulation", deltaLabel };
  }
  if (input.type === "EARN_VISIT") {
    if (meta?.mode === "FIXED_POINTS" || meta?.mode === "POINTS_BY_AMOUNT") {
      return {
        title: meta.earnLabel ?? input.ruleApplied ?? "Gain de points",
        deltaLabel,
      };
    }
    if (meta?.mode === "AMOUNT_TIERS") {
      return { title: meta.earnLabel ?? input.ruleApplied ?? "Gain de passage", deltaLabel };
    }
    return { title: meta?.earnLabel ?? "Passage validé", deltaLabel };
  }

  return { title: input.type, deltaLabel };
}
