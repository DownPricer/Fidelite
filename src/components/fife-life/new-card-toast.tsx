"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";
import { PrismCard } from "./prism-card";

export function NewCardToast({
  name,
  onDone,
}: {
  name: string | null;
  onDone: () => void;
}) {
  const reduced = useReducedMotion();
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  useEffect(() => {
    if (!name) return;
    const timer = window.setTimeout(() => onDoneRef.current(), reduced ? 900 : 2600);
    return () => window.clearTimeout(timer);
  }, [name, reduced]);

  return (
    <AnimatePresence>
      {name ? (
        <motion.div
          className="fixed inset-0 z-[60] grid place-items-center px-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={reduced ? { duration: 0 } : { duration: 0.25 }}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[3px]" aria-hidden />
          <motion.div
            className="relative w-full max-w-[320px]"
            initial={reduced ? false : { scale: 0.7, rotate: -14, y: 48, opacity: 0 }}
            animate={{ scale: 1, rotate: -4, y: 0, opacity: 1 }}
            exit={reduced ? undefined : { scale: 0.92, rotate: -2, y: -8, opacity: 0 }}
            transition={
              reduced
                ? { duration: 0 }
                : { type: "spring", stiffness: 300, damping: 22, mass: 0.85 }
            }
          >
            <motion.div
              className="deck-halo absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2"
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 0.9, scale: 1 }}
              transition={reduced ? { duration: 0 } : { duration: 0.6, delay: 0.1, ease: "easeOut" }}
            />
            <PrismCard material="merchant" hue="#8557ff" className="p-5 text-center">
              <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[var(--violet-bright)]">
                Nouvelle carte obtenue
              </p>
              <h2 className="mt-3 text-xl font-black tracking-tight text-[var(--ink)]">{name}</h2>
              <p className="mt-2 text-xs text-[var(--ink-soft)]">La carte rejoint votre portefeuille Fife Life.</p>
            </PrismCard>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
