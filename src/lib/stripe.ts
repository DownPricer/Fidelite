import Stripe from "stripe";
import { prisma } from "./prisma";
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

export type BillingCustomerInput = { name: string; email?: string | null };

/**
 * Client Stripe du commerce pour le mode demandé (créé une fois, mémorisé en base). Tous les paiements
 * ponctuels y sont rattachés : c'est ce qui permet à Stripe de générer la facture et au commerçant de
 * retrouver SES documents (et jamais ceux d'un autre commerce).
 */
export async function ensureStripeCustomer(merchantId: string, mode: StripeModeValue, customer: BillingCustomerInput) {
  const key = { merchantId_mode: { merchantId, mode } };
  const existing = await prisma.merchantStripeCustomer.findUnique({ where: key });
  if (existing) return existing.stripeCustomerId;

  const stripe = clientForMode(mode);
  const created = await stripe.customers.create(
    { name: customer.name, email: customer.email ?? undefined, metadata: { merchantId, mode } },
    { idempotencyKey: `merchant-customer-${merchantId}-${mode}` },
  );
  try {
    await prisma.merchantStripeCustomer.create({ data: { merchantId, mode, stripeCustomerId: created.id } });
  } catch {
    // Création concurrente : on reprend celle qui a gagné.
    const winner = await prisma.merchantStripeCustomer.findUnique({ where: key });
    if (winner) return winner.stripeCustomerId;
    throw new Error("Client Stripe introuvable après création.");
  }
  return created.id;
}

/**
 * Paramètres de facturation d'un paiement ponctuel : client Stripe du commerce + génération d'une
 * facture (PDF) par Stripe après le paiement. Aucun taux de TVA n'est imposé ici : la fiscalité
 * (numéro de TVA, taxes automatiques, mentions légales) se règle dans les paramètres de facturation
 * du compte Stripe.
 */
async function billingParams(
  merchantId: string,
  customer: BillingCustomerInput | undefined,
  description: string,
  metadata: Record<string, string>,
) {
  const mode = getActiveStripeMode();
  const customerId = customer && mode ? await ensureStripeCustomer(merchantId, mode, customer) : null;
  return {
    ...(customerId ? { customer: customerId } : { customer_creation: "always" as const }),
    invoice_creation: { enabled: true, invoice_data: { description, metadata } },
  };
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
  /** Identité de facturation du commerce (client Stripe + facture). */
  customer?: BillingCustomerInput;
};

/**
 * Crée une session Stripe Checkout pour un achat de campagne ponctuel.
 * Le montant est toujours calculé côté serveur en amont (voir campaign-pricing.ts) —
 * cette fonction ne fait que transmettre le prix déjà validé à Stripe.
 */
export async function createCampaignCheckoutSession(input: CampaignCheckoutInput) {
  const stripe = getStripeClient();
  const quantity = input.quantity ?? 1;
  const billing = await billingParams(input.merchantId, input.customer, input.description, {
    campaignId: input.campaignId,
    merchantId: input.merchantId,
    campaignType: input.campaignType,
  });
  return stripe.checkout.sessions.create({
    mode: "payment",
    ...billing,
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
  customer?: BillingCustomerInput;
};

/** Recharge du solde marketing prépayé : paiement ponctuel, montant décidé côté serveur. */
export async function createMarketingTopupCheckoutSession(input: MarketingTopupCheckoutInput) {
  const stripe = getStripeClient();
  const metadata = {
    kind: "MARKETING_TOPUP",
    merchantId: input.merchantId,
    ledgerEntryId: input.ledgerEntryId,
  };
  const billing = await billingParams(input.merchantId, input.customer, "Recharge du solde marketing Fideto", metadata);
  return stripe.checkout.sessions.create({
    mode: "payment",
    ...billing,
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

/* ------------------------------- facturation commerçant ------------------------------- */

export type StripeInvoiceView = {
  id: string;
  number: string | null;
  date: string;
  totalCents: number;
  currency: string;
  status: string;
  kind: "SUBSCRIPTION" | "ONE_OFF";
  description: string | null;
  hostedUrl: string | null;
  pdfUrl: string | null;
  mode: StripeModeValue;
};

/** Mode utilisable (clé du mode configurée) — les factures TEST et LIVE sont lues avec leur propre clé. */
export function canReadStripeMode(mode: StripeModeValue) {
  return Boolean(stripeSecretKeyFor(mode));
}

/** Factures d'UN client Stripe (celui du commerce, résolu côté serveur — jamais fourni par le navigateur). */
export async function listStripeInvoices(customerId: string, mode: StripeModeValue, limit = 24): Promise<StripeInvoiceView[]> {
  const stripe = clientForMode(mode);
  const result = await stripe.invoices.list({ customer: customerId, limit });
  return result.data
    .filter((invoice) => invoice.status !== "draft")
    .map((invoice) => {
      const anyInvoice = invoice as unknown as {
        subscription?: string | null;
        parent?: { subscription_details?: unknown } | null;
        lines?: { data?: { description?: string | null }[] };
      };
      const isSubscription = Boolean(anyInvoice.subscription || anyInvoice.parent?.subscription_details);
      return {
        id: invoice.id as string,
        number: invoice.number ?? null,
        date: new Date(invoice.created * 1000).toISOString(),
        totalCents: invoice.total ?? invoice.amount_due ?? 0,
        currency: (invoice.currency ?? "eur").toUpperCase(),
        status: invoice.status ?? "open",
        kind: isSubscription ? ("SUBSCRIPTION" as const) : ("ONE_OFF" as const),
        description: anyInvoice.lines?.data?.[0]?.description ?? invoice.description ?? null,
        hostedUrl: invoice.hosted_invoice_url ?? null,
        pdfUrl: invoice.invoice_pdf ?? null,
        mode,
      };
    });
}

/** URL de reçu Stripe d'un paiement (pour les anciens paiements sans facture) ; null si indisponible. */
export async function receiptUrlForPaymentIntent(paymentIntentId: string, mode: StripeModeValue): Promise<string | null> {
  try {
    const stripe = clientForMode(mode);
    const intent = await stripe.paymentIntents.retrieve(paymentIntentId, { expand: ["latest_charge"] });
    const charge = intent.latest_charge;
    return charge && typeof charge !== "string" ? (charge.receipt_url ?? null) : null;
  } catch {
    return null;
  }
}

/** Portail de facturation Stripe (moyen de paiement, factures) — nécessite sa configuration dans le Dashboard Stripe. */
export async function createBillingPortalSession(customerId: string, mode: StripeModeValue, returnUrl: string) {
  const stripe = clientForMode(mode);
  return stripe.billingPortal.sessions.create({ customer: customerId, return_url: returnUrl });
}

export type StripeSubscriptionView = {
  id: string;
  customerId: string | null;
  status: string;
  cancelAtPeriodEnd: boolean;
  currentPeriodEnd: Date | null;
  cancelAt: Date | null;
};

/** Normalise un objet abonnement Stripe (la date de fin de période a migré vers les lignes selon la version d'API). */
export function normalizeStripeSubscription(sub: unknown): StripeSubscriptionView {
  const raw = sub as {
    id: string;
    customer?: string | { id: string } | null;
    status: string;
    cancel_at_period_end?: boolean;
    cancel_at?: number | null;
    current_period_end?: number | null;
    items?: { data?: { current_period_end?: number | null }[] };
  };
  const periodEnd = raw.items?.data?.[0]?.current_period_end ?? raw.current_period_end ?? null;
  return {
    id: raw.id,
    customerId: typeof raw.customer === "string" ? raw.customer : (raw.customer?.id ?? null),
    status: raw.status,
    cancelAtPeriodEnd: Boolean(raw.cancel_at_period_end),
    currentPeriodEnd: periodEnd ? new Date(periodEnd * 1000) : null,
    cancelAt: raw.cancel_at ? new Date(raw.cancel_at * 1000) : null,
  };
}

export async function retrieveStripeSubscription(subscriptionId: string, mode: StripeModeValue) {
  return normalizeStripeSubscription(await clientForMode(mode).subscriptions.retrieve(subscriptionId));
}

/** Programme l'arrêt à la fin de la période en cours (jamais une résiliation immédiate). Idempotent côté Stripe. */
export async function scheduleStripeSubscriptionCancellation(subscriptionId: string, mode: StripeModeValue) {
  const updated = await clientForMode(mode).subscriptions.update(
    subscriptionId,
    { cancel_at_period_end: true },
    { idempotencyKey: `cancel-at-period-end-${subscriptionId}` },
  );
  return normalizeStripeSubscription(updated);
}
