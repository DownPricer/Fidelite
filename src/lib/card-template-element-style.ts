import type { CSSProperties } from "react";
import type { CardElement } from "./card-template-schema";
import { CARD_EDITOR_REFERENCE_WIDTH } from "./card-template-normalize";
import { cardFontCss } from "./card-template-fonts";

/** Taille de police proportionnelle à la largeur de la carte (WYSIWYG éditeur ↔ wallet). */
export function cardFontSizeCss(px: number) {
  return `${((px / CARD_EDITOR_REFERENCE_WIDTH) * 100).toFixed(4)}cqw`;
}

export function buildTextContainerStyle(
  element: CardElement,
  extra?: CSSProperties,
): CSSProperties {
  const s = element.style;
  if (!s) return extra ?? {};
  return {
    color: s.color,
    fontFamily: cardFontCss(s.fontFamily),
    fontSize: cardFontSizeCss(s.fontSize),
    fontWeight: Number(s.fontWeight ?? 600),
    fontStyle: s.fontStyle ?? "normal",
    textAlign: s.textAlign,
    opacity: (element.opacity ?? 1) * (s.opacity ?? 1),
    lineHeight: s.lineHeight,
    letterSpacing: s.letterSpacing ? `${s.letterSpacing}px` : undefined,
    textTransform: s.textTransform === "uppercase" ? "uppercase" : undefined,
    textShadow: s.shadow ? "0 2px 8px rgba(0,0,0,0.45)" : undefined,
    WebkitTextStroke: s.textStroke ? "0.5px rgba(0,0,0,0.35)" : undefined,
    alignItems: s.verticalAlign === "top" ? "flex-start" : s.verticalAlign === "bottom" ? "flex-end" : "center",
    justifyContent: s.textAlign === "center" ? "center" : s.textAlign === "right" ? "flex-end" : "flex-start",
    backgroundColor: s.backgroundColor,
    borderRadius: s.borderRadius ? `${s.borderRadius}px` : undefined,
    overflow: "hidden",
    ...extra,
  };
}

/** Réduit la taille de police si le texte dépasse (aperçu autoShrink). */
export function resolveAutoFitFontSize(
  text: string,
  style: NonNullable<CardElement["style"]>,
  containerWidthPx: number,
): number {
  if (style.fitMode !== "autoShrink") return style.fontSize;
  const min = style.minFontSize ?? 10;
  let size = style.fontSize;
  const approxCharWidth = size * 0.55;
  const maxChars = Math.max(1, Math.floor(containerWidthPx / approxCharWidth));
  const neededLines = Math.ceil(text.length / maxChars);
  if (neededLines > (style.maxLines ?? 2)) {
    size = Math.max(min, size * ((style.maxLines ?? 2) / neededLines));
  }
  if (text.length * approxCharWidth > containerWidthPx * (style.maxLines ?? 2)) {
    size = Math.max(min, size * 0.85);
  }
  return Math.max(min, Math.min(size, style.fontSize));
}

export function multilineClampStyle(maxLines: number): CSSProperties {
  return {
    display: "-webkit-box",
    WebkitLineClamp: maxLines,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
    wordBreak: "break-word",
  };
}
