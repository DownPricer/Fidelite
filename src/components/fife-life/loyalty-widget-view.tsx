"use client";

import type { CardLoyaltyWidgetConfig } from "@/lib/card-template-schema";
import { cardFontSizeCss } from "@/lib/card-template-element-style";
import type { LoyaltyStyleVariant } from "@/lib/loyalty-widget";

export type LoyaltyWidgetProgress = {
  current: number;
  target: number;
  label: string;
  nextReward?: string | null;
  unlockedReward?: string | null;
  tierLabel?: string | null;
  fixedPointsPerPurchase?: number | null;
  tiers?: Array<{ threshold: number; reward: string; reached: boolean }>;
};

type Props = {
  config: CardLoyaltyWidgetConfig;
  progress: LoyaltyWidgetProgress;
  primaryColor: string;
  masked?: boolean;
  progressPercentOverride?: number;
  cardWidthPx?: number;
};

function pct(progress: LoyaltyWidgetProgress, override?: number, masked?: boolean) {
  if (override != null) return Math.min(100, Math.max(0, override));
  if (masked) return 35;
  return Math.min(100, Math.max(0, (progress.current / Math.max(1, progress.target)) * 100));
}

function glowStyle(fill: string, enabled?: boolean) {
  return enabled ? { boxShadow: `0 0 14px ${fill}88` } : undefined;
}

function StampGrid({
  config,
  progress,
  pctValue,
}: {
  config: CardLoyaltyWidgetConfig;
  progress: LoyaltyWidgetProgress;
  pctValue: number;
}) {
  const total = Math.max(1, progress.target);
  const filled = Math.min(total, Math.round((pctValue / 100) * total));
  const shape = config.cellShape ?? "circle";
  const gap = config.spacing ?? 6;
  const radius =
    shape === "circle" ? "9999px" : shape === "rounded" ? `${config.colors.radius ?? 8}px` : "2px";

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-1">
      <div
        className="flex flex-wrap items-center justify-center"
        style={{ gap }}
      >
        {Array.from({ length: total }).map((_, i) => (
          <div
            key={i}
            style={{
              width: "1.4em",
              height: "1.4em",
              borderRadius: radius,
              background: i < filled ? config.colors.fill : config.colors.track,
              border: config.colors.borderWidth
                ? `${config.colors.borderWidth}px solid ${config.colors.borderColor ?? "#FFFFFF44"}`
                : undefined,
              ...glowStyle(config.colors.fill, config.colors.glow && i < filled),
            }}
          />
        ))}
      </div>
      {config.showCounter !== false && config.labelPosition !== "none" ? (
        <p
          className="font-bold"
          style={{
            color: config.colors.fill,
            fontSize: cardFontSizeCss(config.fontSize ?? 14),
          }}
        >
          {progress.current} / {progress.target} passages
        </p>
      ) : null}
    </div>
  );
}

function SegmentedBar({
  config,
  progress,
  pctValue,
  vertical = false,
}: {
  config: CardLoyaltyWidgetConfig;
  progress: LoyaltyWidgetProgress;
  pctValue: number;
  vertical?: boolean;
}) {
  const segments = Math.max(1, progress.target <= 20 ? progress.target : 10);
  const filled = Math.round((pctValue / 100) * segments);
  const radius = config.colors.radius ?? 8;

  return (
    <div className={`flex h-full w-full flex-col ${vertical ? "" : "justify-center"} gap-1`}>
      <div
        className={vertical ? "flex h-full flex-col gap-1" : "flex w-full gap-1"}
        style={{ flex: 1 }}
      >
        {Array.from({ length: segments }).map((_, i) => (
          <div
            key={i}
            className="flex-1"
            style={{
              borderRadius: radius,
              background: i < filled ? config.colors.fill : config.colors.track,
              minHeight: vertical ? 4 : undefined,
              minWidth: vertical ? undefined : 4,
              ...glowStyle(config.colors.fill, config.colors.glow && i < filled),
            }}
          />
        ))}
      </div>
      {config.showCounter !== false ? (
        <p className="text-center font-bold" style={{ color: config.colors.fill, fontSize: cardFontSizeCss(config.fontSize ?? 13) }}>
          {progress.current}/{progress.target}
        </p>
      ) : null}
    </div>
  );
}

function BigCounter({ config, progress, suffix }: { config: CardLoyaltyWidgetConfig; progress: LoyaltyWidgetProgress; suffix: string }) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <p
        className="font-black leading-none"
        style={{
          color: config.colors.fill,
          fontSize: cardFontSizeCss(config.fontSize ?? 28),
          textShadow: config.colors.glow ? `0 0 12px ${config.colors.fill}` : undefined,
        }}
      >
        {progress.current} / {progress.target}
      </p>
      <p className="mt-1 font-semibold opacity-90" style={{ color: config.colors.fill, fontSize: cardFontSizeCss(12) }}>
        {suffix}
      </p>
    </div>
  );
}

function ProgressCircle({ config, pctValue, label }: { config: CardLoyaltyWidgetConfig; pctValue: number; label?: string }) {
  const r = 42;
  const c = 2 * Math.PI * r;
  const offset = c - (pctValue / 100) * c;

  return (
    <div className="flex h-full w-full items-center justify-center gap-3">
      <svg viewBox="0 0 100 100" className="h-[70%] max-h-full aspect-square">
        <circle cx="50" cy="50" r={r} fill="none" stroke={config.colors.track} strokeWidth="8" />
        <circle
          cx="50"
          cy="50"
          r={r}
          fill="none"
          stroke={config.colors.fill}
          strokeWidth="8"
          strokeDasharray={c}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform="rotate(-90 50 50)"
          style={glowStyle(config.colors.fill, config.colors.glow)}
        />
        {config.labelPosition === "inside" ? (
          <text x="50" y="54" textAnchor="middle" fill={config.colors.fill} fontSize="14" fontWeight="700">
            {Math.round(pctValue)}%
          </text>
        ) : null}
      </svg>
      {label && config.labelPosition === "below" ? (
        <p className="font-bold" style={{ color: config.colors.fill, fontSize: cardFontSizeCss(config.fontSize ?? 14) }}>
          {label}
        </p>
      ) : null}
    </div>
  );
}

function StepPath({ config, progress, pctValue }: { config: CardLoyaltyWidgetConfig; progress: LoyaltyWidgetProgress; pctValue: number }) {
  const steps = Math.min(8, Math.max(3, progress.target));
  const filled = Math.round((pctValue / 100) * steps);
  return (
    <div className="flex h-full w-full items-center justify-center gap-2 px-2">
      {Array.from({ length: steps }).map((_, i) => (
        <div key={i} className="flex flex-1 flex-col items-center gap-1">
          <div
            className="h-3 w-full rounded-full"
            style={{
              background: i < filled ? config.colors.fill : config.colors.track,
              boxShadow: config.colors.shadow ? "0 2px 6px rgba(0,0,0,0.35)" : undefined,
            }}
          />
          <div
            className="h-2 w-2 rounded-full"
            style={{ background: i < filled ? config.colors.fill : config.colors.track }}
          />
        </div>
      ))}
    </div>
  );
}

function IconCells({ config, progress, pctValue }: { config: CardLoyaltyWidgetConfig; progress: LoyaltyWidgetProgress; pctValue: number }) {
  const total = Math.max(1, Math.min(progress.target, 12));
  const filled = Math.round((pctValue / 100) * total);
  const icon = config.icon ?? "✓";
  return (
    <div className="grid h-full w-full place-content-center gap-1" style={{ gridTemplateColumns: `repeat(${Math.min(total, 6)}, minmax(0, 1fr))` }}>
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className="flex aspect-square items-center justify-center text-xs font-bold"
          style={{
            borderRadius: config.cellShape === "circle" ? "9999px" : `${config.colors.radius ?? 6}px`,
            background: i < filled ? config.colors.fill : config.colors.track,
            color: "#fff",
          }}
        >
          {i < filled ? icon : ""}
        </div>
      ))}
    </div>
  );
}

function BigBalance({ config, progress, masked }: { config: CardLoyaltyWidgetConfig; progress: LoyaltyWidgetProgress; masked?: boolean }) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <p className="font-black" style={{ color: config.colors.fill, fontSize: cardFontSizeCss(config.fontSize ?? 32) }}>
        {masked ? "•••" : progress.current}
      </p>
      <p className="text-xs font-semibold opacity-80" style={{ color: config.colors.fill }}>
        points
      </p>
    </div>
  );
}

function Gauge({ config, pctValue }: { config: CardLoyaltyWidgetConfig; pctValue: number }) {
  const angle = -90 + (pctValue / 100) * 180;
  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <svg viewBox="0 0 120 70" className="w-[80%]">
        <path d="M10 60 A50 50 0 0 1 110 60" fill="none" stroke={config.colors.track} strokeWidth="10" strokeLinecap="round" />
        <path
          d="M10 60 A50 50 0 0 1 110 60"
          fill="none"
          stroke={config.colors.fill}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray="157"
          strokeDashoffset={157 - (pctValue / 100) * 157}
        />
        <line x1="60" y1="60" x2="60" y2="18" stroke={config.colors.fill} strokeWidth="3" transform={`rotate(${angle} 60 60)`} />
      </svg>
      <p className="font-bold" style={{ color: config.colors.fill }}>{Math.round(pctValue)}%</p>
    </div>
  );
}

function RewardScale({ config, progress }: { config: CardLoyaltyWidgetConfig; progress: LoyaltyWidgetProgress }) {
  const marks = [0, Math.round(progress.target * 0.5), progress.target];
  return (
    <div className="flex h-full w-full flex-col justify-center gap-2 px-2">
      <div className="relative h-2 rounded-full" style={{ background: config.colors.track }}>
        <div
          className="absolute left-0 top-0 h-full rounded-full"
          style={{ width: `${Math.min(100, (progress.current / Math.max(1, progress.target)) * 100)}%`, background: config.colors.fill }}
        />
      </div>
      <div className="flex justify-between text-[10px] font-semibold" style={{ color: config.colors.fill }}>
        {marks.map((m) => (
          <span key={m}>{m} pts</span>
        ))}
      </div>
      {config.showNextReward !== false ? (
        <p className="text-center text-xs" style={{ color: config.colors.fill }}>
          {progress.nextReward ?? progress.label}
        </p>
      ) : null}
    </div>
  );
}

function CounterWithNextGoal({ config, progress, masked }: { config: CardLoyaltyWidgetConfig; progress: LoyaltyWidgetProgress; masked?: boolean }) {
  const remaining = Math.max(0, progress.target - progress.current);
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-1 text-center">
      <p className="font-black" style={{ color: config.colors.fill, fontSize: cardFontSizeCss(config.fontSize ?? 24) }}>
        {masked ? "•••" : progress.current} pts
      </p>
      {config.showRemainingPoints !== false ? (
        <p className="text-xs opacity-90" style={{ color: config.colors.fill }}>
          Encore {remaining} pts
        </p>
      ) : null}
      {config.showNextReward !== false ? (
        <p className="text-xs font-semibold" style={{ color: config.colors.fill }}>
          {progress.nextReward ?? progress.label}
        </p>
      ) : null}
      {progress.fixedPointsPerPurchase ? (
        <p className="text-[10px] opacity-80" style={{ color: config.colors.fill }}>
          +{progress.fixedPointsPerPurchase} points par achat
        </p>
      ) : null}
    </div>
  );
}

function TierStair({ config, progress }: { config: CardLoyaltyWidgetConfig; progress: LoyaltyWidgetProgress }) {
  const tiers = progress.tiers ?? [
    { threshold: 50, reward: "Palier 1", reached: progress.current >= 50 },
    { threshold: 100, reward: "Palier 2", reached: progress.current >= 100 },
    { threshold: 200, reward: "Palier 3", reached: progress.current >= 200 },
  ];
  return (
    <div className="flex h-full w-full items-end justify-center gap-1 px-2 pb-1">
      {tiers.map((tier, i) => (
        <div key={i} className="flex flex-1 flex-col items-center gap-1">
          <div
            className="w-full rounded-t-md"
            style={{
              height: `${30 + i * 18}%`,
              background: tier.reached ? config.colors.fill : config.colors.track,
              ...glowStyle(config.colors.fill, config.colors.glow && tier.reached),
            }}
          />
          <span className="text-[9px] font-bold" style={{ color: config.colors.fill }}>
            {tier.threshold}€
          </span>
        </div>
      ))}
    </div>
  );
}

function VerticalTierList({ config, progress }: { config: CardLoyaltyWidgetConfig; progress: LoyaltyWidgetProgress }) {
  const tiers = progress.tiers ?? [];
  return (
    <div className="flex h-full w-full flex-col justify-center gap-1 overflow-hidden px-2 text-xs">
      {tiers.map((tier, i) => (
        <div
          key={i}
          className="flex items-center justify-between rounded px-2 py-1"
          style={{ background: tier.reached ? `${config.colors.fill}33` : config.colors.track }}
        >
          <span style={{ color: config.colors.fill }}>{tier.threshold} €</span>
          <span className="font-semibold" style={{ color: config.colors.fill }}>{tier.reward}</span>
        </div>
      ))}
    </div>
  );
}

function MiniCards({ config, progress }: { config: CardLoyaltyWidgetConfig; progress: LoyaltyWidgetProgress }) {
  const tiers = progress.tiers ?? [];
  return (
    <div className="flex h-full w-full items-center justify-center gap-1 px-1">
      {tiers.map((tier, i) => (
        <div
          key={i}
          className="flex h-[70%] flex-1 flex-col items-center justify-center rounded-lg border p-1 text-center"
          style={{
            borderColor: tier.reached ? config.colors.fill : config.colors.track,
            background: tier.reached ? `${config.colors.fill}22` : "transparent",
          }}
        >
          <span className="text-[9px] font-bold" style={{ color: config.colors.fill }}>{tier.threshold}€</span>
          <span className="text-[8px] opacity-80" style={{ color: config.colors.fill }}>{tier.reward}</span>
        </div>
      ))}
    </div>
  );
}

function CurrentAndNext({ config, progress }: { config: CardLoyaltyWidgetConfig; progress: LoyaltyWidgetProgress }) {
  const tiers = progress.tiers ?? [];
  const currentIdx = tiers.findIndex((t) => !t.reached) - 1;
  const current = currentIdx >= 0 ? tiers[currentIdx] : tiers[tiers.length - 1];
  const next = tiers.find((t) => !t.reached) ?? tiers[tiers.length - 1];
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-center">
      <p className="text-xs opacity-80" style={{ color: config.colors.fill }}>Palier actuel</p>
      <p className="font-bold" style={{ color: config.colors.fill }}>{current?.reward ?? progress.tierLabel ?? "—"}</p>
      <p className="text-xs opacity-80" style={{ color: config.colors.fill }}>Prochain palier</p>
      <p className="font-semibold" style={{ color: config.colors.fill }}>{next?.reward ?? "—"} ({next?.threshold ?? progress.target} €)</p>
    </div>
  );
}

function StepLineWithRewards({ config, progress }: { config: CardLoyaltyWidgetConfig; progress: LoyaltyWidgetProgress }) {
  const tiers = progress.tiers ?? [];
  return (
    <div className="flex h-full w-full items-center px-2">
      <div className="relative flex w-full items-center">
        <div className="absolute left-0 right-0 h-0.5" style={{ background: config.colors.track }} />
        {tiers.map((tier, i) => (
          <div key={i} className="relative z-10 flex flex-1 flex-col items-center gap-1">
            <div
              className="h-3 w-3 rounded-full border-2"
              style={{
                borderColor: config.colors.fill,
                background: tier.reached ? config.colors.fill : "transparent",
              }}
            />
            <span className="text-[8px] font-bold text-center" style={{ color: config.colors.fill }}>
              {tier.reward}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function renderVariant(
  variant: LoyaltyStyleVariant,
  config: CardLoyaltyWidgetConfig,
  progress: LoyaltyWidgetProgress,
  pctValue: number,
  masked?: boolean,
) {
  switch (variant) {
    case "stampGrid":
      return <StampGrid config={config} progress={progress} pctValue={pctValue} />;
    case "segmentedBar":
      return config.loyaltyMode === "AMOUNT_TIERS"
        ? <SegmentedBar config={config} progress={progress} pctValue={pctValue} />
        : <SegmentedBar config={config} progress={progress} pctValue={pctValue} />;
    case "bigCounter":
      return <BigCounter config={config} progress={progress} suffix="passages" />;
    case "progressCircle":
      return (
        <ProgressCircle
          config={config}
          pctValue={pctValue}
          label={`${progress.current}/${progress.target}`}
        />
      );
    case "stepPath":
      return <StepPath config={config} progress={progress} pctValue={pctValue} />;
    case "iconCells":
      return <IconCells config={config} progress={progress} pctValue={pctValue} />;
    case "bigBalance":
      return <BigBalance config={config} progress={progress} masked={masked} />;
    case "progressBar": {
      const radius = config.colors.radius ?? 8;
      return (
        <div className="flex h-full w-full flex-col justify-center gap-1 px-1">
          <div className="relative h-3 w-full overflow-hidden rounded-full" style={{ background: config.colors.track, borderRadius: radius }}>
            <div
              className="absolute left-0 top-0 h-full"
              style={{ width: `${pctValue}%`, background: config.colors.fill, borderRadius: radius, ...glowStyle(config.colors.fill, config.colors.glow) }}
            />
          </div>
          {config.showCounter !== false ? (
            <p className="text-center text-xs font-bold" style={{ color: config.colors.fill }}>
              {progress.current}/{progress.target} pts
            </p>
          ) : null}
        </div>
      );
    }
    case "gauge":
      return <Gauge config={config} pctValue={pctValue} />;
    case "rewardScale":
      return <RewardScale config={config} progress={progress} />;
    case "counterWithNextGoal":
      return <CounterWithNextGoal config={config} progress={progress} masked={masked} />;
    case "tierStair":
      return <TierStair config={config} progress={progress} />;
    case "verticalList":
      return <VerticalTierList config={config} progress={progress} />;
    case "miniCards":
      return <MiniCards config={config} progress={progress} />;
    case "currentAndNext":
      return <CurrentAndNext config={config} progress={progress} />;
    case "stepLineWithRewards":
      return <StepLineWithRewards config={config} progress={progress} />;
    default:
      return null;
  }
}

export function LoyaltyWidgetView({
  config,
  progress,
  primaryColor,
  masked = false,
  progressPercentOverride,
}: Props) {
  const pctValue = pct(progress, progressPercentOverride, masked);
  const colors = {
    ...config.colors,
    fill: config.colors.fill || primaryColor,
  };
  const merged = { ...config, colors };

  return (
    <div
      className={`h-full w-full overflow-hidden ${config.animateProgress ? "transition-all duration-500" : ""}`}
      data-loyalty-widget={config.loyaltyMode}
      data-style-variant={config.styleVariant}
    >
      {renderVariant(config.styleVariant as LoyaltyStyleVariant, merged, progress, pctValue, masked)}
    </div>
  );
}
