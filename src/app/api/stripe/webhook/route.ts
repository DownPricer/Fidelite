import type Stripe from "stripe";
import { statusAfterFundingConfirmed } from "@/lib/campaign-lifecycle";
import { refundIncludedQuota } from "@/lib/campaign-quota";
import { creditTopup } from "@/lib/marketing-balance";
import { writeAudit } from "@/lib/audit";
import { jsonError, jsonOk } from "@/lib/http";
import { prisma } from "@/lib/prisma";
import { StripeNotConfiguredError, constructStripeWebhookEvent } from "@/lib/stripe";

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

async function handleStripeEvent(event: Stripe.Event) {
  switch (event.type) {
    case "checkout.session.completed":
      return handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session);
    case "checkout.session.expired":
      return handleCheckoutSessionExpired(event.data.object as Stripe.Checkout.Session);
    case "payment_intent.payment_failed":
      return handlePaymentIntentFailed(event.data.object as Stripe.PaymentIntent);
    case "charge.refunded":
      return handleChargeRefunded(event.data.object as Stripe.Charge);
    default:
      return; // Événement non pertinent pour les campagnes : accusé de réception sans action.
  }
}

function paymentIntentIdOf(session: Stripe.Checkout.Session) {
  return typeof session.payment_intent === "string" ? session.payment_intent : (session.payment_intent?.id ?? null);
}

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  // Rien n'est crédité ni activé tant que Stripe ne confirme pas un paiement encaissé.
  if (session.payment_status !== "paid") return;

  if (session.metadata?.kind === "MARKETING_TOPUP") {
    await prisma.$transaction(async (tx) => {
      const result = await creditTopup(tx, {
        checkoutSessionId: session.id,
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
    if (!payment || payment.status === "PAID") return;
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
        await tx.adRequest.update({ where: { id: adRequest.id }, data: { status: "SCHEDULED" } });
      }
    }

    await tx.campaign.update({
      where: { id: campaignId },
      data: { status: nextStatus },
    });

    await writeAudit({
      actorId: null,
      merchantId: campaign.merchantId,
      action: "CAMPAIGN_PAYMENT_PAID",
      metadata: { campaignId, amountCents: payment.amountCents, stripeCheckoutSessionId: session.id },
    });
  });
}

async function handleCheckoutSessionExpired(session: Stripe.Checkout.Session) {
  if (session.metadata?.kind === "MARKETING_TOPUP") {
    await prisma.marketingLedgerEntry.updateMany({
      where: { stripeCheckoutSessionId: session.id, type: "TOPUP", status: "PENDING" },
      data: { status: "CANCELLED" },
    });
    return;
  }

  const campaignId = session.metadata?.campaignId;
  if (!campaignId) return;

  await prisma.$transaction(async (tx) => {
    const payment = await tx.campaignPayment.findUnique({ where: { campaignId } });
    if (!payment || payment.status !== "PENDING" || payment.stripeCheckoutSessionId !== session.id) return;

    await tx.campaignPayment.update({ where: { id: payment.id }, data: { status: "CANCELLED" } });
    // Une mise en avant reste « à payer » (relançable) ; rien n'est activé.
    if (session.metadata?.campaignType !== "SPONSORED_AD") {
      await tx.campaign.update({ where: { id: campaignId }, data: { status: "CANCELLED" } });
    }
  });
}

async function handlePaymentIntentFailed(paymentIntent: Stripe.PaymentIntent) {
  if (paymentIntent.metadata?.kind === "MARKETING_TOPUP") {
    const ledgerEntryId = paymentIntent.metadata.ledgerEntryId;
    if (!ledgerEntryId) return;
    await prisma.marketingLedgerEntry.updateMany({
      where: { id: ledgerEntryId, type: "TOPUP", status: "PENDING" },
      data: { status: "FAILED" },
    });
    return;
  }

  const campaignId = paymentIntent.metadata?.campaignId;
  if (!campaignId) return;

  await prisma.$transaction(async (tx) => {
    const payment = await tx.campaignPayment.findUnique({ where: { campaignId } });
    if (!payment || payment.status === "PAID") return;

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

async function handleChargeRefunded(charge: Stripe.Charge) {
  const paymentIntentId = typeof charge.payment_intent === "string" ? charge.payment_intent : charge.payment_intent?.id;
  if (!paymentIntentId) return;

  await prisma.$transaction(async (tx) => {
    const payment = await tx.campaignPayment.findFirst({ where: { stripePaymentIntentId: paymentIntentId } });
    if (!payment || payment.status === "REFUNDED") return;

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
