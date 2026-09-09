import type { CardElement } from "./card-template-schema";

export type Anchor =
  | "top-left"
  | "top-center"
  | "top-right"
  | "center"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right";

export type NormalizedRect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

/** Convertit anchor + position logique en rectangle top-left normalisé. */
export function resolveElementRect(element: Pick<CardElement, "x" | "y" | "width" | "height" | "anchor">): NormalizedRect {
  const anchor = (element.anchor ?? "top-left") as Anchor;
  const w = element.width;
  const h = element.height;
  let x = element.x;
  let y = element.y;

  switch (anchor) {
    case "top-center":
      x = element.x - w / 2;
      break;
    case "top-right":
      x = element.x - w;
      break;
    case "center":
      x = element.x - w / 2;
      y = element.y - h / 2;
      break;
    case "bottom-left":
      y = element.y - h;
      break;
    case "bottom-center":
      x = element.x - w / 2;
      y = element.y - h;
      break;
    case "bottom-right":
      x = element.x - w;
      y = element.y - h;
      break;
    default:
      break;
  }

  return clampRect({ x, y, width: w, height: h });
}

export function clampRect(rect: NormalizedRect): NormalizedRect {
  const width = Math.min(Math.max(rect.width, 0.01), 1);
  const height = Math.min(Math.max(rect.height, 0.01), 1);
  const x = Math.min(Math.max(rect.x, 0), 1 - width);
  const y = Math.min(Math.max(rect.y, 0), 1 - height);
  return { x, y, width, height };
}

export function rectStyle(rect: NormalizedRect): {
  position: "absolute";
  left: string;
  top: string;
  width: string;
  height: string;
} {
  return {
    position: "absolute",
    left: `${rect.x * 100}%`,
    top: `${rect.y * 100}%`,
    width: `${rect.width * 100}%`,
    height: `${rect.height * 100}%`,
  };
}

export function rectsOverlap(a: NormalizedRect, b: NormalizedRect) {
  return a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;
}

/** QR décoratif non scannable pour aperçus publics et admin. */
export const DECORATIVE_QR_SRC =
  "data:image/svg+xml," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <rect width="100" height="100" fill="#ffffff"/>
      <rect x="8" y="8" width="24" height="24" fill="#111"/>
      <rect x="68" y="8" width="24" height="24" fill="#111"/>
      <rect x="8" y="68" width="24" height="24" fill="#111"/>
      <g fill="#111">
        <rect x="40" y="12" width="8" height="8"/><rect x="52" y="12" width="8" height="8"/>
        <rect x="40" y="24" width="8" height="8"/><rect x="64" y="40" width="8" height="8"/>
        <rect x="48" y="48" width="8" height="8"/><rect x="40" y="64" width="8" height="8"/>
        <rect x="64" y="64" width="8" height="8"/><rect x="52" y="72" width="8" height="8"/>
      </g>
    </svg>`,
  );
