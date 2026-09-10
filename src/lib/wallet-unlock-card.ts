import type { LoyaltyMode } from "@prisma/client";

import type { MerchantCardData } from "@/components/fife-life/types";
import type { CardTemplateConfig } from "./card-template-schema";
import {
  hasRenderReadyTemplate,
  normalizePublishedWalletTemplate,
  type PublishedWalletTemplate,
} from "./wallet-card-template";
import type { WalletEventPayload } from "./wallet-unlock";

export const UNLOCK_REVEAL_DISPLAY_MODE = "personalized" as const;

function parseTemplateFromPayload(payload: Record<string, unknown>): PublishedWalletTemplate | null {
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

export function cardFromUnlockPayload(event: WalletEventPayload): MerchantCardData {
  const payload = event.payload;
  const name =
    typeof payload.merchantName === "string" ? payload.merchantName : "Nouveau commerce";
  const cardTemplate = parseTemplateFromPayload(payload);

  return {
    id: event.customerMembershipId ?? `tmp-${event.id}`,
    merchantId: event.merchantId ?? "",
    slug: typeof payload.slug === "string" ? payload.slug : "",
    name,
    logoUrl: typeof payload.logoUrl === "string" ? payload.logoUrl : null,
    primaryColor:
      typeof payload.primaryColor === "string" ? payload.primaryColor : "#8557ff",
    points: typeof payload.points === "number" ? payload.points : 0,
    visitsRequired:
      typeof payload.visitsRequired === "number" ? payload.visitsRequired : 10,
    rewardLabel:
      typeof payload.rewardLabel === "string" ? payload.rewardLabel : "Récompense",
    loyaltyMode:
      typeof payload.loyaltyMode === "string"
        ? (payload.loyaltyMode as LoyaltyMode)
        : undefined,
    cardTemplate,
  };
}

export function isUnlockCardReadyForReveal(card: MerchantCardData | null) {
  if (!card) return false;
  if (hasRenderReadyTemplate(card)) return true;
  return Boolean(card.slug && card.name);
}

export async function fetchUnlockCardDetail(
  event: WalletEventPayload,
): Promise<MerchantCardData | null> {
  const params = new URLSearchParams();
  if (event.customerMembershipId) params.set("membershipId", event.customerMembershipId);
  if (event.merchantId) params.set("merchantId", event.merchantId);

  try {
    const response = await fetch(`/api/customer/wallet/cards/detail?${params.toString()}`, {
      cache: "no-store",
      credentials: "same-origin",
    });
    if (!response.ok) return cardFromUnlockPayload(event);
    const data = (await response.json()) as { card?: MerchantCardData };
    if (!data.card) return cardFromUnlockPayload(event);
    return data.card;
  } catch {
    return cardFromUnlockPayload(event);
  }
}
