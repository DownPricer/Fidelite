"use client";

import Link from "next/link";
import { useState } from "react";
import { CustomerAuthShell } from "@/components/customer-auth/customer-auth-shell";
import { AuthSeparator, GoogleAuthButton } from "@/components/google-auth-button";
import { Alert, Button, Field, Input, PasswordInput } from "@/components/ui";

export function CustomerSignupForm({ googleEnabled }: { googleEnabled: boolean }) {
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [privacyConsent, setPrivacyConsent] = useState(false);

  const googleHref = `/api/auth/google/start?flow=register&privacyConsent=${privacyConsent ? "true" : "false"}&returnTo=${encodeURIComponent("/carte?onboarding=1")}`;

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setInfo(null);
    setPending(true);
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/customer/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        firstName: form.get("firstName"),
        lastName: form.get("lastName"),
        email: form.get("email"),
        password: form.get("password"),
        privacyConsent: form.get("privacyConsent") === "on",
      }),
    });
    const data = (await response.json()) as { error?: string; redirectTo?: string; message?: string };
    setPending(false);
    if (!response.ok) {
      setError(data.error ?? "Inscription impossible.");
      return;
    }
    setInfo(data.message ?? null);
    window.location.href = data.redirectTo ?? "/carte?onboarding=1";
  }

  return (
    <CustomerAuthShell
      title="Créer mon compte"
      subtitle="Accédez à votre portefeuille Fideto pendant 24 h le temps de confirmer votre e-mail et compléter votre profil."
      footer={
        <p className="mt-6 text-center text-sm text-[var(--muted-strong)]">
          Déjà inscrit ?{" "}
          <Link href="/connexion" className="font-bold text-[var(--violet-bright)] hover:underline">
            Se connecter
          </Link>
        </p>
      }
    >
      {info ? <Alert tone="ok">{info}</Alert> : null}
      {googleEnabled ? (
        <div className="mb-6 space-y-5">
          <label className="flex items-start gap-3 text-sm text-[var(--muted-strong)]">
            <input
              type="checkbox"
              className="mt-1"
              checked={privacyConsent}
              onChange={(event) => setPrivacyConsent(event.target.checked)}
            />
            <span>
              J&apos;accepte la{" "}
              <Link href="/confidentialite" className="font-bold text-[var(--violet-bright)] hover:underline">
                politique de confidentialité
              </Link>
              .
            </span>
          </label>
          <GoogleAuthButton
            href={googleHref}
            disabled={!privacyConsent}
            disabledReason="Acceptez la politique de confidentialité pour continuer avec Google."
          />
          <AuthSeparator />
        </div>
      ) : null}

      <form className="space-y-5" onSubmit={onSubmit}>
        {error ? <Alert>{error}</Alert> : null}
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Prénom">
            <Input name="firstName" autoComplete="given-name" required placeholder="Jean" />
          </Field>
          <Field label="Nom">
            <Input name="lastName" autoComplete="family-name" required placeholder="Dupont" />
          </Field>
        </div>
        <Field label="Adresse e-mail">
          <Input name="email" type="email" autoComplete="email" required placeholder="jean@exemple.fr" />
        </Field>
        <Field label="Mot de passe">
          <PasswordInput name="password" autoComplete="new-password" required placeholder="8 caractères minimum" />
        </Field>
        <label className="flex items-start gap-3 text-sm text-[var(--muted-strong)]">
          <input name="privacyConsent" type="checkbox" required className="mt-1" />
          <span>
            J&apos;accepte la{" "}
            <Link href="/confidentialite" className="font-bold text-[var(--violet-bright)] hover:underline">
              politique de confidentialité
            </Link>
            .
          </span>
        </label>
        <Button type="submit" className="w-full justify-center py-4 text-base" disabled={pending}>
          {pending ? "Création en cours..." : "Créer mon compte"}
        </Button>
      </form>
    </CustomerAuthShell>
  );
}
