"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui";
import { CAMPAIGN_PRICE_CENTS } from "@/lib/campaign-prices";
import {
  DEMO_BALANCE,
  formatCents,
  formatDate,
  ledgerLabel,
  startTopup,
  type BalanceData,
  type LedgerEntry,
} from "../ui";

type HistoryFilter = "all" | "topup" | "debit";

function historyDateKey(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" }).toUpperCase();
}

function matchesFilter(entry: LedgerEntry, filter: HistoryFilter) {
  if (filter === "all") return true;
  if (filter === "topup") return entry.type === "TOPUP";
  return entry.type === "DEBIT" || entry.type === "REFUND";
}

/**
 * Page dédiée au solde marketing (Partie 15) : recharge, historique complet et informations de
 * paiement. Un résumé compact reste visible dans la page Campagnes, qui renvoie ici via « Recharger ».
 */
export function SoldeMarketingPanel({ demo = false }: { demo?: boolean }) {
  const [data, setData] = useState<BalanceData | null>(demo ? DEMO_BALANCE : null);
  const [selected, setSelected] = useState<number | null>(demo ? DEMO_BALANCE.presetsCents[0] : null);
  const [custom, setCustom] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [filter, setFilter] = useState<HistoryFilter>("all");

  const load = useCallback(async () => {
    if (demo) return;
    try {
      const response = await fetch("/api/merchant/marketing-balance");
      if (response.ok) setData((await response.json()) as BalanceData);
    } catch {
      // Le solde reste masqué ; les campagnes gratuites continuent de fonctionner.
    }
  }, [demo]);

  useEffect(() => {
    if (data && selected === null && data.presetsCents.length > 0) setSelected(data.presetsCents[0]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  useEffect(() => {
    void load();
    const topup = new URLSearchParams(window.location.search).get("topup");
    if (topup === "success") {
      setNotice("Paiement reçu. Votre solde sera crédité dès la confirmation de Stripe (quelques secondes).");
      // Le crédit arrive par webhook signé, jamais par cette page de retour : on relit le solde après un court délai.
      const timer = window.setTimeout(() => void load(), 4000);
      return () => window.clearTimeout(timer);
    }
    if (topup === "cancelled") setNotice("Recharge annulée : aucun montant n'a été débité ni crédité.");
  }, [load]);

  const groupedHistory = useMemo(() => {
    if (!data) return [];
    const filtered = data.history.filter((entry) => matchesFilter(entry, filter));
    const groups = new Map<string, LedgerEntry[]>();
    for (const entry of filtered) {
      const key = historyDateKey(entry.createdAt);
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key)!.push(entry);
    }
    return Array.from(groups.entries());
  }, [data, filter]);

  if (!data) {
    return (
      <section className="glass-panel p-5 sm:p-6">
        <p className="text-sm text-[var(--muted-strong)]">Chargement du solde…</p>
      </section>
    );
  }

  const customCents = Math.round(Number(custom.replace(",", ".")) * 100);
  const customEntered = custom.trim().length > 0;
  const customValid = Number.isFinite(customCents) && customCents >= data.minTopupCents && customCents <= data.maxTopupCents;
  const paymentsDisabled = data.paymentsAvailable === false;
  const amountToCharge = customEntered ? customCents : (selected ?? data.presetsCents[0] ?? 0);
  const amountValid = customEntered ? customValid : selected !== null;

  async function topup() {
    if (demo || !amountValid) return;
    setBusy(true);
    setError(null);
    await startTopup(amountToCharge, setError);
    setBusy(false);
  }

  return (
    <div className="space-y-4">
      <div className="solde-topline">
        <span className="solde-mode-pill">
          <i />
          {data.testMode ? "PAIEMENTS DE TEST" : "PAIEMENTS RÉELS"}
        </span>
      </div>

      <div className="solde-top-grid">
        <section className="card solde-balance-card" aria-label="Votre solde marketing">
          <p className="solde-bal-title">Crédit disponible</p>
          <p className="solde-bal-value">{formatCents(data.balanceCents)}</p>
          <p className="solde-bal-sub">
            {data.testMode ? "Solde de test · utilisable pour les envois payants simulés" : "Solde réel · utilisable pour vos envois payants"}
          </p>
          <div className="solde-bal-bottom">
            <div className="solde-bal-bubble" aria-hidden>
              ✦
            </div>
            <div>
              <strong className="block text-sm text-[var(--ink)]">Votre budget reste sous contrôle</strong>
              <small className="block max-w-[390px] text-[var(--muted-strong)]">
                Le prix de chaque envoi est affiché avant sa confirmation.
              </small>
            </div>
          </div>
        </section>

        <section className="card solde-recharge-card" aria-labelledby="recharge-title">
          <p className="solde-card-label">Ajouter du crédit</p>
          <h2 id="recharge-title">Recharger le solde</h2>
          <p className="text-xs text-[var(--muted-strong)]">Choisissez un montant pour continuer.</p>

          {paymentsDisabled ? (
            <p className="mt-3 text-xs text-[var(--muted)]">Recharge indisponible pour ce commerce en mode actuel.</p>
          ) : (
            <>
              <div className="solde-amounts" role="group" aria-label="Montants proposés">
                {data.presetsCents.map((cents, i) => (
                  <button
                    key={cents}
                    type="button"
                    disabled={busy}
                    onClick={() => {
                      setSelected(cents);
                      setCustom("");
                    }}
                    aria-pressed={!customEntered && selected === cents}
                    className={`solde-amount ${!customEntered && selected === cents ? "is-active" : ""}`}
                  >
                    {formatCents(cents)}
                    <small>{i === 0 ? "Pour essayer" : i === 1 ? "Crédit pratique" : "Plus de marge"}</small>
                  </button>
                ))}
              </div>

              <form
                className="solde-custom"
                onSubmit={(event) => {
                  event.preventDefault();
                  if (customValid) void topup();
                }}
              >
                <label className="flex-1" htmlFor="marketing-topup-custom">
                  Ou saisissez votre montant
                </label>
                <input
                  id="marketing-topup-custom"
                  inputMode="decimal"
                  value={custom}
                  onChange={(event) => setCustom(event.target.value)}
                  placeholder="25,00"
                  disabled={busy}
                />
                <span>€</span>
              </form>
              <p className="min-h-[14px] text-[11px] text-[var(--danger)]" role="status">
                {customEntered && !customValid
                  ? `Choisissez un montant entre ${formatCents(data.minTopupCents)} et ${formatCents(data.maxTopupCents)}.`
                  : ""}
              </p>

              <Button type="button" className="mt-1 w-full" disabled={busy || !amountValid} onClick={() => void topup()}>
                {busy ? "…" : `Recharger ${amountValid ? formatCents(amountToCharge) : ""} →`}
              </Button>
              <p className="mt-2 text-center text-[11px] text-[var(--muted)]">
                Vous verrez le montant final avant de confirmer sur Stripe.
              </p>
            </>
          )}
        </section>
      </div>

      {data.testMode ? (
        <div className="solde-test-callout">
          <span className="solde-spark" aria-hidden>
            ◇
          </span>
          <span>
            <b className="text-[var(--ink)]">Vous êtes en mode test.</b> Aucun paiement réel n&apos;est prélevé. Les campagnes payées sont
            simulées et ce solde reste séparé du solde réel.
          </span>
        </div>
      ) : null}

      {notice ? <p className="text-sm text-[var(--muted-strong)]">{notice}</p> : null}
      {error ? <p className="text-sm text-[var(--danger)]">{error}</p> : null}
      <p className="text-xs text-[var(--muted)]">
        Paiement sécurisé par Stripe. Le crédit est confirmé uniquement après la validation du paiement par Stripe (webhook signé) —
        jamais par cette page de retour seule.
      </p>

      <div className="solde-below-grid">
        <section className="card" style={{ padding: "24px 28px" }} aria-labelledby="history-title">
          <div className="solde-history-header">
            <h2 id="history-title" className="text-lg font-bold text-[var(--ink)]">
              Historique
            </h2>
            <div className="solde-filters" role="group" aria-label="Filtrer l'historique">
              <button type="button" className={`solde-filter ${filter === "all" ? "is-active" : ""}`} onClick={() => setFilter("all")}>
                Tout
              </button>
              <button
                type="button"
                className={`solde-filter ${filter === "topup" ? "is-active" : ""}`}
                onClick={() => setFilter("topup")}
              >
                Recharges
              </button>
              <button
                type="button"
                className={`solde-filter ${filter === "debit" ? "is-active" : ""}`}
                onClick={() => setFilter("debit")}
              >
                Envois
              </button>
            </div>
          </div>

          {groupedHistory.length === 0 ? (
            <p className="py-7 text-center text-sm text-[var(--muted-strong)]">Aucune opération dans cette catégorie.</p>
          ) : (
            groupedHistory.map(([dateKey, entries]) => (
              <div key={dateKey}>
                <p className="solde-history-date">{dateKey}</p>
                {entries.map((entry) => {
                  const isPlus = entry.type !== "DEBIT" && entry.status === "PAID";
                  const isNeutral = entry.type !== "DEBIT" && entry.status !== "PAID";
                  const sign = entry.type === "DEBIT" ? "−" : isPlus ? "+" : "";
                  return (
                    <div key={entry.id} className="solde-transaction">
                      <div className={`solde-t-icon ${entry.type === "DEBIT" ? "is-minus" : "is-plus"}`} aria-hidden>
                        ↗
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-[var(--ink)]">{ledgerLabel(entry)}</p>
                        <p className="text-xs text-[var(--muted)]">
                          {formatDate(entry.createdAt)}
                          {entry.type === "DEBIT" && entry.campaignStatus === "PARTIALLY_SENT" ? " · livraison partielle" : ""}
                          {entry.type === "DEBIT" && entry.campaignStatus === "FAILED" ? " · envoi échoué" : ""}
                          {entry.type === "DEBIT" && entry.campaignStatus === "SCHEDULED" ? " · programmé" : ""}
                          {isNeutral ? ` · ${entry.status === "PENDING" ? "en attente" : entry.status === "FAILED" ? "échouée" : "annulée"}` : ""}
                        </p>
                      </div>
                      <strong className={`solde-t-value whitespace-nowrap text-sm ${isPlus ? "is-plus" : "text-[var(--ink)]"}`}>
                        {sign}
                        {formatCents(entry.amountCents)}
                      </strong>
                    </div>
                  );
                })}
              </div>
            ))
          )}
        </section>

        <section className="card" style={{ padding: "24px 28px" }} aria-labelledby="prices-title">
          <p className="solde-card-label">Bon à savoir</p>
          <h2 id="prices-title" className="mt-1 text-lg font-bold text-[var(--ink)]">
            Tarifs des envois
          </h2>
          <p className="mb-3 mt-1 text-xs text-[var(--muted-strong)]">Un prix fixe par envoi, quel que soit le nombre de destinataires.</p>
          <div className="solde-price-row">
            <span>Notification à vos membres</span>
            <b>{formatCents(CAMPAIGN_PRICE_CENTS.MEMBER_NOTIFICATION)}</b>
          </div>
          <div className="solde-price-row">
            <span>Notification dans votre secteur</span>
            <b>{formatCents(CAMPAIGN_PRICE_CENTS.NETWORK_NOTIFICATION)}</b>
          </div>
          <div className="solde-price-row">
            <span>E-mail à vos membres</span>
            <b>{formatCents(CAMPAIGN_PRICE_CENTS.MEMBER_EMAIL)}</b>
          </div>
          <div className="solde-price-row">
            <span>E-mail aux prospects</span>
            <b>{formatCents(CAMPAIGN_PRICE_CENTS.NETWORK_EMAIL)}</b>
          </div>
          <p className="mt-3 text-[11px] leading-relaxed text-[var(--muted)]">
            Les envois inclus dans votre quota restent gratuits. <b className="text-[var(--muted-strong)]">Les mises en avant</b> affichent
            leur prix horaire au moment de la programmation.
          </p>
        </section>
      </div>
    </div>
  );
}
