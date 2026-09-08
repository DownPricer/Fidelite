"use client";

import Link from "next/link";
import { useState } from "react";
import { Alert, BrandMark, Button, Card, Field, Input, PasswordInput } from "./ui";

async function readApiJson(response: Response) {
  const text = await response.text();
  if (!text) return {};
  try {
    return JSON.parse(text) as { error?: string; user?: { memberships?: Array<{ role?: string }> } };
  } catch {
    return {};
  }
}

export function StaffLogin({
  title,
  nextPath,
  demoHref,
  otherSpaces,
}: {
  title: string;
  nextPath: string;
  demoHref?: string;
  otherSpaces?: Array<{ label: string; href: string }>;
}) {
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError(null);
    const form = new FormData(event.currentTarget);
    try {
      const response = await fetch("/api/auth/login", {
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

      const meRes = await fetch("/api/auth/me");
      const meData = await readApiJson(meRes);
      const staffRole = meData.user?.memberships?.[0]?.role;
      window.location.href = staffRole === "EMPLOYEE" ? "/app/caisse" : nextPath;
    } catch {
      setError("Connexion impossible. Vérifiez votre connexion réseau.");
    } finally {
      setPending(false);
    }
  }

  return (
    <main className="login-scene obsidian-scene flex min-h-dvh flex-col items-center justify-center px-5 py-10 sm:px-6 sm:py-12">
      <div className="w-full max-w-[440px]">
        <div className="mb-8 flex flex-col items-center text-center sm:mb-10">
          <BrandMark className="mb-6 scale-110 sm:mb-8" />
          <h1 className="text-2xl font-black tracking-tight text-[var(--ink)] sm:text-3xl">{title}</h1>
          <p className="mt-2 text-sm font-medium italic text-[var(--muted-strong)] sm:text-base">
            Accédez à votre espace de gestion.
          </p>
        </div>

        <Card className="glass-panel border-0 p-6 shadow-none sm:p-10">
          <form className="space-y-5 sm:space-y-6" onSubmit={(event) => void onSubmit(event)}>
            {error ? <Alert>{error}</Alert> : null}
            <Field label="Adresse e-mail">
              <Input name="email" type="email" autoComplete="username" required placeholder="nom@exemple.fr" />
            </Field>
            <Field label="Mot de passe">
              <PasswordInput name="password" autoComplete="current-password" required placeholder="••••••••" />
            </Field>
            <Button type="submit" className="w-full py-4 text-base" disabled={pending}>
              {pending ? "Connexion en cours..." : "Accéder à mon compte"}
            </Button>
          </form>

          {demoHref ? (
            <div className="mt-6 border-t border-white/10 pt-6 text-center">
              <p className="text-xs text-[var(--muted)]">Sans compte ? Explorez l&apos;application en mode démo.</p>
              <Link
                href={demoHref}
                className="mt-2 inline-flex text-sm font-bold text-[var(--violet-bright)] hover:underline"
              >
                Voir les démos →
              </Link>
            </div>
          ) : null}
        </Card>

        {otherSpaces?.length ? (
          <nav className="mt-6 text-center text-xs font-bold uppercase tracking-[0.18em] text-[var(--muted)]">
            <p className="mb-3">Autres espaces</p>
            <div className="flex flex-wrap justify-center gap-x-5 gap-y-2">
              {otherSpaces.map((space) => (
                <Link
                  key={space.href}
                  href={space.href}
                  className="text-[var(--violet-bright)] hover:underline normal-case tracking-normal"
                >
                  {space.label}
                </Link>
              ))}
            </div>
          </nav>
        ) : null}

        <p className="mt-8 text-center text-xs font-bold uppercase tracking-[0.2em] text-[var(--muted)] sm:mt-10">
          Fife Life
        </p>
      </div>
    </main>
  );
}
