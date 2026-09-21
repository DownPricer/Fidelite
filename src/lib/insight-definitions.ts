// Définitions formelles des métriques Fidelo Insight (spec §7). Utilisées comme infobulles
// dans l'UI et comme référence unique pour que insight-stats.ts calcule exactement ce que
// ces libellés promettent.

export const INSIGHT_DEFINITIONS = {
  clientTotal: "Client possédant une carte rattachée au commerce (CustomerMembership actif).",
  clientActif: "Client ayant eu au moins une interaction de fidélité validée pendant la période.",
  nouveauClient: "Carte du commerce ajoutée pour la première fois pendant la période.",
  passage: "Passage enregistré par la logique métier existante (transaction EARN_VISIT validée).",
  scan: "Scan QR effectivement validé côté serveur (action CAISSE_SCAN dans le journal d'audit).",
  clientRecurrent: "Client ayant au moins deux passages.",
  clientInactif: "Aucun passage depuis la durée indiquée.",
  recompenseUtilisee: "Avantage réellement validé en caisse (transaction REDEEM_REWARD).",
} as const;

export type InsightDefinitionKey = keyof typeof INSIGHT_DEFINITIONS;
