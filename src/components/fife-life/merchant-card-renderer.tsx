"use client";

import { useEffect, useMemo, useState } from "react";
import { cn } from "@/components/ui";
import type { CardElement, CardTemplateConfig } from "@/lib/card-template-schema";
import {
  DECORATIVE_QR_SRC,
  rectStyle,
  resolveElementRect,
} from "@/lib/merchant-card-layout";
import type { LoyaltyMode } from "@prisma/client";
import { MerchantInteractiveCard } from "./merchant-interactive-card";
import { getCachedQr, loadUniversalQr } from "./qr-cache";
import type { MerchantCardData } from "./types";

export type MerchantCardDisplayMode = "personalized" | "publicPreview" | "adminPreview" | "compact";

const COMPACT_HIDDEN: CardElement["type"][] = ["clientName", "qr", "progressText", "staticText", "expiryDate"];

export type MerchantCardRendererProps = {
  template?: {
    backgroundUrl?: string | null;
    config: CardTemplateConfig;
    loyaltyMode: LoyaltyMode;
  } | null;
  merchant: {
    name: string;
    logoUrl?: string | null;
    primaryColor: string;
  };
  card: MerchantCardData;
  slug: string;
  clientName?: string;
  clientNumber?: string | null;
  progress?: {
    current: number;
    target: number;
    label: string;
    nextReward?: string | null;
    unlockedReward?: string | null;
    tierLabel?: string | null;
  };
  displayMode?: MerchantCardDisplayMode;
  showQr?: boolean;
  interactive?: boolean;
  className?: string;
  shellClassName?: string;
  as?: "article" | "div" | "button";
  onClick?: () => void;
};

function displayClientName(mode: MerchantCardDisplayMode, name?: string) {
  if (mode === "personalized") return name ?? "Membre";
  if (mode === "adminPreview") return "Aperçu client";
  if (mode === "publicPreview") return "Membre Fife Life";
  return name ?? "Membre";
}

function shouldHideElement(type: CardElement["type"], mode: MerchantCardDisplayMode) {
  if (mode !== "compact") return false;
  return COMPACT_HIDDEN.includes(type);
}

function shouldMaskProgress(mode: MerchantCardDisplayMode) {
  return mode === "publicPreview";
}

/** Pure helper — garantit qu'aucun QR réel n'est exposé en aperçu public. */
export function resolveDisplayQrSrc(
  displayMode: MerchantCardDisplayMode,
  showQr: boolean,
  realQr: string | null,
): string | null {
  if (!showQr) return null;
  if (displayMode === "publicPreview" || displayMode === "adminPreview") return DECORATIVE_QR_SRC;
  if (displayMode === "compact") return null;
  if (displayMode === "personalized") return realQr;
  return null;
}

function ElementView({
  element,
  merchant,
  clientName,
  progress,
  qrSrc,
  showQr,
  displayMode,
}: {
  element: CardElement;
  merchant: MerchantCardRendererProps["merchant"];
  clientName: string;
  progress: NonNullable<MerchantCardRendererProps["progress"]>;
  qrSrc: string | null;
  showQr: boolean;
  displayMode: MerchantCardDisplayMode;
}) {
  if (element.hidden || shouldHideElement(element.type, displayMode)) return null;

  const rect = resolveElementRect(element);
  const style = { ...rectStyle(rect), zIndex: element.zIndex };
  const textStyle = element.style;
  const masked = shouldMaskProgress(displayMode);

  switch (element.type) {
    case "logo":
      return (
        <div style={style} className="flex items-center justify-center overflow-hidden rounded-xl">
          {merchant.logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={merchant.logoUrl} alt="" className="h-full w-full object-contain" />
          ) : (
            <div
              className="flex h-full w-full items-center justify-center rounded-xl text-lg font-black text-white"
              style={{ backgroundColor: merchant.primaryColor }}
            >
              {merchant.name.slice(0, 1)}
            </div>
          )}
        </div>
      );
    case "merchantName":
      return (
        <div
          style={{
            ...style,
            color: textStyle?.color,
            fontSize: textStyle?.fontSize,
            fontWeight: Number(textStyle?.fontWeight ?? 700),
            textAlign: textStyle?.textAlign,
            opacity: textStyle?.opacity,
            lineHeight: textStyle?.lineHeight,
            textShadow: textStyle?.shadow ? "0 2px 8px rgba(0,0,0,0.45)" : undefined,
          }}
          className="flex items-center overflow-hidden"
        >
          {merchant.name}
        </div>
      );
    case "clientName":
      return (
        <div style={{ ...style, color: textStyle?.color, fontSize: textStyle?.fontSize }} className="flex items-center">
          {clientName}
        </div>
      );
    case "qr":
      if (!showQr) return null;
      return (
        <div style={style} className="rounded-xl bg-white p-[6%] shadow-sm">
          {qrSrc ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={qrSrc} alt="" className="h-full w-full object-contain" draggable={false} />
          ) : (
            <div className="grid h-full w-full place-items-center text-[10px] font-bold text-black/40">QR</div>
          )}
        </div>
      );
    case "pointsBalance":
    case "visitsCount":
      if (masked) {
        return (
          <div style={{ ...style, color: textStyle?.color, fontSize: textStyle?.fontSize }} className="flex items-end font-black opacity-60">
            •••
          </div>
        );
      }
      return (
        <div style={{ ...style, color: textStyle?.color, fontSize: textStyle?.fontSize }} className="flex items-end font-black">
          {progress.current}
          <span className="ml-1 text-[0.65em] opacity-70">/{progress.target}</span>
        </div>
      );
    case "progressText":
      return (
        <div style={{ ...style, color: textStyle?.color, fontSize: textStyle?.fontSize }} className="flex items-center">
          {masked ? "Progression fidélité" : progress.label}
        </div>
      );
    case "nextReward":
      return (
        <div style={{ ...style, color: textStyle?.color, fontSize: textStyle?.fontSize }} className="flex items-center">
          {masked ? "Récompense membre" : progress.nextReward ?? progress.label}
        </div>
      );
    case "unlockedReward":
      return (
        <div style={{ ...style, color: textStyle?.color, fontSize: textStyle?.fontSize }} className="flex items-center">
          {masked ? "—" : progress.unlockedReward ?? "—"}
        </div>
      );
    case "tierLevel":
      return (
        <div style={{ ...style, color: textStyle?.color, fontSize: textStyle?.fontSize }} className="flex items-center">
          {masked ? "Palier" : progress.tierLabel ?? "—"}
        </div>
      );
    case "expiryDate":
      return (
        <div style={{ ...style, color: textStyle?.color, fontSize: textStyle?.fontSize }} className="flex items-center opacity-80">
          {masked ? "" : "Validité carte"}
        </div>
      );
    case "progressBar": {
      const pct = masked ? 35 : Math.min(100, Math.max(0, (progress.current / Math.max(1, progress.target)) * 100));
      return (
        <div style={style} className="relative overflow-hidden rounded-full" aria-hidden>
          <div
            className="absolute inset-0 rounded-full"
            style={{ background: element.progressColors?.track ?? "#FFFFFF44" }}
          />
          <div
            className="absolute inset-y-0 left-0 rounded-full"
            style={{
              width: `${pct}%`,
              background: element.progressColors?.fill ?? merchant.primaryColor,
            }}
          />
        </div>
      );
    }
    case "staticText":
      return (
        <div style={{ ...style, color: textStyle?.color, fontSize: textStyle?.fontSize }} className="flex items-center">
          {element.text ?? ""}
        </div>
      );
    default:
      return null;
  }
}

export function MerchantCardRenderer({
  template,
  merchant,
  card,
  slug,
  clientName,
  clientNumber,
  progress,
  displayMode = "personalized",
  showQr = true,
  interactive = true,
  className,
  shellClassName,
  as = "article",
  onClick,
}: MerchantCardRendererProps) {
  const effectiveProgress = progress ?? {
    current: card.points,
    target: card.visitsRequired,
    label:
      card.points >= card.visitsRequired
        ? `${card.rewardLabel} disponible`
        : `Encore ${Math.max(0, card.visitsRequired - card.points)} · ${card.rewardLabel}`,
    nextReward: card.rewardLabel,
  };

  const usesRealQr = displayMode === "personalized";
  const [qr, setQr] = useState<string | null>(() => (usesRealQr ? getCachedQr() : null));

  useEffect(() => {
    if (!usesRealQr) {
      setQr(null);
      return;
    }
    if (qr) return;
    let cancelled = false;
    void loadUniversalQr(slug).then((next) => {
      if (!cancelled && next) setQr(next);
    });
    return () => {
      cancelled = true;
    };
  }, [usesRealQr, slug, qr]);

  const qrSrc = useMemo(
    () => resolveDisplayQrSrc(displayMode, showQr, usesRealQr ? qr : null),
    [displayMode, showQr, usesRealQr, qr],
  );

  const hasPublishedTemplate =
    Boolean(template?.backgroundUrl) && Boolean(template?.config?.elements?.length);

  if (!hasPublishedTemplate) {
    return (
      <MerchantInteractiveCard
        card={card}
        slug={slug}
        preview={!usesRealQr}
        showQr={showQr && usesRealQr}
        clientNumber={clientNumber}
        interactive={interactive}
        className={className}
        shellClassName={shellClassName}
        as={as}
        onClick={onClick}
      />
    );
  }

  const ratio = template!.config.aspectRatio ?? 1.586;
  const sorted = [...template!.config.elements].sort((a, b) => a.zIndex - b.zIndex);
  const name = displayClientName(displayMode, clientName);
  const Wrapper = as;

  return (
    <div
      className={cn(
        "merchant-card-renderer-shell w-full",
        displayMode === "compact" && "merchant-card-renderer-shell--compact",
        shellClassName,
        interactive && onClick && "cursor-pointer",
      )}
      style={{ aspectRatio: `${ratio} / 1` }}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={
        onClick
          ? (event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                onClick();
              }
            }
          : undefined
      }
    >
      <Wrapper
        data-merchant-card
        data-display-mode={displayMode}
        className={cn("merchant-card-renderer relative h-full w-full overflow-hidden rounded-[18px]", className)}
        style={{ pointerEvents: onClick ? "auto" : "none" }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={template!.backgroundUrl!}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          style={{ pointerEvents: "none" }}
          draggable={false}
        />
        <div className="absolute inset-0" style={{ pointerEvents: "none" }}>
          {sorted.map((element) => (
            <ElementView
              key={element.id}
              element={element}
              merchant={merchant}
              clientName={name}
              progress={effectiveProgress}
              qrSrc={qrSrc}
              showQr={showQr}
              displayMode={displayMode}
            />
          ))}
        </div>
        {displayMode === "adminPreview" ? (
          <div className="pointer-events-none absolute left-2 top-2 rounded bg-black/50 px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest text-white/80">
            Aperçu
          </div>
        ) : null}
      </Wrapper>
    </div>
  );
}
