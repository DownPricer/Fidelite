"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { EmptyState } from "@/components/merchant/merchant-ui";

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

function initials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}

function formatActivity(iso: string) {
  const d = new Date(iso);
  const diff = Date.now() - d.getTime();
  if (diff < 86400000) return "Aujourd'hui";
  if (diff < 172800000) return "Hier";
  return d.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <circle cx="10" cy="10" r="6" />
      <path d="m15 15 6 6" />
    </svg>
  );
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
      <div className="mq-tools">
        <label className="mq-search">
          <SearchIcon />
          <input
            type="search"
            placeholder="Nom, e-mail ou téléphone"
            aria-label="Rechercher un client"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </label>
        <select value={sort} onChange={(e) => setSort(e.target.value)} className="mq-sort" aria-label="Trier les clients">
          <option value="recent">Plus récents</option>
          <option value="active">Plus actifs</option>
          <option value="points">Plus de passages</option>
          <option value="alpha">Nom A à Z</option>
        </select>
      </div>

      {error ? (
        <p className="mb-4 text-sm" style={{ color: "#f18ba0" }}>
          {error}
        </p>
      ) : null}

      <div className="mq-card mq-list-card">
        <div className="mq-list-head" aria-hidden="true">
          <span>Client</span>
          <span>Fidélité</span>
          <span>Dernière activité</span>
          <span />
        </div>
        <div>
          {loading && list.length === 0 ? (
            [1, 2, 3, 4].map((i) => <div key={i} className="mq-list-item animate-pulse" />)
          ) : list.length === 0 ? (
            <div className="mq-empty-list">Aucun client trouvé.</div>
          ) : (
            list.map((c) => (
              <Link key={c.id} href={`/app/clients/${c.id}`} className="mq-list-item" style={{ display: "grid" }}>
                <span className="mq-person">
                  <span className="mq-avatar">{initials(`${c.firstName} ${c.lastName ?? ""}`)}</span>
                  <span>
                    <strong>
                      {c.firstName}
                      {c.lastName ? ` ${c.lastName}` : ""}
                    </strong>
                    <small>{c.email}</small>
                  </span>
                </span>
                <span className="mq-list-muted">
                  {c.points} {c.points === 1 ? "passage" : "passages"}
                </span>
                <span className="mq-list-muted">{formatActivity(c.lastActivity)}</span>
                <span className="mq-chevron">›</span>
              </Link>
            ))
          )}
        </div>
      </div>

      {!demo && hasMore ? (
        <div className="mt-4 text-center">
          <button type="button" className="mq-btn" onClick={() => setPage((p) => p + 1)}>
            Charger plus
          </button>
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

function InsightVisitsChart({ series }: { series: { date: string; value: number }[] }) {
  const max = Math.max(1, ...series.map((p) => p.value));
  const hasData = series.some((p) => p.value > 0);
  if (!hasData) {
    return <p className="mt-3 text-xs" style={{ color: "#c2afd2" }}>Aucun passage daté sur cette période.</p>;
  }
  return (
    <>
      <div className="mq-chart-plot" style={{ gridTemplateColumns: `repeat(${series.length}, 1fr)` }} role="img" aria-label="Évolution mensuelle des visites">
        {series.map((point) => (
          <div key={point.date} className="mq-bar-wrap">
            <span className="mq-bar-number">{point.value}</span>
            <div className="mq-bar" style={{ height: point.value ? `${(point.value / max) * 108 + 12}px` : "4px" }} />
          </div>
        ))}
      </div>
      <div className="mq-bar-axis" aria-hidden="true">
        {series.map((point) => (
          <span key={point.date}>{formatMonthLabel(point.date)}</span>
        ))}
      </div>
    </>
  );
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
      <div>
        <div className="mq-card mq-profile animate-pulse" />
        <div className="mq-stats mt-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="mq-card mq-stat animate-pulse" />
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
    <div>
      <Link href="/app/clients" className="mq-back">
        <span aria-hidden="true">‹</span> Retour aux clients
      </Link>

      <header className="mb-5">
        <div className="mq-eyebrow">CLIENT · FICHE INDIVIDUELLE</div>
        <h1 className="mq-h1">Fiche client</h1>
        <p className="mq-intro">
          Fidélité, visites et activité de {customer.firstName} dans votre commerce.
        </p>
      </header>

      <section className="mq-card mq-profile" aria-label="Identité du client">
        <div className="mq-avatar" aria-hidden="true">
          {initials(fullName)}
        </div>
        <div className="mq-profile-main">
          <h2>{fullName}</h2>
          <div className="mq-profile-mail">{customer.email}</div>
        </div>
        <div className="mq-profile-side">
          <span className="mq-status">Membre du programme</span>
          {customer.merchantName ? <small>{customer.merchantName}</small> : null}
        </div>
      </section>

      <div className="mq-stats" aria-label="Résumé fidélité">
        <section className="mq-card mq-stat">
          <div className="mq-stat-label">Passages enregistrés</div>
          <div className="mq-stat-value">{stats?.visitsCount ?? customer.points}</div>
          <div className="mq-stat-foot">Dans ce commerce</div>
        </section>
        <section className="mq-card mq-stat">
          <div className="mq-stat-label">Dernière activité</div>
          <div className="mq-stat-value mq-stat-value-date">{lastActivityLabel}</div>
          <div className="mq-stat-foot">Selon l&apos;historique enregistré</div>
        </section>
        <section className="mq-card mq-stat">
          <div className="mq-stat-label">Avantages utilisés</div>
          <div className="mq-stat-value">{stats?.rewardsUsedCount ?? "—"}</div>
          <div className="mq-stat-foot">Historique complet</div>
        </section>
      </div>

      <div className="mq-two-col">
        <section className="mq-card mq-panel">
          <div className="mq-panel-top">
            <div>
              <div className="mq-eyebrow" style={{ color: "#aa94c0" }}>FIDÉLITÉ</div>
              <h2>Historique des passages</h2>
              <p className="mq-note">Les événements datés apparaissent ici lorsqu&apos;ils sont disponibles.</p>
            </div>
            <a href="#insight" className="mq-link">
              Voir Insight →
            </a>
          </div>
          <div className="mq-timeline">
            {txs.length === 0 ? (
              <div className="mq-empty-state">Aucun événement daté pour l&apos;instant.</div>
            ) : (
              txs.map((tx) => (
                <div key={tx.id} className="mq-event">
                  <div className="mq-event-dot" aria-hidden="true">
                    {tx.type === "REDEEM_REWARD" ? "★" : "✓"}
                  </div>
                  <div className="mq-event-body">
                    <strong>{tx.rewardName ?? (tx.type === "REDEEM_REWARD" ? "Récompense utilisée" : "Passage")}</strong>
                    <small>{new Date(tx.createdAt).toLocaleString("fr-FR")}</small>
                  </div>
                  <span className="mq-event-badge">
                    {tx.pointsDelta > 0 ? "+" : ""}
                    {tx.pointsDelta} {Math.abs(tx.pointsDelta) === 1 ? "passage" : "pts"}
                  </span>
                </div>
              ))
            )}
          </div>
        </section>

        <section className="mq-card mq-panel">
          <div className="mq-eyebrow" style={{ color: "#aa94c0" }}>VUE D&apos;ENSEMBLE</div>
          <h2>Ce que vous savez déjà</h2>
          <div className="mq-quick-fact">
            <span>Client du programme</span>
            <strong>{fullName}</strong>
          </div>
          <div className="mq-quick-fact">
            <span>Passages enregistrés</span>
            <strong>{stats?.visitsCount ?? "—"}</strong>
          </div>
          <div className="mq-quick-fact">
            <span>Dernière activité</span>
            <strong>{lastActivityLabel}</strong>
          </div>
          <div className="mq-quick-fact">
            <span>Panier moyen</span>
            <strong>{insight?.avgBasketLabel ?? "Montants requis"}</strong>
          </div>
          <p className="mq-foot-note">
            Le panier moyen nécessite des achats dont le montant a été enregistré. Client depuis le {memberSinceLabel}.
          </p>
        </section>
      </div>

      <section id="insight" className="mq-card mq-insight" aria-labelledby="insight-title">
        <div className="mq-insight-head">
          <div>
            <div className="mq-insight-mark">FIDETO INSIGHT</div>
            <h2 id="insight-title">Comprendre la relation avec {customer.firstName}</h2>
            <p>Fréquence des visites et dépenses suivies, quand les données existent.</p>
          </div>
          {!insight?.enabled ? <span className="mq-insight-call">ABONNEMENT REQUIS</span> : null}
        </div>

        {!insight?.enabled ? (
          <div className="mq-insight-actions">
            <Link href="/app/statistiques" className="mq-btn mq-btn-primary">
              Découvrir Fideto Insight →
            </Link>
            <span className="mq-sub">L&apos;accès dépend de l&apos;abonnement du commerce.</span>
          </div>
        ) : (
          <>
            <div className="mq-insight-actions">
              <button
                type="button"
                className="mq-btn mq-btn-primary"
                onClick={() => setInsightOpen((v) => !v)}
                aria-expanded={insightOpen}
                aria-controls="insight-preview"
              >
                {insightOpen ? "Masquer l'aperçu Insight" : "Voir l'aperçu Insight →"}
              </button>
            </div>
            {insightOpen ? (
              <div className="mq-preview" id="insight-preview">
                <div className="mq-preview-label">Fréquence des visites et dépenses réelles de {customer.firstName}</div>
                <div className="mq-preview-note">Ces valeurs sont calculées à partir des passages et achats réellement enregistrés.</div>

                <div className="mq-premium-metrics">
                  <div className="mq-premium-metric">
                    <strong>Panier moyen</strong>
                    <span>{insight.avgBasketLabel ?? "—"}</span>
                    <small>Montants d&apos;achats enregistrés nécessaires.</small>
                  </div>
                  <div className="mq-premium-metric">
                    <strong>Dépenses suivies</strong>
                    <span>{insight.trackedSpendLabel ?? "—"}</span>
                    <small>Total des achats renseignés pour ce commerce.</small>
                  </div>
                  <div className="mq-premium-metric">
                    <strong>Fréquence des visites</strong>
                    <span>{insight.avgVisitFrequencyDays !== null ? `${Math.round(insight.avgVisitFrequencyDays)} j` : "—"}</span>
                    <small>Jours moyens entre deux passages.</small>
                  </div>
                </div>

                <div className="mq-chart-card">
                  <div className="mq-chart-head">
                    <h3>Évolution des visites</h3>
                    <select
                      value={insightPeriod}
                      onChange={(e) => setInsightPeriod(e.target.value as "6" | "12")}
                      aria-label="Période du graphique"
                    >
                      <option value="6">6 derniers mois</option>
                      <option value="12">12 derniers mois</option>
                    </select>
                  </div>
                  <InsightVisitsChart series={insight.series} />
                  <p className="mq-chart-legend">
                    <b>Données réelles.</b> Calculé à partir des passages datés de {customer.firstName} dans ce commerce.
                  </p>
                </div>
              </div>
            ) : null}
          </>
        )}
      </section>
    </div>
  );
}
