"use client";

import { Fragment } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useTheme } from "@/components/theme-provider";

const VIOLET = "#7A45F2";
const PALETTE = ["#7A45F2", "#5B8CFF", "#34D399", "#FBBF24", "#FB7185", "#38BDF8", "#A78BFA"];

function useChartTheme() {
  const { resolvedTheme } = useTheme();
  const dark = resolvedTheme !== "light";
  return {
    grid: dark ? "rgba(255,255,255,0.08)" : "rgba(15,15,25,0.08)",
    axis: dark ? "#9b9bb5" : "#6b6b80",
    tooltipBg: dark ? "#15151f" : "#ffffff",
    tooltipBorder: dark ? "rgba(255,255,255,0.1)" : "rgba(15,15,25,0.1)",
    tooltipText: dark ? "#f4f3fb" : "#15151f",
  };
}

export function InsightCard({
  title,
  subtitle,
  action,
  children,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-[light-dark(rgba(15,15,25,0.08),rgba(255,255,255,0.08))] bg-[var(--surface)] p-4 md:p-5">
      <div className="mb-3 flex items-start justify-between gap-2">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-widest text-[var(--muted)]">{title}</h3>
          {subtitle ? <p className="mt-0.5 text-xs text-[var(--muted)]">{subtitle}</p> : null}
        </div>
        {action}
      </div>
      {children}
    </div>
  );
}

export function InsightLineChart({
  data,
  color = VIOLET,
  height = 220,
  emptyLabel = "Aucune donnée sur cette période.",
}: {
  data: { date: string; value: number }[];
  color?: string;
  height?: number;
  emptyLabel?: string;
}) {
  const theme = useChartTheme();
  const hasData = data.some((p) => p.value > 0);
  if (!hasData) {
    return <div className="grid place-items-center text-sm text-[var(--muted)]" style={{ height }}>{emptyLabel}</div>;
  }
  return (
    <div style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid stroke={theme.grid} vertical={false} />
          <XAxis dataKey="date" tick={{ fontSize: 10, fill: theme.axis }} stroke={theme.axis} />
          <YAxis tick={{ fontSize: 10, fill: theme.axis }} stroke={theme.axis} width={32} allowDecimals={false} />
          <Tooltip
            contentStyle={{ background: theme.tooltipBg, border: `1px solid ${theme.tooltipBorder}`, borderRadius: 12, color: theme.tooltipText }}
          />
          <Line type="monotone" dataKey="value" stroke={color} strokeWidth={2.5} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function InsightMultiLineChart({
  data,
  series,
  height = 240,
}: {
  data: Record<string, string | number>[];
  series: { key: string; label: string; color: string }[];
  height?: number;
}) {
  const theme = useChartTheme();
  const hasData = data.some((row) => series.some((s) => Number(row[s.key] ?? 0) > 0));
  if (!hasData) {
    return <div className="grid place-items-center text-sm text-[var(--muted)]" style={{ height }}>Aucune donnée sur cette période.</div>;
  }
  return (
    <div style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid stroke={theme.grid} vertical={false} />
          <XAxis dataKey="date" tick={{ fontSize: 10, fill: theme.axis }} stroke={theme.axis} />
          <YAxis tick={{ fontSize: 10, fill: theme.axis }} stroke={theme.axis} width={32} allowDecimals={false} />
          <Tooltip contentStyle={{ background: theme.tooltipBg, border: `1px solid ${theme.tooltipBorder}`, borderRadius: 12, color: theme.tooltipText }} />
          <Legend wrapperStyle={{ fontSize: 12, color: theme.axis }} />
          {series.map((s) => (
            <Line key={s.key} type="monotone" dataKey={s.key} name={s.label} stroke={s.color} strokeWidth={2} dot={false} />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function InsightBarChart({
  data,
  color = VIOLET,
  height = 220,
}: {
  data: { label: string; value: number }[];
  color?: string;
  height?: number;
}) {
  const theme = useChartTheme();
  const hasData = data.some((p) => p.value > 0);
  if (!hasData) {
    return <div className="grid place-items-center text-sm text-[var(--muted)]" style={{ height }}>Aucune donnée sur cette période.</div>;
  }
  return (
    <div style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid stroke={theme.grid} vertical={false} />
          <XAxis dataKey="label" tick={{ fontSize: 10, fill: theme.axis }} stroke={theme.axis} />
          <YAxis tick={{ fontSize: 10, fill: theme.axis }} stroke={theme.axis} width={32} allowDecimals={false} />
          <Tooltip contentStyle={{ background: theme.tooltipBg, border: `1px solid ${theme.tooltipBorder}`, borderRadius: 12, color: theme.tooltipText }} />
          <Bar dataKey="value" fill={color} radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function InsightDonutChart({
  data,
  height = 220,
}: {
  data: { key: string; label: string; value: number }[];
  height?: number;
}) {
  const theme = useChartTheme();
  const total = data.reduce((s, d) => s + d.value, 0);
  if (total === 0) {
    return <div className="grid place-items-center text-sm text-[var(--muted)]" style={{ height }}>Aucune donnée sur cette période.</div>;
  }
  return (
    <div style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="label" innerRadius="55%" outerRadius="85%" paddingAngle={2}>
            {data.map((entry, i) => (
              <Cell key={entry.key} fill={PALETTE[i % PALETTE.length]} />
            ))}
          </Pie>
          <Tooltip contentStyle={{ background: theme.tooltipBg, border: `1px solid ${theme.tooltipBorder}`, borderRadius: 12, color: theme.tooltipText }} />
          <Legend wrapperStyle={{ fontSize: 11, color: theme.axis }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

const WEEKDAY_LABELS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

export function InsightHeatmap({ data }: { data: { weekday: number; hour: number; value: number }[] }) {
  const max = Math.max(1, ...data.map((d) => d.value));
  const cell = (weekday: number, hour: number) => data.find((d) => d.weekday === weekday && d.hour === hour)?.value ?? 0;

  return (
    <div className="overflow-x-auto">
      <div className="grid min-w-[640px] gap-[3px]" style={{ gridTemplateColumns: "36px repeat(24, 1fr)" }}>
        <div />
        {Array.from({ length: 24 }, (_, h) => (
          <div key={h} className="text-center text-[9px] text-[var(--muted)]">
            {h % 3 === 0 ? h : ""}
          </div>
        ))}
        {WEEKDAY_LABELS.map((label, weekday) => (
          <Fragment key={weekday}>
            <div className="flex items-center text-[10px] font-semibold text-[var(--muted)]">{label}</div>
            {Array.from({ length: 24 }, (_, hour) => {
              const value = cell(weekday, hour);
              const intensity = value / max;
              return (
                <div
                  key={`${weekday}-${hour}`}
                  title={`${label} ${hour}h · ${value}`}
                  className="aspect-square rounded-[3px]"
                  style={{ background: value === 0 ? "rgba(122,69,242,0.06)" : `rgba(122,69,242,${0.15 + intensity * 0.75})` }}
                />
              );
            })}
          </Fragment>
        ))}
      </div>
    </div>
  );
}

export function TrendBadge({ changePct }: { changePct: number | null }) {
  if (changePct === null) return <span className="text-xs font-semibold text-[var(--muted)]">—</span>;
  const up = changePct >= 0;
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-bold ${up ? "text-emerald-500" : "text-rose-500"}`}>
      <svg viewBox="0 0 24 24" width={12} height={12} fill="none" stroke="currentColor" strokeWidth="3" className={up ? "" : "rotate-180"}>
        <path d="M12 19V5M5 12l7-7 7 7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {Math.abs(changePct).toFixed(1)}%
    </span>
  );
}

export function KpiCard({
  label,
  value,
  changePct,
  showTrend = true,
}: {
  label: string;
  value: string | number;
  changePct?: number | null;
  showTrend?: boolean;
}) {
  return (
    <div className="metric-card px-4 py-4">
      <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted)]">{label}</p>
      <p className="mt-1 text-2xl font-black text-[var(--ink)] md:text-3xl">{value}</p>
      {showTrend && changePct !== undefined ? <div className="mt-1"><TrendBadge changePct={changePct} /></div> : null}
    </div>
  );
}
