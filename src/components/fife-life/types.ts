export type WalletTier = "Bronze" | "Silver" | "Gold" | "Diamond";

import type { CardTemplateConfig } from "@/lib/card-template-schema";
import type { LoyaltyMode } from "@prisma/client";

export type MerchantCardData = {
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
  /** Gabarit publié super-admin, s'il existe. */
  cardTemplate?: {
    backgroundUrl?: string | null;
    config: CardTemplateConfig;
    loyaltyMode: LoyaltyMode;
  } | null;
  cardTemplateId?: string | null;
  cardTemplateVersion?: number | null;
  cardTemplateUsedFallback?: boolean;
  /** Niveau Fife Life pour l’image statique en mode démo. */
  demoTier?: WalletTier;
};

export type CardHistoryItem = {
  id: string;
  type: string;
  pointsDelta: number;
  reason: string | null;
  createdAt: string;
  metadata?: Record<string, unknown> | null;
  ruleApplied?: string | null;
};

export type WalletEventPayload = {
  id: string;
  type:
    | "CARD_UNLOCKED"
    | "CARD_CREATED"
    | "CARD_REMOVED"
    | "MERCHANT_CARD_UPDATED"
    | "MERCHANT_POINTS_UPDATED"
    | "REWARD_REDEEMED"
    | "FIFE_LIFE_POINTS_UPDATED"
    | string;
  createdAt: string;
  merchantId: string | null;
  customerMembershipId: string | null;
  payload: Record<string, unknown>;
  acknowledgedAt?: string | null;
};
