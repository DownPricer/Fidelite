import { requireMerchantAdmin, requireMutatingRequest } from "@/lib/api-guard";
import { quotaKindFor } from "@/lib/campaign-pricing";
import { calendarPeriodKeyEuropeParis, getQuotaUsage, includedQuotaFor, resolvePlanTier } from "@/lib/campaign-quota";
import { CAMPAIGN_STATUS_LABELS } from "@/lib/campaign-lifecycle";
import { writeAudit } from "@/lib/audit";
import { clientIp, jsonError, jsonOk, readJson, userAgent } from "@/lib/http";
import { prisma } from "@/lib/prisma";
import { campaignCreateSchema, zodErrorMessage } from "@/lib/validation";

/** Tableau de bord campagnes (Partie 7.1) : quotas restants + campagnes groupées par statut. */
export async function GET(req: Request) {
  const staff = await requireMerchantAdmin(req);
  if (staff.error || !staff.user || !staff.membership) return staff.error ?? jsonError("Accès refusé.", 403);

  const merchantId = staff.membership.merchantId;
  const now = new Date();
  const periodKey = calendarPeriodKeyEuropeParis(now);
  const tier = await resolvePlanTier(merchantId);

  const quotaKinds = ["MEMBER_NOTIFICATION", "MEMBER_EMAIL", "SPONSORED_DAY"] as const;
  const quotas = await Promise.all(
    quotaKinds.map(async (kind) => {
      const limit = includedQuotaFor(tier, kind);
      const used = limit > 0 ? await getQuotaUsage({ merchantId, kind, periodKey }) : 0;
      return { kind, limit, used, remaining: Math.max(0, limit - used) };
    }),
  );

  const campaigns = await prisma.campaign.findMany({
    where: { merchantId },
    orderBy: { createdAt: "desc" },
    take: 100,
    include: { payment: true, adRequest: true },
  });

  // Comptage des échecs de livraison (Partie 7.2) — une seule requête groupée
  // plutôt qu'un N+1 par campagne.
  const failedCounts = campaigns.length
    ? await prisma.campaignDelivery.groupBy({
        by: ["campaignId"],
        where: { campaignId: { in: campaigns.map((c) => c.id) }, status: "FAILED" },
        _count: { _all: true },
      })
    : [];
  const failedByCampaignId = new Map(failedCounts.map((row) => [row.campaignId, row._count._all]));

  return jsonOk({
    plan: tier,
    period: periodKey,
    quotas,
    campaigns: campaigns.map((c) => serializeCampaign(c, failedByCampaignId.get(c.id) ?? 0)),
    statusLabels: CAMPAIGN_STATUS_LABELS,
  });
}

function serializeCampaign(
  campaign: Awaited<ReturnType<typeof prisma.campaign.findFirst>> & {
    payment?: { status: string; amountCents: number } | null;
    adRequest?: { status: string } | null;
  },
  failedDeliveries: number,
) {
  if (!campaign) return null;
  return {
    id: campaign.id,
    channel: campaign.channel,
    audienceType: campaign.audienceType,
    status: campaign.status,
    statusLabel: CAMPAIGN_STATUS_LABELS[campaign.status],
    title: campaign.title,
    body: campaign.body,
    imageUrl: campaign.imageUrl,
    actionLabel: campaign.actionLabel,
    actionUrl: campaign.actionUrl,
    scheduledAt: campaign.scheduledAt,
    sentAt: campaign.sentAt,
    estimatedRecipients: campaign.estimatedRecipients,
    priceCents: campaign.priceCents,
    requiresPayment: campaign.requiresPayment,
    rejectionReason: campaign.rejectionReason,
    payment: campaign.payment ? { status: campaign.payment.status, amountCents: campaign.payment.amountCents } : null,
    adStatus: campaign.adRequest?.status ?? null,
    failedDeliveries,
    createdAt: campaign.createdAt,
  };
}

/** Crée une campagne en brouillon (Partie 7.2 étape 1). Le contenu se remplit ensuite via PATCH. */
export async function POST(req: Request) {
  const csrf = await requireMutatingRequest(req);
  if (csrf.error) return csrf.error;
  const staff = await requireMerchantAdmin(req);
  if (staff.error || !staff.user || !staff.membership) return staff.error ?? jsonError("Accès refusé.", 403);

  const parsed = campaignCreateSchema.safeParse(await readJson(req));
  if (!parsed.success) return jsonError(zodErrorMessage(parsed.error));

  const merchantId = staff.membership.merchantId;
  const quotaKind = quotaKindFor(parsed.data.channel, parsed.data.audienceType);

  const campaign = await prisma.campaign.create({
    data: {
      merchantId,
      channel: parsed.data.channel,
      audienceType: parsed.data.audienceType,
      status: "DRAFT",
      title: "",
      body: "",
      quotaKind,
      createdBy: staff.user.id,
    },
  });

  await writeAudit({
    actorId: staff.user.id,
    merchantId,
    action: "CAMPAIGN_CREATED",
    metadata: { campaignId: campaign.id, channel: parsed.data.channel, audienceType: parsed.data.audienceType },
    ip: clientIp(req),
    userAgent: userAgent(req),
  });

  return jsonOk({ campaign: serializeCampaign({ ...campaign, payment: null, adRequest: null }, 0) });
}
