import { QrCodeIcon, WalletCardsIcon } from "@/components/landing/icons";

export function LandingHeroVisual() {
  return (
    <div className="relative flex min-h-[460px] flex-1 items-center justify-center" aria-hidden="true">
      <div
        className="absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-70 blur-2xl"
        style={{
          background:
            "radial-gradient(circle, light-dark(rgba(168,85,247,0.28),rgba(168,85,247,0.4)) 0%, light-dark(rgba(124,58,237,0.12),rgba(124,58,237,0.18)) 45%, transparent 72%)",
        }}
      />

      <div
        className="absolute left-[2%] top-[18%] z-10 flex items-center gap-2 rounded-2xl border border-[light-dark(rgba(122,69,242,0.16),rgba(255,255,255,0.14))] bg-[light-dark(rgba(255,255,255,0.85),rgba(20,16,32,0.85))] px-3.5 py-2.5 text-xs font-bold text-[var(--ink)] shadow-[0_18px_40px_light-dark(rgba(76,46,148,0.16),rgba(0,0,0,0.5))] backdrop-blur-xl"
      >
        <QrCodeIcon className="h-4 w-4 shrink-0 text-[var(--violet-bright)]" />
        Un QR personnel
      </div>

      <div
        className="relative z-[5] w-[280px] rounded-[2.25rem] border border-[light-dark(rgba(122,69,242,0.18),rgba(255,255,255,0.14))] bg-[light-dark(rgba(255,255,255,0.9),rgba(10,8,20,0.9))] p-3 shadow-[0_50px_110px_light-dark(rgba(76,46,148,0.22),rgba(0,0,0,0.8))] backdrop-blur-2xl"
        style={{ transform: "rotate(2.5deg)" }}
      >
        <div className="flex items-center justify-between px-2 pb-3 pt-1 text-[11px] font-bold text-[var(--muted-strong)]">
          <span>9:41</span>
          <span>Fidelo</span>
        </div>

        <p className="px-2 text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--muted)]">
          Ma carte préférée
        </p>

        <div
          className="relative mt-2.5 overflow-hidden rounded-[1.5rem] p-5"
          style={{ background: "linear-gradient(140deg, #1f172b 0%, #5b21b6 58%, #a855f7 100%)" }}
        >
          <div
            className="absolute -right-8 -top-9 h-[150px] w-[150px] rounded-full border-[26px] border-white/10"
            aria-hidden
          />
          <div className="relative flex items-start justify-between">
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-white/70">Café Lumière</p>
          </div>
          <div className="relative mt-9">
            <p className="text-2xl font-black tracking-tight text-white">68 points</p>
            <p className="mt-1 text-[11px] font-semibold text-white/70">
              32 points avant votre prochain avantage
            </p>
            <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-white/20">
              <div className="h-full w-[68%] rounded-full bg-white" />
            </div>
          </div>
        </div>

        <div className="mt-2.5 rounded-2xl bg-[light-dark(rgba(122,69,242,0.06),rgba(255,255,255,0.05))] p-3.5">
          <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-[var(--muted)]">Prochain avantage</p>
          <p className="mt-1 text-sm font-bold text-[var(--ink)]">Une boisson offerte à 100 points</p>
        </div>
      </div>

      <div
        className="absolute bottom-[15%] right-[2%] z-10 flex items-center gap-2 rounded-2xl border border-[light-dark(rgba(122,69,242,0.16),rgba(255,255,255,0.14))] bg-[light-dark(rgba(255,255,255,0.85),rgba(20,16,32,0.85))] px-3.5 py-2.5 text-xs font-bold text-[var(--ink)] shadow-[0_18px_40px_light-dark(rgba(76,46,148,0.16),rgba(0,0,0,0.5))] backdrop-blur-xl"
      >
        <WalletCardsIcon className="h-4 w-4 shrink-0 text-[var(--violet-bright)]" />
        Compatible Wallet
      </div>
    </div>
  );
}
