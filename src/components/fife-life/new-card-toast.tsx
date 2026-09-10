"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { UNLOCK_REVEAL_DISPLAY_MODE } from "@/lib/wallet-unlock-card";
import { MerchantCardRenderer } from "./merchant-card-renderer";
import type { UnlockRevealPhase } from "./use-wallet-unlock-animation";
import type { MerchantCardData } from "./types";

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
  const reduced = useReducedMotion();
  const onDoneRef = useRef(onDone);
  const onDisplayedRef = useRef(onDisplayed);
  const overlayRef = useRef<HTMLDivElement>(null);
  const displayedRef = useRef<string | null>(null);
  const [mounted, setMounted] = useState(false);

  onDoneRef.current = onDone;
  onDisplayedRef.current = onDisplayed;

  const visible = phase === "loading" || phase === "revealed";

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (phase !== "revealed" || !card || !eventId) return;
    if (displayedRef.current === eventId) return;
    const frame = requestAnimationFrame(() => {
      if (!overlayRef.current) return;
      displayedRef.current = eventId;
      onDisplayedRef.current?.(eventId);
    });
    return () => cancelAnimationFrame(frame);
  }, [phase, card, eventId]);

  useEffect(() => {
    if (phase !== "revealed" || !card) return;
    const timer = window.setTimeout(() => onDoneRef.current(), reduced ? 900 : 2600);
    return () => window.clearTimeout(timer);
  }, [phase, card, reduced]);

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
            initial={reduced ? false : { scale: phase === "revealed" ? 0.7 : 0.9, rotate: phase === "revealed" ? -14 : 0, y: phase === "revealed" ? 48 : 0, opacity: 0 }}
            animate={
              phase === "revealed"
                ? { scale: 1, rotate: -4, y: 0, opacity: 1 }
                : { scale: 1, rotate: 0, y: 0, opacity: 1 }
            }
            exit={reduced ? undefined : { scale: 0.92, rotate: -2, y: -8, opacity: 0 }}
            transition={
              reduced
                ? { duration: 0 }
                : { type: "spring", stiffness: 300, damping: 22, mass: 0.85 }
            }
            onClick={(event) => event.stopPropagation()}
          >
            <motion.div
              className="deck-halo absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2"
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 0.9, scale: 1 }}
              transition={reduced ? { duration: 0 } : { duration: 0.6, delay: 0.1, ease: "easeOut" }}
            />
            <div className="relative">
              {phase === "revealed" && card ? (
                <MerchantCardRenderer
                  template={card.cardTemplate}
                  merchant={{
                    name: card.name,
                    logoUrl: card.logoUrl,
                    primaryColor: card.primaryColor,
                  }}
                  card={card}
                  slug={card.slug}
                  clientName={clientName}
                  clientNumber={clientNumber}
                  displayMode={UNLOCK_REVEAL_DISPLAY_MODE}
                  showQr
                  qrSrc={qrSrc}
                  qrFetchPriority="high"
                  interactive
                />
              ) : (
                <div className="grid h-[min(58vw,220px)] w-full place-items-center rounded-[18px] border border-white/10 bg-black/20">
                  <div className="h-10 w-10 animate-pulse rounded-full bg-[var(--violet-bright)]/30" aria-hidden />
                </div>
              )}
              <div className="pointer-events-none absolute inset-x-0 bottom-4 px-5 text-center">
                <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[var(--violet-bright)] drop-shadow">
                  Nouvelle carte débloquée
                </p>
                <p className="mt-2 text-xs text-white/80 drop-shadow">
                  {phase === "revealed"
                    ? "La carte rejoint votre portefeuille Fife Life."
                    : "Préparation de votre carte…"}
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
