"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui";
import { MerchantPageHeader } from "@/components/merchant/merchant-ui";

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
  const [stats, setStats] = useState(demoStats ?? null);
  const [recent, setRecent] = useState<
    Array<{ id: string; type: string; pointsDelta: number; firstName: string; actor: string; createdAt: string }>
  >(
    demoStats
      ? [
          { id: "r1", type: "EARN_VISIT", pointsDelta: 1, firstName: "Marie", actor: "Sam", createdAt: new Date().toISOString() },
          { id: "r2", type: "REDEEM_REWARD", pointsDelta: -10, firstName: "Lucas", actor: "Noa", createdAt: new Date(Date.now() - 1800000).toISOString() },
          { id: "r3", type: "EARN_VISIT", pointsDelta: 28, firstName: "Sarah", actor: "Sam", createdAt: new Date(Date.now() - 3600000).toISOString() },
        ]
      : [],
  );

  useEffect(() => {
    if (demoStats) return;
    void fetch("/api/merchant/dashboard")
      .then((res) => res.json())
      .then((data) => {
        setStats(data.stats);
        setRecent(data.recent ?? []);
      })
      .catch(() => undefined);
  }, [demoStats]);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/app/connexion";
  }

  const metrics = stats
    ? [
        { label: "Clients", value: stats.customers },
        { label: "Passages 24h", value: stats.visitsToday },
        { label: "Récompenses", value: stats.rewards },
        { label: "Employés", value: stats.employees },
      ]
    : null;

  function activityLabel(item: (typeof recent)[0]) {
    if (item.type === "REDEEM_REWARD") return `${item.firstName} · Récompense validée`;
    const sign = item.pointsDelta > 0 ? "+" : "";
    return `${item.firstName} · ${sign}${item.pointsDelta} ${Math.abs(item.pointsDelta) === 1 ? "passage" : "points"}`;
  }

  return (
    <main className="obsidian-scene mx-auto max-w-5xl px-5 py-6 lg:px-10 lg:py-10">
      <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--muted)]">{merchantName}</p>
          <h1 className="mt-1 text-2xl font-black tracking-tight text-[var(--ink)] sm:text-3xl">Bonjour, {firstName}</h1>
          <p className="text-sm text-[var(--muted-strong)]">Vue d&apos;ensemble fidélité</p>
        </div>
        <div className="flex gap-2">
          <Link href="/app/caisse" className="glass-cta px-4 py-2 text-sm">
            Caisse
          </Link>
          <Button variant="ghost" onClick={() => void logout()} className="h-10 px-3 text-xs">
            Déconnexion
          </Button>
        </div>
      </header>

      {metrics ? (
        <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {metrics.map((stat) => (
            <div key={stat.label} className="metric-card px-4 py-4">
              <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted)]">{stat.label}</p>
              <p className="mt-1 text-2xl font-black text-[var(--ink)]">{stat.value}</p>
            </div>
          ))}
        </section>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="metric-card h-20 animate-pulse" />
          ))}
        </div>
      )}

      <section className="glass-panel mt-6 p-5">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--violet-bright)]">Activité récente</p>
        <h2 className="mt-1 text-lg font-black text-[var(--ink)]">Derniers passages et récompenses</h2>
        {recent.length === 0 ? (
          <p className="mt-4 text-sm text-[var(--muted)]">Aucune activité récente.</p>
        ) : (
          <div className="mt-4">
            {recent.map((item) => (
              <div key={item.id} className="recent-activity-row">
                <div className="grid h-9 w-9 place-items-center rounded-full bg-white/8 text-xs font-bold uppercase text-[var(--violet-bright)]">
                  {item.firstName.slice(0, 1)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-[var(--ink)]">{activityLabel(item)}</p>
                  <p className="text-xs text-[var(--muted)]">
                    {new Date(item.createdAt).toLocaleString("fr-FR")} · {item.actor}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="mt-6 grid gap-3 sm:grid-cols-3">
        {[
          ["Clients", "/app/clients", "Liste compacte"],
          ["Équipe", "/app/employes", "Rôles et accès"],
          ["Programme", "/app/parametres/programme", "Fidélité et avantages"],
        ].map(([label, href, hint]) => (
          <Link key={href} href={href} className="metric-card block p-4 transition hover:-translate-y-0.5">
            <p className="font-bold text-[var(--ink)]">{label}</p>
            <p className="mt-0.5 text-xs text-[var(--muted)]">{hint}</p>
          </Link>
        ))}
      </section>
    </main>
  );
}
