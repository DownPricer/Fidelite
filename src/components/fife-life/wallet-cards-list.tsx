"use client";

import { useMemo, useState } from "react";
import { ProgressRing } from "./progress-ring";
import type { MerchantCardData } from "./types";

export function WalletCardsList({
  cards,
  onOpenCard,
  compact = false,
}: {
  cards: MerchantCardData[];
  onOpenCard: (card: MerchantCardData) => void;
  compact?: boolean;
}) {
  const [searchQuery, setSearchQuery] = useState("");

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

  return (
    <div className={`wallet-cards-list flex min-h-0 flex-col ${compact ? "h-full" : ""}`}>
      <div className="search-capsule relative shrink-0">
        <input
          type="search"
          placeholder="Rechercher une carte..."
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
        {filtered.length === 0
          ? "Aucune carte trouvée"
          : `${filtered.length} carte${filtered.length > 1 ? "s" : ""} disponible${filtered.length > 1 ? "s" : ""}`}
      </p>
      <div className="mt-3 min-h-0 flex-1 overflow-y-auto">
        {filtered.length === 0 ? (
          <div className="py-8 text-center">
            <p className="text-sm text-[var(--muted)]">Aucune carte trouvée.</p>
            {searchQuery ? (
              <p className="mt-2 text-xs text-[var(--muted-strong)]">Essayez une autre recherche</p>
            ) : null}
          </div>
        ) : (
          <ul className="space-y-3">
            {filtered.map((card) => {
              const remaining = Math.max(0, card.visitsRequired - card.points);
              return (
                <li key={card.id}>
                  <button
                    type="button"
                    onClick={() => onOpenCard(card)}
                    className="merchant-search-row group w-full text-left"
                  >
                    <ProgressRing
                      value={card.points}
                      max={card.visitsRequired}
                      size={56}
                      strokeWidth={3}
                      color={card.primaryColor}
                    >
                      {card.logoUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={card.logoUrl} alt="" className="h-11 w-11 rounded-full object-cover" />
                      ) : (
                        <div
                          className="grid h-11 w-11 place-items-center rounded-full text-sm font-black text-[var(--ink)]"
                          style={{ backgroundColor: card.primaryColor }}
                        >
                          {card.name.slice(0, 1)}
                        </div>
                      )}
                    </ProgressRing>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-[var(--ink)] transition-colors group-hover:text-[var(--violet-bright)]">
                        {card.name}
                      </p>
                      <p className="mt-0.5 text-[11px] text-[var(--muted-strong)]">
                        {remaining === 0
                          ? `${card.rewardLabel} disponible`
                          : `Encore ${remaining} · ${card.rewardLabel}`}
                      </p>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
