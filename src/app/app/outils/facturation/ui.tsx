"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui";

type Subscription = {
  exists: boolean;
  planLabel: string | null;
  amount: number | null;
  currency: string | null;
  frequency: "MONTHLY" | "YEARLY" | null;
  insightEnabled: boolean;
  statusLabel: string | null;
  status: string | null;
  trialEndsAt: string | null;
  nextBillingAt: string | null;
  cancelAtPeriodEnd: boolean;
  cancelEffectiveAt: string | null;
  source: "STRIPE" | "MANUAL" | null;
  canCancel: boolean;
  cancelBlockedReason: string | null;
};
type Transaction = {
  id: string;
  date: string;
  kind: "STRIPE_PAYMENT" | "TOPUP" | "BALANCE_DEBIT" | "REFUND";
  collectedByStripe: boolean;
  label: string;
  amountCents: number;
  status: string;
  mode: "TEST" | "LIVE";
  receiptUrl: string | null;
};
type Invoice = {
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
  mode: "TEST" | "LIVE";
};
type Cancellation = { effectiveAt: string; planLabel: string; alreadyRequested: boolean; source: "STRIPE" | "MANUAL" };

const day = (iso: string) => new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
const shortDay = (iso: string) => new Date(iso).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" });
const money = (cents: number, currency = "EUR") => (cents / 100).toLocaleString("fr-FR", { style: "currency", currency });

const TX_STATUS: Record<string, string> = {
  PAID: "Payé",
  PENDING: "En attente",
  FAILED: "Échoué",
  REFUNDED: "Remboursé",
  CANCELLED: "Annulé",
};
const INVOICE_STATUS: Record<string, string> = { paid: "Payée", open: "À payer", void: "Annulée", uncollectible: "Irrécouvrable" };

function ModeBadge({ mode }: { mode: "TEST" | "LIVE" }) {
  return (
    <span className={`rounded-full px-2 py-0.5 text-[10px] font-black uppercase ${mode === "TEST" ? "bg-amber-400/20 text-amber-300" : "bg-emerald-400/15 text-emerald-300"}`}>
      {mode === "TEST" ? "Test" : "Réel"}
    </span>
  );
}

async function api(url: string, init?: RequestInit) {
  const res = await fetch(url, init);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error((data as { error?: string }).error ?? "Action impossible.");
  return data as Record<string, unknown>;
}

export function BillingPanel() {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [transactions, setTransactions] = useState<Transaction[] | null>(null);
  const [invoices, setInvoices] = useState<Invoice[] | null>(null);
  const [invoicesUnavailable, setInvoicesUnavailable] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [confirming, setConfirming] = useState<Cancellation | null>(null);

  const load = useCallback(async () => {
    try {
      const data = (await api("/api/merchant/facturation", { cache: "no-store" })) as unknown as { subscription: Subscription; transactions: Transaction[] };
      setSubscription(data.subscription);
      setTransactions(data.transactions);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Chargement impossible.");
    }
    try {
      const data = (await api("/api/merchant/facturation/factures", { cache: "no-store" })) as unknown as { invoices: Invoice[]; unavailable: string[] };
      setInvoices(data.invoices);
      setInvoicesUnavailable(data.unavailable.length > 0);
    } catch {
      setInvoices([]);
      setInvoicesUnavailable(true);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function openPortal() {
    setBusy(true);
    setError(null);
    try {
      const data = await api("/api/merchant/facturation/portail", { method: "POST", headers: { "Content-Type": "application/json" }, body: "{}" });
      if (typeof data.url === "string") window.location.href = data.url;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Portail indisponible.");
    } finally {
      setBusy(false);
    }
  }

  async function startCancellation() {
    setBusy(true);
    setError(null);
    try {
      setConfirming((await api("/api/merchant/facturation/abonnement/arret", { cache: "no-store" })) as unknown as Cancellation);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Impossible de préparer l'arrêt.");
    } finally {
      setBusy(false);
    }
  }

  async function confirmCancellation() {
    if (!confirming || busy) return; // une seule demande à la fois
    setBusy(true);
    setError(null);
    try {
      await api("/api/merchant/facturation/abonnement/arret", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ effectiveAt: confirming.effectiveAt }),
      });
      setNotice(`Arrêt programmé : votre abonnement s'arrêtera le ${day(confirming.effectiveAt)}.`);
      setConfirming(null);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Impossible de programmer l'arrêt.");
      setConfirming(null);
      await load();
    } finally {
      setBusy(false);
    }
  }

  /* ----------------------------- écran de confirmation ----------------------------- */
  if (confirming) {
    return (
      <div className="glass-panel space-y-4 p-5" data-testid="cancel-confirmation">
        <button type="button" className="text-xs font-semibold text-[var(--muted)]" onClick={() => setConfirming(null)}>
          ← Retour
        </button>
        <h2 className="text-lg font-black text-[var(--ink)]">Arrêter mon abonnement ?</h2>
        <p className="rounded-xl border border-[var(--border)] p-3 text-sm text-[var(--ink)]" data-testid="effective-date">
          Date effective de l&apos;arrêt : <b>{day(confirming.effectiveAt)}</b> (fin de votre période en cours).
        </p>
        <ul className="list-disc space-y-1 pl-5 text-sm text-[var(--muted-strong)]">
          <li>
            Jusqu&apos;au {day(confirming.effectiveAt)}, votre formule {confirming.planLabel} et ses options restent <b>entièrement accessibles</b>.
          </li>
          <li>L&apos;arrêt n&apos;est pas immédiat : aucun remboursement n&apos;est nécessaire, rien n&apos;est coupé avant cette date.</li>
          <li>Votre compte, vos clients, vos cartes et vos données ne sont <b>pas supprimés</b>.</li>
          <li>Vous pourrez voir « Arrêt prévu le {shortDay(confirming.effectiveAt)} » sur cette page.</li>
        </ul>
        {error ? <p className="text-sm text-[var(--danger)]">{error}</p> : null}
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button variant="danger" disabled={busy} onClick={() => void confirmCancellation()} data-testid="confirm-cancel">
            Confirmer l&apos;arrêt le {shortDay(confirming.effectiveAt)}
          </Button>
          <Button variant="secondary" disabled={busy} onClick={() => setConfirming(null)}>
            Garder mon abonnement
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error ? <p className="rounded-xl border border-[var(--danger)] p-3 text-sm text-[var(--danger)]">{error}</p> : null}
      {notice ? <p className="glass-panel p-3 text-sm text-[var(--ink)]" data-testid="notice">{notice}</p> : null}

      {/* ------------------------------- Abonnement ------------------------------- */}
      <section className="glass-panel space-y-3 p-4" aria-label="Abonnement" data-testid="subscription">
        <h2 className="text-base font-black text-[var(--ink)]">Abonnement</h2>
        {!subscription ? (
          <div className="h-16 animate-pulse rounded-xl bg-white/5" />
        ) : !subscription.exists ? (
          <p className="text-sm text-[var(--muted)]">Aucun abonnement n&apos;est enregistré pour votre commerce.</p>
        ) : (
          <>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-lg font-black text-[var(--ink)]">
                Formule {subscription.planLabel}
                {subscription.insightEnabled ? " + Insight" : ""}
              </p>
              <span className="campaign-status-pill campaign-status-pill-scheduled">{subscription.statusLabel}</span>
            </div>
            <dl className="grid grid-cols-2 gap-x-3 gap-y-2 text-sm">
              <dt className="text-[var(--muted)]">Prix souscrit</dt>
              <dd className="text-right font-bold text-[var(--ink)]" data-testid="sub-price">
                {subscription.amount !== null ? `${money(Math.round(subscription.amount * 100), subscription.currency ?? "EUR")} / ${subscription.frequency === "YEARLY" ? "an" : "mois"}` : "—"}
              </dd>
              {subscription.status === "TRIAL" && subscription.trialEndsAt ? (
                <>
                  <dt className="text-[var(--muted)]">Fin de l&apos;essai</dt>
                  <dd className="text-right font-bold text-[var(--ink)]">{day(subscription.trialEndsAt)}</dd>
                </>
              ) : null}
              <dt className="text-[var(--muted)]">Prochaine échéance</dt>
              <dd className="text-right font-bold text-[var(--ink)]">{subscription.nextBillingAt ? day(subscription.nextBillingAt) : "Non communiquée"}</dd>
            </dl>
            {subscription.source === "MANUAL" ? (
              <p className="text-xs text-[var(--muted)]">Votre abonnement est géré directement par Fideto (hors prélèvement Stripe automatique).</p>
            ) : null}
            {subscription.cancelAtPeriodEnd && subscription.cancelEffectiveAt ? (
              <p className="rounded-xl border border-amber-400/50 bg-amber-400/10 p-3 text-sm font-bold text-[var(--ink)]" data-testid="cancel-scheduled">
                Arrêt prévu le {day(subscription.cancelEffectiveAt)}
                <span className="block text-xs font-normal text-[var(--muted-strong)]">Votre abonnement reste actif jusqu&apos;à cette date.</span>
              </p>
            ) : null}
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button variant="secondary" disabled={busy} onClick={() => void openPortal()} data-testid="portal">
                Gérer la facturation (Stripe)
              </Button>
              {subscription.canCancel ? (
                <Button variant="secondary" disabled={busy} onClick={() => void startCancellation()} data-testid="cancel-subscription">
                  Arrêter mon abonnement
                </Button>
              ) : null}
            </div>
            {!subscription.canCancel && !subscription.cancelAtPeriodEnd && subscription.cancelBlockedReason ? (
              <p className="text-xs text-[var(--muted)]">{subscription.cancelBlockedReason}</p>
            ) : null}
          </>
        )}
      </section>

      {/* -------------------------------- Factures -------------------------------- */}
      <section className="glass-panel space-y-3 p-4" aria-label="Factures" data-testid="invoices">
        <h2 className="text-base font-black text-[var(--ink)]">Factures</h2>
        <p className="text-xs text-[var(--muted)]">Documents émis par Stripe : abonnement mensuel et paiements ponctuels (recharges, campagnes payées directement).</p>
        {invoices === null ? (
          <div className="h-12 animate-pulse rounded-xl bg-white/5" />
        ) : invoices.length === 0 ? (
          <p className="text-sm text-[var(--muted)]">
            {invoicesUnavailable ? "Les factures ne peuvent pas être chargées pour le moment." : "Aucune facture pour le moment. Les paiements ponctuels effectués à partir de maintenant génèrent une facture Stripe."}
          </p>
        ) : (
          <ul className="divide-y divide-[var(--border)]">
            {invoices.map((invoice) => (
              <li key={`${invoice.mode}-${invoice.id}`} className="space-y-1 py-3" data-testid="invoice-row">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-bold text-[var(--ink)]">
                    {invoice.number ? `Facture ${invoice.number}` : "Facture"} · {invoice.kind === "SUBSCRIPTION" ? "Abonnement" : "Paiement ponctuel"}
                  </span>
                  <span className="text-sm font-black text-[var(--ink)]">{money(invoice.totalCents, invoice.currency)}</span>
                </div>
                <div className="flex flex-wrap items-center gap-2 text-xs text-[var(--muted)]">
                  <span>{shortDay(invoice.date)}</span>
                  <span>· {INVOICE_STATUS[invoice.status] ?? invoice.status}</span>
                  <ModeBadge mode={invoice.mode} />
                  {invoice.hostedUrl ? (
                    <a className="font-bold text-[var(--violet-bright)] underline" href={invoice.hostedUrl} target="_blank" rel="noopener noreferrer">
                      Ouvrir
                    </a>
                  ) : null}
                  {invoice.pdfUrl ? (
                    <a className="font-bold text-[var(--violet-bright)] underline" href={invoice.pdfUrl} target="_blank" rel="noopener noreferrer">
                      PDF
                    </a>
                  ) : null}
                </div>
                {invoice.description ? <p className="text-xs text-[var(--muted)]">{invoice.description}</p> : null}
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* ------------------------------- Transactions ------------------------------- */}
      <section className="glass-panel space-y-3 p-4" aria-label="Transactions" data-testid="transactions">
        <h2 className="text-base font-black text-[var(--ink)]">Transactions</h2>
        <p className="text-xs text-[var(--muted)]">
          « Encaissé » = paiement réellement débité par Stripe. « Solde marketing » = simple mouvement de votre solde prépayé, pas un paiement. Un reçu Stripe n&apos;est pas une facture.
        </p>
        {transactions === null ? (
          <div className="h-12 animate-pulse rounded-xl bg-white/5" />
        ) : transactions.length === 0 ? (
          <p className="text-sm text-[var(--muted)]">Aucune transaction pour le moment.</p>
        ) : (
          <ul className="divide-y divide-[var(--border)]">
            {transactions.map((t) => {
              const spent = t.kind === "BALANCE_DEBIT";
              return (
                <li key={t.id} className="space-y-1 py-3" data-testid="transaction-row">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-sm font-bold text-[var(--ink)]">{t.label}</span>
                    <span className={`text-sm font-black ${spent ? "text-[var(--muted-strong)]" : "text-[var(--ink)]"}`}>
                      {spent ? "−" : t.kind === "REFUND" ? "+" : ""}
                      {money(t.amountCents)}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-[var(--muted)]">
                    <span>{shortDay(t.date)}</span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${t.collectedByStripe ? "bg-violet-400/20 text-violet-200" : "bg-white/10 text-[var(--muted-strong)]"}`}
                      data-testid="tx-nature"
                    >
                      {t.kind === "BALANCE_DEBIT" ? "Solde marketing — pas un paiement" : t.kind === "REFUND" ? "Restitution au solde" : t.collectedByStripe ? "Encaissé (Stripe)" : "Paiement Stripe non encaissé"}
                    </span>
                    <span>· {TX_STATUS[t.status] ?? t.status}</span>
                    <ModeBadge mode={t.mode} />
                    {t.receiptUrl ? (
                      <a className="font-bold text-[var(--violet-bright)] underline" href={t.receiptUrl} target="_blank" rel="noopener noreferrer" data-testid="receipt-link">
                        Reçu
                      </a>
                    ) : null}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
