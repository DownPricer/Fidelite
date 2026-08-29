"use client";

import { useEffect, useState } from "react";
import { Alert, Button, Card, Field, Input, cn } from "@/components/ui";

type Merchant = {
  id: string;
  name: string;
  slug: string;
  primaryColor: string;
  isActive: boolean;
  customers: number;
  visitsRequired?: number;
  rewardLabel?: string;
};

export function AdminHome({ firstName }: { firstName: string }) {
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    const response = await fetch("/api/admin/merchants");
    const data = await response.json();
    if (response.ok) setMerchants(data.merchants);
  }

  useEffect(() => {
    void load();
  }, []);

  async function create(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/admin/merchants", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.get("name"),
        slug: form.get("slug"),
        logoUrl: form.get("logoUrl"),
        primaryColor: form.get("primaryColor") || "#14b8a6",
        visitsRequired: Number(form.get("visitsRequired") || 10),
        rewardLabel: form.get("rewardLabel"),
        adminFirstName: form.get("adminFirstName"),
        adminEmail: form.get("adminEmail"),
        adminPassword: form.get("adminPassword"),
      }),
    });
    const data = await response.json();
    if (!response.ok) {
      setError(data.error ?? "Création impossible.");
      return;
    }
    setError(null);
    event.currentTarget.reset();
    void load();
  }

  async function toggle(id: string, isActive: boolean) {
    await fetch(`/api/admin/merchants/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !isActive }),
    });
    void load();
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/admin/connexion";
  }

  const stats = {
    totalMerchants: merchants.length,
    totalCustomers: merchants.reduce((acc, m) => acc + m.customers, 0),
    activeMerchants: merchants.filter(m => m.isActive).length,
  };

  return (
    <div className="min-h-dvh bg-[var(--page-bg)] text-[var(--body-text)]">
      {/* Sidebar Super-admin */}
      <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col border-r border-white/10 bg-[var(--navy)] text-[var(--navy-text)] lg:flex">
        <div className="flex h-16 items-center px-6 border-b border-white/5">
          <div className="flex items-center gap-3 font-bold tracking-tighter">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-[var(--teal)] text-white shadow-lg shadow-[var(--teal)]/30">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-5 h-5">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <span className="text-lg">FifeLite <span className="ml-1 text-[10px] font-black uppercase tracking-widest text-[var(--teal)]">Admin</span></span>
          </div>
        </div>
        <nav className="flex-1 space-y-1 px-4 py-8">
          <div className="flex items-center gap-3 rounded-xl bg-white/5 px-3 py-2.5 text-sm font-bold text-white">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5 text-primary">
              <path d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Vue d'ensemble
          </div>
        </nav>
        <div className="p-4 border-t border-white/5">
          <Button variant="ghost" onClick={() => void logout()} className="w-full text-white/60 hover:text-white hover:bg-white/5">
            Déconnexion
          </Button>
        </div>
      </aside>

      <main className="lg:pl-64">
        <header className="sticky top-0 z-10 border-b border-[var(--border)] bg-[var(--panel-bg)]/80 px-6 py-4 backdrop-blur-md lg:px-12">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black uppercase italic tracking-tight text-[var(--panel-text)]">Gestion Globale</h2>
            <div className="flex items-center gap-3">
              <div className="hidden text-right sm:block">
                <p className="text-[10px] font-bold uppercase leading-none tracking-widest text-[var(--muted-text)]">Connecté en tant que</p>
                <p className="text-sm font-bold text-[var(--panel-text)]">{firstName}</p>
              </div>
              <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500 text-xs">
                {firstName.slice(0, 1)}
              </div>
            </div>
          </div>
        </header>

        <div className="px-6 py-8 lg:px-12 lg:py-12 max-w-7xl mx-auto">
          {/* Stats Bar */}
          <section className="mb-12 grid gap-6 sm:grid-cols-3">
            {[
              { label: "Commerces", value: stats.totalMerchants, sub: `${stats.activeMerchants} actifs`, icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" },
              { label: "Clients Total", value: stats.totalCustomers, sub: "Toutes enseignes", icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" },
              { label: "Activité", value: "Premium", sub: "SaaS FifeLite", icon: "M13 10V3L4 14h7v7l9-11h-7z" },
            ].map((stat) => (
              <Card key={stat.label} className="p-6">
                <div className="flex items-center gap-4">
                  <div className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/5 text-primary">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-6 h-6">
                      <path d={stat.icon} strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted-text)]">{stat.label}</p>
                    <p className="text-2xl font-black tracking-tight text-[var(--panel-text)]">{stat.value}</p>
                    <p className="text-xs font-medium text-[var(--muted-text)]">{stat.sub}</p>
                  </div>
                </div>
              </Card>
            ))}
          </section>

          <div className="grid gap-12 lg:grid-cols-3">
            {/* Formulaire de création */}
            <div className="lg:col-span-1">
              <Card className="sticky top-28">
                <h3 className="text-xl font-bold tracking-tight mb-6 flex items-center gap-2">
                  <span className="h-6 w-1 bg-primary rounded-full" />
                  Nouveau commerce
                </h3>
                {error ? <div className="mb-6"><Alert>{error}</Alert></div> : null}
                <form className="space-y-6" onSubmit={(event) => void create(event)}>
                  <div className="space-y-4">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted-text)]">Configuration Enseigne</p>
                    <Field label="Nom public">
                      <Input name="name" placeholder="Ex: Café de Paris" required />
                    </Field>
                    <Field label="Slug URL" hint="fifelite.com/c/votre-slug">
                      <Input name="slug" placeholder="cafe-de-paris" required />
                    </Field>
                    <div className="grid grid-cols-2 gap-4">
                      <Field label="Couleur">
                        <Input name="primaryColor" type="color" defaultValue="#14b8a6" className="h-[46px] p-1" />
                      </Field>
                      <Field label="Visites">
                        <Input name="visitsRequired" type="number" defaultValue={10} required />
                      </Field>
                    </div>
                    <Field label="Récompense offerte">
                      <Input name="rewardLabel" placeholder="Ex: Un café gratuit" required />
                    </Field>
                  </div>

                  <div className="space-y-4 pt-6 border-t border-border/50">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted-text)]">Compte Administrateur</p>
                    <Field label="Prénom admin">
                      <Input name="adminFirstName" required />
                    </Field>
                    <Field label="E-mail admin">
                      <Input name="adminEmail" type="email" required />
                    </Field>
                    <Field label="Mot de passe">
                      <Input name="adminPassword" type="password" required minLength={8} />
                    </Field>
                  </div>

                  <Button className="w-full py-4 text-base">Créer le commerce</Button>
                </form>
              </Card>
            </div>

            {/* Liste des commerces */}
            <div className="lg:col-span-2">
              <div className="mb-6 flex items-center justify-between px-2">
                <h3 className="text-xl font-bold tracking-tight">Commerces enregistrés</h3>
                <span className="text-xs font-bold uppercase tracking-widest text-[var(--muted-text)]">{merchants.length} au total</span>
              </div>
              
              <div className="space-y-4">
                {merchants.length === 0 ? (
                  <div className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-[var(--border)] py-20 text-center text-[var(--muted-text)]">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-12 h-12 mb-4 opacity-20">
                      <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    <p className="font-bold tracking-tight">Aucun commerce pour le moment</p>
                    <p className="text-sm">Utilisez le formulaire pour ajouter votre premier client.</p>
                  </div>
                ) : (
                  merchants.map((merchant) => (
                    <Card key={merchant.id} className="group relative overflow-hidden transition-all hover:border-primary/30">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                          <div 
                            className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl text-2xl font-black text-white shadow-lg"
                            style={{ backgroundColor: merchant.primaryColor || "#14b8a6" }}
                          >
                            {merchant.name.slice(0, 1)}
                          </div>
                          <div>
                            <h4 className="text-lg font-black tracking-tight text-[var(--panel-text)] transition-colors group-hover:text-[var(--teal)]">{merchant.name}</h4>
                            <p className="text-xs font-bold uppercase italic tracking-widest text-[var(--muted-text)]">/{merchant.slug} • {merchant.customers} clients</p>
                            <p className="mt-1 text-sm font-medium text-[var(--muted-text)]">
                              <span className="font-bold text-[var(--panel-text)]">{merchant.visitsRequired}</span> passages = <span className="font-bold text-[var(--teal)]">{merchant.rewardLabel}</span>
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                            merchant.isActive ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-rose-50 text-rose-600 border border-rose-100"
                          )}>
                            {merchant.isActive ? "Actif" : "Suspendu"}
                          </div>
                          <Button 
                            variant={merchant.isActive ? "danger" : "secondary"} 
                            className="h-10 px-4 text-xs"
                            onClick={() => void toggle(merchant.id, merchant.isActive)}
                          >
                            {merchant.isActive ? "Désactiver" : "Activer"}
                          </Button>
                        </div>
                      </div>
                      {/* Ligne de couleur sur le côté */}
                      <div 
                        className="absolute left-0 top-0 bottom-0 w-1"
                        style={{ backgroundColor: merchant.primaryColor || "#14b8a6" }}
                      />
                    </Card>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
