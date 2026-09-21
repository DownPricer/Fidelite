"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui";
import { MerchantPageShell } from "@/components/merchant/merchant-ui";
import { InsightLineChart, TrendBadge } from "@/components/merchant/insight-charts";

type StatsPreview = {
  totalClients: number;
  newClientsThisWeek: number;
  passagesThisWeek: number;
  passagesSeries: { date: string; value: number }[];
};

type TrendMetric = { current: number; previous: number; changePct: number | null };

type HomeStats = {
  activeClients: TrendMetric;
  passagesThisWeek: TrendMetric;
  rewardsUsedThisWeek: TrendMetric;
  newClientsThisWeek: TrendMetric;
};

const QUICK_ACTIONS = [
  ["Caisse", "/app/caisse", "Scanner un client"],
  ["Avantages", "/app/parametres/avantages", "Créer ou modifier"],
  ["Programme", "/app/parametres/programme", "Règles de fidélité"],
  ["Clients", "/app/clients", "Liste et recherche"],
  ["Équipe", "/app/employes", "Rôles et accès"],
  ["Statistiques", "/app/statistiques", "Analytique et tendances"],
] as const;

export function MerchantHome({
  firstName,
  merchantName,
  demoStatsPreview,
  demoHomeStats,
}: {
  firstName: string;
  role: string;
  merchantName: string;
  canAdmin: boolean;
  demoStatsPreview?: StatsPreview;
  demoHomeStats?: HomeStats;
}) {
  const isDemo = Boolean(demoHomeStats);
  const [statsPreview, setStatsPreview] = useState<StatsPreview | null>(demoStatsPreview ?? null);
  const [homeStats, setHomeStats] = useState<HomeStats | null>(demoHomeStats ?? null);
  const [recent, setRecent] = useState<
    Array<{ id: string; type: string; pointsDelta: number; firstName: string; actor: string; createdAt: string }>
  >(
    isDemo
      ? [
          { id: "r1", type: "EARN_VISIT", pointsDelta: 1, firstName: "Marie", actor: "Sam", createdAt: new Date().toISOString() },
          { id: "r2", type: "REDEEM_REWARD", pointsDelta: -10, firstName: "Lucas", actor: "Noa", createdAt: new Date(Date.now() - 1800000).toISOString() },
          { id: "r3", type: "EARN_VISIT", pointsDelta: 28, firstName: "Sarah", actor: "Sam", createdAt: new Date(Date.now() - 3600000).toISOString() },
        ]
      : [],
  );

  useEffect(() => {
    if (isDemo) return;
    void fetch("/api/merchant/dashboard")
      .then((res) => res.json())
      .then((data) => {
        setRecent(data.recent ?? []);
        setStatsPreview(data.statsPreview ?? null);
        setHomeStats(data.homeStats ?? null);
      })
      .catch(() => undefined);
  }, [isDemo]);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/app/connexion";
  }

  const kpis = homeStats
    ? [
        { label: "Clients actifs (30j)", metric: homeStats.activeClients },
        { label: "Passages (semaine)", metric: homeStats.passagesThisWeek },
        { label: "Avantages utilisés (semaine)", metric: homeStats.rewardsUsedThisWeek },
        { label: "Nouveaux clients (semaine)", metric: homeStats.newClientsThisWeek },
      ]
    : null;

  function activityLabel(item: (typeof recent)[0]) {
    if (item.type === "REDEEM_REWARD") return `${item.firstName} · Récompense validée`;
    const sign = item.pointsDelta > 0 ? "+" : "";
    return `${item.firstName} · ${sign}${item.pointsDelta} ${Math.abs(item.pointsDelta) === 1 ? "passage" : "points"}`;
  }

  return (
    <MerchantPageShell>
      <header className="merchant-page-header mb-6 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--muted)]">{merchantName}</p>
          <h1 className="mt-1 font-black tracking-tight text-[var(--ink)]">Bonjour, {firstName}</h1>
          <p className="text-sm text-[var(--muted-strong)]">Voici l&apos;essentiel de votre programme aujourd&apos;hui.</p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <Button variant="ghost" onClick={() => void logout()} className="h-10 px-3 text-xs">
            Déconnexion
          </Button>
          <Link href="/app/caisse" className="glass-cta flex items-center gap-2 px-5 py-3 text-sm">
            <svg viewBox="0 0 24 24" width={18} height={18} fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden>
              <path d="M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Scanner un client
          </Link>
        </div>
      </header>

      {kpis ? (
        <section className="grid grid-cols-2 gap-3 xl:grid-cols-4" aria-label="Indicateurs clés">
          {kpis.map((kpi) => (
            <div key={kpi.label} className="metric-card px-4 py-4">
              <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted)]">{kpi.label}</p>
              <p className="mt-1 text-2xl font-black text-[var(--ink)] md:text-3xl">{kpi.metric.current}</p>
              <div className="mt-1">
                <TrendBadge changePct={kpi.metric.changePct} />
              </div>
            </div>
          ))}
        </section>
      ) : (
        <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="metric-card h-24 animate-pulse" />
          ))}
        </div>
      )}

      <div className="merchant-dashboard-grid mt-6">
        <div className="merchant-dashboard-aside">
          <section aria-label="Actions rapides">
            <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--violet-bright)]">
              Actions rapides
            </p>
            <div className="merchant-dashboard-shortcuts">
              {QUICK_ACTIONS.map(([label, href, hint]) => (
                <Link key={href} href={href} className="metric-card block p-4 transition hover:-translate-y-0.5">
                  <p className="font-bold text-[var(--ink)]">{label}</p>
                  <p className="mt-0.5 text-xs text-[var(--muted)]">{hint}</p>
                </Link>
              ))}
            </div>
          </section>

          <section className="glass-panel mt-4 p-4 md:p-5">
            <p className="font-bold text-[var(--ink)]">Aperçu des statistiques</p>
            {statsPreview ? (
              <div className="mt-2">
                <InsightLineChart data={statsPreview.passagesSeries} height={64} />
              </div>
            ) : (
              <div className="mt-3 h-16 animate-pulse rounded-xl bg-white/5" />
            )}
            <Link href="/app/statistiques" className="glass-cta mt-3 inline-flex px-4 py-2 text-xs">
              Voir les statistiques
            </Link>
          </section>
        </div>

        <section className="glass-panel p-5 md:p-6">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--violet-bright)]">Activité récente</p>
          <h2 className="mt-1 text-lg font-black text-[var(--ink)] md:text-xl">Derniers passages et récompenses</h2>
          {recent.length === 0 ? (
            <p className="mt-4 text-sm text-[var(--muted)]">Aucune activité récente.</p>
          ) : (
            <div className="mt-4 md:mt-5">
              {recent.map((item) => (
                <div key={item.id} className="recent-activity-row">
                  <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white/8 text-xs font-bold uppercase text-[var(--violet-bright)]">
                    {item.firstName.slice(0, 1)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-[var(--ink)] md:text-[15px]">{activityLabel(item)}</p>
                    <p className="text-xs text-[var(--muted)]">
                      {new Date(item.createdAt).toLocaleString("fr-FR")} · {item.actor}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </MerchantPageShell>
  );
}
