import type { LoyaltyMode } from "@prisma/client";

import {
  normalizeResolvedPublishedTemplate,
  resolvePublishedMerchantCardTemplate,
} from "./merchant-card-template-service";
import { logMerchantCardSwitch } from "./merchant-card-switch-log";
import type { PublishedWalletTemplate } from "./wallet-card-template";

export type CardWithPublishedTemplate<T> = T & {
  loyaltyMode: LoyaltyMode;
  cardTemplate: PublishedWalletTemplate | null;
  cardTemplateId: string | null;
  cardTemplateVersion: number | null;
  cardTemplateUsedFallback: boolean;
};

export async function attachPublishedTemplates<
  T extends { merchantId: string; loyaltyMode?: LoyaltyMode | string | null },
>(cards: T[]): Promise<Array<CardWithPublishedTemplate<T>>> {
  if (cards.length === 0) return [];

  return Promise.all(
    cards.map(async (card) => {
      const mode = (card.loyaltyMode ?? "VISITS") as LoyaltyMode;
      const published = await resolvePublishedMerchantCardTemplate(card.merchantId, mode);
      const normalized = normalizeResolvedPublishedTemplate(published);
      logMerchantCardSwitch("wallet rafraîchi", {
        merchantId: card.merchantId,
        mode,
        templateId: published?.id ?? null,
        templateVersion: published?.version ?? null,
        usedFallback: published?.usedFallback ?? false,
        cardSlot: published?.cardSlot,
      });
      return {
        ...card,
        cardTemplate: normalized,
        loyaltyMode: mode,
        cardTemplateId: published?.id ?? null,
        cardTemplateVersion: published?.version ?? null,
        cardTemplateUsedFallback: published?.usedFallback ?? false,
      };
    }),
  );
}
