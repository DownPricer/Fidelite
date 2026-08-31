"use client";

type Props = {
  value: number;
  progress: number;
  label: string;
};

export function SemiGauge({ value, progress, label }: Props) {
  const pct = Math.min(1, Math.max(0, progress));
  const radius = 86;
  const cx = 110;
  const cy = 108;
  const start = Math.PI;
  const end = 0;
  const angle = start + (end - start) * pct;
  const polar = (a: number) => ({
    x: cx + radius * Math.cos(a),
    y: cy + radius * Math.sin(a),
  });
  const from = polar(start);
  const to = polar(angle);
  const large = pct > 0.5 ? 1 : 0;
  const arc =
    pct <= 0
      ? ""
      : `M ${from.x} ${from.y} A ${radius} ${radius} 0 ${large} 1 ${to.x} ${to.y}`;

  return (
    <div className="relative mx-auto w-[220px]">
      <svg viewBox="0 0 220 130" className="h-auto w-full" aria-hidden>
        <path
          d={`M ${from.x} ${from.y} A ${radius} ${radius} 0 0 1 ${polar(end).x} ${polar(end).y}`}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="12"
          strokeLinecap="round"
        />
        {arc ? (
          <path
            d={arc}
            fill="none"
            stroke="url(#fifeGauge)"
            strokeWidth="12"
            strokeLinecap="round"
          />
        ) : null}
        <defs>
          <linearGradient id="fifeGauge" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#4c228c" />
            <stop offset="100%" stopColor="#b86cff" />
          </linearGradient>
        </defs>
      </svg>
      <div className="pointer-events-none absolute inset-x-0 bottom-1 text-center">
        <p className="text-[2.35rem] font-black leading-none tabular-nums text-[var(--ink)]">
          {value}
        </p>
        <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
          {label}
        </p>
      </div>
    </div>
  );
}
