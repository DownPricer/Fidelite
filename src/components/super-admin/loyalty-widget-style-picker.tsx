"use client";

import type { CardLoyaltyWidgetConfig } from "@/lib/card-template-schema";
import {
  applyStyleVariantPreservingColors,
  STYLE_VARIANT_LABELS,
  styleVariantsForMode,
  type LoyaltyStyleVariant,
  type LoyaltyWidgetConfig,
  type LoyaltyWidgetMode,
} from "@/lib/loyalty-widget";

function StyleThumbnail({
  variant,
  active,
  fill,
  track,
  onClick,
}: {
  variant: LoyaltyStyleVariant;
  active: boolean;
  fill: string;
  track: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-col gap-1 rounded-lg border p-2 text-left transition ${
        active ? "border-[var(--violet-bright)] bg-white/10 ring-1 ring-[var(--violet-bright)]" : "border-white/10 hover:bg-white/5"
      }`}
    >
      <div className="flex h-10 items-center justify-center rounded bg-black/30 px-1">
        {variant.includes("Circle") || variant === "progressCircle" ? (
          <svg viewBox="0 0 40 40" className="h-8 w-8">
            <circle cx="20" cy="20" r="14" fill="none" stroke={track} strokeWidth="4" />
            <circle cx="20" cy="20" r="14" fill="none" stroke={fill} strokeWidth="4" strokeDasharray="60 88" transform="rotate(-90 20 20)" />
          </svg>
        ) : variant.includes("Bar") || variant === "gauge" || variant === "segmentedBar" ? (
          <div className="flex h-2 w-full gap-0.5">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="h-full flex-1 rounded-sm" style={{ background: i < 2 ? fill : track }} />
            ))}
          </div>
        ) : variant.includes("Grid") || variant === "iconCells" || variant === "stampGrid" ? (
          <div className="grid grid-cols-4 gap-0.5">
            {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
              <div key={i} className="h-2 w-2 rounded-full" style={{ background: i < 4 ? fill : track }} />
            ))}
          </div>
        ) : (
          <span className="text-[10px] font-bold" style={{ color: fill }}>
            6/10
          </span>
        )}
      </div>
      <span className="text-[9px] leading-tight text-[var(--muted-text)]">{STYLE_VARIANT_LABELS[variant]}</span>
    </button>
  );
}

export function LoyaltyWidgetStylePicker({
  config,
  onChange,
}: {
  config: CardLoyaltyWidgetConfig;
  onChange: (next: CardLoyaltyWidgetConfig) => void;
}) {
  const variants = styleVariantsForMode(config.loyaltyMode as LoyaltyWidgetMode);

  return (
    <div className="space-y-2">
      <p className="text-xs font-bold uppercase tracking-widest text-[var(--muted-text)]">Style de progression</p>
      <div className="grid grid-cols-2 gap-2">
        {variants.map((variant) => (
          <StyleThumbnail
            key={variant}
            variant={variant}
            active={config.styleVariant === variant}
            fill={config.colors.fill}
            track={config.colors.track}
            onClick={() =>
              onChange(
                applyStyleVariantPreservingColors(
                  config as LoyaltyWidgetConfig,
                  variant,
                  config.loyaltyMode as LoyaltyWidgetMode,
                ) as CardLoyaltyWidgetConfig,
              )
            }
          />
        ))}
      </div>
    </div>
  );
}
