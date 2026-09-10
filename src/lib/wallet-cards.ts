import type { LoyaltyMode } from "@prisma/client";

import {
  normalizeResolvedPublishedTemplate,
  resolvePublishedMerchantCardTemplate,
} from "./merchant-card-template-service";
import type { PublishedWalletTemplate } from "./wallet-card-template";

export async function attachPublishedTemplates<
  T extends { merchantId: string; loyaltyMode?: LoyaltyMode | string | null },
>(cards: T[]) {
  if (cards.length === 0) return cards;

  return Promise.all(
    cards.map(async (card) => {
      const mode = (card.loyaltyMode ?? "VISITS") as LoyaltyMode;
      const published = await resolvePublishedMerchantCardTemplate(card.merchantId, mode);
      const normalized = normalizeResolvedPublishedTemplate(published);
      return {
        ...card,
        cardTemplate: normalized as PublishedWalletTemplate | null,
        loyaltyMode: mode,
      };
    }),
  );
}
