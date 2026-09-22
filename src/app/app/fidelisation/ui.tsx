"use client";

import { ToolCard } from "@/components/merchant/merchant-ui";

/** Programme de fidélité et avantages (Partie 4) — séparé de Paramètres et de Campagnes. */
export function FidelisationPanel({
  programSummary,
  activeRewardsCount,
}: {
  programSummary: string;
  activeRewardsCount: number;
}) {
  return (
    <div className="space-y-6">
      <article className="glass-panel p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--violet-bright)]">
              Programme actuel
            </p>
            <p className="mt-2 text-lg font-black text-[var(--ink)]">{programSummary}</p>
            <p className="mt-1 text-sm text-[var(--muted-strong)]">
              Chaque passage rapproche votre client de sa prochaine récompense.
            </p>
          </div>
        </div>
      </article>

      <div className="tool-cards-grid">
        <ToolCard
          href="/app/parametres/avantages"
          title="Gérer les avantages"
          hint={`${activeRewardsCount} avantage${activeRewardsCount > 1 ? "s" : ""} actif${activeRewardsCount > 1 ? "s" : ""}`}
          icon={
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M20 12v9H4v-9M2 7h20v5H2V7zM12 22V7M12 7H7.5a2.5 2.5 0 010-5C11 2 12 7 12 7zM12 7h4.5a2.5 2.5 0 000-5C13 2 12 7 12 7z" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          }
        />
        <ToolCard
          href="/app/parametres/programme"
          title="Modifier le programme"
          hint="Objectif, règle et publication"
          icon={
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          }
        />
      </div>
    </div>
  );
}
