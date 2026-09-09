"use client";

import { useEffect, useState } from "react";
import { SuperAdminShell } from "@/components/super-admin/layout-shell";
import { PlatformChart } from "@/components/super-admin/platform-chart";
import { StatCard } from "@/components/super-admin/stat-card";

type Overview = {
  merchants: { total: number; active: number; trial: number; suspended: number; archived: number; new30d: number };
  customers: { total: number; active30d: number };
  cards: { publishedTemplates: number };
  employees: { active: number };
  activity: {
    scans: number;
    loyaltyTransactions: number;
    pointsDistributed: number;
    pointsUsed: number;
    passagesGranted: number;
    rewardsUsed: number;
  };
  billing: {
    mrr: number;
    arr: number;
    collectedMonth: number;
    collectedYear: number;
    contractualForecast: number;
    trialPotentialMrr: number;
    activeSubscriptions: number;
    trialSubscriptions: number;
    pastDueSubscriptions: number;
    hasPaymentProvider: false;
  };
};

export function DashboardHome({ firstName }: { firstName: string }) {
  const [overview, setOverview] = useState<Overview | null>(null);
  const [series, setSeries] = useState<{ collectedRevenue: { date: string; value: number }[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const [overviewRes, seriesRes] = await Promise.all([
          fetch("/api/super-admin/dashboard/overview"),
          fetch("/api/super-admin/dashboard/series?period=30d"),
        ]);
        if (!overviewRes.ok) throw new Error("Impossible de charger le dashboard.");
        const overviewData = await overviewRes.json();
        const seriesData = seriesRes.ok ? await seriesRes.json() : null;
        setOverview(overviewData);
        setSeries(seriesData?.series ?? null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur");
      } finally {
        setLoading(false);
      }
    }
    void load();
  }, []);

  return (
    <SuperAdminShell firstName={firstName}>
      <div className="mx-auto max-w-7xl space-y-8">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-[var(--ink)]">Vue d&apos;ensemble</h1>
          <p className="text-sm text-[var(--muted-text)]">Indicateurs globaux de la plateforme Fife Life.</p>
        </div>

        {error ? <p className="text-sm text-[var(--danger)]">{error}</p> : null}

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Commerces" value={overview?.merchants.total ?? "—"} sub={`${overview?.merchants.active ?? 0} actifs · ${overview?.merchants.trial ?? 0} essai`} />
          <StatCard label="Clients" value={overview?.customers.total ?? "—"} sub={`${overview?.customers.active30d ?? 0} actifs / 30 j`} />
          <StatCard label="Scans" value={overview?.activity.scans ?? "—"} sub={`${overview?.activity.loyaltyTransactions ?? 0} transactions`} />
          <StatCard label="Cartes publiées" value={overview?.cards.publishedTemplates ?? "—"} sub={`${overview?.employees.active ?? 0} employés actifs`} />
        </section>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Points distribués" value={overview?.activity.pointsDistributed ?? "—"} sub={`${overview?.activity.pointsUsed ?? 0} utilisés`} />
          <StatCard label="Passages accordés" value={overview?.activity.passagesGranted ?? "—"} sub={`${overview?.activity.rewardsUsed ?? 0} récompenses utilisées`} />
          <StatCard label="Nouveaux commerces / 30 j" value={overview?.merchants.new30d ?? "—"} sub={`${overview?.merchants.suspended ?? 0} suspendus · ${overview?.merchants.archived ?? 0} archivés`} />
          <StatCard label="Abonnements actifs" value={overview?.billing.activeSubscriptions ?? "—"} sub={`${overview?.billing.trialSubscriptions ?? 0} en essai`} />
        </section>

        <section className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-[var(--surface)] p-4">
            <h3 className="mb-3 text-sm font-bold uppercase tracking-widest text-[var(--muted-text)]">Finances</h3>
            <div className="grid gap-3 sm:grid-cols-2">
              <StatCard label="Revenu encaissé (mois)" value={overview ? `${overview.billing.collectedMonth.toFixed(2)} €` : "—"} sub="Paiements marqués PAID uniquement" />
              <StatCard label="Revenu encaissé (année)" value={overview ? `${overview.billing.collectedYear.toFixed(2)} €` : "—"} sub="Données manuelles / sans PSP connecté" />
              <StatCard label="MRR encaissable" value={overview ? `${overview.billing.mrr.toFixed(2)} €` : "—"} sub={`ACTIVE payants uniquement · ARR ${overview ? overview.billing.arr.toFixed(2) : "—"} €`} />
              <StatCard label="Prévisionnel contractuel" value={overview ? `${overview.billing.contractualForecast.toFixed(2)} € / mois` : "—"} sub="Distinct du revenu encaissé" />
              <StatCard label="Potentiel essais" value={overview ? `${overview.billing.trialPotentialMrr.toFixed(2)} € / mois` : "—"} sub={`${overview?.billing.trialSubscriptions ?? 0} essai(s) · essais gratuits exclus du MRR`} />
            </div>
            <p className="mt-3 text-xs text-[var(--muted-text)]">
              Aucun prestataire de paiement connecté — les montants contractuels ne représentent pas de l&apos;argent réellement encaissé.
            </p>
          </div>
          <PlatformChart
            title="Revenus encaissés (30 j)"
            data={series?.collectedRevenue ?? []}
            loading={loading}
            color="#5B8CFF"
          />
        </section>
      </div>
    </SuperAdminShell>
  );
}
