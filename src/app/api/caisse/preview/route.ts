import { requireCaisse, requireCaissePermission, requireMutatingRequest } from "@/lib/api-guard";
import { clientIp, jsonError, jsonOk, readJson, userAgent } from "@/lib/http";
import { LoyaltyError } from "@/lib/loyalty";
import { previewLoyaltyTransaction } from "@/lib/loyalty-commit";
import { MoneyError } from "@/lib/money";
import { writeAudit } from "@/lib/audit";
import { caissePreviewSchema, zodErrorMessage } from "@/lib/validation";

export async function POST(req: Request) {
  const csrf = await requireMutatingRequest(req);
  if (csrf.error) return csrf.error;
  const staff = await requireCaisse(req);
  if (staff.error || !staff.user || !staff.membership) return staff.error ?? jsonError("Accès refusé.", 403);

  const parsed = caissePreviewSchema.safeParse(await readJson(req));
  if (!parsed.success) return jsonError(zodErrorMessage(parsed.error));

  const permissionError = requireCaissePermission(
    staff.membership,
    parsed.data.action === "REDEEM" ? "redeemReward" : "addPoints",
  );
  if (permissionError) return permissionError;

  try {
    const view = await previewLoyaltyTransaction({
      grantId: parsed.data.grantId,
      actorUserId: staff.user.id,
      merchantId: staff.membership.merchantId,
      action: parsed.data.action,
      purchaseAmountCents: parsed.data.purchaseAmountCents,
      purchaseAmount: parsed.data.purchaseAmount,
      rewardId: parsed.data.rewardId,
    });
    return jsonOk(view);
  } catch (error) {
    await writeAudit({
      actorId: staff.user.id,
      merchantId: staff.membership.merchantId,
      action: "CAISSE_PREVIEW_DENIED",
      metadata: { reason: error instanceof Error ? error.message : "preview" },
      ip: clientIp(req),
      userAgent: userAgent(req),
    });
    if (error instanceof LoyaltyError || error instanceof MoneyError) {
      return jsonError(error.message);
    }
    return jsonError("Aperçu impossible pour le moment.", 500);
  }
}
