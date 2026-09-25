"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { SuperAdminShell } from "@/components/super-admin/layout-shell";
import { PlatformChart } from "@/components/super-admin/platform-chart";
import { StatCard } from "@/components/super-admin/stat-card";
import { Card } from "@/components/ui";

type Overview = {
  merchants: { total: number; active: number; trial: number; suspended: number; archived: number; draft: number; new30d: number };
  customers: { total: number; active30d: number };
  cards: { publishedTemplates: number };
  employees: { active: number };
  insight: { enabled: number };
  activity: {
    scans: number;
    loyaltyTransactions: number;
    pointsDistributed: number;
    pointsUsed: number;
    pointsExpired: number;
    passagesGranted: number;
    rewardsUnlocked: number;
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
  alerts: { insightPending: number; pastDue: number; trialEndingSoon: number };
  recentActivity: { id: string; action: string; actorName: string | null; merchantName: string | null; createdAt: string }[];
};

const ACTIVITY_LABELS: Record<string, string> = {
  MERCHANT_CREATE: "Commerce créé",
  MERCHANT_SUSPEND: "Commerce suspendu",
  MERCHANT_REACTIVATE: "Commerce réactivé",
  MERCHANT_ARCHIVE: "Commerce archivé",
  MERCHANT_RESTORE: "Commerce restauré",
  MERCHANT_DELETE_REQUESTED: "Archivage demandé",
  MERCHANT_SETTINGS_UPDATE: "Réglages commerce modifiés",
  INSIGHT_ENABLED: "Fideto Insight activé",
  INSIGHT_DISABLED: "Fideto Insight désactivé",
  INSIGHT_ACTIVATION_REQUESTED: "Demande Fideto Insight",
  LOYALTY_PROGRAM_PUBLISH: "Programme publié",
  CARD_TEMPLATE_PUBLISH: "Carte publiée",
  SUPER_ADMIN_LOGIN: "Connexion super-admin",
};

const QUICK_LINKS = [
  ["Créer un commerce", "/super-admin/commerces/nouveau", "Nouvel onboarding"],
  ["Commerces", "/super-admin/commerces", "Gérer le réseau"],
  ["Abonnements", "/super-admin/abonnements", "Plans et Fideto Insight"],
  ["Sécurité et audit", "/super-admin/audit", "Journal complet"],
] as const;

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
        // La réponse est doublement imbriquée : { series: { period, series: {...}, comparison } }.
        setSeries(seriesData?.series?.series ?? null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur");
      } finally {
        setLoading(false);
      }
    }
    void load();
  }, []);

  const alertItems = overview
    ? [
        {
          key: "insight",
          count: overview.alerts.insightPending,
          label: "demande(s) Fideto Insight",
          hint: "En attente d'activation manuelle",
          href: "/super-admin/abonnements",
          tone: "warn" as const,
        },
        {
          key: "pastdue",
          count: overview.alerts.pastDue,
          label: "abonnement(s) en retard de paiement",
          hint: "Statut PAST_DUE à vérifier",
          href: "/super-admin/abonnements",
          tone: "danger" as const,
        },
        {
          key: "trial",
          count: overview.alerts.trialEndingSoon,
          label: "essai(s) se terminant sous 3 jours",
          hint: "À convertir ou relancer",
          href: "/super-admin/abonnements",
          tone: "warn" as const,
        },
      ].filter((item) => item.count > 0)
    : [];

  return (
    <SuperAdminShell firstName={firstName}>
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-[var(--panel-text)]">Vue d&apos;ensemble</h1>
            <p className="text-sm text-[var(--muted-text)]">La santé du réseau Fideto, sans bruit inutile.</p>
          </div>
          <Link href="/super-admin/commerces/nouveau" className="glass-cta px-4 py-2.5 text-sm">
            + Créer un commerce
          </Link>
        </div>

        {error ? <p className="text-sm text-[var(--danger)]">{error}</p> : null}

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Commerces"
            value={overview?.merchants.total ?? "—"}
            sub={`${overview?.merchants.active ?? 0} actifs · ${overview?.merchants.trial ?? 0} essai · ${overview?.merchants.draft ?? 0} brouillon`}
          />
          <StatCard label="Clients Fideto" value={overview?.customers.total ?? "—"} sub={`${overview?.customers.active30d ?? 0} actifs / 30 j`} />
          <StatCard
            label="Insight activé"
            value={overview?.insight.enabled ?? "—"}
            sub={overview ? `${overview.alerts.insightPending} demande(s) en attente` : ""}
          />
          <StatCard label="Nouveaux commerces / 30 j" value={overview?.merchants.new30d ?? "—"} sub={`${overview?.merchants.suspended ?? 0} suspendus · ${overview?.merchants.archived ?? 0} archivés`} />
        </section>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Scans" value={overview?.activity.scans ?? "—"} sub={`${overview?.activity.loyaltyTransactions ?? 0} transactions`} />
          <StatCard label="Points distribués" value={overview?.activity.pointsDistributed ?? "—"} sub={`${overview?.activity.pointsUsed ?? 0} utilisés`} />
          <StatCard label="Récompenses" value={overview?.activity.rewardsUsed ?? "—"} sub={`${overview?.activity.rewardsUnlocked ?? 0} débloquées`} />
          <StatCard label="Abonnements actifs" value={overview?.billing.activeSubscriptions ?? "—"} sub={`${overview?.billing.trialSubscriptions ?? 0} en essai`} />
        </section>

        <section className="grid gap-4 lg:grid-cols-2">
          <PlatformChart title="Évolution du réseau (30 j)" data={series?.collectedRevenue ?? []} loading={loading} color="#5B8CFF" />

          <Card className="p-4 sm:p-5">
            <h3 className="mb-3 text-sm font-bold uppercase tracking-widest text-[var(--muted-text)]">À surveiller</h3>
            {loading ? (
              <p className="text-sm text-[var(--muted-text)]">Chargement…</p>
            ) : alertItems.length === 0 ? (
              <p className="text-sm text-[var(--positive)]">Aucun incident critique — dernières 24 heures.</p>
            ) : (
              <ul className="space-y-2">
                {alertItems.map((item) => (
                  <li key={item.key}>
                    <Link
                      href={item.href}
                      className="flex items-center justify-between gap-3 rounded-xl border border-[var(--stroke)] px-3 py-2.5 transition hover:bg-[var(--surface)]"
                    >
                      <span className="min-w-0">
                        <span className="block text-sm font-bold text-[var(--panel-text)]">
                          {item.count} {item.label}
                        </span>
                        <span className="block text-xs text-[var(--muted-text)]">{item.hint}</span>
                      </span>
                      <span
                        className={
                          item.tone === "danger"
                            ? "shrink-0 rounded-full bg-[var(--danger)]/15 px-2 py-1 text-[10px] font-black uppercase text-[var(--danger)]"
                            : "shrink-0 rounded-full bg-amber-400/15 px-2 py-1 text-[10px] font-black uppercase text-amber-500"
                        }
                      >
                        À traiter
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </section>

        <section className="grid gap-4 lg:grid-cols-2">
          <Card className="p-4 sm:p-5">
            <h3 className="mb-3 text-sm font-bold uppercase tracking-widest text-[var(--muted-text)]">Activité récente</h3>
            {loading ? (
              <p className="text-sm text-[var(--muted-text)]">Chargement…</p>
            ) : !overview || overview.recentActivity.length === 0 ? (
              <p className="text-sm text-[var(--muted-text)]">Aucune activité récente.</p>
            ) : (
              <ul className="space-y-2.5">
                {overview.recentActivity.map((entry) => (
                  <li key={entry.id} className="flex items-center justify-between gap-3 text-sm">
                    <span className="min-w-0 truncate text-[var(--panel-text)]">
                      {ACTIVITY_LABELS[entry.action] ?? entry.action}
                      {entry.merchantName ? ` · ${entry.merchantName}` : ""}
                    </span>
                    <span className="shrink-0 text-xs text-[var(--muted-text)]">
                      {new Date(entry.createdAt).toLocaleString("fr-FR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          <Card className="p-4 sm:p-5">
            <h3 className="mb-3 text-sm font-bold uppercase tracking-widest text-[var(--muted-text)]">Accès rapides</h3>
            <div className="grid grid-cols-2 gap-2.5">
              {QUICK_LINKS.map(([label, href, hint]) => (
                <Link
                  key={href}
                  href={href}
                  className="rounded-xl border border-[var(--stroke)] p-3 transition hover:bg-[var(--surface)]"
                >
                  <p className="text-sm font-bold text-[var(--panel-text)]">{label}</p>
                  <p className="mt-0.5 text-xs text-[var(--muted-text)]">{hint}</p>
                </Link>
              ))}
            </div>
          </Card>
        </section>

        <section className="rounded-2xl border border-[var(--stroke)] bg-[var(--surface)] p-4 sm:p-5">
          <h3 className="mb-3 text-sm font-bold uppercase tracking-widest text-[var(--muted-text)]">Finances</h3>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
            <StatCard label="Revenu encaissé (mois)" value={overview ? `${overview.billing.collectedMonth.toFixed(2)} €` : "—"} sub="Paiements marqués PAID uniquement" />
            <StatCard label="Revenu encaissé (année)" value={overview ? `${overview.billing.collectedYear.toFixed(2)} €` : "—"} sub="Données manuelles / sans PSP connecté" />
            <StatCard label="MRR encaissable" value={overview ? `${overview.billing.mrr.toFixed(2)} €` : "—"} sub={`ACTIVE payants uniquement · ARR ${overview ? overview.billing.arr.toFixed(2) : "—"} €`} />
            <StatCard label="Prévisionnel contractuel" value={overview ? `${overview.billing.contractualForecast.toFixed(2)} € / mois` : "—"} sub="Distinct du revenu encaissé" />
            <StatCard label="Potentiel essais" value={overview ? `${overview.billing.trialPotentialMrr.toFixed(2)} € / mois` : "—"} sub={`${overview?.billing.trialSubscriptions ?? 0} essai(s) · essais gratuits exclus du MRR`} />
          </div>
          <p className="mt-3 text-xs text-[var(--muted-text)]">
            Aucun prestataire de paiement connecté — les montants contractuels ne représentent pas de l&apos;argent réellement encaissé.
          </p>
        </section>
      </div>
    </SuperAdminShell>
  );
}
