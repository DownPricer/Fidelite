import { requireSuperAdmin } from "@/lib/api-guard";
import { jsonError, jsonOk } from "@/lib/http";
import { prisma } from "@/lib/prisma";

/** Demandes de bandeaux sponsorisés en attente (Partie 12/13). */
export async function GET(req: Request) {
  const auth = await requireSuperAdmin(req);
  if (auth.error || !auth.user) return auth.error ?? jsonError("Accès refusé.", 403);

  const url = new URL(req.url);
  const status = url.searchParams.get("status") ?? "PENDING_REVIEW";

  const ads = await prisma.adRequest.findMany({
    where: { status: status as never },
    orderBy: { createdAt: "asc" },
    include: { merchant: { select: { id: true, name: true, slug: true } }, campaign: { include: { payment: true } } },
  });

  return jsonOk({ ads });
}
