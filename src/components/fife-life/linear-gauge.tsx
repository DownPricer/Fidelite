export function LinearGauge({ value, max }: { value: number; max: number }) {
  const pct = Math.min(100, Math.round((Math.max(0, value) / Math.max(1, max)) * 100));
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
      <div
        className="h-full rounded-full"
        style={{
          width: `${pct}%`,
          background: "linear-gradient(90deg, var(--violet-deep), var(--violet-bright))",
        }}
      />
    </div>
  );
}
