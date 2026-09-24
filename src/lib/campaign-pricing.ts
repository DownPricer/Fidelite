import type { CampaignAudienceType, CampaignChannel, CampaignQuotaKind, Prisma } from "@prisma/client";
import {
  CAMPAIGN_PRICE_CENTS,
  includedQuotaFor,
  isNetworkQuotaKind,
  resolvePlanTier,
  tryConsumeIncludedQuota,
  type PlanTier,
} from "./campaign-quota";

/** Association canal + audience → type de quota (Partie 8). Un bandeau sponsorisé n'a pas d'audience. */
export function quotaKindFor(
  channel: CampaignChannel,
  audienceType: CampaignAudienceType | null,
): CampaignQuotaKind {
  if (channel === "SPONSORED_AD") return "SPONSORED_DAY";
  if (audienceType === "NETWORK_LOCAL") {
    return channel === "EMAIL" ? "NETWORK_EMAIL" : "NETWORK_NOTIFICATION";
  }
  return channel === "EMAIL" ? "MEMBER_EMAIL" : "MEMBER_NOTIFICATION";
}

export type PricingResult = {
  quotaKind: CampaignQuotaKind;
  /** true si couverte par le quota inclus du forfait — jamais vrai pour une campagne réseau. */
  isNetwork: boolean;
  /** Prix en centimes si un paiement est nécessaire (0 si couverte par le quota inclus). */
  priceCents: number;
  requiresPayment: boolean;
};

/**
 * Tarification serveur (jamais côté navigateur), en centimes entiers. Un envoi couvert par
 * le quota inclus n'est jamais facturé ; sinon prix fixe par envoi (voir CAMPAIGN_PRICE_CENTS).
 */
export function priceMemberOrNetworkCampaign(input: {
  channel: Exclude<CampaignChannel, "SPONSORED_AD">;
  audienceType: CampaignAudienceType;
  includedRemaining: number;
}): PricingResult {
  const quotaKind = quotaKindFor(input.channel, input.audienceType);
  const isNetwork = isNetworkQuotaKind(quotaKind);
  if (!isNetwork && input.includedRemaining > 0) {
    return { quotaKind, isNetwork, priceCents: 0, requiresPayment: false };
  }
  const priceCents = isNetwork
    ? quotaKind === "NETWORK_EMAIL"
      ? CAMPAIGN_PRICE_CENTS.NETWORK_EMAIL
      : CAMPAIGN_PRICE_CENTS.NETWORK_NOTIFICATION
    : quotaKind === "MEMBER_EMAIL"
      ? CAMPAIGN_PRICE_CENTS.MEMBER_EMAIL
      : CAMPAIGN_PRICE_CENTS.MEMBER_NOTIFICATION;
  return { quotaKind, isNetwork, priceCents, requiresPayment: true };
}

/**
 * Mise en avant : 5 € par jour. Entièrement couverte par les jours Insight restants → gratuite
 * (les jours du quota sont alors consommés d'un bloc) ; sinon toute la durée est payante, sans
 * consommation partielle du quota.
 */
export function priceSponsoredAd(input: { days: number; includedDaysRemaining: number }): {
  priceCents: number;
  requiresPayment: boolean;
  days: number;
} {
  const days = Math.max(1, Math.round(input.days));
  if (input.includedDaysRemaining >= days) return { priceCents: 0, requiresPayment: false, days };
  return { priceCents: days * CAMPAIGN_PRICE_CENTS.SPONSORED_AD_PER_DAY, requiresPayment: true, days };
}

/**
 * Détermine le forfait et le solde de quota inclus restant pour un type de campagne donné,
 * pour affichage (estimation) — ne consomme rien. La consommation réelle se fait uniquement
 * à la confirmation d'envoi via consumeQuotaForCampaign, dans la même transaction que le
 * passage en statut SCHEDULED/PAID.
 */
export async function planAndRemainingQuota(
  db: { merchantSubscription: { findUnique: (args: unknown) => Promise<{ insightEnabled: boolean } | null> } },
  merchantId: string,
  kind: CampaignQuotaKind,
  periodKey: string,
  getUsage: (input: { merchantId: string; kind: CampaignQuotaKind; periodKey: string }) => Promise<number>,
): Promise<{ tier: PlanTier; limit: number; used: number; remaining: number }> {
  const tier = await resolvePlanTier(merchantId);
  const limit = includedQuotaFor(tier, kind);
  const used = limit > 0 ? await getUsage({ merchantId, kind, periodKey }) : 0;
  return { tier, limit, used, remaining: Math.max(0, limit - used) };
}

/**
 * Consomme le quota inclus pour une campagne membres (jamais pour une campagne réseau,
 * toujours payante). Doit être appelé dans la transaction qui confirme l'envoi.
 */
export async function consumeQuotaForCampaign(
  tx: Prisma.TransactionClient,
  input: { merchantId: string; kind: CampaignQuotaKind; periodKey: string; limit: number; amount?: number },
): Promise<boolean> {
  if (isNetworkQuotaKind(input.kind)) return false;
  return tryConsumeIncludedQuota(tx, input);
}
