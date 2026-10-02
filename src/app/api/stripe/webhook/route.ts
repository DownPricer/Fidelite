import type Stripe from "stripe";
import { statusAfterFundingConfirmed } from "@/lib/campaign-lifecycle";
import { refundIncludedQuota } from "@/lib/campaign-quota";
import { creditTopup } from "@/lib/marketing-balance";
import type { StripeModeValue } from "@/lib/stripe-mode";
import { writeAudit } from "@/lib/audit";
import { jsonError, jsonOk } from "@/lib/http";
import { prisma } from "@/lib/prisma";
import { notifyMerchant } from "@/lib/ad-visual-workflow";
import { syncSubscriptionFromStripeView } from "@/lib/merchant-billing";
import { StripeNotConfiguredError, constructStripeWebhookEvent, normalizeStripeSubscription } from "@/lib/stripe";

/**
 * Webhook Stripe — signé et idempotent (Partie 9 / 17).
 * Un même event.id Stripe n'est jamais traité deux fois : on essaie de créer une ligne
 * StripeWebhookEvent avant tout traitement ; en cas de doublon (contrainte unique sur
 * l'id), on répond 200 sans rien rejouer.
 */
export async function POST(req: Request) {
  const signature = req.headers.get("stripe-signature");
  const payload = await req.text();

  let event: Stripe.Event;
  try {
    if (!signature) throw new Error("Signature Stripe manquante.");
    event = constructStripeWebhookEvent(payload, signature);
  } catch (error) {
    if (error instanceof StripeNotConfiguredError) {
      return jsonError("Stripe n'est pas configuré sur cet environnement.", 503, { code: "STRIPE_NOT_CONFIGURED" });
    }
    return jsonError("Signature webhook invalide.", 400, { code: "INVALID_SIGNATURE" });
  }

  try {
    await prisma.stripeWebhookEvent.create({ data: { id: event.id, type: event.type } });
  } catch {
    // Contrainte unique violée : événement déjà traité (rejeu Stripe). Idempotent par construction.
    return jsonOk({ ok: true, replay: true });
  }

  try {
    await handleStripeEvent(event);
  } catch (error) {
    console.error("[stripe-webhook] échec de traitement", event.type, error instanceof Error ? error.message : error);
    // Libère l'événement pour que le rejeu automatique de Stripe puisse le retraiter
    // (les handlers sont idempotents par états gardés : aucun double crédit possible).
    await prisma.stripeWebhookEvent.delete({ where: { id: event.id } }).catch(() => undefined);
    return jsonError("Erreur de traitement du webhook.", 500);
  }

  return jsonOk({ ok: true });
}

/**
 * Un événement est toujours traité dans SON mode (`livemode`, déjà vérifié contre le secret de
 * signature), jamais dans le mode actif du déploiement : un événement test retardé après le passage
 * en réel n'affecte que les données TEST, et inversement. Les données de l'autre mode ne sont
 * jamais modifiées (chaque handler compare le mode enregistré au mode de l'événement).
 */
async function handleStripeEvent(event: Stripe.Event) {
  const mode: StripeModeValue = event.livemode ? "LIVE" : "TEST";
  switch (event.type) {
    case "checkout.session.completed":
      return handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session, mode);
    case "checkout.session.expired":
      return handleCheckoutSessionExpired(event.data.object as Stripe.Checkout.Session, mode);
    case "payment_intent.payment_failed":
      return handlePaymentIntentFailed(event.data.object as Stripe.PaymentIntent, mode);
    case "customer.subscription.updated":
    case "customer.subscription.deleted":
      // Stripe = source de vérité de l'abonnement : on reporte statut, échéance et arrêt programmé.
      await syncSubscriptionFromStripeView(normalizeStripeSubscription(event.data.object));
      return;
    case "charge.refunded":
      return handleChargeRefunded(event.data.object as Stripe.Charge, mode);
    default:
      return; // Événement non pertinent pour les campagnes : accusé de réception sans action.
  }
}

function paymentIntentIdOf(session: Stripe.Checkout.Session) {
  return typeof session.payment_intent === "string" ? session.payment_intent : (session.payment_intent?.id ?? null);
}

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session, mode: StripeModeValue) {
  // Rien n'est crédité ni activé tant que Stripe ne confirme pas un paiement encaissé.
  if (session.payment_status !== "paid") return;

  if (session.metadata?.kind === "MARKETING_TOPUP") {
    await prisma.$transaction(async (tx) => {
      const result = await creditTopup(tx, {
        checkoutSessionId: session.id,
        mode,
        paymentIntentId: paymentIntentIdOf(session),
        amountPaidCents: session.amount_total ?? null,
      });
      if (result === "amount_mismatch") {
        throw new Error("Montant Stripe différent du montant de la recharge enregistrée.");
      }
      if (result === "credited") {
        await writeAudit({
          actorId: null,
          merchantId: session.metadata?.merchantId ?? null,
          action: "MARKETING_TOPUP_PAID",
          metadata: { stripeCheckoutSessionId: session.id, amountCents: session.amount_total },
        });
      }
    });
    return;
  }

  const campaignId = session.metadata?.campaignId;
  if (!campaignId) return;

  await prisma.$transaction(async (tx) => {
    const payment = await tx.campaignPayment.findUnique({ where: { campaignId } });
    if (!payment || payment.status === "PAID" || payment.mode !== mode) return;
    if (payment.status === "CANCELLED" && payment.stripeCheckoutSessionId === session.id) {
      // La campagne a été réglée autrement (solde marketing) alors que cette session Checkout aboutissait :
      // on n'active rien une seconde fois et on trace l'encaissement à rembourser manuellement.
      await writeAudit({
        actorId: null,
        merchantId: payment.merchantId,
        action: "CAMPAIGN_PAYMENT_DUPLICATE",
        metadata: { campaignId, stripeCheckoutSessionId: session.id, amountCents: session.amount_total },
      });
      return;
    }
    // Session obsolète (paiement relancé avec une nouvelle session) ou montant inattendu : on n'active rien.
    if (payment.stripeCheckoutSessionId !== session.id) return;
    if (session.amount_total !== payment.amountCents) {
      throw new Error("Montant Stripe différent du montant de la campagne enregistré.");
    }

    const campaign = await tx.campaign.findUnique({ where: { id: campaignId } });
    if (!campaign) return;

    await tx.campaignPayment.update({
      where: { id: payment.id },
      data: {
        status: "PAID",
        paidAt: new Date(),
        stripePaymentIntentId: paymentIntentIdOf(session),
      },
    });

    // Une publicité sponsorisée a déjà été validée par le super-admin AVANT paiement
    // (voir /api/merchant/ads/[id]/confirm) : ne jamais la repasser en PENDING_REVIEW ici.
    let nextStatus = statusAfterFundingConfirmed({ channel: campaign.channel, audienceType: campaign.audienceType });
    if (campaign.channel === "SPONSORED_AD") {
      const adRequest = await tx.adRequest.findUnique({ where: { campaignId } });
      if (adRequest?.status === "APPROVED") {
        nextStatus = "SCHEDULED";
        await tx.adRequest.update({ where: { id: adRequest.id }, data: { status: "SCHEDULED", fundingMode: mode } });
        await notifyMerchant(tx, adRequest, "CAMPAIGN_SCHEDULED", "Paiement confirmé : votre campagne est programmée.");
      }
    }

    await tx.campaign.update({
      where: { id: campaignId },
      // fundingMode = mode du paiement : une campagne/publicité payée en TEST n'est jamais diffusée ni publiée.
      data: { status: nextStatus, fundingMode: mode },
    });

    await writeAudit({
      actorId: null,
      merchantId: campaign.merchantId,
      action: "CAMPAIGN_PAYMENT_PAID",
      metadata: { campaignId, amountCents: payment.amountCents, stripeCheckoutSessionId: session.id },
    });
  });
}

async function handleCheckoutSessionExpired(session: Stripe.Checkout.Session, mode: StripeModeValue) {
  if (session.metadata?.kind === "MARKETING_TOPUP") {
    await prisma.marketingLedgerEntry.updateMany({
      where: { stripeCheckoutSessionId: session.id, mode, type: "TOPUP", status: "PENDING" },
      data: { status: "CANCELLED" },
    });
    return;
  }

  const campaignId = session.metadata?.campaignId;
  if (!campaignId) return;

  await prisma.$transaction(async (tx) => {
    const payment = await tx.campaignPayment.findUnique({ where: { campaignId } });
    if (!payment || payment.status !== "PENDING" || payment.mode !== mode || payment.stripeCheckoutSessionId !== session.id) return;

    await tx.campaignPayment.update({ where: { id: payment.id }, data: { status: "CANCELLED" } });
    // Une mise en avant reste « à payer » (relançable) ; rien n'est activé.
    if (session.metadata?.campaignType !== "SPONSORED_AD") {
      await tx.campaign.update({ where: { id: campaignId }, data: { status: "CANCELLED" } });
    }
  });
}

async function handlePaymentIntentFailed(paymentIntent: Stripe.PaymentIntent, mode: StripeModeValue) {
  if (paymentIntent.metadata?.kind === "MARKETING_TOPUP") {
    const ledgerEntryId = paymentIntent.metadata.ledgerEntryId;
    if (!ledgerEntryId) return;
    await prisma.marketingLedgerEntry.updateMany({
      where: { id: ledgerEntryId, mode, type: "TOPUP", status: "PENDING" },
      data: { status: "FAILED" },
    });
    return;
  }

  const campaignId = paymentIntent.metadata?.campaignId;
  if (!campaignId) return;

  await prisma.$transaction(async (tx) => {
    const payment = await tx.campaignPayment.findUnique({ where: { campaignId } });
    if (!payment || payment.status === "PAID" || payment.mode !== mode) return;

    await tx.campaignPayment.update({
      where: { id: payment.id },
      data: {
        status: "FAILED",
        failureReason: paymentIntent.last_payment_error?.message ?? "Paiement refusé.",
      },
    });
    if (paymentIntent.metadata?.campaignType !== "SPONSORED_AD") {
      await tx.campaign.update({ where: { id: campaignId }, data: { status: "FAILED" } });
    }
  });
}

/**
 * ⚠️ LACUNE CONNUE (ne pas activer le mode réel avant correction ou procédure de régularisation) :
 * cet événement ne traite que le remboursement d'un CampaignPayment (achat direct de campagne
 * réseau ou de mise en avant). Une recharge du solde marketing (MarketingLedgerEntry TOPUP) n'a
 * pas de CampaignPayment associé — si un commerçant est remboursé depuis le Dashboard Stripe pour
 * une RECHARGE, aucun débit n'a lieu ici : le crédit marketing reste acquis sur le solde alors que
 * l'argent a été rendu. Tant que ce cas n'est pas traité (ou qu'une procédure manuelle de
 * régularisation n'est pas définie), un remboursement de recharge doit être suivi d'un ajustement
 * manuel du solde marketing correspondant.
 */
async function handleChargeRefunded(charge: Stripe.Charge, mode: StripeModeValue) {
  const paymentIntentId = typeof charge.payment_intent === "string" ? charge.payment_intent : charge.payment_intent?.id;
  if (!paymentIntentId) return;

  await prisma.$transaction(async (tx) => {
    const payment = await tx.campaignPayment.findFirst({ where: { stripePaymentIntentId: paymentIntentId } });
    if (!payment || payment.status === "REFUNDED" || payment.mode !== mode) return;

    await tx.campaignPayment.update({
      where: { id: payment.id },
      data: { status: "REFUNDED", refundedAt: new Date() },
    });

    const campaign = await tx.campaign.findUnique({ where: { id: payment.campaignId } });
    if (campaign) {
      await tx.campaign.update({ where: { id: campaign.id }, data: { status: "CANCELLED" } });
      if (campaign.quotaKind && campaign.quotaConsumedAt && campaign.quotaPeriodKey) {
        await refundIncludedQuota(tx, {
          merchantId: campaign.merchantId,
          kind: campaign.quotaKind,
          periodKey: campaign.quotaPeriodKey,
        });
      }
      await writeAudit({
        actorId: null,
        merchantId: campaign.merchantId,
        action: "CAMPAIGN_PAYMENT_REFUNDED",
        metadata: { campaignId: campaign.id },
      });
    }
  });
}
