/**
 * Tarifs des campagnes en centimes entiers — module pur (sans Prisma), importable côté
 * navigateur pour l'AFFICHAGE ; le serveur recalcule toujours le prix réel et l'envoie à Stripe.
 * Prix FIXES par envoi, quel que soit le nombre de destinataires (montants convenus pour le
 * test Stripe ; la question TTC/TVA sera réglée avant la production).
 * NETWORK_EMAIL = e-mail « prospects » (clients éligibles ne possédant pas la carte).
 */
export const CAMPAIGN_PRICE_CENTS = {
  MEMBER_NOTIFICATION: 99,
  MEMBER_EMAIL: 50,
  NETWORK_NOTIFICATION: 199,
  NETWORK_EMAIL: 120,
  SPONSORED_AD_PER_DAY: 500,
} as const;
