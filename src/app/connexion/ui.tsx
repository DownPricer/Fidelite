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
    <main className="min-h-dvh bg-surface flex flex-col items-center justify-center px-6 py-12 lg:py-24">
      <div className="w-full max-w-[440px]">
        <div className="flex flex-col items-center text-center mb-10">
          <BrandMark className="mb-8 scale-110" />
          <h1 className="text-3xl font-black tracking-tight">Espace Client</h1>
          <p className="mt-2 text-muted font-medium italic">Consultez vos points et récompenses.</p>
        </div>

        <Card className="p-10 shadow-premium border border-border/50">
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
        
        <div className="mt-8 text-center bg-white/50 backdrop-blur-sm rounded-2xl p-6 border border-border/50">
          <p className="text-sm font-bold text-muted leading-relaxed italic">
            Pas encore de carte ? Scannez le QR code en magasin ou testez notre{" "}
            <Link href="/c/cafe-demo" className="text-primary hover:underline font-black not-italic">
              Café Démo
            </Link>
            .
          </p>
        </div>
      </div>
    </main>
  );
}
