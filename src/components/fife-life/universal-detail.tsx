"use client";

import Link from "next/link";
import { GlobalCard } from "./global-card";
import { QrBlock } from "./qr-block";
import type { CardHistoryItem } from "./types";
import { resolveTier } from "./tier";

function historyLabel(type: string) {
  if (type === "EARN_VISIT") return "Passage";
  if (type === "REDEEM_REWARD") return "Récompense";
  if (type === "ADJUSTMENT") return "Ajustement";
  return type;
}

export function UniversalDetail({
  fifeLifePoints,
  history,
  preview = false,
}: {
  fifeLifePoints: number;
  history: CardHistoryItem[];
  preview?: boolean;
}) {
  const tier = resolveTier(fifeLifePoints);

  return (
    <main className="obsidian-scene min-h-dvh text-[var(--ink-soft)]">
      <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col px-5 pb-8 pt-3">
        <header className="flex shrink-0 items-center justify-between">
          <Link href="/carte" className="glass-chip px-3 py-1.5 text-xs font-semibold text-[var(--ink-soft)]">
            ← Portefeuille
          </Link>
          <Link href="/compte" className="text-xs font-semibold text-[var(--muted)]">
            Compte
          </Link>
        </header>

        <div className="mt-5">
          <GlobalCard points={fifeLifePoints} large />
        </div>

        <section className="mt-5 space-y-2 px-1">
          <p className="text-xs font-semibold text-[var(--ink-soft)]">Niveau global · {tier.name}</p>
          <p className="text-[11px] text-[var(--muted-strong)]">
            {tier.nextName == null
              ? "Palier maximum"
              : `${tier.remaining.toLocaleString("fr-FR")} pts avant ${tier.nextName}`}
          </p>
          <p className="text-xs text-[#f0e8d8]">Prochaine récompense · Accès lounge partenaire</p>
        </section>

        <section className="qr-escutcheon mt-6 rounded-[28px] p-5">
          <QrBlock slug="fife-life" preview={preview} />
          <p className="mt-3 text-center text-[11px] text-[var(--muted-strong)]">
            Présentez ce QR chez un commerce partenaire.
          </p>
        </section>

        <section className="mt-5 rounded-[24px] border border-white/10 bg-white/[0.03] p-5">
          <h2 className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--muted)]">Historique récent</h2>
          {history.length === 0 ? (
            <p className="mt-3 text-sm text-[var(--muted)]">Aucun mouvement pour le moment.</p>
          ) : (
            <ul className="mt-3 divide-y divide-white/8">
              {history.slice(0, 8).map((row) => (
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
                  <span className="font-bold tabular-nums text-[var(--ink)]">
                    {row.pointsDelta > 0 ? `+${row.pointsDelta}` : row.pointsDelta}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
}
