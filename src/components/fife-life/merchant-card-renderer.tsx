"use client";

import { useEffect, useMemo, useState } from "react";
import { cn } from "@/components/ui";
import type { CardElement, CardTemplateConfig } from "@/lib/card-template-schema";
import {
  buildTextContainerStyle,
  cardFontSizeCss,
  multilineClampStyle,
  resolveAutoFitFontSize,
} from "@/lib/card-template-element-style";
import {
  DECORATIVE_QR_SRC,
  rectStyle,
  resolveElementRect,
} from "@/lib/merchant-card-layout";
import type { LoyaltyMode } from "@prisma/client";
import { CardTemplateBackground } from "./card-template-background";
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
  /** Force une valeur de progression (0–100 %) pour l'aperçu éditeur. */
  progressPercentOverride?: number;
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
  if (mode === "adminPreview") return name ?? "Aperçu client";
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

function elementShellStyle(element: CardElement, rect: ReturnType<typeof resolveElementRect>) {
  return {
    ...rectStyle(rect),
    zIndex: element.zIndex,
    opacity: element.opacity ?? 1,
    transform: element.rotation ? `rotate(${element.rotation}deg)` : undefined,
    transformOrigin: "center center",
  };
}

function TextBlock({
  element,
  text,
  cardWidthPx = 920,
}: {
  element: CardElement;
  text: string;
  cardWidthPx?: number;
}) {
  const style = element.style;
  if (!style) return <span>{text}</span>;

  const rect = resolveElementRect(element);
  const containerWidthPx = rect.width * cardWidthPx;
  const fontSize =
    style.fitMode === "autoShrink"
      ? resolveAutoFitFontSize(text, style, containerWidthPx)
      : style.fontSize;

  const textStyle = buildTextContainerStyle(element, {
    fontSize: cardFontSizeCss(fontSize),
    display: "flex",
    width: "100%",
    height: "100%",
  });

  const clamp =
    style.fitMode === "multiline" && style.maxLines
      ? multilineClampStyle(style.maxLines)
      : style.fitMode === "autoShrink"
        ? { overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" as const }
        : undefined;

  return (
    <div style={textStyle}>
      <span style={clamp}>{text}</span>
    </div>
  );
}

function ElementView({
  element,
  merchant,
  clientName,
  progress,
  qrSrc,
  showQr,
  displayMode,
  progressPercentOverride,
}: {
  element: CardElement;
  merchant: MerchantCardRendererProps["merchant"];
  clientName: string;
  progress: NonNullable<MerchantCardRendererProps["progress"]>;
  qrSrc: string | null;
  showQr: boolean;
  displayMode: MerchantCardDisplayMode;
  progressPercentOverride?: number;
}) {
  if (element.hidden || shouldHideElement(element.type, displayMode)) return null;

  const rect = resolveElementRect(element);
  const style = elementShellStyle(element, rect);
  const textStyle = element.style;
  const masked = shouldMaskProgress(displayMode);

  switch (element.type) {
    case "logo": {
      const ls = element.logoStyle;
      return (
        <div
          style={{
            ...style,
            borderRadius: ls?.borderRadius ? `${ls.borderRadius}px` : undefined,
            backgroundColor: ls?.backgroundColor,
            boxShadow: ls?.shadow ? "0 4px 16px rgba(0,0,0,0.35)" : undefined,
            padding: ls?.padding ? `${ls.padding}px` : undefined,
          }}
          className="flex items-center justify-center overflow-hidden"
        >
          {merchant.logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={merchant.logoUrl}
              alt=""
              className="h-full w-full"
              style={{ objectFit: ls?.objectFit ?? "contain" }}
            />
          ) : (
            <div
              className="flex h-full w-full items-center justify-center text-lg font-black text-white"
              style={{ backgroundColor: merchant.primaryColor, borderRadius: ls?.borderRadius }}
            >
              {merchant.name.slice(0, 1)}
            </div>
          )}
        </div>
      );
    }
    case "merchantName":
      return (
        <div style={style}>
          <TextBlock element={element} text={merchant.name} />
        </div>
      );
    case "clientName":
      return (
        <div style={style}>
          <TextBlock element={element} text={clientName} />
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
          <div style={style} className="font-black opacity-60">
            <TextBlock element={element} text="•••" />
          </div>
        );
      }
      return (
        <div style={style} className="font-black">
          <TextBlock
            element={element}
            text={`${progress.current}/${progress.target}`}
          />
        </div>
      );
    case "progressText":
      return (
        <div style={style}>
          <TextBlock element={element} text={masked ? "Progression fidélité" : progress.label} />
        </div>
      );
    case "nextReward":
      return (
        <div style={style}>
          <TextBlock element={element} text={masked ? "Récompense membre" : progress.nextReward ?? progress.label} />
        </div>
      );
    case "unlockedReward":
      return (
        <div style={style}>
          <TextBlock element={element} text={masked ? "—" : progress.unlockedReward ?? "—"} />
        </div>
      );
    case "tierLevel":
      return (
        <div style={style}>
          <TextBlock element={element} text={masked ? "Palier" : progress.tierLabel ?? "—"} />
        </div>
      );
    case "expiryDate":
      return (
        <div style={{ ...style, opacity: (element.opacity ?? 1) * 0.8 }}>
          <TextBlock element={element} text={masked ? "" : "Validité carte"} />
        </div>
      );
    case "progressBar": {
      const pct =
        progressPercentOverride != null
          ? progressPercentOverride
          : masked
            ? 35
            : Math.min(100, Math.max(0, (progress.current / Math.max(1, progress.target)) * 100));
      const pc = element.progressColors;
      const isVertical = pc?.orientation === "vertical";
      const radius = pc?.radius ?? 8;
      const glowStyle = pc?.glow
        ? { boxShadow: `0 0 12px ${pc.fill}88` }
        : pc?.shadow
          ? { boxShadow: "0 2px 8px rgba(0,0,0,0.35)" }
          : undefined;

      return (
        <div
          style={{
            ...style,
            borderRadius: radius,
            border: pc?.borderWidth ? `${pc.borderWidth}px solid ${pc.borderColor ?? "#FFFFFF44"}` : undefined,
            ...glowStyle,
          }}
          className="relative overflow-hidden"
          aria-hidden
        >
          <div
            className="absolute inset-0"
            style={{ background: pc?.track ?? "#FFFFFF44", borderRadius: radius }}
          />
          <div
            className="absolute"
            style={
              isVertical
                ? {
                    left: 0,
                    right: 0,
                    bottom: 0,
                    height: `${pct}%`,
                    background: pc?.fill ?? merchant.primaryColor,
                    borderRadius: radius,
                  }
                : {
                    top: 0,
                    bottom: 0,
                    left: 0,
                    width: `${pct}%`,
                    background: pc?.fill ?? merchant.primaryColor,
                    borderRadius: radius,
                  }
            }
          />
          {pc?.showLabel ? (
            <div
              className="absolute inset-0 flex items-center justify-center font-bold"
              style={{
                color: pc.labelColor ?? "#FFFFFF",
                fontSize: cardFontSizeCss(pc.labelFontSize ?? 12),
              }}
            >
              {Math.round(pct)}%
            </div>
          ) : null}
        </div>
      );
    }
    case "staticText":
      return (
        <div style={style}>
          <TextBlock element={element} text={element.text ?? ""} />
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
  progressPercentOverride,
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
      style={{ aspectRatio: `${ratio} / 1`, containerType: "inline-size" }}
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
        style={{ pointerEvents: onClick ? "auto" : "none", containerType: "inline-size" }}
      >
        <CardTemplateBackground
          backgroundUrl={template!.backgroundUrl!}
          background={template!.config.background}
        />
        <div className="absolute inset-0" style={{ pointerEvents: "none", containerType: "inline-size" }}>
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
              progressPercentOverride={progressPercentOverride}
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
