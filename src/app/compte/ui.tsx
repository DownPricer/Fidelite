"use client";

import Link from "next/link";
import { useState } from "react";
import { Alert, BrandMark, Button, Field } from "@/components/ui";

export function AccountPanel({ firstName, email }: { firstName: string; email: string }) {
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function requestDeletion(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/customer/deletion", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: form.get("message") }),
    });
    if (!response.ok) {
      const data = await response.json();
      setError(data.error ?? "Demande impossible.");
      return;
    }
    setDone(true);
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/";
  }

  return (
    <main className="min-h-dvh bg-[var(--void)] text-[var(--ink-soft)]">
      <div className="mx-auto max-w-3xl px-6 py-10">
        <header className="flex items-center justify-between gap-6 border-b border-white/10 pb-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--muted)]">Paramètres</p>
            <h1 className="mt-1 text-2xl font-black tracking-tight text-[var(--ink)]">{firstName}</h1>
            <p className="text-sm text-[var(--muted)]">{email}</p>
          </div>
          <div className="hidden sm:block">
            <BrandMark />
          </div>
        </header>

        <section className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1.5fr)]">
          <section className="rounded-[24px] border border-white/10 bg-[var(--surface)] p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--muted)]">Profil</p>
                <p className="mt-2 text-lg font-semibold text-[var(--ink)]">{firstName}</p>
                <p className="text-sm text-[var(--muted)]">{email}</p>
              </div>
              <Link href="/carte" className="text-xs font-semibold text-[var(--violet-bright)] underline underline-offset-4">
                Voir mon portefeuille
              </Link>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <Button variant="secondary" onClick={() => void logout()} className="w-full">
                Se déconnecter
              </Button>
              <Link
                href="/mot-de-passe"
                className="inline-flex items-center justify-center rounded-xl border border-[var(--stroke)] bg-[var(--surface-raised)] px-4 py-3 text-sm font-semibold text-[var(--ink)] hover:bg-[var(--surface-strong)]"
              >
                Changer mon mot de passe
              </Link>
            </div>
          </section>

          <section className="rounded-[24px] border border-white/10 bg-[var(--surface)] p-8">
            <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
              Suppression du compte
            </h2>
            <p className="mt-2 text-sm text-[var(--muted-strong)]">
              Votre demande sera transmise à Fife Life. Nous traiterons la suppression de vos données dans les meilleurs délais.
            </p>
            {done ? (
              <div className="mt-4">
                <Alert tone="ok">Demande enregistrée.</Alert>
              </div>
            ) : (
              <form className="mt-4 space-y-3" onSubmit={(event) => void requestDeletion(event)}>
                {error ? <Alert>{error}</Alert> : null}
                <Field label="Message (optionnel)">
                  <textarea
                    name="message"
                    className="min-h-24 w-full rounded-xl border border-[var(--stroke)] bg-[var(--surface-raised)] px-4 py-3 text-sm text-[var(--ink)] outline-none focus:border-[var(--violet)] focus:ring-4 focus:ring-[var(--violet)]/20"
                  />
                </Field>
                <Button variant="danger" className="w-full">
                  Demander la suppression
                </Button>
              </form>
            )}
          </section>
        </section>
      </div>
    </main>
  );
}
