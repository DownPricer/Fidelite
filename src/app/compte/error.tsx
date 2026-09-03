"use client";

import Link from "next/link";

export default function CompteError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="obsidian-scene flex min-h-dvh items-center justify-center px-6 text-center text-[var(--ink-soft)]">
      <div className="glass-panel max-w-sm p-8">
        <h1 className="text-lg font-bold text-[var(--ink)]">Profil indisponible</h1>
        <p className="mt-3 text-sm text-[var(--muted-strong)]">
          {error.message.includes("P1001") || error.message.includes("connect")
            ? "La base de données n'est pas accessible. Démarrez PostgreSQL puis relancez l'application."
            : error.message.includes("column") || error.message.includes("CustomerPreferences")
              ? "La base de données doit être migrée. Exécutez : npm run db:migrate"
              : "Une erreur empêche le chargement du profil."}
        </p>
        <div className="mt-6 flex flex-col gap-2">
          <button type="button" className="profile-btn-primary px-4 py-3 text-sm" onClick={reset}>
            Réessayer
          </button>
          <Link href="/carte?demo=1" className="profile-btn-secondary px-4 py-3 text-sm">
            Ouvrir le wallet démo
          </Link>
          <Link href="/carte" className="text-xs text-[var(--violet-bright)] underline">
            Retour au portefeuille
          </Link>
        </div>
      </div>
    </main>
  );
}
