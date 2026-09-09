"use client";

import { MerchantCardRenderer } from "./merchant-card-renderer";
import type { MerchantCardData } from "./types";

export function MerchantCardScanResult({
  card,
  clientName,
  merchant,
}: {
  card: MerchantCardData;
  clientName: string;
  merchant: { name: string; logoUrl?: string | null; primaryColor: string };
}) {
  return (
    <div className="w-full max-w-md mx-auto">
      <MerchantCardRenderer
        template={card.cardTemplate}
        merchant={merchant}
        card={card}
        slug={card.slug}
        clientName={clientName}
        displayMode="personalized"
        showQr={false}
        interactive={false}
        className="w-full"
      />
    </div>
  );
}
