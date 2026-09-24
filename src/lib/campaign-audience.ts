import type { CampaignAudienceType, CampaignChannel } from "@prisma/client";
import { prisma } from "./prisma";

export type AudienceEstimate = {
  audienceType: CampaignAudienceType;
  channel: CampaignChannel;
  /** Nombre total de clients dans l'audience de base (avant filtre de consentement). */
  totalInAudience: number;
  /** Nombre réellement joignable sur le canal demandé (a consenti à ce canal précis). */
  estimatedRecipients: number;
  /** Détail par canal, pour affichage avant validation (Partie 7 étape 2). */
  inAppConsented: number;
  pushConsented: number;
  emailConsented: number;
};

function estimatedForChannel(channel: CampaignChannel, breakdown: { inApp: number; push: number; email: number }) {
  if (channel === "EMAIL") return breakdown.email;
  // IN_APP_PUSH : le message apparaît dans le centre de notifications (in-app) et,
  // en plus, en push pour les clients qui l'ont autorisé — l'audience "réellement
  // joignable" est donc l'ensemble in-app (le push est un bonus, pas un filtre).
  return breakdown.inApp;
}

/**
 * Audience "Mes membres" (Partie 7 étape 2) : clients possédant la carte de ce commerce
 * et ayant consenti au canal demandé. Ne fuite jamais la liste des clients au commerçant —
 * seuls des compteurs agrégés sont renvoyés.
 */
export async function estimateMerchantMembersAudience(
  merchantId: string,
  channel: CampaignChannel,
): Promise<AudienceEstimate> {
  const memberships = await prisma.customerMembership.findMany({
    where: { merchantId, removedAt: null, user: { isActive: true } },
    select: {
      user: {
        select: {
          id: true,
          preferences: {
            select: { notifyMerchantOffers: true, adsMerchantPush: true, adsMerchantEmail: true },
          },
        },
      },
    },
  });

  const total = memberships.length;
  let inApp = 0;
  let push = 0;
  let email = 0;
  for (const m of memberships) {
    if (m.user.preferences?.notifyMerchantOffers) inApp += 1;
    if (m.user.preferences?.adsMerchantPush) push += 1;
    if (m.user.preferences?.adsMerchantEmail) email += 1;
  }

  return {
    audienceType: "MERCHANT_MEMBERS",
    channel,
    totalInAudience: total,
    estimatedRecipients: estimatedForChannel(channel, { inApp, push, email }),
    inAppConsented: inApp,
    pushConsented: push,
    emailConsented: email,
  };
}

/**
 * Filtre Prisma de l'audience réseau : clients actifs dont la zone marketing correspond au
 * commerce. Pour un e-mail (« prospects »), on exclut ceux qui possèdent déjà la carte du
 * commerce ; une notification secteur vise les clients avec ou sans la carte.
 * Retourne null si le commerce n'a pas d'adresse exploitable. Partagé avec le worker d'envoi.
 */
export function networkAudienceWhere(
  merchant: { id: string; city: string | null; postalCode: string | null },
  channel: CampaignChannel,
) {
  const zoneFilters: Record<string, unknown>[] = [];
  if (merchant.postalCode) zoneFilters.push({ marketingZonePostalCode: merchant.postalCode });
  if (merchant.city) zoneFilters.push({ marketingZoneCity: { equals: merchant.city, mode: "insensitive" } });
  if (zoneFilters.length === 0) return null;

  return {
    OR: zoneFilters,
    user: {
      isActive: true,
      ...(channel === "EMAIL"
        ? { customerMemberships: { none: { merchantId: merchant.id, removedAt: null } } }
        : {}),
    },
  };
}

/**
 * Audience "Clients Fidelo de mon secteur" (Partie 7 étape 2 / Partie 6) : uniquement des
 * clients ayant explicitement accepté les bons plans Fidelo réseau ET déclaré une zone
 * marketing (ville ou code postal) correspondant à celle du commerce. Jamais de
 * géolocalisation précise, jamais de coordonnées inventées.
 */
export async function estimateNetworkLocalAudience(
  merchant: { id: string; city: string | null; postalCode: string | null },
  channel: CampaignChannel,
): Promise<AudienceEstimate> {
  const where = networkAudienceWhere(merchant, channel);

  if (!where) {
    // Le commerce n'a pas d'adresse exploitable : aucune audience locale fiable, jamais inventée.
    return {
      audienceType: "NETWORK_LOCAL",
      channel,
      totalInAudience: 0,
      estimatedRecipients: 0,
      inAppConsented: 0,
      pushConsented: 0,
      emailConsented: 0,
    };
  }

  const prefs = await prisma.customerPreferences.findMany({
    where,
    select: { notifyFifeLifeNews: true, adsNetworkPush: true, adsNetworkEmail: true },
  });

  let inApp = 0;
  let push = 0;
  let email = 0;
  for (const p of prefs) {
    if (p.notifyFifeLifeNews) inApp += 1;
    if (p.adsNetworkPush) push += 1;
    if (p.adsNetworkEmail) email += 1;
  }

  return {
    audienceType: "NETWORK_LOCAL",
    channel,
    totalInAudience: prefs.length,
    estimatedRecipients: estimatedForChannel(channel, { inApp, push, email }),
    inAppConsented: inApp,
    pushConsented: push,
    emailConsented: email,
  };
}
