"use client";

import { useEffect, useState } from "react";
import { DEMO_CLIENT_NUMBER } from "@/lib/demo-visual";
import { getCachedQr, loadUniversalQr } from "./qr-cache";
import { PREVIEW_QR } from "./preview-data";
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
  clientNumber = null,
  large = false,
  mode = "detail",
  tierOverride,
  interactive = true,
  demoTierPreview = false,
  preview = false,
  qrZoomEnabled = false,
}: {
  points: number;
  customerName: string;
  clientNumber?: string | null;
  large?: boolean;
  mode?: GlobalCardMode;
  tierOverride?: WalletTier;
  interactive?: boolean;
  demoTierPreview?: boolean;
  preview?: boolean;
  qrZoomEnabled?: boolean;
}) {
  const tier = resolveTier(points);
  const tierName = tierOverride ?? tier.name;
  const displayPoints = tierOverride && demoTierPreview ? DEMO_TIER_POINTS[tierName] : points;
  const showQrOnCard = mode === "wallet" && large;

  const [qr, setQr] = useState<string | null>(() =>
    showQrOnCard ? (preview ? PREVIEW_QR : getCachedQr("fife-life")) : null,
  );
  useEffect(() => {
    if (!showQrOnCard || preview) return;

    let cancelled = false;
    void loadUniversalQr("fife-life").then((next) => {
      if (cancelled) return;
      if (next) setQr(next);
    });
    return () => {
      cancelled = true;
    };
  }, [showQrOnCard, preview]);

  const name = customerName.trim() || "Membre";
  const effectiveClientNumber = clientNumber ?? (preview ? DEMO_CLIENT_NUMBER : null);

  return (
    <InteractiveLoyaltyCard
      tier={tierName}
      name={name}
      points={displayPoints}
      showQr={showQrOnCard}
      qrSrc={showQrOnCard ? (preview ? PREVIEW_QR : qr) : null}
      qrMode="standard"
      clientNumber={showQrOnCard ? effectiveClientNumber : null}
      qrZoomEnabled={showQrOnCard && qrZoomEnabled}
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
  const parts = [input.displayName?.trim(), `${input.firstName} ${input.lastName ?? ""}`.trim()].filter(Boolean);
  return parts[0] || input.firstName || "Membre";
}
