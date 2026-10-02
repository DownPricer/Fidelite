"use client";

import { useState } from "react";
import { CustomerAuthShell } from "@/components/customer-auth/customer-auth-shell";
import { Alert, Button, Field, Input } from "@/components/ui";
import type { CustomerAccessLevel } from "@/lib/customer-onboarding";

type FormState = {
  firstName: string;
  lastName: string;
  email: string;
  emailConfirmed: boolean;
  phoneVerified: boolean;
  city: string;
  addressLine1: string;
  addressLine2: string;
  postalCode: string;
  phone: string;
  phoneCountryCode: string;
};

export function FinalisationForm({
  initial,
  accessLevel,
  emailBanner,
  smsConfigured,
  smsConfigHint,
}: {
  initial: FormState;
  accessLevel: CustomerAccessLevel;
  emailBanner: string | null;
  smsConfigured: boolean;
  smsConfigHint: string | null;
}) {
  const [form, setForm] = useState(initial);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [phonePending, setPhonePending] = useState(false);
  const [challengeToken, setChallengeToken] = useState<string | null>(null);
  const [smsCode, setSmsCode] = useState("");

  const limited = accessLevel === "limited";

  async function resendEmail() {
    setError(null);
    setInfo(null);
    const response = await fetch("/api/customer/auth/resend-finalization", { method: "POST" });
    const data = (await response.json()) as { error?: string; message?: string };
    if (!response.ok) {
      setError(data.error ?? "Envoi impossible.");
      return;
    }
    setInfo(data.message ?? "E-mail envoyé.");
  }

  async function sendSmsCode() {
    if (!smsConfigured) {
      setError(smsConfigHint ?? "Vérification SMS indisponible.");
      return;
    }
    setPhonePending(true);
    setError(null);
    const response = await fetch("/api/customer/auth/phone/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone: form.phone, phoneCountryCode: form.phoneCountryCode }),
    });
    const data = (await response.json()) as { error?: string; challengeToken?: string; message?: string };
    setPhonePending(false);
    if (!response.ok) {
      setError(data.error ?? "Envoi SMS impossible.");
      return;
    }
    setChallengeToken(data.challengeToken ?? null);
    setInfo(data.message ?? "Code envoyé.");
  }

  async function verifySmsCode() {
    if (!challengeToken) {
      setError("Demandez d'abord un code SMS.");
      return;
    }
    setPhonePending(true);
    const response = await fetch("/api/customer/auth/phone/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ challengeToken, code: smsCode }),
    });
    const data = (await response.json()) as { error?: string; message?: string };
    setPhonePending(false);
    if (!response.ok) {
      setError(data.error ?? "Code invalide.");
      return;
    }
    setForm((current) => ({ ...current, phoneVerified: true }));
    setInfo(data.message ?? "Téléphone vérifié.");
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError(null);
    const response = await fetch("/api/customer/finalize", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = (await response.json()) as { error?: string; redirectTo?: string };
    setPending(false);
    if (!response.ok) {
      setError(data.error ?? "Finalisation impossible.");
      return;
    }
    window.location.href = data.redirectTo ?? "/carte";
  }

  const emailAlert =
    emailBanner === "confirmed"
      ? { tone: "ok" as const, text: "Votre e-mail est confirmé. Complétez les dernières informations." }
      : emailBanner === "invalid"
        ? { tone: "error" as const, text: "Ce lien de confirmation n'est plus valide. Demandez un nouvel e-mail." }
        : null;

  return (
    <CustomerAuthShell
      title="Finaliser mon compte"
      subtitle={
        limited
          ? "Votre accès est limité tant que votre profil n'est pas complet. Vos cartes et avantages restent enregistrés."
          : "Confirmez votre e-mail, vérifiez votre téléphone et complétez votre profil."
      }
    >
      {limited ? (
        <Alert tone="error">
          Les 24 heures de découverte sont terminées. Finalisez votre compte pour rouvrir votre portefeuille.
        </Alert>
      ) : (
        <Alert tone="ok">
          Vous disposez de 24 h après l&apos;inscription pour confirmer votre e-mail et compléter votre profil.
        </Alert>
      )}
      {emailAlert ? <Alert tone={emailAlert.tone}>{emailAlert.text}</Alert> : null}
      {info ? <Alert tone="ok">{info}</Alert> : null}
      {error ? <Alert>{error}</Alert> : null}

      <div className="mb-6 rounded-2xl border border-white/10 p-4 text-sm">
        <p className="font-bold text-[var(--ink)]">E-mail : {form.email}</p>
        <p className="mt-1 text-[var(--muted-strong)]">
          {form.emailConfirmed ? "Confirmé" : "En attente de confirmation"}
        </p>
        {!form.emailConfirmed ? (
          <Button type="button" className="mt-3 w-full" onClick={() => void resendEmail()}>
            Renvoyer le lien de confirmation
          </Button>
        ) : null}
      </div>

      {!smsConfigured ? (
        <Alert tone="error">{smsConfigHint ?? "Configurez Twilio pour activer la vérification SMS."}</Alert>
      ) : null}

      <div className="mb-6 space-y-3 rounded-2xl border border-white/10 p-4">
        <p className="text-sm font-bold text-[var(--ink)]">Vérification du téléphone</p>
        <div className="grid gap-3 sm:grid-cols-[120px_1fr]">
          <Field label="Indicatif">
            <Input
              value={form.phoneCountryCode}
              onChange={(event) => setForm((current) => ({ ...current, phoneCountryCode: event.target.value }))}
            />
          </Field>
          <Field label="Téléphone">
            <Input
              value={form.phone}
              onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))}
              placeholder="06 12 34 56 78"
            />
          </Field>
        </div>
        <Button type="button" className="w-full" disabled={phonePending || !smsConfigured} onClick={() => void sendSmsCode()}>
          {phonePending ? "Envoi..." : "Recevoir un code SMS"}
        </Button>
        <Field label="Code reçu">
          <Input value={smsCode} onChange={(event) => setSmsCode(event.target.value)} inputMode="numeric" placeholder="123456" />
        </Field>
        <Button type="button" className="w-full" disabled={phonePending || !smsConfigured} onClick={() => void verifySmsCode()}>
          Vérifier le code
        </Button>
        <p className="text-xs text-[var(--muted-strong)]">
          {form.phoneVerified ? "Téléphone vérifié." : "La vérification SMS réelle est requise — aucune simulation côté serveur."}
        </p>
      </div>

      <form className="space-y-4" onSubmit={onSubmit}>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Prénom">
            <Input
              required
              value={form.firstName}
              onChange={(event) => setForm((current) => ({ ...current, firstName: event.target.value }))}
            />
          </Field>
          <Field label="Nom">
            <Input
              required
              value={form.lastName}
              onChange={(event) => setForm((current) => ({ ...current, lastName: event.target.value }))}
            />
          </Field>
        </div>
        <Field label="Ville">
          <Input
            required
            value={form.city}
            onChange={(event) => setForm((current) => ({ ...current, city: event.target.value }))}
          />
        </Field>
        <Field label="Adresse (facultatif)">
          <Input
            value={form.addressLine1}
            onChange={(event) => setForm((current) => ({ ...current, addressLine1: event.target.value }))}
            placeholder="Numéro et rue"
          />
        </Field>
        <Field label="Complément d'adresse (facultatif)">
          <Input
            value={form.addressLine2}
            onChange={(event) => setForm((current) => ({ ...current, addressLine2: event.target.value }))}
          />
        </Field>
        <Field label="Code postal (facultatif)">
          <Input
            value={form.postalCode}
            onChange={(event) => setForm((current) => ({ ...current, postalCode: event.target.value }))}
          />
        </Field>
        <Button type="submit" className="w-full py-4 text-base" disabled={pending}>
          {pending ? "Enregistrement..." : "Finaliser et ouvrir mon portefeuille"}
        </Button>
      </form>
    </CustomerAuthShell>
  );
}
