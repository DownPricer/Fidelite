import type { WalletTier } from "@/components/fife-life/types";

/** Mapping centralisé niveau → visuel statique (mode démo uniquement). */
export const DEMO_TIER_CARD_IMAGES: Partial<Record<WalletTier, string>> = {
  Bronze: "/cards-test/bronze.png",
  Silver: "/cards-test/silver.png",
  Gold: "/cards-test/gold.png",
};

/** Niveaux présents dans le deck de démonstration (ordre du carousel). */
export const DEMO_TIER_DECK_ORDER: WalletTier[] = ["Bronze", "Silver", "Gold"];

export function getDemoTierCardImage(tier: WalletTier): string | null {
  return DEMO_TIER_CARD_IMAGES[tier] ?? null;
}

export function hasDemoTierCardImages(): boolean {
  return DEMO_TIER_DECK_ORDER.some((tier) => Boolean(DEMO_TIER_CARD_IMAGES[tier]));
}
