"use client";

import { MerchantCardRenderer } from "./merchant-card-renderer";
import type { MerchantCardData } from "./types";

/** Aperçu public d'une carte commerçant — jamais de QR ni solde réel. */
export function MerchantCardPublicPreview({
  card,
  merchant,
  className,
}: {
  card: MerchantCardData;
  merchant: { name: string; logoUrl?: string | null; primaryColor: string };
  className?: string;
}) {
  return (
    <MerchantCardRenderer
      template={card.cardTemplate}
      merchant={merchant}
      card={{
        ...card,
        points: 0,
        visitsRequired: card.visitsRequired || 10,
      }}
      slug={card.slug}
      displayMode="publicPreview"
      showQr
      interactive={false}
      className={className}
    />
  );
}
