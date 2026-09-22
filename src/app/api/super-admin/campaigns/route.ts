import { requireSuperAdmin } from "@/lib/api-guard";
import { jsonError, jsonOk } from "@/lib/http";
import { prisma } from "@/lib/prisma";

/**
 * Modération des campagnes réseau (Partie 13) — espace super-admin uniquement, jamais
 * mélangé avec l'espace commerçant. Ne renvoie que ce qui est nécessaire à la décision :
 * pas de liste de destinataires individuels, seulement les compteurs déjà agrégés.
 */
export async function GET(req: Request) {
  const auth = await requireSuperAdmin(req);
  if (auth.error || !auth.user) return auth.error ?? jsonError("Accès refusé.", 403);

  const url = new URL(req.url);
  const status = url.searchParams.get("status") ?? "PENDING_REVIEW";

  const campaigns = await prisma.campaign.findMany({
    where: { audienceType: "NETWORK_LOCAL", status: status as never },
    orderBy: { createdAt: "asc" },
    include: {
      merchant: { select: { id: true, name: true, slug: true, city: true } },
      payment: true,
    },
  });

  return jsonOk({ campaigns });
}
