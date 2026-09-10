"use client";

import { MerchantCardRenderer } from "@/components/fife-life/merchant-card-renderer";
import type { MerchantCardData } from "@/components/fife-life/types";
import type { LoyaltyMode } from "@prisma/client";

export function ProgramPreviewCard({
  merchantId,
  merchantName,
  primaryColor,
  points,
  visitsRequired,
  rewardLabel,
  cardTemplate,
  logoUrl,
  loyaltyMode,
  templateVersion,
  fallbackNotice,
}: {
  merchantId: string;
  merchantName: string;
  primaryColor: string;
  points: number;
  visitsRequired: number;
  rewardLabel: string;
  cardTemplate?: MerchantCardData["cardTemplate"];
  logoUrl?: string | null;
  loyaltyMode: LoyaltyMode;
  templateVersion?: number | null;
  fallbackNotice?: string | null;
}) {
  const card: MerchantCardData = {
    id: "program-preview",
    merchantId,
    slug: "preview",
    name: merchantName,
    logoUrl: logoUrl ?? null,
    primaryColor,
    points,
    visitsRequired,
    rewardLabel,
    loyaltyMode,
    cardTemplate,
    cardTemplateVersion: templateVersion ?? null,
  };

  return (
    <div className="space-y-2">
      {fallbackNotice ? (
        <p className="text-center text-xs text-amber-200">{fallbackNotice}</p>
      ) : null}
      <MerchantCardRenderer
        key={`${merchantId}:${loyaltyMode}:${templateVersion ?? "none"}:${cardTemplate?.backgroundUrl ?? "empty"}`}
        template={cardTemplate}
        merchant={{ name: merchantName, logoUrl: logoUrl ?? null, primaryColor }}
        card={card}
        slug="preview"
        displayMode="adminPreview"
        showQr
        interactive
      />
    </div>
  );
}
