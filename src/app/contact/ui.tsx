"use client";

import { useState } from "react";
import { Alert, Button, Field, Input } from "@/components/ui";

export function ContactForm({ supportEmail }: { supportEmail: string | null }) {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    setPending(true);
    setError(null);
    setSuccess(null);
    const form = new FormData(event.currentTarget);
    try {
      const response = await fetch("/api/public/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.get("name"),
          email: form.get("email"),
          message: form.get("message"),
        }),
      });
      const data = (await response.json()) as { error?: string; message?: string };
      if (!response.ok) {
        setError(data.error ?? "Envoi impossible pour le moment.");
        return;
      }
      setSuccess(data.message ?? "Message envoyé.");
      event.currentTarget.reset();
    } catch {
      setError("Erreur réseau. Vérifiez votre connexion et réessayez.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="mt-8 space-y-6">
      {supportEmail ? (
        <p className="text-sm leading-relaxed text-[var(--fh-muted)]">
          Vous pouvez aussi nous écrire directement à{" "}
          <a href={`mailto:${supportEmail}`} className="font-bold text-[var(--fh-purple)] hover:underline">
            {supportEmail}
          </a>
          .
        </p>
      ) : (
        <Alert tone="error">
          L&apos;adresse e-mail de support n&apos;est pas encore configurée sur ce serveur (variable{" "}
          <code className="text-xs">SUPPORT_EMAIL</code>). Le formulaire reste disponible dès que l&apos;envoi est
          activé.
        </Alert>
      )}

      {success ? <Alert tone="ok">{success}</Alert> : null}
      {error ? <Alert>{error}</Alert> : null}

      <form className="space-y-5" onSubmit={onSubmit}>
        <Field label="Nom">
          <Input name="name" autoComplete="name" required maxLength={120} placeholder="Votre nom" disabled={pending} />
        </Field>
        <Field label="Adresse e-mail">
          <Input
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder="vous@exemple.fr"
            disabled={pending}
          />
        </Field>
        <Field label="Message">
          <textarea
            name="message"
            required
            minLength={10}
            maxLength={5000}
            rows={6}
            disabled={pending}
            placeholder="Décrivez votre demande (carte Google Wallet, compte client, commerce partenaire…)"
            className="w-full rounded-xl border border-[var(--fh-border)] bg-[var(--fh-surface)] px-4 py-3 text-sm text-[var(--fh-text)] outline-none ring-[var(--fh-purple)]/30 transition focus:ring-4"
          />
        </Field>
        <Button type="submit" className="w-full justify-center py-4 text-base" disabled={pending}>
          {pending ? "Envoi en cours..." : "Envoyer le message"}
        </Button>
      </form>
    </div>
  );
}
