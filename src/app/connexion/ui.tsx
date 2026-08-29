"use client";

import Link from "next/link";
import { useState } from "react";
import { Alert, BrandMark, Button, Card, Field, Input } from "@/components/ui";

export function CustomerLoginForm() {
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setPending(true);
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: form.get("email"),
        password: form.get("password"),
      }),
    });
    const data = await response.json();
    setPending(false);
    if (!response.ok) {
      setError(data.error ?? "Connexion impossible.");
      return;
    }
    window.location.href = "/carte";
  }

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center bg-[var(--navy)] px-6 py-12 text-[var(--navy-text)] lg:py-24">
      <div className="w-full max-w-[440px]">
        <div className="mb-10 flex flex-col items-center text-center">
          <BrandMark className="mb-8 scale-110 [&_span]:text-[var(--navy-text)]" />
          <h1 className="text-3xl font-black tracking-tight text-[var(--navy-text)]">Espace Client</h1>
          <p className="mt-2 font-medium italic text-[var(--navy-text)]/80">Consultez vos points et récompenses.</p>
        </div>

        <Card className="border border-[var(--border)] p-10 shadow-premium">
          <form className="space-y-6" onSubmit={onSubmit}>
            {error ? <Alert>{error}</Alert> : null}
            <Field label="Adresse e-mail">
              <Input name="email" type="email" autoComplete="email" required placeholder="jean@exemple.fr" />
            </Field>
            <Field label="Mot de passe">
              <Input name="password" type="password" autoComplete="current-password" required placeholder="••••••••" />
            </Field>
            <Button className="w-full py-4 text-base" disabled={pending}>
              {pending ? "Connexion en cours..." : "Voir ma carte fidélité"}
            </Button>
          </form>
        </Card>
        
        <div className="mt-8 rounded-2xl border border-[var(--navy-text)]/20 bg-[var(--navy-text)]/10 p-6 text-center backdrop-blur-sm">
          <p className="text-sm font-bold leading-relaxed italic text-[var(--navy-text)]/85">
            Pas encore de carte ? Scannez le QR code en magasin ou testez notre{" "}
            <Link href="/c/cafe-demo" className="font-black not-italic text-[var(--teal)] hover:underline">
              Café Démo
            </Link>
            .
          </p>
        </div>
      </div>
    </main>
  );
}
