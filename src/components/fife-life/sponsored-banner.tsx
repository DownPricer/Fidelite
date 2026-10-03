"use client";

import { useState } from "react";
import { SponsoredOfferCard, type SponsoredAd, type SponsoredVariant } from "./sponsored-offer-card";

export type { SponsoredAd, SponsoredVariant };

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

  return <SponsoredOfferCard ad={ad} variant={variant} onDismiss={handleDismiss} />;
}
