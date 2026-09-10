import type { LoyaltyMode } from "@prisma/client";

import type { MerchantCardData } from "@/components/fife-life/types";
import type { CardTemplateConfig } from "./card-template-schema";
import { normalizePublishedWalletTemplate, type PublishedWalletTemplate } from "./wallet-card-template";

function parseCardTemplateFromPayload(payload: Record<string, unknown>): PublishedWalletTemplate | null {
  const raw = payload.cardTemplate;
  if (!raw || typeof raw !== "object") return null;
  const template = raw as {
    backgroundUrl?: string | null;
    config?: CardTemplateConfig;
    loyaltyMode?: LoyaltyMode;
  };
  if (!template.config?.elements?.length) return null;
  return normalizePublishedWalletTemplate({
    backgroundUrl: template.backgroundUrl ?? null,
    config: template.config,
    loyaltyMode: template.loyaltyMode ?? "VISITS",
  });
}

/** Applique un événement MERCHANT_CARD_UPDATED sans animation de déblocage. */
export function mergeMerchantCardUpdate(
  card: MerchantCardData,
  payload: Record<string, unknown>,
): MerchantCardData {
  const cardTemplate = parseCardTemplateFromPayload(payload);
  return {
    ...card,
    points: typeof payload.points === "number" ? payload.points : card.points,
    visitsRequired:
      typeof payload.visitsRequired === "number" ? payload.visitsRequired : card.visitsRequired,
    rewardLabel:
      typeof payload.rewardLabel === "string" ? payload.rewardLabel : card.rewardLabel,
    loyaltyMode:
      typeof payload.loyaltyMode === "string"
        ? (payload.loyaltyMode as LoyaltyMode)
        : card.loyaltyMode,
    cardTemplate: cardTemplate ?? card.cardTemplate,
    cardTemplateId:
      typeof payload.templateId === "string" ? payload.templateId : card.cardTemplateId ?? null,
    cardTemplateVersion:
      typeof payload.templateVersion === "number"
        ? payload.templateVersion
        : card.cardTemplateVersion ?? null,
    cardTemplateUsedFallback:
      typeof payload.usedFallback === "boolean"
        ? payload.usedFallback
        : card.cardTemplateUsedFallback ?? false,
  };
}
