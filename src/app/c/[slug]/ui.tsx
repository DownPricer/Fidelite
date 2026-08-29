"use client";

import Link from "next/link";
import { useState } from "react";
import { Alert, Button, Card, Field, Input } from "@/components/ui";

type Merchant = {
  name: string;
  slug: string;
  logoUrl: string | null;
  primaryColor: string;
  rewardLabel: string;
  visitsRequired: number;
};

export function MerchantPublic({
  merchant,
  alreadyMember,
  signedIn,
  firstName,
}: {
  merchant: Merchant;
  alreadyMember: boolean;
  signedIn: boolean;
  firstName: string | null;
}) {
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError(null);
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        slug: merchant.slug,
        firstName: form.get("firstName"),
        email: form.get("email"),
        password: form.get("password"),
        privacyConsent: form.get("privacyConsent") === "on",
        marketingConsent: false,
      }),
    });
    const data = await response.json();
    setPending(false);
    if (!response.ok) {
      setError(data.error ?? "Inscription impossible.");
      return;
    }
    window.location.href = `/carte/${merchant.slug}`;
  }

  return (
    <main className="mx-auto min-h-dvh max-w-md px-6 py-10">
      <header
        className="overflow-hidden rounded-[2rem] p-6 text-white shadow-lg"
        style={{ background: `linear-gradient(135deg, ${merchant.primaryColor}, #0f172a)` }}
      >
        {merchant.logoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={merchant.logoUrl} alt="" className="mb-4 h-12 w-12 rounded-2xl bg-white object-cover" />
        ) : (
          <div className="mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-white/15 text-xl font-bold">
            {merchant.name.slice(0, 1)}
          </div>
        )}
        <p className="text-sm text-white/80">Carte fidélité</p>
        <h1 className="text-3xl font-semibold">{merchant.name}</h1>
        <p className="mt-3 text-white/90">
          {merchant.visitsRequired} passages = {merchant.rewardLabel}
        </p>
      </header>

      {alreadyMember ? (
        <Card className="mt-6 space-y-3">
          <p>Bonjour {firstName}, votre carte est déjà prête.</p>
          <Link
            href={`/carte/${merchant.slug}`}
            className="block rounded-2xl bg-teal-700 px-4 py-3 text-center font-semibold text-white"
          >
            Voir ma carte
          </Link>
        </Card>
      ) : signedIn ? (
        <Card className="mt-6 space-y-3">
          <p>Bonjour {firstName}, rejoignez {merchant.name} avec votre compte existant.</p>
          <Button
            className="w-full"
            onClick={async () => {
              const response = await fetch("/api/customer/join", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ slug: merchant.slug }),
              });
              if (response.ok) window.location.href = `/carte/${merchant.slug}`;
            }}
          >
            Rejoindre ce commerce
          </Button>
        </Card>
      ) : (
        <Card className="mt-6">
          <h2 className="text-xl font-semibold">Créer ma carte</h2>
          <form className="mt-4 space-y-4" onSubmit={onSubmit}>
            {error ? <Alert>{error}</Alert> : null}
            <Field label="Prénom">
              <Input name="firstName" autoComplete="given-name" required />
            </Field>
            <Field label="E-mail">
              <Input name="email" type="email" autoComplete="email" required />
            </Field>
            <Field label="Mot de passe" hint="8 caractères minimum.">
              <Input name="password" type="password" autoComplete="new-password" required minLength={8} />
            </Field>
            <label className="flex items-start gap-3 text-sm text-slate-700">
              <input name="privacyConsent" type="checkbox" required className="mt-1 h-4 w-4" />
              <span>
                J’accepte la{" "}
                <Link href="/confidentialite" className="underline">
                  politique de confidentialité
                </Link>
                .
              </span>
            </label>
            <Button className="w-full" disabled={pending} style={{ backgroundColor: merchant.primaryColor }}>
              {pending ? "Création…" : "Créer ma carte"}
            </Button>
          </form>
          <p className="mt-4 text-sm text-slate-600">
            Déjà inscrit ?{" "}
            <Link href="/connexion" className="underline">
              Se connecter
            </Link>
          </p>
        </Card>
      )}
    </main>
  );
}
