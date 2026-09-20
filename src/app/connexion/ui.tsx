"use client";

import Link from "next/link";
import { useState } from "react";
import { AuthSeparator, GoogleAuthButton } from "@/components/google-auth-button";
import { Alert, BrandMark, Button, Field, Input, PasswordInput } from "@/components/ui";

function googleMessage(code: string | null) {
  if (!code) return null;
  const messages: Record<string, { tone: "error" | "ok"; text: string }> = {
    cancelled: { tone: "ok", text: "Connexion Google annulée. Vous pouvez continuer avec votre e-mail." },
    configuration_absente: { tone: "error", text: "La connexion Google n'est pas encore configurée." },
    compte_existant: { tone: "error", text: "Un compte existe déjà avec cet e-mail. Connectez-vous avec votre méthode habituelle." },
    email_non_verifie: { tone: "error", text: "Google ne confirme pas cet e-mail. Utilisez une autre méthode de connexion." },
    email_absent: { tone: "error", text: "Google n'a pas transmis d'e-mail vérifié." },
    state_invalide: { tone: "error", text: "La tentative Google a expiré. Réessayez depuis cette page." },
    consentement_requis: { tone: "error", text: "Acceptez la politique de confidentialité avant de créer un compte." },
    erreur: { tone: "error", text: "Connexion Google impossible pour le moment." },
  };
  return messages[code] ?? messages.erreur;
}

export function CustomerLoginForm({
  googleEnabled,
  googleStatus,
  returnTo,
}: {
  googleEnabled: boolean;
  googleStatus: string | null;
  returnTo: string | null;
}) {
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const google = googleMessage(googleStatus);
  const googleHref = `/api/auth/google/start?flow=login&returnTo=${encodeURIComponent(returnTo || "/carte")}`;

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
    <main className="login-scene obsidian-scene relative flex min-h-dvh flex-col items-center justify-center px-5 py-10 sm:px-6 sm:py-12">
      <div className="relative w-full max-w-[440px]">
        <div className="mb-8 flex flex-col items-center text-center sm:mb-10">
          <BrandMark className="mb-6 sm:mb-8" />
          <h1 className="text-2xl font-black tracking-tight sm:text-3xl">Espace client</h1>
          <p className="mt-2 max-w-sm text-sm font-medium leading-relaxed text-[var(--muted-strong)] sm:text-base">
            Retrouvez vos cartes, vos points et votre QR Fidelo.
          </p>
        </div>

        <section className="glass-panel p-6 sm:p-8">
          {google ? <Alert tone={google.tone}>{google.text}</Alert> : null}
          {googleEnabled ? (
            <div className="mb-6 space-y-5">
              <GoogleAuthButton href={googleHref} />
              <AuthSeparator />
            </div>
          ) : null}
          <form className="space-y-5 sm:space-y-6" onSubmit={onSubmit}>
            {error ? <Alert>{error}</Alert> : null}
            <Field label="Adresse e-mail">
              <Input name="email" type="email" autoComplete="email" required placeholder="jean@exemple.fr" />
            </Field>
            <Field label="Mot de passe">
              <PasswordInput name="password" autoComplete="current-password" required placeholder="••••••••" />
            </Field>
            <Button type="submit" className="w-full justify-center py-4 text-base" disabled={pending}>
              {pending ? "Connexion en cours..." : "Ouvrir mon portefeuille"}
            </Button>
          </form>
        </section>

        <div className="glass-panel mt-6 p-5 text-center sm:mt-8 sm:p-6">
          <p className="text-sm font-medium leading-relaxed text-[var(--muted-strong)]">
            Pas encore de carte ? Scannez le QR en magasin ou testez{" "}
            <Link href="/demo" className="font-bold text-[var(--violet-bright)] hover:underline">
              le wallet démo
            </Link>
            .
          </p>
        </div>

        <nav className="mt-6 text-center text-xs font-bold uppercase tracking-[0.18em] text-[var(--muted)]">
          <p className="mb-3">Autres espaces</p>
          <div className="flex flex-wrap justify-center gap-x-5 gap-y-2">
            <Link href="/app/connexion" className="text-[var(--violet-bright)] hover:underline normal-case tracking-normal">
              Commerçant
            </Link>
            <Link href="/employe/connexion" className="text-[var(--violet-bright)] hover:underline normal-case tracking-normal">
              Employé
            </Link>
            <Link href="/demo" className="text-[var(--violet-bright)] hover:underline normal-case tracking-normal">
              Démos
            </Link>
          </div>
        </nav>
      </div>
    </main>
  );
}
