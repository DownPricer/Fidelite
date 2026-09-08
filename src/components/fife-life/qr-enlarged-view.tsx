"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect } from "react";

type QrEnlargedViewProps = {
  open: boolean;
  qrSrc: string;
  clientNumber?: string | null;
  onClose: () => void;
};

export function QrEnlargedView({ open, qrSrc, clientNumber, onClose }: QrEnlargedViewProps) {
  const reduced = useReducedMotion();

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

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="qr-enlarged-overlay fixed inset-0 z-[110] flex items-center justify-center bg-[#05050a]/95 px-5 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={reduced ? { duration: 0 } : { duration: 0.2 }}
          onClick={onClose}
        >
          <motion.div
            className="qr-enlarged-panel w-full max-w-sm text-center"
            initial={{ scale: 0.92 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.92 }}
            transition={reduced ? { duration: 0 } : { type: "spring", stiffness: 280, damping: 28 }}
            onClick={onClose}
          >
            <div className="qr-enlarged-frame mx-auto rounded-3xl bg-white p-6 shadow-[0_24px_80px_rgba(0,0,0,0.65)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={qrSrc} alt="QR code agrandi" className="mx-auto h-auto w-full max-w-[280px]" />
              {clientNumber ? (
                <p className="mt-4 text-lg font-black tabular-nums tracking-[0.2em] text-[#0F172A]">
                  {clientNumber.replace(/(\d{3})(?=\d)/g, "$1 ")}
                </p>
              ) : null}
            </div>
            <p className="qr-enlarged-hint mt-5 text-sm text-[var(--muted)]">Appuyez pour fermer</p>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
