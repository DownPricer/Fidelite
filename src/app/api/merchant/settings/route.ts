import { requireMerchantAdmin, requireMutatingRequest } from "@/lib/api-guard";
import { clientIp, jsonError, jsonOk, userAgent } from "@/lib/http";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: Request) {
  const csrf = await requireMutatingRequest(req);
  if (csrf.error) return csrf.error;
  const staff = await requireMerchantAdmin(req);
  if (staff.error || !staff.user || !staff.membership) return staff.error ?? jsonError("Accès refusé.", 403);

  await prisma.auditLog.create({
    data: {
      actorId: staff.user.id,
      merchantId: staff.membership.merchantId,
      action: "MERCHANT_SETTINGS_UPDATE",
      ip: clientIp(req),
      userAgent: userAgent(req),
    },
  });

  return jsonOk({ ok: true });
}
