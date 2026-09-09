import type { CSSProperties } from "react";
import type { CardTemplateConfig } from "./card-template-schema";

export type CardBackgroundSettings = CardTemplateConfig["background"];

export function buildCardBackgroundImageStyle(
  bg: CardBackgroundSettings,
): { wrapper: CSSProperties; img: CSSProperties } {
  const { position, scale, fit } = bg;
  const px = `${position.x * 100}%`;
  const py = `${position.y * 100}%`;

  if (fit === "fill") {
    return {
      wrapper: { overflow: "hidden", position: "absolute", inset: 0 },
      img: {
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        objectFit: "fill",
        objectPosition: `${px} ${py}`,
        transform: scale !== 1 ? `scale(${scale})` : undefined,
        transformOrigin: `${px} ${py}`,
      },
    };
  }

  const baseScale = fit === "cover" ? Math.max(1, scale) : scale;
  return {
    wrapper: { overflow: "hidden", position: "absolute", inset: 0 },
    img: {
      position: "absolute",
      left: px,
      top: py,
      width: fit === "contain" ? `${100 * baseScale}%` : `${100 * baseScale}%`,
      height: fit === "contain" ? `${100 * baseScale}%` : `${100 * baseScale}%`,
      maxWidth: "none",
      transform: "translate(-50%, -50%)",
      objectFit: fit,
      objectPosition: "center center",
    },
  };
}

export const DEFAULT_BACKGROUND: CardBackgroundSettings = {
  url: "",
  fit: "cover",
  position: { x: 0.5, y: 0.5 },
  scale: 1,
};
