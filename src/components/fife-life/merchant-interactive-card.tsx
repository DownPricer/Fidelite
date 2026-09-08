"use client";

import { useEffect, useState } from "react";
import { cn } from "@/components/ui";
import { getCachedQr, loadUniversalQr } from "./qr-cache";
import { PREVIEW_QR } from "./preview-data";
import { QrEnlargedView } from "./qr-enlarged-view";
import { InteractiveCardShell } from "./interactive-card-shell";
import type { MerchantCardData } from "./types";

type MerchantInteractiveCardProps = {
  card: MerchantCardData;
  slug: string;
  preview?: boolean;
  showQr?: boolean;
  compactQr?: boolean;
  clientNumber?: string | null;
  interactive?: boolean;
  entrance?: boolean;
  className?: string;
  shellClassName?: string;
  as?: "article" | "div" | "button";
} & Omit<React.HTMLAttributes<HTMLElement>, "children">;

export function MerchantInteractiveCard({
  card,
  slug,
  preview = false,
  showQr = true,
  compactQr = false,
  clientNumber = null,
  interactive = true,
  entrance = false,
  className,
  shellClassName,
  as = "article",
  ...rest
}: MerchantInteractiveCardProps) {
  const remaining = Math.max(0, card.visitsRequired - card.points);
  const progress = Math.min(100, Math.max(0, (card.points / Math.max(1, card.visitsRequired)) * 100));
  const rewardAvailable = card.points >= card.visitsRequired;
  const status = rewardAvailable
    ? `${card.rewardLabel} disponible`
    : `Encore ${remaining} · ${card.rewardLabel}`;

  const [qr, setQr] = useState<string | null>(() => (preview ? PREVIEW_QR : getCachedQr()));
  const [qrError, setQrError] = useState(false);
  const [qrEnlarged, setQrEnlarged] = useState(false);

  useEffect(() => {
    if (preview) {
      setQr(PREVIEW_QR);
      return;
    }
    if (qr) return;
    let cancelled = false;
    void loadUniversalQr(slug).then((next) => {
      if (cancelled) return;
      if (next) setQr(next);
      else setQrError(true);
    });
    return () => {
      cancelled = true;
    };
  }, [preview, slug, qr]);

  const Element = as;

  return (
    <>
      <InteractiveCardShell
        interactive={interactive}
        entrance={entrance}
        halo={false}
        className={cn("merchant-card-shell w-full", shellClassName)}
      >
        <Element
          {...rest}
          data-merchant-card
          aria-label={`Carte ${card.name}`}
          className={cn("merchant-interactive-card", className)}
          style={{
            ["--merchant-hue" as never]: card.primaryColor,
            ["--merchant-progress" as never]: `${progress}%`,
          }}
        >
          <div className="merchant-interactive-card__noise" aria-hidden />

          <header className="merchant-interactive-card__header">
            {card.logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={card.logoUrl} alt="" className="merchant-interactive-card__logo" />
            ) : (
              <div
                className="merchant-interactive-card__logo-fallback"
                style={{ backgroundColor: card.primaryColor }}
              >
                {card.name.slice(0, 1)}
              </div>
            )}
            <div className="merchant-interactive-card__brand">
              <p className="merchant-interactive-card__eyebrow">Fife Life</p>
              <h2 className="merchant-interactive-card__name">{card.name}</h2>
            </div>
          </header>

          {showQr ? (
            <div className={cn("merchant-interactive-card__qr-wrap", compactQr && "is-compact")}>
              <button
                type="button"
                className={cn("merchant-interactive-card__qr", compactQr && "is-compact")}
                aria-label="Agrandir le QR code"
                onClick={(event) => {
                  event.stopPropagation();
                  if (qr && !qrError) setQrEnlarged(true);
                }}
              >
                {qr && !qrError ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={qr} alt={`QR ${card.name}`} className="merchant-interactive-card__qr-image" />
                ) : (
                  <span className="merchant-interactive-card__qr-placeholder">
                    {qrError ? "QR INDISPONIBLE" : "QR CLIENT"}
                  </span>
                )}
              </button>
              {clientNumber ? (
                <p className="merchant-interactive-card__client-number">{clientNumber.replace(/(\d{3})(?=\d)/g, "$1 ")}</p>
              ) : null}
            </div>
          ) : null}

          <div className="merchant-interactive-card__points">
            <p className="merchant-interactive-card__points-value">
              {card.points}
              <span>/{card.visitsRequired}</span>
            </p>
            <p className="merchant-interactive-card__status">{status}</p>
          </div>

          <div
            className="merchant-interactive-card__progress"
            role="progressbar"
            aria-valuenow={Math.round(progress)}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <span className="merchant-interactive-card__progress-fill" />
          </div>
        </Element>
      </InteractiveCardShell>

      <QrEnlargedView
        open={qrEnlarged}
        qrSrc={qr ?? ""}
        clientNumber={clientNumber}
        onClose={() => setQrEnlarged(false)}
      />
    </>
  );
}
