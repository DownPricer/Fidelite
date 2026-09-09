"use client";

import { MerchantCardRenderer } from "@/components/fife-life/merchant-card-renderer";
import type { MerchantCardData } from "@/components/fife-life/types";
import type { CardTemplateConfig } from "@/lib/card-template-schema";

export function ProgramPreviewCard({
  merchantName,
  primaryColor,
  points,
  visitsRequired,
  rewardLabel,
  cardTemplate,
  logoUrl,
}: {
  merchantName: string;
  primaryColor: string;
  points: number;
  visitsRequired: number;
  rewardLabel: string;
  cardTemplate?: MerchantCardData["cardTemplate"];
  logoUrl?: string | null;
}) {
  const card: MerchantCardData = {
    id: "program-preview",
    merchantId: "preview",
    slug: "preview",
    name: merchantName,
    logoUrl: logoUrl ?? null,
    primaryColor,
    points,
    visitsRequired,
    rewardLabel,
    cardTemplate,
  };

  return (
    <MerchantCardRenderer
      template={cardTemplate}
      merchant={{ name: merchantName, logoUrl: logoUrl ?? null, primaryColor }}
      card={card}
      slug="preview"
      displayMode="adminPreview"
      showQr
      interactive
    />
  );
}
