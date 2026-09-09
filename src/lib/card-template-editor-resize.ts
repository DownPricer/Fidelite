import { QR_MIN_SIZE, type CardElement } from "./card-template-schema";
import { clampRect, type NormalizedRect } from "./merchant-card-layout";

export function logoAspectLocked(el: CardElement) {
  return el.type === "logo" && (el.logoStyle?.lockAspectRatio ?? true);
}

export function elementRequiresSquare(el: CardElement) {
  return el.type === "qr" || logoAspectLocked(el) || (el.lockAspectRatio ?? false);
}

export function qrRecommendedSize() {
  return 0.18;
}

/** Verrouille le ratio largeur/hauteur lors d'un redimensionnement. */
export function lockRectAspect(
  rect: NormalizedRect,
  aspect: number,
  handle?: string,
): NormalizedRect {
  const safeAspect = Math.max(aspect, 0.001);
  if (!handle) return rect;
  if (handle === "n" || handle === "s") {
    return { ...rect, width: rect.height * safeAspect };
  }
  if (handle === "e" || handle === "w") {
    return { ...rect, height: rect.width / safeAspect };
  }
  return { ...rect, height: rect.width / safeAspect };
}

export function enforceElementRect(el: CardElement, rect: NormalizedRect, handle?: string): NormalizedRect {
  let r = clampRect(rect);

  if (el.type === "qr") {
    const size = Math.max(r.width, r.height, QR_MIN_SIZE);
    r = { width: size, height: size, x: r.x, y: r.y };
    r.width = Math.max(r.width, QR_MIN_SIZE);
    r.height = r.width;
    return clampRect(r);
  }

  if (el.type === "logo") {
    if (logoAspectLocked(el)) {
      const aspect = el.width / Math.max(el.height, 0.001);
      r = lockRectAspect(r, aspect, handle);
    }
    return clampRect(r);
  }

  if (el.lockAspectRatio) {
    const size = Math.max(r.width, r.height);
    r = { ...r, width: size, height: size };
    return clampRect(r);
  }

  return r;
}

export function qrSizeValid(rect: NormalizedRect) {
  return rect.width >= QR_MIN_SIZE && rect.height >= QR_MIN_SIZE && Math.abs(rect.width - rect.height) < 0.005;
}

export function qrOverlapsOthers(
  qrId: string,
  qrRect: NormalizedRect,
  elements: CardElement[],
  margin = 0.02,
) {
  const silence: NormalizedRect = {
    x: qrRect.x - margin,
    y: qrRect.y - margin,
    width: qrRect.width + margin * 2,
    height: qrRect.height + margin * 2,
  };
  const qrEl = elements.find((e) => e.id === qrId);
  return elements.some((el) => {
    if (el.id === qrId) return false;
    const r = clampRect({
      x: el.x,
      y: el.y,
      width: el.width,
      height: el.height,
    });
    return (
      el.zIndex >= (qrEl?.zIndex ?? 0) &&
      r.x < silence.x + silence.width &&
      r.x + r.width > silence.x &&
      r.y < silence.y + silence.height &&
      r.y + r.height > silence.y
    );
  });
}
