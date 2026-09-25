"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { WalletMotionRoot } from "./wallet-motion-root";

type NotificationKind = "SERVICE" | "MERCHANT_OFFER" | "NETWORK_DEAL";

type NotificationMerchant = {
  id: string;
  name: string;
  slug: string;
  logoUrl: string | null;
  primaryColor: string;
};

type NotificationItem = {
  id: string;
  merchantId: string | null;
  campaignId: string | null;
  kind: NotificationKind;
  title: string;
  body: string;
  imageUrl: string | null;
  actionLabel: string | null;
  actionUrl: string | null;
  readAt: string | null;
  createdAt: string;
  merchant: NotificationMerchant | null;
};

const DEMO_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "demo-1",
    merchantId: "m1",
    campaignId: null,
    kind: "MERCHANT_OFFER",
    title: "Nouvelle offre",
    body: "-20% sur tous les cafés ce week-end.",
    imageUrl: null,
    actionLabel: "Voir l'offre",
    actionUrl: "/carte/cafe-demo",
    readAt: null,
    createdAt: new Date().toISOString(),
    merchant: { id: "m1", name: "Café Demo", slug: "cafe-demo", logoUrl: null, primaryColor: "#6A36E0" },
  },
  {
    id: "demo-2",
    merchantId: null,
    campaignId: null,
    kind: "SERVICE",
    title: "Bienvenue sur Fideto",
    body: "Votre carte de fidélité numérique est prête.",
    imageUrl: null,
    actionLabel: null,
    actionUrl: null,
    readAt: new Date().toISOString(),
    createdAt: new Date(Date.now() - 86_400_000).toISOString(),
    merchant: null,
  },
];

function kindLabel(kind: NotificationKind) {
  if (kind === "MERCHANT_OFFER") return "Offre commerçant";
  if (kind === "NETWORK_DEAL") return "Bon plan Fideto";
  return "Information";
}

export function NotificationsCenter({ demo = false }: { demo?: boolean }) {
  const router = useRouter();
  const [items, setItems] = useState<NotificationItem[]>(demo ? DEMO_NOTIFICATIONS : []);
  const [filter, setFilter] = useState<"all" | "offers" | "info">("all");
  const [loading, setLoading] = useState(!demo);
  const [error, setError] = useState<string | null>(null);
  const [unreadCount, setUnreadCount] = useState(demo ? 1 : 0);

  const load = useCallback(
    async (silent = false) => {
      if (demo) return;
      if (!silent) setLoading(true);
      setError(null);
      try {
        const params = filter === "all" ? "" : `?filter=${filter}`;
        const response = await fetch(`/api/customer/notifications${params}`, { cache: "no-store" });
        if (!response.ok) throw new Error();
        const data = (await response.json()) as { notifications: NotificationItem[]; unreadCount: number };
        setItems(data.notifications);
        setUnreadCount(data.unreadCount);
      } catch {
        if (!silent) setError("Impossible de charger vos notifications. Réessayez.");
      } finally {
        if (!silent) setLoading(false);
      }
    },
    [demo, filter],
  );

  useEffect(() => {
    void load();
  }, [load]);

  // Pas de système temps réel : on revalide au retour au premier plan et par
  // un polling léger, pour que les nouvelles notifications apparaissent sans
  // que le client ait besoin de se déconnecter/reconnecter.
  useEffect(() => {
    if (demo) return;
    const onVisible = () => {
      if (document.visibilityState === "visible") void load(true);
    };
    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener("focus", onVisible);
    const interval = window.setInterval(() => {
      if (document.visibilityState === "visible") void load(true);
    }, 45_000);
    return () => {
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("focus", onVisible);
      window.clearInterval(interval);
    };
  }, [demo, load]);

  async function markAllRead() {
    if (demo) {
      setItems((prev) => prev.map((n) => ({ ...n, readAt: n.readAt ?? new Date().toISOString() })));
      setUnreadCount(0);
      return;
    }
    await fetch("/api/customer/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ all: true }),
    }).catch(() => {});
    void load();
  }

  async function markOneRead(id: string) {
    setItems((prev) => prev.map((n) => (n.id === id ? { ...n, readAt: n.readAt ?? new Date().toISOString() } : n)));
    if (demo) return;
    await fetch("/api/customer/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    }).catch(() => {});
  }

  // Clic sur une notification commerciale : marque comme lue puis ouvre la fiche
  // du commerce — la carte fidélité existante si le client l'a déjà (via
  // /carte/[slug], qui redirige lui-même vers /c/[slug] au besoin), sinon la
  // page publique Découvrir avec le bouton d'adhésion (/carte/[slug] redirige
  // déjà vers /c/[slug] pour un non-membre). On réutilise ce routage existant
  // plutôt que d'en inventer un nouveau.
  function openNotification(n: NotificationItem) {
    void markOneRead(n.id);
    if (n.merchant) {
      router.push(`/carte/${n.merchant.slug}`);
    } else if (n.actionUrl) {
      router.push(n.actionUrl);
    }
  }

  const filtered = items.filter((n) => {
    if (filter === "offers") return n.kind === "MERCHANT_OFFER" || n.kind === "NETWORK_DEAL";
    if (filter === "info") return n.kind === "SERVICE";
    return true;
  });

  return (
    <WalletMotionRoot>
      <main className="wallet-shell fife-page-shell obsidian-scene flex w-full flex-col px-5 pb-8 pt-3">
        <header className="mb-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-black text-[var(--ink)]">Notifications</h1>
            <p className="text-xs text-[var(--muted-strong)]">
              {unreadCount > 0 ? `${unreadCount} non lue${unreadCount > 1 ? "s" : ""}` : "Tout est lu"}
            </p>
          </div>
          <button
            type="button"
            onClick={() => void markAllRead()}
            className="profile-link-btn px-3 py-2 text-xs"
            disabled={unreadCount === 0}
          >
            Tout marquer comme lu
          </button>
        </header>

        <div className="mb-4 flex gap-2">
          {(
            [
              { key: "all", label: "Toutes" },
              { key: "offers", label: "Offres" },
              { key: "info", label: "Informations" },
            ] as const
          ).map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setFilter(tab.key)}
              className={`merchant-filter-chip ${filter === tab.key ? "merchant-filter-chip-active" : ""}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="glass-panel profile-panel h-20 animate-pulse p-4" />
            ))}
          </div>
        ) : error ? (
          <div className="glass-panel profile-panel p-6 text-center">
            <p className="text-sm text-[var(--danger)]">{error}</p>
            <button type="button" onClick={() => void load()} className="profile-link-btn mt-3 px-4 py-2 text-xs">
              Réessayer
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="glass-panel profile-panel p-8 text-center">
            <p className="text-sm font-semibold text-[var(--ink)]">Aucune notification pour le moment</p>
            <p className="mt-1 text-xs text-[var(--muted)]">
              Les offres de vos commerces et les bons plans locaux apparaîtront ici.
            </p>
          </div>
        ) : (
          <ul className="space-y-2">
            {filtered.map((n) => {
              const clickable = Boolean(n.merchant || n.actionUrl);
              return (
                <li
                  key={n.id}
                  className={`glass-panel profile-panel p-4 ${n.readAt ? "opacity-70" : ""} ${clickable ? "cursor-pointer" : ""}`}
                  role={clickable ? "button" : undefined}
                  tabIndex={clickable ? 0 : undefined}
                  onClick={clickable ? () => openNotification(n) : undefined}
                  onKeyDown={
                    clickable
                      ? (e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            openNotification(n);
                          }
                        }
                      : undefined
                  }
                >
                  <div className="flex items-start gap-3">
                    {n.merchant ? (
                      n.merchant.logoUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={n.merchant.logoUrl}
                          alt=""
                          className="h-12 w-12 shrink-0 rounded-xl object-cover"
                        />
                      ) : (
                        <div
                          className="grid h-12 w-12 shrink-0 place-items-center rounded-xl text-sm font-bold text-white"
                          style={{ background: n.merchant.primaryColor }}
                        >
                          {n.merchant.name.slice(0, 1).toUpperCase()}
                        </div>
                      )
                    ) : n.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={n.imageUrl} alt="" className="h-12 w-12 shrink-0 rounded-xl object-cover" />
                    ) : (
                      <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-[var(--violet-bright)]/15 text-[var(--violet-bright)]">
                        <span className="text-lg">🔔</span>
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="truncate text-[10px] font-bold uppercase tracking-wide text-[var(--muted)]">
                          {n.merchant ? n.merchant.name : kindLabel(n.kind)}
                        </p>
                        {!n.readAt ? <span className="h-1.5 w-1.5 rounded-full bg-[var(--violet-bright)]" /> : null}
                      </div>
                      <p className="text-sm font-bold text-[var(--ink)]">{n.title}</p>
                      <p className="mt-0.5 text-xs text-[var(--muted-strong)]">{n.body}</p>
                      <div className="mt-2 flex items-center gap-3">
                        {n.actionLabel ? (
                          <span className="text-xs font-bold text-[var(--violet-bright)]">{n.actionLabel}</span>
                        ) : null}
                        {!n.readAt ? (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              void markOneRead(n.id);
                            }}
                            className="text-xs text-[var(--muted)]"
                          >
                            Marquer comme lu
                          </button>
                        ) : null}
                        <span className="ml-auto text-[10px] text-[var(--muted)]">
                          {new Date(n.createdAt).toLocaleDateString("fr-FR")}
                        </span>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </main>
    </WalletMotionRoot>
  );
}
