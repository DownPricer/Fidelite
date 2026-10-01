import { NextResponse } from "next/server";
import { isSafeAdUrl } from "@/lib/ad-links";
import { requireStandardUser } from "@/lib/api-guard";
import { env } from "@/lib/env";
import { prisma } from "@/lib/prisma";
import { isAdEligibleForCustomer, parsePlacement } from "@/lib/sponsored-selection";

/**
 * Clic : compté avec le placement d'origine puis redirection vers le lien APPROUVÉ de la campagne
 * (jamais une URL fournie par le visiteur). Hors éligibilité, retour à la recherche sans compter.
 */
export async function GET(req: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const fallback = new URL("/decouvrir", env.appUrl).toString();
  const auth = await requireStandardUser(req);
  if (auth.error || !auth.user) return NextResponse.redirect(fallback);

  const ad = await isAdEligibleForCustomer(id, auth.user.id);
  if (!ad) return NextResponse.redirect(fallback);

  const placement = parsePlacement(new URL(req.url).searchParams.get("placement"));
  await prisma.adEvent.create({ data: { adRequestId: id, type: "CLICK", placement } });
  const target = ad.ctaUrl && isSafeAdUrl(ad.ctaUrl) ? ad.ctaUrl : new URL(`/c/${ad.merchant.slug}`, env.appUrl).toString();
  return NextResponse.redirect(target);
}
