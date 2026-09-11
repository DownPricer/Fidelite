import type { CardElement, CardTemplateConfig } from "./card-template-schema";
import { defaultDataKey } from "./card-template-data-keys";
import { defaultNextRewardStyle } from "./next-reward-styles";
import { defaultLoyaltyWidgetConfig } from "./loyalty-widget";
import { normalizeQrElementRect } from "./card-template-qr-geometry";

export const CARD_EDITOR_REFERENCE_WIDTH = 920;

function defaultTextStyle(type: CardElement["type"]) {
  const base = {
    fontFamily: "system" as const,
    fontSize: type === "merchantName" ? 20 : 16,
    fontWeight: type === "merchantName" ? ("700" as const) : ("600" as const),
    fontStyle: "normal" as const,
    color: "#FFFFFF",
    textAlign: "left" as const,
    verticalAlign: "center" as const,
    opacity: 1,
    lineHeight: 1.2,
    letterSpacing: 0,
    textTransform: "none" as const,
    maxLines: 2,
    shadow: type === "merchantName",
    textStroke: false,
    fitMode: "manual" as const,
    minFontSize: 10,
    borderRadius: 0,
  };
  return base;
}

const TEXT_TYPES: CardElement["type"][] = [
  "merchantName",
  "clientName",
  "pointsBalance",
  "visitsCount",
  "progressText",
  "nextReward",
  "unlockedReward",
  "tierLevel",
  "expiryDate",
  "staticText",
];

export function normalizeCardElement(el: CardElement): CardElement {
  const lockAspectRatio =
    el.lockAspectRatio ?? (el.type === "qr" ? true : el.type === "logo" ? true : false);

  const normalized: CardElement = {
    ...el,
    opacity: el.opacity ?? 1,
    lockAspectRatio,
    dataKey: el.dataKey ?? defaultDataKey(el.type),
    rotation: el.rotation ?? 0,
  };

  if (TEXT_TYPES.includes(el.type)) {
    normalized.style = {
      ...defaultTextStyle(el.type),
      ...el.style,
      fontStyle: el.style?.fontStyle ?? "normal",
      verticalAlign: el.style?.verticalAlign ?? "center",
      letterSpacing: el.style?.letterSpacing ?? 0,
      textTransform: el.style?.textTransform ?? "none",
      maxLines: el.style?.maxLines ?? 2,
      textStroke: el.style?.textStroke ?? false,
      fitMode: el.style?.fitMode ?? "manual",
      minFontSize: el.style?.minFontSize ?? 10,
    };
  }

  if (el.type === "logo") {
    const logoLocked = el.logoStyle?.lockAspectRatio ?? el.lockAspectRatio ?? true;
    normalized.lockAspectRatio = logoLocked;
    normalized.logoStyle = {
      objectFit: "contain",
      borderRadius: 12,
      padding: 0,
      shadow: false,
      lockAspectRatio: logoLocked,
      ...el.logoStyle,
    };
  }

  if (el.type === "progressBar") {
    normalized.progressColors = {
      fill: "#875BFF",
      track: "#FFFFFF",
      radius: 8,
      borderWidth: 0,
      shadow: false,
      glow: false,
      orientation: "horizontal",
      showLabel: false,
      labelColor: "#FFFFFF",
      labelFontSize: 12,
      ...el.progressColors,
    };
  }

  if (el.type === "qr") {
    const fixed = normalizeQrElementRect(el.width, el.height);
    normalized.width = fixed.width;
    normalized.height = fixed.height;
    normalized.lockAspectRatio = true;
  }

  if (el.type === "loyaltyWidget") {
    const mode = el.loyaltyWidget?.loyaltyMode ?? "VISITS";
    normalized.loyaltyWidget = {
      ...defaultLoyaltyWidgetConfig(mode),
      ...el.loyaltyWidget,
      colors: {
        ...defaultLoyaltyWidgetConfig(mode).colors,
        ...el.loyaltyWidget?.colors,
      },
    };
  }

  if (el.type === "decorative") {
    normalized.decorativeStyle = {
      backgroundColor: "#FFFFFF22",
      borderWidth: 0,
      borderRadius: 12,
      shape: "rectangle",
      shadow: false,
      ...el.decorativeStyle,
    };
  }

  if (el.type === "nextReward") {
    normalized.nextRewardStyle = {
      ...defaultNextRewardStyle(),
      ...el.nextRewardStyle,
    };
  }

  return normalized;
}

export function normalizeCardTemplateConfig(config: CardTemplateConfig): CardTemplateConfig {
  return {
    ...config,
    elements: config.elements.map(normalizeCardElement),
  };
}
