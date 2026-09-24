import { requireMerchantAdmin } from "@/lib/api-guard";
import { estimateMerchantMembersAudience, estimateNetworkLocalAudience } from "@/lib/campaign-audience";
import { priceMemberOrNetworkCampaign } from "@/lib/campaign-pricing";
import { calendarPeriodKeyEuropeParis, getQuotaUsage, includedQuotaFor, resolvePlanTier } from "@/lib/campaign-quota";
import { jsonError, jsonOk } from "@/lib/http";
import { getMarketingBalanceCents } from "@/lib/marketing-balance";
import { prisma } from "@/lib/prisma";

/** Estimation réelle de l'audience et du prix avant validation (Partie 7.2 étape 2). */
export async function GET(req: Request, context: { params: Promise<{ id: string }> }) {
  const staff = await requireMerchantAdmin(req);
  if (staff.error || !staff.user || !staff.membership) return staff.error ?? jsonError("Accès refusé.", 403);

  const { id } = await context.params;
  const merchantId = staff.membership.merchantId;
  const campaign = await prisma.campaign.findFirst({ where: { id, merchantId } });
  if (!campaign) return jsonError("Campagne introuvable.", 404);
  if (campaign.channel === "SPONSORED_AD") {
    return jsonError("Utilisez /api/merchant/ads pour une publicité sponsorisée.", 400);
  }

  const merchant = await prisma.merchant.findUnique({
    where: { id: merchantId },
    select: { id: true, city: true, postalCode: true },
  });

  const audience =
    campaign.audienceType === "NETWORK_LOCAL"
      ? await estimateNetworkLocalAudience(merchant ?? { id: merchantId, city: null, postalCode: null }, campaign.channel)
      : await estimateMerchantMembersAudience(merchantId, campaign.channel);

  const tier = await resolvePlanTier(merchantId);
  const periodKey = calendarPeriodKeyEuropeParis(new Date());
  const limit = includedQuotaFor(tier, campaign.quotaKind!);
  const used = limit > 0 ? await getQuotaUsage({ merchantId, kind: campaign.quotaKind!, periodKey }) : 0;
  const remaining = Math.max(0, limit - used);

  const pricing = priceMemberOrNetworkCampaign({
    channel: campaign.channel as "IN_APP_PUSH" | "EMAIL",
    audienceType: campaign.audienceType!,
    includedRemaining: remaining,
  });

  const balanceCents = await getMarketingBalanceCents(merchantId);

  return jsonOk({
    balanceCents,
    sufficientBalance: !pricing.requiresPayment || balanceCents >= pricing.priceCents,
    audience,
    plan: tier,
    quota: { limit, used, remaining },
    pricing,
  });
}
