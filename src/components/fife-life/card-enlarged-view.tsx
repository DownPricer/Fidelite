"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { DEMO_CLIENT_NUMBER } from "@/lib/demo-visual";
import { loadPersonalizedQr } from "./qr-cache";
import { PREVIEW_QR } from "./preview-data";
import { InteractiveLoyaltyCard } from "./interactive-loyalty-card";
import { MerchantCardRenderer } from "./merchant-card-renderer";
import { resolveTier } from "./tier";
import type { MerchantCardData, WalletTier } from "./types";
import { useClientMounted, useHydrationSafeReducedMotion } from "./use-client-mounted";

type CardEnlargedViewProps = {
  open: boolean;
  card: MerchantCardData;
  slug: string;
  customerName?: string;
  clientNumber?: string | null;
  fifeLifePoints?: number;
  personalizedQr?: string | null;
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
  personalizedQr = null,
  preview = false,
  onClose,
}: CardEnlargedViewProps) {
  const reduced = useHydrationSafeReducedMotion();
  const spring = reduced ? { duration: 0 } : { type: "spring" as const, stiffness: 280, damping: 30 };
  const fifeLife = isFifeLifeCard(card);
  const tier: WalletTier = card.demoTier ?? resolveTier(fifeLifePoints ?? card.points).name;
  const effectiveClientNumber = clientNumber ?? (preview ? DEMO_CLIENT_NUMBER : null);

  const mounted = useClientMounted();
  const [qr, setQr] = useState<string | null>(() => (preview ? PREVIEW_QR : null));

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
    if (personalizedQr) {
      setQr(personalizedQr);
      return;
    }
    let cancelled = false;
    void loadPersonalizedQr("fife-life").then((next) => {
      if (!cancelled && next) setQr(next);
    });
    return () => {
      cancelled = true;
    };
  }, [open, fifeLife, preview, personalizedQr]);

  if (!mounted) return null;

  return createPortal(
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
            className="card-enlarged-modal mx-auto flex w-full flex-col items-center"
            initial={{ scale: 0.94, y: 12 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.94, y: 12 }}
            transition={spring}
            onClick={(event) => event.stopPropagation()}
          >
            {fifeLife ? (
              <div className="card-enlarged-loyalty-wrap w-full">
                <InteractiveLoyaltyCard
                  tier={tier}
                  name={customerName}
                  points={fifeLifePoints ?? card.points}
                  showQr
                  qrSrc={personalizedQr ?? qr}
                  qrMode="standard"
                  clientNumber={effectiveClientNumber}
                  qrZoomEnabled
                  qrFetchPriority="high"
                  layout="enlarged"
                  className="card-enlarged-loyalty-card"
                />
              </div>
            ) : (
              <MerchantCardRenderer
                as="div"
                template={card.cardTemplate}
                merchant={{
                  name: card.name,
                  logoUrl: card.logoUrl,
                  primaryColor: card.primaryColor,
                }}
                card={card}
                slug={slug}
                clientName={customerName}
                clientNumber={effectiveClientNumber}
                displayMode={preview ? "adminPreview" : "personalized"}
                showQr
                qrSrc={personalizedQr ?? qr}
                qrFetchPriority="high"
                qrZoomEnabled
                interactive={false}
                className="card-enlarged-merchant-card w-full"
                shellClassName="card-enlarged-merchant-shell"
              />
            )}

            <p className="card-enlarged-hint mt-4 text-center text-xs text-[var(--muted)] sm:text-sm">
              Appuyez à côté de la carte pour fermer · touchez le QR pour l&apos;agrandir
            </p>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}
