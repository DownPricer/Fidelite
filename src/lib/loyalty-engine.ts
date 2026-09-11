import type { LoyaltyMode } from "@prisma/client";
import { earnActionLabel } from "./loyalty-labels";
import { LoyaltyError } from "./loyalty";
import {
  computeEarnFromCents,
  minPurchaseCents,
  nextAmountTier,
  nextReward,
  unitLabel,
  validateTiers,
  type AppliedTier,
  type ProgramRules,
  type RewardConfig,
} from "./loyalty-program";
import { formatEurosFromCents } from "./money";

export type LoyaltyAction = "EARN" | "REDEEM";

export type EarnHistory = {
  lastEarnAt: Date | null;
  earnCountToday: number;
  pointsEarnedToday: number;
};

export type LoyaltyBlock = {
  code: string;
  title: string;
  message: string;
  details: string[];
};

export type EarnEvaluation = {
  ok: boolean;
  earned: number;
  newBalance: number;
  unit: string;
  purchaseAmountCents: number;
  ruleApplied: string;
  appliedTier: AppliedTier | null;
  nextTierHint: string | null;
  remainingPurchasesToNext: number | null;
  block: LoyaltyBlock | null;
  amountRequired: boolean;
};

export type NextBenefitView = {
  name: string;
  remaining: number;
  unit: string;
  progressLabel: string;
  missingLabel: string;
  euroEstimate: string | null;
  remainingPurchases: number | null;
};

function minutesBetween(from: Date, to: Date) {
  return Math.max(0, Math.floor((to.getTime() - from.getTime()) / 60_000));
}

function formatDurationMinutes(total: number) {
  if (total < 1) return "moins d'une minute";
  if (total < 60) return `${total} minute${total > 1 ? "s" : ""}`;
  const hours = Math.floor(total / 60);
  const minutes = total % 60;
  if (minutes === 0) return `${hours} heure${hours > 1 ? "s" : ""}`;
  return `${hours} h ${minutes} min`;
}

export function isPurchaseAmountRequired(mode: LoyaltyMode, rules: ProgramRules) {
  if (mode === "POINTS_BY_AMOUNT" || mode === "AMOUNT_TIERS") return true;
  if (rules.requirePurchaseAmount) return true;
  if ((rules.minPurchase ?? 0) > 0) return true;
  return false;
}

export function primaryEarnLabel(mode: LoyaltyMode, earned?: number) {
  return earnActionLabel(mode, earned);
}

export function progressLabelFor(mode: LoyaltyMode, points: number, threshold: number) {
  const unit = unitLabel(mode);
  if (mode === "VISITS" || mode === "AMOUNT_TIERS") {
    return `${points} / ${threshold} passages`;
  }
  return `${points} ${unit}`;
}

export function centsToEarnAtLeast(
  remainingPoints: number,
  rules: ProgramRules,
): number | null {
  if (remainingPoints <= 0) return 0;
  const pointsPerAmount = Math.max(0, Math.trunc(rules.pointsPerAmount ?? 1));
  const amountCents = Math.max(1, Math.round(Math.max(0.01, rules.amountForPoints ?? 1) * 100));
  if (pointsPerAmount <= 0) return null;
  if (rules.maxPointsPerTx && rules.maxPointsPerTx > 0 && remainingPoints > rules.maxPointsPerTx) {
    return null;
  }

  const needed = BigInt(remainingPoints);
  const denomPts = BigInt(pointsPerAmount);
  const amount = BigInt(amountCents);

  if (rules.rounding === "round") {
    const numerator = (needed * 2n - 1n) * amount;
    const cents = Number((numerator + denomPts * 2n - 1n) / (denomPts * 2n));
    return Number.isFinite(cents) ? Math.max(0, cents) : null;
  }

  const cents = Number((needed * amount + denomPts - 1n) / denomPts);
  return Number.isFinite(cents) ? Math.max(0, cents) : null;
}

export function remainingPurchasesToReward(
  mode: LoyaltyMode,
  rules: ProgramRules,
  remaining: number,
  earnedPerPurchase: number,
): number | null {
  if (remaining <= 0) return 0;
  if (earnedPerPurchase <= 0) return null;
  if (mode === "POINTS_BY_AMOUNT" || mode === "AMOUNT_TIERS") return null;
  if (remaining % earnedPerPurchase === 0) return remaining / earnedPerPurchase;
  return Math.ceil(remaining / earnedPerPurchase);
}

export function buildNextBenefit(
  rewards: RewardConfig[],
  balance: number,
  mode: LoyaltyMode,
  rules: ProgramRules,
  earnedPerPurchase = 0,
): NextBenefitView | null {
  const upcoming = nextReward(rewards, balance, mode);
  if (!upcoming) return null;
  const remaining = Math.max(0, upcoming.threshold - balance);
  const unit = upcoming.thresholdUnit === "points" ? "points" : "passages";
  const remainingPurchases = remainingPurchasesToReward(mode, rules, remaining, earnedPerPurchase);

  let euroEstimate: string | null = null;
  if (mode === "POINTS_BY_AMOUNT") {
    const cents = centsToEarnAtLeast(remaining, rules);
    if (cents !== null) {
      euroEstimate = `Encore ${formatEurosFromCents(cents)} d'achat pour débloquer cet avantage.`;
    }
  }

  const missingLabel =
    unit === "passages"
      ? `Encore ${remaining} passage${remaining > 1 ? "s" : ""} pour obtenir ${upcoming.name}.`
      : `Encore ${remaining} point${remaining > 1 ? "s" : ""} pour obtenir ${upcoming.name}.`;

  return {
    name: upcoming.name,
    remaining,
    unit,
    progressLabel: `${balance} / ${upcoming.threshold} ${unit}`,
    missingLabel,
    euroEstimate,
    remainingPurchases,
  };
}

function block(code: string, title: string, message: string, details: string[] = []): LoyaltyBlock {
  return { code, title, message, details };
}

export function evaluateEarn(input: {
  mode: LoyaltyMode;
  rules: ProgramRules;
  currentBalance: number;
  purchaseAmountCents?: number;
  history: EarnHistory;
  now?: Date;
  programActive?: boolean;
  merchantActive?: boolean;
}): EarnEvaluation {
  const now = input.now ?? new Date();
  const unit = unitLabel(input.mode);
  const amountRequired = isPurchaseAmountRequired(input.mode, input.rules);
  const purchaseAmountCents = input.purchaseAmountCents ?? 0;

  const fail = (earnedBlock: LoyaltyBlock, extra: Partial<EarnEvaluation> = {}): EarnEvaluation => ({
    ok: false,
    earned: 0,
    newBalance: input.currentBalance,
    unit,
    purchaseAmountCents,
    ruleApplied: earnedBlock.title,
    appliedTier: null,
    nextTierHint: null,
    remainingPurchasesToNext: null,
    block: earnedBlock,
    amountRequired,
    ...extra,
  });

  if (input.merchantActive === false) {
    return fail(block("merchant_inactive", "Commerce inactif", "Ce commerce n'accepte plus de passages."));
  }
  if (input.programActive === false) {
    return fail(block("program_inactive", "Programme inactif", "Le programme de fidélité n'est pas actif."));
  }

  if (input.mode === "AMOUNT_TIERS") {
    const invalid = validateTiers(input.rules.amountTiers ?? []);
    if (invalid) {
      return fail(block("tiers_invalid", "Paliers invalides", invalid));
    }
  }

  if (amountRequired && (input.purchaseAmountCents === undefined || purchaseAmountCents <= 0)) {
    return fail(block("amount_required", "Montant requis", "Indiquez le montant de l'achat."));
  }

  const minCents = minPurchaseCents(input.rules);
  if (minCents > 0 && purchaseAmountCents < minCents) {
    const missing = minCents - purchaseAmountCents;
    return fail(
      block(
        "min_purchase",
        "Montant insuffisant",
        `Il manque ${formatEurosFromCents(missing)} pour valider ${input.mode === "VISITS" ? "le passage" : "cet achat"}.`,
        [
          `Minimum requis : ${formatEurosFromCents(minCents)}`,
          `Montant saisi : ${formatEurosFromCents(purchaseAmountCents)}`,
          `Il manque ${formatEurosFromCents(missing)} pour valider ${input.mode === "VISITS" ? "le passage" : "cet achat"}.`,
        ],
      ),
    );
  }

  const minInterval =
    input.mode === "FIXED_POINTS"
      ? input.rules.minIntervalFixed ?? 0
      : input.rules.minIntervalMinutes ?? 0;

  if (minInterval > 0 && input.history.lastEarnAt) {
    const elapsed = minutesBetween(input.history.lastEarnAt, now);
    if (elapsed < minInterval) {
      const remaining = minInterval - elapsed;
      return fail(
        block(
          "min_interval",
          "Délai minimum non écoulé",
          `Un passage a déjà été validé il y a ${formatDurationMinutes(Math.max(1, elapsed))}.`,
          [
            `Un passage a déjà été validé il y a ${formatDurationMinutes(Math.max(1, elapsed))}.`,
            `Vous pourrez réessayer dans ${formatDurationMinutes(remaining)}.`,
          ],
        ),
      );
    }
  }

  if (input.mode === "POINTS_BY_AMOUNT") {
    const maxPointsPerDay = input.rules.maxPointsPerDay ?? 0;
    if (maxPointsPerDay > 0 && input.history.pointsEarnedToday >= maxPointsPerDay) {
      return fail(
        block(
          "max_points_day",
          "Limite quotidienne atteinte",
          `Limite quotidienne atteinte : ${maxPointsPerDay} points maximum.`,
        ),
      );
    }
  } else {
    const maxPerDay = input.rules.maxPerDay ?? 0;
    if (maxPerDay > 0 && input.history.earnCountToday >= maxPerDay) {
      return fail(
        block(
          "max_per_day",
          "Limite quotidienne atteinte",
          `Limite quotidienne atteinte : ${maxPerDay} ${maxPerDay > 1 ? "passages" : "passage"} maximum.`,
        ),
      );
    }
  }

  const computed = computeEarnFromCents(input.mode, input.rules, purchaseAmountCents);
  let earned = computed.earned;

  if (input.mode === "POINTS_BY_AMOUNT") {
    const maxPointsPerDay = input.rules.maxPointsPerDay ?? 0;
    if (maxPointsPerDay > 0) {
      const remainingToday = maxPointsPerDay - input.history.pointsEarnedToday;
      if (remainingToday <= 0) {
        return fail(
          block(
            "max_points_day",
            "Limite quotidienne atteinte",
            `Limite quotidienne atteinte : ${maxPointsPerDay} points maximum.`,
          ),
        );
      }
      if (earned > remainingToday) {
        earned = remainingToday;
      }
    }
  }

  if (earned <= 0) {
    if (input.mode === "AMOUNT_TIERS") {
      return fail(
        block("no_tier", "Aucun palier", "Aucun palier ne correspond à ce montant."),
        { appliedTier: computed.tier },
      );
    }
    return fail(block("no_earn", "Aucun gain", "Aucun gain applicable pour cette transaction."));
  }

  const nextTier = input.mode === "AMOUNT_TIERS" ? nextAmountTier(input.rules, purchaseAmountCents) : null;
  const nextTierHint =
    nextTier && nextTier.minAmountCents > purchaseAmountCents
      ? `Ajoutez ${formatEurosFromCents(nextTier.minAmountCents - purchaseAmountCents)} à cet achat pour atteindre le palier suivant.`
      : null;

  let ruleApplied = `${earned} ${unit}`;
  if (input.mode === "POINTS_BY_AMOUNT") {
    ruleApplied = `${input.rules.pointsPerAmount ?? 1} point(s) pour ${formatEurosFromCents(Math.round((input.rules.amountForPoints ?? 1) * 100))} · arrondi ${input.rules.rounding === "round" ? "au plus proche" : "inférieur"}`;
  } else if (input.mode === "FIXED_POINTS") {
    ruleApplied = `${input.rules.fixedPointsPerPurchase ?? 0} points par achat`;
  } else if (input.mode === "AMOUNT_TIERS" && computed.tier) {
    const maxLabel = computed.tier.maxAmountCents === null ? "et plus" : formatEurosFromCents(computed.tier.maxAmountCents);
    ruleApplied = `Palier de ${formatEurosFromCents(computed.tier.minAmountCents)} à ${maxLabel}`;
  } else if (input.mode === "VISITS") {
    ruleApplied = `${input.rules.visitsPerScan ?? 1} passage(s) par validation`;
  }

  return {
    ok: true,
    earned,
    newBalance: input.currentBalance + earned,
    unit,
    purchaseAmountCents,
    ruleApplied,
    appliedTier: computed.tier,
    nextTierHint,
    remainingPurchasesToNext: null,
    block: null,
    amountRequired,
  };
}

export function earnPreviewLines(evaluation: EarnEvaluation, next: NextBenefitView | null): string[] {
  const lines: string[] = [];
  if (evaluation.purchaseAmountCents > 0) {
    lines.push(`Achat de ${formatEurosFromCents(evaluation.purchaseAmountCents)}`);
  }
  if (evaluation.ok) {
    lines.push(`+${evaluation.earned} ${evaluation.unit}`);
    if (evaluation.unit === "passages") {
      lines.push(`Progression : ${evaluation.newBalance} ${evaluation.unit}`);
    } else {
      lines.push(`Nouveau solde : ${evaluation.newBalance} ${evaluation.unit}`);
    }
    if (evaluation.appliedTier) {
      const maxLabel =
        evaluation.appliedTier.maxAmountCents === null
          ? "et plus"
          : formatEurosFromCents(evaluation.appliedTier.maxAmountCents);
      lines.push(
        `Palier appliqué : de ${formatEurosFromCents(evaluation.appliedTier.minAmountCents)} à ${maxLabel}`,
      );
      lines.push(`Gain : +${evaluation.earned} ${evaluation.unit}`);
    }
    if (evaluation.nextTierHint) lines.push(evaluation.nextTierHint);
    if (next) {
      if (next.remainingPurchases && next.remainingPurchases > 0) {
        lines.push(
          `Encore ${next.remainingPurchases} achat${next.remainingPurchases > 1 ? "s" : ""} similaire${next.remainingPurchases > 1 ? "s" : ""} avant le prochain avantage`,
        );
      } else {
        lines.push(next.euroEstimate ?? next.missingLabel);
      }
    }
  }
  return lines;
}

export function assertEvaluationOk(evaluation: EarnEvaluation) {
  if (evaluation.ok) return evaluation;
  const message = [evaluation.block?.title, ...(evaluation.block?.details ?? [evaluation.block?.message ?? ""])]
    .filter(Boolean)
    .join("\n");
  throw new LoyaltyError(message || "Validation impossible.");
}
