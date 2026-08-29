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
    <main className="min-h-dvh bg-surface text-ink">
      <div className="mx-auto max-w-6xl px-6 py-12 lg:py-24">
        <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
          {/* Section Information */}
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
            <header className="mb-8">
              {merchant.logoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={merchant.logoUrl} alt="" className="mx-auto mb-6 h-20 w-20 rounded-2xl border border-border bg-white object-cover shadow-sm lg:mx-0" />
              ) : (
                <div className="mx-auto mb-6 grid h-20 w-20 place-items-center rounded-2xl bg-primary/10 text-3xl font-bold text-primary lg:mx-0">
                  {merchant.name.slice(0, 1)}
                </div>
              )}
              <h1 className="text-4xl font-black tracking-tighter lg:text-6xl">{merchant.name}</h1>
              <p className="mt-4 text-xl text-muted font-medium">Votre fidélité enfin récompensée.</p>
            </header>

            <div className="space-y-6">
              <div className="flex items-center gap-4 rounded-2xl bg-white p-6 shadow-premium border border-border/50">
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-emerald-50 text-emerald-600">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-6 w-6">
                    <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold uppercase tracking-wider text-muted/60">L'offre</p>
                  <p className="text-lg font-bold text-ink">{merchant.visitsRequired} passages = {merchant.rewardLabel}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {[
                  { step: "1", label: "Je m’inscris", icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" },
                  { step: "2", label: "Je montre mon QR", icon: "M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" },
                  { step: "3", label: "Je gagne mes points", icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
                ].map((item) => (
                  <div key={item.step} className="flex flex-col items-center gap-2 text-center">
                    <div className="grid h-10 w-10 place-items-center rounded-xl bg-slate-100 text-muted">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
                        <path d={item.icon} strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <span className="text-xs font-bold text-muted uppercase">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Section Formulaire */}
          <div className="relative">
            {alreadyMember ? (
              <Card className="text-center">
                <div className="mx-auto mb-6 grid h-16 w-16 place-items-center rounded-full bg-emerald-50 text-emerald-600">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-8 w-8">
                    <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold">Heureux de vous revoir !</h2>
                <p className="mt-2 text-muted">Bonjour {firstName}, votre carte est prête à être utilisée.</p>
                <Link
                  href={`/carte/${merchant.slug}`}
                  className="mt-8 block w-full rounded-xl bg-primary py-4 text-center font-bold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:opacity-90 active:scale-[0.98]"
                >
                  Accéder à ma carte
                </Link>
              </Card>
            ) : signedIn ? (
              <Card className="text-center">
                <h2 className="text-2xl font-bold">Rejoignez-nous</h2>
                <p className="mt-2 text-muted">Bonjour {firstName}, rejoignez {merchant.name} en un clic.</p>
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
              </Card>
            ) : (
              <Card>
                <h2 className="text-2xl font-bold tracking-tight">Créer ma carte</h2>
                <p className="mt-1 text-muted text-sm italic">Gratuit et prêt en quelques secondes.</p>
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
                  <label className="flex items-start gap-3 text-sm text-muted cursor-pointer group">
                    <input name="privacyConsent" type="checkbox" required className="mt-1 h-4 w-4 rounded border-border text-primary focus:ring-primary/20" />
                    <span className="group-hover:text-ink transition-colors">
                      J’accepte la{" "}
                      <Link href="/confidentialite" className="text-primary font-bold hover:underline">
                        politique de confidentialité
                      </Link>
                      .
                    </span>
                  </label>
                  <Button className="w-full py-4" disabled={pending}>
                    {pending ? "Création en cours..." : "Obtenir ma carte maintenant"}
                  </Button>
                </form>
                <p className="mt-6 text-center text-sm font-medium text-muted">
                  Déjà membre ?{" "}
                  <Link href="/connexion" className="text-ink font-bold hover:underline">
                    Se connecter
                  </Link>
                </p>
              </Card>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
