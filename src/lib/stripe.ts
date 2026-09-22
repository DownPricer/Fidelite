import Stripe from "stripe";
import { env, isStripeConfigured } from "./env";

export class StripeNotConfiguredError extends Error {
  constructor() {
    super("Le paiement n'est pas disponible : Stripe n'est pas configuré sur cet environnement.");
    this.name = "StripeNotConfiguredError";
  }
}

let client: Stripe | null = null;

/** Réutilise un client unique. Lève StripeNotConfiguredError si les clés manquent (jamais un crash au démarrage). */
export function getStripeClient(): Stripe {
  if (!isStripeConfigured()) {
    throw new StripeNotConfiguredError();
  }
  if (!client) {
    client = new Stripe(env.stripeSecretKey, { apiVersion: "2026-08-26.dahlia" });
  }
  return client;
}

export type CampaignCheckoutInput = {
  campaignId: string;
  merchantId: string;
  campaignType: string;
  amountCents: number;
  description: string;
  successUrl: string;
  cancelUrl: string;
};

/**
 * Crée une session Stripe Checkout pour un achat de campagne ponctuel.
 * Le montant est toujours calculé côté serveur en amont (voir campaign-pricing.ts) —
 * cette fonction ne fait que transmettre le prix déjà validé à Stripe.
 */
export async function createCampaignCheckoutSession(input: CampaignCheckoutInput) {
  const stripe = getStripeClient();
  return stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: "eur",
          unit_amount: input.amountCents,
          product_data: { name: input.description },
        },
        quantity: 1,
      },
    ],
    success_url: input.successUrl,
    cancel_url: input.cancelUrl,
    metadata: {
      campaignId: input.campaignId,
      merchantId: input.merchantId,
      campaignType: input.campaignType,
    },
    payment_intent_data: {
      metadata: {
        campaignId: input.campaignId,
        merchantId: input.merchantId,
        campaignType: input.campaignType,
      },
    },
  });
}

export function constructStripeWebhookEvent(payload: string | Buffer, signature: string): Stripe.Event {
  const stripe = getStripeClient();
  return stripe.webhooks.constructEvent(payload, signature, env.stripeWebhookSecret);
}

export async function refundCampaignPayment(paymentIntentId: string) {
  const stripe = getStripeClient();
  return stripe.refunds.create({ payment_intent: paymentIntentId });
}
