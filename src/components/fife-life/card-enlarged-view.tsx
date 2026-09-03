"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import { PrismCard } from "./prism-card";
import { QrBlock } from "./qr-block";
import type { MerchantCardData } from "./types";

type CardEnlargedViewProps = {
  open: boolean;
  card: MerchantCardData;
  slug: string;
  preview?: boolean;
  onClose: () => void;
};

export function CardEnlargedView({ open, card, slug, preview = false, onClose }: CardEnlargedViewProps) {
  const reduced = useReducedMotion();
  const [isLandscape, setIsLandscape] = useState(false);

  useEffect(() => {
    const checkOrientation = () => {
      setIsLandscape(window.innerWidth > window.innerHeight);
    };
    checkOrientation();
    window.addEventListener("resize", checkOrientation);
    window.addEventListener("orientationchange", checkOrientation);
    return () => {
      window.removeEventListener("resize", checkOrientation);
      window.removeEventListener("orientationchange", checkOrientation);
    };
  }, []);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const spring = reduced ? { duration: 0 } : { type: "spring" as const, stiffness: 280, damping: 30 };

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#05050a]/95 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={reduced ? { duration: 0 } : { duration: 0.25 }}
        >
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 z-10 grid h-11 w-11 place-items-center rounded-full bg-white/8 backdrop-blur-sm transition-colors hover:bg-white/12"
            aria-label="Fermer"
          >
            <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <motion.div
            className="mx-auto px-4 w-full max-w-sm"
            initial={{ scale: 0.9, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 50 }}
            transition={spring}
          >
            <PrismCard
              as="div"
              material="merchant"
              hue={card.primaryColor}
              className="w-full aspect-[1.586/1] p-6"
            >
              <div className="flex h-full flex-col justify-between">
                <div className="flex items-center gap-3">
                  {card.logoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={card.logoUrl} alt="" className="h-12 w-12 rounded-2xl object-cover" />
                  ) : (
                    <div
                      className="grid h-12 w-12 place-items-center rounded-2xl text-lg font-black text-[var(--ink)]"
                      style={{ backgroundColor: card.primaryColor }}
                    >
                      {card.name.slice(0, 1)}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <h2 className="text-base font-bold uppercase tracking-wider text-[var(--ink-soft)]">{card.name}</h2>
                    <p className="text-xs text-[var(--muted-strong)]">Fife Life</p>
                  </div>
                </div>

                <div className="flex-1 flex items-center justify-center">
                  <div className="scale-110">
                    <QrBlock slug={slug} preview={preview} />
                  </div>
                </div>

                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-2xl font-black tabular-nums text-[var(--ink)]">
                      {card.points}<span className="text-base font-bold text-[var(--muted)]">/{card.visitsRequired}</span>
                    </p>
                    <p className="text-xs font-medium text-[var(--ink-soft)] mt-0.5">
                      {card.points >= card.visitsRequired ? "Récompense disponible" : `Encore ${card.visitsRequired - card.points}`}
                    </p>
                  </div>
                </div>
              </div>
            </PrismCard>

            <p className="mt-4 text-center text-xs text-[var(--muted)]">
              Touchez à nouveau pour fermer
            </p>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
