import type { CampaignQuotaKind, Prisma } from "@prisma/client";
import { prisma } from "./prisma";

export type PlanTier = "normal" | "insight";

/**
 * Quotas mensuels INCLUS dans l'abonnement (Partie 8). Les campagnes réseau
 * (NETWORK_NOTIFICATION / NETWORK_EMAIL) ne sont JAMAIS incluses, même avec Insight :
 * elles sont toujours payantes, quel que soit le forfait.
 */
export const INCLUDED_QUOTAS: Record<PlanTier, Partial<Record<CampaignQuotaKind, number>>> = {
  normal: {
    MEMBER_NOTIFICATION: 1,
    MEMBER_EMAIL: 1,
  },
  insight: {
    MEMBER_NOTIFICATION: 3,
    MEMBER_EMAIL: 3,
    SPONSORED_DAY: 3,
  },
};

export { CAMPAIGN_PRICE_CENTS } from "./campaign-prices";

export function includedQuotaFor(tier: PlanTier, kind: CampaignQuotaKind): number {
  return INCLUDED_QUOTAS[tier][kind] ?? 0;
}

/** Une campagne réseau consomme toujours un achat, jamais un quota inclus (Partie 8). */
export function isNetworkQuotaKind(kind: CampaignQuotaKind): boolean {
  return kind === "NETWORK_NOTIFICATION" || kind === "NETWORK_EMAIL";
}

/**
 * Clé de période Europe/Paris au format YYYY-MM (mois calendaire), utilisée quand
 * l'abonnement n'a pas de période de facturation propre (Partie 8).
 */
export function calendarPeriodKeyEuropeParis(now: Date): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Paris",
    year: "numeric",
    month: "2-digit",
  }).formatToParts(now);
  const year = parts.find((p) => p.type === "year")!.value;
  const month = parts.find((p) => p.type === "month")!.value;
  return `${year}-${month}`;
}

/**
 * Clé de période à utiliser pour la consommation des quotas : la période réelle de
 * l'abonnement Stripe si elle existe, sinon le mois calendaire Europe/Paris (Partie 8).
 */
export function resolveQuotaPeriodKey(input: {
  now: Date;
  subscriptionPeriodStart?: Date | null;
}): string {
  if (input.subscriptionPeriodStart) {
    return `sub-${input.subscriptionPeriodStart.toISOString().slice(0, 10)}`;
  }
  return calendarPeriodKeyEuropeParis(input.now);
}

export class QuotaExceededError extends Error {
  constructor(message = "Quota atteint pour cette période.") {
    super(message);
    this.name = "QuotaExceededError";
  }
}

/**
 * Consommation atomique d'un quota inclus. Retourne true si un crédit a bien été
 * consommé (le compteur est passé sous la limite), false si le quota est déjà épuisé —
 * ne lève jamais, à l'appelant de décider (proposer un achat complémentaire).
 *
 * Atomique par construction : l'UPDATE conditionnel (count < limit) ne peut réussir
 * qu'une fois par tentative concurrente, Postgres verrouille la ligne le temps de
 * l'UPDATE — deux requêtes simultanées ne peuvent jamais consommer le même dernier
 * crédit deux fois.
 */
export async function tryConsumeIncludedQuota(
  tx: Prisma.TransactionClient,
  input: { merchantId: string; kind: CampaignQuotaKind; periodKey: string; limit: number; amount?: number },
): Promise<boolean> {
  const amount = input.amount ?? 1;
  if (input.limit <= 0 || amount <= 0 || amount > input.limit) return false;

  await tx.campaignQuotaUsage.upsert({
    where: {
      merchantId_kind_periodKey: {
        merchantId: input.merchantId,
        kind: input.kind,
        periodKey: input.periodKey,
      },
    },
    create: { merchantId: input.merchantId, kind: input.kind, periodKey: input.periodKey, count: 0 },
    update: {},
  });

  const updated = await tx.$executeRaw`
    UPDATE "CampaignQuotaUsage"
    SET "count" = "count" + ${amount}, "updatedAt" = now()
    WHERE "merchantId" = ${input.merchantId}
      AND "kind" = ${input.kind}::"CampaignQuotaKind"
      AND "periodKey" = ${input.periodKey}
      AND "count" + ${amount} <= ${input.limit}
  `;

  return updated > 0;
}

/**
 * Restitue un crédit de quota inclus (campagne refusée par la modération réseau, ou
 * échec avant tout envoi). Ne descend jamais sous 0.
 */
export async function refundIncludedQuota(
  tx: Prisma.TransactionClient,
  input: { merchantId: string; kind: CampaignQuotaKind; periodKey: string },
) {
  await tx.$executeRaw`
    UPDATE "CampaignQuotaUsage"
    SET "count" = GREATEST(0, "count" - 1), "updatedAt" = now()
    WHERE "merchantId" = ${input.merchantId}
      AND "kind" = ${input.kind}::"CampaignQuotaKind"
      AND "periodKey" = ${input.periodKey}
  `;
}

export async function getQuotaUsage(input: { merchantId: string; kind: CampaignQuotaKind; periodKey: string }) {
  const row = await prisma.campaignQuotaUsage.findUnique({
    where: {
      merchantId_kind_periodKey: {
        merchantId: input.merchantId,
        kind: input.kind,
        periodKey: input.periodKey,
      },
    },
  });
  return row?.count ?? 0;
}

export async function resolvePlanTier(merchantId: string): Promise<PlanTier> {
  const subscription = await prisma.merchantSubscription.findUnique({
    where: { merchantId },
    select: { insightEnabled: true },
  });
  return subscription?.insightEnabled ? "insight" : "normal";
}
