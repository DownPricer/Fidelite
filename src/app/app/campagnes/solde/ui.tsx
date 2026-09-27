"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui";
import { CAMPAIGN_PRICE_CENTS } from "@/lib/campaign-prices";
import {
  DEMO_BALANCE,
  formatCents,
  formatDate,
  ledgerLabel,
  startTopup,
  type BalanceData,
} from "../ui";

/**
 * Page dédiée au solde marketing (Partie 15) : recharge, historique complet et informations de
 * paiement. Un résumé compact reste visible dans la page Campagnes, qui renvoie ici via « Recharger ».
 */
export function SoldeMarketingPanel({ demo = false }: { demo?: boolean }) {
  const [data, setData] = useState<BalanceData | null>(demo ? DEMO_BALANCE : null);
  const [custom, setCustom] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

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

  if (!data) {
    return (
      <section className="glass-panel p-5 sm:p-6">
        <p className="text-sm text-[var(--muted-strong)]">Chargement du solde…</p>
      </section>
    );
  }

  const customCents = Math.round(Number(custom.replace(",", ".")) * 100);
  const customValid = Number.isFinite(customCents) && customCents >= data.minTopupCents && customCents <= data.maxTopupCents;

  async function topup(cents: number) {
    if (demo) return;
    setBusy(true);
    setError(null);
    await startTopup(cents, setError);
    setBusy(false);
  }

  return (
    <div className="space-y-4">
      <section className="glass-panel space-y-4 p-5 sm:p-6" aria-label="Solde marketing">
        {data.testMode ? (
          <p className="rounded-lg border border-[var(--line)] px-3 py-2 text-sm font-bold text-[var(--violet-bright)]">
            Paiements de test — aucun vrai paiement n&apos;est encaissé et les campagnes payées sont simulées (aucun
            envoi réel). Ce solde de test est distinct du solde réel.
          </p>
        ) : null}
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--violet-bright)]">Solde marketing</p>
            <p className="mt-1 text-3xl font-black text-[var(--ink)]">{formatCents(data.balanceCents)}</p>
            <p className="text-xs text-[var(--muted-strong)]">
              Débité à chaque envoi payant : notification membres {formatCents(CAMPAIGN_PRICE_CENTS.MEMBER_NOTIFICATION)},
              secteur {formatCents(CAMPAIGN_PRICE_CENTS.NETWORK_NOTIFICATION)}, e-mail membres{" "}
              {formatCents(CAMPAIGN_PRICE_CENTS.MEMBER_EMAIL)}, e-mail prospects{" "}
              {formatCents(CAMPAIGN_PRICE_CENTS.NETWORK_EMAIL)} — prix fixes, quel que soit le nombre de destinataires.
              La mise en avant est facturée à l&apos;heure (voir le détail au moment de la programmation).
            </p>
          </div>
          {data.paymentsAvailable === false ? (
            <p className="max-w-xs text-xs text-[var(--muted)]">Recharge indisponible pour ce commerce en mode actuel.</p>
          ) : null}
        </div>

        <div className={`flex flex-wrap items-center gap-2 ${data.paymentsAvailable === false ? "hidden" : ""}`}>
          {data.presetsCents.map((cents) => (
            <Button key={cents} type="button" variant="secondary" disabled={busy} onClick={() => void topup(cents)}>
              +{formatCents(cents)}
            </Button>
          ))}
        </div>

        <form
          className={`flex flex-wrap items-center gap-2 ${data.paymentsAvailable === false ? "hidden" : ""}`}
          onSubmit={(event) => {
            event.preventDefault();
            if (customValid) void topup(customCents);
          }}
        >
          <label className="text-xs text-[var(--muted)]" htmlFor="marketing-topup-custom">
            Autre montant (min. {formatCents(data.minTopupCents)})
          </label>
          <input
            id="marketing-topup-custom"
            inputMode="decimal"
            value={custom}
            onChange={(event) => setCustom(event.target.value)}
            placeholder="25"
            className="w-24 rounded-lg border border-[var(--line)] bg-transparent px-2 py-1 text-sm"
          />
          <span className="text-sm text-[var(--muted)]">€</span>
          <Button type="submit" disabled={busy || !customValid}>
            Recharger
          </Button>
        </form>

        {notice ? <p className="text-sm text-[var(--muted-strong)]">{notice}</p> : null}
        {error ? <p className="text-sm text-[var(--danger)]">{error}</p> : null}

        <p className="text-xs text-[var(--muted)]">
          Paiement sécurisé par Stripe. Le crédit est confirmé uniquement après la validation du paiement par Stripe
          (webhook signé) — jamais par cette page de retour seule.
        </p>
      </section>

      <section className="glass-panel space-y-2 p-5 sm:p-6" aria-label="Historique du solde marketing">
        <p className="text-xs font-bold uppercase tracking-[0.15em] text-[var(--muted)]">Historique</p>
        {data.history.length > 0 ? (
          <ul className="divide-y divide-[var(--line)]">
            {data.history.map((entry) => {
              const sign = entry.type === "DEBIT" ? "−" : entry.status === "PAID" ? "+" : "";
              return (
                <li key={entry.id} className="flex items-center justify-between gap-3 py-2 text-sm">
                  <span>
                    <span className="font-semibold text-[var(--ink)]">{ledgerLabel(entry)}</span>
                    <span className="block text-xs text-[var(--muted)]">
                      {formatDate(entry.createdAt)}
                      {entry.type === "DEBIT" && entry.campaignStatus === "PARTIALLY_SENT" ? " · livraison partielle" : ""}
                      {entry.type === "DEBIT" && entry.campaignStatus === "FAILED" ? " · envoi échoué" : ""}
                      {entry.type === "DEBIT" && entry.campaignStatus === "SCHEDULED" ? " · programmé" : ""}
                    </span>
                  </span>
                  <strong className="text-[var(--ink)]">
                    {sign}
                    {formatCents(entry.amountCents)}
                  </strong>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="text-sm text-[var(--muted-strong)]">Aucun mouvement pour l&apos;instant.</p>
        )}
      </section>
    </div>
  );
}
