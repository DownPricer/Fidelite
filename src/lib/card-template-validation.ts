import type { LoyaltyMode, MerchantCardSlot } from "@prisma/client";
import {
  CARD_ASPECT_RATIO,
  type CardElement,
  type CardTemplateConfig,
} from "./card-template-schema";
import { elementTypeLabel, validationMessage } from "./card-template-i18n";
import {
  LOYALTY_WIDGET_LABELS,
  loyaltyWidgetLabelForSlot,
  loyaltyWidgetModeForCardSlot,
  validateLoyaltyWidgetsForSlot,
} from "./loyalty-widget";
import { qrMinWidthValid, qrVisuallySquare } from "./card-template-qr-geometry";
import { clampRect, rectsOverlap, resolveElementRect, type NormalizedRect } from "./merchant-card-layout";

const SLOT_REQUIRED: Record<MerchantCardSlot, CardElement["type"][]> = {
  GENERAL: ["clientName", "qr", "merchantName"],
  VISITS: ["clientName", "qr", "loyaltyWidget"],
  POINTS_BY_AMOUNT: ["clientName", "qr", "loyaltyWidget"],
  FIXED_POINTS: ["clientName", "qr", "loyaltyWidget"],
  AMOUNT_TIERS: ["clientName", "qr", "loyaltyWidget"],
};

const QR_SILENCE_MARGIN = 0.02;

export type PublishValidationResult = {
  ok: boolean;
  errors: { message: string; elementId?: string }[];
};

function inSafeZone(rect: NormalizedRect, safeZone: CardTemplateConfig["safeZone"]) {
  return (
    rect.x >= safeZone.left &&
    rect.y >= safeZone.top &&
    rect.x + rect.width <= 1 - safeZone.right &&
    rect.y + rect.height <= 1 - safeZone.bottom
  );
}

function qrSilenceZone(qr: NormalizedRect): NormalizedRect {
  return clampRect({
    x: qr.x - QR_SILENCE_MARGIN,
    y: qr.y - QR_SILENCE_MARGIN,
    width: qr.width + QR_SILENCE_MARGIN * 2,
    height: qr.height + QR_SILENCE_MARGIN * 2,
  });
}

export function validateCardTemplateForPublishDetailed(
  config: CardTemplateConfig,
  cardSlot: MerchantCardSlot | LoyaltyMode,
): PublishValidationResult {
  const slot = cardSlot as MerchantCardSlot;
  const errors: PublishValidationResult["errors"] = [];

  if (!config.background?.url) {
    errors.push({ message: "Une image de fond est requise." });
  }

  if (config.elements.length === 0) {
    errors.push({ message: "Ajoutez au moins un élément dynamique." });
  }

  const required = SLOT_REQUIRED[slot];
  for (const type of required) {
    if (type === "loyaltyWidget") {
      const mode = loyaltyWidgetModeForCardSlot(slot);
      const hasWidget = config.elements.some((el) => el.type === "loyaltyWidget");
      if (!hasWidget && mode) {
        errors.push({ message: `Bloc obligatoire manquant : ${LOYALTY_WIDGET_LABELS[mode]}.` });
      }
      continue;
    }
    if (!config.elements.some((el) => el.type === type)) {
      errors.push({ message: validationMessage(type) });
    }
  }

  errors.push(...validateLoyaltyWidgetsForSlot(config, slot));

  const qrEl = config.elements.find((el) => el.type === "qr");
  if (!qrEl) {
    errors.push({ message: "Un QR code est obligatoire.", elementId: undefined });
  } else {
    const qr = resolveElementRect(qrEl);
    if (!qrMinWidthValid(qr)) {
      errors.push({
        message: "Le QR code doit mesurer au moins 12 % de la largeur de la carte.",
        elementId: qrEl.id,
      });
    }
    if (!qrVisuallySquare(qr)) {
      errors.push({
        message: "Le QR code doit être visuellement carré sur la carte.",
        elementId: qrEl.id,
      });
    }
    if (qr.x < 0 || qr.y < 0 || qr.x + qr.width > 1 || qr.y + qr.height > 1) {
      errors.push({ message: "Le QR code dépasse les limites de la carte.", elementId: qrEl.id });
    }
    if (!inSafeZone(qr, config.safeZone)) {
      errors.push({ message: "Le QR code doit rester dans la zone sûre.", elementId: qrEl.id });
    }
    const silence = qrSilenceZone(qr);
    const overlap = config.elements.some(
      (el) => el.id !== qrEl.id && el.zIndex >= qrEl.zIndex && rectsOverlap(silence, resolveElementRect(el)),
    );
    if (overlap) {
      errors.push({
        message: "Un élément recouvre la zone de silence autour du QR code.",
        elementId: qrEl.id,
      });
    }
  }

  for (const el of config.elements) {
    const rect = resolveElementRect(el);
    if (rect.x + rect.width > 1.001 || rect.y + rect.height > 1.001) {
      errors.push({
        message: `L’élément « ${elementTypeLabel(el.type)} » dépasse la carte.`,
        elementId: el.id,
      });
    }
  }

  if (config.aspectRatio !== CARD_ASPECT_RATIO) {
    errors.push({ message: "Ratio de carte invalide." });
  }

  if (slot === "GENERAL" && loyaltyWidgetLabelForSlot(slot) === null) {
    // noop — slot général validé via validateLoyaltyWidgetsForSlot
  }

  return { ok: errors.length === 0, errors };
}

export function validateCardTemplateForPublish(config: CardTemplateConfig, loyaltyMode: LoyaltyMode = "VISITS") {
  return validateCardTemplateForPublishDetailed(config, loyaltyMode).errors.map((e) => e.message);
}
