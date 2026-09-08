"use client";

import { useState } from "react";
import { Alert, Button, Card, EmployeeBrandMark, Field, Input, PasswordInput } from "@/components/ui";

async function readApiJson(response: Response) {
  const text = await response.text();
  if (!text) return {};
  try {
    return JSON.parse(text) as { error?: string };
  } catch {
    return {};
  }
}

export function EmployeeLoginScreen({
  initialError,
  demoHref,
}: {
  initialError?: string;
  demoHref?: string;
} = {}) {
  const [error, setError] = useState<string | null>(initialError ?? null);
  const [pending, setPending] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    setPending(true);
    setError(null);
    const form = new FormData(event.currentTarget);
    try {
      const response = await fetch("/api/employe/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.get("email"),
          password: form.get("password"),
        }),
      });
      const data = await readApiJson(response);
      if (!response.ok) {
        setError(data.error ?? "Connexion impossible.");
        return;
      }
      window.location.href = "/employe/scan";
    } catch {
      setError("Erreur réseau. Vérifiez votre connexion.");
    } finally {
      setPending(false);
    }
  }

  return (
    <main className="login-scene obsidian-scene flex min-h-dvh flex-col items-center justify-center px-5 py-10">
      <div className="w-full max-w-[390px]">
        <div className="mb-8 flex flex-col items-center text-center">
          <EmployeeBrandMark className="mb-4" />
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--muted)]">Fife Life Employé</p>
          <h1 className="mt-2 text-2xl font-black tracking-tight text-[var(--ink)]">Connexion</h1>
        </div>

        <Card className="glass-panel border-0 p-6 shadow-none sm:p-8">
          <form className="space-y-5" onSubmit={(event) => void onSubmit(event)}>
            {error ? <Alert>{error}</Alert> : null}
            <Field label="Adresse e-mail">
              <Input
                name="email"
                type="email"
                autoComplete="username"
                required
                placeholder="nom@exemple.fr"
                disabled={pending}
              />
            </Field>
            <Field label="Mot de passe">
              <PasswordInput
                name="password"
                autoComplete="current-password"
                required
                placeholder="••••••••"
                disabled={pending}
              />
            </Field>
            <Button type="submit" className="w-full py-4 text-base" disabled={pending}>
              {pending ? "Connexion..." : "Se connecter"}
            </Button>
          </form>

          {demoHref ? (
            <div className="mt-6 border-t border-white/10 pt-6 text-center">
              <p className="text-xs text-[var(--muted)]">Mode démonstration local</p>
              <a href={demoHref} className="mt-2 inline-flex text-sm font-bold text-[var(--violet-bright)] hover:underline">
                Ouvrir la démo employé →
              </a>
            </div>
          ) : null}
        </Card>
      </div>
    </main>
  );
}
