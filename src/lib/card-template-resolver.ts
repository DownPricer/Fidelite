import type { LoyaltyMode } from "@prisma/client";

import {
  normalizeResolvedPublishedTemplate,
  resolvePublishedMerchantCardTemplate,
} from "./merchant-card-template-service";

/** @deprecated Utiliser resolvePublishedMerchantCardTemplate */
export async function getPublishedCardTemplate(merchantId: string, loyaltyMode?: LoyaltyMode) {
  if (!loyaltyMode) return null;
  const resolved = await resolvePublishedMerchantCardTemplate(merchantId, loyaltyMode);
  const normalized = normalizeResolvedPublishedTemplate(resolved);
  if (!normalized) return null;
  return {
    id: resolved!.id,
    backgroundUrl: normalized.backgroundUrl,
    config: normalized.config,
    loyaltyMode: normalized.loyaltyMode,
    version: resolved!.version,
  };
}

export { resolvePublishedMerchantCardTemplate } from "./merchant-card-template-service";
