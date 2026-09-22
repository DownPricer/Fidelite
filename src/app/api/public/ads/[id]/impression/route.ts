import { jsonError, jsonOk } from "@/lib/http";
import { LIMITS, rateLimit } from "@/lib/rate-limit";
import { prisma } from "@/lib/prisma";

/** Comptage agrégé des impressions (Partie 12) — aucune donnée personnelle rattachée. */
export async function POST(req: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const limited = rateLimit(`ad-impression:${id}`, LIMITS.qr.limit, LIMITS.qr.windowMs);
  if (!limited.ok) return jsonError("Trop de requêtes.", 429);

  const now = new Date();
  const ad = await prisma.adRequest.findUnique({
    where: { id },
    select: { id: true, status: true, startDate: true, endDate: true },
  });
  // Pas de statut LIVE distinct : une publicité est "en ligne" quand elle est programmée
  // et que la date du jour est dans sa fenêtre (voir /api/public/ads/route.ts pour l'affichage).
  if (!ad || ad.status !== "SCHEDULED" || now < ad.startDate || now > ad.endDate) {
    return jsonError("Publicité introuvable.", 404);
  }

  await prisma.adEvent.create({ data: { adRequestId: id, type: "IMPRESSION" } });
  return jsonOk({ ok: true });
}
