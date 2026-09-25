import { requireMutatingRequest, requireSuperAdmin } from "@/lib/api-guard";
import { writeAudit } from "@/lib/audit";
import { clientIp, jsonError, jsonOk, readJson, userAgent } from "@/lib/http";
import { prisma } from "@/lib/prisma";
import { adModerationSchema, zodErrorMessage } from "@/lib/validation";

/**
 * Partie 12 étapes 3-5 : le super-admin ajoute (ou importe) le visuel final, peut ajuster
 * les dates avant validation, puis approuve (le commerçant reçoit l'aperçu et valide
 * ensuite via /api/merchant/ads/[id]/confirm) ou refuse avec motif.
 */
export async function PATCH(req: Request, context: { params: Promise<{ id: string }> }) {
  const csrf = await requireMutatingRequest(req);
  if (csrf.error) return csrf.error;
  const auth = await requireSuperAdmin(req);
  if (auth.error || !auth.user) return auth.error ?? jsonError("Accès refusé.", 403);

  const { id } = await context.params;
  const parsed = adModerationSchema.safeParse(await readJson(req));
  if (!parsed.success) return jsonError(zodErrorMessage(parsed.error));

  const adRequest = await prisma.adRequest.findUnique({ where: { id }, include: { campaign: true } });
  if (!adRequest) return jsonError("Demande introuvable.", 404);
  if (adRequest.status !== "PENDING_REVIEW") {
    return jsonError("Cette demande n'est plus en attente de validation.", 409);
  }

  if (parsed.data.action === "reject") {
    await prisma.$transaction(async (tx) => {
      await tx.adRequest.update({
        where: { id },
        data: { status: "REJECTED", rejectionReason: parsed.data.rejectionReason ?? "Refusée par Fideto." },
      });
      if (adRequest.campaignId) {
        await tx.campaign.update({
          where: { id: adRequest.campaignId },
          data: { status: "REJECTED", rejectionReason: parsed.data.rejectionReason ?? "Refusée par Fideto." },
        });
      }
    });
    await writeAudit({
      actorId: auth.user.id,
      merchantId: adRequest.merchantId,
      action: "AD_REJECTED",
      metadata: { adRequestId: id, reason: parsed.data.rejectionReason ?? null },
      ip: clientIp(req),
      userAgent: userAgent(req),
    });
    return jsonOk({ ok: true, status: "REJECTED" });
  }

  if (!parsed.data.finalImageUrl) {
    return jsonError("Un visuel final est requis pour approuver.", 400);
  }

  const updated = await prisma.adRequest.update({
    where: { id },
    data: {
      status: "APPROVED",
      finalImageUrl: parsed.data.finalImageUrl,
      startDate: parsed.data.startDate ? new Date(parsed.data.startDate) : undefined,
      endDate: parsed.data.endDate ? new Date(parsed.data.endDate) : undefined,
      reviewedBy: auth.user.id,
      reviewedAt: new Date(),
    },
  });

  await writeAudit({
    actorId: auth.user.id,
    merchantId: adRequest.merchantId,
    action: "AD_APPROVED",
    metadata: { adRequestId: id },
    ip: clientIp(req),
    userAgent: userAgent(req),
  });

  return jsonOk({ ok: true, adRequest: updated });
}
