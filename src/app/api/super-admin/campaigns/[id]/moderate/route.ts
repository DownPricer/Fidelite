import { requireMutatingRequest, requireSuperAdmin } from "@/lib/api-guard";
import { refundIncludedQuota } from "@/lib/campaign-quota";
import { refundCampaignDebit } from "@/lib/marketing-balance";
import { refundCampaignPayment } from "@/lib/stripe";
import { writeAudit } from "@/lib/audit";
import { clientIp, jsonError, jsonOk, readJson, userAgent } from "@/lib/http";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const schema = z.object({
  action: z.enum(["approve", "reject"]),
  rejectionReason: z.string().trim().max(500).nullable().optional(),
});

/**
 * Décision super-admin sur une campagne réseau (Partie 13). Un refus rembourse
 * automatiquement le paiement Stripe s'il existait, ou restitue le quota consommé —
 * jamais l'un sans l'autre (Partie 8 : "remboursés si Fideto refuse une campagne réseau").
 */
export async function POST(req: Request, context: { params: Promise<{ id: string }> }) {
  const csrf = await requireMutatingRequest(req);
  if (csrf.error) return csrf.error;
  const auth = await requireSuperAdmin(req);
  if (auth.error || !auth.user) return auth.error ?? jsonError("Accès refusé.", 403);

  const { id } = await context.params;
  const parsed = schema.safeParse(await readJson(req));
  if (!parsed.success) return jsonError("Requête invalide.");

  const campaign = await prisma.campaign.findUnique({ where: { id }, include: { payment: true } });
  if (!campaign) return jsonError("Campagne introuvable.", 404);
  if (campaign.status !== "PENDING_REVIEW") {
    return jsonError("Cette campagne n'est pas en attente de validation.", 409);
  }

  if (parsed.data.action === "approve") {
    await prisma.campaign.update({ where: { id }, data: { status: "SCHEDULED" } });
    await writeAudit({
      actorId: auth.user.id,
      merchantId: campaign.merchantId,
      action: "CAMPAIGN_MODERATION_APPROVED",
      metadata: { campaignId: id },
      ip: clientIp(req),
      userAgent: userAgent(req),
    });
    return jsonOk({ ok: true, status: "SCHEDULED" });
  }

  // Refus : rembourser ce qui a été payé/consommé.
  await prisma.$transaction(async (tx) => {
    await tx.campaign.update({
      where: { id },
      data: { status: "REJECTED", rejectionReason: parsed.data.rejectionReason ?? "Refusée par Fideto." },
    });
    if (campaign.quotaKind && campaign.quotaPeriodKey && campaign.quotaConsumedAt) {
      await refundIncludedQuota(tx, {
        merchantId: campaign.merchantId,
        kind: campaign.quotaKind,
        periodKey: campaign.quotaPeriodKey,
      });
    }
    await refundCampaignDebit(tx, id, "Restitution — campagne refusée par Fideto");
    if (campaign.payment?.status === "PAID") {
      await tx.campaignPayment.update({ where: { id: campaign.payment.id }, data: { status: "REFUNDED", refundedAt: new Date() } });
    }
  });

  if (campaign.payment?.status === "PAID" && campaign.payment.stripePaymentIntentId) {
    try {
      await refundCampaignPayment(campaign.payment.stripePaymentIntentId);
    } catch (error) {
      console.error("[campaign-moderation] échec du remboursement Stripe", error);
    }
  }

  await writeAudit({
    actorId: auth.user.id,
    merchantId: campaign.merchantId,
    action: "CAMPAIGN_MODERATION_REJECTED",
    metadata: { campaignId: id, reason: parsed.data.rejectionReason ?? null },
    ip: clientIp(req),
    userAgent: userAgent(req),
  });

  return jsonOk({ ok: true, status: "REJECTED" });
}
