"use client";

import { useEffect, useState } from "react";
import { cn } from "@/components/ui";
import { loadPersonalizedQr } from "./qr-cache";
import { PREVIEW_QR } from "./preview-data";
import { ExpandableQrCode } from "./expandable-qr-code";
import { InteractiveCardShell } from "./interactive-card-shell";
import type { MerchantCardData } from "./types";

type MerchantInteractiveCardProps = {
  card: MerchantCardData;
  slug: string;
  preview?: boolean;
  showQr?: boolean;
  qrSrc?: string | null;
  compactQr?: boolean;
  clientNumber?: string | null;
  qrZoomEnabled?: boolean;
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
  qrSrc: qrSrcProp = null,
  compactQr = false,
  clientNumber = null,
  qrZoomEnabled = false,
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

  const [qr, setQr] = useState<string | null>(() => (preview ? PREVIEW_QR : null));
  const [qrError, setQrError] = useState(false);

  useEffect(() => {
    if (preview) {
      setQr(PREVIEW_QR);
      return;
    }
    if (qrSrcProp) {
      setQr(qrSrcProp);
      return;
    }
    let cancelled = false;
    void loadPersonalizedQr(slug).then((next) => {
      if (cancelled) return;
      if (next) setQr(next);
      else setQrError(true);
    });
    return () => {
      cancelled = true;
    };
  }, [preview, slug, qrSrcProp]);

  const Element = as;

  return (
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
          <div
            className={cn("merchant-interactive-card__qr-wrap", compactQr && "is-compact")}
            data-no-card-expand="true"
            style={{ pointerEvents: "auto" }}
            onPointerDown={(event) => event.stopPropagation()}
            onPointerUp={(event) => event.stopPropagation()}
            onClick={(event) => event.stopPropagation()}
          >
            <ExpandableQrCode
              qrSrc={qr && !qrError ? qr : null}
              clientNumber={clientNumber}
              merchantName={card.name}
              zoomEnabled={qrZoomEnabled}
              shellClassName={cn(
                "merchant-interactive-card__qr",
                compactQr && "is-compact",
                "!relative !h-auto !w-auto !min-h-0 !bg-transparent !p-0 !shadow-none",
              )}
              imgClassName="merchant-interactive-card__qr-image"
              placeholder={
                <span className="merchant-interactive-card__qr-placeholder">
                  {qrError ? "QR INDISPONIBLE" : "QR CLIENT"}
                </span>
              }
            />
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
  );
}
