import { NextResponse } from "next/server";
import { env } from "@/lib/env";
import { LIMITS, rateLimit } from "@/lib/rate-limit";
import { prisma } from "@/lib/prisma";

/**
 * Redirection signée et sécurisée (Partie 10/17) : le clic est compté côté serveur avant
 * de rediriger vers l'URL déjà enregistrée pour cette publicité — jamais une URL fournie
 * par le visiteur (pas d'open-redirect possible).
 */
export async function GET(req: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const limited = rateLimit(`ad-click:${id}`, LIMITS.qr.limit, LIMITS.qr.windowMs);
  const fallback = new URL("/decouvrir", env.appUrl);
  if (!limited.ok) return NextResponse.redirect(fallback);

  const now = new Date();
  const ad = await prisma.adRequest.findUnique({
    where: { id },
    select: { id: true, status: true, startDate: true, endDate: true, ctaUrl: true },
  });
  if (!ad || ad.status !== "SCHEDULED" || now < ad.startDate || now > ad.endDate) {
    return NextResponse.redirect(fallback);
  }

  await prisma.adEvent.create({ data: { adRequestId: id, type: "CLICK" } });
  return NextResponse.redirect(ad.ctaUrl || fallback.toString());
}
