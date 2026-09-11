"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/components/ui";
import { QrEnlargedView } from "./qr-enlarged-view";
import { useClientMounted } from "./use-client-mounted";

type ExpandableQrCodeProps = {
  qrSrc: string | null;
  clientNumber?: string | null;
  merchantName?: string | null;
  zoomEnabled?: boolean;
  className?: string;
  shellClassName?: string;
  imgClassName?: string;
  fetchPriority?: "high" | "low" | "auto";
  placeholder?: React.ReactNode;
  onLoad?: () => void;
  onError?: () => void;
};

export function ExpandableQrCode({
  qrSrc,
  clientNumber,
  merchantName,
  zoomEnabled = true,
  className,
  shellClassName,
  imgClassName,
  fetchPriority = "auto",
  placeholder,
  onLoad,
  onError,
}: ExpandableQrCodeProps) {
  const mounted = useClientMounted();
  const [open, setOpen] = useState(false);
  const canZoom = zoomEnabled && Boolean(qrSrc);

  function openQr() {
    if (!canZoom) return;
    setOpen(true);
  }

  function handleActivate(event: React.MouseEvent | React.KeyboardEvent) {
    event.preventDefault();
    event.stopPropagation();
    openQr();
  }

  function stopCardExpand(event: React.PointerEvent | React.MouseEvent) {
    event.stopPropagation();
  }

  const content = qrSrc ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={qrSrc}
      alt=""
      className={cn("merchant-card-qr-image h-full w-full object-contain", imgClassName)}
      draggable={false}
      loading="eager"
      decoding="async"
      fetchPriority={fetchPriority}
      onLoad={onLoad}
      onError={onError}
    />
  ) : (
    placeholder ?? (
      <div className="merchant-card-qr-placeholder grid h-full w-full min-h-[2rem] min-w-[2rem] place-items-center text-[10px] font-bold text-black/40">
        QR
      </div>
    )
  );

  return (
    <>
      <div
        className={cn(
          "merchant-card-qr-shell rounded-xl bg-white shadow-sm",
          canZoom && "merchant-card-qr-shell--zoomable cursor-pointer",
          shellClassName,
        )}
      >
        {canZoom ? (
          <div
            role="button"
            tabIndex={0}
            aria-label="Agrandir le QR code"
            data-no-card-expand="true"
            className={cn("merchant-card-qr-hitbox h-full w-full", className)}
            style={{ pointerEvents: "auto" }}
            onPointerDown={stopCardExpand}
            onPointerUp={stopCardExpand}
            onClick={handleActivate}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                handleActivate(event);
              }
            }}
          >
            {content}
          </div>
        ) : (
          <div className={cn("h-full w-full", className)}>{content}</div>
        )}
      </div>

      {mounted && canZoom
        ? createPortal(
            <QrEnlargedView
              open={open}
              qrSrc={qrSrc ?? ""}
              clientNumber={clientNumber}
              merchantName={merchantName}
              onClose={() => setOpen(false)}
            />,
            document.body,
          )
        : null}
    </>
  );
}
