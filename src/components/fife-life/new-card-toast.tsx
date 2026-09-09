"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { MerchantCardRenderer } from "./merchant-card-renderer";
import type { MerchantCardData } from "./types";

export function NewCardToast({
  name,
  card,
  eventId,
  onDisplayed,
  onDone,
}: {
  name: string | null;
  card?: MerchantCardData | null;
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

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!name || !eventId) return;
    if (displayedRef.current === eventId) return;
    const frame = requestAnimationFrame(() => {
      if (!overlayRef.current) return;
      displayedRef.current = eventId;
      onDisplayedRef.current?.(eventId);
    });
    return () => cancelAnimationFrame(frame);
  }, [name, eventId]);

  useEffect(() => {
    if (!name) return;
    const timer = window.setTimeout(() => onDoneRef.current(), reduced ? 900 : 2600);
    return () => window.clearTimeout(timer);
  }, [name, reduced]);

  const previewCard: MerchantCardData =
    card ?? {
      id: "new-card-preview",
      merchantId: "preview",
      slug: "",
      name: name ?? "Nouveau commerce",
      logoUrl: null,
      primaryColor: "#8557ff",
      points: 0,
      visitsRequired: 10,
      rewardLabel: "Récompense",
    };

  if (!mounted || !name) return null;

  return createPortal(
    <AnimatePresence>
      {name ? (
        <motion.div
          ref={overlayRef}
          className="fixed inset-0 z-[9999] grid place-items-center px-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={reduced ? { duration: 0 } : { duration: 0.25 }}
          onClick={() => onDoneRef.current()}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[3px]" aria-hidden />
          <motion.div
            className="relative w-full max-w-[min(360px,92vw)]"
            initial={reduced ? false : { scale: 0.7, rotate: -14, y: 48, opacity: 0 }}
            animate={{ scale: 1, rotate: -4, y: 0, opacity: 1 }}
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
              <MerchantCardRenderer
                template={previewCard.cardTemplate}
                merchant={{
                  name: name ?? previewCard.name,
                  logoUrl: previewCard.logoUrl,
                  primaryColor: previewCard.primaryColor,
                }}
                card={{ ...previewCard, name: name ?? previewCard.name }}
                slug={previewCard.slug}
                displayMode="personalized"
                showQr={false}
                interactive
              />
              <div className="pointer-events-none absolute inset-x-0 bottom-4 px-5 text-center">
                <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[var(--violet-bright)] drop-shadow">
                  Nouvelle carte débloquée
                </p>
                <p className="mt-2 text-xs text-white/80 drop-shadow">La carte rejoint votre portefeuille Fife Life.</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}
