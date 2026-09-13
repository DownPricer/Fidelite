"use client";

import { useEffect, useState } from "react";
import { QrEnlargedView } from "./qr-enlarged-view";

type WalletQrActionProps = {
  qrSrc: string | null;
  qrFailed?: boolean;
  onRetry?: () => void;
  clientNumber?: string | null;
  merchantName?: string | null;
  className?: string;
};

export function WalletQrAction({
  qrSrc,
  qrFailed = false,
  onRetry,
  clientNumber,
  merchantName,
  className = "",
}: WalletQrActionProps) {
  const [open, setOpen] = useState(false);
  const loading = !qrSrc && !qrFailed;

  useEffect(() => {
    if (!open) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  function stopCardExpand(event: React.MouseEvent | React.PointerEvent | React.TouchEvent) {
    event.preventDefault();
    event.stopPropagation();
  }

  return (
    <div className={`wallet-qr-action-wrap ${className}`} data-no-card-expand="true">
      <button
        type="button"
        data-no-card-expand="true"
        className="wallet-qr-action"
        disabled={loading}
        aria-busy={loading}
        aria-label={qrFailed ? "Réessayer le chargement du QR code" : "Ouvrir le QR code"}
        onPointerDown={stopCardExpand}
        onTouchStart={stopCardExpand}
        onClick={(event) => {
          stopCardExpand(event);
          if (qrFailed) {
            onRetry?.();
            return;
          }
          if (qrSrc) setOpen(true);
        }}
      >
        <span className="wallet-qr-action__icon" aria-hidden>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
            <path d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4z" />
            <path d="M14 14h2v2h-2zM18 14h2v4h-2zM14 18h4v2h-4z" />
          </svg>
        </span>
        <span>{qrFailed ? "Réessayer" : loading ? "QR en cours…" : "Ouvrir le QR code"}</span>
      </button>

      {qrSrc ? (
        <QrEnlargedView
          open={open}
          qrSrc={qrSrc}
          clientNumber={clientNumber}
          merchantName={merchantName}
          onClose={() => setOpen(false)}
        />
      ) : null}
    </div>
  );
}
