const STATS = [
  { label: "Membres actifs", value: "—", hint: "Aperçu illustratif" },
  { label: "Passages ce mois", value: "—", hint: "Aperçu illustratif" },
  { label: "Avantages utilisés", value: "—", hint: "Aperçu illustratif" },
] as const;

export function LandingMerchantPreview() {
  return (
    <div
      className="glass-panel relative w-full max-w-md p-5 sm:p-6"
      aria-hidden="true"
      style={{ transform: "rotate(0.6deg)" }}
    >
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--muted)]">Aperçu illustratif</p>
          <p className="mt-1 text-sm font-black text-[var(--ink)]">Maison Lumière — Espace commerçant</p>
        </div>
        <span className="rounded-full border border-[light-dark(rgba(122,69,242,0.2),rgba(255,255,255,0.14))] bg-[light-dark(rgba(255,255,255,0.7),rgba(255,255,255,0.05))] px-2.5 py-1 text-[10px] font-bold text-[var(--muted-strong)]">
          Démo
        </span>
      </div>

      <div className="grid grid-cols-3 gap-2.5">
        {STATS.map((stat) => (
          <div key={stat.label} className="metric-card px-3 py-3">
            <p className="text-lg font-black text-[var(--ink)]">{stat.value}</p>
            <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-[var(--muted)]">
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-3 rounded-2xl border border-[light-dark(rgba(122,69,242,0.14),rgba(255,255,255,0.1))] bg-[light-dark(rgba(255,255,255,0.7),rgba(255,255,255,0.04))] p-4">
        <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-[var(--muted)]">Activité récente</p>
        <ul className="mt-2.5 space-y-2 text-xs font-medium text-[var(--muted-strong)]">
          <li className="flex items-center justify-between">
            <span>Client fictif — passage validé</span>
            <span className="text-[var(--violet-bright)]">+1 pt</span>
          </li>
          <li className="flex items-center justify-between">
            <span>Client fictif — avantage utilisé</span>
            <span className="text-[var(--violet-bright)]">Café offert</span>
          </li>
          <li className="flex items-center justify-between">
            <span>Client fictif — nouvelle carte créée</span>
            <span className="text-[var(--violet-bright)]">Bienvenue</span>
          </li>
        </ul>
      </div>

      <div className="mt-3 flex items-end gap-1.5 rounded-2xl border border-[light-dark(rgba(122,69,242,0.14),rgba(255,255,255,0.1))] bg-[light-dark(rgba(255,255,255,0.7),rgba(255,255,255,0.04))] p-4">
        {[38, 55, 44, 70, 60, 82, 50].map((height, index) => (
          <div
            key={index}
            className="flex-1 rounded-t-md bg-gradient-to-t from-[var(--violet)] to-[var(--violet-bright)] opacity-80"
            style={{ height: `${height}px` }}
          />
        ))}
      </div>
      <p className="mt-2 text-center text-[10px] font-medium text-[var(--muted)]">
        Graphique décoratif — activité fictive
      </p>
    </div>
  );
}
