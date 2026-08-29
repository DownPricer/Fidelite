"use client";

import Link from "next/link";
import { useState } from "react";
import { Alert, BrandMark, Button, Card, Field } from "@/components/ui";

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
    <main className="min-h-dvh bg-surface text-ink">
      <div className="mx-auto max-w-3xl px-6 py-10">
        <header className="flex items-center justify-between gap-6 border-b border-border/60 pb-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted/70">Mon compte</p>
            <h1 className="mt-1 text-2xl font-black tracking-tight">{firstName}</h1>
            <p className="text-sm text-muted">{email}</p>
          </div>
          <div className="hidden sm:block">
            <BrandMark />
          </div>
        </header>

        <section className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,1.5fr)]">
          {/* Profil & actions */}
          <Card>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted/70">Profil</p>
                <p className="mt-2 text-lg font-semibold">{firstName}</p>
                <p className="text-sm text-muted">{email}</p>
              </div>
              <Link href="/carte" className="text-xs font-semibold text-primary underline underline-offset-4">
                Voir ma carte
              </Link>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <Button
                variant="secondary"
                onClick={() => void logout()}
                className="w-full"
              >
                Se déconnecter
              </Button>
              <Link
                href="/mot-de-passe"
                className="inline-flex items-center justify-center rounded-xl border border-border bg-white px-4 py-3 text-sm font-semibold text-ink hover:bg-slate-50"
              >
                Changer mon mot de passe
              </Link>
            </div>
          </Card>

          {/* Zone suppression – discrète et séparée */}
          <Card className="bg-surface border-dashed border-border/80">
            <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-muted">Suppression du compte</h2>
            <p className="mt-2 text-sm text-muted">
              Votre demande sera transmise à FifeLite. Nous traiterons la suppression de vos données dans les meilleurs délais.
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
                    className="min-h-24 w-full rounded-xl border border-border px-4 py-3 text-sm text-ink outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
                  />
                </Field>
                <Button variant="danger" className="w-full">
                  Demander la suppression
                </Button>
              </form>
            )}
          </Card>
        </section>
      </div>
    </main>
  );
}
