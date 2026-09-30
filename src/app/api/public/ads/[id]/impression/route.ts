import { jsonError, jsonOk } from "@/lib/http";
import { LIMITS, rateLimit } from "@/lib/rate-limit";
import { prisma } from "@/lib/prisma";
import { isWithinUtcIntervals, type UtcInterval } from "@/lib/sponsored-hours-pricing";

/**
 * Comptage agrégé des impressions (Partie 12) — aucune donnée personnelle rattachée.
 * Revérifie le créneau exact acheté (hourlyIntervals), pas seulement les bornes de jour
 * startDate/endDate : cet endpoint est public, un appel direct hors créneau ne doit jamais
 * compter (voir la même règle dans /api/public/merchants et /api/public/ads/[id]/click).
 */
export async function POST(req: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const limited = rateLimit(`ad-impression:${id}`, LIMITS.qr.limit, LIMITS.qr.windowMs);
  if (!limited.ok) return jsonError("Trop de requêtes.", 429);

  const now = new Date();
  const ad = await prisma.adRequest.findUnique({
    where: { id },
    select: { id: true, status: true, fundingMode: true, startDate: true, endDate: true, hourlyIntervals: true },
  });
  // Le statut stocké (SCHEDULED/LIVE) peut être en retard côté worker : la seule source de
  // vérité pour "diffusée maintenant" est le créneau réellement acheté.
  const withinSchedule = Array.isArray(ad?.hourlyIntervals)
    ? isWithinUtcIntervals(now, ad.hourlyIntervals as UtcInterval[])
    : ad
      ? now >= ad.startDate && now <= ad.endDate
      : false;
  if (
    !ad ||
    (ad.status !== "SCHEDULED" && ad.status !== "LIVE") ||
    ad.fundingMode === "TEST" ||
    !withinSchedule
  ) {
    return jsonError("Publicité introuvable.", 404);
  }

  await prisma.adEvent.create({ data: { adRequestId: id, type: "IMPRESSION" } });
  return jsonOk({ ok: true });
}
