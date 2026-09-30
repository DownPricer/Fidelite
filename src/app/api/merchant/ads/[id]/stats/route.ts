import { requireMerchantAdmin } from "@/lib/api-guard";
import { getAdStats } from "@/lib/ad-stats";
import { jsonError, jsonOk } from "@/lib/http";
import { prisma } from "@/lib/prisma";

/** Impressions/clics réels par jour pour une mise en avant du commerce connecté. */
export async function GET(req: Request, context: { params: Promise<{ id: string }> }) {
  const staff = await requireMerchantAdmin(req);
  if (staff.error || !staff.user || !staff.membership) return staff.error ?? jsonError("Accès refusé.", 403);

  const { id } = await context.params;
  const adRequest = await prisma.adRequest.findFirst({
    where: { id, merchantId: staff.membership.merchantId },
    select: { id: true },
  });
  if (!adRequest) return jsonError("Demande introuvable.", 404);

  const stats = await getAdStats(id);
  return jsonOk(stats);
}
