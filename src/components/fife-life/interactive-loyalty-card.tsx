"use client";

import { useEffect, useMemo, useState } from "react";
import { cn } from "@/components/ui";
import { formatClientNumberDisplay } from "@/lib/client-number";
import { buildLoyaltyCardViewModel, type LoyaltyCardQrMode } from "@/lib/loyalty-card-view-model";
import { getLoyaltyCardBackground } from "@/lib/loyalty-card-assets";
import { loadPersonalizedQr } from "./qr-cache";
import { ExpandableQrCode } from "./expandable-qr-code";
import type { WalletTier } from "./types";
import { InteractiveCardShell } from "./interactive-card-shell";

type InteractiveLoyaltyCardProps = {
  tier: WalletTier;
  name: string;
  points: number;
  qrSrc?: string | null;
  qrMode?: LoyaltyCardQrMode;
  showQr?: boolean;
  clientNumber?: string | null;
  qrZoomEnabled?: boolean;
  qrFetchPriority?: "high" | "low" | "auto";
  onQrRetry?: () => void;
  statusText?: string;
  progressPercent?: number;
  interactive?: boolean;
  entrance?: boolean;
  layout?: "default" | "enlarged";
  className?: string;
  shellClassName?: string;
  as?: "article" | "div" | "button";
} & Omit<React.HTMLAttributes<HTMLElement>, "children">;

export function InteractiveLoyaltyCard({
  tier,
  name,
  points,
  qrSrc = null,
  qrMode = "standard",
  showQr = false,
  clientNumber = null,
  qrZoomEnabled = false,
  qrFetchPriority = "auto",
  onQrRetry,
  statusText,
  progressPercent,
  interactive = true,
  entrance = false,
  layout = "default",
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

  const [qrFailed, setQrFailed] = useState(false);
  const [autoQr, setAutoQr] = useState<string | null>(null);

  useEffect(() => {
    if (!showQr || qrSrc) return;
    let cancelled = false;
    void loadPersonalizedQr("fife-life").then((next) => {
      if (!cancelled && next) setAutoQr(next);
    });
    return () => {
      cancelled = true;
    };
  }, [showQr, qrSrc]);

  useEffect(() => {
    setQrFailed(false);
  }, [qrSrc, autoQr]);

  const effectiveQrSrc = qrSrc || autoQr;
  const Element = as;
  const backgroundSrc = getLoyaltyCardBackground(tier);
  const enlarged = layout === "enlarged";

  const card = (
    <Element
      {...rest}
      data-tier={model.tierKey}
      data-qr-mode={model.qrMode}
      aria-label={`Carte ${model.tierLabel} de ${model.name}`}
      className={cn("loyalty-card", enlarged && "loyalty-card--enlarged", className)}
      style={{ ["--progress" as never]: `${model.progress}%` }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={backgroundSrc} alt="" className="loyalty-card__background" draggable={false} />

      <div className="loyalty-card__overlay">
        <header className="loyalty-card__heading">
          <p className="loyalty-card__eyebrow">MEMBRE</p>
          <h2 className="loyalty-card__tier">{model.tierLabel}</h2>
        </header>

        {showQr ? (
          <div
            className="loyalty-card__qr-block"
            data-no-card-expand="true"
            style={{ pointerEvents: "auto" }}
            onPointerDown={(event) => event.stopPropagation()}
            onPointerUp={(event) => event.stopPropagation()}
            onClick={(event) => event.stopPropagation()}
          >
            <ExpandableQrCode
              qrSrc={effectiveQrSrc && !qrFailed ? effectiveQrSrc : null}
              clientNumber={clientNumber}
              merchantName="Fife Life"
              zoomEnabled={qrZoomEnabled}
              fetchPriority={qrFetchPriority}
              onError={() => setQrFailed(true)}
              shellClassName="loyalty-card__qr !rounded-[0.7cqw] !p-[3%] !shadow-none"
              imgClassName="loyalty-card__qr-image"
              placeholder={
                <span className="loyalty-card__qr-placeholder">
                  {qrFailed ? (
                    <button type="button" className="text-[10px] font-bold" onClick={onQrRetry}>
                      RÉESSAYER
                    </button>
                  ) : (
                    "QR CLIENT"
                  )}
                </span>
              }
            />
          </div>
        ) : null}

        <p className="loyalty-card__name" data-length={model.nameLength} title={model.name}>
          {model.name}
        </p>

        {showQr && clientNumber ? (
          <p className="loyalty-card__client-number" title={`Numéro client ${clientNumber}`}>
            N° {formatClientNumberDisplay(clientNumber)}
          </p>
        ) : null}

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
  );

  if (enlarged) return card;

  return (
    <InteractiveCardShell
      interactive={interactive}
      entrance={entrance}
      halo={false}
      className={cn("loyalty-card-shell w-full", shellClassName)}
    >
      {card}
    </InteractiveCardShell>
  );
}
