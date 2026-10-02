import type { StripeMode, SubscriptionStatus } from "@prisma/client";
import { prisma } from "./prisma";
import {
  canReadStripeMode,
  listStripeInvoices,
  receiptUrlForPaymentIntent,
  retrieveStripeSubscription,
  scheduleStripeSubscriptionCancellation,
  type StripeInvoiceView,
  type StripeSubscriptionView,
} from "./stripe";

/**
 * Espace « Réglages et facturation » du commerçant. Aucune donnée n'est inventée : l'abonnement vient de
 * MerchantSubscription (et de Stripe quand un abonnement Stripe est lié), les factures de Stripe pour le
 * client Stripe DE CE commerce, les transactions de CampaignPayment / MarketingLedgerEntry de CE commerce.
 */

const PLAN_LABELS = { STARTER: "Starter", PRO: "Pro", ENTERPRISE: "Enterprise" } as const;
const STATUS_LABELS: Record<SubscriptionStatus, string> = {
  DRAFT: "Brouillon",
  TRIAL: "Période d'essai",
  ACTIVE: "Actif",
  PAST_DUE: "Paiement en retard",
  CANCELLED: "Arrêté",
  EXPIRED: "Expiré",
};

export type SubscriptionView = {
  exists: boolean;
  planLabel: string | null;
  amount: number | null;
  currency: string | null;
  frequency: "MONTHLY" | "YEARLY" | null;
  insightEnabled: boolean;
  status: SubscriptionStatus | null;
  statusLabel: string | null;
  trialEndsAt: string | null;
  nextBillingAt: string | null;
  cancelAtPeriodEnd: boolean;
  cancelEffectiveAt: string | null;
  source: "STRIPE" | "MANUAL" | null;
  stripeMode: StripeMode | null;
  canCancel: boolean;
  cancelBlockedReason: string | null;
};

const CANCELLABLE: SubscriptionStatus[] = ["TRIAL", "ACTIVE", "PAST_DUE"];

export function toSubscriptionView(
  sub: {
    plan: keyof typeof PLAN_LABELS;
    amount: number;
    currency: string;
    frequency: "MONTHLY" | "YEARLY";
    status: SubscriptionStatus;
    trialEndsAt: Date | null;
    nextBillingAt: Date | null;
    endsAt: Date | null;
    insightEnabled: boolean;
    stripeSubscriptionId: string | null;
    stripeMode: StripeMode | null;
    cancelAtPeriodEnd: boolean;
    cancelEffectiveAt: Date | null;
  } | null,
): SubscriptionView {
  if (!sub) {
    return {
      exists: false, planLabel: null, amount: null, currency: null, frequency: null, insightEnabled: false, status: null, statusLabel: null,
      trialEndsAt: null, nextBillingAt: null, cancelAtPeriodEnd: false, cancelEffectiveAt: null, source: null, stripeMode: null,
      canCancel: false, cancelBlockedReason: "Aucun abonnement n'est enregistré pour ce commerce.",
    };
  }
  const effective = effectiveEndDate(sub);
  const cancellable = CANCELLABLE.includes(sub.status);
  let blocked: string | null = null;
  if (!cancellable) blocked = "Cet abonnement n'est pas actif.";
  else if (sub.cancelAtPeriodEnd) blocked = "L'arrêt de cet abonnement est déjà programmé.";
  else if (!effective) blocked = "La date de fin de période n'est pas connue : contactez Fideto pour arrêter votre abonnement.";
  return {
    exists: true,
    planLabel: PLAN_LABELS[sub.plan],
    amount: sub.amount,
    currency: sub.currency,
    frequency: sub.frequency,
    insightEnabled: sub.insightEnabled,
    status: sub.status,
    statusLabel: STATUS_LABELS[sub.status],
    trialEndsAt: sub.trialEndsAt?.toISOString() ?? null,
    nextBillingAt: sub.nextBillingAt?.toISOString() ?? null,
    cancelAtPeriodEnd: sub.cancelAtPeriodEnd,
    cancelEffectiveAt: sub.cancelEffectiveAt?.toISOString() ?? null,
    source: sub.stripeSubscriptionId ? "STRIPE" : "MANUAL",
    stripeMode: sub.stripeMode,
    canCancel: cancellable && !sub.cancelAtPeriodEnd && Boolean(effective),
    cancelBlockedReason: blocked,
  };
}

/** Date effective d'un arrêt : fin de la période en cours (jamais inventée ; null si inconnue). */
export function effectiveEndDate(sub: { status: SubscriptionStatus; trialEndsAt: Date | null; nextBillingAt: Date | null; endsAt: Date | null; cancelEffectiveAt?: Date | null }) {
  if (sub.cancelEffectiveAt) return sub.cancelEffectiveAt;
  if (sub.status === "TRIAL" && sub.trialEndsAt) return sub.trialEndsAt;
  return sub.nextBillingAt ?? sub.endsAt ?? null;
}

/* ---------------------------------- statut Stripe ---------------------------------- */

export function mapStripeSubscriptionStatus(status: string): SubscriptionStatus {
  switch (status) {
    case "active":
      return "ACTIVE";
    case "trialing":
      return "TRIAL";
    case "past_due":
    case "unpaid":
      return "PAST_DUE";
    case "canceled":
      return "CANCELLED";
    case "incomplete_expired":
      return "EXPIRED";
    default:
      return "DRAFT";
  }
}

/** Reporte l'état d'un abonnement Stripe dans MerchantSubscription (Stripe = source de vérité). */
export async function syncSubscriptionFromStripeView(view: StripeSubscriptionView) {
  const row = await prisma.merchantSubscription.findUnique({ where: { stripeSubscriptionId: view.id } });
  if (!row) return null;
  const cancelEffectiveAt = view.cancelAtPeriodEnd ? (view.cancelAt ?? view.currentPeriodEnd) : null;
  return prisma.merchantSubscription.update({
    where: { id: row.id },
    data: {
      status: mapStripeSubscriptionStatus(view.status),
      nextBillingAt: view.status === "canceled" ? null : (view.currentPeriodEnd ?? undefined),
      cancelAtPeriodEnd: view.cancelAtPeriodEnd,
      cancelEffectiveAt,
      autoRenew: !view.cancelAtPeriodEnd,
      ...(view.status === "canceled" ? { cancelledAt: new Date(), endsAt: view.currentPeriodEnd ?? new Date() } : {}),
    },
  });
}

/* ---------------------------------- transactions ---------------------------------- */

export type TransactionKind = "STRIPE_PAYMENT" | "TOPUP" | "BALANCE_DEBIT" | "REFUND";

export type TransactionView = {
  id: string;
  date: string;
  kind: TransactionKind;
  /** true = argent réellement encaissé par Stripe ; false = simple mouvement du solde marketing. */
  collectedByStripe: boolean;
  label: string;
  amountCents: number;
  status: string;
  mode: StripeMode;
  receiptUrl: string | null;
  paymentIntentId: string | null;
};

const MAX_RECEIPT_LOOKUPS = 20;

export async function listMerchantTransactions(merchantId: string): Promise<TransactionView[]> {
  const [payments, ledger] = await Promise.all([
    prisma.campaignPayment.findMany({
      where: { merchantId },
      orderBy: { createdAt: "desc" },
      take: 100,
      include: { campaign: { select: { title: true, body: true, channel: true } } },
    }),
    prisma.marketingLedgerEntry.findMany({ where: { merchantId }, orderBy: { createdAt: "desc" }, take: 200 }),
  ]);

  const rows: TransactionView[] = [];
  for (const p of payments) {
    rows.push({
      id: `pay_${p.id}`,
      date: (p.paidAt ?? p.createdAt).toISOString(),
      kind: "STRIPE_PAYMENT",
      collectedByStripe: p.status === "PAID" || p.status === "REFUNDED",
      label: `Paiement direct de la campagne « ${(p.campaign?.title || p.campaign?.body || "Campagne").slice(0, 60)} »`,
      amountCents: p.amountCents,
      status: p.status,
      mode: p.mode,
      receiptUrl: null,
      paymentIntentId: p.stripePaymentIntentId,
    });
  }
  for (const e of ledger) {
    const isTopup = e.type === "TOPUP";
    rows.push({
      id: `led_${e.id}`,
      date: e.createdAt.toISOString(),
      kind: isTopup ? "TOPUP" : e.type === "REFUND" ? "REFUND" : "BALANCE_DEBIT",
      // Une recharge payée est encaissée par Stripe ; un débit ou une restitution ne sont que des mouvements du solde.
      collectedByStripe: isTopup && e.status === "PAID",
      label: isTopup ? "Recharge du solde marketing" : e.description,
      amountCents: e.amountCents,
      status: e.status,
      mode: e.mode,
      receiptUrl: null,
      paymentIntentId: isTopup ? e.stripePaymentIntentId : null,
    });
  }
  return rows.sort((a, b) => b.date.localeCompare(a.date));
}

/** Ajoute le reçu Stripe aux paiements réellement encaissés (borné) — ce n'est jamais une facture. */
export async function attachReceipts(rows: TransactionView[]): Promise<TransactionView[]> {
  const targets = rows.filter((r) => r.collectedByStripe && r.paymentIntentId && canReadStripeMode(r.mode)).slice(0, MAX_RECEIPT_LOOKUPS);
  const urls = await Promise.all(targets.map((r) => receiptUrlForPaymentIntent(r.paymentIntentId as string, r.mode)));
  const byId = new Map(targets.map((r, i) => [r.id, urls[i]]));
  return rows.map((r) => (byId.has(r.id) ? { ...r, receiptUrl: byId.get(r.id) ?? null } : r));
}

/* ------------------------------------- factures ------------------------------------- */

export type InvoicesResult = { invoices: StripeInvoiceView[]; unavailable: StripeMode[] };

/** Factures Stripe des clients Stripe DE CE commerce (un par mode). Les modes non lisibles sont signalés, pas masqués. */
export async function listMerchantInvoices(merchantId: string): Promise<InvoicesResult> {
  const customers = await prisma.merchantStripeCustomer.findMany({ where: { merchantId } });
  const invoices: StripeInvoiceView[] = [];
  const unavailable: StripeMode[] = [];
  for (const customer of customers) {
    if (!canReadStripeMode(customer.mode)) {
      unavailable.push(customer.mode);
      continue;
    }
    try {
      invoices.push(...(await listStripeInvoices(customer.stripeCustomerId, customer.mode)));
    } catch {
      unavailable.push(customer.mode);
    }
  }
  return { invoices: invoices.sort((a, b) => b.date.localeCompare(a.date)), unavailable };
}

/* ------------------------------ arrêt de l'abonnement ------------------------------ */

export class BillingError extends Error {
  constructor(
    public code: "NO_SUBSCRIPTION" | "NOT_ACTIVE" | "ALREADY_REQUESTED" | "NO_PERIOD_END" | "STRIPE_UNAVAILABLE" | "STRIPE_MISMATCH" | "STALE_DATE",
    message: string,
    public status: number,
  ) {
    super(message);
  }
}

export type CancellationPreview = {
  effectiveAt: string;
  planLabel: string;
  alreadyRequested: boolean;
  source: "STRIPE" | "MANUAL";
};

export async function previewCancellation(merchantId: string): Promise<CancellationPreview> {
  const sub = await prisma.merchantSubscription.findUnique({ where: { merchantId } });
  if (!sub) throw new BillingError("NO_SUBSCRIPTION", "Aucun abonnement n'est enregistré pour ce commerce.", 404);
  if (!CANCELLABLE.includes(sub.status)) throw new BillingError("NOT_ACTIVE", "Cet abonnement n'est pas actif.", 409);
  const effective = effectiveEndDate(sub);
  if (!effective) throw new BillingError("NO_PERIOD_END", "La date de fin de période est inconnue : contactez Fideto.", 409);
  return {
    effectiveAt: effective.toISOString(),
    planLabel: PLAN_LABELS[sub.plan],
    alreadyRequested: sub.cancelAtPeriodEnd,
    source: sub.stripeSubscriptionId ? "STRIPE" : "MANUAL",
  };
}

/**
 * Programme l'arrêt à la FIN de la période en cours — jamais immédiat, sans supprimer ni compte ni données.
 *  - Abonnement Stripe lié : Stripe reste la source de vérité (cancel_at_period_end), l'état est resynchronisé.
 *  - Abonnement manuel (aucun objet Stripe) : l'arrêt est enregistré dans Fideto et sera appliqué à l'échéance.
 * La réservation en base est atomique : une seconde demande (double clic, deux onglets) est refusée.
 */
export async function requestSubscriptionCancellation(merchantId: string, expectedEffectiveAt: string) {
  const sub = await prisma.merchantSubscription.findUnique({ where: { merchantId } });
  if (!sub) throw new BillingError("NO_SUBSCRIPTION", "Aucun abonnement n'est enregistré pour ce commerce.", 404);
  if (!CANCELLABLE.includes(sub.status)) throw new BillingError("NOT_ACTIVE", "Cet abonnement n'est pas actif.", 409);
  if (sub.cancelAtPeriodEnd) throw new BillingError("ALREADY_REQUESTED", "L'arrêt de cet abonnement est déjà programmé.", 409);
  const effective = effectiveEndDate(sub);
  if (!effective) throw new BillingError("NO_PERIOD_END", "La date de fin de période est inconnue : contactez Fideto.", 409);
  if (new Date(expectedEffectiveAt).getTime() !== effective.getTime()) {
    throw new BillingError("STALE_DATE", "La date de fin de période a changé : relisez la confirmation avant de valider.", 409);
  }

  // Réservation atomique : une seule requête passe de « non demandé » à « demandé ».
  const claimed = await prisma.merchantSubscription.updateMany({
    where: { id: sub.id, cancelAtPeriodEnd: false },
    data: { cancelAtPeriodEnd: true, cancelRequestedAt: new Date(), cancelEffectiveAt: effective, autoRenew: false },
  });
  if (claimed.count !== 1) throw new BillingError("ALREADY_REQUESTED", "L'arrêt de cet abonnement est déjà programmé.", 409);

  if (sub.stripeSubscriptionId) {
    const mode = sub.stripeMode;
    const revert = () =>
      prisma.merchantSubscription.updateMany({
        where: { id: sub.id },
        data: { cancelAtPeriodEnd: false, cancelRequestedAt: null, cancelEffectiveAt: null, autoRenew: sub.autoRenew },
      });
    if (!mode || !canReadStripeMode(mode)) {
      await revert();
      throw new BillingError("STRIPE_UNAVAILABLE", "Stripe n'est pas disponible pour le moment : réessayez plus tard.", 503);
    }
    try {
      // L'abonnement Stripe doit appartenir au client Stripe de CE commerce.
      const customer = await prisma.merchantStripeCustomer.findUnique({ where: { merchantId_mode: { merchantId, mode } } });
      const current = await retrieveStripeSubscription(sub.stripeSubscriptionId, mode);
      if (!customer || current.customerId !== customer.stripeCustomerId) {
        await revert();
        throw new BillingError("STRIPE_MISMATCH", "Cet abonnement Stripe n'est pas rattaché à votre commerce.", 403);
      }
      const updated = await scheduleStripeSubscriptionCancellation(sub.stripeSubscriptionId, mode);
      await syncSubscriptionFromStripeView(updated);
    } catch (error) {
      if (error instanceof BillingError) throw error;
      await revert();
      throw new BillingError("STRIPE_UNAVAILABLE", "L'arrêt n'a pas pu être programmé chez Stripe : rien n'a été modifié, réessayez.", 502);
    }
  }
  return prisma.merchantSubscription.findUnique({ where: { id: sub.id } });
}
