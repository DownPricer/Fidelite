"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Alert, Button, Field, Input } from "@/components/ui";

type PlanSummary = {
  id: string;
  name: string;
  monthlyLabel: string;
  setupLabel: string | null;
  firstMonthIncluded: boolean;
};

type View = "form" | "code" | "success";

export function MerchantSignupForm({ plan }: { plan: PlanSummary }) {
  const [view, setView] = useState<View>("form");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [codeDigits, setCodeDigits] = useState(["", "", "", "", "", ""]);
  const [codeEmail, setCodeEmail] = useState("");

  const priceLine = useMemo(() => {
    if (plan.setupLabel) {
      return `${plan.setupLabel} TTC à la commande, puis ${plan.monthlyLabel} TTC / mois${plan.firstMonthIncluded ? " (1er mois inclus)" : ""}.`;
    }
    return `${plan.monthlyLabel} TTC / mois.`;
  }, [plan]);

  async function submitForm(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError(null);
    const form = new FormData(event.currentTarget);
    try {
      const response = await fetch("/api/public/merchant-signup/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planId: plan.id,
          firstName: form.get("firstName"),
          lastName: form.get("lastName"),
          businessName: form.get("businessName"),
          businessActivity: form.get("businessActivity"),
          email: form.get("email"),
          mobilePhone: form.get("mobilePhone"),
          landlinePhone: form.get("landlinePhone") || "",
          website: form.get("website") || "",
          siret: form.get("siret") || "",
          message: form.get("message") || "",
          addressLine1: form.get("addressLine1"),
          postalCode: form.get("postalCode"),
          city: form.get("city"),
          contactConsent: form.get("contactConsent") === "on",
        }),
      });
      const data = (await response.json()) as { error?: string };
      if (!response.ok) {
        setError(data.error ?? "Envoi impossible.");
        return;
      }
      setView("success");
    } catch {
      setError("Envoi impossible. Vérifiez votre connexion.");
    } finally {
      setPending(false);
    }
  }

  async function submitCode(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError(null);
    const code = codeDigits.join("");
    try {
      const response = await fetch("/api/public/merchant-signup/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: codeEmail, code }),
      });
      const data = (await response.json()) as { error?: string; nextUrl?: string };
      if (!response.ok) {
        setError(data.error ?? "Code invalide.");
        return;
      }
      window.location.href = data.nextUrl ?? "/app/compte-commercant";
    } catch {
      setError("Validation impossible.");
    } finally {
      setPending(false);
    }
  }

  function onDigitChange(index: number, value: string) {
    const digit = value.replace(/\D/g, "").slice(-1);
    setCodeDigits((prev) => {
      const next = [...prev];
      next[index] = digit;
      return next;
    });
  }

  return (
    <div className="mx-auto max-w-5xl">
      <article className="mb-8 rounded-3xl border border-[rgba(190,164,255,0.28)] bg-[rgba(12,10,24,0.72)] p-6 sm:p-8">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#c4b5fd]">Formule choisie</p>
        <h1 className="mt-2 text-2xl font-black text-white sm:text-3xl">{plan.name}</h1>
        <p className="mt-2 text-sm text-slate-300">{priceLine}</p>
        <p className="mt-1 text-xs text-slate-500">Le tarif affiché est indicatif : le montant facturé sera celui de votre formule validée par Fideto.</p>
      </article>

      {view === "success" ? (
        <div className="rounded-3xl border border-emerald-500/30 bg-emerald-500/10 p-8 text-center">
          <h2 className="text-2xl font-black text-white">Demande envoyée</h2>
          <p className="mt-4 text-sm leading-relaxed text-slate-200">
            Merci ! Un conseiller Fideto étudiera votre demande et vous contactera rapidement. Vous recevrez un accusé de réception par e-mail.
            Aucun paiement n&apos;a été déclenché.
          </p>
          <Link href="/tarifs" className="mt-6 inline-flex text-sm font-bold text-[#c4b5fd] hover:underline">
            Retour aux tarifs
          </Link>
        </div>
      ) : null}

      {view === "form" ? (
        <>
          <div className="mb-8 max-w-3xl">
            <h2 className="text-3xl font-black text-white sm:text-4xl">Fideto est actuellement en phase bêta</h2>
            <p className="mt-4 text-base leading-relaxed text-slate-300">
              Pour commencer avec Fideto, remplissez ce formulaire. Un conseiller étudiera votre demande et vous contactera rapidement.
              La demande d&apos;accès est gratuite et sans engagement. Aucun paiement ne sera demandé à cette étape.
            </p>
          </div>

          <form onSubmit={(e) => void submitForm(e)} className="grid gap-8 lg:grid-cols-2">
            <div className="space-y-4 rounded-3xl border border-white/10 bg-[rgba(8,6,18,0.65)] p-6">
              <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400">Vous</h3>
              <Field label="Prénom *">
                <Input name="firstName" required className="bg-black/30" />
              </Field>
              <Field label="Nom *">
                <Input name="lastName" required className="bg-black/30" />
              </Field>
              <Field label="E-mail professionnel *">
                <Input name="email" type="email" required autoComplete="email" className="bg-black/30" />
              </Field>
              <Field label="Téléphone portable *">
                <Input name="mobilePhone" type="tel" required className="bg-black/30" />
              </Field>
              <Field label="Téléphone fixe">
                <Input name="landlinePhone" type="tel" className="bg-black/30" />
              </Field>
            </div>

            <div className="space-y-4 rounded-3xl border border-white/10 bg-[rgba(8,6,18,0.65)] p-6">
              <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400">Votre commerce</h3>
              <Field label="Nom du commerce *">
                <Input name="businessName" required className="bg-black/30" />
              </Field>
              <Field label="Activité du commerce *">
                <Input name="businessActivity" required className="bg-black/30" />
              </Field>
              <Field label="Adresse du commerce *">
                <Input name="addressLine1" required className="bg-black/30" />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Code postal *">
                  <Input name="postalCode" required className="bg-black/30" />
                </Field>
                <Field label="Ville *">
                  <Input name="city" required className="bg-black/30" />
                </Field>
              </div>
              <Field label="Site internet">
                <Input name="website" type="url" placeholder="https://" className="bg-black/30" />
              </Field>
              <Field label="SIRET">
                <Input name="siret" className="bg-black/30" />
              </Field>
              <Field label="Message ou besoins particuliers">
                <textarea
                  name="message"
                  rows={4}
                  className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-white"
                />
              </Field>
            </div>

            <div className="lg:col-span-2 space-y-4 rounded-3xl border border-white/10 bg-[rgba(8,6,18,0.65)] p-6">
              {error ? <Alert>{error}</Alert> : null}
              <label className="flex items-start gap-3 text-sm text-slate-300">
                <input name="contactConsent" type="checkbox" required className="mt-1" />
                <span>
                  J&apos;accepte d&apos;être contacté par Fideto au sujet de cette demande d&apos;accès (pas de prospection marketing sans
                  consentement distinct).
                </span>
              </label>
              <p className="text-xs text-slate-500">
                <Link href="/confidentialite" className="text-[#c4b5fd] hover:underline">
                  Politique de confidentialité
                </Link>
              </p>
              <Button type="submit" className="w-full sm:w-auto" disabled={pending}>
                {pending ? "Envoi en cours…" : "Envoyer ma demande"}
              </Button>
            </div>
          </form>

          <div className="mt-12 border-t border-white/10 pt-8">
            <Button type="button" variant="secondary" onClick={() => { setView("code"); setError(null); }}>
              J&apos;ai déjà rempli ce formulaire
            </Button>
          </div>
        </>
      ) : null}

      {view === "code" ? (
        <div className="mx-auto max-w-lg rounded-3xl border border-white/10 bg-[rgba(8,6,18,0.65)] p-6 sm:p-8">
          <Button type="button" variant="ghost" className="mb-4 text-sm" onClick={() => { setView("form"); setError(null); }}>
            ← Retour au formulaire
          </Button>
          <h2 className="text-xl font-black text-white">Code d&apos;inscription</h2>
          <p className="mt-2 text-sm text-slate-400">
            Ce code vous est envoyé par un conseiller Fideto après acceptation de votre demande. Si vous n&apos;avez pas encore reçu de code,
            remplissez le formulaire ou contactez{" "}
            <a href="mailto:contact@fideto.fr" className="text-[#c4b5fd]">contact@fideto.fr</a>.
          </p>
          <form className="mt-6 space-y-5" onSubmit={(e) => void submitCode(e)}>
            {error ? <Alert>{error}</Alert> : null}
            <Field label="E-mail utilisé dans la demande">
              <Input
                type="email"
                required
                value={codeEmail}
                onChange={(e) => setCodeEmail(e.target.value)}
                className="bg-black/30"
              />
            </Field>
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-widest text-slate-500">Code à 6 chiffres</p>
              <div className="flex justify-between gap-2">
                {codeDigits.map((digit, index) => (
                  <input
                    key={index}
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => onDigitChange(index, e.target.value)}
                    className="h-12 w-10 rounded-xl border border-white/15 bg-black/40 text-center text-lg font-bold text-white sm:h-14 sm:w-12"
                    aria-label={`Chiffre ${index + 1}`}
                  />
                ))}
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={pending}>
              {pending ? "Validation…" : "Valider mon code"}
            </Button>
          </form>
        </div>
      ) : null}
    </div>
  );
}
