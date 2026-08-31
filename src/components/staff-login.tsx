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

    const meRes = await fetch("/api/auth/me");
    const meData = await meRes.json();
    const staffRole = meData.user?.memberships?.[0]?.role;
    window.location.href = staffRole === "EMPLOYEE" ? "/app/caisse" : nextPath;
  }

  return (
    <main className="obsidian-scene flex min-h-dvh flex-col items-center justify-center px-6 py-12 text-[var(--ink)] lg:py-24">
      <div className="w-full max-w-[440px]">
        <div className="mb-10 flex flex-col items-center text-center">
          <BrandMark className="mb-8 scale-110" />
          <h1 className="text-3xl font-black tracking-tight text-[var(--ink)]">{title}</h1>
          <p className="mt-2 font-medium italic text-[var(--muted-strong)]">Accédez à votre espace de gestion.</p>
        </div>

        <Card className="glass-panel border-0 p-10 shadow-none">
          <form className="space-y-6" onSubmit={onSubmit}>
            {error ? <Alert>{error}</Alert> : null}
            <Field label="Adresse e-mail">
              <Input name="email" type="email" autoComplete="username" required placeholder="nom@exemple.fr" />
            </Field>
            <Field label="Mot de passe">
              <Input name="password" type="password" autoComplete="current-password" required placeholder="••••••••" />
            </Field>
            <Button type="submit" className="w-full py-4 text-base" disabled={pending}>
              {pending ? "Connexion en cours..." : "Accéder à mon compte"}
            </Button>
          </form>
        </Card>
        
        <p className="mt-10 text-center text-xs font-bold uppercase tracking-[0.2em] text-[var(--muted)]">
          Fife Life
        </p>
      </div>
    </main>
  );
}
