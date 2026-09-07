"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import { getDemoTierCardImage } from "@/lib/demo-tier-card-images";
import { useIsWalletDesktop } from "@/lib/use-media-query";
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
  const isDesktop = useIsWalletDesktop();
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
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const portraitMobile = !isDesktop && !isLandscape;
  const spring = reduced ? { duration: 0 } : { type: "spring" as const, stiffness: 280, damping: 30 };
  const demoTierImage =
    preview && card.demoTier ? getDemoTierCardImage(card.demoTier) : null;

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="card-enlarged-overlay fixed inset-0 z-[100] flex items-center justify-center bg-[#05050a]/95 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={reduced ? { duration: 0 } : { duration: 0.25 }}
          onClick={onClose}
        >
          <motion.div
            className="card-enlarged-modal mx-auto w-full px-4"
            initial={{ scale: 0.9, rotate: portraitMobile && !demoTierImage ? -5 : 0 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0.9, rotate: portraitMobile && !demoTierImage ? 5 : 0 }}
            transition={spring}
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
          >
            {demoTierImage ? (
              <div className="demo-tier-card-enlarged-wrap">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={demoTierImage}
                  alt={`Carte Fife Life ${card.demoTier}`}
                  className="demo-tier-card-enlarged"
                  draggable={false}
                />
              </div>
            ) : (
            <PrismCard
              as="div"
              material="merchant"
              hue={card.primaryColor}
              className={`card-enlarged-card w-full aspect-[1.586/1] p-6 ${portraitMobile ? "card-enlarged-card-portrait" : ""}`}
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

                <div className="flex flex-1 items-center justify-center">
                  <div className="card-enlarged-qr-wrap">
                    <QrBlock slug={slug} preview={preview} />
                  </div>
                </div>

                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-2xl font-black tabular-nums text-[var(--ink)]">
                      {card.points}
                      <span className="text-base font-bold text-[var(--muted)]">/{card.visitsRequired}</span>
                    </p>
                    <p className="mt-0.5 text-xs font-medium text-[var(--ink-soft)]">
                      {card.points >= card.visitsRequired
                        ? "Récompense disponible"
                        : `Encore ${card.visitsRequired - card.points}`}
                    </p>
                  </div>
                </div>
              </div>
            </PrismCard>
            )}

            {portraitMobile && !demoTierImage ? (
              <div className="card-enlarged-hint-mobile mt-4 flex flex-col items-center gap-2">
                <div className="flex items-center gap-2 text-xs text-[var(--muted)]">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M7 2h10l2 2v16l-2 2H7l-2-2V4l2-2z" />
                    <path d="M9 6h6" />
                    <path d="M9 10h6" />
                  </svg>
                  <span>Tournez le téléphone</span>
                </div>
                <p className="text-center text-xs text-[var(--muted)]">Appuyez pour fermer</p>
              </div>
            ) : (
              <p className="card-enlarged-hint-desktop mt-4 text-center text-xs text-[var(--muted)]">
                Touchez à nouveau pour fermer
              </p>
            )}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
