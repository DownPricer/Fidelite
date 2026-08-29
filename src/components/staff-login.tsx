"use client";

import { useState } from "react";
import { Alert, BrandMark, Button, Card, Field, Input } from "./ui";

export function StaffLogin({ title, nextPath }: { title: string; nextPath: string }) {
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError(null);
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
    window.location.href = nextPath;
  }

  return (
    <main className="min-h-dvh bg-surface flex flex-col items-center justify-center px-6 py-12 lg:py-24">
      <div className="w-full max-w-[440px]">
        <div className="flex flex-col items-center text-center mb-10">
          <BrandMark className="mb-8 scale-110" />
          <h1 className="text-3xl font-black tracking-tight">{title}</h1>
          <p className="mt-2 text-muted font-medium italic">Accédez à votre espace de gestion.</p>
        </div>
        
        <Card className="p-10 shadow-premium border border-border/50">
          <form className="space-y-6" onSubmit={onSubmit}>
            {error ? <Alert>{error}</Alert> : null}
            <Field label="Adresse e-mail">
              <Input name="email" type="email" autoComplete="username" required placeholder="nom@exemple.fr" />
            </Field>
            <Field label="Mot de passe">
              <Input name="password" type="password" autoComplete="current-password" required placeholder="••••••••" />
            </Field>
            <Button className="w-full py-4 text-base" disabled={pending}>
              {pending ? "Connexion en cours..." : "Accéder à mon compte"}
            </Button>
          </form>
        </Card>
        
        <p className="mt-10 text-center text-xs font-bold uppercase tracking-[0.2em] text-muted/40">
          FifeLite &bull; SaaS Premium
        </p>
      </div>
    </main>
  );
}
