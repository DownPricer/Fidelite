"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";

/** Modale centrée (fixed inset-0), au-dessus de la barre latérale, scroll du body bloqué. */
export function CenteredDialog({
  open,
  onClose,
  title,
  children,
  footer,
  testId,
  maxWidthClass = "max-w-lg",
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  testId?: string;
  maxWidthClass?: string;
}) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6"
      role="presentation"
      data-testid={testId}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="absolute inset-0 bg-black/72" aria-hidden />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={testId ? `${testId}-title` : undefined}
        className={`relative z-[1] flex max-h-[min(92dvh,720px)] w-full ${maxWidthClass} flex-col overflow-hidden rounded-2xl border border-[var(--border,#5a456e)] bg-[var(--panel,#1c1529)] text-[var(--ink,#fff)] shadow-[0_35px_100px_rgba(0,0,0,0.55)]`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex shrink-0 items-start justify-between gap-3 border-b border-[var(--border,#3b314c)] px-5 py-4">
          <h2 id={testId ? `${testId}-title` : undefined} className="text-lg font-black leading-snug">
            {title}
          </h2>
          <button
            type="button"
            aria-label="Fermer"
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-[var(--border)] text-lg leading-none opacity-80 hover:opacity-100"
            onClick={onClose}
          >
            ×
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4 text-sm">{children}</div>
        {footer ? <div className="shrink-0 border-t border-[var(--border,#3b314c)] px-5 py-4">{footer}</div> : null}
      </div>
    </div>,
    document.body,
  );
}
