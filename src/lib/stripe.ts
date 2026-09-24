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

/** Une session abandonnée expire vite (30 min, minimum Stripe) : rien n'est activé ni crédité sans paiement. */
function checkoutExpiry() {
  return Math.floor(Date.now() / 1000) + 30 * 60;
}

export type CampaignCheckoutInput = {
  campaignId: string;
  merchantId: string;
  campaignType: string;
  /** Montant total en centimes ; doit être un multiple de `quantity`. */
  amountCents: number;
  /** Nombre d'unités (ex. jours de mise en avant). Défaut 1. */
  quantity?: number;
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
  const quantity = input.quantity ?? 1;
  return stripe.checkout.sessions.create({
    mode: "payment",
    expires_at: checkoutExpiry(),
    line_items: [
      {
        price_data: {
          currency: "eur",
          unit_amount: Math.round(input.amountCents / quantity),
          product_data: { name: input.description },
        },
        quantity,
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

export type MarketingTopupCheckoutInput = {
  merchantId: string;
  ledgerEntryId: string;
  amountCents: number;
  successUrl: string;
  cancelUrl: string;
};

/** Recharge du solde marketing prépayé : paiement ponctuel, montant décidé côté serveur. */
export async function createMarketingTopupCheckoutSession(input: MarketingTopupCheckoutInput) {
  const stripe = getStripeClient();
  const metadata = {
    kind: "MARKETING_TOPUP",
    merchantId: input.merchantId,
    ledgerEntryId: input.ledgerEntryId,
  };
  return stripe.checkout.sessions.create({
    mode: "payment",
    expires_at: checkoutExpiry(),
    line_items: [
      {
        price_data: {
          currency: "eur",
          unit_amount: input.amountCents,
          product_data: { name: "Recharge du solde marketing Fidelo" },
        },
        quantity: 1,
      },
    ],
    success_url: input.successUrl,
    cancel_url: input.cancelUrl,
    metadata,
    payment_intent_data: { metadata },
  });
}
