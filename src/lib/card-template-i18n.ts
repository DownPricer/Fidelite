import type { CardElement } from "./card-template-schema";
import type { LoyaltyMode } from "@prisma/client";

/** Libellés français des types d’éléments — jamais d’identifiants techniques en UI. */
export const ELEMENT_TYPE_LABELS: Record<CardElement["type"], string> = {
  logo: "Logo du commerce",
  merchantName: "Nom du commerce",
  clientName: "Nom et prénom du client",
  qr: "QR code",
  pointsBalance: "Solde de fidélité",
  visitsCount: "Nombre de passages",
  progressText: "Texte de progression",
  progressBar: "Barre de progression",
  nextReward: "Prochain avantage",
  unlockedReward: "Récompense débloquée",
  tierLevel: "Palier de fidélité",
  expiryDate: "Date d’expiration",
  staticText: "Texte personnalisé",
};

/** Traduction des clés de données dynamiques. */
export const DATA_KEY_LABELS: Record<string, string> = {
  "merchant.logo": "Logo du commerce",
  "merchant.name": "Nom du commerce",
  "customer.fullName": "Identité du client",
  "customer.qrCode": "QR code du client",
  "loyalty.balance": "Solde de fidélité",
  "loyalty.progress": "Progression",
  "loyalty.nextReward": "Prochain avantage",
  "loyalty.unlockedReward": "Récompense débloquée",
  "loyalty.tier": "Palier de fidélité",
  "loyalty.expiry": "Date d’expiration",
  "static.text": "Texte personnalisé",
};

export const FONT_FAMILY_LABELS: Record<string, string> = {
  system: "Système (Manrope)",
  card: "Carte (Card Sans)",
  serif: "Serif",
  mono: "Monospace",
  display: "Affichage",
};

export const FONT_WEIGHT_LABELS: Record<string, string> = {
  "400": "Regular (400)",
  "500": "Medium (500)",
  "600": "Semi-gras (600)",
  "700": "Gras (700)",
  "800": "Extra-gras (800)",
};

export const TEXT_ALIGN_LABELS = {
  left: "Gauche",
  center: "Centre",
  right: "Droite",
} as const;

export const VERTICAL_ALIGN_LABELS = {
  top: "Haut",
  center: "Centre",
  bottom: "Bas",
} as const;

export const FIT_MODE_LABELS = {
  manual: "Taille manuelle",
  autoShrink: "Réduction automatique",
  multiline: "Plusieurs lignes",
} as const;

export const LOGO_FIT_LABELS = {
  contain: "Contenir",
  cover: "Couvrir",
} as const;

export const PROGRESS_ORIENTATION_LABELS = {
  horizontal: "Horizontale",
  vertical: "Verticale",
} as const;

export const BACKGROUND_FIT_LABELS = {
  cover: "Remplir",
  contain: "Afficher entièrement",
  fill: "Étirer",
} as const;

const LOYALTY_MODE_LABELS: Record<LoyaltyMode, string> = {
  VISITS: "Passages",
  POINTS_BY_AMOUNT: "Points selon le montant",
  FIXED_POINTS: "Points fixes",
  AMOUNT_TIERS: "Paliers de montant",
};

export function elementTypeLabel(type: CardElement["type"]) {
  return ELEMENT_TYPE_LABELS[type] ?? "Élément";
}

export function dataKeyLabel(key: string) {
  return DATA_KEY_LABELS[key] ?? "Donnée dynamique";
}

export function loyaltyModeLabel(mode: LoyaltyMode) {
  return LOYALTY_MODE_LABELS[mode] ?? mode;
}

export function validationMessage(type: CardElement["type"]) {
  return `Élément obligatoire manquant : ${elementTypeLabel(type)}.`;
}

export const QR_OVERLAP_MESSAGE =
  "Attention : un autre élément recouvre la zone du QR code. Déplacez-le pour garantir une lecture fiable.";

export const QR_SIZE_VALID_MESSAGE = "Taille valide";
export const QR_SIZE_INVALID_MESSAGE = "Taille insuffisante — minimum 12 % de la largeur de la carte";

/** Vérifie qu’aucun libellé UI n’expose un identifiant technique anglais connu. */
export function containsForbiddenTechnicalLabel(text: string) {
  const forbidden = [
    "merchantName",
    "clientName",
    "pointsBalance",
    "visitsCount",
    "progressBar",
    "progressText",
    "nextReward",
    "staticText",
    "merchant.logo",
    "customer.fullName",
    "loyalty.progress",
    "VISITS",
    "POINTS_BY_AMOUNT",
  ];
  return forbidden.some((token) => text.includes(token));
}
