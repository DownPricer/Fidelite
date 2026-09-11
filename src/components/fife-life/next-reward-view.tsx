"use client";

import type { CardNextRewardStyle } from "@/lib/card-template-schema";
import { cardFontSizeCss } from "@/lib/card-template-element-style";
import {
  buildNextRewardViewModel,
  defaultNextRewardStyle,
  type NextRewardStyleVariant,
} from "@/lib/next-reward-styles";
import type { LoyaltyWidgetProgress } from "./loyalty-widget-view";

type Props = {
  style?: CardNextRewardStyle | null;
  progress: LoyaltyWidgetProgress;
  primaryColor: string;
  loyaltyMode?: string | null;
  masked?: boolean;
};

function baseStyle(style: CardNextRewardStyle) {
  return {
    color: style.textColor,
    fontSize: cardFontSizeCss(style.fontSize ?? 12),
    textAlign: style.textAlign ?? "center",
    fontFamily: style.fontFamily === "card" ? "var(--font-card-sans)" : undefined,
  } as const;
}

function shellStyle(style: CardNextRewardStyle) {
  return {
    backgroundColor: style.backgroundColor,
    border:
      style.borderWidth && style.borderWidth > 0
        ? `${style.borderWidth}px solid ${style.borderColor ?? style.primaryColor}`
        : undefined,
    boxShadow: style.glow
      ? `0 0 16px ${style.primaryColor}66`
      : style.shadow
        ? "0 4px 14px rgba(0,0,0,0.25)"
        : undefined,
  };
}

export function NextRewardView({ style, progress, primaryColor, loyaltyMode, masked = false }: Props) {
  const resolved = style ?? defaultNextRewardStyle(primaryColor);
  const model = buildNextRewardViewModel(progress, loyaltyMode);

  if (masked) {
    return (
      <div className="flex h-full w-full items-center justify-center px-2 text-xs font-semibold opacity-70">
        Prochain avantage
      </div>
    );
  }

  if (model.allUnlocked && resolved.hideWhenComplete) return null;

  const title = model.allUnlocked ? "Tous les avantages sont débloqués" : model.title;
  const subtitle =
    !model.allUnlocked && resolved.showRemaining !== false ? model.subtitle ?? model.detail : model.detail;
  const textStyle = baseStyle(resolved);

  switch (resolved.variant as NextRewardStyleVariant) {
    case "glowingCapsule":
      return (
        <div className="flex h-full w-full items-center justify-center px-2">
          <div
            className="inline-flex max-w-full flex-col rounded-full px-3 py-1.5"
            style={{ ...shellStyle(resolved), ...textStyle, borderRadius: 9999 }}
          >
            <span className="truncate font-bold">{title}</span>
            {subtitle ? <span className="truncate text-[0.85em] opacity-90">{subtitle}</span> : null}
          </div>
        </div>
      );
    case "glassPanel":
      return (
        <div
          className="flex h-full w-full flex-col justify-center gap-0.5 rounded-xl px-2 py-1 backdrop-blur-sm"
          style={{ ...shellStyle(resolved), backgroundColor: `${resolved.backgroundColor}CC`, ...textStyle }}
        >
          <span className="truncate font-bold">{title}</span>
          {subtitle ? <span className="truncate text-[0.85em] opacity-90">{subtitle}</span> : null}
        </div>
      );
    case "ribbon":
      return (
        <div className="relative flex h-full w-full items-center justify-center px-2">
          <div
            className="w-full truncate px-2 py-1 font-bold uppercase tracking-wide"
            style={{
              ...textStyle,
              background: `linear-gradient(90deg, ${resolved.primaryColor}, ${resolved.backgroundColor})`,
              clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 50%, calc(100% - 8px) 100%, 0 100%)",
            }}
          >
            {title}
            {subtitle && resolved.showRemaining !== false ? ` · ${subtitle}` : ""}
          </div>
        </div>
      );
    case "giftIcon":
      return (
        <div className="flex h-full w-full items-center gap-1.5 px-2" style={textStyle}>
          <span aria-hidden className="shrink-0 text-[1.2em]">
            {resolved.icon ?? "🎁"}
          </span>
          <div className="min-w-0">
            <p className="truncate font-bold">{title}</p>
            {subtitle ? <p className="truncate text-[0.85em] opacity-90">{subtitle}</p> : null}
          </div>
        </div>
      );
    case "comingSoon":
      return (
        <div className="flex h-full w-full flex-col items-center justify-center px-2" style={textStyle}>
          <span className="text-[0.75em] font-bold uppercase tracking-[0.18em] opacity-80">Bientôt</span>
          <span className="truncate font-bold">
            {model.allUnlocked ? title : progress.nextRewardName ?? progress.nextReward ?? "—"}
          </span>
          {subtitle && resolved.showRemaining !== false ? (
            <span className="truncate text-[0.85em] opacity-90">{subtitle}</span>
          ) : null}
        </div>
      );
    case "minimalArrow":
      return (
        <div className="flex h-full w-full items-center gap-1 px-2" style={textStyle}>
          <span aria-hidden className="shrink-0 opacity-80">
            →
          </span>
          <div className="min-w-0">
            <p className="truncate font-semibold">{title}</p>
            {subtitle ? <p className="truncate text-[0.85em] opacity-85">{subtitle}</p> : null}
          </div>
        </div>
      );
    case "miniProgress":
      return (
        <div className="flex h-full w-full flex-col justify-center gap-1 px-2" style={textStyle}>
          <div className="flex items-center justify-between gap-2 text-[0.85em]">
            <span className="truncate font-bold">{title}</span>
            {resolved.showRemaining !== false && subtitle ? (
              <span className="shrink-0 opacity-90">{subtitle}</span>
            ) : null}
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full" style={{ background: resolved.borderColor ?? "#FFFFFF33" }}>
            <div
              className="h-full rounded-full transition-all"
              style={{ width: `${model.progressPct}%`, background: resolved.primaryColor }}
            />
          </div>
          {model.detail && !model.allUnlocked ? (
            <p className="truncate text-[0.8em] opacity-85">{model.detail}</p>
          ) : null}
        </div>
      );
    case "compactBadge":
    default:
      return (
        <div className="flex h-full w-full items-center justify-center px-2">
          <div
            className="inline-flex max-w-full flex-col rounded-lg px-2 py-1"
            style={{ ...shellStyle(resolved), ...textStyle }}
          >
            <span className="truncate font-bold">{title}</span>
            {subtitle ? <span className="truncate text-[0.85em] opacity-90">{subtitle}</span> : null}
          </div>
        </div>
      );
  }
}
