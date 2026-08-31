"use client";

import { useState } from "react";
import { Alert, Button, Field, Input } from "@/components/ui";

export function SettingsForm({
  initial,
  demo = false,
}: {
  initial: {
    name: string;
    logoUrl: string;
    primaryColor: string;
    visitsRequired: number;
    rewardLabel: string;
  };
  demo?: boolean;
}) {
  const [ok, setOk] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (demo) {
      setOk(true);
      setTimeout(() => setOk(false), 3000);
      return;
    }
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/merchant/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.get("name"),
        logoUrl: form.get("logoUrl"),
        primaryColor: form.get("primaryColor"),
        visitsRequired: Number(form.get("visitsRequired")),
        rewardLabel: form.get("rewardLabel"),
      }),
    });
    const data = await response.json();
    if (!response.ok) {
      setError(data.error ?? "Enregistrement impossible.");
      setOk(false);
      return;
    }
    setError(null);
    setOk(true);
    setTimeout(() => setOk(false), 3000);
  }

  return (
    <div className="max-w-4xl">
      {error ? (
        <div className="mb-6">
          <Alert>{error}</Alert>
        </div>
      ) : null}
      {ok ? (
        <div className="mb-6">
          <Alert tone="ok">Modifications enregistrées avec succès.</Alert>
        </div>
      ) : null}

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <form className="space-y-8" onSubmit={(event) => void onSubmit(event)}>
            <div className="space-y-6 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
              <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted)]">Identité visuelle</p>
              <div className="grid gap-6 sm:grid-cols-2">
                <Field label="Nom du commerce">
                  <Input name="name" defaultValue={initial.name} required placeholder="Ex: Café de Paris" />
                </Field>
                <Field label="Couleur principale">
                  <div className="flex gap-3">
                    <Input name="primaryColor" defaultValue={initial.primaryColor} className="flex-1" />
                    <div
                      className="h-[46px] w-[46px] shrink-0 rounded-xl border border-white/10"
                      style={{ backgroundColor: initial.primaryColor }}
                    />
                  </div>
                </Field>
              </div>
              <Field label="URL du logo">
                <Input name="logoUrl" defaultValue={initial.logoUrl} placeholder="https://..." />
              </Field>
            </div>

            <div className="space-y-6 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
              <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted)]">Programme de fidélité</p>
              <div className="grid gap-6 sm:grid-cols-2">
                <Field label="Passages requis">
                  <Input name="visitsRequired" type="number" min={2} max={100} defaultValue={initial.visitsRequired} required />
                </Field>
                <Field label="Récompense offerte">
                  <Input name="rewardLabel" defaultValue={initial.rewardLabel} required placeholder="Ex: Une boisson offerte" />
                </Field>
              </div>
            </div>

            <Button className="w-full px-12 py-4 text-base sm:w-auto">Enregistrer les modifications</Button>
          </form>
        </div>

        <div className="lg:col-span-1">
          <p className="mb-4 px-2 text-[10px] font-bold uppercase tracking-widest text-[var(--muted)]">Aperçu direct</p>
          <div className="sticky top-8 space-y-6">
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-[var(--surface)]">
              <div className="flex h-20 items-center justify-center border-b border-white/10 bg-[var(--surface-raised)]">
                {initial.logoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={initial.logoUrl} alt="" className="h-10 w-10 rounded-lg object-cover" />
                ) : (
                  <div className="grid h-10 w-10 place-items-center rounded-lg bg-[var(--violet)] font-bold text-[var(--ink)]">
                    {initial.name.slice(0, 1)}
                  </div>
                )}
              </div>
              <div className="p-6">
                <h4 className="font-black tracking-tight text-[var(--ink)]">{initial.name}</h4>
                <p className="mt-1 text-xs font-medium leading-snug text-[var(--muted)]">
                  {initial.visitsRequired} passages = {initial.rewardLabel}
                </p>
                <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                  <div className="h-full w-1/3 bg-[var(--violet)]" />
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-[var(--warning)]/25 bg-[var(--warning)]/10 p-6 text-[var(--ink-soft)]">
              <p className="text-xs font-medium leading-relaxed">
                <strong className="text-[var(--ink)]">Note :</strong> La couleur et le logo sont visibles par vos clients sur leur carte digitale et la page publique.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
