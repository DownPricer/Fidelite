export {
  DEMO_TIER_DECK_ORDER,
  getLoyaltyCardBackground as getDemoTierCardImage,
  walletTierToCardKey,
} from "@/lib/loyalty-card-assets";

export function hasDemoTierCardImages(): boolean {
  return true;
}
