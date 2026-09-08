import type { WalletTier } from "@/components/fife-life/types";

/** Clé interne alignée sur cartes-fidelite (bronze | argent | or | diamant). */
export type LoyaltyCardTierKey = "bronze" | "argent" | "or" | "diamant";

/** Fonds « good » uniquement — jamais les variantes fond-*. */
export const LOYALTY_CARD_BACKGROUNDS: Record<LoyaltyCardTierKey, string> = {
  bronze: "/cards/bronze-good.png",
  argent: "/cards/argent-good.png",
  or: "/cards/or-good.png",
  diamant: "/cards/diamant-good.png",
};

export const LOYALTY_CARD_TIER_LABELS: Record<LoyaltyCardTierKey, string> = {
  bronze: "Bronze",
  argent: "Argent",
  or: "Or",
  diamant: "Diamant",
};

export const WALLET_TIER_TO_CARD_KEY: Record<WalletTier, LoyaltyCardTierKey> = {
  Bronze: "bronze",
  Silver: "argent",
  Gold: "or",
  Diamond: "diamant",
};

/** Ordre du deck démo (tous les niveaux). */
export const DEMO_TIER_DECK_ORDER: WalletTier[] = ["Bronze", "Silver", "Gold", "Diamond"];

export function walletTierToCardKey(tier: WalletTier): LoyaltyCardTierKey {
  return WALLET_TIER_TO_CARD_KEY[tier];
}

export function getLoyaltyCardBackground(tier: WalletTier): string {
  return LOYALTY_CARD_BACKGROUNDS[WALLET_TIER_TO_CARD_KEY[tier]];
}

export function getLoyaltyCardTierLabel(tier: WalletTier): string {
  return LOYALTY_CARD_TIER_LABELS[WALLET_TIER_TO_CARD_KEY[tier]];
}
