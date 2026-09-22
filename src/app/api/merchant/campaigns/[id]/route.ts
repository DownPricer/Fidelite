import { requireMerchantAdmin, requireMutatingRequest } from "@/lib/api-guard";
import { CAMPAIGN_STATUS_LABELS, isCancellable } from "@/lib/campaign-lifecycle";
import { writeAudit } from "@/lib/audit";
import { clientIp, jsonError, jsonOk, readJson, userAgent } from "@/lib/http";
import { prisma } from "@/lib/prisma";
import { campaignContentSchema, zodErrorMessage } from "@/lib/validation";

/**
 * Toute route campagne charge d'abord la campagne PAR merchantId (jamais par id seul) :
 * c'est ce qui garantit l'isolation entre commerces, pas juste la session caisse/admin.
 */
async function loadOwnedCampaign(merchantId: string, id: string) {
  return prisma.campaign.findFirst({ where: { id, merchantId } });
}

export async function GET(req: Request, context: { params: Promise<{ id: string }> }) {
  const staff = await requireMerchantAdmin(req);
  if (staff.error || !staff.user || !staff.membership) return staff.error ?? jsonError("Accès refusé.", 403);

  const { id } = await context.params;
  const campaign = await loadOwnedCampaign(staff.membership.merchantId, id);
  if (!campaign) return jsonError("Campagne introuvable.", 404);

  return jsonOk({ campaign: { ...campaign, statusLabel: CAMPAIGN_STATUS_LABELS[campaign.status] } });
}

/** Modifie le contenu d'une campagne — uniquement tant qu'elle est en brouillon. */
export async function PATCH(req: Request, context: { params: Promise<{ id: string }> }) {
  const csrf = await requireMutatingRequest(req);
  if (csrf.error) return csrf.error;
  const staff = await requireMerchantAdmin(req);
  if (staff.error || !staff.user || !staff.membership) return staff.error ?? jsonError("Accès refusé.", 403);

  const { id } = await context.params;
  const campaign = await loadOwnedCampaign(staff.membership.merchantId, id);
  if (!campaign) return jsonError("Campagne introuvable.", 404);
  if (campaign.status !== "DRAFT") {
    return jsonError("Cette campagne n'est plus modifiable.", 409, { code: "NOT_EDITABLE" });
  }

  const parsed = campaignContentSchema.safeParse(await readJson(req));
  if (!parsed.success) return jsonError(zodErrorMessage(parsed.error));

  const updated = await prisma.campaign.update({
    where: { id: campaign.id },
    data: {
      title: parsed.data.title,
      body: parsed.data.body,
      imageUrl: parsed.data.imageUrl ?? null,
      actionLabel: parsed.data.actionLabel ?? null,
      actionUrl: parsed.data.actionUrl ?? null,
      scheduledAt: parsed.data.scheduledAt ? new Date(parsed.data.scheduledAt) : null,
    },
  });

  return jsonOk({ campaign: { ...updated, statusLabel: CAMPAIGN_STATUS_LABELS[updated.status] } });
}

/** Annule une campagne non commencée (Partie 7.5). */
export async function DELETE(req: Request, context: { params: Promise<{ id: string }> }) {
  const csrf = await requireMutatingRequest(req);
  if (csrf.error) return csrf.error;
  const staff = await requireMerchantAdmin(req);
  if (staff.error || !staff.user || !staff.membership) return staff.error ?? jsonError("Accès refusé.", 403);

  const { id } = await context.params;
  const campaign = await loadOwnedCampaign(staff.membership.merchantId, id);
  if (!campaign) return jsonError("Campagne introuvable.", 404);
  if (!isCancellable(campaign.status)) {
    return jsonError("Cette campagne a déjà commencé son envoi et ne peut plus être annulée.", 409, {
      code: "NOT_CANCELLABLE",
    });
  }

  await prisma.campaign.update({ where: { id: campaign.id }, data: { status: "CANCELLED" } });

  await writeAudit({
    actorId: staff.user.id,
    merchantId: staff.membership.merchantId,
    action: "CAMPAIGN_CANCELLED",
    metadata: { campaignId: campaign.id, previousStatus: campaign.status },
    ip: clientIp(req),
    userAgent: userAgent(req),
  });

  return jsonOk({ ok: true });
}
