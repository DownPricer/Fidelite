import type { AdRequest } from "@prisma/client";
import { expireDueGoogleWalletGlobalAdPreviews } from "./google-wallet-global-preview";
import { scheduleGoogleWalletGlobalCampaignResync } from "./google-wallet";
import { prisma } from "./prisma";
import { isWithinUtcIntervals, type UtcInterval } from "./sponsored-hours-pricing";

/**
 * Synchronise le statut affiché (SCHEDULED / LIVE / ENDED) des mises en avant avec leurs
 * créneaux réellement achetés. Ceci est purement cosmétique pour l'UI (liste super-admin,
 * espace commerçant) — la diffusion réelle du bandeau (/api/public/merchants,
 * /api/public/ads/[id]/impression|click) ne dépend jamais de ce statut et revérifie toujours
 * hourlyIntervals en direct, donc un retard de ce tick ne peut jamais faire apparaître ou
 * rester visible un bandeau hors créneau.
 *
 * Ne touche jamais SUSPENDED (suspension manuelle du super-admin, persiste tant qu'il ne relance
 * pas explicitement) ni STOPPED/CANCELLED/REJECTED/APPROVED/PENDING_REVIEW/NEEDS_CHANGES/DRAFT.
 */
export async function runAdLifecycleTick(now: Date = new Date(), batchSize = 200) {
  const candidates = await prisma.adRequest.findMany({
    where: { status: { in: ["SCHEDULED", "LIVE"] } },
    select: { id: true, status: true, hourlyIntervals: true, startDate: true, endDate: true },
    take: batchSize,
  });

  let toLive = 0;
  let toScheduled = 0;
  let toEnded = 0;

  for (const ad of candidates) {
    const nextStatus = computeAdLifecycleStatus(ad, now);
    if (nextStatus === ad.status) continue;

    await prisma.adRequest.update({ where: { id: ad.id }, data: { status: nextStatus } });
    if (nextStatus === "LIVE") toLive += 1;
    else if (nextStatus === "SCHEDULED") toScheduled += 1;
    else if (nextStatus === "ENDED") toEnded += 1;
  }

  const expiredWalletPreviews = await expireDueGoogleWalletGlobalAdPreviews(now);

  if (toLive || toScheduled || toEnded) {
    scheduleGoogleWalletGlobalCampaignResync();
  }

  return { checked: candidates.length, toLive, toScheduled, toEnded, expiredWalletPreviews };
}

/** Statut affiché attendu pour une mise en avant SCHEDULED/LIVE à l'instant `now`. */
export function computeAdLifecycleStatus(
  ad: Pick<AdRequest, "startDate" | "endDate" | "hourlyIntervals">,
  now: Date,
): "LIVE" | "SCHEDULED" | "ENDED" {
  const intervals = Array.isArray(ad.hourlyIntervals) ? (ad.hourlyIntervals as UtcInterval[]) : null;

  if (intervals) {
    if (intervals.length === 0) return "ENDED";
    const lastEnd = Math.max(...intervals.map((i) => new Date(i.end).getTime()));
    if (now.getTime() >= lastEnd) return "ENDED";
    return isWithinUtcIntervals(now, intervals) ? "LIVE" : "SCHEDULED";
  }

  // Ancienne demande (avant tarification horaire) : diffusion continue startDate→endDate.
  if (now.getTime() > ad.endDate.getTime()) return "ENDED";
  if (now.getTime() >= ad.startDate.getTime()) return "LIVE";
  return "SCHEDULED";
}
