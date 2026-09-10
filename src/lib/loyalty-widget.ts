import type { LoyaltyMode, MerchantCardSlot } from "@prisma/client";
import type { CardElement, CardTemplateConfig } from "./card-template-schema";
import { loyaltyModeForCardSlot } from "./merchant-card-slots";

/** Modes de fidélité supportés par le bloc canonique — jamais GENERAL. */
export type LoyaltyWidgetMode = LoyaltyMode;

export const VISITS_STYLE_VARIANTS = [
  "stampGrid",
  "segmentedBar",
  "bigCounter",
  "progressCircle",
  "stepPath",
  "iconCells",
] as const;

export const POINTS_STYLE_VARIANTS = [
  "bigBalance",
  "progressBar",
  "progressCircle",
  "gauge",
  "rewardScale",
  "counterWithNextGoal",
] as const;

export const TIERS_STYLE_VARIANTS = [
  "tierStair",
  "segmentedBar",
  "verticalList",
  "miniCards",
  "currentAndNext",
  "stepLineWithRewards",
] as const;

export type VisitsStyleVariant = (typeof VISITS_STYLE_VARIANTS)[number];
export type PointsStyleVariant = (typeof POINTS_STYLE_VARIANTS)[number];
export type TiersStyleVariant = (typeof TIERS_STYLE_VARIANTS)[number];
export type LoyaltyStyleVariant = VisitsStyleVariant | PointsStyleVariant | TiersStyleVariant;

export type LoyaltyWidgetConfig = {
  loyaltyMode: LoyaltyWidgetMode;
  styleVariant: LoyaltyStyleVariant;
  colors: {
    fill: string;
    track: string;
    radius?: number;
    borderColor?: string;
    borderWidth?: number;
    glow?: boolean;
    shadow?: boolean;
  };
  showCounter?: boolean;
  cellShape?: "circle" | "square" | "rounded";
  spacing?: number;
  icon?: string;
  animateProgress?: boolean;
  labelPosition?: "inside" | "below" | "none";
  fontSize?: number;
  showNextReward?: boolean;
  showRemainingPoints?: boolean;
};

export const LOYALTY_ATOMIC_TYPES: CardElement["type"][] = [
  "pointsBalance",
  "visitsCount",
  "progressText",
  "progressBar",
  "nextReward",
  "unlockedReward",
  "tierLevel",
];

export const COMMON_ELEMENT_TYPES: CardElement["type"][] = [
  "logo",
  "merchantName",
  "clientName",
  "qr",
  "staticText",
  "decorative",
];

export const LOYALTY_WIDGET_LABELS: Record<LoyaltyWidgetMode, string> = {
  VISITS: "Progression par passages",
  POINTS_BY_AMOUNT: "Progression par points",
  FIXED_POINTS: "Progression par points",
  AMOUNT_TIERS: "Progression par paliers",
};

export const STYLE_VARIANT_LABELS: Record<LoyaltyStyleVariant, string> = {
  stampGrid: "Grille de tampons",
  segmentedBar: "Barre segmentée",
  bigCounter: "Grand compteur",
  progressCircle: "Cercle de progression",
  stepPath: "Chemin d'étapes",
  iconCells: "Cases avec icônes",
  bigBalance: "Grand solde",
  progressBar: "Barre de progression",
  gauge: "Jauge",
  rewardScale: "Échelle récompenses",
  counterWithNextGoal: "Compteur + objectif",
  tierStair: "Escalier de paliers",
  verticalList: "Liste verticale",
  miniCards: "Mini-cartes",
  currentAndNext: "Palier actuel / suivant",
  stepLineWithRewards: "Ligne avec récompenses",
};

export function styleVariantsForMode(mode: LoyaltyWidgetMode): readonly LoyaltyStyleVariant[] {
  if (mode === "VISITS") return VISITS_STYLE_VARIANTS;
  if (mode === "AMOUNT_TIERS") return TIERS_STYLE_VARIANTS;
  return POINTS_STYLE_VARIANTS;
}

export function defaultStyleVariantForMode(mode: LoyaltyWidgetMode): LoyaltyStyleVariant {
  if (mode === "VISITS") return "stampGrid";
  if (mode === "AMOUNT_TIERS") return "tierStair";
  return "bigBalance";
}

export function defaultLoyaltyWidgetConfig(mode: LoyaltyWidgetMode): LoyaltyWidgetConfig {
  return {
    loyaltyMode: mode,
    styleVariant: defaultStyleVariantForMode(mode),
    colors: {
      fill: "#875BFF",
      track: "#CCCCCC",
      radius: 8,
      borderWidth: 0,
      glow: false,
      shadow: false,
    },
    showCounter: true,
    cellShape: "circle",
    spacing: 6,
    animateProgress: false,
    labelPosition: "below",
    fontSize: 16,
    showNextReward: true,
    showRemainingPoints: true,
  };
}

export function loyaltyWidgetModeForCardSlot(cardSlot: MerchantCardSlot): LoyaltyWidgetMode | null {
  const mode = loyaltyModeForCardSlot(cardSlot);
  return mode;
}

export function allowedElementTypesForSlot(cardSlot: MerchantCardSlot): CardElement["type"][] {
  const common = [...COMMON_ELEMENT_TYPES];
  if (cardSlot === "GENERAL") return common;
  return [...common, "loyaltyWidget"];
}

export function loyaltyWidgetLabelForSlot(cardSlot: MerchantCardSlot): string | null {
  const mode = loyaltyWidgetModeForCardSlot(cardSlot);
  return mode ? LOYALTY_WIDGET_LABELS[mode] : null;
}

export function isLegacyLoyaltyElement(type: CardElement["type"]) {
  return LOYALTY_ATOMIC_TYPES.includes(type);
}

export function isLoyaltyWidgetElement(el: CardElement): el is CardElement & { loyaltyWidget: LoyaltyWidgetConfig } {
  return el.type === "loyaltyWidget" && !!el.loyaltyWidget;
}

export function createDefaultLoyaltyWidgetElement(
  cardSlot: MerchantCardSlot,
  zIndex: number,
): CardElement | null {
  const mode = loyaltyWidgetModeForCardSlot(cardSlot);
  if (!mode) return null;
  return {
    id: `loyaltyWidget-${Date.now()}`,
    type: "loyaltyWidget",
    label: LOYALTY_WIDGET_LABELS[mode],
    x: 0.06,
    y: 0.55,
    width: 0.88,
    height: 0.28,
    zIndex,
    locked: false,
    hidden: false,
    anchor: "top-left",
    loyaltyWidget: defaultLoyaltyWidgetConfig(mode),
  };
}

export function findPrimaryLoyaltyRect(elements: CardElement[]) {
  const widget = elements.find((el) => el.type === "loyaltyWidget");
  if (widget) {
    return { x: widget.x, y: widget.y, width: widget.width, height: widget.height };
  }
  const bar = elements.find((el) => el.type === "progressBar");
  if (bar) return { x: bar.x, y: bar.y, width: bar.width, height: bar.height };
  return { x: 0.06, y: 0.55, width: 0.88, height: 0.28 };
}

/** Convertit les anciens éléments atomiques en un bloc canonique (migration douce). */
export function migrateLegacyLoyaltyElements(
  config: CardTemplateConfig,
  cardSlot: MerchantCardSlot,
): CardTemplateConfig {
  if (cardSlot === "GENERAL") {
    return {
      ...config,
      elements: config.elements.filter((el) => !isLegacyLoyaltyElement(el.type) && el.type !== "loyaltyWidget"),
    };
  }

  const mode = loyaltyWidgetModeForCardSlot(cardSlot);
  if (!mode) return config;

  const hasWidget = config.elements.some((el) => el.type === "loyaltyWidget");
  if (hasWidget) return config;

  const hasLegacy = config.elements.some((el) => isLegacyLoyaltyElement(el.type));
  if (!hasLegacy) return config;

  const rect = findPrimaryLoyaltyRect(config.elements);
  const legacyBar = config.elements.find((el) => el.type === "progressBar");
  const widget: CardElement = {
    id: `loyaltyWidget-migrated-${Date.now()}`,
    type: "loyaltyWidget",
    label: LOYALTY_WIDGET_LABELS[mode],
    ...rect,
    zIndex: Math.max(...config.elements.map((el) => el.zIndex), 1),
    locked: false,
    hidden: false,
    anchor: "top-left",
    loyaltyWidget: {
      ...defaultLoyaltyWidgetConfig(mode),
      styleVariant:
        mode === "VISITS"
          ? legacyBar
            ? "segmentedBar"
            : "stampGrid"
          : mode === "AMOUNT_TIERS"
            ? "tierStair"
            : legacyBar
              ? "progressBar"
              : "bigBalance",
      colors: {
        fill: legacyBar?.progressColors?.fill ?? "#875BFF",
        track: legacyBar?.progressColors?.track ?? "#FFFFFF44",
        radius: legacyBar?.progressColors?.radius ?? 8,
        borderColor: legacyBar?.progressColors?.borderColor,
        borderWidth: legacyBar?.progressColors?.borderWidth,
        glow: legacyBar?.progressColors?.glow,
        shadow: legacyBar?.progressColors?.shadow,
      },
    },
  };

  return {
    ...config,
    elements: [
      ...config.elements.filter((el) => !isLegacyLoyaltyElement(el.type)),
      widget,
    ],
  };
}

export function stripIncompatibleLoyaltyElements(
  config: CardTemplateConfig,
  targetSlot: MerchantCardSlot,
): CardTemplateConfig {
  const kept = config.elements.filter(
    (el) =>
      COMMON_ELEMENT_TYPES.includes(el.type) ||
      (el.type !== "loyaltyWidget" && !isLegacyLoyaltyElement(el.type)),
  );
  return { ...config, elements: kept };
}

export function convertConfigForTargetSlot(
  config: CardTemplateConfig,
  targetSlot: MerchantCardSlot,
): CardTemplateConfig {
  const stripped = stripIncompatibleLoyaltyElements(config, targetSlot);
  if (targetSlot === "GENERAL") return stripped;

  const rect = findPrimaryLoyaltyRect(config.elements);
  const maxZ = Math.max(...config.elements.map((el) => el.zIndex), 1);
  const widget = createDefaultLoyaltyWidgetElement(targetSlot, maxZ + 1);
  if (!widget) return stripped;

  return {
    ...stripped,
    elements: [...stripped.elements, { ...widget, ...rect }],
  };
}

export function sanitizeLoyaltyWidgetsForSlot(
  config: CardTemplateConfig,
  cardSlot: MerchantCardSlot,
): CardTemplateConfig {
  let next = migrateLegacyLoyaltyElements(config, cardSlot);

  if (cardSlot === "GENERAL") {
    return {
      ...next,
      elements: next.elements.filter((el) => el.type !== "loyaltyWidget" && !isLegacyLoyaltyElement(el.type)),
    };
  }

  const mode = loyaltyWidgetModeForCardSlot(cardSlot)!;
  next = {
    ...next,
    elements: next.elements
      .filter((el) => !isLegacyLoyaltyElement(el.type))
      .map((el) => {
        if (el.type !== "loyaltyWidget" || !el.loyaltyWidget) return el;
        return {
          ...el,
          loyaltyWidget: {
            ...el.loyaltyWidget,
            loyaltyMode: mode,
            styleVariant: styleVariantsForMode(mode).includes(
              el.loyaltyWidget.styleVariant as LoyaltyStyleVariant,
            )
              ? (el.loyaltyWidget.styleVariant as LoyaltyStyleVariant)
              : defaultStyleVariantForMode(mode),
          },
        };
      }),
  };

  return next;
}

export type LoyaltyWidgetValidationError = { message: string; elementId?: string };

export function validateLoyaltyWidgetsForSlot(
  config: CardTemplateConfig,
  cardSlot: MerchantCardSlot,
): LoyaltyWidgetValidationError[] {
  const errors: LoyaltyWidgetValidationError[] = [];
  const allowed = new Set(allowedElementTypesForSlot(cardSlot));

  for (const el of config.elements) {
    if (!allowed.has(el.type)) {
      errors.push({
        message: `L’élément « ${el.type} » n’est pas autorisé sur cette carte.`,
        elementId: el.id,
      });
    }
  }

  if (cardSlot === "GENERAL") {
    const forbidden = config.elements.filter(
      (el) => el.type === "loyaltyWidget" || isLegacyLoyaltyElement(el.type),
    );
    for (const el of forbidden) {
      errors.push({
        message: "La carte générale ne peut pas contenir de bloc de fidélité.",
        elementId: el.id,
      });
    }
    return errors;
  }

  const mode = loyaltyWidgetModeForCardSlot(cardSlot)!;
  const widgets = config.elements.filter((el) => el.type === "loyaltyWidget");
  const legacy = config.elements.filter((el) => isLegacyLoyaltyElement(el.type));

  if (widgets.length === 0 && legacy.length === 0) {
    errors.push({ message: `Bloc obligatoire manquant : ${LOYALTY_WIDGET_LABELS[mode]}.` });
  }

  if (widgets.length > 0 && legacy.length > 0) {
    errors.push({
      message: "Utilisez uniquement le bloc de fidélité canonique — retirez les anciens éléments atomiques.",
    });
  }

  for (const el of widgets) {
    if (!el.loyaltyWidget) {
      errors.push({ message: "Configuration du bloc de fidélité invalide.", elementId: el.id });
      continue;
    }
    if (el.loyaltyWidget.loyaltyMode !== mode) {
      errors.push({
        message: `Le bloc de fidélité doit correspondre au type « ${LOYALTY_WIDGET_LABELS[mode]} ».`,
        elementId: el.id,
      });
    }
    if (!styleVariantsForMode(mode).includes(el.loyaltyWidget.styleVariant as LoyaltyStyleVariant)) {
      errors.push({
        message: "Style de progression incompatible avec ce type de carte.",
        elementId: el.id,
      });
    }
  }

  for (const el of legacy) {
    errors.push({
      message: "Les éléments de fidélité atomiques ne sont plus autorisés — utilisez le bloc de progression.",
      elementId: el.id,
    });
  }

  return errors;
}

export function applyStyleVariantPreservingColors(
  current: LoyaltyWidgetConfig,
  nextVariant: LoyaltyStyleVariant,
  mode: LoyaltyWidgetMode,
): LoyaltyWidgetConfig {
  if (!styleVariantsForMode(mode).includes(nextVariant)) return current;
  return {
    ...current,
    styleVariant: nextVariant,
    colors: { ...current.colors },
  };
}
