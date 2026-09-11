import type { CardNextRewardStyle } from "./card-template-schema";
import type { LoyaltyWidgetProgress } from "@/components/fife-life/loyalty-widget-view";

export const NEXT_REWARD_STYLE_VARIANTS = [
  "compactBadge",
  "glowingCapsule",
  "glassPanel",
  "ribbon",
  "giftIcon",
  "comingSoon",
  "minimalArrow",
  "miniProgress",
] as const;

export type NextRewardStyleVariant = (typeof NEXT_REWARD_STYLE_VARIANTS)[number];

export const NEXT_REWARD_STYLE_LABELS: Record<NextRewardStyleVariant, string> = {
  compactBadge: "Badge compact",
  glowingCapsule: "Capsule lumineuse",
  glassPanel: "Panneau glassy",
  ribbon: "Ruban",
  giftIcon: "Icône cadeau",
  comingSoon: "Bientôt disponible",
  minimalArrow: "Minimal avec flèche",
  miniProgress: "Mini-progression",
};

export function defaultNextRewardStyle(primaryColor = "#875BFF"): CardNextRewardStyle {
  return {
    variant: "compactBadge",
    primaryColor,
    textColor: "#FFFFFF",
    backgroundColor: "#2A1F4D",
    borderColor: primaryColor,
    borderWidth: 1,
    fontFamily: "system",
    fontSize: 12,
    icon: "🎁",
    glow: false,
    shadow: true,
    textAlign: "center",
    showRemaining: true,
    hideWhenComplete: false,
  };
}

export type NextRewardViewModel = {
  title: string;
  subtitle: string | null;
  detail: string | null;
  allUnlocked: boolean;
  progressPct: number;
};

export function buildNextRewardViewModel(
  progress: LoyaltyWidgetProgress,
  loyaltyMode?: string | null,
): NextRewardViewModel {
  const current = progress.current;
  const target = Math.max(1, progress.target);
  const remaining = Math.max(0, target - current);
  const allUnlocked = remaining <= 0;
  const unit =
    loyaltyMode === "VISITS" || progress.label.includes("passage") ? "passages" : "points";
  const rewardName = progress.nextRewardName ?? progress.nextReward ?? null;

  let subtitle: string | null = null;
  if (!allUnlocked && rewardName) {
    if (unit === "passages") {
      subtitle = `Encore ${remaining} passage${remaining > 1 ? "s" : ""}`;
    } else {
      subtitle = `Encore ${remaining} point${remaining > 1 ? "s" : ""}`;
    }
  }

  let detail: string | null = null;
  if (!allUnlocked && rewardName) {
    if (unit === "points" && progress.nextRewardEuroEstimate) {
      detail = progress.nextRewardEuroEstimate;
    } else if (rewardName) {
      detail =
        unit === "passages"
          ? `${rewardName} dans ${remaining} passage${remaining > 1 ? "s" : ""}`
          : `${rewardName} dans ${remaining} point${remaining > 1 ? "s" : ""}`;
    }
  }

  return {
    title: allUnlocked
      ? "Tous les avantages sont débloqués"
      : rewardName
        ? progress.nextRewardHeadline ?? `Prochain avantage`
        : "Prochain avantage",
    subtitle,
    detail,
    allUnlocked,
    progressPct: Math.min(100, Math.max(0, (current / target) * 100)),
  };
}
