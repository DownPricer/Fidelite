"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { WalletMotionRoot } from "./wallet-motion-root";

type Merchant = {
  slug: string;
  name: string;
  logoUrl: string | null;
  primaryColor: string;
  category: string | null;
  city: string | null;
  shortDescription: string | null;
  rewardLabel: string;
};

type Sponsored = {
  id: string;
  merchantSlug: string;
  merchantName: string;
  merchantLogoUrl: string | null;
  imageUrl: string | null;
  text: string;
  ctaLabel: string | null;
  impressionUrl: string;
  clickUrl: string;
};

export function DiscoverPage() {
  const [query, setQuery] = useState("");
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [sponsored, setSponsored] = useState<Sponsored[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const trackedImpressions = useState(() => new Set<string>())[0];

  useEffect(() => {
    const controller = new AbortController();
    const timer = setTimeout(() => {
      setLoading(true);
      setError(null);
      const params = query.trim() ? `?q=${encodeURIComponent(query.trim())}` : "";
      fetch(`/api/public/merchants${params}`, { signal: controller.signal })
        .then((r) => {
          if (!r.ok) throw new Error();
          return r.json();
        })
        .then((data: { merchants: Merchant[]; sponsored: Sponsored[] }) => {
          setMerchants(data.merchants);
          setSponsored(data.sponsored ?? []);
        })
        .catch((err) => {
          if (err?.name !== "AbortError") setError("Impossible de charger les commerces. Réessayez.");
        })
        .finally(() => setLoading(false));
    }, 250);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query]);

  useEffect(() => {
    for (const ad of sponsored) {
      if (trackedImpressions.has(ad.id)) continue;
      trackedImpressions.add(ad.id);
      void fetch(ad.impressionUrl, { method: "POST" }).catch(() => {});
    }
  }, [sponsored, trackedImpressions]);

  return (
    <WalletMotionRoot>
      <main className="wallet-shell fife-page-shell obsidian-scene flex w-full flex-col px-5 pb-8 pt-3">
        <header className="mb-4">
          <h1 className="text-xl font-black text-[var(--ink)]">Découvrir</h1>
          <p className="mt-1 text-xs text-[var(--muted-strong)]">
            Recherchez un commerce par nom ou ville, ou retrouvez{" "}
            <Link href="/carte" className="profile-inline-link">
              vos cartes
            </Link>
            .
          </p>
        </header>

        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Nom du commerce ou ville…"
          className="profile-select w-full"
          aria-label="Rechercher un commerce par nom ou ville"
        />

        {sponsored.length > 0 ? (
          <section className="mt-4 space-y-2">
            {sponsored.map((ad) => (
              <a
                key={ad.id}
                href={ad.clickUrl}
                className="glass-panel profile-panel relative block overflow-hidden p-3"
              >
                <span className="absolute right-2 top-2 rounded-full bg-black/60 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white">
                  Sponsorisé
                </span>
                <div className="flex items-center gap-3">
                  {ad.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={ad.imageUrl} alt="" className="h-14 w-14 shrink-0 rounded-xl object-cover" />
                  ) : null}
                  <div className="min-w-0">
                    <p className="truncate text-xs font-bold uppercase tracking-wide text-[var(--muted)]">
                      {ad.merchantName}
                    </p>
                    <p className="text-sm font-semibold text-[var(--ink)]">{ad.text}</p>
                    {ad.ctaLabel ? (
                      <span className="mt-1 inline-block text-xs font-bold text-[var(--violet-bright)]">
                        {ad.ctaLabel}
                      </span>
                    ) : null}
                  </div>
                </div>
              </a>
            ))}
          </section>
        ) : null}

        <section className="mt-4">
          {loading ? (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="glass-panel profile-panel h-16 animate-pulse p-4" />
              ))}
            </div>
          ) : error ? (
            <p className="p-4 text-center text-sm text-[var(--danger)]">{error}</p>
          ) : merchants.length === 0 ? (
            <p className="glass-panel profile-panel p-6 text-center text-sm text-[var(--muted)]">
              Aucun commerce ne correspond à cette recherche.
            </p>
          ) : (
            <ul className="space-y-2">
              {merchants.map((m) => (
                <li key={m.slug}>
                  <Link href={`/c/${m.slug}`} className="glass-panel profile-panel flex items-center gap-3 p-3">
                    {m.logoUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={m.logoUrl} alt="" className="h-11 w-11 shrink-0 rounded-xl object-cover" />
                    ) : (
                      <div
                        className="grid h-11 w-11 shrink-0 place-items-center rounded-xl text-sm font-bold text-white"
                        style={{ background: m.primaryColor }}
                      >
                        {m.name.slice(0, 1).toUpperCase()}
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold text-[var(--ink)]">{m.name}</p>
                      <p className="truncate text-xs text-[var(--muted)]">
                        {[m.category, m.city].filter(Boolean).join(" · ") || m.shortDescription || m.rewardLabel}
                      </p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </WalletMotionRoot>
  );
}
