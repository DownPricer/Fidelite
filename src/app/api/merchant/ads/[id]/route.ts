import { requireMerchantAdmin, requireMutatingRequest } from "@/lib/api-guard";
import { writeAudit } from "@/lib/audit";
import { clientIp, jsonError, jsonOk, readJson, userAgent } from "@/lib/http";
import { prisma } from "@/lib/prisma";
import { priceSponsoredHours, scheduleToUtcIntervals, validateSponsoredSchedule } from "@/lib/sponsored-hours-pricing";
import { adRequestUpdateSchema, zodErrorMessage } from "@/lib/validation";

/** Statuts que le commerçant peut encore modifier lui-même (voir README modération). */
const EDITABLE_STATUSES = new Set(["DRAFT", "PENDING_REVIEW", "NEEDS_CHANGES", "APPROVED"]);

export async function GET(req: Request, context: { params: Promise<{ id: string }> }) {
  const staff = await requireMerchantAdmin(req);
  if (staff.error || !staff.user || !staff.membership) return staff.error ?? jsonError("Accès refusé.", 403);

  const { id } = await context.params;
  const adRequest = await prisma.adRequest.findFirst({
    where: { id, merchantId: staff.membership.merchantId },
    include: { campaign: { include: { payment: true } }, images: { orderBy: { position: "asc" } } },
  });
  if (!adRequest) return jsonError("Demande introuvable.", 404);
  return jsonOk({ adRequest });
}

/**
 * Modification d'une demande de bandeau par le commerçant. Une demande déjà validée
 * (APPROVED) qui est modifiée perd son approbation et repart en PENDING_REVIEW — jamais
 * silencieusement republiée avec l'ancien visuel/texte/horaires. Une demande déjà programmée
 * (SCHEDULED, payée ou financée par quota) ou diffusée (LIVE) n'est plus modifiable ici : un
 * changement sur une campagne déjà active exigerait une logique de remboursement/recomplément
 * au prorata qui n'existe pas encore (voir le rapport final) — le commerçant doit attendre la
 * fin de la campagne ou contacter Fideto pour ce cas.
 */
export async function PATCH(req: Request, context: { params: Promise<{ id: string }> }) {
  const csrf = await requireMutatingRequest(req);
  if (csrf.error) return csrf.error;
  const staff = await requireMerchantAdmin(req);
  if (staff.error || !staff.user || !staff.membership) return staff.error ?? jsonError("Accès refusé.", 403);

  const { id } = await context.params;
  const merchantId = staff.membership.merchantId;
  const parsed = adRequestUpdateSchema.safeParse(await readJson(req));
  if (!parsed.success) return jsonError(zodErrorMessage(parsed.error));

  const adRequest = await prisma.adRequest.findFirst({ where: { id, merchantId } });
  if (!adRequest) return jsonError("Demande introuvable.", 404);
  if (!EDITABLE_STATUSES.has(adRequest.status)) {
    return jsonError(
      "Cette mise en avant n'est plus modifiable directement (déjà programmée, diffusée ou close). Contactez Fideto pour la modifier.",
      409,
      { code: "NOT_EDITABLE" },
    );
  }

  const data = parsed.data;
  const updates: Record<string, unknown> = {};
  if (data.requestedText !== undefined) updates.requestedText = data.requestedText;
  if (data.ctaLabel !== undefined) updates.ctaLabel = data.ctaLabel;
  if (data.ctaUrl !== undefined) updates.ctaUrl = data.ctaUrl;
  if (data.objective !== undefined) updates.objective = data.objective;
  if (adRequest.visualMode === "SELF" && data.requestedImageUrl !== undefined) {
    updates.requestedImageUrl = data.requestedImageUrl;
  }

  let pricing: ReturnType<typeof priceSponsoredHours> | null = null;
  if (data.hourlySchedule) {
    const scheduleCheck = validateSponsoredSchedule(data.hourlySchedule);
    if (!scheduleCheck.ok) return jsonError(scheduleCheck.error);
    const intervals = scheduleToUtcIntervals(data.hourlySchedule);
    if (intervals.length === 0) return jsonError("Aucun créneau diffusable dans ce planning.");
    updates.hourlySchedule = data.hourlySchedule;
    updates.hourlyIntervals = intervals;
    updates.startDate = new Date(intervals[0].start);
    updates.endDate = new Date(intervals[intervals.length - 1].end);
    pricing = priceSponsoredHours(data.hourlySchedule);
  }

  const wasApproved = adRequest.status === "APPROVED";
  if (wasApproved) {
    // Toute modification après approbation annule l'approbation précédente — jamais de
    // republication silencieuse de l'ancien visuel/texte validé par Fideto.
    updates.status = "PENDING_REVIEW";
    updates.finalImageUrl = null;
    updates.reviewedBy = null;
    updates.reviewedAt = null;
    updates.rejectionReason = null;
  } else if (adRequest.status === "NEEDS_CHANGES") {
    updates.status = "PENDING_REVIEW";
    updates.rejectionReason = null;
  }

  const updated = await prisma.adRequest.update({ where: { id }, data: updates });

  if (adRequest.campaignId) {
    const campaignUpdates: Record<string, unknown> = {};
    if (data.requestedText !== undefined) campaignUpdates.body = data.requestedText;
    if (data.ctaLabel !== undefined) campaignUpdates.actionLabel = data.ctaLabel;
    if (data.ctaUrl !== undefined) campaignUpdates.actionUrl = data.ctaUrl;
    if (wasApproved) campaignUpdates.status = "PENDING_REVIEW";
    if (Object.keys(campaignUpdates).length > 0) {
      await prisma.campaign.update({ where: { id: adRequest.campaignId }, data: campaignUpdates });
    }
  }

  await writeAudit({
    actorId: staff.user.id,
    merchantId,
    action: "AD_REQUEST_UPDATED",
    metadata: {
      adRequestId: id,
      approvalRevoked: wasApproved,
      fieldsChanged: Object.keys(updates),
      newPriceCents: pricing?.totalCents ?? null,
    },
    ip: clientIp(req),
    userAgent: userAgent(req),
  });

  return jsonOk({
    ok: true,
    adRequest: updated,
    approvalRevoked: wasApproved,
    pricing: pricing
      ? { totalCents: pricing.totalCents, totalDays: pricing.totalDays, totalHours: pricing.totalHours }
      : null,
  });
}

/** Suppression d'un brouillon uniquement — une demande déjà envoyée doit être refusée/arrêtée, pas effacée. */
export async function DELETE(req: Request, context: { params: Promise<{ id: string }> }) {
  const csrf = await requireMutatingRequest(req);
  if (csrf.error) return csrf.error;
  const staff = await requireMerchantAdmin(req);
  if (staff.error || !staff.user || !staff.membership) return staff.error ?? jsonError("Accès refusé.", 403);

  const { id } = await context.params;
  const merchantId = staff.membership.merchantId;
  const adRequest = await prisma.adRequest.findFirst({ where: { id, merchantId } });
  if (!adRequest) return jsonError("Demande introuvable.", 404);
  if (adRequest.status !== "DRAFT") {
    return jsonError("Seul un brouillon peut être supprimé.", 409, { code: "NOT_DRAFT" });
  }

  await prisma.adRequest.delete({ where: { id } });
  if (adRequest.campaignId) {
    await prisma.campaign.deleteMany({ where: { id: adRequest.campaignId, status: "DRAFT" } });
  }

  await writeAudit({
    actorId: staff.user.id,
    merchantId,
    action: "AD_REQUEST_DELETED",
    metadata: { adRequestId: id },
    ip: clientIp(req),
    userAgent: userAgent(req),
  });

  return jsonOk({ ok: true });
}
