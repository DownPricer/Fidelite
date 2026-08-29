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
    <main className="mx-auto flex min-h-dvh max-w-md flex-col justify-center px-6 py-10">
      <BrandMark />
      <h1 className="mt-8 text-3xl font-semibold">{title}</h1>
      <Card className="mt-6">
        <form className="space-y-4" onSubmit={onSubmit}>
          {error ? <Alert>{error}</Alert> : null}
          <Field label="E-mail">
            <Input name="email" type="email" autoComplete="username" required />
          </Field>
          <Field label="Mot de passe">
            <Input name="password" type="password" autoComplete="current-password" required />
          </Field>
          <Button className="w-full" disabled={pending}>
            {pending ? "Connexion…" : "Se connecter"}
          </Button>
        </form>
      </Card>
    </main>
  );
}
