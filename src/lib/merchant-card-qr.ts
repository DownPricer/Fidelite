import type { CardElement, CardTemplateConfig } from "./card-template-schema";
import { ELEMENT_DATA_KEYS } from "./card-template-data-keys";
import { qrVisuallySquare, qrVisualPixelSize } from "./card-template-qr-geometry";
import { resolveElementRect } from "./merchant-card-layout";

export const CUSTOMER_QR_DATA_KEY = ELEMENT_DATA_KEYS.qr;

/** Élément gabarit représentant le QR client (type moderne ou dataKey héritée). */
export function isQrTemplateElement(element: CardElement) {
  if (element.hidden) return false;
  return element.type === "qr" || element.dataKey === CUSTOMER_QR_DATA_KEY;
}

/** Normalise un élément hérité customer.qrCode vers type qr pour le rendu wallet. */
export function normalizeQrTemplateElement(element: CardElement): CardElement {
  if (element.dataKey === CUSTOMER_QR_DATA_KEY && element.type !== "qr") {
    return { ...element, type: "qr", dataKey: CUSTOMER_QR_DATA_KEY };
  }
  if (element.type === "qr" && !element.dataKey) {
    return { ...element, dataKey: CUSTOMER_QR_DATA_KEY };
  }
  return element;
}

export function listQrTemplateElements(config: CardTemplateConfig) {
  return config.elements.filter(isQrTemplateElement).map(normalizeQrTemplateElement);
}

/** Propriété canonique unique pour le QR réel affiché sur une carte commerçant. */
export function resolveMerchantCardQrSrc(
  displayMode: string,
  showQr: boolean,
  qrSrcProp: string | null | undefined,
  cachedQr: string | null,
  loadedQr: string | null,
): string | null {
  if (displayMode !== "personalized" || !showQr) return null;
  return qrSrcProp ?? cachedQr ?? loadedQr ?? null;
}

export function qrElementDimensionsValid(
  element: CardElement,
  cardWidthPx = 920,
): { widthPct: number; heightPct: number; square: boolean; nonZero: boolean } {
  const normalized = normalizeQrTemplateElement(element);
  const rect = resolveElementRect(normalized);
  const { widthPx, heightPx } = qrVisualPixelSize(rect, cardWidthPx);
  return {
    widthPct: rect.width,
    heightPct: rect.height,
    square: qrVisuallySquare(rect),
    nonZero: widthPx > 0 && heightPx > 0,
  };
}
