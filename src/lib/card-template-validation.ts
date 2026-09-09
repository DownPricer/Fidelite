import type { LoyaltyMode } from "@prisma/client";
import {
  CARD_ASPECT_RATIO,
  QR_MIN_SIZE,
  type CardElement,
  type CardTemplateConfig,
} from "./card-template-schema";
import { clampRect, rectsOverlap, resolveElementRect, type NormalizedRect } from "./merchant-card-layout";

const LOYALTY_REQUIRED: Record<LoyaltyMode, CardElement["type"][]> = {
  VISITS: ["clientName", "qr", "visitsCount", "progressBar", "nextReward"],
  POINTS_BY_AMOUNT: ["clientName", "qr", "pointsBalance", "progressBar", "nextReward"],
  FIXED_POINTS: ["clientName", "qr", "pointsBalance", "progressBar", "nextReward"],
  AMOUNT_TIERS: ["clientName", "qr", "pointsBalance", "progressBar", "nextReward"],
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
  loyaltyMode: LoyaltyMode,
): PublishValidationResult {
  const errors: PublishValidationResult["errors"] = [];

  if (!config.background?.url) {
    errors.push({ message: "Une image de fond est requise." });
  }

  if (config.elements.length === 0) {
    errors.push({ message: "Ajoutez au moins un élément dynamique." });
  }

  const required = LOYALTY_REQUIRED[loyaltyMode];
  for (const type of required) {
    if (!config.elements.some((el) => el.type === type)) {
      errors.push({ message: `Champ obligatoire manquant pour ${loyaltyMode} : ${type}.` });
    }
  }

  if (loyaltyMode !== "VISITS" && config.elements.some((el) => el.type === "visitsCount")) {
    errors.push({ message: "Le champ « passages » ne doit pas être utilisé sur une carte à points." });
  }

  const qrEl = config.elements.find((el) => el.type === "qr");
  if (!qrEl) {
    errors.push({ message: "Un élément QR est obligatoire.", elementId: undefined });
  } else {
    const qr = resolveElementRect(qrEl);
    if (qr.width < QR_MIN_SIZE || qr.height < QR_MIN_SIZE) {
      errors.push({
        message: `Le QR doit mesurer au moins ${Math.round(QR_MIN_SIZE * 100)} % de la carte.`,
        elementId: qrEl.id,
      });
    }
    if (qr.x < 0 || qr.y < 0 || qr.x + qr.width > 1 || qr.y + qr.height > 1) {
      errors.push({ message: "Le QR dépasse les limites de la carte.", elementId: qrEl.id });
    }
    if (!inSafeZone(qr, config.safeZone)) {
      errors.push({ message: "Le QR doit rester dans la zone sûre.", elementId: qrEl.id });
    }
    const silence = qrSilenceZone(qr);
    const overlap = config.elements.some(
      (el) => el.id !== qrEl.id && el.zIndex >= qrEl.zIndex && rectsOverlap(silence, resolveElementRect(el)),
    );
    if (overlap) {
      errors.push({ message: "Un élément recouvre la zone de silence du QR.", elementId: qrEl.id });
    }
    const aspect = qr.width / Math.max(qr.height, 0.001);
    if (aspect < 0.85 || aspect > 1.15) {
      errors.push({ message: "Le QR ne doit pas être déformé.", elementId: qrEl.id });
    }
  }

  for (const el of config.elements) {
    const rect = resolveElementRect(el);
    if (rect.x + rect.width > 1.001 || rect.y + rect.height > 1.001) {
      errors.push({ message: `L'élément ${el.type} dépasse la carte.`, elementId: el.id });
    }
  }

  if (config.aspectRatio !== CARD_ASPECT_RATIO) {
    errors.push({ message: "Ratio de carte invalide." });
  }

  return { ok: errors.length === 0, errors };
}

export function validateCardTemplateForPublish(config: CardTemplateConfig, loyaltyMode: LoyaltyMode = "VISITS") {
  return validateCardTemplateForPublishDetailed(config, loyaltyMode).errors.map((e) => e.message);
}
