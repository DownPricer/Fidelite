import { requireSuperAdmin } from "@/lib/api-guard";
import { describeNextAction } from "@/lib/ad-visual-workflow";
import { getAdStats } from "@/lib/ad-stats";
import { jsonError, jsonOk } from "@/lib/http";
import { prisma } from "@/lib/prisma";

// Même logique de modération/pilotage que l'ancienne route, exposée sous une URL neutre
// (les bloqueurs de publicités filtrent les URL contenant un segment « ads »).
export { PATCH } from "../../ads/[id]/route";

/** Fiche complète super-admin : demande, sources, versions du visuel, notifications, historique, statistiques. */
export async function GET(req: Request, context: { params: Promise<{ id: string }> }) {
  const auth = await requireSuperAdmin(req);
  if (auth.error || !auth.user) return auth.error ?? jsonError("Accès refusé.", 403);

  const { id } = await context.params;
  const adRequest = await prisma.adRequest.findUnique({
    where: { id },
    include: {
      merchant: { select: { id: true, name: true, slug: true, city: true, logoUrl: true } },
      campaign: { include: { payment: true } },
      images: { orderBy: { position: "asc" } },
      versions: { orderBy: { number: "desc" } },
    },
  });
  if (!adRequest) return jsonError("Demande introuvable.", 404);

  const [audit, stats, notifications] = await Promise.all([
    prisma.auditLog.findMany({
      where: { merchantId: adRequest.merchantId, metadata: { path: ["adRequestId"], equals: id } },
      orderBy: { createdAt: "desc" },
      take: 50,
      include: { actor: { select: { firstName: true, lastName: true } } },
    }),
    getAdStats(id),
    prisma.staffNotification.findMany({ where: { adRequestId: id }, orderBy: { createdAt: "desc" }, take: 50 }),
  ]);

  const nextAction = describeNextAction({
    status: adRequest.status,
    visualMode: adRequest.visualMode,
    versions: adRequest.versions,
    rejectionReason: adRequest.rejectionReason,
  });
  return jsonOk({ adRequest, audit, stats, notifications, nextAction });
}
