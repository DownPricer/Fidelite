import { requireMerchantAdmin } from "@/lib/api-guard";
import { describeNextAction } from "@/lib/ad-visual-workflow";
import { jsonError, jsonOkPrivate } from "@/lib/http";
import { prisma } from "@/lib/prisma";

/** Fiche campagne côté commerçant : visuel, versions, historique des messages et prochaine action. */
export async function GET(req: Request, context: { params: Promise<{ id: string }> }) {
  const staff = await requireMerchantAdmin(req);
  if (staff.error || !staff.user || !staff.membership) return staff.error ?? jsonError("Accès refusé.", 403);

  const { id } = await context.params;
  const merchantId = staff.membership.merchantId;
  const adRequest = await prisma.adRequest.findFirst({
    where: { id, merchantId },
    include: {
      campaign: { include: { payment: true } },
      images: { orderBy: { position: "asc" } },
      versions: { orderBy: { number: "desc" } },
    },
  });
  if (!adRequest) return jsonError("Demande introuvable.", 404);

  const history = await prisma.staffNotification.findMany({
    where: { adRequestId: id, audience: "MERCHANT", merchantId },
    orderBy: { createdAt: "desc" },
    take: 100,
  });
  const nextAction = describeNextAction({
    status: adRequest.status,
    visualMode: adRequest.visualMode,
    versions: adRequest.versions,
    rejectionReason: adRequest.rejectionReason,
  });
  return jsonOkPrivate({ adRequest, history, nextAction });
}
