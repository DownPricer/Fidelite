import { z } from "zod";
import { requireMerchantAdmin, requireMutatingRequest } from "@/lib/api-guard";
import { writeAudit } from "@/lib/audit";
import { clientIp, jsonError, jsonOk, jsonOkPrivate, readJson, userAgent } from "@/lib/http";
import { BillingError, previewCancellation, requestSubscriptionCancellation } from "@/lib/merchant-billing";
import { prisma } from "@/lib/prisma";
import { zodErrorMessage } from "@/lib/validation";

/** Écran de confirmation : date effective de l'arrêt (fin de la période en cours) et état actuel. */
export async function GET(req: Request) {
  const staff = await requireMerchantAdmin(req);
  if (staff.error || !staff.user || !staff.membership) return staff.error ?? jsonError("Accès refusé.", 403);
  try {
    return jsonOkPrivate(await previewCancellation(staff.membership.merchantId));
  } catch (error) {
    if (error instanceof BillingError) return jsonError(error.message, error.status, { code: error.code });
    throw error;
  }
}

const schema = z.object({ effectiveAt: z.string().datetime() });

/** Programme l'arrêt à la fin de la période (jamais immédiat ; ni compte ni données supprimés). */
export async function POST(req: Request) {
  const csrf = await requireMutatingRequest(req);
  if (csrf.error) return csrf.error;
  const staff = await requireMerchantAdmin(req);
  if (staff.error || !staff.user || !staff.membership) return staff.error ?? jsonError("Accès refusé.", 403);
  const parsed = schema.safeParse(await readJson(req));
  if (!parsed.success) return jsonError(zodErrorMessage(parsed.error));
  const merchantId = staff.membership.merchantId;

  try {
    const sub = await requestSubscriptionCancellation(merchantId, parsed.data.effectiveAt);
    await writeAudit({
      actorId: staff.user.id,
      merchantId,
      action: "SUBSCRIPTION_CANCEL_SCHEDULED",
      metadata: { effectiveAt: sub?.cancelEffectiveAt?.toISOString() ?? null, source: sub?.stripeSubscriptionId ? "STRIPE" : "MANUAL" },
      ip: clientIp(req),
      userAgent: userAgent(req),
    });
    await prisma.staffNotification.create({
      data: {
        audience: "SUPER_ADMIN",
        merchantId,
        kind: "SUBSCRIPTION_CANCEL_SCHEDULED",
        message: `Un commerçant a programmé l'arrêt de son abonnement (effectif le ${sub?.cancelEffectiveAt?.toLocaleDateString("fr-FR") ?? "—"}).`,
      },
    });
    return jsonOk({ ok: true, cancelAtPeriodEnd: true, effectiveAt: sub?.cancelEffectiveAt ?? null });
  } catch (error) {
    if (error instanceof BillingError) return jsonError(error.message, error.status, { code: error.code });
    throw error;
  }
}
