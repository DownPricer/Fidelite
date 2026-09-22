import { requireMerchantAdmin, requireMutatingRequest } from "@/lib/api-guard";
import { estimateMerchantMembersAudience, estimateNetworkLocalAudience } from "@/lib/campaign-audience";
import { statusAfterFundingConfirmed } from "@/lib/campaign-lifecycle";
import { consumeQuotaForCampaign, priceMemberOrNetworkCampaign } from "@/lib/campaign-pricing";
import { calendarPeriodKeyEuropeParis, getQuotaUsage, includedQuotaFor, resolvePlanTier } from "@/lib/campaign-quota";
import { writeAudit } from "@/lib/audit";
import { env } from "@/lib/env";
import { clientIp, jsonError, jsonOk, userAgent } from "@/lib/http";
import { prisma } from "@/lib/prisma";
import { StripeNotConfiguredError, createCampaignCheckoutSession } from "@/lib/stripe";
import { LIMITS, rateLimit } from "@/lib/rate-limit";

/**
 * Confirme l'envoi d'une campagne (Partie 7.4 → 9) : tarif et quota recalculés
 * intégralement côté serveur à cet instant précis (jamais de valeur reçue du
 * navigateur), consommation atomique du quota si couverte, sinon création d'une
 * session Stripe Checkout. Aucun envoi ne part avant confirmation serveur du paiement
 * (voir le webhook), et une campagne réseau/publicité passe toujours par la modération.
 */
export async function POST(req: Request, context: { params: Promise<{ id: string }> }) {
  const csrf = await requireMutatingRequest(req);
  if (csrf.error) return csrf.error;
  const staff = await requireMerchantAdmin(req);
  if (staff.error || !staff.user || !staff.membership) return staff.error ?? jsonError("Accès refusé.", 403);

  const limited = rateLimit(`campaign-confirm:${staff.user.id}`, LIMITS.scan.limit, LIMITS.scan.windowMs);
  if (!limited.ok) {
    return jsonError("Trop de tentatives. Patientez un instant.", 429, {
      code: "RATE_LIMIT",
      retryAfterMs: limited.retryAfterMs,
    });
  }

  const { id } = await context.params;
  const merchantId = staff.membership.merchantId;
  const campaign = await prisma.campaign.findFirst({ where: { id, merchantId } });
  if (!campaign) return jsonError("Campagne introuvable.", 404);
  if (campaign.status !== "DRAFT") {
    return jsonError("Cette campagne a déjà été confirmée.", 409, { code: "ALREADY_CONFIRMED" });
  }
  if (!campaign.title.trim() || !campaign.body.trim()) {
    return jsonError("Complétez le titre et le message avant de confirmer.", 400, { code: "INCOMPLETE_CONTENT" });
  }
  if (campaign.channel === "SPONSORED_AD" || !campaign.audienceType) {
    return jsonError("Utilisez /api/merchant/ads pour une publicité sponsorisée.", 400);
  }

  const merchant = await prisma.merchant.findUnique({
    where: { id: merchantId },
    select: { id: true, name: true, city: true, postalCode: true },
  });
  if (!merchant) return jsonError("Commerce introuvable.", 404);

  const audience =
    campaign.audienceType === "NETWORK_LOCAL"
      ? await estimateNetworkLocalAudience(merchant, campaign.channel)
      : await estimateMerchantMembersAudience(merchantId, campaign.channel);

  const tier = await resolvePlanTier(merchantId);
  const periodKey = calendarPeriodKeyEuropeParis(new Date());
  const limit = includedQuotaFor(tier, campaign.quotaKind!);
  const used = limit > 0 ? await getQuotaUsage({ merchantId, kind: campaign.quotaKind!, periodKey }) : 0;

  const pricing = priceMemberOrNetworkCampaign({
    channel: campaign.channel as "IN_APP_PUSH" | "EMAIL",
    audienceType: campaign.audienceType,
    // La décision payant/gratuit affichée ici est informative ; tryConsumeIncludedQuota
    // (dans la transaction ci-dessous) reste la seule source de vérité atomique.
    includedRemaining: Math.max(0, limit - used),
  });

  if (!pricing.requiresPayment) {
    const outcome = await prisma.$transaction(async (tx) => {
      const consumed = await consumeQuotaForCampaign(tx, {
        merchantId,
        kind: campaign.quotaKind!,
        periodKey,
        limit,
      });
      if (!consumed) return { consumed: false as const };

      const updated = await tx.campaign.update({
        where: { id: campaign.id },
        data: {
          status: statusAfterFundingConfirmed({ channel: campaign.channel, audienceType: campaign.audienceType }),
          estimatedRecipients: audience.estimatedRecipients,
          quotaPeriodKey: periodKey,
          quotaConsumedAt: new Date(),
          priceCents: 0,
          requiresPayment: false,
        },
      });
      return { consumed: true as const, campaign: updated };
    });

    if (!outcome.consumed) {
      // Quota épuisé entre l'estimation affichée et la confirmation (concurrence) : redemander un achat.
      return jsonError("Le quota inclus vient d'être épuisé. Un achat complémentaire est nécessaire.", 409, {
        code: "QUOTA_EXHAUSTED",
      });
    }

    await writeAudit({
      actorId: staff.user.id,
      merchantId,
      action: "CAMPAIGN_CONFIRMED_QUOTA",
      metadata: { campaignId: campaign.id, quotaKind: campaign.quotaKind, periodKey },
      ip: clientIp(req),
      userAgent: userAgent(req),
    });

    return jsonOk({ ok: true, requiresPayment: false, status: outcome.campaign.status });
  }

  // Payant : créer la session Stripe AVANT toute écriture (échec Stripe = aucune écriture en base).
  let checkoutUrl: string | null;
  let checkoutSessionId: string;
  try {
    const session = await createCampaignCheckoutSession({
      campaignId: campaign.id,
      merchantId,
      campaignType: `${campaign.channel}_${campaign.audienceType}`,
      amountCents: pricing.priceCents,
      description: `Campagne Fidelo — ${campaign.title.slice(0, 80)}`,
      successUrl: `${env.appUrl}/app/campagnes/${campaign.id}?paid=1`,
      cancelUrl: `${env.appUrl}/app/campagnes/${campaign.id}?cancelled=1`,
    });
    checkoutUrl = session.url;
    checkoutSessionId = session.id;
  } catch (error) {
    if (error instanceof StripeNotConfiguredError) {
      return jsonError(
        "Les achats de campagnes ne sont pas disponibles : Stripe n'est pas configuré sur cet environnement.",
        503,
        { code: "STRIPE_NOT_CONFIGURED" },
      );
    }
    console.error("[campaign-confirm] échec de création de la session Stripe", error);
    return jsonError("Impossible de démarrer le paiement.", 502);
  }

  await prisma.$transaction(async (tx) => {
    await tx.campaignPayment.create({
      data: {
        campaignId: campaign.id,
        merchantId,
        amountCents: pricing.priceCents,
        status: "PENDING",
        stripeCheckoutSessionId: checkoutSessionId,
      },
    });
    await tx.campaign.update({
      where: { id: campaign.id },
      data: {
        status: "PAYMENT_REQUIRED",
        estimatedRecipients: audience.estimatedRecipients,
        priceCents: pricing.priceCents,
        requiresPayment: true,
      },
    });
  });

  await writeAudit({
    actorId: staff.user.id,
    merchantId,
    action: "CAMPAIGN_CHECKOUT_CREATED",
    metadata: { campaignId: campaign.id, amountCents: pricing.priceCents, stripeCheckoutSessionId: checkoutSessionId },
    ip: clientIp(req),
    userAgent: userAgent(req),
  });

  return jsonOk({ ok: true, requiresPayment: true, checkoutUrl, amountCents: pricing.priceCents });
}
