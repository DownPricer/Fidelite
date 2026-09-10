import type { LoyaltyMode, MerchantCardSlot } from "@prisma/client";

/** Cinq emplacements indépendants affichés dans le super-admin. */
export const ALL_MERCHANT_CARD_SLOTS: MerchantCardSlot[] = [
  "GENERAL",
  "VISITS",
  "POINTS_BY_AMOUNT",
  "FIXED_POINTS",
  "AMOUNT_TIERS",
];

export const CARD_SLOT_TITLES: Record<MerchantCardSlot, string> = {
  GENERAL: "Carte générale du commerce",
  VISITS: "Carte par passages",
  POINTS_BY_AMOUNT: "Carte points selon le montant",
  FIXED_POINTS: "Carte points fixes par achat",
  AMOUNT_TIERS: "Carte par paliers de montant",
};

export const CARD_SLOT_SLUGS: Record<MerchantCardSlot, string> = {
  GENERAL: "general",
  VISITS: "visits",
  POINTS_BY_AMOUNT: "points-by-amount",
  FIXED_POINTS: "fixed-points",
  AMOUNT_TIERS: "amount-tiers",
};

const SLUG_TO_CARD_SLOT = Object.fromEntries(
  Object.entries(CARD_SLOT_SLUGS).map(([slot, slug]) => [slug, slot]),
) as Record<string, MerchantCardSlot>;

export function parseCardSlotSlug(slug: string | null | undefined): MerchantCardSlot | null {
  if (!slug) return null;
  return SLUG_TO_CARD_SLOT[slug.trim().toLowerCase()] ?? null;
}

export function cardSlotEditorPath(merchantId: string, slot: MerchantCardSlot) {
  return `/super-admin/cartes/${merchantId}/${CARD_SLOT_SLUGS[slot]}/editeur`;
}

export function merchantCardsGalleryPath(merchantId: string) {
  return `/super-admin/commerces/${merchantId}/cartes`;
}

export function isLoyaltyProgramSlot(slot: MerchantCardSlot): slot is LoyaltyMode {
  return slot !== "GENERAL";
}

export function loyaltyModeForCardSlot(slot: MerchantCardSlot): LoyaltyMode | null {
  return isLoyaltyProgramSlot(slot) ? slot : null;
}

export function cardSlotForLoyaltyMode(mode: LoyaltyMode): MerchantCardSlot {
  return mode;
}
