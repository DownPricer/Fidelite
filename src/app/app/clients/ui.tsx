"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui";
import {
  CompactListHeader,
  CompactListRow,
  CompactListShell,
  EmptyState,
  FilterChip,
  InitialsAvatar,
  ListToolbar,
  StatusBadge,
  TxTypeLabel,
} from "@/components/merchant/merchant-ui";
import { InsightLineChart } from "@/components/merchant/insight-charts";

type Customer = {
  id: string;
  firstName: string;
  lastName?: string | null;
  email: string;
  phone?: string | null;
  points: number;
  lastActivity: string;
};

const DEMO: Customer[] = [
  { id: "c1", firstName: "Marie", lastName: "Dupont", email: "marie@demo.local", points: 35, lastActivity: new Date().toISOString() },
  { id: "c2", firstName: "Lucas", lastName: "Martin", email: "lucas@demo.local", points: 8, lastActivity: new Date(Date.now() - 86400000).toISOString() },
  { id: "c3", firstName: "Sarah", lastName: "Petit", email: "sarah@demo.local", points: 10, lastActivity: new Date(Date.now() - 172800000).toISOString() },
  { id: "c4", firstName: "Thomas", lastName: "Bernard", email: "thomas@demo.local", points: 2, lastActivity: new Date(Date.now() - 259200000).toISOString() },
];

function formatActivity(iso: string) {
  const d = new Date(iso);
  const diff = Date.now() - d.getTime();
  if (diff < 86400000) return "Aujourd'hui";
  if (diff < 172800000) return "Hier";
  return d.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
}

export function CustomersPanel({ demo = false }: { demo?: boolean }) {
  const [customers, setCustomers] = useState<Customer[]>(demo ? DEMO : []);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("recent");
  const [loading, setLoading] = useState(!demo);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  const load = useCallback(async () => {
    if (demo) return;
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ sort, page: String(page), q: search });
      const res = await fetch(`/api/merchant/customers?${params}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Chargement impossible.");
      setCustomers((prev) => (page === 1 ? data.customers : [...prev, ...data.customers]));
      setHasMore(data.hasMore);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur.");
    } finally {
      setLoading(false);
    }
  }, [demo, sort, page, search]);

  useEffect(() => {
    if (demo) return;
    const t = setTimeout(() => void load(), search ? 250 : 0);
    return () => clearTimeout(t);
  }, [demo, load, search]);

  useEffect(() => {
    if (!demo) setPage(1);
  }, [search, sort, demo]);

  const filteredDemo = useMemo(() => {
    if (!demo) return customers;
    let list = [...DEMO];
    const q = search.toLowerCase();
    if (q) {
      list = list.filter(
        (c) =>
          c.firstName.toLowerCase().includes(q) ||
          (c.lastName ?? "").toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q),
      );
    }
    if (sort === "points") list.sort((a, b) => b.points - a.points);
    if (sort === "alpha") list.sort((a, b) => a.firstName.localeCompare(b.firstName));
    return list;
  }, [demo, customers, search, sort]);

  const list = demo ? filteredDemo : customers;

  return (
    <div>
      <ListToolbar
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Nom, e-mail ou téléphone"
        sort={
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="merchant-filter-chip bg-transparent"
            aria-label="Tri"
          >
            <option value="recent">Plus récents</option>
            <option value="active">Plus actifs</option>
            <option value="points">Plus de points</option>
            <option value="alpha">Alphabétique</option>
          </select>
        }
      />

      {error ? <p className="mb-4 text-sm text-[var(--danger)]">{error}</p> : null}

      {loading && list.length === 0 ? (
        <CompactListShell>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="compact-list-row animate-pulse">
              <div className="h-10 w-10 rounded-full bg-white/10" />
              <div className="h-4 flex-1 rounded bg-white/10" />
            </div>
          ))}
        </CompactListShell>
      ) : list.length === 0 ? (
        <EmptyState title="Aucun client" hint="Les clients apparaîtront après leur premier scan." />
      ) : (
        <CompactListShell>
          <CompactListHeader columns={["Client", "Fidélité", "Dernière activité"]} />
          {list.map((c) => (
            <CompactListRow
              key={c.id}
              href={`/app/clients/${c.id}`}
              avatar={<InitialsAvatar name={`${c.firstName} ${c.lastName ?? ""}`} />}
              title={`${c.firstName}${c.lastName ? ` ${c.lastName}` : ""}`}
              subtitle={`${c.points} passages`}
              meta={formatActivity(c.lastActivity)}
            />
          ))}
        </CompactListShell>
      )}

      {!demo && hasMore ? (
        <div className="mt-4 text-center">
          <Button variant="secondary" className="h-10 px-6 text-xs" onClick={() => setPage((p) => p + 1)}>
            Charger plus
          </Button>
        </div>
      ) : null}
    </div>
  );
}

type CustomerDetail = {
  id: string;
  firstName: string;
  lastName?: string | null;
  email: string;
  points: number;
  createdAt: string;
  merchantName?: string;
};

type CustomerTx = {
  id: string;
  type: string;
  pointsDelta: number;
  createdAt: string;
  reason?: string;
  rewardName?: string;
};

type CustomerStats = { visitsCount: number; rewardsUsedCount: number; lastActivityAt: string | null };

type CustomerInsight = {
  enabled: boolean;
  periodMonths: number;
  series: { date: string; value: number }[];
  avgBasketLabel: string | null;
  trackedSpendLabel: string | null;
  avgVisitFrequencyDays: number | null;
};

const DEMO_STATS: CustomerStats = { visitsCount: 7, rewardsUsedCount: 0, lastActivityAt: new Date().toISOString() };
const DEMO_INSIGHT: CustomerInsight = {
  enabled: false,
  periodMonths: 6,
  series: [],
  avgBasketLabel: null,
  trackedSpendLabel: null,
  avgVisitFrequencyDays: null,
};

function formatMonthLabel(key: string) {
  const [y, m] = key.split("-").map(Number);
  return new Date(y, (m ?? 1) - 1, 1).toLocaleDateString("fr-FR", { month: "short" }).replace(".", "");
}

export function CustomerDetailPanel({ id, demo = false }: { id: string; demo?: boolean }) {
  const demoCustomer = DEMO.find((c) => c.id === id);
  const [customer, setCustomer] = useState<CustomerDetail | null>(
    demoCustomer ? { ...demoCustomer, createdAt: demoCustomer.lastActivity } : null,
  );
  const [stats, setStats] = useState<CustomerStats | null>(demo ? DEMO_STATS : null);
  const [insight, setInsight] = useState<CustomerInsight | null>(demo ? DEMO_INSIGHT : null);
  const [txs, setTxs] = useState<CustomerTx[]>(
    demo
      ? [
          { id: "t1", type: "EARN_VISIT", pointsDelta: 1, createdAt: new Date().toISOString() },
          { id: "t2", type: "EARN_VISIT", pointsDelta: 1, createdAt: new Date(Date.now() - 86400000).toISOString() },
        ]
      : [],
  );
  const [loading, setLoading] = useState(!demo);
  const [insightOpen, setInsightOpen] = useState(false);
  const [insightPeriod, setInsightPeriod] = useState<"6" | "12">("6");

  const load = useCallback(
    async (period: "6" | "12") => {
      if (demo) return;
      setLoading(true);
      try {
        const res = await fetch(`/api/merchant/customers/${id}?insightPeriod=${period}`);
        const d = await res.json();
        if (d.customer) {
          setCustomer(d.customer);
          setTxs(d.transactions ?? []);
          setStats(d.stats ?? null);
          setInsight(d.insight ?? null);
        }
      } finally {
        setLoading(false);
      }
    },
    [id, demo],
  );

  useEffect(() => {
    void load(insightPeriod);
  }, [load, insightPeriod]);

  if (!customer && loading) {
    return (
      <div className="space-y-4">
        <div className="glass-panel h-28 animate-pulse" />
        <div className="grid grid-cols-3 gap-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="metric-card h-24 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (!customer) {
    return <EmptyState title="Client introuvable" />;
  }

  const fullName = `${customer.firstName}${customer.lastName ? ` ${customer.lastName}` : ""}`;
  const lastActivityLabel = stats?.lastActivityAt
    ? new Date(stats.lastActivityAt).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })
    : "—";
  const memberSinceLabel = new Date(customer.createdAt).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="space-y-4">
      <section className="glass-panel flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between md:p-6" aria-label="Identité du client">
        <div className="flex min-w-0 items-center gap-4">
          <InitialsAvatar name={fullName} size="md" />
          <div className="min-w-0">
            <h2 className="truncate text-xl font-black text-[var(--ink)] md:text-2xl">{fullName}</h2>
            <p className="truncate text-sm text-[var(--muted)]">{customer.email}</p>
          </div>
        </div>
        <div className="flex shrink-0 flex-col items-start gap-1.5 sm:items-end">
          <StatusBadge tone="ok">Membre du programme</StatusBadge>
          {customer.merchantName ? <p className="text-xs text-[var(--muted)]">{customer.merchantName}</p> : null}
        </div>
      </section>

      <section className="grid grid-cols-2 gap-3 md:grid-cols-3" aria-label="Résumé fidélité">
        <div className="metric-card px-4 py-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted)]">Passages enregistrés</p>
          <p className="mt-1 text-2xl font-black text-[var(--ink)] md:text-3xl">{stats?.visitsCount ?? customer.points}</p>
          <p className="mt-1 text-xs text-[var(--muted)]">Dans ce commerce</p>
        </div>
        <div className="metric-card px-4 py-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted)]">Dernière activité</p>
          <p className="mt-1 text-2xl font-black text-[var(--ink)] md:text-3xl">{lastActivityLabel}</p>
          <p className="mt-1 text-xs text-[var(--muted)]">Selon l&apos;historique enregistré</p>
        </div>
        <div className="metric-card col-span-2 px-4 py-4 md:col-span-1">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted)]">Avantages utilisés</p>
          <p className="mt-1 text-2xl font-black text-[var(--ink)] md:text-3xl">{stats?.rewardsUsedCount ?? "—"}</p>
          <p className="mt-1 text-xs text-[var(--muted)]">Historique complet</p>
        </div>
      </section>

      <div className="grid gap-4 lg:grid-cols-[1.3fr_0.7fr] lg:items-start">
        <section className="glass-panel p-5 md:p-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--violet-bright)]">Fidélité</p>
              <h3 className="mt-1 text-lg font-black text-[var(--ink)]">Historique des passages</h3>
            </div>
            <a href="#insight" className="text-xs font-bold text-[var(--violet-bright)] hover:text-[var(--ink)]">
              Voir Insight →
            </a>
          </div>
          {txs.length === 0 ? (
            <p className="mt-4 text-sm text-[var(--muted)]">Aucun événement daté pour l&apos;instant.</p>
          ) : (
            <div className="mt-4 divide-y divide-[var(--stroke)]">
              {txs.map((tx) => (
                <div key={tx.id} className="flex items-center justify-between gap-3 py-3">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-[var(--ink)]">
                      {tx.rewardName ?? (tx.type === "REDEEM_REWARD" ? "Récompense" : "Passage")}
                    </p>
                    <p className="text-xs text-[var(--muted)]">{new Date(tx.createdAt).toLocaleString("fr-FR")}</p>
                  </div>
                  <TxTypeLabel type={tx.type} delta={tx.pointsDelta} />
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="glass-panel p-5 md:p-6">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--violet-bright)]">Vue d&apos;ensemble</p>
          <h3 className="mt-1 text-lg font-black text-[var(--ink)]">Ce que vous savez déjà</h3>
          <dl className="mt-3 divide-y divide-[var(--stroke)] text-sm">
            <div className="flex items-center justify-between py-2.5">
              <dt className="text-[var(--muted)]">Client depuis</dt>
              <dd className="font-bold text-[var(--ink)]">{memberSinceLabel}</dd>
            </div>
            <div className="flex items-center justify-between py-2.5">
              <dt className="text-[var(--muted)]">Passages enregistrés</dt>
              <dd className="font-bold text-[var(--ink)]">{stats?.visitsCount ?? "—"}</dd>
            </div>
            <div className="flex items-center justify-between py-2.5">
              <dt className="text-[var(--muted)]">Dernière activité</dt>
              <dd className="font-bold text-[var(--ink)]">{lastActivityLabel}</dd>
            </div>
            <div className="flex items-center justify-between py-2.5">
              <dt className="text-[var(--muted)]">Panier moyen</dt>
              <dd className="font-bold text-[var(--ink)]">{insight?.avgBasketLabel ?? "Montants requis"}</dd>
            </div>
          </dl>
          {!insight?.avgBasketLabel ? (
            <p className="mt-2 text-xs text-[var(--muted)]">
              Le panier moyen nécessite des achats dont le montant a été enregistré.
            </p>
          ) : null}
        </section>
      </div>

      <section id="insight" className="glass-panel p-5 md:p-6" aria-labelledby="insight-title">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--violet-bright)]">Fideto Insight</p>
            <h3 id="insight-title" className="mt-1 text-lg font-black text-[var(--ink)] md:text-xl">
              Comprendre la relation avec {customer.firstName}
            </h3>
            <p className="mt-1 text-sm text-[var(--muted)]">Fréquence des visites et dépenses suivies, quand les données existent.</p>
          </div>
        </div>

        {!insight?.enabled ? (
          <div className="mt-4 rounded-xl border border-[var(--stroke)] bg-[var(--surface-raised)] p-4">
            <p className="text-sm font-bold text-[var(--ink)]">Fideto Insight n&apos;est pas activé pour ce commerce.</p>
            <p className="mt-1 text-xs text-[var(--muted)]">Activez l&apos;abonnement pour voir la fréquence des visites et le panier moyen réels de ce client.</p>
            <Link href="/app/statistiques" className="glass-cta mt-3 inline-flex px-4 py-2 text-xs">
              Découvrir Fideto Insight
            </Link>
          </div>
        ) : (
          <>
            <div className="mt-4">
              <Button variant="primary" className="h-10 px-4 text-xs" onClick={() => setInsightOpen((v) => !v)} aria-expanded={insightOpen}>
                {insightOpen ? "Masquer l'aperçu Insight" : "Voir l'aperçu Insight →"}
              </Button>
            </div>
            {insightOpen ? (
              <div className="mt-5 space-y-4 border-t border-[var(--stroke)] pt-5">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <div className="metric-card px-4 py-4">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted)]">Panier moyen</p>
                    <p className="mt-1 text-xl font-black text-[var(--ink)]">{insight.avgBasketLabel ?? "—"}</p>
                    <p className="mt-1 text-[11px] text-[var(--muted)]">Montants d&apos;achats enregistrés nécessaires.</p>
                  </div>
                  <div className="metric-card px-4 py-4">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted)]">Dépenses suivies</p>
                    <p className="mt-1 text-xl font-black text-[var(--ink)]">{insight.trackedSpendLabel ?? "—"}</p>
                    <p className="mt-1 text-[11px] text-[var(--muted)]">Total des achats renseignés.</p>
                  </div>
                  <div className="metric-card px-4 py-4">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted)]">Fréquence des visites</p>
                    <p className="mt-1 text-xl font-black text-[var(--ink)]">
                      {insight.avgVisitFrequencyDays !== null ? `${Math.round(insight.avgVisitFrequencyDays)} j` : "—"}
                    </p>
                    <p className="mt-1 text-[11px] text-[var(--muted)]">Jours moyens entre deux passages.</p>
                  </div>
                </div>

                <div className="rounded-xl border border-[var(--stroke)] bg-[var(--surface-raised)] p-4">
                  <div className="flex items-center justify-between gap-3">
                    <h4 className="text-sm font-bold text-[var(--ink)]">Évolution des visites</h4>
                    <select
                      value={insightPeriod}
                      onChange={(e) => setInsightPeriod(e.target.value as "6" | "12")}
                      className="merchant-filter-chip bg-transparent"
                      aria-label="Période du graphique"
                    >
                      <option value="6">6 derniers mois</option>
                      <option value="12">12 derniers mois</option>
                    </select>
                  </div>
                  <div className="mt-3">
                    <InsightLineChart
                      data={insight.series.map((p) => ({ date: formatMonthLabel(p.date), value: p.value }))}
                      height={160}
                      emptyLabel="Aucun passage daté sur cette période."
                    />
                  </div>
                </div>
              </div>
            ) : null}
          </>
        )}
      </section>

      <Link href="/app/clients" className="text-sm font-bold text-[var(--violet-bright)]">
        ← Retour à la liste
      </Link>
    </div>
  );
}
