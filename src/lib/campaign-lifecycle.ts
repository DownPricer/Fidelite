import type { CampaignAudienceType, CampaignChannel, CampaignStatus } from "@prisma/client";

/**
 * Une campagne réseau (audience locale Fidelo) ou une publicité sponsorisée passe toujours
 * par la modération super-admin (Partie 13) — jamais une campagne vers ses propres membres.
 */
export function requiresModeration(channel: CampaignChannel, audienceType: CampaignAudienceType | null): boolean {
  return channel === "SPONSORED_AD" || audienceType === "NETWORK_LOCAL";
}

/** Statut après confirmation du paiement (webhook Stripe payé) ou consommation de quota. */
export function statusAfterFundingConfirmed(input: {
  channel: CampaignChannel;
  audienceType: CampaignAudienceType | null;
}): CampaignStatus {
  return requiresModeration(input.channel, input.audienceType) ? "PENDING_REVIEW" : "SCHEDULED";
}

/** Statut après validation super-admin d'une campagne réseau / publicité. */
export function statusAfterModerationApproved(): CampaignStatus {
  return "SCHEDULED";
}

export function statusAfterModerationRejected(): CampaignStatus {
  return "REJECTED";
}

/** Une campagne ne peut être annulée par le commerçant que si l'envoi n'a pas commencé. */
export function isCancellable(status: CampaignStatus): boolean {
  return (
    status === "DRAFT" ||
    status === "PENDING_REVIEW" ||
    status === "PAYMENT_REQUIRED" ||
    status === "PAID" ||
    status === "SCHEDULED"
  );
}

/** Une campagne ne peut être dupliquée qu'une fois son cycle terminé ou abandonné (jamais en cours d'envoi). */
export function isDuplicable(status: CampaignStatus): boolean {
  return status !== "SENDING";
}

export const CAMPAIGN_STATUS_LABELS: Record<CampaignStatus, string> = {
  DRAFT: "Préparée",
  PENDING_REVIEW: "En attente de validation",
  PAYMENT_REQUIRED: "Paiement requis",
  PAID: "Payée",
  SCHEDULED: "Programmée",
  SENDING: "En cours",
  SENT: "Envoyée",
  PARTIALLY_SENT: "Partiellement envoyée",
  FAILED: "Échouée",
  REJECTED: "Refusée",
  CANCELLED: "Annulée",
};
