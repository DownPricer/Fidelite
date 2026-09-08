import { requireCaisse, requireCaissePermission, requireMutatingRequest } from "@/lib/api-guard";
import { assertEarnProgramRules, sanitizeEarnResponse } from "@/lib/caisse-program";
import { clientIp, jsonError, jsonOk, readJson, userAgent } from "@/lib/http";
import { applyLoyaltyAction } from "@/lib/loyalty-service";
import { LoyaltyError } from "@/lib/loyalty";
import { programToConfig } from "@/lib/loyalty-program";
import { prisma } from "@/lib/prisma";
import { caisseEarnSchema, zodErrorMessage } from "@/lib/validation";

export async function POST(req: Request) {
  const csrf = await requireMutatingRequest(req);
  if (csrf.error) return csrf.error;
  const staff = await requireCaisse(req);
  if (staff.error || !staff.user || !staff.membership) return staff.error ?? jsonError("Accès refusé.", 403);

  const permissionError = requireCaissePermission(staff.membership, "addPoints");
  if (permissionError) return permissionError;

  const parsed = caisseEarnSchema.safeParse(await readJson(req));
  if (!parsed.success) return jsonError(zodErrorMessage(parsed.error));

  const grant = await prisma.caisseGrant.findFirst({
    where: {
      id: parsed.data.grantId,
      actorUserId: staff.user.id,
      merchantId: staff.membership.merchantId,
    },
  });
  if (!grant || grant.consumedAt || grant.expiresAt < new Date()) {
    return jsonError("Session de scan expirée. Scannez à nouveau le client.", 409);
  }

  const membership = await prisma.customerMembership.findFirst({
    where: { id: grant.customerMembershipId, merchantId: staff.membership.merchantId },
    include: { merchant: { include: { program: { include: { rewards: true } } } } },
  });
  if (!membership?.merchant.program) {
    return jsonError("Carte introuvable.", 404);
  }

  const config = programToConfig(membership.merchant.program);

  try {
    await assertEarnProgramRules({
      customerMembershipId: grant.customerMembershipId,
      merchantId: staff.membership.merchantId,
      mode: config.mode,
      rules: config.rules,
      purchaseAmount: parsed.data.purchaseAmount,
    });

    const result = await applyLoyaltyAction({
      membershipId: grant.customerMembershipId,
      merchantId: staff.membership.merchantId,
      actorId: staff.user.id,
      type: "EARN_VISIT",
      purchaseAmount: parsed.data.purchaseAmount,
      ip: clientIp(req),
      userAgent: userAgent(req),
    });
    await prisma.caisseGrant.update({
      where: { id: grant.id },
      data: { consumedAt: new Date() },
    });
    return jsonOk({
      ok: true,
      action: "EARN_VISIT",
      ...sanitizeEarnResponse(result),
    });
  } catch (error) {
    if (error instanceof LoyaltyError) return jsonError(error.message);
    return jsonError("Action impossible pour le moment.", 500);
  }
}
