"use client";

import { MerchantInteractiveCard } from "@/components/fife-life/merchant-interactive-card";
import type { MerchantCardData } from "@/components/fife-life/types";

export function ProgramPreviewCard({
  merchantName,
  primaryColor,
  points,
  visitsRequired,
  rewardLabel,
}: {
  merchantName: string;
  primaryColor: string;
  points: number;
  visitsRequired: number;
  rewardLabel: string;
}) {
  const card: MerchantCardData = {
    id: "program-preview",
    merchantId: "preview",
    slug: "",
    name: merchantName,
    logoUrl: null,
    primaryColor,
    points,
    visitsRequired,
    rewardLabel,
  };

  return (
    <MerchantInteractiveCard
      card={card}
      slug=""
      preview
      showQr={false}
      interactive
    />
  );
}
