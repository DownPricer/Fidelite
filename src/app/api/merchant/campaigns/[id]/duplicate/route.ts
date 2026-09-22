import { requireMerchantAdmin, requireMutatingRequest } from "@/lib/api-guard";
import { isDuplicable } from "@/lib/campaign-lifecycle";
import { jsonError, jsonOk } from "@/lib/http";
import { prisma } from "@/lib/prisma";

/** Duplique une campagne existante en nouveau brouillon (Partie 7.5). */
export async function POST(req: Request, context: { params: Promise<{ id: string }> }) {
  const csrf = await requireMutatingRequest(req);
  if (csrf.error) return csrf.error;
  const staff = await requireMerchantAdmin(req);
  if (staff.error || !staff.user || !staff.membership) return staff.error ?? jsonError("Accès refusé.", 403);

  const { id } = await context.params;
  const merchantId = staff.membership.merchantId;
  const source = await prisma.campaign.findFirst({ where: { id, merchantId } });
  if (!source) return jsonError("Campagne introuvable.", 404);
  if (!isDuplicable(source.status)) {
    return jsonError("Cette campagne est en cours d'envoi et ne peut pas être dupliquée maintenant.", 409);
  }

  const copy = await prisma.campaign.create({
    data: {
      merchantId,
      channel: source.channel,
      audienceType: source.audienceType,
      status: "DRAFT",
      title: source.title,
      body: source.body,
      imageUrl: source.imageUrl,
      actionLabel: source.actionLabel,
      actionUrl: source.actionUrl,
      quotaKind: source.quotaKind,
      createdBy: staff.user.id,
    },
  });

  return jsonOk({ campaign: copy });
}
