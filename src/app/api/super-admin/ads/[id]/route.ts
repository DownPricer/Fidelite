import type { AdRequestStatus } from "@prisma/client";
import { requireMutatingRequest, requireSuperAdmin } from "@/lib/api-guard";
import { isSafeAdUrl } from "@/lib/ad-links";
import { getAdStats } from "@/lib/ad-stats";
import { writeAudit } from "@/lib/audit";
import { clientIp, jsonError, jsonOk, readJson, userAgent } from "@/lib/http";
import { prisma } from "@/lib/prisma";
import { computeAdLifecycleStatus } from "@/lib/ad-lifecycle-worker";
import { approveSubmittedVersion, notifyMerchant, refuseVisual } from "@/lib/ad-visual-workflow";
import { adModerationSchema, zodErrorMessage } from "@/lib/validation";

/** Fiche complète d'une demande de bandeau — super-admin uniquement (historique, paiement, stats). */
export async function GET(req: Request, context: { params: Promise<{ id: string }> }) {
  const auth = await requireSuperAdmin(req);
  if (auth.error || !auth.user) return auth.error ?? jsonError("Accès refusé.", 403);

  const { id } = await context.params;
  const adRequest = await prisma.adRequest.findUnique({
    where: { id },
    include: {
      merchant: { select: { id: true, name: true, slug: true, city: true, logoUrl: true } },
      campaign: { include: { payment: true } },
      images: { orderBy: { position: "asc" } },
    },
  });
  if (!adRequest) return jsonError("Demande introuvable.", 404);

  const [audit, stats] = await Promise.all([
    prisma.auditLog.findMany({
      where: { merchantId: adRequest.merchantId, metadata: { path: ["adRequestId"], equals: id } },
      orderBy: { createdAt: "desc" },
      take: 50,
      include: { actor: { select: { firstName: true, lastName: true } } },
    }),
    getAdStats(id),
  ]);

  return jsonOk({ adRequest, audit, stats });
}

/**
 * Actions de modération/pilotage super-admin (Partie 12 étapes 3-5, étendues) : approuver,
 * refuser, demander une correction, suspendre, relancer, arrêter définitivement. Chaque action
 * est vérifiée contre le statut courant côté serveur (jamais de confiance dans l'état affiché
 * au client) et journalisée dans AuditLog avec l'ancien/nouveau statut et le motif éventuel.
 */
export async function PATCH(req: Request, context: { params: Promise<{ id: string }> }) {
  const csrf = await requireMutatingRequest(req);
  if (csrf.error) return csrf.error;
  const auth = await requireSuperAdmin(req);
  if (auth.error || !auth.user) return auth.error ?? jsonError("Accès refusé.", 403);

  const { id } = await context.params;
  const parsedBody = adModerationSchema.safeParse(await readJson(req));
  if (!parsedBody.success) return jsonError(zodErrorMessage(parsedBody.error));
  const data = parsedBody.data;
  const { action } = data;

  const found = await prisma.adRequest.findUnique({
    where: { id },
    include: { campaign: true },
  });
  if (!found) return jsonError("Demande introuvable.", 404);
  const adRequest = found;
  const previousStatus = adRequest.status;
  const actorId = auth.user.id;

  async function applyStatus(nextStatus: AdRequestStatus, extra: Record<string, unknown> = {}) {
    await prisma.$transaction(async (tx) => {
      await tx.adRequest.update({ where: { id }, data: { status: nextStatus, ...extra } });
      // CampaignStatus n'a pas d'équivalent SUSPENDED/STOPPED/NEEDS_CHANGES : AdRequest.status
      // reste la seule source de vérité pour ces états (voir hourlyIntervals pour la diffusion
      // réelle). Campaign.rejectionReason est en revanche ce que lit l'espace commerçant
      // (GET /api/merchant/campaigns) : toujours synchronisé avec le motif fourni, quelle que
      // soit l'action, pour que le commerçant voie systématiquement pourquoi.
      if (adRequest.campaignId) {
        await tx.campaign.update({
          where: { id: adRequest.campaignId },
          data: {
            ...(nextStatus === "REJECTED" ? { status: "REJECTED" as const } : {}),
            rejectionReason: typeof extra.rejectionReason === "string" || extra.rejectionReason === null
              ? (extra.rejectionReason as string | null)
              : undefined,
            body: typeof extra.requestedText === "string" ? extra.requestedText : undefined,
            actionLabel: extra.ctaLabel as string | null | undefined,
            actionUrl: extra.ctaUrl as string | null | undefined,
            imageUrl: typeof extra.finalImageUrl === "string" ? extra.finalImageUrl : undefined,
          },
        });
      }
    });
    await writeAudit({
      actorId,
      merchantId: adRequest.merchantId,
      action: `AD_${action.toUpperCase()}`,
      metadata: {
        adRequestId: id,
        previousStatus,
        nextStatus,
        reason: data.rejectionReason ?? null,
      },
      ip: clientIp(req),
      userAgent: userAgent(req),
    });
  }

  if (action === "reject") {
    if (
      previousStatus !== "PENDING_REVIEW" &&
      previousStatus !== "NEEDS_CHANGES" &&
      previousStatus !== "APPROVED" &&
      previousStatus !== "AWAITING_MERCHANT"
    ) {
      return jsonError("Cette demande ne peut plus être refusée dans son état actuel.", 409);
    }
    // Refus de la CAMPAGNE entière (définitif) — distinct du refus d'un simple visuel (request_changes).
    const campaignReason = data.rejectionReason?.trim() || "Refusée par Fideto.";
    await applyStatus("REJECTED", { rejectionReason: campaignReason });
    await notifyMerchant(prisma, adRequest, "CAMPAIGN_REFUSED", `Votre campagne est refusée : ${campaignReason}`);
    return jsonOk({ ok: true, status: "REJECTED" });
  }

  if (action === "request_changes") {
    if (previousStatus !== "PENDING_REVIEW" && previousStatus !== "APPROVED") {
      return jsonError("Une correction ne peut être demandée que sur une demande en attente ou déjà approuvée.", 409);
    }
    if (!data.rejectionReason?.trim()) {
      return jsonError("Indiquez le motif de la correction demandée.", 400);
    }
    // Refus du VISUEL seulement : la campagne reste en vie, le commerçant corrige et re-soumet.
    const reason = data.rejectionReason.trim();
    await prisma.$transaction((tx) => refuseVisual(tx, adRequest, actorId, reason));
    await writeAudit({
      actorId,
      merchantId: adRequest.merchantId,
      action: "AD_REQUEST_CHANGES",
      metadata: { adRequestId: id, previousStatus, nextStatus: "NEEDS_CHANGES", reason },
      ip: clientIp(req),
      userAgent: userAgent(req),
    });
    return jsonOk({ ok: true, status: "NEEDS_CHANGES" });
  }

  if (action === "approve") {
    if (previousStatus !== "PENDING_REVIEW" && previousStatus !== "NEEDS_CHANGES") {
      return jsonError("Cette demande n'est plus en attente de validation.", 409);
    }
    const ctaUrl = data.ctaUrl !== undefined ? data.ctaUrl : adRequest.ctaUrl;
    if (ctaUrl && !isSafeAdUrl(ctaUrl)) {
      return jsonError("Le lien du bandeau n'est pas valide (http/https requis).", 400, { code: "INVALID_LINK" });
    }
    if (!Array.isArray(adRequest.hourlySchedule) || (adRequest.hourlySchedule as unknown[]).length === 0) {
      return jsonError("Cette demande ne possède aucun créneau valide.", 409, { code: "NO_SCHEDULE" });
    }

    // On n'approuve QUE la version soumise par le commerçant (jamais une URL fournie par le client).
    // Les créneaux ne sont jamais modifiés ici. Sans version soumise (création par Fideto, ou ancienne
    // demande), le super-admin importe un bandeau et le propose au commerçant.
    const approved = await prisma.$transaction(async (tx) => {
      const version = await approveSubmittedVersion(tx, adRequest, actorId);
      if (!version) return null;
      await tx.adRequest.update({
        where: { id },
        data: { requestedText: data.requestedText, ctaLabel: data.ctaLabel, ctaUrl: data.ctaUrl },
      });
      if (adRequest.campaignId) {
        await tx.campaign.update({
          where: { id: adRequest.campaignId },
          data: { body: data.requestedText, actionLabel: data.ctaLabel, actionUrl: data.ctaUrl },
        });
      }
      return version;
    });
    if (!approved) {
      return jsonError("Aucun bandeau soumis à approuver. Importez un bandeau et envoyez-le au commerçant.", 409, {
        code: "NO_SUBMITTED_VERSION",
      });
    }
    await writeAudit({
      actorId,
      merchantId: adRequest.merchantId,
      action: "AD_APPROVE",
      metadata: { adRequestId: id, previousStatus, nextStatus: "APPROVED", versionId: approved.id },
      ip: clientIp(req),
      userAgent: userAgent(req),
    });
    return jsonOk({ ok: true, status: "APPROVED" });
  }

  if (action === "suspend") {
    if (previousStatus !== "SCHEDULED" && previousStatus !== "LIVE") {
      return jsonError("Seule une mise en avant programmée ou en cours de diffusion peut être suspendue.", 409);
    }
    await applyStatus("SUSPENDED", { rejectionReason: data.rejectionReason ?? null });
    return jsonOk({ ok: true, status: "SUSPENDED" });
  }

  if (action === "resume") {
    if (previousStatus !== "SUSPENDED") {
      return jsonError("Seule une mise en avant suspendue peut être relancée.", 409);
    }
    const nextStatus = computeAdLifecycleStatus(
      { startDate: adRequest.startDate, endDate: adRequest.endDate, hourlyIntervals: adRequest.hourlyIntervals },
      new Date(),
    );
    await applyStatus(nextStatus, { rejectionReason: null });
    return jsonOk({ ok: true, status: nextStatus });
  }

  if (action === "stop") {
    if (previousStatus !== "SCHEDULED" && previousStatus !== "LIVE" && previousStatus !== "SUSPENDED") {
      return jsonError("Cette mise en avant ne peut pas être arrêtée dans son état actuel.", 409);
    }
    await applyStatus("STOPPED", { rejectionReason: data.rejectionReason ?? null });
    return jsonOk({ ok: true, status: "STOPPED" });
  }

  return jsonError("Action inconnue.", 400);
}
