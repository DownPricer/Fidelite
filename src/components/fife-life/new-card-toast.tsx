"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

import { UNLOCK_REVEAL_DISPLAY_MODE } from "@/lib/wallet-unlock-card";
import { MerchantCardRenderer } from "./merchant-card-renderer";
import type { UnlockRevealPhase } from "./use-wallet-unlock-animation";
import type { MerchantCardData } from "./types";
import { useClientMounted, useHydrationSafeReducedMotion } from "./use-client-mounted";

export function NewCardToast({
  phase,
  card,
  clientName,
  clientNumber,
  qrSrc,
  eventId,
  onDisplayed,
  onDone,
}: {
  phase: UnlockRevealPhase;
  card?: MerchantCardData | null;
  clientName: string;
  clientNumber?: string | null;
  qrSrc?: string | null;
  eventId?: string | null;
  onDisplayed?: (eventId: string) => void;
  onDone: () => void;
}) {
  const reduced = useHydrationSafeReducedMotion();
  const onDoneRef = useRef(onDone);
  const onDisplayedRef = useRef(onDisplayed);
  const overlayRef = useRef<HTMLDivElement>(null);
  const displayedRef = useRef<string | null>(null);
  const mounted = useClientMounted();

  onDoneRef.current = onDone;
  onDisplayedRef.current = onDisplayed;

  const visible = phase === "revealed" && Boolean(card);

  useEffect(() => {
    if (!visible || !card || !eventId) return;
    if (displayedRef.current === eventId) return;
    const frame = requestAnimationFrame(() => {
      if (!overlayRef.current) return;
      displayedRef.current = eventId;
      onDisplayedRef.current?.(eventId);
    });
    return () => cancelAnimationFrame(frame);
  }, [visible, card, eventId]);

  useEffect(() => {
    if (!visible || !card) return;
    const timer = window.setTimeout(() => onDoneRef.current(), reduced ? 900 : 2000);
    return () => window.clearTimeout(timer);
  }, [visible, card, reduced]);

  if (!mounted || !visible) return null;

  return createPortal(
    <AnimatePresence>
      {visible ? (
        <motion.div
          ref={overlayRef}
          className="fixed inset-0 z-[9999] grid place-items-center px-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={reduced ? { duration: 0 } : { duration: 0.25 }}
          onClick={() => {
            if (phase === "revealed") onDoneRef.current();
          }}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[3px]" aria-hidden />
          <motion.div
            className="relative w-full max-w-[min(360px,92vw)]"
            style={{ perspective: "900px" }}
            initial={reduced ? false : { scale: 0.82, rotateX: 8, y: 24, opacity: 0 }}
            animate={{ scale: 1, rotateX: 0, y: 0, opacity: 1 }}
            exit={reduced ? undefined : { scale: 0.94, y: -8, opacity: 0 }}
            transition={
              reduced
                ? { duration: 0 }
                : { type: "spring", stiffness: 280, damping: 24, mass: 0.85 }
            }
            onClick={(event) => event.stopPropagation()}
          >
            <div className="deck-halo absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2" />
            <div className="unlock-reveal-ring" aria-hidden />
            <div className="unlock-reveal-star" aria-hidden />
            <div className="unlock-reveal-particles" aria-hidden>
              <span />
              <span />
              <span />
              <span />
              <span />
            </div>
            <div className="relative overflow-hidden rounded-[18px] shadow-[0_24px_80px_rgba(0,0,0,0.55)]">
              <div className="unlock-reveal-shimmer" aria-hidden />
              <MerchantCardRenderer
                template={card!.cardTemplate}
                merchant={{
                  name: card!.name,
                  logoUrl: card!.logoUrl,
                  primaryColor: card!.primaryColor,
                }}
                card={card!}
                slug={card!.slug}
                clientName={clientName}
                clientNumber={clientNumber}
                displayMode={UNLOCK_REVEAL_DISPLAY_MODE}
                showQr
                qrSrc={qrSrc}
                qrFetchPriority="high"
                qrZoomEnabled={false}
                interactive={false}
              />
              <div className="pointer-events-none absolute inset-x-0 bottom-4 px-5 text-center">
                <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[var(--violet-bright)] drop-shadow">
                  Nouvelle carte débloquée
                </p>
                <p className="mt-2 text-xs text-white/80 drop-shadow">
                  La carte rejoint votre portefeuille Fife Life.
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}
