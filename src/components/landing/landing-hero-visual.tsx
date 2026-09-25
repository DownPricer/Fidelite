import { CoffeeIcon, QrCodeIcon, WalletCardsIcon, WifiIcon } from "@/components/landing/icons";

export function LandingHeroVisual() {
  return (
    <div className="relative grid min-h-[420px] place-items-center lg:min-h-[510px]" aria-label="Aperçu du portefeuille Fideto">
      <div
        className="absolute h-[300px] w-[300px] rounded-full lg:h-[440px] lg:w-[440px]"
        style={{
          background: "radial-gradient(circle, rgba(168,85,247,.33), rgba(124,58,237,.10) 43%, transparent 68%)",
          filter: "blur(4px)",
        }}
        aria-hidden
      />

      <div
        className="absolute left-[1%] top-[16%] z-[3] flex items-center gap-2 rounded-2xl border border-[var(--fh-border)] bg-[var(--fh-surface)] px-3.5 py-3 text-[13px] font-bold text-[var(--fh-text)] shadow-[0_18px_40px_rgba(35,17,54,0.12)] backdrop-blur-xl"
      >
        <QrCodeIcon className="h-[18px] w-[18px] shrink-0 text-[var(--fh-purple)]" />
        Un QR personnel
      </div>

      <div
        className="relative z-[2] w-[255px] rounded-[42px] p-3 shadow-[0_40px_90px_rgba(54,27,83,0.3),0_0_0_1px_rgba(255,255,255,0.16)_inset] sm:w-[292px]"
        style={{ background: "#15121b", transform: "rotate(3deg)" }}
      >
        <div
          className="min-h-[430px] overflow-hidden rounded-[32px] p-4 text-[#17131d] sm:min-h-[490px]"
          style={{ background: "linear-gradient(160deg, #f9f5ff, #eee5ff)" }}
        >
          <div className="flex items-center justify-between text-xs font-extrabold">
            <span>9:41</span>
            <span>Fideto</span>
            <WifiIcon className="h-[15px] w-[15px]" />
          </div>

          <p className="mb-3 mt-7 text-xs font-bold" style={{ color: "#6f667b" }}>
            Ma carte préférée
          </p>

          <div
            className="relative min-h-[185px] overflow-hidden rounded-[25px] p-5 text-white"
            style={{
              background: "linear-gradient(140deg, #1f172b, #5b21b6 58%, #a855f7)",
              boxShadow: "0 24px 50px rgba(91,33,182,0.28)",
            }}
          >
            <div
              className="absolute -right-[72px] -top-[88px] h-[190px] w-[190px] rounded-full"
              style={{ border: "34px solid rgba(255,255,255,0.13)" }}
              aria-hidden
            />
            <div className="relative z-[1] flex items-start justify-between font-extrabold">
              <span className="text-[13px]">CAFÉ LUMIÈRE</span>
              <CoffeeIcon className="h-[18px] w-[18px]" />
            </div>
            <div className="relative z-[1] mt-[58px]">
              <strong className="block text-[26px] tracking-tight">68 points</strong>
              <span className="text-xs text-white/70">32 points avant votre prochain avantage</span>
            </div>
            <div className="mt-3.5 h-2 overflow-hidden rounded-full bg-white/20">
              <span className="block h-full w-[68%] rounded-full bg-white" />
            </div>
          </div>

          <div
            className="mt-4.5 rounded-2xl p-4"
            style={{ background: "rgba(255,255,255,0.72)", boxShadow: "0 10px 30px rgba(44,20,71,0.09)" }}
          >
            <small className="block text-xs" style={{ color: "#756b80" }}>
              Prochain avantage
            </small>
            <strong className="mt-1 block text-sm">Une boisson offerte à 100 points</strong>
          </div>
        </div>
      </div>

      <div
        className="absolute bottom-[16%] right-0 z-[3] flex items-center gap-2 rounded-2xl border border-[var(--fh-border)] bg-[var(--fh-surface)] px-3.5 py-3 text-[13px] font-bold text-[var(--fh-text)] shadow-[0_18px_40px_rgba(35,17,54,0.12)] backdrop-blur-xl"
      >
        <WalletCardsIcon className="h-[18px] w-[18px] shrink-0 text-[var(--fh-purple)]" />
        Compatible Wallet
      </div>
    </div>
  );
}
