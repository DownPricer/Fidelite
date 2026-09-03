"use client";

import { AnimatePresence, motion, useMotionValue, useReducedMotion, useTransform } from "motion/react";
import { WalletCardsList } from "./wallet-cards-list";
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
            className="obsidian-sheet fife-desktop-sheet fixed inset-x-0 bottom-0 z-50 flex h-[min(88dvh,640px)] flex-col overflow-hidden rounded-t-[32px] cursor-grab active:cursor-grabbing"
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
            <div className="relative z-10 flex min-h-0 flex-1 flex-col px-5 pb-8 pt-4">
              <WalletCardsList cards={cards} onOpenCard={onOpenCard} compact />
            </div>
          </motion.section>
        </>
      ) : null}
    </AnimatePresence>
  );
}
