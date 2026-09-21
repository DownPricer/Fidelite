import { requireMerchantAdmin, requireMutatingRequest } from "@/lib/api-guard";
import { clientIp, jsonError, jsonOk, userAgent } from "@/lib/http";
import { writeAudit } from "@/lib/audit";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const csrf = await requireMutatingRequest(req);
  if (csrf.error) return csrf.error;

  const staff = await requireMerchantAdmin(req);
  if (staff.error || !staff.membership) return staff.error ?? jsonError("Accès refusé.", 403);

  const merchantId = staff.membership.merchantId;
  const now = new Date();

  await prisma.merchantSubscription.upsert({
    where: { merchantId },
    update: { insightRequestedAt: now },
    create: { merchantId, insightRequestedAt: now },
  });

  await writeAudit({
    actorId: staff.user.id,
    merchantId,
    action: "INSIGHT_ACTIVATION_REQUESTED",
    ip: clientIp(req),
    userAgent: userAgent(req),
  });

  return jsonOk({ requested: true });
}
