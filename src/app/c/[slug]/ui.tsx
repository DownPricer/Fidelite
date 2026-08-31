"use client";

import Link from "next/link";
import { useState } from "react";
import { Alert, Button, Field, Input } from "@/components/ui";

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
    <main className="min-h-dvh bg-[var(--void)] text-[var(--ink-soft)]">
      <div className="mx-auto max-w-6xl px-6 py-12 lg:py-24">
        <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
            <header className="mb-8">
              {merchant.logoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={merchant.logoUrl}
                  alt=""
                  className="mx-auto mb-6 h-20 w-20 rounded-2xl border border-white/10 object-cover lg:mx-0"
                />
              ) : (
                <div
                  className="mx-auto mb-6 grid h-20 w-20 place-items-center rounded-2xl text-3xl font-bold text-[var(--ink)] lg:mx-0"
                  style={{ backgroundColor: merchant.primaryColor }}
                >
                  {merchant.name.slice(0, 1)}
                </div>
              )}
              <h1 className="text-4xl font-black tracking-tighter text-[var(--ink)] lg:text-6xl">{merchant.name}</h1>
              <p className="mt-4 text-xl font-medium text-[var(--muted-strong)]">Rejoignez ce commerce avec Fife Life.</p>
            </header>

            <div className="w-full space-y-6">
              <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-[var(--surface)] p-6">
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-[var(--violet)]/20 text-[var(--violet-bright)]">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-6 w-6">
                    <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold uppercase tracking-wider text-[var(--muted)]">L&apos;offre</p>
                  <p className="text-lg font-bold text-[var(--ink)]">
                    {merchant.visitsRequired} passages = {merchant.rewardLabel}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {[
                  { step: "1", label: "Je m’inscris" },
                  { step: "2", label: "Je montre mon QR" },
                  { step: "3", label: "Je gagne mes points" },
                ].map((item) => (
                  <div key={item.step} className="flex flex-col items-center gap-2 text-center">
                    <div className="grid h-10 w-10 place-items-center rounded-xl bg-[var(--surface)] text-[var(--violet-bright)]">
                      {item.step}
                    </div>
                    <span className="text-xs font-bold uppercase text-[var(--muted)]">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div>
            {alreadyMember ? (
              <section className="rounded-[28px] border border-white/10 bg-[var(--surface)] p-8 text-center">
                <div className="mx-auto mb-6 grid h-16 w-16 place-items-center rounded-full bg-[var(--violet)]/20 text-[var(--violet-bright)]">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-8 w-8">
                    <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-[var(--ink)]">Heureux de vous revoir</h2>
                <p className="mt-2 text-[var(--muted-strong)]">Bonjour {firstName}, votre carte est prête.</p>
                <Link
                  href={`/carte/${merchant.slug}`}
                  className="mt-8 block w-full rounded-xl bg-[var(--violet)] py-4 text-center font-bold text-[var(--ink)]"
                >
                  Accéder à ma carte
                </Link>
              </section>
            ) : signedIn ? (
              <section className="rounded-[28px] border border-white/10 bg-[var(--surface)] p-8 text-center">
                <h2 className="text-2xl font-bold text-[var(--ink)]">Rejoignez-nous</h2>
                <p className="mt-2 text-[var(--muted-strong)]">
                  Bonjour {firstName}, ajoutez {merchant.name} à votre portefeuille.
                </p>
                <Button
                  className="mt-8 w-full py-4"
                  onClick={async () => {
                    const response = await fetch("/api/customer/join", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ slug: merchant.slug }),
                    });
                    if (response.ok) window.location.href = `/carte/${merchant.slug}`;
                  }}
                >
                  Ajouter ma carte fidélité
                </Button>
              </section>
            ) : (
              <section className="rounded-[28px] border border-white/10 bg-[var(--surface)] p-8">
                <h2 className="text-2xl font-bold tracking-tight text-[var(--ink)]">Créer ma carte</h2>
                <p className="mt-1 text-sm text-[var(--muted)]">Gratuit, prêt en quelques secondes.</p>
                <form className="mt-8 space-y-6" onSubmit={onSubmit}>
                  {error ? <Alert>{error}</Alert> : null}
                  <Field label="Prénom">
                    <Input name="firstName" autoComplete="given-name" placeholder="Ex: Jean" required />
                  </Field>
                  <Field label="E-mail">
                    <Input name="email" type="email" autoComplete="email" placeholder="jean@exemple.fr" required />
                  </Field>
                  <Field label="Mot de passe" hint="Sécurisé, 8 caractères minimum.">
                    <Input name="password" type="password" autoComplete="new-password" required minLength={8} />
                  </Field>
                  <label className="group flex cursor-pointer items-start gap-3 text-sm text-[var(--muted)]">
                    <input
                      name="privacyConsent"
                      type="checkbox"
                      required
                      className="mt-1 h-4 w-4 rounded border-[var(--stroke)] bg-[var(--surface-raised)] text-[var(--violet)] focus:ring-[var(--violet)]/20"
                    />
                    <span className="transition-colors group-hover:text-[var(--ink)]">
                      J’accepte la{" "}
                      <Link href="/confidentialite" className="font-bold text-[var(--violet-bright)] hover:underline">
                        politique de confidentialité
                      </Link>
                      .
                    </span>
                  </label>
                  <Button className="w-full py-4" disabled={pending}>
                    {pending ? "Création en cours..." : "Obtenir ma carte maintenant"}
                  </Button>
                </form>
                <p className="mt-6 text-center text-sm font-medium text-[var(--muted)]">
                  Déjà membre ?{" "}
                  <Link href="/connexion" className="font-bold text-[var(--ink)] hover:underline">
                    Se connecter
                  </Link>
                </p>
              </section>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
