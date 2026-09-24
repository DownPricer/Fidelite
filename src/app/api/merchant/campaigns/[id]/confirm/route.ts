import { requireMerchantAdmin, requireMutatingRequest } from "@/lib/api-guard";
import { estimateMerchantMembersAudience, estimateNetworkLocalAudience } from "@/lib/campaign-audience";
import { statusAfterFundingConfirmed } from "@/lib/campaign-lifecycle";
import { consumeQuotaForCampaign, priceMemberOrNetworkCampaign } from "@/lib/campaign-pricing";
import { calendarPeriodKeyEuropeParis, getQuotaUsage, includedQuotaFor, resolvePlanTier } from "@/lib/campaign-quota";
import { writeAudit } from "@/lib/audit";
import { clientIp, jsonError, jsonOk, userAgent } from "@/lib/http";
import { prisma } from "@/lib/prisma";
import { debitForCampaign, getMarketingBalanceCents } from "@/lib/marketing-balance";
import { LIMITS, rateLimit } from "@/lib/rate-limit";

/**
 * Confirme l'envoi d'une campagne (Partie 7.4 → 9) : tarif et quota recalculés
 * intégralement côté serveur à cet instant précis (jamais de valeur reçue du
 * navigateur), consommation atomique du quota si couverte, sinon débit atomique du solde
 * marketing prépayé (rechargé via Stripe Checkout + webhook signé, voir /api/merchant/marketing-balance).
 * Solde insuffisant = 402, rien n'est écrit. Une campagne réseau passe toujours par la modération.
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

  // Payant : débit atomique du solde marketing prépayé, dans la même transaction que le
  // passage en statut confirmé. Solde insuffisant = aucune écriture, aucun envoi.
  class InsufficientBalance extends Error {}
  const balanceBefore = await getMarketingBalanceCents(merchantId);
  try {
    const outcome = await prisma.$transaction(async (tx) => {
      // Réclamation atomique : seule la requête qui fait passer DRAFT → confirmée poursuit,
      // ce qui rend le débit unique même si la confirmation est rejouée ou concurrente.
      const claimed = await tx.campaign.updateMany({
        where: { id: campaign.id, status: "DRAFT" },
        data: {
          status: statusAfterFundingConfirmed({ channel: campaign.channel, audienceType: campaign.audienceType }),
          estimatedRecipients: audience.estimatedRecipients,
          priceCents: pricing.priceCents,
          requiresPayment: true,
        },
      });
      if (claimed.count === 0) return { claimed: false as const };

      const debit = await debitForCampaign(tx, {
        merchantId,
        campaignId: campaign.id,
        amountCents: pricing.priceCents,
        description: `Envoi — ${campaign.title.slice(0, 80)}`,
      });
      if (!debit.ok) throw new InsufficientBalance();
      return { claimed: true as const, balanceAfterCents: debit.balanceAfterCents };
    });

    if (!outcome.claimed) {
      return jsonError("Cette campagne a déjà été confirmée.", 409, { code: "ALREADY_CONFIRMED" });
    }

    await writeAudit({
      actorId: staff.user.id,
      merchantId,
      action: "CAMPAIGN_CONFIRMED_BALANCE",
      metadata: { campaignId: campaign.id, amountCents: pricing.priceCents, balanceAfterCents: outcome.balanceAfterCents },
      ip: clientIp(req),
      userAgent: userAgent(req),
    });

    return jsonOk({
      ok: true,
      requiresPayment: true,
      amountCents: pricing.priceCents,
      balanceAfterCents: outcome.balanceAfterCents,
    });
  } catch (error) {
    if (error instanceof InsufficientBalance) {
      return jsonError("Solde marketing insuffisant. Rechargez votre solde pour envoyer cette campagne.", 402, {
        code: "INSUFFICIENT_BALANCE",
        balanceCents: balanceBefore,
        requiredCents: pricing.priceCents,
      });
    }
    throw error;
  }
}
