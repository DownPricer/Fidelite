import type { LoyaltyMode, WalletEventType } from "@prisma/client";

export type WalletEventPayload = {
  id: string;
  type: string;
  createdAt: string;
  merchantId: string | null;
  customerMembershipId: string | null;
  payload: Record<string, unknown>;
  acknowledgedAt?: string | null;
};

export type UnlockCardData = {
  id: string;
  merchantId: string;
  slug: string;
  name: string;
  logoUrl: string | null;
  primaryColor: string;
  points: number;
  visitsRequired: number;
  rewardLabel: string;
  loyaltyMode?: LoyaltyMode;
};

export const UNLOCK_EVENT_TYPES: WalletEventType[] = ["CARD_UNLOCKED", "CARD_CREATED"];

export function isUnlockEventType(type: string): boolean {
  return UNLOCK_EVENT_TYPES.includes(type as WalletEventType);
}

export function serializeWalletEvent(event: {
  id: string;
  type: WalletEventType;
  createdAt: Date;
  merchantId: string | null;
  customerMembershipId: string | null;
  payload: unknown;
  acknowledgedAt?: Date | null;
}): WalletEventPayload {
  return {
    id: event.id,
    type: event.type,
    createdAt: event.createdAt.toISOString(),
    merchantId: event.merchantId,
    customerMembershipId: event.customerMembershipId,
    payload: (event.payload ?? {}) as Record<string, unknown>,
    acknowledgedAt: event.acknowledgedAt?.toISOString() ?? null,
  };
}

export function cardFromUnlockEvent(event: WalletEventPayload): UnlockCardData {
  const name =
    typeof event.payload.merchantName === "string" ? event.payload.merchantName : "Nouveau commerce";
  return {
    id: event.customerMembershipId ?? `tmp-${event.id}`,
    merchantId: event.merchantId ?? "",
    slug: typeof event.payload.slug === "string" ? event.payload.slug : "",
    name,
    logoUrl: typeof event.payload.logoUrl === "string" ? event.payload.logoUrl : null,
    primaryColor:
      typeof event.payload.primaryColor === "string" ? event.payload.primaryColor : "#8557ff",
    points: typeof event.payload.points === "number" ? event.payload.points : 0,
    visitsRequired:
      typeof event.payload.visitsRequired === "number" ? event.payload.visitsRequired : 10,
    rewardLabel:
      typeof event.payload.rewardLabel === "string" ? event.payload.rewardLabel : "Récompense",
    loyaltyMode:
      typeof event.payload.loyaltyMode === "string"
        ? (event.payload.loyaltyMode as LoyaltyMode)
        : undefined,
  };
}

/** True si l’animation de déblocage doit être jouée (source de vérité : acquittement serveur). */
export function shouldPlayUnlockAnimation(
  event: Pick<WalletEventPayload, "id" | "acknowledgedAt">,
  processedInSession: Set<string>,
): boolean {
  if (event.acknowledgedAt) return false;
  if (processedInSession.has(event.id)) return false;
  return true;
}
