"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { SuperAdminShell } from "@/components/super-admin/layout-shell";
import { Alert, Button, Card, Field, Input } from "@/components/ui";

const STEPS = [
  "Identité publique",
  "Informations légales",
  "Horaires",
  "Administrateur",
  "Programme",
  "Abonnement",
  "Cartes par mode de fidélité",
  "Récapitulatif",
];

const WIZARD_STORAGE_KEY = "fifelite-super-admin-wizard";

const LOYALTY_MODES = [
  { id: "VISITS", label: "Fidélité par passages" },
  { id: "POINTS_BY_AMOUNT", label: "Points selon le montant" },
  { id: "FIXED_POINTS", label: "Points fixes par achat" },
  { id: "AMOUNT_TIERS", label: "Paliers selon le montant" },
] as const;

export function CreateMerchantWizard({ firstName }: { firstName: string }) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    slug: "",
    category: "",
    shortDescription: "",
    description: "",
    logoUrl: "",
    primaryColor: "#875BFF",
    legalName: "",
    ownerName: "",
    ownerPhone: "",
    adminEmailLegal: "",
    addressLine1: "",
    postalCode: "",
    city: "",
    country: "FR",
    timezone: "Europe/Paris",
    visibleInSearch: true,
    adminFirstName: "",
    adminLastName: "",
    adminEmail: "",
    adminPassword: "",
    adminPasswordConfirm: "",
    loyaltyMode: "VISITS" as (typeof LOYALTY_MODES)[number]["id"],
    visitsRequired: 10,
    rewardLabel: "Récompense offerte",
    plan: "STARTER" as "STARTER" | "PRO" | "ENTERPRISE",
    amount: 29,
    frequency: "MONTHLY" as "MONTHLY" | "YEARLY",
    subscriptionStatus: "TRIAL" as "TRIAL" | "ACTIVE",
    trialDays: 14,
    contractReference: "",
    cardBackgroundDataUrl: "",
    duplicateCardDesignToAllModes: true,
  });

  const slugPreview = useMemo(
    () =>
      form.slug ||
      form.name
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, ""),
    [form.name, form.slug],
  );

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(WIZARD_STORAGE_KEY);
      if (!raw) return;
      const saved = JSON.parse(raw) as { form?: typeof form; step?: number };
      if (saved.form) setForm((prev) => ({ ...prev, ...saved.form }));
      if (typeof saved.step === "number" && saved.step >= 0 && saved.step < STEPS.length) {
        setStep(saved.step);
      }
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    sessionStorage.setItem(WIZARD_STORAGE_KEY, JSON.stringify({ form, step }));
  }, [form, step]);

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function submit() {
    setLoading(true);
    setError(null);
    const payload = {
      identity: {
        name: form.name,
        slug: form.slug || slugPreview,
        category: form.category,
        shortDescription: form.shortDescription,
        description: form.description,
        logoUrl: form.logoUrl,
        primaryColor: form.primaryColor,
      },
      legal: {
        legalName: form.legalName || form.name,
        ownerName: form.ownerName,
        ownerPhone: form.ownerPhone,
        adminEmail: form.adminEmailLegal || form.adminEmail,
        addressLine1: form.addressLine1,
        postalCode: form.postalCode,
        city: form.city,
        country: form.country,
      },
      availability: {
        timezone: form.timezone,
        visibleInSearch: form.visibleInSearch,
      },
      admin: {
        firstName: form.adminFirstName,
        lastName: form.adminLastName,
        email: form.adminEmail,
        password: form.adminPassword,
        passwordConfirm: form.adminPasswordConfirm,
      },
      program: {
        mode: form.loyaltyMode,
        visitsRequired: form.visitsRequired,
        rewardLabel: form.rewardLabel,
      },
      subscription: {
        plan: form.plan,
        amount: form.amount,
        frequency: form.frequency,
        status: form.subscriptionStatus,
        trialDays: form.subscriptionStatus === "TRIAL" ? form.trialDays : undefined,
      },
      contract: form.contractReference
        ? { reference: form.contractReference, amount: form.amount }
        : undefined,
      merchantStatus: form.subscriptionStatus === "TRIAL" ? "TRIAL" : "ACTIVE",
      duplicateCardDesignToAllModes: form.duplicateCardDesignToAllModes,
    };

    const response = await fetch("/api/super-admin/merchants", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    if (!response.ok) {
      setLoading(false);
      setError(data.error ?? "Création impossible.");
      return;
    }

    if (form.cardBackgroundDataUrl) {
      const uploadResponse = await fetch("/api/super-admin/upload/card-background", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ merchantId: data.id, dataUrl: form.cardBackgroundDataUrl }),
      }).catch(() => null);
      if (uploadResponse?.ok) {
        const uploadData = await uploadResponse.json();
        if (uploadData.url) {
          await fetch("/api/super-admin/card-templates", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              action: "apply-shared-background",
              merchantId: data.id,
              backgroundUrl: uploadData.url,
              activeMode: form.loyaltyMode,
              duplicateToAll: form.duplicateCardDesignToAllModes,
            }),
          }).catch(() => undefined);
        }
      }
    }

    sessionStorage.removeItem(WIZARD_STORAGE_KEY);
    router.push(`/super-admin/commerces/${data.id}`);
  }

  return (
    <SuperAdminShell firstName={firstName}>
      <div className="mx-auto max-w-4xl space-y-6">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-[var(--ink)]">Créer un commerce</h1>
          <p className="text-sm text-[var(--muted-text)]">Étape {step + 1} / {STEPS.length} — {STEPS[step]}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          {STEPS.map((label, index) => (
            <button
              key={label}
              type="button"
              onClick={() => setStep(index)}
              className={`rounded-full px-3 py-1 text-xs font-semibold ${index === step ? "bg-[var(--violet)] text-white" : "bg-white/5 text-[var(--muted-text)]"}`}
            >
              {index + 1}. {label}
            </button>
          ))}
        </div>

        {error ? <Alert>{error}</Alert> : null}

        <Card className="space-y-4 p-6">
          {step === 0 ? (
            <>
              <Field label="Nom public"><Input value={form.name} onChange={(e) => update("name", e.target.value)} required /></Field>
              <Field label="Slug" hint={`Aperçu : /c/${slugPreview || "votre-slug"}`}>
                <Input value={form.slug} onChange={(e) => update("slug", e.target.value)} placeholder={slugPreview} />
              </Field>
              <Field label="Catégorie"><Input value={form.category} onChange={(e) => update("category", e.target.value)} /></Field>
              <Field label="Description courte"><Input value={form.shortDescription} onChange={(e) => update("shortDescription", e.target.value)} /></Field>
              <Field label="Couleur principale"><Input type="color" value={form.primaryColor} onChange={(e) => update("primaryColor", e.target.value)} className="h-12" /></Field>
              <Field label="Logo (URL)"><Input value={form.logoUrl} onChange={(e) => update("logoUrl", e.target.value)} /></Field>
            </>
          ) : null}

          {step === 1 ? (
            <>
              <Field label="Nom légal"><Input value={form.legalName} onChange={(e) => update("legalName", e.target.value)} /></Field>
              <Field label="Responsable"><Input value={form.ownerName} onChange={(e) => update("ownerName", e.target.value)} /></Field>
              <Field label="Téléphone responsable"><Input value={form.ownerPhone} onChange={(e) => update("ownerPhone", e.target.value)} /></Field>
              <Field label="E-mail administratif"><Input type="email" value={form.adminEmailLegal} onChange={(e) => update("adminEmailLegal", e.target.value)} /></Field>
              <Field label="Adresse"><Input value={form.addressLine1} onChange={(e) => update("addressLine1", e.target.value)} /></Field>
              <div className="grid gap-4 sm:grid-cols-3">
                <Field label="Code postal"><Input value={form.postalCode} onChange={(e) => update("postalCode", e.target.value)} /></Field>
                <Field label="Ville"><Input value={form.city} onChange={(e) => update("city", e.target.value)} /></Field>
                <Field label="Pays"><Input value={form.country} onChange={(e) => update("country", e.target.value)} /></Field>
              </div>
            </>
          ) : null}

          {step === 2 ? (
            <>
              <Field label="Fuseau horaire"><Input value={form.timezone} onChange={(e) => update("timezone", e.target.value)} /></Field>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={form.visibleInSearch} onChange={(e) => update("visibleInSearch", e.target.checked)} />
                Visible dans la recherche
              </label>
            </>
          ) : null}

          {step === 3 ? (
            <>
              <Field label="Prénom administrateur"><Input value={form.adminFirstName} onChange={(e) => update("adminFirstName", e.target.value)} required /></Field>
              <Field label="Nom"><Input value={form.adminLastName} onChange={(e) => update("adminLastName", e.target.value)} /></Field>
              <Field label="E-mail administrateur"><Input type="email" value={form.adminEmail} onChange={(e) => update("adminEmail", e.target.value)} required /></Field>
              <Field label="Mot de passe"><Input type="password" value={form.adminPassword} onChange={(e) => update("adminPassword", e.target.value)} minLength={8} required /></Field>
              <Field label="Confirmation"><Input type="password" value={form.adminPasswordConfirm} onChange={(e) => update("adminPasswordConfirm", e.target.value)} required /></Field>
            </>
          ) : null}

          {step === 4 ? (
            <>
              <Field label="Type de fidélité">
                <select className="w-full rounded-xl border border-white/10 bg-[var(--surface)] px-3 py-2" value={form.loyaltyMode} onChange={(e) => update("loyaltyMode", e.target.value as typeof form.loyaltyMode)}>
                  {LOYALTY_MODES.map((mode) => <option key={mode.id} value={mode.id}>{mode.label}</option>)}
                </select>
              </Field>
              {form.loyaltyMode === "VISITS" ? (
                <Field label="Passages requis"><Input type="number" value={form.visitsRequired} onChange={(e) => update("visitsRequired", Number(e.target.value))} /></Field>
              ) : null}
              <Field label="Récompense / libellé"><Input value={form.rewardLabel} onChange={(e) => update("rewardLabel", e.target.value)} /></Field>
            </>
          ) : null}

          {step === 5 ? (
            <>
              <Field label="Formule">
                <select className="w-full rounded-xl border border-white/10 bg-[var(--surface)] px-3 py-2" value={form.plan} onChange={(e) => update("plan", e.target.value as typeof form.plan)}>
                  <option value="STARTER">Starter</option>
                  <option value="PRO">Pro</option>
                  <option value="ENTERPRISE">Enterprise</option>
                </select>
              </Field>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Montant"><Input type="number" value={form.amount} onChange={(e) => update("amount", Number(e.target.value))} /></Field>
                <Field label="Fréquence">
                  <select className="w-full rounded-xl border border-white/10 bg-[var(--surface)] px-3 py-2" value={form.frequency} onChange={(e) => update("frequency", e.target.value as typeof form.frequency)}>
                    <option value="MONTHLY">Mensuel</option>
                    <option value="YEARLY">Annuel</option>
                  </select>
                </Field>
              </div>
              <Field label="Référence contrat"><Input value={form.contractReference} onChange={(e) => update("contractReference", e.target.value)} /></Field>
            </>
          ) : null}

          {step === 6 ? (
            <>
              <Field label="Fond principal de carte (PNG/JPEG/WebP)">
                <Input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onload = () => update("cardBackgroundDataUrl", String(reader.result ?? ""));
                    reader.readAsDataURL(file);
                  }}
                />
              </Field>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={form.duplicateCardDesignToAllModes}
                  onChange={(e) => update("duplicateCardDesignToAllModes", e.target.checked)}
                />
                Utiliser ce design pour tous les modes
              </label>
              <p className="text-xs text-[var(--muted-text)]">
                Quatre variantes seront créées (passages, points selon montant, points fixes, paliers).
                Vous pourrez personnaliser chaque carte dans la fiche commerce après création.
              </p>
            </>
          ) : null}

          {step === 7 ? (
            <div className="space-y-2 text-sm">
              <p><strong>Nom :</strong> {form.name}</p>
              <p><strong>Slug :</strong> {form.slug || slugPreview}</p>
              <p><strong>Admin :</strong> {form.adminEmail}</p>
              <p><strong>Fidélité :</strong> {form.loyaltyMode}</p>
              <p><strong>Formule :</strong> {form.plan} — {form.amount} € / {form.frequency === "MONTHLY" ? "mois" : "an"}</p>
            </div>
          ) : null}
        </Card>

        <div className="flex justify-between">
          <Button variant="secondary" disabled={step === 0} onClick={() => setStep((s) => s - 1)}>Précédent</Button>
          {step < STEPS.length - 1 ? (
            <Button onClick={() => setStep((s) => s + 1)}>Suivant</Button>
          ) : (
            <Button disabled={loading} onClick={() => void submit()}>{loading ? "Création…" : "Créer le commerce"}</Button>
          )}
        </div>
      </div>
    </SuperAdminShell>
  );
}
