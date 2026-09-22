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
 * Tarification serveur (jamais côté navigateur). Pour un bandeau sponsorisé, `sponsoredDays`
 * fixe la durée : 1900 centimes pour les 7 premiers jours, 300 par jour supplémentaire ;
 * les jours couverts par le quota Insight (3/mois) sont déduits avant application du tarif.
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

export function priceSponsoredAd(input: { days: number; includedDaysRemaining: number }): {
  priceCents: number;
  requiresPayment: boolean;
  daysFromQuota: number;
  daysToPay: number;
} {
  const days = Math.max(1, Math.round(input.days));
  const daysFromQuota = Math.min(days, Math.max(0, input.includedDaysRemaining));
  const daysToPay = days - daysFromQuota;
  if (daysToPay <= 0) {
    return { priceCents: 0, requiresPayment: false, daysFromQuota, daysToPay: 0 };
  }
  const base = Math.min(daysToPay, 7) > 0 ? CAMPAIGN_PRICE_CENTS.SPONSORED_AD_BASE_7_DAYS : 0;
  const extraDays = Math.max(0, daysToPay - 7);
  const priceCents = base + extraDays * CAMPAIGN_PRICE_CENTS.SPONSORED_AD_EXTRA_DAY;
  return { priceCents, requiresPayment: true, daysFromQuota, daysToPay };
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
  input: { merchantId: string; kind: CampaignQuotaKind; periodKey: string; limit: number },
): Promise<boolean> {
  if (isNetworkQuotaKind(input.kind)) return false;
  return tryConsumeIncludedQuota(tx, input);
}
