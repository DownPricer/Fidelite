import { requireCaisse, requireCaissePermission, requireMutatingRequest } from "@/lib/api-guard";
import { clientIp, jsonError, jsonOk, readJson, userAgent } from "@/lib/http";
import { LoyaltyError } from "@/lib/loyalty";
import { commitLoyaltyTransaction } from "@/lib/loyalty-commit";
import { MoneyError } from "@/lib/money";
import { caisseCommitSchema, zodErrorMessage } from "@/lib/validation";

export async function POST(req: Request) {
  const csrf = await requireMutatingRequest(req);
  if (csrf.error) return csrf.error;
  const staff = await requireCaisse(req);
  if (staff.error || !staff.user || !staff.membership) return staff.error ?? jsonError("Accès refusé.", 403);

  const parsed = caisseCommitSchema.safeParse(await readJson(req));
  if (!parsed.success) return jsonError(zodErrorMessage(parsed.error));

  const permissionError = requireCaissePermission(
    staff.membership,
    parsed.data.action === "REDEEM" ? "redeemReward" : "addPoints",
  );
  if (permissionError) return permissionError;

  try {
    const view = await commitLoyaltyTransaction({
      grantId: parsed.data.grantId,
      actorUserId: staff.user.id,
      merchantId: staff.membership.merchantId,
      action: parsed.data.action,
      purchaseAmountCents: parsed.data.purchaseAmountCents,
      purchaseAmount: parsed.data.purchaseAmount,
      rewardId: parsed.data.rewardId,
      idempotencyKey: parsed.data.idempotencyKey,
      ip: clientIp(req),
      userAgent: userAgent(req),
    });
    return jsonOk(view);
  } catch (error) {
    if (error instanceof LoyaltyError || error instanceof MoneyError) {
      return jsonError(error.message, error.message.includes("déjà") ? 409 : 400);
    }
    return jsonError("Action impossible pour le moment.", 500);
  }
}
