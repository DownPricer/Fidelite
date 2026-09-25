"use client";

import { Button } from "@/components/ui";

function SectionLabel({ children }: { children: string }) {
  return <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--violet-bright)]">{children}</p>;
}

export function SettingsPanel({
  merchantName,
}: {
  merchantName: string;
}) {
  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/app/connexion";
  }

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
            Pour modifier ces informations, contactez Fideto.
          </p>
        </div>
      </section>

      <section className="space-y-3">
        <SectionLabel>Compte</SectionLabel>
        <div className="glass-panel p-5">
          <h2 className="text-lg font-black text-[var(--ink)]">Session commerçant</h2>
          <p className="mt-1 text-sm text-[var(--muted-strong)]">Fermer la session sur cet appareil.</p>
          <Button variant="secondary" className="mt-4 w-full" onClick={() => void logout()}>
            Se déconnecter
          </Button>
        </div>
      </section>
    </div>
  );
}
