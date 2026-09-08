import { resolveTier } from "@/components/fife-life/tier";
import type { WalletTier } from "@/components/fife-life/types";
import { getLoyaltyCardTierLabel, walletTierToCardKey } from "@/lib/loyalty-card-assets";

export type LoyaltyCardQrMode = "engraved" | "standard";

export type LoyaltyCardViewModel = {
  tierKey: ReturnType<typeof walletTierToCardKey>;
  tierLabel: string;
  name: string;
  points: number;
  pointsText: string;
  progress: number;
  status: string;
  showProgress: boolean;
  qrMode: LoyaltyCardQrMode;
  nameLength: "normal" | "long" | "very-long";
  pointsLength: "normal" | "long" | "very-long";
  statusLength: "normal" | "long";
};

const numberFormat = new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 });

export function formatLoyaltyPoints(value: number): string {
  return numberFormat.format(Math.max(0, Math.round(value)));
}

function textLengthClass(
  length: number,
  longAt: number,
  veryLongAt: number,
): "normal" | "long" | "very-long" {
  if (length > veryLongAt) return "very-long";
  if (length > longAt) return "long";
  return "normal";
}

export function buildLoyaltyCardViewModel(input: {
  tier: WalletTier;
  name: string;
  points: number;
  qrMode?: LoyaltyCardQrMode;
  statusText?: string;
  progressPercent?: number;
}): LoyaltyCardViewModel {
  const tierInfo = resolveTier(input.points);
  const tier = input.tier;
  const tierKey = walletTierToCardKey(tier);
  const tierLabel = getLoyaltyCardTierLabel(tier);
  const points = Math.max(0, Math.round(input.points));
  const qrMode = input.qrMode ?? "engraved";

  let progress = 0;
  let status = "";

  if (input.statusText != null) {
    status = input.statusText;
  } else if (tierInfo.next == null) {
    progress = 100;
    status = tierKey === "diamant" ? "Statut ultime atteint" : "Statut maximal atteint";
  } else {
    progress = Math.min(100, Math.max(0, tierInfo.progress * 100));
    status = `Vers ${tierInfo.nextName} · ${formatLoyaltyPoints(tierInfo.remaining)} pts restants`;
  }

  if (input.progressPercent != null) {
    progress = Math.min(100, Math.max(0, input.progressPercent));
  }

  const pointsText = `${formatLoyaltyPoints(points)} pts`;
  const trimmedName = input.name.trim() || "Membre";

  return {
    tierKey,
    tierLabel,
    name: trimmedName,
    points,
    pointsText,
    progress,
    status,
    showProgress: tierInfo.next != null || tierInfo.next == null,
    qrMode,
    nameLength: textLengthClass(trimmedName.length, 23, 42),
    pointsLength: textLengthClass(pointsText.length, 14, 20),
    statusLength: status.length > 53 ? "long" : "normal",
  };
}
