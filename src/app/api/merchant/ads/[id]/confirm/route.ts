import { requireMerchantAdmin, requireMutatingRequest } from "@/lib/api-guard";
import { consumeQuotaForCampaign } from "@/lib/campaign-pricing";
import { calendarPeriodKeyEuropeParis, getQuotaUsage, includedQuotaFor, resolvePlanTier } from "@/lib/campaign-quota";
import { priceSponsoredAd } from "@/lib/campaign-pricing";
import { writeAudit } from "@/lib/audit";
import { env } from "@/lib/env";
import { clientIp, jsonError, jsonOk, userAgent } from "@/lib/http";
import { prisma } from "@/lib/prisma";
import { StripeNotConfiguredError, createCampaignCheckoutSession } from "@/lib/stripe";

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
    return jsonError("Aucun visuel final fourni par Fidelo pour le moment.", 409, { code: "NO_FINAL_VISUAL" });
  }

  const days = Math.max(1, Math.round((adRequest.endDate.getTime() - adRequest.startDate.getTime()) / 86_400_000));
  const tier = await resolvePlanTier(merchantId);
  const periodKey = calendarPeriodKeyEuropeParis(new Date());
  const limit = includedQuotaFor(tier, "SPONSORED_DAY");
  const used = limit > 0 ? await getQuotaUsage({ merchantId, kind: "SPONSORED_DAY", periodKey }) : 0;
  const pricing = priceSponsoredAd({ days, includedDaysRemaining: Math.max(0, limit - used) });

  if (!pricing.requiresPayment) {
    const consumed = await prisma.$transaction(async (tx) => {
      const ok = await consumeQuotaForCampaign(tx, { merchantId, kind: "SPONSORED_DAY", periodKey, limit, amount: days });
      if (!ok) return false;
      await tx.campaign.update({
        where: { id: adRequest.campaign!.id },
        data: { status: "SCHEDULED", quotaPeriodKey: periodKey, quotaConsumedAt: new Date(), priceCents: 0 },
      });
      await tx.adRequest.update({ where: { id: adRequest.id }, data: { status: "SCHEDULED" } });
      return true;
    });
    if (!consumed) {
      return jsonError("Le quota de jours sponsorisés vient d'être épuisé.", 409, { code: "QUOTA_EXHAUSTED" });
    }
    return jsonOk({ ok: true, requiresPayment: false });
  }

  let checkoutUrl: string | null;
  let checkoutSessionId: string;
  try {
    const session = await createCampaignCheckoutSession({
      campaignId: adRequest.campaign.id,
      merchantId,
      campaignType: "SPONSORED_AD",
      amountCents: pricing.priceCents,
      quantity: days,
      description: `Mise en avant Fidelo — ${days} jour${days > 1 ? "s" : ""} (5 € / jour)`,
      successUrl: `${env.appUrl}/app/campagnes/${adRequest.campaign.id}?paid=1`,
      cancelUrl: `${env.appUrl}/app/campagnes/${adRequest.campaign.id}?cancelled=1`,
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
        status: "PENDING",
        stripeCheckoutSessionId: checkoutSessionId,
      },
      update: {
        amountCents: pricing.priceCents,
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
