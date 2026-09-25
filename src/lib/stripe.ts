import Stripe from "stripe";
import {
  getActiveStripeMode,
  isStripeConfigured,
  stripeSecretKeyFor,
  stripeWebhookSecretFor,
  type StripeModeValue,
} from "./stripe-mode";

export class StripeNotConfiguredError extends Error {
  constructor() {
    super("Le paiement n'est pas disponible : Stripe n'est pas configuré sur cet environnement.");
    this.name = "StripeNotConfiguredError";
  }
}

const clients = new Map<StripeModeValue, Stripe>();

function clientForMode(mode: StripeModeValue): Stripe {
  const key = stripeSecretKeyFor(mode);
  if (!key) throw new StripeNotConfiguredError();
  let client = clients.get(mode);
  if (!client) {
    client = new Stripe(key, { apiVersion: "2026-08-26.dahlia" });
    clients.set(mode, client);
  }
  return client;
}

/**
 * Client du mode ACTIF uniquement : la création de paiements n'utilise jamais la clé de l'autre mode.
 * Lève StripeNotConfiguredError si le mode est invalide ou si la clé/le secret manquent (jamais un crash au démarrage).
 */
export function getStripeClient(): Stripe {
  const mode = getActiveStripeMode();
  if (!mode || !isStripeConfigured()) throw new StripeNotConfiguredError();
  return clientForMode(mode);
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

/**
 * Vérifie la signature avec le secret de CHAQUE mode configuré (le webhook est unique). L'événement
 * doit ensuite être cohérent avec le secret qui l'a validé : `livemode` doit correspondre au mode du
 * secret, sinon il est rejeté. Le mode réel de l'événement est `event.livemode`, quel que soit le
 * mode actif du déploiement (un événement test retardé après le passage en réel reste un événement test).
 */
export function constructStripeWebhookEvent(payload: string | Buffer, signature: string): Stripe.Event {
  const modes = (["TEST", "LIVE"] as const).filter((mode) => stripeWebhookSecretFor(mode));
  if (modes.length === 0) throw new StripeNotConfiguredError();

  let lastError: unknown = new Error("Signature invalide.");
  for (const mode of modes) {
    try {
      const event = Stripe.webhooks.constructEvent(payload, signature, stripeWebhookSecretFor(mode));
      if (event.livemode !== (mode === "LIVE")) {
        throw new Error("Mode de l'événement incohérent avec le secret de signature.");
      }
      return event;
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError;
}

/** Rembourse avec la clé du mode du paiement d'origine (pas forcément le mode actif). */
export async function refundCampaignPayment(paymentIntentId: string, mode: StripeModeValue) {
  const stripe = clientForMode(mode);
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
          product_data: { name: "Recharge du solde marketing Fideto" },
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
