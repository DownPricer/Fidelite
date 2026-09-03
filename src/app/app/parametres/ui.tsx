"use client";

import Link from "next/link";

export function SettingsPanel({
  merchantName,
  programSummary,
  demo = false,
}: {
  merchantName: string;
  programSummary: string;
  demo?: boolean;
}) {
  return (
    <div className="max-w-2xl space-y-4">
      <div className="glass-panel p-5">
        <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted)]">Commerce</p>
        <h2 className="mt-1 text-xl font-black text-[var(--ink)]">{merchantName}</h2>
        <p className="mt-2 text-sm text-[var(--muted-strong)]">
          Le nom, le logo et la couleur principale sont gérés par l&apos;administrateur Fife Life.
        </p>
      </div>

      <Link
        href="/app/parametres/programme"
        className="flex items-center justify-between gap-4 rounded-2xl border border-[var(--violet)]/35 bg-[rgba(133,87,255,0.12)] p-5 transition hover:bg-[rgba(133,87,255,0.18)]"
      >
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--violet-bright)]">Configuration</p>
          <h3 className="mt-1 text-lg font-black text-[var(--ink)]">Programme de fidélité et avantages</h3>
          <p className="mt-1 text-sm text-[var(--muted-strong)]">{programSummary}</p>
        </div>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-5 w-5 shrink-0 text-[var(--violet-bright)]">
          <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </Link>

      <div className="glass-panel space-y-4 p-5">
        <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted)]">Sécurité et accès</p>
        <Link href="/mot-de-passe" className="flex items-center justify-between text-sm font-semibold text-[var(--ink-soft)]">
          Changer mon mot de passe
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
            <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
      </div>
    </div>
  );
}
