"use client";

import { useEffect, useState } from "react";
import { SuperAdminShell } from "@/components/super-admin/layout-shell";
import { PlatformChart } from "@/components/super-admin/platform-chart";

export function StatisticsPage({ firstName }: { firstName: string }) {
  const [period, setPeriod] = useState<"7d" | "30d" | "90d" | "12m">("30d");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    void fetch(`/api/super-admin/dashboard/series?period=${period}`)
      .then((r) => r.json())
      .then((json) => {
        setData(json);
        setLoading(false);
      });
  }, [period]);

  const series = data?.series?.series;

  return (
    <SuperAdminShell firstName={firstName}>
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-2xl font-black text-[var(--ink)]">Statistiques</h1>
          <select className="rounded-xl border border-white/10 bg-[var(--surface)] px-3 py-2 text-sm" value={period} onChange={(e) => setPeriod(e.target.value as typeof period)}>
            <option value="7d">7 jours</option>
            <option value="30d">30 jours</option>
            <option value="90d">90 jours</option>
            <option value="12m">12 mois</option>
          </select>
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          <PlatformChart title="Nouveaux commerces" data={series?.newMerchants ?? []} loading={loading} color="#875BFF" />
          <PlatformChart title="Nouveaux clients" data={series?.newCustomers ?? []} loading={loading} color="#5B8CFF" />
          <PlatformChart title="Scans" data={series?.scans ?? []} loading={loading} color="#34D399" />
          <PlatformChart title="Transactions fidélité" data={series?.transactions ?? []} loading={loading} color="#FBBF24" />
          <PlatformChart title="Points distribués" data={series?.pointsEarned ?? []} loading={loading} color="#A78BFA" />
          <PlatformChart title="Points utilisés" data={series?.pointsUsed ?? []} loading={loading} color="#FB7185" />
          <PlatformChart title="Revenus encaissés" data={series?.collectedRevenue ?? []} loading={loading} color="#38BDF8" />
        </div>
      </div>
    </SuperAdminShell>
  );
}
