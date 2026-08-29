"use client";

import { useState } from "react";
import { Alert, Button, Field, Input } from "@/components/ui";

export function SettingsForm({
  initial,
}: {
  initial: {
    name: string;
    logoUrl: string;
    primaryColor: string;
    visitsRequired: number;
    rewardLabel: string;
  };
}) {
  const [ok, setOk] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
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
      {error ? <div className="mb-6"><Alert>{error}</Alert></div> : null}
      {ok ? <div className="mb-6 animate-in fade-in slide-in-from-top-4"><Alert tone="ok">Modifications enregistrées avec succès.</Alert></div> : null}
      
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <form className="space-y-8" onSubmit={(event) => void onSubmit(event)}>
              <div className="space-y-6">
                <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted-text)]">Identité visuelle</p>
                <div className="grid gap-6 sm:grid-cols-2">
                  <Field label="Nom du commerce">
                    <Input name="name" defaultValue={initial.name} required placeholder="Ex: Café de Paris" />
                  </Field>
                  <Field label="Couleur principale">
                    <div className="flex gap-3">
                      <Input name="primaryColor" defaultValue={initial.primaryColor} className="flex-1" />
                      <div 
                        className="h-[46px] w-[46px] shrink-0 rounded-xl border border-border shadow-sm" 
                        style={{ backgroundColor: initial.primaryColor }}
                      />
                    </div>
                  </Field>
                </div>
                <Field label="URL du logo">
                  <Input name="logoUrl" defaultValue={initial.logoUrl} placeholder="https://..." />
                </Field>
              </div>

              <div className="space-y-6 pt-8 border-t border-border/50">
                <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted-text)]">Programme de fidélité</p>
                <div className="grid gap-6 sm:grid-cols-2">
                  <Field label="Passages requis">
                    <Input name="visitsRequired" type="number" min={2} max={100} defaultValue={initial.visitsRequired} required />
                  </Field>
                  <Field label="Récompense offerte">
                    <Input name="rewardLabel" defaultValue={initial.rewardLabel} required placeholder="Ex: Une boisson offerte" />
                  </Field>
                </div>
              </div>

              <div className="pt-8 border-t border-border/50">
                <Button className="w-full sm:w-auto px-12 py-4 text-base">
                  Enregistrer les modifications
                </Button>
              </div>
            </form>
        </div>

        <div className="lg:col-span-1">
          <p className="mb-4 px-2 text-[10px] font-bold uppercase tracking-widest text-[var(--muted-text)]">Aperçu direct</p>
          <div className="sticky top-28 space-y-6">
            <div className="overflow-hidden rounded-2xl border border-border">
              <div className="flex h-20 items-center justify-center border-b border-border/50 bg-primary/10">
                 {initial.logoUrl ? (
                   // eslint-disable-next-line @next/next/no-img-element
                   <img src={initial.logoUrl} alt="" className="h-10 w-10 rounded-lg object-cover shadow-sm bg-white" />
                 ) : (
                   <div className="h-10 w-10 rounded-lg bg-white grid place-items-center font-bold text-primary shadow-sm">
                     {initial.name.slice(0, 1)}
                   </div>
                 )}
              </div>
              <div className="p-6">
                <h4 className="font-black tracking-tight">{initial.name}</h4>
                <p className="text-xs font-medium text-muted mt-1 leading-snug">
                  {initial.visitsRequired} passages = {initial.rewardLabel}
                </p>
                <div className="mt-4 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-primary w-1/3" />
                </div>
              </div>
            </div>
            
            <div className="rounded-2xl bg-amber-50 p-6 border border-amber-100 text-amber-900 shadow-sm">
              <div className="flex gap-3">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-5 w-5 shrink-0 text-amber-600 mt-0.5">
                  <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <p className="text-xs font-medium leading-relaxed">
                  <strong>Note :</strong> La couleur et le logo sont visibles par vos clients sur leur carte digitale et la page publique.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
