import { requireMerchantAdmin, requireMutatingRequest } from "@/lib/api-guard";
import { consumeQuotaForCampaign, priceSponsoredAd } from "@/lib/campaign-pricing";
import { calendarPeriodKeyEuropeParis, getQuotaUsage, includedQuotaFor, resolvePlanTier } from "@/lib/campaign-quota";
import { writeAudit } from "@/lib/audit";
import { resolveAppOriginFromRequestHost } from "@/lib/hosts";
import { clientIp, jsonError, jsonOk, readJson, userAgent } from "@/lib/http";
import { prisma } from "@/lib/prisma";
import { notifyMerchant } from "@/lib/ad-visual-workflow";
import { elapsedHoursCount, priceSponsoredHours, type SponsoredDaySelection } from "@/lib/sponsored-hours-pricing";
import { debitForCampaign, getMarketingBalanceCents } from "@/lib/marketing-balance";
import { StripeNotConfiguredError, createCampaignCheckoutSession } from "@/lib/stripe";
import { scheduleGoogleWalletGlobalCampaignResync } from "@/lib/google-wallet";
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

/** Une session Checkout non terminée bloque un paiement par solde tant qu'elle peut encore aboutir. */
const CHECKOUT_IN_PROGRESS_MS = 35 * 60_000;

function pendingCheckout(
  payment: { status: string; createdAt?: Date | string | null; updatedAt?: Date | string | null } | null | undefined,
  now: Date,
) {
  if (!payment || payment.status !== "PENDING") return false;
  const since = new Date((payment.updatedAt ?? payment.createdAt ?? 0) as string | number | Date).getTime();
  return now.getTime() - since < CHECKOUT_IN_PROGRESS_MS;
}

/**
 * Aperçu avant paiement : montant, solde marketing disponible (mode actif) et options possibles.
 * Rien n'est débité ici.
 */
export async function GET(req: Request, context: { params: Promise<{ id: string }> }) {
  const staff = await requireMerchantAdmin(req);
  if (staff.error || !staff.user || !staff.membership) return staff.error ?? jsonError("Accès refusé.", 403);

  const { id } = await context.params;
  const merchantId = staff.membership.merchantId;
  const adRequest = await prisma.adRequest.findFirst({
    where: { id, merchantId },
    include: { campaign: { include: { payment: true } } },
  });
  if (!adRequest) return jsonError("Demande introuvable.", 404);

  const pricing = await computeAdPricing({ ...adRequest, merchantId });
  const mode = getActiveStripeMode();
  const balanceCents = mode ? await getMarketingBalanceCents(merchantId, mode) : 0;
  const now = new Date();
  return jsonOk({
    days: pricing.days,
    requiresPayment: pricing.requiresPayment,
    priceCents: pricing.priceCents,
    breakdown: pricing.breakdown,
    description: pricing.description,
    mode,
    // Mode test : le paiement est fictif et la campagne reste simulée (jamais affichée aux vrais clients).
    simulated: mode === "TEST",
    paymentsAvailable: Boolean(mode && isPaymentAllowedForMerchant(merchantId)),
    stripeAvailable: Boolean(mode && isStripeConfigured() && isPaymentAllowedForMerchant(merchantId)),
    balanceCents,
    balanceSufficient: balanceCents >= pricing.priceCents,
    slotsExpired: Array.isArray(adRequest.hourlySchedule)
      ? elapsedHoursCount(adRequest.hourlySchedule as SponsoredDaySelection[], now) > 0
      : false,
    checkoutInProgress: pendingCheckout(adRequest.campaign?.payment, now),
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
  const body = (await readJson<{ method?: string }>(req)) ?? {};
  // Deux façons de payer une campagne payante : le solde marketing ou Stripe (carte), au choix.
  const method = body.method === "BALANCE" ? "BALANCE" : "STRIPE";

  const adRequest = await prisma.adRequest.findFirst({
    where: { id, merchantId },
    include: { campaign: { include: { payment: true } } },
  });
  if (!adRequest || !adRequest.campaign) return jsonError("Demande introuvable.", 404);
  if (adRequest.status !== "APPROVED") {
    return jsonError("Le visuel final n'est pas encore prêt à être validé.", 409, { code: "NOT_APPROVED" });
  }
  if (!adRequest.finalImageUrl) {
    return jsonError("Aucun visuel final fourni par Fideto pour le moment.", 409, { code: "NO_FINAL_VISUAL" });
  }
  // Jamais de paiement ni de quota consommé pour des heures déjà écoulées.
  if (Array.isArray(adRequest.hourlySchedule) && elapsedHoursCount(adRequest.hourlySchedule as SponsoredDaySelection[]) > 0) {
    return jsonError(
      "Certains créneaux choisis sont déjà passés : cette mise en avant ne peut plus être payée telle quelle. Créez une nouvelle mise en avant avec des créneaux à venir.",
      409,
      { code: "SLOTS_EXPIRED" },
    );
  }

  const { days, periodKey, limit, ...pricing } = await computeAdPricing({ ...adRequest, merchantId });

  if (!pricing.requiresPayment) {
    // Le commerce de test ne doit jamais publier de mise en avant réelle, même via un quota
    // gratuit : voir la même règle sur /api/merchant/campaigns/[id]/confirm.
    const simulateFreeSend = getActiveStripeMode() === "TEST" && isPaymentAllowedForMerchant(merchantId);
    const consumed = await prisma
      .$transaction(async (tx) => {
        // Réservation atomique APPROVED → SCHEDULED : un second appel (double clic) ne consomme rien.
        const claimed = await tx.adRequest.updateMany({
          where: { id: adRequest.id, status: "APPROVED" },
          data: { status: "SCHEDULED", fundingMode: simulateFreeSend ? "TEST" : undefined },
        });
        if (claimed.count !== 1) return "already" as const;
        const ok = await consumeQuotaForCampaign(tx, { merchantId, kind: "SPONSORED_DAY", periodKey, limit, amount: days });
        if (!ok) throw new QuotaExhausted();
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
        return "ok" as const;
      })
      .catch((error) => {
        if (error instanceof QuotaExhausted) return "quota" as const;
        throw error;
      });
    if (consumed === "already") return jsonError("Cette mise en avant est déjà confirmée.", 409, { code: "ALREADY_CONFIRMED" });
    if (consumed === "quota") {
      return jsonError("Le quota de jours sponsorisés vient d'être épuisé.", 409, { code: "QUOTA_EXHAUSTED" });
    }
    await notifyMerchant(prisma, adRequest, "CAMPAIGN_SCHEDULED", "Votre campagne est programmée.");
    scheduleGoogleWalletGlobalCampaignResync();
    return jsonOk({ ok: true, requiresPayment: false });
  }

  const mode = getActiveStripeMode();
  if (!mode) {
    return jsonError("Les achats de publicité ne sont pas disponibles : mode de paiement invalide.", 503, {
      code: "STRIPE_NOT_CONFIGURED",
    });
  }
  if (!isPaymentAllowedForMerchant(merchantId)) {
    return jsonError("Les paiements de test sont réservés au commerce de test configuré.", 403, {
      code: "TEST_MODE_RESTRICTED",
    });
  }

  /* ----------------------------- paiement par le solde marketing ----------------------------- */
  if (method === "BALANCE") {
    // Une session Checkout encore ouverte pourrait aboutir plus tard : on n'ouvre pas un second paiement.
    if (pendingCheckout(adRequest.campaign.payment, new Date())) {
      return jsonError(
        "Un paiement par carte est déjà en cours pour cette campagne. Terminez-le ou attendez son expiration avant d'utiliser votre solde.",
        409,
        { code: "PAYMENT_IN_PROGRESS" },
      );
    }
    const balanceBefore = await getMarketingBalanceCents(merchantId, mode);
    try {
      const outcome = await prisma.$transaction(async (tx) => {
        // Réservation atomique : seule la requête qui fait passer APPROVED → SCHEDULED poursuit.
        const claimed = await tx.adRequest.updateMany({
          where: { id: adRequest.id, status: "APPROVED" },
          data: { status: "SCHEDULED", fundingMode: mode },
        });
        if (claimed.count !== 1) return { claimed: false as const };
        // Débit atomique (jamais négatif) ; la ligne d'historique porte campaignId UNIQUE : pas de double débit.
        const debit = await debitForCampaign(tx, {
          merchantId,
          mode,
          campaignId: adRequest.campaign!.id,
          amountCents: pricing.priceCents,
          description: `Mise en avant — ${adRequest.requestedText.slice(0, 80)}`,
        });
        if (!debit.ok) throw new InsufficientBalance();
        await tx.campaignPayment.updateMany({
          where: { campaignId: adRequest.campaign!.id, status: "PENDING" },
          data: { status: "CANCELLED" },
        });
        await tx.campaign.update({
          where: { id: adRequest.campaign!.id },
          data: { status: "SCHEDULED", priceCents: pricing.priceCents, requiresPayment: true, fundingMode: mode },
        });
        return { claimed: true as const, balanceAfterCents: debit.balanceAfterCents };
      });
      if (!outcome.claimed) return jsonError("Cette mise en avant est déjà payée ou confirmée.", 409, { code: "ALREADY_CONFIRMED" });

      await writeAudit({
        actorId: staff.user.id,
        merchantId,
        action: "AD_PAID_BALANCE",
        metadata: { adRequestId: adRequest.id, mode, amountCents: pricing.priceCents, balanceAfterCents: outcome.balanceAfterCents },
        ip: clientIp(req),
        userAgent: userAgent(req),
      });
      await notifyMerchant(prisma, adRequest, "CAMPAIGN_SCHEDULED", "Paiement par votre solde marketing confirmé : votre campagne est programmée.");
      scheduleGoogleWalletGlobalCampaignResync();
      return jsonOk({
        ok: true,
        requiresPayment: true,
        method: "BALANCE",
        amountCents: pricing.priceCents,
        balanceAfterCents: outcome.balanceAfterCents,
      });
    } catch (error) {
      if (error instanceof InsufficientBalance) {
        return jsonError("Solde marketing insuffisant. Rechargez votre solde ou payez cette campagne directement par carte.", 402, {
          code: "INSUFFICIENT_BALANCE",
          balanceCents: balanceBefore,
          requiredCents: pricing.priceCents,
        });
      }
      if ((error as { code?: string }).code === "P2002") {
        return jsonError("Cette mise en avant a déjà été débitée.", 409, { code: "ALREADY_CONFIRMED" });
      }
      throw error;
    }
  }

  /* ------------------------------------- paiement Stripe ------------------------------------- */
  if (!isStripeConfigured()) {
    return jsonError("Les achats de publicité ne sont pas disponibles : Stripe n'est pas configuré.", 503, {
      code: "STRIPE_NOT_CONFIGURED",
    });
  }
  const alreadyDebited = await prisma.marketingLedgerEntry.findUnique({ where: { campaignId: adRequest.campaign.id } });
  if (alreadyDebited && alreadyDebited.type === "DEBIT" && alreadyDebited.status === "PAID") {
    return jsonError("Cette mise en avant a déjà été payée avec votre solde marketing.", 409, { code: "ALREADY_CONFIRMED" });
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
      customer: billingCustomer(staff),
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

  return jsonOk({ ok: true, requiresPayment: true, method: "STRIPE", checkoutUrl, amountCents: pricing.priceCents });
}

/** Identité de facturation transmise à Stripe (client du commerce + facture). */
function billingCustomer(staff: { user?: { email?: string | null } | null; membership?: { merchant?: { name?: string } | null } | null }) {
  const name = staff.membership?.merchant?.name;
  return name ? { name, email: staff.user?.email ?? null } : undefined;
}

class InsufficientBalance extends Error {}
class QuotaExhausted extends Error {}
