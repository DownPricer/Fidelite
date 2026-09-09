import type { CardTemplateConfig } from "./card-template-schema";
import type { LoyaltyMode } from "@prisma/client";
import type { MerchantCardData } from "@/components/fife-life/types";

export type ScanResultCardPayload = {
  merchant?: {
    name: string;
    slug: string;
    logoUrl: string | null;
    primaryColor: string;
  };
  cardTemplate?: {
    backgroundUrl?: string | null;
    config: CardTemplateConfig;
    loyaltyMode: LoyaltyMode;
  } | null;
};

export function scanResultToMerchantCard(
  result: {
    firstName: string;
    points: number;
    visitsRequired: number;
    rewardLabel: string;
  } & ScanResultCardPayload,
): { card: MerchantCardData; merchant: NonNullable<ScanResultCardPayload["merchant"]> } | null {
  if (!result.merchant) return null;
  return {
    merchant: result.merchant,
    card: {
      id: "scan-result",
      merchantId: result.merchant.slug,
      slug: result.merchant.slug,
      name: result.merchant.name,
      logoUrl: result.merchant.logoUrl,
      primaryColor: result.merchant.primaryColor,
      points: result.points,
      visitsRequired: result.visitsRequired,
      rewardLabel: result.rewardLabel,
      cardTemplate: result.cardTemplate ?? null,
    },
  };
}
