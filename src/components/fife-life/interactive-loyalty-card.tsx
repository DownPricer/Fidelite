"use client";

import { useEffect, useMemo, useState } from "react";
import { cn } from "@/components/ui";
import { buildLoyaltyCardViewModel, type LoyaltyCardQrMode } from "@/lib/loyalty-card-view-model";
import { getLoyaltyCardBackground } from "@/lib/loyalty-card-assets";
import { getCachedQr, loadUniversalQr } from "./qr-cache";
import type { WalletTier } from "./types";
import { InteractiveCardShell } from "./interactive-card-shell";

type InteractiveLoyaltyCardProps = {
  tier: WalletTier;
  name: string;
  points: number;
  qrSrc?: string | null;
  qrMode?: LoyaltyCardQrMode;
  showQr?: boolean;
  statusText?: string;
  progressPercent?: number;
  interactive?: boolean;
  entrance?: boolean;
  className?: string;
  shellClassName?: string;
  as?: "article" | "div" | "button";
} & Omit<React.HTMLAttributes<HTMLElement>, "children">;

export function InteractiveLoyaltyCard({
  tier,
  name,
  points,
  qrSrc = null,
  qrMode = "engraved",
  showQr = false,
  statusText,
  progressPercent,
  interactive = true,
  entrance = false,
  className,
  shellClassName,
  as = "article",
  ...rest
}: InteractiveLoyaltyCardProps) {
  const model = useMemo(
    () =>
      buildLoyaltyCardViewModel({
        tier,
        name,
        points,
        qrMode,
        statusText,
        progressPercent,
      }),
    [tier, name, points, qrMode, statusText, progressPercent],
  );

  const [qrVisible, setQrVisible] = useState(false);
  const [qrFailed, setQrFailed] = useState(false);
  const [autoQr, setAutoQr] = useState<string | null>(() => (showQr && !qrSrc ? getCachedQr() : null));

  // Auto-load QR if showQr is true and no qrSrc provided
  useEffect(() => {
    if (!showQr || qrSrc) return;
    if (autoQr) return;
    let cancelled = false;
    void loadUniversalQr("fife-life").then((next) => {
      if (!cancelled && next) setAutoQr(next);
    });
    return () => {
      cancelled = true;
    };
  }, [showQr, qrSrc, autoQr]);

  useEffect(() => {
    setQrVisible(false);
    setQrFailed(false);
  }, [qrSrc, autoQr]);

  const effectiveQrSrc = qrSrc || autoQr;

  const Element = as;
  const backgroundSrc = getLoyaltyCardBackground(tier);

  return (
    <InteractiveCardShell
      interactive={interactive}
      entrance={entrance}
      className={cn("loyalty-card-shell w-full", shellClassName)}
    >
      <Element
        {...rest}
        data-tier={model.tierKey}
        data-qr-mode={model.qrMode}
        aria-label={`Carte ${model.tierLabel} de ${model.name}`}
        className={cn("loyalty-card", className)}
        style={{ ["--progress" as never]: `${model.progress}%` }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={backgroundSrc}
          alt=""
          className="loyalty-card__background"
          draggable={false}
        />

        <div className="loyalty-card__overlay">
          <header className="loyalty-card__heading">
            <p className="loyalty-card__eyebrow">MEMBRE</p>
            <h2 className="loyalty-card__tier">{model.tierLabel}</h2>
          </header>

          {showQr ? (
            <div className="loyalty-card__qr">
              {effectiveQrSrc && !qrFailed ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={effectiveQrSrc}
                  alt={`QR code de ${model.name}`}
                  className="loyalty-card__qr-image"
                  hidden={!qrVisible}
                  onLoad={() => setQrVisible(true)}
                  onError={() => setQrFailed(true)}
                />
              ) : null}
              {!effectiveQrSrc || qrFailed || !qrVisible ? (
                <span className="loyalty-card__qr-placeholder">
                  {qrFailed ? "QR INDISPONIBLE" : "QR CLIENT"}
                </span>
              ) : null}
            </div>
          ) : null}

          <p className="loyalty-card__name" data-length={model.nameLength} title={model.name}>
            {model.name}
          </p>

          <p className="loyalty-card__points" data-length={model.pointsLength}>
            {model.pointsText}
          </p>

          <p className="loyalty-card__status" data-length={model.statusLength} title={model.status}>
            {model.status}
          </p>

          {model.showProgress ? (
            <div
              className="loyalty-card__progress"
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(model.progress * 10) / 10}
              aria-label={model.status || "Progression du membre"}
              aria-valuetext={model.status || `${Math.round(model.progress)} %`}
            >
              <span className="loyalty-card__progress-fill" />
            </div>
          ) : null}
        </div>
      </Element>
    </InteractiveCardShell>
  );
}
