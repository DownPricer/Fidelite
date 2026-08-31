import Link from "next/link";
import { BrandMark } from "@/components/ui";

export default function HomePage() {
  return (
    <main className="obsidian-scene relative min-h-dvh overflow-hidden text-[var(--ink-soft)]">
      <div className="relative mx-auto flex max-w-6xl flex-col gap-12 px-6 py-14 lg:min-h-dvh lg:flex-row lg:items-center lg:justify-between lg:gap-16 lg:py-16">
        <section className="max-w-xl">
          <BrandMark className="mb-8" />
          <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[var(--violet-bright)]">
            Portefeuille universel
          </p>
          <h1 className="mt-3 text-4xl font-black tracking-tight text-[var(--ink)] sm:text-5xl">
            Votre collection de cartes, en version premium.
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-[var(--muted-strong)]">
            Fife Life rassemble votre identité, votre QR universel et vos cartes commerçants dans une expérience
            lumineuse, profonde et désirable.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link href="/carte" className="glass-cta inline-flex min-w-[220px] justify-center px-6 py-3.5 text-sm">
              Ouvrir mon wallet Fife Life
            </Link>
            <Link
              href="/connexion"
              className="inline-flex items-center justify-center rounded-full border border-white/12 bg-white/5 px-6 py-3.5 text-sm font-semibold text-[var(--ink)] hover:bg-white/8"
            >
              Se connecter
            </Link>
          </div>
          <p className="mt-8 max-w-md text-sm text-[var(--muted)]">
            Un seul QR en caisse. Des points globaux Bronze, Silver, Gold et Diamond. Des cartes qui donnent envie
            d&apos;être collectionnées.
          </p>
        </section>

        <section className="landing-deck flex flex-1 items-center justify-center">
          <div className="deck-halo absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2" />
          <div
            className="landing-card"
            style={{
              left: "8%",
              top: "18%",
              transform: "rotate(-10deg)",
              opacity: 0.55,
              background:
                "linear-gradient(145deg, rgba(112,133,255,0.55) 0%, rgba(40,30,80,0.95) 100%)",
            }}
          />
          <div
            className="landing-card"
            style={{
              left: "16%",
              top: "10%",
              transform: "rotate(7deg)",
              opacity: 0.7,
              background:
                "linear-gradient(145deg, rgba(231,116,255,0.45) 0%, rgba(50,25,90,0.95) 100%)",
            }}
          />
          <div
            className="landing-card prism-card z-10"
            style={{
              left: "50%",
              top: "22%",
              transform: "translateX(-50%) rotate(-3deg)",
              ["--prism-from" as never]: "#11131b",
              ["--prism-to" as never]: "#aeb5cd",
              ["--prism-halo" as never]: "rgba(166,139,255,0.6)",
            }}
          >
            <div className="flex h-full flex-col justify-between p-6">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/70">Fife Life</p>
                <p className="mt-1 text-2xl font-black text-white">Silver</p>
              </div>
              <p className="text-3xl font-black tabular-nums text-white">
                180 <span className="text-sm font-semibold text-white/70">pts</span>
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
