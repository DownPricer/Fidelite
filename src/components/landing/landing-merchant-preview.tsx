const STATS = [
  { label: "Clients actifs", value: "1 248" },
  { label: "Visites ce mois", value: "3 814" },
  { label: "Avantages utilisés", value: "426" },
] as const;

const BARS = [36, 52, 45, 68, 58, 83, 96] as const;

export function LandingMerchantPreview() {
  return (
    <div
      className="w-full max-w-[460px] rounded-[28px] border border-[var(--fh-border)] bg-[var(--fh-surface)] p-5"
      style={{ boxShadow: "0 30px 70px rgba(48,25,72,0.12)" }}
      aria-label="Aperçu du tableau de bord commerçant — données d'exemple"
    >
      <div className="mb-4.5 flex items-center justify-between">
        <div className="flex gap-1.5" aria-hidden>
          <span className="h-2 w-2 rounded-full bg-[var(--fh-border)]" />
          <span className="h-2 w-2 rounded-full bg-[var(--fh-border)]" />
          <span className="h-2 w-2 rounded-full bg-[var(--fh-border)]" />
        </div>
        <span className="text-xs font-bold text-[var(--fh-muted)]">Tableau de bord Fidelo — exemple</span>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {STATS.map((stat) => (
          <div key={stat.label} className="rounded-[18px] bg-[var(--fh-bg-soft)] p-4">
            <span className="block text-[11px] text-[var(--fh-muted)]">{stat.label}</span>
            <strong className="mt-1.5 block text-[22px] tracking-tight text-[var(--fh-text)]">{stat.value}</strong>
          </div>
        ))}
      </div>

      <div
        className="mt-3.5 flex h-[170px] items-end gap-2.5 rounded-[20px] bg-[var(--fh-bg-soft)] p-5"
        aria-label="Activité en progression"
      >
        {BARS.map((height, index) => (
          <div
            key={index}
            className="min-w-[10px] flex-1 rounded-t-[8px] rounded-b-[4px] opacity-[0.84]"
            style={{ height: `${height}%`, background: "linear-gradient(180deg, #a855f7, #7c3aed)" }}
          />
        ))}
      </div>
    </div>
  );
}
