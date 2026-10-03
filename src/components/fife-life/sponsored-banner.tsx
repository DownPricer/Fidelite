"use client";

import { useState } from "react";
import { SponsoredOfferCard, type SponsoredAd, type SponsoredVariant } from "./sponsored-offer-card";

export type { SponsoredAd, SponsoredVariant };

const LAYOUT_BY_VARIANT: Record<SponsoredVariant, "feed" | "compact"> = {
  search: "feed",
  avantages: "feed",
  home: "feed",
  notifications: "compact",
};

export function SponsoredBanner({
  ad,
  variant = "search",
  onDismiss,
}: {
  ad: SponsoredAd;
  variant?: SponsoredVariant;
  onDismiss?: () => void;
}) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  const handleDismiss = onDismiss ?? (() => setDismissed(true));

  return (
    <SponsoredOfferCard
      ad={ad}
      layout={LAYOUT_BY_VARIANT[variant]}
      variant={variant}
      onDismiss={handleDismiss}
    />
  );
}
