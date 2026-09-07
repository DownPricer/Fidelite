export type WalletTier = "Bronze" | "Silver" | "Gold" | "Diamond";

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
  /** Niveau Fife Life pour l’image statique en mode démo. */
  demoTier?: WalletTier;
};

export type CardHistoryItem = {
  id: string;
  type: string;
  pointsDelta: number;
  reason: string | null;
  createdAt: string;
};

export type WalletEventPayload = {
  id: string;
  type: "CARD_CREATED" | "MERCHANT_POINTS_UPDATED" | "REWARD_REDEEMED" | "FIFE_LIFE_POINTS_UPDATED" | string;
  createdAt: string;
  merchantId: string | null;
  customerMembershipId: string | null;
  payload: Record<string, unknown>;
};
