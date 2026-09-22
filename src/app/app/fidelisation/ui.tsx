"use client";

import Link from "next/link";

function SectionLabel({ children }: { children: string }) {
  return <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--violet-bright)]">{children}</p>;
}

/** Programme de fidélité et avantages (Partie 4) — séparé de Paramètres et de Campagnes. */
export function FidelisationPanel({ programSummary }: { programSummary: string }) {
  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <SectionLabel>Programme de fidélité</SectionLabel>
        <div className="space-y-3">
          {[
            ["Programme de fidélité", "/app/parametres/programme", programSummary],
            ["Avantages", "/app/parametres/avantages", "Créer, modifier et archiver les avantages"],
          ].map(([title, href, subtitle]) => (
            <Link
              key={href}
              href={href}
              className="flex items-center justify-between gap-4 rounded-2xl border border-[var(--violet)]/35 bg-[rgba(133,87,255,0.12)] p-5 transition hover:bg-[rgba(133,87,255,0.18)]"
            >
              <div className="min-w-0">
                <h3 className="text-lg font-black text-[var(--ink)]">{title}</h3>
                <p className="mt-1 truncate text-sm text-[var(--muted-strong)]">{subtitle}</p>
              </div>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-5 w-5 shrink-0 text-[var(--violet-bright)]">
                <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
