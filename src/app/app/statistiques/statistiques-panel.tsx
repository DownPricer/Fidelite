"use client";

import { useEffect, useMemo, useState } from "react";
import { MerchantPageHeader, MerchantPageShell } from "@/components/merchant/merchant-ui";
import {
  InsightBarChart,
  InsightCard,
  InsightDonutChart,
  InsightHeatmap,
  InsightLineChart,
  InsightMultiLineChart,
  KpiCard,
  TrendBadge,
} from "@/components/merchant/insight-charts";
import { formatEurosFromCents } from "@/lib/money";
import type { FreeMerchantStats, InsightPremium } from "@/lib/insight-stats";

type LockedPlaceholder = {
  overview: { activeClients: number; returningClients: number; visits: number; changePct: number };
  frequentationSeries: { date: string; value: number }[];
  segments: { key: string; label: string; value: number }[];
};

type ApiResponse = {
  period: string;
  free: FreeMerchantStats;
  locked: boolean;
  premium: InsightPremium | null;
  previewPlaceholder: LockedPlaceholder | null;
};

type PeriodKey = "7d" | "30d" | "90d" | "12m" | "custom";
type Tab = "apercu" | "frequentation" | "fidelite" | "recompenses" | "equipe" | "finances";

const PERIOD_LABELS: Record<PeriodKey, string> = {
  "7d": "7 jours",
  "30d": "30 jours",
  "90d": "90 jours",
  "12m": "12 mois",
  custom: "Personnalisée",
};

const COMPARISON_METRICS = [
  { key: "passages", label: "Passages", color: "#2563EB" },
  { key: "scans", label: "Scans", color: "#059669" },
  { key: "newClients", label: "Nouveaux clients", color: "#D97706" },
  { key: "returningClients", label: "Clients récurrents", color: "#7C3AED" },
  { key: "rewardsUsed", label: "Récompenses utilisées", color: "#E11D48" },
  { key: "revenueCents", label: "Chiffre d'affaires", color: "#0F766E" },
] as const;

export const MIN_COMPARISON_METRICS = 1;
export const MAX_COMPARISON_METRICS = 4;

/**
 * Bascule un seul indicateur du comparateur, sans jamais toucher aux autres.
 * Pure et testable indépendamment du rendu React.
 */
export function toggleComparisonMetric(current: string[], key: string): string[] {
  if (current.includes(key)) {
    if (current.length <= MIN_COMPARISON_METRICS) return current;
    return current.filter((item) => item !== key);
  }
  if (current.length >= MAX_COMPARISON_METRICS) return current;
  return [...current, key];
}

function fmtNum(n: number) {
  return n.toLocaleString("fr-FR");
}

function fmtDays(n: number | null) {
  if (n === null) return "—";
  return `${n.toFixed(1)} j`;
}

export function StatistiquesPanel({
  canManageInsight,
  demoData,
}: {
  canManageInsight: boolean;
  demoData?: ApiResponse;
}) {
  const [period, setPeriod] = useState<PeriodKey>((demoData?.period as PeriodKey) ?? "30d");
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");
  const [showComparison, setShowComparison] = useState(true);
  const [comparisonKeys, setComparisonKeys] = useState<string[]>(["passages", "scans", "newClients"]);
  const [tab, setTab] = useState<Tab>("apercu");
  const [data, setData] = useState<ApiResponse | null>(demoData ?? null);
  const [loading, setLoading] = useState(!demoData);
  const [requestState, setRequestState] = useState<"idle" | "sending" | "sent">("idle");

  useEffect(() => {
    if (demoData) return;
    if (period === "custom" && (!customFrom || !customTo)) return;
    setLoading(true);
    const params = new URLSearchParams({ period });
    if (period === "custom") {
      params.set("from", customFrom);
      params.set("to", customTo);
    }
    void fetch(`/api/merchant/statistics?${params.toString()}`)
      .then((r) => r.json())
      .then((json: ApiResponse) => {
        setData(json);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [demoData, period, customFrom, customTo]);

  async function requestActivation() {
    setRequestState("sending");
    try {
      await fetch("/api/merchant/insight/activation-request", { method: "POST" });
      setRequestState("sent");
    } catch {
      setRequestState("idle");
    }
  }

  const free = data?.free;
  const premium = data?.premium ?? null;
  const locked = data?.locked ?? true;
  const placeholder = data?.previewPlaceholder ?? null;

  const tabs: { key: Tab; label: string }[] = useMemo(() => {
    const base: { key: Tab; label: string }[] = [
      { key: "apercu", label: "Vue d'ensemble" },
      { key: "frequentation", label: "Fréquentation" },
      { key: "fidelite", label: "Fidélité" },
      { key: "recompenses", label: "Récompenses" },
      { key: "equipe", label: "Équipe" },
    ];
    if (premium?.financial) base.push({ key: "finances", label: "Finances" });
    return base;
  }, [premium]);

  return (
    <MerchantPageShell>
      <MerchantPageHeader
        eyebrow="Analytique"
        title="Statistiques"
        subtitle="Suivez l'activité de votre programme et découvrez ce qui fidélise réellement vos clients."
        backHref="/app/outils"
      />

      <div className="mb-6 flex flex-wrap items-center gap-2">
        {(["7d", "30d", "90d", "12m", "custom"] as PeriodKey[]).map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => setPeriod(key)}
            className={`merchant-filter-chip ${period === key ? "merchant-filter-chip-active" : ""}`}
          >
            {PERIOD_LABELS[key]}
          </button>
        ))}
        {period === "custom" ? (
          <span className="flex items-center gap-2">
            <input
              type="date"
              value={customFrom}
              onChange={(e) => setCustomFrom(e.target.value)}
              className="rounded-lg border border-[light-dark(rgba(15,15,25,0.12),rgba(255,255,255,0.12))] bg-[var(--surface)] px-2 py-1.5 text-xs text-[var(--ink)]"
            />
            <span className="text-xs text-[var(--muted)]">→</span>
            <input
              type="date"
              value={customTo}
              onChange={(e) => setCustomTo(e.target.value)}
              className="rounded-lg border border-[light-dark(rgba(15,15,25,0.12),rgba(255,255,255,0.12))] bg-[var(--surface)] px-2 py-1.5 text-xs text-[var(--ink)]"
            />
          </span>
        ) : null}
        <label className="ml-auto flex items-center gap-2 text-xs font-semibold text-[var(--muted-strong)]">
          <input type="checkbox" checked={showComparison} onChange={(e) => setShowComparison(e.target.checked)} />
          Comparer à la période précédente
        </label>
      </div>

      {/* Statistiques gratuites — jamais floutées */}
      <section className="mb-8">
        <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--violet-bright)]">
          Statistiques gratuites
        </p>
        {!free ? (
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="metric-card h-20 animate-pulse" />
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
              <KpiCard label="Clients totaux" value={fmtNum(free.totalClients)} showTrend={false} />
              <KpiCard label="Actifs (30j)" value={fmtNum(free.activeClients30d)} showTrend={false} />
              <KpiCard label="Nouveaux (semaine)" value={fmtNum(free.newClientsThisWeek)} showTrend={false} />
              <KpiCard label="Passages (semaine)" value={fmtNum(free.passagesThisWeek)} showTrend={false} />
              <KpiCard label="Scans validés (semaine)" value={fmtNum(free.scansValidatedThisWeek)} showTrend={false} />
            </div>
            <div className="mt-4">
              <InsightCard title="Passages" subtitle={`Sur la période sélectionnée (${PERIOD_LABELS[period]})`}>
                <InsightLineChart data={free.passagesSeries} />
              </InsightCard>
            </div>
            {free.revenue ? (
              <div className="mt-4">
                <KpiCard label="Montant enregistré sur la période" value={free.revenue.amountCentsLabel} showTrend={false} />
              </div>
            ) : null}
          </>
        )}
      </section>

      {/* Fideto Insight */}
      <section>
        <div className="mb-3 flex items-center justify-between gap-2">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--violet-bright)]">Fideto Insight</p>
          {loading && <span className="text-xs text-[var(--muted)]">Chargement…</span>}
        </div>

        {locked ? (
          <LockedInsightTeaser
            placeholder={placeholder}
            canManageInsight={canManageInsight}
            requestState={requestState}
            onRequest={requestActivation}
          />
        ) : premium ? (
          <div>
            <div className="mb-4 flex flex-wrap gap-2">
              {tabs.map((t) => (
                <button
                  key={t.key}
                  type="button"
                  onClick={() => setTab(t.key)}
                  className={`merchant-filter-chip ${tab === t.key ? "merchant-filter-chip-active" : ""}`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {tab === "apercu" && (
              <OverviewTab
                premium={premium}
                showComparison={showComparison}
                comparisonKeys={comparisonKeys}
                setComparisonKeys={setComparisonKeys}
              />
            )}
            {tab === "frequentation" && <FrequentationTab premium={premium} />}
            {tab === "fidelite" && <FideliteTab premium={premium} />}
            {tab === "recompenses" && <RecompensesTab premium={premium} showComparison={showComparison} />}
            {tab === "equipe" && <EquipeTab premium={premium} />}
            {tab === "finances" && premium.financial && (
              <FinancesTab financial={premium.financial} showComparison={showComparison} />
            )}
          </div>
        ) : null}
      </section>
    </MerchantPageShell>
  );
}

function LockedInsightTeaser({
  placeholder,
  canManageInsight,
  requestState,
  onRequest,
}: {
  placeholder: LockedPlaceholder | null;
  canManageInsight: boolean;
  requestState: "idle" | "sending" | "sent";
  onRequest: () => void;
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-[light-dark(rgba(122,69,242,0.18),rgba(122,69,242,0.24))] bg-[var(--surface)]">
      <div aria-hidden className="pointer-events-none select-none blur-md">
        <div className="grid grid-cols-2 gap-3 p-5 lg:grid-cols-4">
          <KpiCard label="Clients actifs" value={placeholder?.overview.activeClients ?? 0} showTrend={false} />
          <KpiCard label="Clients revenus" value={placeholder?.overview.returningClients ?? 0} showTrend={false} />
          <KpiCard label="Passages" value={placeholder?.overview.visits ?? 0} showTrend={false} />
          <KpiCard label="Évolution" value={`+${placeholder?.overview.changePct ?? 0}%`} showTrend={false} />
        </div>
        <div className="px-5 pb-5">
          <InsightLineChart data={placeholder?.frequentationSeries ?? []} />
        </div>
      </div>

      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[light-dark(rgba(247,245,251,0.72),rgba(9,9,17,0.72))] px-6 text-center">
        <span className="grid h-11 w-11 place-items-center rounded-full bg-[var(--violet-bright)]/15 text-[var(--violet-bright)]">
          <svg viewBox="0 0 24 24" width={22} height={22} fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="5" y="11" width="14" height="9" rx="2" />
            <path d="M8 11V7a4 4 0 018 0v4" strokeLinecap="round" />
          </svg>
        </span>
        <h3 className="text-lg font-black text-[var(--ink)]">Passez à Fideto Insight</h3>
        <p className="max-w-md text-sm text-[var(--muted-strong)]">
          Comprenez les habitudes de vos clients, mesurez leur fidélité et identifiez les meilleures actions pour les
          faire revenir.
        </p>
        <p className="text-xl font-black text-[var(--violet-bright)]">+10 € / mois</p>
        <ul className="grid max-w-md grid-cols-2 gap-x-4 gap-y-1 text-left text-xs text-[var(--muted-strong)]">
          <li>· Analyse de la fidélité</li>
          <li>· Fréquentation par jour et par heure</li>
          <li>· Clients fidèles, nouveaux ou inactifs</li>
          <li>· Performance des récompenses</li>
          <li>· Comparaison des périodes</li>
          <li>· Rapports détaillés</li>
        </ul>
        {canManageInsight ? (
          <button type="button" onClick={onRequest} disabled={requestState !== "idle"} className="glass-cta mt-1 px-5 py-2.5 text-sm disabled:opacity-60">
            {requestState === "sent" ? "Demande envoyée ✓" : requestState === "sending" ? "Envoi…" : "Débloquer Fideto Insight"}
          </button>
        ) : (
          <p className="text-xs text-[var(--muted)]">Seul le propriétaire du commerce peut activer Fideto Insight.</p>
        )}
      </div>
    </div>
  );
}

function normalizeBase100(rows: NonNullable<InsightPremium["comparison"]>["series"], keys: string[]) {
  const firstPositive = new Map<string, number>();
  for (const key of keys) {
    const first = rows.find((row) => Number(row[key as keyof typeof row] ?? 0) > 0);
    firstPositive.set(key, first ? Number(first[key as keyof typeof first] ?? 0) : 0);
  }
  return rows.map((row) => {
    const next: Record<string, string | number> = { date: row.date };
    for (const key of keys) {
      const base = firstPositive.get(key) ?? 0;
      const value = Number(row[key as keyof typeof row] ?? 0);
      next[key] = base > 0 ? Math.round((value / base) * 100) : 0;
    }
    return next;
  });
}

function OverviewTab({
  premium,
  showComparison,
  comparisonKeys,
  setComparisonKeys,
}: {
  premium: InsightPremium;
  showComparison: boolean;
  comparisonKeys: string[];
  setComparisonKeys: (keys: string[]) => void;
}) {
  const o = premium.overview;
  const availableMetrics = COMPARISON_METRICS.filter((metric) => metric.key !== "revenueCents" || premium.comparison.hasRevenue);
  const selectedSeries = availableMetrics.filter((metric) => comparisonKeys.includes(metric.key));
  const comparisonData = normalizeBase100(premium.comparison.series, comparisonKeys);

  function toggleMetric(key: string) {
    setComparisonKeys(toggleComparisonMetric(comparisonKeys, key));
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <KpiCard label="Clients totaux" value={fmtNum(o.totalClients.current)} changePct={showComparison ? o.totalClients.changePct : undefined} />
        <KpiCard label="Clients actifs" value={fmtNum(o.activeClients.current)} changePct={showComparison ? o.activeClients.changePct : undefined} />
        <KpiCard label="Nouveaux clients" value={fmtNum(o.newClients.current)} changePct={showComparison ? o.newClients.changePct : undefined} />
        <KpiCard label="Clients revenus" value={fmtNum(o.returningClients.current)} changePct={showComparison ? o.returningClients.changePct : undefined} />
        <KpiCard label="Passages" value={fmtNum(o.passages.current)} changePct={showComparison ? o.passages.changePct : undefined} />
        <KpiCard label="Scans validés" value={fmtNum(o.scansValidated.current)} changePct={showComparison ? o.scansValidated.changePct : undefined} />
        <KpiCard label="Récompenses utilisées" value={fmtNum(o.rewardsUsed.current)} changePct={showComparison ? o.rewardsUsed.changePct : undefined} />
      </div>
      <InsightCard
        title="Comparer les indicateurs"
        subtitle="Évolution en base 100 : chaque courbe démarre à 100 lors de sa première valeur non nulle. Passages est affiché par défaut : plus besoin d'un graphique « Passages » séparé au-dessus."
      >
        <div className="mb-3 flex flex-wrap gap-2" role="group" aria-label="Indicateurs à comparer (4 maximum)">
          {availableMetrics.map((metric) => {
            const active = comparisonKeys.includes(metric.key);
            const disabled =
              (!active && comparisonKeys.length >= MAX_COMPARISON_METRICS) ||
              (active && comparisonKeys.length <= MIN_COMPARISON_METRICS);
            return (
              <button
                key={metric.key}
                id={`comparison-metric-${metric.key}`}
                type="button"
                disabled={disabled}
                aria-pressed={active}
                onClick={() => toggleMetric(metric.key)}
                className={`merchant-filter-chip ${active ? "merchant-filter-chip-active" : ""} disabled:opacity-45`}
              >
                {metric.label}
              </button>
            );
          })}
        </div>
        <InsightMultiLineChart data={comparisonData} series={selectedSeries} normalized />
      </InsightCard>
    </div>
  );
}

function FrequentationTab({ premium }: { premium: InsightPremium }) {
  const f = premium.frequentation;
  return (
    <div className="space-y-4">
      <InsightCard title="Nouveaux vs clients récurrents">
        <InsightMultiLineChart
          data={f.newVsReturningSeries}
          series={[
            { key: "new", label: "Nouveaux", color: "#5B8CFF" },
            { key: "returning", label: "Récurrents", color: "#7A45F2" },
          ]}
        />
      </InsightCard>
      <div className="grid gap-4 md:grid-cols-2">
        <InsightCard title="Passages par jour de semaine">
          <InsightBarChart data={f.byWeekday} />
        </InsightCard>
        <InsightCard title="Chiffres clés">
          <div className="grid grid-cols-2 gap-3">
            <KpiCard label="Passages / client" value={f.avgVisitsPerClient.toFixed(1)} showTrend={false} />
            <KpiCard label="Jours entre 2 visites" value={fmtDays(f.avgDaysBetweenVisits)} showTrend={false} />
            <KpiCard label="Jour le plus actif" value={f.busiestDay ?? "—"} showTrend={false} />
            <KpiCard label="Créneau le plus actif" value={f.busiestHour !== null ? `${f.busiestHour}h` : "—"} showTrend={false} />
          </div>
        </InsightCard>
      </div>
      <InsightCard title="Carte de chaleur" subtitle="Passages par jour et par heure">
        <InsightHeatmap data={f.heatmap} />
      </InsightCard>
    </div>
  );
}

function FideliteTab({ premium }: { premium: InsightPremium }) {
  const r = premium.retention;
  const s = premium.segments.segments;
  const pct = (v: number | null) => (v === null ? "—" : `${v.toFixed(0)}%`);
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <KpiCard label="Retour sous 7j" value={pct(r.returnRate7d)} showTrend={false} />
        <KpiCard label="Retour sous 30j" value={pct(r.returnRate30d)} showTrend={false} />
        <KpiCard label="Retour sous 90j" value={pct(r.returnRate90d)} showTrend={false} />
        <KpiCard label="Fréquence moyenne" value={fmtDays(r.avgVisitFrequencyDays)} showTrend={false} />
        <KpiCard label="Inactifs 30j" value={fmtNum(r.inactive30d)} showTrend={false} />
        <KpiCard label="Inactifs 60j" value={fmtNum(r.inactive60d)} showTrend={false} />
        <KpiCard label="Inactifs 90j" value={fmtNum(r.inactive90d)} showTrend={false} />
        <KpiCard label="Réactivés" value={fmtNum(r.reactivated)} showTrend={false} />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <InsightCard title="Segments clients">
          <InsightDonutChart data={s.map((seg) => ({ key: seg.key, label: seg.label, value: seg.size }))} />
        </InsightCard>
        <InsightCard title="Détail des segments">
          <ul className="space-y-2">
            {s.map((seg) => (
              <li key={seg.key} className="flex items-center justify-between gap-2 border-b border-[light-dark(rgba(15,15,25,0.06),rgba(255,255,255,0.06))] pb-2 last:border-0">
                <div>
                  <p className="text-sm font-bold text-[var(--ink)]">{seg.label}</p>
                  <p className="text-xs text-[var(--muted)]">{seg.description}</p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <span className="text-sm font-black text-[var(--ink)]">{seg.size}</span>
                  <TrendBadge changePct={seg.changePct} />
                </div>
              </li>
            ))}
          </ul>
        </InsightCard>
      </div>

      {r.cohorts.length > 0 && (
        <InsightCard title="Rétention par cohorte" subtitle="Semaine de première visite, dans la période affichée">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[480px] text-left text-xs">
              <thead>
                <tr className="text-[var(--muted)]">
                  <th className="py-1 pr-3">Cohorte</th>
                  <th className="py-1 pr-3">Taille</th>
                  {r.cohorts[0]?.retention.map((_, i) => (
                    <th key={i} className="py-1 pr-3">S+{i}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {r.cohorts.map((c) => (
                  <tr key={c.cohortWeek} className="border-t border-[light-dark(rgba(15,15,25,0.06),rgba(255,255,255,0.06))]">
                    <td className="py-1.5 pr-3 font-semibold text-[var(--ink)]">{c.cohortWeek}</td>
                    <td className="py-1.5 pr-3">{c.size}</td>
                    {c.retention.map((v, i) => (
                      <td key={i} className="py-1.5 pr-3">{v === null ? "—" : `${v.toFixed(0)}%`}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </InsightCard>
      )}
    </div>
  );
}

function RecompensesTab({ premium, showComparison }: { premium: InsightPremium; showComparison: boolean }) {
  const r = premium.rewards;
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <KpiCard label="Points distribués" value={fmtNum(r.pointsDistributed.current)} changePct={showComparison ? r.pointsDistributed.changePct : undefined} />
        <KpiCard label="Points utilisés" value={fmtNum(r.pointsUsed.current)} changePct={showComparison ? r.pointsUsed.changePct : undefined} />
        <KpiCard label="Solde total" value={fmtNum(r.pointsBalance)} showTrend={false} />
        <KpiCard label="Récompenses utilisées" value={fmtNum(r.rewardsUsedCount.current)} changePct={showComparison ? r.rewardsUsedCount.changePct : undefined} />
        <KpiCard label="Taux d'utilisation" value={r.redemptionRate === null ? "—" : `${r.redemptionRate.toFixed(0)}%`} showTrend={false} />
        <KpiCard label="Délai avant 1re récompense" value={fmtDays(r.avgDaysToFirstReward)} showTrend={false} />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <InsightCard title="Récompenses les plus populaires">
          {r.topRewards.length === 0 ? (
            <p className="text-sm text-[var(--muted)]">Aucune récompense utilisée sur la période.</p>
          ) : (
            <ul className="space-y-2">
              {r.topRewards.map((rw) => (
                <li key={rw.rewardId} className="flex items-center justify-between text-sm">
                  <span className="text-[var(--ink)]">{rw.rewardId}</span>
                  <span className="font-bold text-[var(--ink)]">{rw.count}</span>
                </li>
              ))}
            </ul>
          )}
        </InsightCard>
        <InsightCard title="Entonnoir" subtitle="Inscrits → revenus → récompense utilisée">
          <div className="space-y-2">
            {[
              { label: "Clients actifs sur la période", value: r.funnel.registered },
              { label: "Revenus au moins 2 fois", value: r.funnel.returned },
              { label: "Récompense utilisée", value: r.funnel.rewardUsed },
            ].map((step) => (
              <div key={step.label}>
                <div className="flex items-center justify-between text-xs text-[var(--muted-strong)]">
                  <span>{step.label}</span>
                  <span className="font-bold text-[var(--ink)]">{step.value}</span>
                </div>
                <div className="mt-1 h-2 rounded-full bg-[light-dark(rgba(15,15,25,0.08),rgba(255,255,255,0.08))]">
                  <div
                    className="h-2 rounded-full bg-[var(--violet-bright)]"
                    style={{ width: `${r.funnel.registered ? (step.value / r.funnel.registered) * 100 : 0}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </InsightCard>
      </div>
    </div>
  );
}

function EquipeTab({ premium }: { premium: InsightPremium }) {
  const employees = premium.team.employees;
  return (
    <InsightCard title="Activité de l'équipe" subtitle="Scans et validations sur la période">
      {employees.length === 0 ? (
        <p className="text-sm text-[var(--muted)]">Aucune activité employé sur la période.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[420px] text-left text-sm">
            <thead>
              <tr className="text-xs uppercase tracking-wide text-[var(--muted)]">
                <th className="py-1.5 pr-3">Employé</th>
                <th className="py-1.5 pr-3">Scans validés</th>
                <th className="py-1.5 pr-3">Scans refusés</th>
                <th className="py-1.5 pr-3">Validations</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((e) => (
                <tr key={e.userId} className="border-t border-[light-dark(rgba(15,15,25,0.06),rgba(255,255,255,0.06))]">
                  <td className="py-2 pr-3 font-semibold text-[var(--ink)]">{e.firstName}</td>
                  <td className="py-2 pr-3">{e.scansValidated}</td>
                  <td className="py-2 pr-3">{e.scansDenied}</td>
                  <td className="py-2 pr-3">{e.commits}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </InsightCard>
  );
}

function FinancesTab({
  financial,
  showComparison,
}: {
  financial: NonNullable<InsightPremium["financial"]>;
  showComparison: boolean;
}) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <KpiCard
          label="Chiffre d'affaires enregistré"
          value={formatEurosFromCents(financial.revenue.current)}
          changePct={showComparison ? financial.revenue.changePct : undefined}
        />
        <KpiCard label="Panier moyen" value={formatEurosFromCents(financial.avgBasketCents)} showTrend={false} />
        <KpiCard label="Dépense moyenne / client" value={formatEurosFromCents(financial.avgSpendPerClientCents)} showTrend={false} />
        <KpiCard label="Valeur clients fidèles" value={formatEurosFromCents(financial.loyalRewardValueCents)} showTrend={false} />
        <KpiCard label="CA lié aux récompenses" value={formatEurosFromCents(financial.revenueFromRewardsCents)} showTrend={false} />
      </div>
      <InsightCard title="Meilleurs clients" subtitle="Montant enregistré sur la période">
        {financial.topSpenders.length === 0 ? (
          <p className="text-sm text-[var(--muted)]">Aucune donnée sur la période.</p>
        ) : (
          <ul className="space-y-2">
            {financial.topSpenders.map((c) => (
              <li key={c.customerMembershipId} className="flex items-center justify-between text-sm">
                <span className="text-[var(--ink)]">{c.firstName}</span>
                <span className="font-bold text-[var(--ink)]">{formatEurosFromCents(c.totalCents)}</span>
              </li>
            ))}
          </ul>
        )}
      </InsightCard>
    </div>
  );
}
