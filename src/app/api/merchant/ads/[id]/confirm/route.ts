import { requireMerchantAdmin, requireMutatingRequest } from "@/lib/api-guard";
import { consumeQuotaForCampaign, priceSponsoredAd } from "@/lib/campaign-pricing";
import { calendarPeriodKeyEuropeParis, getQuotaUsage, includedQuotaFor, resolvePlanTier } from "@/lib/campaign-quota";
import { writeAudit } from "@/lib/audit";
import { resolveAppOriginFromRequestHost } from "@/lib/hosts";
import { clientIp, jsonError, jsonOk, userAgent } from "@/lib/http";
import { prisma } from "@/lib/prisma";
import { notifyMerchant } from "@/lib/ad-visual-workflow";
import { priceSponsoredHours, type SponsoredDaySelection } from "@/lib/sponsored-hours-pricing";
import { StripeNotConfiguredError, createCampaignCheckoutSession } from "@/lib/stripe";
import { getActiveStripeMode, isPaymentAllowedForMerchant, isStripeConfigured } from "@/lib/stripe-mode";

/**
 * Prix qui sera réellement facturé pour cette demande : tarification à l'heure pour toute
 * demande créée avec hourlySchedule, sinon (anciennes demandes) l'ancien tarif 5 €/jour —
 * jamais recalculé avec les nouveaux tarifs (voir sponsored-hours-pricing.ts).
 */
async function computeAdPricing(adRequest: {
  startDate: Date;
  endDate: Date;
  hourlySchedule: unknown;
  merchantId: string;
}) {
  const tier = await resolvePlanTier(adRequest.merchantId);
  const periodKey = calendarPeriodKeyEuropeParis(new Date());
  const limit = includedQuotaFor(tier, "SPONSORED_DAY");
  const used = limit > 0 ? await getQuotaUsage({ merchantId: adRequest.merchantId, kind: "SPONSORED_DAY", periodKey }) : 0;
  const includedDaysRemaining = Math.max(0, limit - used);

  if (Array.isArray(adRequest.hourlySchedule)) {
    const schedule = adRequest.hourlySchedule as SponsoredDaySelection[];
    const hourly = priceSponsoredHours(schedule);
    const days = hourly.totalDays;
    const requiresPayment = includedDaysRemaining < days;
    return {
      periodKey,
      limit,
      days,
      requiresPayment,
      priceCents: requiresPayment ? hourly.totalCents : 0,
      breakdown: hourly,
      description: `Mise en avant Fideto — ${hourly.totalDays} jour${hourly.totalDays > 1 ? "s" : ""}, ${hourly.totalHours} h au total`,
      // Prix par jour non uniforme (tarif par heure) : un seul article Stripe pour le total, jamais divisé par jour.
      checkoutQuantity: 1,
    };
  }

  // Ancienne demande (avant la tarification horaire) : tarif historique 5 €/jour, inchangé —
  // même construction Stripe qu'avant (quantité = jours, prix unitaire 5 €) pour ne rien changer
  // à ce qui est déjà en production.
  const days = Math.max(1, Math.round((adRequest.endDate.getTime() - adRequest.startDate.getTime()) / 86_400_000));
  const legacy = priceSponsoredAd({ days, includedDaysRemaining });
  return {
    periodKey,
    limit,
    days,
    requiresPayment: legacy.requiresPayment,
    priceCents: legacy.priceCents,
    breakdown: null,
    description: `Mise en avant Fideto — ${days} jour${days > 1 ? "s" : ""} (5 € / jour)`,
    checkoutQuantity: days,
  };
}

/** Aperçu du prix avant paiement (Partie 15) : le commerçant doit voir le détail avant de valider. */
export async function GET(req: Request, context: { params: Promise<{ id: string }> }) {
  const staff = await requireMerchantAdmin(req);
  if (staff.error || !staff.user || !staff.membership) return staff.error ?? jsonError("Accès refusé.", 403);

  const { id } = await context.params;
  const merchantId = staff.membership.merchantId;
  const adRequest = await prisma.adRequest.findFirst({ where: { id, merchantId } });
  if (!adRequest) return jsonError("Demande introuvable.", 404);

  const pricing = await computeAdPricing({ ...adRequest, merchantId });
  return jsonOk({
    days: pricing.days,
    requiresPayment: pricing.requiresPayment,
    priceCents: pricing.priceCents,
    breakdown: pricing.breakdown,
    description: pricing.description,
  });
}

/**
 * Validation commerçante du visuel final (Partie 12 étape 6) : déclenche le paiement/la
 * consommation de quota (étape 7). Ne fonctionne que si le super-admin a déjà approuvé
 * et fourni le visuel final (statut APPROVED).
 */
export async function POST(req: Request, context: { params: Promise<{ id: string }> }) {
  const csrf = await requireMutatingRequest(req);
  if (csrf.error) return csrf.error;
  const staff = await requireMerchantAdmin(req);
  if (staff.error || !staff.user || !staff.membership) return staff.error ?? jsonError("Accès refusé.", 403);

  const { id } = await context.params;
  const merchantId = staff.membership.merchantId;
  const adRequest = await prisma.adRequest.findFirst({ where: { id, merchantId }, include: { campaign: true } });
  if (!adRequest || !adRequest.campaign) return jsonError("Demande introuvable.", 404);
  if (adRequest.status !== "APPROVED") {
    return jsonError("Le visuel final n'est pas encore prêt à être validé.", 409, { code: "NOT_APPROVED" });
  }
  if (!adRequest.finalImageUrl) {
    return jsonError("Aucun visuel final fourni par Fideto pour le moment.", 409, { code: "NO_FINAL_VISUAL" });
  }

  const { days, periodKey, limit, ...pricing } = await computeAdPricing({ ...adRequest, merchantId });

  if (!pricing.requiresPayment) {
    // Le commerce de test ne doit jamais publier de mise en avant réelle, même via un quota
    // gratuit : voir la même règle sur /api/merchant/campaigns/[id]/confirm.
    const simulateFreeSend = getActiveStripeMode() === "TEST" && isPaymentAllowedForMerchant(merchantId);
    const consumed = await prisma.$transaction(async (tx) => {
      const ok = await consumeQuotaForCampaign(tx, { merchantId, kind: "SPONSORED_DAY", periodKey, limit, amount: days });
      if (!ok) return false;
      await tx.campaign.update({
        where: { id: adRequest.campaign!.id },
        data: {
          status: "SCHEDULED",
          quotaPeriodKey: periodKey,
          quotaConsumedAt: new Date(),
          priceCents: 0,
          fundingMode: simulateFreeSend ? "TEST" : undefined,
        },
      });
      await tx.adRequest.update({
        where: { id: adRequest.id },
        data: { status: "SCHEDULED", fundingMode: simulateFreeSend ? "TEST" : undefined },
      });
      return true;
    });
    if (!consumed) {
      return jsonError("Le quota de jours sponsorisés vient d'être épuisé.", 409, { code: "QUOTA_EXHAUSTED" });
    }
    await notifyMerchant(prisma, adRequest, "CAMPAIGN_SCHEDULED", "Votre campagne est programmée.");
    return jsonOk({ ok: true, requiresPayment: false });
  }

  const mode = getActiveStripeMode();
  if (!mode || !isStripeConfigured()) {
    return jsonError("Les achats de publicité ne sont pas disponibles : Stripe n'est pas configuré.", 503, {
      code: "STRIPE_NOT_CONFIGURED",
    });
  }
  if (!isPaymentAllowedForMerchant(merchantId)) {
    return jsonError("Les paiements de test sont réservés au commerce de test configuré.", 403, {
      code: "TEST_MODE_RESTRICTED",
    });
  }

  const appOrigin = resolveAppOriginFromRequestHost(req.headers.get("host") ?? "");
  let checkoutUrl: string | null;
  let checkoutSessionId: string;
  try {
    const session = await createCampaignCheckoutSession({
      campaignId: adRequest.campaign.id,
      merchantId,
      campaignType: "SPONSORED_AD",
      amountCents: pricing.priceCents,
      quantity: pricing.checkoutQuantity,
      description: pricing.description,
      successUrl: `${appOrigin}/app/campagnes/${adRequest.campaign.id}?paid=1`,
      cancelUrl: `${appOrigin}/app/campagnes/${adRequest.campaign.id}?cancelled=1`,
    });
    checkoutUrl = session.url;
    checkoutSessionId = session.id;
  } catch (error) {
    if (error instanceof StripeNotConfiguredError) {
      return jsonError("Les achats de publicité ne sont pas disponibles : Stripe n'est pas configuré.", 503, {
        code: "STRIPE_NOT_CONFIGURED",
      });
    }
    return jsonError("Impossible de démarrer le paiement.", 502);
  }

  await prisma.$transaction(async (tx) => {
    // upsert : un paiement abandonné/annulé/expiré peut être relancé avec une nouvelle session.
    // Le webhook ne prend en compte que la session enregistrée ici.
    await tx.campaignPayment.upsert({
      where: { campaignId: adRequest.campaign!.id },
      create: {
        campaignId: adRequest.campaign!.id,
        merchantId,
        amountCents: pricing.priceCents,
        mode,
        status: "PENDING",
        stripeCheckoutSessionId: checkoutSessionId,
      },
      update: {
        amountCents: pricing.priceCents,
        mode,
        status: "PENDING",
        failureReason: null,
        stripeCheckoutSessionId: checkoutSessionId,
        stripePaymentIntentId: null,
      },
    });
    await tx.campaign.update({
      where: { id: adRequest.campaign!.id },
      data: { status: "PAYMENT_REQUIRED", priceCents: pricing.priceCents, requiresPayment: true },
    });
  });

  await writeAudit({
    actorId: staff.user.id,
    merchantId,
    action: "AD_CHECKOUT_CREATED",
    metadata: { adRequestId: adRequest.id, amountCents: pricing.priceCents },
    ip: clientIp(req),
    userAgent: userAgent(req),
  });

  return jsonOk({ ok: true, requiresPayment: true, checkoutUrl, amountCents: pricing.priceCents });
}
