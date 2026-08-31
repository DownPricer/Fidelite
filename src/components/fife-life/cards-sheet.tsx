"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useMemo, useState } from "react";
import { LinearGauge } from "./linear-gauge";
import { MerchantFace } from "./merchant-face";
import type { MerchantCardData } from "./types";

type Filter = "all" | "fife" | "available";

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
  const [filter, setFilter] = useState<Filter>("all");

  const filtered = useMemo(() => {
    if (filter === "available") {
      return cards.filter((card) => card.points >= card.visitsRequired);
    }
    return cards;
  }, [cards, filter]);

  const spring = reduced ? { duration: 0 } : { type: "spring" as const, stiffness: 340, damping: 34 };

  return (
    <AnimatePresence>
      {open ? (
        <>
          <motion.button
            type="button"
            aria-label="Fermer"
            className="sheet-backdrop fixed inset-0 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={reduced ? { duration: 0 } : { duration: 0.22 }}
            onClick={onClose}
          />
          <motion.section
            role="dialog"
            aria-modal="true"
            aria-label="Mes cartes et mes avantages"
            className="obsidian-sheet fixed inset-x-0 bottom-0 z-50 flex h-[min(88dvh,640px)] flex-col overflow-hidden rounded-t-[32px]"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={spring}
            drag={reduced ? false : "y"}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.45 }}
            onDragEnd={(_, info) => {
              if (info.offset.y > 90 || info.velocity.y > 700) onClose();
            }}
          >
            <div className="sheet-halo" aria-hidden />
            <div className="flex justify-center pt-3">
              <span className="h-1 w-14 rounded-full bg-white/20" />
            </div>
            <header className="relative z-10 px-5 pb-3 pt-4">
              <h2 className="text-base font-bold tracking-tight text-[var(--ink)]">Mes cartes et mes avantages</h2>
              <p className="mt-1 text-[11px] text-[var(--muted-strong)]">
                Retrouvez vos cartes, niveaux et offres disponibles.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {(
                  [
                    ["all", "Toutes"],
                    ["fife", "Fife Life"],
                    ["available", "Disponibles"],
                  ] as const
                ).map(([key, label]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setFilter(key)}
                    className={`sheet-filter rounded-full px-3.5 py-1.5 text-[11px] font-semibold transition-all ${
                      filter === key ? "is-active" : ""
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </header>
            <div className="relative z-10 min-h-0 flex-1 overflow-y-auto px-5 pb-8">
              {filter === "fife" ? (
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <p className="text-sm font-semibold text-[var(--ink)]">Carte universelle Fife Life</p>
                  <p className="mt-1 text-xs text-[var(--muted-strong)]">
                    Votre identité et votre QR unique pour tous les commerces partenaires.
                  </p>
                </div>
              ) : filtered.length === 0 ? (
                <p className="py-10 text-center text-sm text-[var(--muted)]">Aucune carte trouvée.</p>
              ) : (
                <ul className="space-y-3">
                  {filtered.map((card) => {
                    const remaining = Math.max(0, card.visitsRequired - card.points);
                    const progress = card.points / Math.max(1, card.visitsRequired);
                    return (
                      <li key={card.id}>
                        <button
                          type="button"
                          onClick={() => onOpenCard(card)}
                          className="mini-card-row w-full text-left"
                        >
                          <div
                            className="mini-card-thumb"
                            style={{
                              background: `linear-gradient(135deg, color-mix(in srgb, ${card.primaryColor} 70%, white 10%), color-mix(in srgb, ${card.primaryColor} 40%, #1a1530))`,
                            }}
                          />
                          <div className="min-w-0 flex-1">
                            <MerchantFace card={card} compact />
                            <p className="mt-1 text-[10px] text-[#f0e8d8]">
                              {remaining === 0 ? card.rewardLabel : `Prochaine · ${card.rewardLabel}`}
                            </p>
                            <div className="mt-2">
                              <LinearGauge value={card.points} max={card.visitsRequired} />
                            </div>
                          </div>
                          <span className="text-[10px] font-bold tabular-nums text-[var(--muted)]">
                            {Math.round(progress * 100)}%
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
              <div className="mt-6">
                <p className="text-xs font-semibold text-[var(--ink)]">Avantages disponibles</p>
                <button type="button" className="glass-cta mt-3 w-full text-sm">
                  Voir et utiliser mes avantages
                </button>
              </div>
            </div>
          </motion.section>
        </>
      ) : null}
    </AnimatePresence>
  );
}
