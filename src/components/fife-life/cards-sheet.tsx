"use client";

import { AnimatePresence, motion, useMotionValue, useReducedMotion, useTransform } from "motion/react";
import { useMemo, useState } from "react";
import { ProgressRing } from "./progress-ring";
import type { MerchantCardData } from "./types";

export function CardsSheet({
  open,
  cards,
  onClose,
  onOpenCard,
}: {
  open: boolean;
  cards: MerchantCardData[];
  onClose: () => void;
  onOpenCard: (card: MerchantCardData) => void;
}) {
  const reduced = useReducedMotion();
  const [searchQuery, setSearchQuery] = useState("");
  const dragY = useMotionValue(0);
  
  // Transform dragY en forme de chevron
  // Valeur négative (tire vers le haut) = chevron vers le haut
  // Valeur positive (tire vers le bas) = chevron vers le bas
  const chevronPath = useTransform(
    dragY,
    [-50, 0, 50],
    [
      "M 8 18 L 28 12 L 48 18", // Chevron vers le haut (Λ)
      "M 8 18 L 28 18 L 48 18", // Ligne droite
      "M 8 18 L 28 24 L 48 18", // Chevron vers le bas (V)
    ]
  );

  // Filter cards based on search query
  const filtered = useMemo(() => {
    if (!searchQuery.trim()) return cards;
    const query = searchQuery
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, ""); // Remove accents
    return cards.filter((card) => {
      const name = card.name
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
      return name.includes(query);
    });
  }, [cards, searchQuery]);

  const spring = reduced ? { duration: 0 } : { type: "spring" as const, stiffness: 340, damping: 34 };

  return (
    <AnimatePresence>
      {open ? (
        <>
          <motion.div
            aria-label="Backdrop"
            className="sheet-backdrop fixed inset-0 z-40 cursor-grab active:cursor-grabbing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={reduced ? { duration: 0 } : { duration: 0.22 }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0.5, bottom: 0 }}
            onDragEnd={(_, info) => {
              if (info.offset.y > 50 || info.velocity.y > 500) onClose();
            }}
            onClick={(e) => {
              if (e.target === e.currentTarget) onClose();
            }}
          />
          <motion.section
            role="dialog"
            aria-modal="true"
            aria-label="Mes cartes et mes avantages"
            className="obsidian-sheet fixed inset-x-0 bottom-0 z-50 flex h-[min(88dvh,640px)] flex-col overflow-hidden rounded-t-[32px] cursor-grab active:cursor-grabbing"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={spring}
            drag={reduced ? false : "y"}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.45 }}
            onDrag={(_, info) => {
              dragY.set(info.offset.y);
            }}
            onDragEnd={(_, info) => {
              dragY.set(0);
              if (info.offset.y > 90 || info.velocity.y > 700) onClose();
            }}
          >
            <div className="sheet-halo" aria-hidden />
            <div className="flex justify-center pt-3">
              <svg width="56" height="36" viewBox="0 0 56 36" className="overflow-visible">
                <motion.path
                  d={chevronPath}
                  stroke="rgba(255, 255, 255, 0.2)"
                  strokeWidth="4"
                  strokeLinecap="round"
                  fill="none"
                />
              </svg>
            </div>
            <header className="relative z-10 px-5 pb-3 pt-4">
              {/* Search bar */}
              <div className="search-capsule relative">
                <input
                  type="search"
                  placeholder="Rechercher une carte..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input w-full bg-transparent px-4 py-3 pr-11 text-sm text-[var(--ink)] placeholder:text-[var(--muted)] focus:outline-none"
                  autoFocus={false}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted-strong)]"
                  aria-label="Rechercher"
                >
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.35-4.35" />
                  </svg>
                </button>
                {searchQuery && (
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
                )}
              </div>
              <p className="mt-3 text-[11px] text-[var(--muted-strong)]">
                {filtered.length === 0 ? "Aucune carte trouvée" : `${filtered.length} carte${filtered.length > 1 ? "s" : ""} disponible${filtered.length > 1 ? "s" : ""}`}
              </p>
            </header>
            <div className="relative z-10 min-h-0 flex-1 overflow-y-auto px-5 pb-8">
              {filtered.length === 0 ? (
                <div className="py-10 text-center">
                  <p className="text-sm text-[var(--muted)]">Aucune carte trouvée.</p>
                  {searchQuery && (
                    <p className="mt-2 text-xs text-[var(--muted-strong)]">
                      Essayez une autre recherche
                    </p>
                  )}
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
                              <img
                                src={card.logoUrl}
                                alt=""
                                className="h-11 w-11 rounded-full object-cover"
                              />
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
          </motion.section>
        </>
      ) : null}
    </AnimatePresence>
  );
}
