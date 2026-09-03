"use client";

import Link from "next/link";
import { useEffect } from "react";
import { Button } from "@/components/ui";

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[app]", error);
  }, [error]);

  return (
    <main className="obsidian-scene flex min-h-dvh flex-col items-center justify-center px-6 py-12 text-center">
      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--violet-bright)]">Espace commerçant</p>
      <h1 className="mt-3 text-2xl font-black text-[var(--ink)]">Impossible d&apos;afficher cette page</h1>
      <p className="mt-3 max-w-md text-sm leading-relaxed text-[var(--muted-strong)]">
        La base de données est peut-être indisponible ou une migration est en attente. Redémarrez le serveur de
        développement, puis exécutez{" "}
        <code className="rounded bg-white/10 px-1.5 py-0.5 text-xs">npm run db:migrate</code>.
      </p>
      <p className="mt-2 text-xs text-[var(--muted)]">
        En développement sans connexion : ajoutez{" "}
        <code className="rounded bg-white/10 px-1.5 py-0.5">?demo=1</code> à l&apos;URL.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button onClick={() => reset()}>Réessayer</Button>
        <Link href="/app/enter-demo" className="inline-flex h-10 items-center rounded-xl border border-white/15 px-4 text-sm font-bold text-[var(--ink-soft)]">
          Mode démo
        </Link>
        <Link href="/app/connexion" className="inline-flex h-10 items-center rounded-xl px-4 text-sm font-bold text-[var(--muted)]">
          Connexion
        </Link>
      </div>
    </main>
  );
}
