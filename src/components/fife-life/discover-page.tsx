"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { WalletMotionRoot } from "./wallet-motion-root";
import { SponsoredBanner, type SponsoredAd } from "./sponsored-banner";

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

type Sponsored = SponsoredAd;

/**
 * Rotation stable et déterministe : si plusieurs mises en avant sont éligibles en même temps,
 * une seule est montrée par chargement de page (jamais toutes empilées, pour qu'aucune ne
 * monopolise l'affichage), choisie par un indice qui change chaque jour (Europe/Paris) — tous
 * les visiteurs d'un même jour voient la même, et chaque mise en avant a sa chance sur la durée
 * de sa diffusion. Aucun système de priorité/rotation n'existait déjà pour ce cas : ce choix est
 * documenté ici plutôt que réutilisé.
 */
function pickRotatingAd<T>(ads: T[]): T | null {
  if (ads.length === 0) return null;
  const dayIndex = Math.floor(Date.now() / 86_400_000);
  return ads[dayIndex % ads.length];
}

export function DiscoverPage() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [sponsored, setSponsored] = useState<Sponsored[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const trackedImpressions = useState(() => new Set<string>())[0];
  const activeAd = pickRotatingAd(sponsored);

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
    // Une impression n'est comptée que pour la mise en avant réellement montrée (activeAd),
    // jamais pour tout le lot éligible reçu de l'API.
    if (!activeAd || trackedImpressions.has(activeAd.id)) return;
    trackedImpressions.add(activeAd.id);
    void fetch(activeAd.impressionUrl, { method: "POST" }).catch(() => {});
  }, [activeAd, trackedImpressions]);

  function closeDiscover() {
    // Retour naturel si on a bien navigué depuis l'app (évite un router.back()
    // aveugle qui sortirait de l'app si la page a été ouverte directement, ex.
    // raccourci PWA) ; sinon restauration explicite du Wallet.
    const cameFromApp =
      typeof window !== "undefined" &&
      window.history.length > 1 &&
      document.referrer.startsWith(window.location.origin);
    if (cameFromApp) router.back();
    else router.push("/carte");
  }

  return (
    <WalletMotionRoot>
      <main className="wallet-shell fife-page-shell obsidian-scene flex w-full flex-col px-5 pb-8 pt-3">
        <header className="mb-4 flex items-start gap-3">
          <button
            type="button"
            onClick={closeDiscover}
            aria-label="Fermer la recherche et revenir au Wallet"
            className="settings-btn-glassy mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-full"
          >
            <svg viewBox="0 0 24 24" width={18} height={18} fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <div className="min-w-0 flex-1">
            <h1 className="text-xl font-black text-[var(--ink)]">Découvrir</h1>
            <p className="mt-1 text-xs text-[var(--muted-strong)]">
              Recherchez un commerce par nom ou ville, ou retrouvez{" "}
              <Link href="/carte" className="profile-inline-link">
                vos cartes
              </Link>
              .
            </p>
          </div>
        </header>

        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Nom du commerce ou ville…"
          className="profile-select w-full"
          aria-label="Rechercher un commerce par nom ou ville"
        />

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

        {activeAd ? (
          <section className="mt-4">
            <SponsoredBanner ad={activeAd} />
          </section>
        ) : null}
      </main>
    </WalletMotionRoot>
  );
}
