"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { MerchantCardPublicPreview } from "./merchant-card-public-preview";
import { MerchantCardRenderer } from "./merchant-card-renderer";
import type { MerchantCardData } from "./types";

type PublicMerchant = {
  slug: string;
  name: string;
  logoUrl: string | null;
  primaryColor: string;
  rewardLabel: string;
  visitsRequired: number;
  cardTemplate: MerchantCardData["cardTemplate"];
};

export function WalletCardsList({
  cards,
  onOpenCard,
  compact = false,
  desktopGrid = false,
  enablePublicSearch = true,
}: {
  cards: MerchantCardData[];
  onOpenCard: (card: MerchantCardData) => void;
  compact?: boolean;
  desktopGrid?: boolean;
  enablePublicSearch?: boolean;
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [publicMerchants, setPublicMerchants] = useState<PublicMerchant[]>([]);
  const [publicLoading, setPublicLoading] = useState(false);

  const ownedSlugs = useMemo(() => new Set(cards.map((c) => c.slug).filter(Boolean)), [cards]);

  const filtered = useMemo(() => {
    if (!searchQuery.trim()) return cards;
    const query = searchQuery
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
    return cards.filter((card) => {
      const name = card.name
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
      return name.includes(query);
    });
  }, [cards, searchQuery]);

  useEffect(() => {
    if (!enablePublicSearch || searchQuery.trim().length < 2) {
      setPublicMerchants([]);
      return;
    }
    const controller = new AbortController();
    setPublicLoading(true);
    void fetch(`/api/public/merchants?q=${encodeURIComponent(searchQuery.trim())}`, {
      signal: controller.signal,
    })
      .then((res) => (res.ok ? res.json() : { merchants: [] }))
      .then((data) => {
        setPublicMerchants(
          (data.merchants as PublicMerchant[]).filter((m) => !ownedSlugs.has(m.slug)),
        );
      })
      .catch(() => setPublicMerchants([]))
      .finally(() => setPublicLoading(false));
    return () => controller.abort();
  }, [searchQuery, enablePublicSearch, ownedSlugs]);

  function publicAsCard(merchant: PublicMerchant): MerchantCardData {
    return {
      id: `public-${merchant.slug}`,
      merchantId: merchant.slug,
      slug: merchant.slug,
      name: merchant.name,
      logoUrl: merchant.logoUrl,
      primaryColor: merchant.primaryColor,
      points: 0,
      visitsRequired: merchant.visitsRequired,
      rewardLabel: merchant.rewardLabel,
      cardTemplate: merchant.cardTemplate,
    };
  }

  return (
    <div className={`wallet-cards-list flex min-h-0 flex-col ${compact ? "h-full" : ""}`}>
      <div className="search-capsule relative shrink-0">
        <input
          type="search"
          placeholder="Rechercher une carte ou un commerce…"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input w-full bg-transparent px-4 py-3 pr-11 text-sm text-[var(--ink)] placeholder:text-[var(--muted)] focus:outline-none"
        />
        <button
          type="button"
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted-strong)]"
          aria-label="Rechercher"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
        </button>
        {searchQuery ? (
          <button
            type="button"
            onClick={() => setSearchQuery("")}
            className="absolute right-11 top-1/2 -translate-y-1/2 text-[var(--muted)]"
            aria-label="Effacer"
          >
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
            </svg>
          </button>
        ) : null}
      </div>
      <p className="mt-3 shrink-0 text-[11px] text-[var(--muted-strong)]">
        {filtered.length === 0 && !publicMerchants.length
          ? searchQuery.trim().length >= 2 && publicLoading
            ? "Recherche en cours…"
            : "Aucune carte trouvée"
          : `${filtered.length} carte${filtered.length > 1 ? "s" : ""} · ${publicMerchants.length} commerce${publicMerchants.length > 1 ? "s" : ""} public${publicMerchants.length > 1 ? "s" : ""}`}
      </p>
      <div className="mt-3 min-h-0 flex-1 overflow-y-auto">
        {filtered.length === 0 && publicMerchants.length === 0 ? (
          <div className="py-8 text-center">
            <p className="text-sm text-[var(--muted)]">Aucune carte trouvée.</p>
            {searchQuery ? (
              <p className="mt-2 text-xs text-[var(--muted-strong)]">Essayez une autre recherche</p>
            ) : null}
          </div>
        ) : (
          <ul className={desktopGrid ? "wallet-cards-grid space-y-3 lg:grid lg:grid-cols-2 lg:gap-3 lg:space-y-0" : "space-y-3"}>
            {filtered.map((card) => (
              <li key={card.id}>
                <button
                  type="button"
                  onClick={() => onOpenCard(card)}
                  className="merchant-search-row group flex w-full items-center gap-3 text-left"
                >
                  <div className="w-[120px] shrink-0">
                    <MerchantCardRenderer
                      template={card.cardTemplate}
                      merchant={{
                        name: card.name,
                        logoUrl: card.logoUrl,
                        primaryColor: card.primaryColor,
                      }}
                      card={card}
                      slug={card.slug}
                      displayMode="compact"
                      showQr={false}
                      interactive={false}
                      className="pointer-events-none"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-[var(--ink)] transition-colors group-hover:text-[var(--violet-bright)]">
                      {card.name}
                    </p>
                    <p className="mt-0.5 text-[11px] text-[var(--muted-strong)]">
                      {Math.max(0, card.visitsRequired - card.points) === 0
                        ? `${card.rewardLabel} disponible`
                        : `Encore ${Math.max(0, card.visitsRequired - card.points)} · ${card.rewardLabel}`}
                    </p>
                  </div>
                </button>
              </li>
            ))}
            {publicMerchants.length > 0 ? (
              <li className="pt-2">
                <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-[var(--muted)]">
                  Commerces à découvrir
                </p>
                <ul className="space-y-3">
                  {publicMerchants.map((merchant) => {
                    const card = publicAsCard(merchant);
                    return (
                      <li key={merchant.slug}>
                        <Link
                          href={`/rejoindre/${merchant.slug}`}
                          className="merchant-search-row group flex items-center gap-3"
                        >
                          <div className="w-[120px] shrink-0">
                            <MerchantCardPublicPreview
                              card={card}
                              merchant={{
                                name: merchant.name,
                                logoUrl: merchant.logoUrl,
                                primaryColor: merchant.primaryColor,
                              }}
                              className="pointer-events-none"
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-semibold text-[var(--ink)] group-hover:text-[var(--violet-bright)]">
                              {merchant.name}
                            </p>
                            <p className="mt-0.5 text-[11px] text-[var(--muted-strong)]">
                              {merchant.visitsRequired} passages = {merchant.rewardLabel}
                            </p>
                          </div>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </li>
            ) : null}
          </ul>
        )}
      </div>
    </div>
  );
}
