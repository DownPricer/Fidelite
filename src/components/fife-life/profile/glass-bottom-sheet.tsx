"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

export function GlassBottomSheet({
  open,
  title,
  onClose,
  children,
}: {
  open: boolean;
  title?: string;
  onClose: () => void;
  children: ReactNode;
}) {
  const reduced = useReducedMotion();
  const spring = reduced ? { duration: 0 } : { type: "spring" as const, stiffness: 340, damping: 34 };

  return (
    <AnimatePresence>
      {open ? (
        <>
          <motion.div
            aria-hidden
            className="sheet-backdrop fixed inset-0 z-[60]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.section
            role="dialog"
            aria-modal="true"
            aria-label={title}
            className="obsidian-sheet fife-desktop-sheet fixed inset-x-0 bottom-0 z-[70] flex max-h-[min(88dvh,720px)] flex-col overflow-hidden rounded-t-[32px]"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={spring}
          >
            <div className="sheet-halo" aria-hidden />
            <div className="flex justify-center pt-3">
              <div className="h-1 w-10 rounded-full bg-white/20" />
            </div>
            {title ? (
              <h2 className="px-6 pt-4 text-center text-sm font-bold uppercase tracking-[0.14em] text-[var(--muted)]">
                {title}
              </h2>
            ) : null}
            <div className="flex-1 overflow-y-auto overscroll-contain px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-3">
              {children}
            </div>
          </motion.section>
        </>
      ) : null}
    </AnimatePresence>
  );
}

export function SheetAction({
  label,
  tone = "default",
  onClick,
  disabled,
}: {
  label: string;
  tone?: "default" | "danger";
  onClick?: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`profile-sheet-action w-full rounded-2xl px-4 py-3.5 text-left text-sm font-semibold transition active:scale-[0.98] disabled:opacity-50 ${
        tone === "danger" ? "text-[var(--danger)]" : "text-[var(--ink)]"
      }`}
    >
      {label}
    </button>
  );
}
