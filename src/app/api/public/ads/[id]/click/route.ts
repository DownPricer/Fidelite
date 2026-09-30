import { NextResponse } from "next/server";
import { env } from "@/lib/env";
import { isSafeAdUrl } from "@/lib/ad-links";
import { LIMITS, rateLimit } from "@/lib/rate-limit";
import { prisma } from "@/lib/prisma";
import { isWithinUtcIntervals, type UtcInterval } from "@/lib/sponsored-hours-pricing";

/**
 * Redirection signée et sécurisée (Partie 10/17) : le clic est compté côté serveur avant
 * de rediriger vers l'URL déjà enregistrée pour cette publicité — jamais une URL fournie
 * par le visiteur (pas d'open-redirect possible). Revérifie le créneau exact acheté
 * (hourlyIntervals), pas seulement les bornes de jour : voir la même règle dans
 * /api/public/merchants et /api/public/ads/[id]/impression.
 */
export async function GET(req: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const limited = rateLimit(`ad-click:${id}`, LIMITS.qr.limit, LIMITS.qr.windowMs);
  const fallback = new URL("/decouvrir", env.appUrl);
  if (!limited.ok) return NextResponse.redirect(fallback);

  const now = new Date();
  const ad = await prisma.adRequest.findUnique({
    where: { id },
    select: { id: true, status: true, fundingMode: true, startDate: true, endDate: true, hourlyIntervals: true, ctaUrl: true },
  });
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
    return NextResponse.redirect(fallback);
  }

  await prisma.adEvent.create({ data: { adRequestId: id, type: "CLICK" } });
  // Seuls http/https sont jamais acceptés en écriture (adRequestCreateSchema : z.string().url()),
  // mais on revérifie ici en sortie par défense en profondeur avant toute redirection.
  return NextResponse.redirect(isSafeAdUrl(ad.ctaUrl) ? ad.ctaUrl : fallback.toString());
}
