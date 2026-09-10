import type { LoyaltyMode } from "@prisma/client";

import type { CardTemplateConfig } from "./card-template-schema";
import { qrRecommendedRect } from "./card-template-qr-geometry";

export const DEFAULT_QR_ELEMENT_ID = "wallet-default-customer-qr";

export type PublishedWalletTemplate = {
  backgroundUrl?: string | null;
  config: CardTemplateConfig;
  loyaltyMode: LoyaltyMode;
};

export function templateHasVisibleQr(config: CardTemplateConfig) {
  return config.elements.some((element) => element.type === "qr" && !element.hidden);
}

/** Ajoute un QR client par défaut si le gabarit publié n'en contient pas. */
export function ensureDefaultQrElement(config: CardTemplateConfig): CardTemplateConfig {
  if (templateHasVisibleQr(config)) return config;

  const rect = qrRecommendedRect();
  const maxZ = config.elements.reduce((max, element) => Math.max(max, element.zIndex), 0);

  return {
    ...config,
    elements: [
      ...config.elements,
      {
        id: DEFAULT_QR_ELEMENT_ID,
        type: "qr",
        x: rect.x,
        y: rect.y,
        width: rect.width,
        height: rect.height,
        zIndex: maxZ + 1,
        locked: false,
        hidden: false,
        anchor: "top-left",
        lockAspectRatio: true,
      },
    ],
  };
}

export function normalizePublishedWalletTemplate(
  template: PublishedWalletTemplate | null | undefined,
): PublishedWalletTemplate | null {
  if (!template?.backgroundUrl || !template.config?.elements?.length) return null;
  return {
    ...template,
    config: ensureDefaultQrElement(template.config),
  };
}

export function hasRenderReadyTemplate(card: { cardTemplate?: PublishedWalletTemplate | null }) {
  return Boolean(
    card.cardTemplate?.backgroundUrl && card.cardTemplate.config.elements.length > 0,
  );
}
