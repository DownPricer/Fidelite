import { requireMerchantAdmin, requireMutatingRequest } from "@/lib/api-guard";
import { clientIp, jsonError, jsonOk, readJson, userAgent } from "@/lib/http";
import { LoyaltyError } from "@/lib/loyalty";
import { applyLoyaltyAction } from "@/lib/loyalty-service";
import { adjustmentSchema, zodErrorMessage } from "@/lib/validation";

export async function POST(req: Request) {
  const csrf = await requireMutatingRequest(req);
  if (csrf.error) return csrf.error;
  const staff = await requireMerchantAdmin(req);
  if (staff.error || !staff.user || !staff.membership) return staff.error ?? jsonError("Accès refusé.", 403);

  const parsed = adjustmentSchema.safeParse(await readJson(req));
  if (!parsed.success) return jsonError(zodErrorMessage(parsed.error));

  try {
    const result = await applyLoyaltyAction({
      membershipId: parsed.data.membershipId,
      merchantId: staff.membership.merchantId,
      actorId: staff.user.id,
      type: "ADJUSTMENT",
      reason: parsed.data.reason,
      adjustmentDelta: parsed.data.delta,
      ip: clientIp(req),
      userAgent: userAgent(req),
    });
    return jsonOk({ ok: true, ...result });
  } catch (error) {
    if (error instanceof LoyaltyError) return jsonError(error.message);
    return jsonError("Ajustement impossible.", 400);
  }
}
