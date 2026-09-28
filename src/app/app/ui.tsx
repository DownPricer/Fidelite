"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { InsightLineChart } from "@/components/merchant/insight-charts";

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
  {
    label: "Caisse",
    href: "/app/caisse",
    hint: "Scanner un client",
    icon: (
      <path d="M3 8V4a1 1 0 0 1 1-1h4m8 0h4a1 1 0 0 1 1 1v4M3 16v4a1 1 0 0 0 1 1h4m8 0h4a1 1 0 0 0 1-1v-4M7 12h10" />
    ),
  },
  {
    label: "Clients",
    href: "/app/clients",
    hint: "Consulter et rechercher",
    icon: (
      <>
        <circle cx="12" cy="7" r="4" />
        <path d="M4 21c0-5 3-8 8-8s8 3 8 8" />
      </>
    ),
  },
  {
    label: "Avantages",
    href: "/app/parametres/avantages",
    hint: "Créer et modifier",
    icon: (
      <>
        <rect x="3" y="8" width="18" height="13" rx="2" />
        <path d="M12 8v13M3 12h18M12 8c-5 0-6-3-3-5 2-1 3 1 3 5Zm0 0c5 0 6-3 3-5-2-1-3 1-3 5Z" />
      </>
    ),
  },
  {
    label: "Programme",
    href: "/app/parametres/programme",
    hint: "Règles de fidélité",
    icon: (
      <>
        <rect x="5" y="3" width="14" height="18" rx="2" />
        <path d="M9 8h6M9 12h6M9 16h3" />
      </>
    ),
  },
  {
    label: "Équipe",
    href: "/app/employes",
    hint: "Rôles et accès",
    icon: (
      <>
        <circle cx="8" cy="8" r="3" />
        <circle cx="17" cy="9" r="2" />
        <path d="M2 20c0-4 2-7 6-7s6 3 6 7Zm14-6c3 0 5 2 5 6h-5" />
      </>
    ),
  },
  {
    label: "Statistiques",
    href: "/app/statistiques",
    hint: "Analyses et tendances",
    icon: <path d="M4 20h16M6 17v-5m6 5V5m6 12V9" />,
  },
] as const;

const KPI_ICONS: Record<string, React.ReactNode> = {
  activeClients: (
    <>
      <circle cx="12" cy="7" r="4" />
      <path d="M4 21c0-5 3-8 8-8s8 3 8 8" />
    </>
  ),
  passagesThisWeek: <path d="M12 3v18M7 7l5-4 5 4M7 17l5 4 5-4" />,
  rewardsUsedThisWeek: (
    <>
      <rect x="3" y="8" width="18" height="13" rx="2" />
      <path d="M12 8v13M3 12h18M12 8c-5 0-6-3-3-5 2-1 3 1 3 5Zm0 0c5 0 6-3 3-5-2-1-3 1-3 5Z" />
    </>
  ),
  newClientsThisWeek: (
    <>
      <circle cx="9" cy="8" r="4" />
      <path d="M2 21c0-5 3-8 7-8m9-3v8m-4-4h8" />
    </>
  ),
};

function ScanIcon() {
  return (
    <svg viewBox="0 0 24 24" width={17} height={17} fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M8 3H5a2 2 0 0 0-2 2v3m13-5h3a2 2 0 0 1 2 2v3M3 16v3a2 2 0 0 0 2 2h3m13-5v3a2 2 0 0 1-2 2h-3" />
      <path d="M8 12h8" />
    </svg>
  );
}

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
        { key: "activeClients", label: "Clients actifs", value: homeStats.activeClients.current, note: "Au cours des 30 derniers jours" },
        { key: "passagesThisWeek", label: "Passages", value: homeStats.passagesThisWeek.current, note: "Cette semaine" },
        { key: "rewardsUsedThisWeek", label: "Avantages utilisés", value: homeStats.rewardsUsedThisWeek.current, note: "Cette semaine" },
        { key: "newClientsThisWeek", label: "Nouveaux clients", value: homeStats.newClientsThisWeek.current, note: "Cette semaine" },
      ]
    : null;

  function activityLabel(item: (typeof recent)[0]) {
    if (item.type === "REDEEM_REWARD") return item.firstName;
    return item.firstName;
  }

  function activityTag(item: (typeof recent)[0]) {
    if (item.type === "REDEEM_REWARD") return "Récompense validée";
    const sign = item.pointsDelta > 0 ? "+" : "";
    return `${sign}${item.pointsDelta} ${Math.abs(item.pointsDelta) === 1 ? "passage" : "points"}`;
  }

  return (
    <main className="mq-main">
      <div className="mq-frame">
        <header className="mq-page-head">
          <div>
            <div className="mq-eyebrow">{merchantName.toUpperCase()} · VOTRE ESPACE</div>
            <h1 className="mq-h1">
              Bonjour, {firstName} <span aria-hidden="true">✳</span>
            </h1>
            <p className="mq-intro">Votre programme de fidélité, en un coup d&apos;œil.</p>
          </div>
          <div className="mq-head-side">
            <button type="button" className="mq-logout" onClick={() => void logout()}>
              Déconnexion
            </button>
            <Link href="/app/caisse" className="mq-btn mq-btn-primary">
              <ScanIcon />
              Scanner un client
            </Link>
          </div>
        </header>

        <div className="mq-section-kicker">EN CE MOMENT</div>

        {kpis ? (
          <div className="mq-kpis" aria-label="Indicateurs du commerce">
            {kpis.map((kpi) => (
              <section key={kpi.key} className="mq-card mq-kpi">
                <div className="mq-kpi-top">
                  <span className="mq-kpi-title">{kpi.label}</span>
                  <span className="mq-kpi-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      {KPI_ICONS[kpi.key]}
                    </svg>
                  </span>
                </div>
                <div className="mq-kpi-value">{kpi.value}</div>
                <div className="mq-kpi-note">{kpi.note}</div>
              </section>
            ))}
          </div>
        ) : (
          <div className="mq-kpis">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="mq-card mq-kpi animate-pulse" />
            ))}
          </div>
        )}

        <div className="mq-middle">
          <section className="mq-card mq-scan">
            <div className="mq-eyebrow">ACTION DU JOUR</div>
            <h2>Chaque visite compte.</h2>
            <p>Scannez la carte d&apos;un client pour enregistrer son passage ou lui attribuer un avantage.</p>
            <Link href="/app/caisse" className="mq-btn">
              <ScanIcon />
              Ouvrir la caisse
            </Link>
          </section>

          <section className="mq-card mq-activity" aria-labelledby="activity-title">
            <div className="mq-panel-head">
              <div>
                <div className="mq-eyebrow">ACTIVITÉ RÉCENTE</div>
                <h2 id="activity-title">Derniers passages et récompenses</h2>
              </div>
              <Link href="/app/statistiques" className="mq-small-link">
                Tout voir →
              </Link>
            </div>
            {recent.length === 0 ? (
              <p className="mt-5 text-sm" style={{ color: "#a89bb7" }}>
                Aucune activité récente.
              </p>
            ) : (
              recent.map((item) => (
                <div key={item.id} className="mq-activity-item">
                  <div className="mq-initial" aria-hidden="true">
                    {item.firstName.slice(0, 1)}
                  </div>
                  <div>
                    <strong>{activityLabel(item)}</strong>
                    <small>{new Date(item.createdAt).toLocaleString("fr-FR")}</small>
                  </div>
                  <div className="mq-activity-tag">{activityTag(item)}</div>
                </div>
              ))
            )}
            <div className="mq-activity-foot">Les prochaines activités apparaîtront ici.</div>
          </section>
        </div>

        <section aria-labelledby="quick-title">
          <div className="mq-quick-head">
            <div>
              <h2 id="quick-title">Accès rapides</h2>
              <p>Retrouvez les outils que vous utilisez au quotidien.</p>
            </div>
          </div>
          <div className="mq-shortcuts">
            {QUICK_ACTIONS.map((action) => (
              <Link key={action.href} href={action.href} className="mq-shortcut">
                <span className="mq-short-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                    {action.icon}
                  </svg>
                </span>
                <span className="mq-short-copy">
                  <strong>{action.label}</strong>
                  <small>{action.hint}</small>
                </span>
                <span className="mq-arrow" aria-hidden="true">
                  ›
                </span>
              </Link>
            ))}
          </div>
        </section>

        <section className="mq-card mt-6" style={{ padding: "20px 21px" }}>
          <p style={{ fontWeight: 800, color: "#f8f4ff" }}>Aperçu des statistiques</p>
          {statsPreview ? (
            <div className="mt-2">
              <InsightLineChart data={statsPreview.passagesSeries} height={64} />
            </div>
          ) : (
            <div className="mt-3 h-16 animate-pulse rounded-xl bg-white/5" />
          )}
          <Link href="/app/statistiques" className="mq-btn mq-btn-primary mt-3">
            Voir les statistiques
          </Link>
        </section>
      </div>
    </main>
  );
}
