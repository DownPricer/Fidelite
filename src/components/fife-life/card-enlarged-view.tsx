"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import { DEMO_CLIENT_NUMBER } from "@/lib/demo-visual";
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
  clientNumber?: string | null;
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
  clientNumber = null,
  fifeLifePoints,
  preview = false,
  onClose,
}: CardEnlargedViewProps) {
  const reduced = useReducedMotion();
  const spring = reduced ? { duration: 0 } : { type: "spring" as const, stiffness: 280, damping: 30 };
  const fifeLife = isFifeLifeCard(card);
  const tier: WalletTier = card.demoTier ?? resolveTier(fifeLifePoints ?? card.points).name;
  const effectiveClientNumber = clientNumber ?? (preview ? DEMO_CLIENT_NUMBER : null);

  const [qr, setQr] = useState<string | null>(() => (preview ? PREVIEW_QR : getCachedQr()));

  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

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
          className="card-enlarged-overlay fixed inset-0 z-[100] flex items-center justify-center bg-[#05050a]/95 px-4 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={reduced ? { duration: 0 } : { duration: 0.25 }}
          onClick={onClose}
        >
          <motion.div
            className="card-enlarged-modal mx-auto flex w-full max-w-md flex-col items-center"
            initial={{ scale: 0.92, y: 16 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.92, y: 16 }}
            transition={spring}
            onClick={onClose}
          >
            {fifeLife ? (
              <div className="card-enlarged-loyalty-wrap w-full">
                <InteractiveLoyaltyCard
                  tier={tier}
                  name={customerName}
                  points={fifeLifePoints ?? card.points}
                  showQr
                  qrSrc={qr}
                  qrMode="standard"
                  clientNumber={effectiveClientNumber}
                  interactive={false}
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
                clientNumber={effectiveClientNumber}
                interactive={false}
                className="card-enlarged-merchant-card w-full"
                shellClassName="card-enlarged-merchant-shell"
              />
            )}

            <p className="card-enlarged-hint mt-5 text-center text-sm text-[var(--muted)]">Appuyez pour fermer</p>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
