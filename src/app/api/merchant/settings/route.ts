import { requireMerchantAdmin, requireMutatingRequest } from "@/lib/api-guard";
import { writeAudit } from "@/lib/audit";
import { clientIp, jsonError, jsonOk, readJson, userAgent } from "@/lib/http";
import { prisma } from "@/lib/prisma";
import { merchantSettingsSchema, zodErrorMessage } from "@/lib/validation";

export async function PATCH(req: Request) {
  const csrf = await requireMutatingRequest(req);
  if (csrf.error) return csrf.error;
  const staff = await requireMerchantAdmin(req);
  if (staff.error || !staff.user || !staff.membership) return staff.error ?? jsonError("Accès refusé.", 403);

  const parsed = merchantSettingsSchema.safeParse(await readJson(req));
  if (!parsed.success) return jsonError(zodErrorMessage(parsed.error));

  await prisma.merchant.update({
    where: { id: staff.membership.merchantId },
    data: {
      name: parsed.data.name,
      logoUrl: parsed.data.logoUrl || null,
      primaryColor: parsed.data.primaryColor,
    },
  });
  await prisma.loyaltyProgram.update({
    where: { merchantId: staff.membership.merchantId },
    data: {
      visitsRequired: parsed.data.visitsRequired,
      rewardLabel: parsed.data.rewardLabel,
    },
  });
  await writeAudit({
    actorId: staff.user.id,
    merchantId: staff.membership.merchantId,
    action: "MERCHANT_SETTINGS_UPDATE",
    ip: clientIp(req),
    userAgent: userAgent(req),
  });

  return jsonOk({ ok: true });
}
