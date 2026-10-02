"use client";

import Link from "next/link";
import { useState } from "react";
import { CustomerAuthShell } from "@/components/customer-auth/customer-auth-shell";
import { AuthSeparator, GoogleAuthButton } from "@/components/google-auth-button";
import { Alert, Button, Field, Input, PasswordInput } from "@/components/ui";

function googleMessage(code: string | null) {
  if (!code) return null;
  const messages: Record<string, { tone: "error" | "ok"; text: string }> = {
    cancelled: { tone: "ok", text: "Connexion Google annulée. Vous pouvez continuer avec votre e-mail." },
    configuration_absente: { tone: "error", text: "La connexion Google n'est pas encore configurée." },
    compte_existant: {
      tone: "error",
      text: "Un compte existe déjà avec cet e-mail. Connectez-vous avec votre mot de passe ou demandez un lien de reprise.",
    },
    email_non_verifie: { tone: "error", text: "Google ne confirme pas cet e-mail. Utilisez une autre méthode de connexion." },
    email_absent: { tone: "error", text: "Google n'a pas transmis d'e-mail vérifié." },
    state_invalide: { tone: "error", text: "La tentative Google a expiré. Réessayez depuis cette page." },
    consentement_requis: { tone: "error", text: "Acceptez la politique de confidentialité avant de créer un compte." },
    erreur: { tone: "error", text: "Connexion Google impossible pour le moment." },
  };
  return messages[code] ?? messages.erreur;
}

function recoverMessage(code: string | null) {
  if (code === "invalid") return { tone: "error" as const, text: "Ce lien de reprise n'est plus valide. Demandez-en un nouveau." };
  if (code === "sent") return { tone: "ok" as const, text: "Si un compte existe, un e-mail de reprise vient d'être envoyé." };
  return null;
}

export function CustomerLoginForm({
  googleEnabled,
  googleStatus,
  returnTo,
  recoverStatus,
}: {
  googleEnabled: boolean;
  googleStatus: string | null;
  returnTo: string | null;
  recoverStatus: string | null;
}) {
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [recoverPending, setRecoverPending] = useState(false);
  const google = googleMessage(googleStatus);
  const recover = recoverMessage(recoverStatus);
  const googleHref = `/api/auth/google/start?flow=login&returnTo=${encodeURIComponent(returnTo || "/carte")}`;

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setInfo(null);
    setPending(true);
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/customer/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: form.get("email"),
        password: form.get("password"),
      }),
    });
    const data = (await response.json()) as { error?: string; redirectTo?: string };
    setPending(false);
    if (!response.ok) {
      setError(data.error ?? "Connexion impossible.");
      return;
    }
    window.location.href = data.redirectTo ?? "/carte";
  }

  async function onRecover(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setRecoverPending(true);
    setError(null);
    setInfo(null);
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/customer/auth/recover", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: form.get("recoverEmail") }),
    });
    const data = (await response.json()) as { message?: string; error?: string };
    setRecoverPending(false);
    if (!response.ok) {
      setError(data.error ?? "Demande impossible.");
      return;
    }
    setInfo(data.message ?? "Demande enregistrée.");
  }

  return (
    <CustomerAuthShell
      title="Espace client"
      subtitle="Retrouvez vos cartes, vos points et votre QR Fideto."
      footer={
        <div className="mt-6 space-y-4">
          <Link
            href="/inscription"
            className="flex w-full items-center justify-center rounded-2xl border border-[rgba(190,164,255,0.35)] bg-[rgba(147,95,243,0.12)] px-4 py-4 text-base font-bold text-[var(--ink)] transition hover:opacity-90"
          >
            Créer mon compte
          </Link>
        </div>
      }
    >
      {google ? <Alert tone={google.tone}>{google.text}</Alert> : null}
      {recover ? <Alert tone={recover.tone}>{recover.text}</Alert> : null}
      {info ? <Alert tone="ok">{info}</Alert> : null}
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
          {pending ? "Connexion en cours..." : "Se connecter"}
        </Button>
      </form>

      <details className="mt-6 rounded-2xl border border-white/10 p-4 text-sm">
        <summary className="cursor-pointer font-bold text-[var(--violet-bright)]">Reprendre mon compte</summary>
        <p className="mt-2 text-[var(--muted-strong)]">
          Aucun accès n&apos;est accordé sur la seule saisie d&apos;un e-mail. Nous envoyons un lien sécurisé à usage unique.
        </p>
        <form className="mt-4 space-y-3" onSubmit={onRecover}>
          <Field label="E-mail du compte">
            <Input name="recoverEmail" type="email" required placeholder="jean@exemple.fr" />
          </Field>
          <Button type="submit" className="w-full" disabled={recoverPending}>
            {recoverPending ? "Envoi..." : "Recevoir un lien sécurisé"}
          </Button>
        </form>
      </details>
    </CustomerAuthShell>
  );
}
