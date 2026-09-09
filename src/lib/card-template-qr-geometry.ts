import { CARD_ASPECT_RATIO, QR_MIN_SIZE } from "./card-template-constants";
import type { NormalizedRect } from "./merchant-card-layout";

/** Largeur normalisée minimale du QR (12 % de la largeur de carte). */
export const QR_MIN_WIDTH = QR_MIN_SIZE;

/** Taille recommandée : 18 % de la largeur de carte. */
export const QR_RECOMMENDED_WIDTH = 0.18;

/** Hauteur normalisée pour un QR visuellement carré sur une carte 1.586:1. */
export function qrNormalizedHeight(width: number) {
  return width * CARD_ASPECT_RATIO;
}

export function qrRectFromWidth(width: number, x = 0, y = 0): NormalizedRect {
  const w = Math.max(width, QR_MIN_WIDTH);
  return { x, y, width: w, height: qrNormalizedHeight(w) };
}

export function qrRecommendedRect(x?: number, y?: number): NormalizedRect {
  return qrRectFromWidth(QR_RECOMMENDED_WIDTH, x ?? 0.72, y ?? 0.12);
}

/** Vérifie le carré visuel en pixels (tolérance sur la hauteur normalisée). */
export function qrVisuallySquare(rect: NormalizedRect, tolerance = 0.008) {
  const expected = qrNormalizedHeight(rect.width);
  return Math.abs(rect.height - expected) <= tolerance;
}

/** Taille minimale respectée (largeur ≥ 12 %). */
export function qrMinWidthValid(rect: NormalizedRect) {
  return rect.width >= QR_MIN_WIDTH - 0.0001;
}

export function qrSizeValid(rect: NormalizedRect) {
  return qrMinWidthValid(rect) && qrVisuallySquare(rect);
}

/** Pixels sur une carte de largeur `cardWidthPx` et ratio 1.586. */
export function qrVisualPixelSize(rect: NormalizedRect, cardWidthPx: number) {
  const cardHeightPx = cardWidthPx / CARD_ASPECT_RATIO;
  return {
    widthPx: rect.width * cardWidthPx,
    heightPx: rect.height * cardHeightPx,
  };
}

export function qrVisuallySquareInPixels(rect: NormalizedRect, cardWidthPx: number, tolerancePx = 1) {
  const { widthPx, heightPx } = qrVisualPixelSize(rect, cardWidthPx);
  return Math.abs(widthPx - heightPx) <= tolerancePx;
}

/** Corrige un QR hérité (width ≈ height) vers le ratio visuel correct. */
export function normalizeQrElementRect(width: number, height: number): { width: number; height: number } {
  const w = Math.max(width, QR_MIN_WIDTH);
  const legacySquare = Math.abs(height - width) < 0.015;
  if (legacySquare || !qrVisuallySquare({ x: 0, y: 0, width: w, height })) {
    return { width: w, height: qrNormalizedHeight(w) };
  }
  return { width: w, height: Math.max(height, qrNormalizedHeight(w)) };
}
