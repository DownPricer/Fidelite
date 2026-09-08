"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import { useIsWalletDesktop } from "@/lib/use-media-query";
import { getCachedQr, loadUniversalQr } from "./qr-cache";
import { PREVIEW_QR } from "./preview-data";
import { InteractiveLoyaltyCard } from "./interactive-loyalty-card";
import { MerchantInteractiveCard } from "./merchant-interactive-card";
import { resolveTier } from "./tier";
import type { MerchantCardData, WalletTier } from "./types";

type CardEnlargedViewProps = {
  open: boolean;
  card: MerchantCardData;
  slug: string;
  customerName?: string;
  fifeLifePoints?: number;
  preview?: boolean;
  onClose: () => void;
};

function isFifeLifeCard(card: MerchantCardData) {
  return card.merchantId === "fife-life" || card.slug === "fife-life";
}

export function CardEnlargedView({
  open,
  card,
  slug,
  customerName = "Membre",
  fifeLifePoints,
  preview = false,
  onClose,
}: CardEnlargedViewProps) {
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
  const fifeLife = isFifeLifeCard(card);
  const tier: WalletTier =
    card.demoTier ?? resolveTier(fifeLifePoints ?? card.points).name;

  const [qr, setQr] = useState<string | null>(() => (preview ? PREVIEW_QR : getCachedQr()));

  useEffect(() => {
    if (!open || !fifeLife) return;
    if (preview) {
      setQr(PREVIEW_QR);
      return;
    }
    if (qr) return;
    let cancelled = false;
    void loadUniversalQr("fife-life").then((next) => {
      if (!cancelled && next) setQr(next);
    });
    return () => {
      cancelled = true;
    };
  }, [open, fifeLife, preview, qr]);

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
            initial={{ scale: 0.9, rotate: portraitMobile && !fifeLife ? -5 : 0 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0.9, rotate: portraitMobile && !fifeLife ? 5 : 0 }}
            transition={spring}
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
          >
            {fifeLife ? (
              <div className="card-enlarged-loyalty-wrap">
                <InteractiveLoyaltyCard
                  tier={tier}
                  name={customerName}
                  points={fifeLifePoints ?? card.points}
                  showQr
                  qrSrc={qr}
                  qrMode="engraved"
                  interactive
                  className="card-enlarged-loyalty-card"
                  shellClassName="card-enlarged-loyalty-shell"
                />
              </div>
            ) : (
              <MerchantInteractiveCard
                as="div"
                card={card}
                slug={slug}
                preview={preview}
                className={`card-enlarged-card w-full ${portraitMobile ? "card-enlarged-card-portrait" : ""}`}
              />
            )}

            {portraitMobile && !fifeLife ? (
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
