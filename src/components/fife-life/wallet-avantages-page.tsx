"use client";

import Link from "next/link";
import { Suspense } from "react";
import { SponsoredSlot } from "./sponsored-slot";
import { WalletBottomNav } from "./wallet-bottom-nav";
import { WalletMotionRoot } from "./wallet-motion-root";
import type { CardNextRewardEntry } from "@/lib/customer-loyalty-overview";

export function WalletAvantagesPage({
  preview = false,
  cardRewards,
}: {
  preview?: boolean;
  cardRewards: CardNextRewardEntry[];
}) {
  const available = cardRewards.flatMap((entry) =>
    entry.availableReward
      ? [
          {
            key: `${entry.membershipId ?? entry.cardKey}-avail`,
            name: entry.availableReward.rewardName,
            merchant: entry.availableReward.merchantName,
          },
        ]
      : [],
  );
  const upcoming = cardRewards.flatMap((entry) =>
    (entry.currentRewards ?? []).map((reward) => ({
      key: `${entry.membershipId ?? entry.cardKey}-${reward.rewardName}-${reward.progressTarget}`,
      label: `${reward.rewardName} · ${reward.merchantName}`,
      detail: `${reward.progressTarget} ${reward.unit}`,
    })),
  );

  return (
    <WalletMotionRoot>
      <main className="wallet-shell fife-page-shell obsidian-scene flex w-full flex-col px-5 pb-8 pt-3">
        <header className="relative z-50 mb-4 flex items-center justify-between">
          <Link
            href={preview ? "/carte?demo=1" : "/carte"}
            className="back-btn-glassy grid h-10 w-10 place-items-center rounded-full text-sm"
            aria-label="Retour au portefeuille"
          >
            ←
          </Link>
          <h1 className="text-sm font-bold uppercase tracking-[0.18em] text-[var(--ink)]">Avantages</h1>
          <div className="w-10" aria-hidden />
        </header>

        {!preview ? (
          <section className="mb-4" aria-label="Offre sponsorisée">
            <SponsoredSlot placement="WALLET_HOME" />
          </section>
        ) : null}

        <section className="glass-panel flex flex-col gap-4 p-4">
          <div>
            <h2 className="section-title">Mes avantages</h2>
            <p className="mt-1 text-xs text-[var(--muted-strong)]">
              Récompenses disponibles et prochaines étapes sur vos cartes Fideto.
            </p>
          </div>
          {available.length ? (
            <ul className="space-y-2" data-testid="avantages-available-list">
              {available.map((item) => (
                <li
                  key={item.key}
                  className="rounded-2xl border border-[light-dark(rgba(122,69,242,0.14),rgba(255,255,255,0.1))] bg-[light-dark(rgba(255,255,255,0.6),rgba(255,255,255,0.05))] px-3 py-2.5"
                >
                  <p className="text-sm font-semibold text-[var(--ink)]">{item.name}</p>
                  <p className="text-xs text-[var(--muted)]">{item.merchant}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-[var(--muted-strong)]">Aucun avantage disponible pour le moment.</p>
          )}
          {upcoming.length ? (
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--muted)]">Prochaines récompenses</p>
              <ul className="mt-2 space-y-1 text-xs text-[var(--ink-soft)]">
                {upcoming.map((item) => (
                  <li key={item.key}>
                    {item.label} · {item.detail}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </section>

        <Suspense fallback={null}>
          <WalletBottomNav demo={preview} />
        </Suspense>
      </main>
    </WalletMotionRoot>
  );
}
