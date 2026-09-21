"use client";

import Link from "next/link";
import { PasswordSection } from "./password-section";

function SectionLabel({ children }: { children: string }) {
  return <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--violet-bright)]">{children}</p>;
}

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
    <div className="space-y-8">
      <section className="space-y-3">
        <SectionLabel>Identité</SectionLabel>
        <div className="glass-panel p-5">
          <h2 className="text-xl font-black text-[var(--ink)]">{merchantName}</h2>
          <p className="mt-1 text-xs text-[var(--muted)]">Nom, logo et couleur principale</p>
          <p className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--muted-strong)]">
            <svg viewBox="0 0 24 24" width={14} height={14} fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <rect x="5" y="11" width="14" height="9" rx="2" />
              <path d="M8 11V7a4 4 0 018 0v4" strokeLinecap="round" />
            </svg>
            Pour modifier ces informations, contactez Fidelo.
          </p>
        </div>
      </section>

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

      <section className="space-y-3">
        <SectionLabel>Sécurité</SectionLabel>
        <div className="glass-panel p-5">
          <p className="mb-4 text-sm text-[var(--muted-strong)]">
            Choisissez un mot de passe d&apos;au moins 8 caractères que vous n&apos;utilisez pas ailleurs.
          </p>
          <PasswordSection demo={demo} />
        </div>
      </section>
    </div>
  );
}
