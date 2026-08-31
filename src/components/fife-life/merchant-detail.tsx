"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { InstallPwa } from "@/components/install-pwa";
import { LinearGauge } from "./linear-gauge";
import { QrBlock } from "./qr-block";
import type { CardHistoryItem, MerchantCardData, WalletEventPayload } from "./types";
import { useWalletEvents } from "./use-wallet-events";

function historyLabel(type: string) {
  if (type === "EARN_VISIT") return "Passage";
  if (type === "REDEEM_REWARD") return "Récompense";
  if (type === "ADJUSTMENT") return "Ajustement";
  return type;
}

export function MerchantCardDetail({
  slug,
  merchant,
  history,
  preview = false,
  walletEnabled = false,
}: {
  slug: string;
  merchant: MerchantCardData;
  history: CardHistoryItem[];
  preview?: boolean;
  walletEnabled?: boolean;
}) {
  const [card, setCard] = useState(merchant);
  const [rows, setRows] = useState(history);
  const [walletBusy, setWalletBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [android, setAndroid] = useState(preview);
  const remaining = Math.max(0, card.visitsRequired - card.points);
  const rewardAvailable = card.points >= card.visitsRequired;

  useEffect(() => {
    setAndroid(preview || /android/i.test(navigator.userAgent));
  }, [preview]);

  const onEvent = useCallback((event: WalletEventPayload) => {
    const match =
      (event.customerMembershipId && event.customerMembershipId === card.id) ||
      (event.merchantId && event.merchantId === card.merchantId);
    if (!match && event.type !== "FIFE_LIFE_POINTS_UPDATED") return;

    if (event.type === "MERCHANT_POINTS_UPDATED" || event.type === "REWARD_REDEEMED") {
      const nextPoints = event.payload.points;
      if (typeof nextPoints === "number") {
        setCard((prev) => ({ ...prev, points: nextPoints }));
      }
      const txId = typeof event.payload.txId === "string" ? event.payload.txId : event.id;
      const delta = typeof event.payload.delta === "number" ? event.payload.delta : 0;
      setRows((prev) => [
        {
          id: txId,
          type: typeof event.payload.type === "string" ? event.payload.type : event.type,
          pointsDelta: delta,
          reason: typeof event.payload.rewardLabel === "string" ? event.payload.rewardLabel : null,
          createdAt: event.createdAt,
        },
        ...prev,
      ]);
    }
  }, [card.id, card.merchantId]);

  useWalletEvents(!preview, onEvent);

  async function addWallet() {
    if (preview) return;
    setWalletBusy(true);
    const response = await fetch("/api/customer/wallet", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug }),
    });
    const data = await response.json();
    setWalletBusy(false);
    if (!response.ok || !data.url) {
      setError("Google Wallet est temporairement indisponible.");
      return;
    }
    window.location.href = data.url;
  }

  return (
    <main className="obsidian-scene min-h-dvh text-[var(--ink-soft)]">
      <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col px-5 pb-8 pt-3">
        <header className="flex shrink-0 items-center justify-between">
          <Link href="/carte" className="text-sm font-semibold text-[var(--muted-strong)]">
            ← Portefeuille
          </Link>
          <Link href="/compte" className="text-sm font-semibold text-[var(--muted)]">
            Compte
          </Link>
        </header>

        <article
          className="mt-4 overflow-hidden rounded-[26px] border border-white/10 p-5 shadow-[0_24px_60px_rgba(0,0,0,0.72)]"
          style={{
            background: `linear-gradient(160deg, color-mix(in srgb, ${card.primaryColor} 42%, #0c0b12) 0%, #0a0910 72%)`,
          }}
        >
          <div className="flex items-center gap-3">
            {card.logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={card.logoUrl} alt="" className="h-12 w-12 rounded-2xl object-cover" />
            ) : (
              <div
                className="grid h-12 w-12 place-items-center rounded-2xl text-lg font-black text-[var(--ink)]"
                style={{ backgroundColor: card.primaryColor }}
              >
                {card.name.slice(0, 1)}
              </div>
            )}
            <div>
              <h1 className="text-xl font-black tracking-tight text-[var(--ink)]">{card.name}</h1>
              <p className="text-xs text-[var(--muted)]">Carte commerçant Fife Life</p>
            </div>
          </div>
          <div className="mt-5">
            <div className="flex items-end justify-between">
              <p className="text-3xl font-black tabular-nums text-[var(--ink)]">
                {card.points}
                <span className="text-base font-bold text-[var(--muted)]"> / {card.visitsRequired}</span>
              </p>
              <p className="max-w-[55%] text-right text-xs font-semibold text-[var(--ink-soft)]">
                {rewardAvailable ? card.rewardLabel : `Encore ${remaining} · ${card.rewardLabel}`}
              </p>
            </div>
            <div className="mt-3">
              <LinearGauge value={card.points} max={card.visitsRequired} />
            </div>
          </div>
        </article>

        <section className="qr-escutcheon mt-5 rounded-[26px] px-5 py-5">
          <QrBlock slug={slug} preview={preview} />
          <p className="mt-3 text-center text-[11px] text-[var(--muted-strong)]">
            Présentez ce QR chez un commerce partenaire.
          </p>
        </section>

        {error ? <p className="mt-2 text-center text-xs font-bold text-[var(--danger)]">{error}</p> : null}

        <section className="mt-5 rounded-[26px] border border-white/10 bg-[var(--surface)] p-5">
          <h2 className="text-sm font-black uppercase tracking-[0.16em] text-[var(--muted)]">Récompenses</h2>
          <p className="mt-2 text-sm text-[var(--ink-soft)]">
            {rewardAvailable
              ? `Récompense disponible : ${card.rewardLabel}`
              : `Prochaine récompense : ${card.rewardLabel} à ${card.visitsRequired} passages.`}
          </p>
        </section>

        <section className="mt-4 rounded-[26px] border border-white/10 bg-[var(--surface)] p-5">
          <h2 className="text-sm font-black uppercase tracking-[0.16em] text-[var(--muted)]">Historique</h2>
          {rows.length === 0 ? (
            <p className="mt-3 text-sm text-[var(--muted)]">Aucun mouvement pour le moment.</p>
          ) : (
            <ul className="mt-3 divide-y divide-white/10">
              {rows.slice(0, 12).map((row) => (
                <li key={row.id} className="flex items-center justify-between py-3 text-sm">
                  <div>
                    <p className="font-semibold text-[var(--ink)]">{historyLabel(row.type)}</p>
                    <p className="text-xs text-[var(--muted)]">
                      {new Date(row.createdAt).toLocaleString("fr-FR", {
                        day: "2-digit",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                      {row.reason ? ` · ${row.reason}` : ""}
                    </p>
                  </div>
                  <span className="font-black tabular-nums text-[var(--ink)]">
                    {row.pointsDelta > 0 ? `+${row.pointsDelta}` : row.pointsDelta}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <div className="mt-5 space-y-3">
          {walletEnabled && android ? (
            <button
              type="button"
              onClick={() => void addWallet()}
              disabled={walletBusy}
              className="flex h-11 w-full items-center justify-center gap-2 rounded-2xl bg-[#1a1824] text-sm font-bold text-[var(--ink)] ring-1 ring-white/10 disabled:opacity-50"
            >
              Google Wallet
            </button>
          ) : null}
          <InstallPwa compact />
        </div>
      </div>
    </main>
  );
}
