"use client";

import { useEffect, useState } from "react";
import { displayFullName } from "@/lib/customer-profile";
import { getCachedQr, loadUniversalQr } from "./qr-cache";
import { InteractiveLoyaltyCard } from "./interactive-loyalty-card";
import { resolveTier } from "./tier";
import type { WalletTier } from "./types";

type GlobalCardMode = "detail" | "wallet";

const DEMO_TIER_POINTS: Record<WalletTier, number> = {
  Bronze: 50,
  Silver: 180,
  Gold: 350,
  Diamond: 600,
};

export function GlobalCard({
  points,
  customerName,
  large = false,
  mode = "detail",
  tierOverride,
  interactive = true,
  demoTierPreview = false,
}: {
  points: number;
  customerName: string;
  large?: boolean;
  mode?: GlobalCardMode;
  tierOverride?: WalletTier;
  interactive?: boolean;
  demoTierPreview?: boolean;
}) {
  const tier = resolveTier(points);
  const tierName = tierOverride ?? tier.name;
  const displayPoints = tierOverride && demoTierPreview ? DEMO_TIER_POINTS[tierName] : points;
  const showQrOnCard = mode === "wallet" && large;

  const [qr, setQr] = useState<string | null>(() => (showQrOnCard ? getCachedQr() : null));

  useEffect(() => {
    if (!showQrOnCard) return;
    if (qr) return;

    let cancelled = false;
    void loadUniversalQr("fife-life").then((next) => {
      if (cancelled) return;
      if (next) setQr(next);
    });
    return () => {
      cancelled = true;
    };
  }, [showQrOnCard, qr]);

  const name = customerName.trim() || "Membre";

  return (
    <InteractiveLoyaltyCard
      tier={tierName}
      name={name}
      points={displayPoints}
      showQr={showQrOnCard}
      qrSrc={showQrOnCard ? qr : null}
      qrMode="engraved"
      interactive={interactive}
      className={large ? "loyalty-card--large" : undefined}
      shellClassName="w-full"
    />
  );
}

/** Utilitaire pour composer un nom complet depuis prénom/nom. */
export function loyaltyCardDisplayName(input: {
  firstName: string;
  lastName?: string | null;
  displayName?: string | null;
}) {
  return (
    displayFullName({
      firstName: input.firstName,
      lastName: input.lastName ?? null,
      displayName: input.displayName ?? null,
    }) ||
    input.firstName ||
    "Membre"
  );
}
