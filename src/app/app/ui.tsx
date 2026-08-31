"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui";

export function MerchantHome({
  firstName,
  merchantName,
  demoStats,
}: {
  firstName: string;
  role: string;
  merchantName: string;
  canAdmin: boolean;
  demoStats?: {
    customers: number;
    visitsToday: number;
    rewards: number;
    employees: number;
  };
}) {
  const [stats, setStats] = useState<{
    customers: number;
    visitsToday: number;
    rewards: number;
    employees: number;
  } | null>(demoStats ?? null);

  useEffect(() => {
    if (demoStats) return;
    void fetch("/api/merchant/dashboard")
      .then((res) => res.json())
      .then((data) => setStats(data.stats))
      .catch(() => undefined);
  }, [demoStats]);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/app/connexion";
  }

  const metrics = stats
    ? [
        { label: "Clients actifs", value: stats.customers },
        { label: "Passages (24h)", value: stats.visitsToday },
        { label: "Récompenses", value: stats.rewards },
        { label: "Employés", value: stats.employees },
      ]
    : null;

  return (
    <main className="obsidian-scene min-h-dvh px-6 py-8 lg:px-12 lg:py-12">
      <header className="mb-8 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--muted)]">{merchantName}</p>
          <h1 className="mt-1 text-3xl font-black tracking-tight text-[var(--ink)] lg:text-4xl">Bonjour, {firstName}</h1>
          <p className="text-sm font-medium text-[var(--muted)]">Vue d&apos;ensemble fidélité</p>
        </div>
        <div className="flex gap-3">
          <Link href="/app/caisse" className="glass-cta px-5 py-2.5 text-sm">
            Ouvrir la caisse
          </Link>
          <Button variant="secondary" onClick={() => void logout()} className="h-10 px-4">
            Déconnexion
          </Button>
        </div>
      </header>

      {metrics ? (
        <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {metrics.map((stat) => (
            <div key={stat.label} className="metric-card px-5 py-5">
              <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted)]">{stat.label}</p>
              <p className="mt-2 text-3xl font-black tracking-tight text-[var(--ink)]">{stat.value}</p>
            </div>
          ))}
        </section>
      ) : (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="metric-card h-24 animate-pulse" />
          ))}
        </div>
      )}

      <section className="glass-panel mt-8 p-6 lg:p-8">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--violet-bright)]">Activité récente</p>
        <h2 className="mt-2 text-xl font-black text-[var(--ink)]">Derniers passages et récompenses</h2>
        <p className="mt-2 max-w-2xl text-sm text-[var(--muted-strong)]">
          Consultez vos clients, ajustez les points et suivez l&apos;usage des récompenses depuis les sections Clients,
          Équipe et Réglages.
        </p>
        <div className="mt-6 grid gap-3 lg:grid-cols-3">
          {[
            ["Clients", "/app/clients", "Liste et ajustements"],
            ["Équipe", "/app/employes", "Accès caisse et rôles"],
            ["Réglages", "/app/parametres", "Programme et identité"],
          ].map(([label, href, hint]) => (
            <Link key={href} href={href} className="metric-card block p-4 transition-transform hover:-translate-y-0.5">
              <p className="font-bold text-[var(--ink)]">{label}</p>
              <p className="mt-1 text-xs text-[var(--muted)]">{hint}</p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
