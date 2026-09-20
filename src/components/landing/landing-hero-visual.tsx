export function LandingHeroVisual() {
  return (
    <div className="landing-deck flex flex-1 items-center justify-center" aria-hidden="true">
      <div className="deck-halo absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2" />
      <div
        className="landing-card"
        style={{
          left: "6%",
          top: "16%",
          transform: "rotate(-10deg)",
          opacity: 0.5,
          background: "linear-gradient(145deg, rgba(112,133,255,0.5) 0%, rgba(40,30,80,0.9) 100%)",
        }}
      />
      <div
        className="landing-card"
        style={{
          left: "18%",
          top: "8%",
          transform: "rotate(7deg)",
          opacity: 0.65,
          background: "linear-gradient(145deg, rgba(231,116,255,0.4) 0%, rgba(50,25,90,0.9) 100%)",
        }}
      />

      <div
        className="relative z-10 flex w-[300px] flex-col gap-4 rounded-[2.5rem] border border-[light-dark(rgba(122,69,242,0.18),rgba(255,255,255,0.14))] bg-[light-dark(rgba(255,255,255,0.86),rgba(10,8,20,0.86))] p-4 shadow-[0_50px_110px_light-dark(rgba(76,46,148,0.22),rgba(0,0,0,0.8))] backdrop-blur-2xl"
        style={{ transform: "rotate(-1.5deg)" }}
      >
        <div
          className="landing-card prism-card relative h-[190px] w-full"
          style={{
            position: "relative",
            left: "auto",
            top: "auto",
            transform: "none",
            width: "100%",
            ["--prism-from" as never]: "#11131b",
            ["--prism-to" as never]: "#aeb5cd",
            ["--prism-halo" as never]: "rgba(166,139,255,0.6)",
          }}
        >
          <div className="flex h-full flex-col justify-between p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/70">Maison Lumière</p>
                <p className="mt-1 text-xl font-black text-white">Carte Gold</p>
              </div>
              <span className="rounded-full border border-white/25 bg-white/10 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.14em] text-white/85">
                Démo
              </span>
            </div>
            <div>
              <p className="text-2xl font-black tabular-nums text-white">
                240 <span className="text-xs font-semibold text-white/70">pts</span>
              </p>
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/15">
                <div className="h-full w-[72%] rounded-full bg-gradient-to-r from-[#c4b5ff] to-white" />
              </div>
              <p className="mt-1.5 text-[11px] font-semibold text-white/70">Prochain avantage à 60 pts</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-2xl border border-[light-dark(rgba(122,69,242,0.14),rgba(255,255,255,0.1))] bg-[light-dark(rgba(255,255,255,0.7),rgba(255,255,255,0.04))] px-3.5 py-3">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-[light-dark(rgba(122,69,242,0.1),rgba(255,255,255,0.08))] text-base">
            <span aria-hidden>▦</span>
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-[var(--muted)]">QR personnel</p>
            <p className="truncate text-xs font-medium text-[var(--muted-strong)]">
              À présenter en caisse, partout
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-2xl border border-[light-dark(rgba(122,69,242,0.14),rgba(255,255,255,0.1))] bg-[light-dark(rgba(255,255,255,0.7),rgba(255,255,255,0.04))] px-3.5 py-3">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-[light-dark(rgba(122,69,242,0.1),rgba(255,255,255,0.08))] text-base">
            <span aria-hidden>G</span>
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-[var(--muted)]">Google Wallet</p>
            <p className="truncate text-xs font-medium text-[var(--muted-strong)]">
              Ajout disponible pour cette carte
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
