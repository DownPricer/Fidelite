"use client";

import { useState } from "react";
import { Alert, Button, Card, Field, Input } from "@/components/ui";

export default function SuperAdminLoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/super-admin/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: form.get("email"),
        password: form.get("password"),
      }),
    });
    const data = await response.json();
    setLoading(false);
    if (!response.ok) {
      setError(data.error ?? "Connexion impossible.");
      return;
    }
    window.location.href = "/super-admin";
  }

  return (
    <div className="grid min-h-dvh place-items-center bg-[var(--void)] px-4">
      <Card className="w-full max-w-md p-6 sm:p-8">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--violet-bright)]">Accès restreint</p>
        <h1 className="mt-2 text-2xl font-black tracking-tight text-[var(--ink)]">Super-administration Fife Life</h1>
        <p className="mt-2 text-sm text-[var(--muted-text)]">
          Connexion réservée aux comptes autorisés. Toutes les tentatives sont journalisées.
        </p>
        {error ? <div className="mt-4"><Alert>{error}</Alert></div> : null}
        <form className="mt-6 space-y-4" onSubmit={(event) => void onSubmit(event)}>
          <Field label="E-mail">
            <Input name="email" type="email" autoComplete="username" required />
          </Field>
          <Field label="Mot de passe">
            <Input name="password" type="password" autoComplete="current-password" required />
          </Field>
          <Button className="w-full" disabled={loading}>
            {loading ? "Connexion…" : "Se connecter"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
