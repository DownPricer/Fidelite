import type { Metadata } from "next";
import Link from "next/link";
import { LandingHeader } from "@/components/landing/landing-header";
import { LandingFooter } from "@/components/landing/landing-footer";
import { LandingFaq } from "@/components/landing/landing-faq";
import { LandingHeroVisual } from "@/components/landing/landing-hero-visual";
import { LandingMerchantPreview } from "@/components/landing/landing-merchant-preview";
import { resolveLandingAuthTargets } from "@/lib/landing-auth-targets";
import {
  ArrowRightIcon,
  CheckCircleIcon,
  CheckIcon,
  GiftIcon,
  LayersIcon,
  NetworkIcon,
  PaletteIcon,
  ScanLineIcon,
  ShieldCheckIcon,
  StoreIcon,
  UsersIcon,
  ZapIcon,
} from "@/components/landing/icons";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
  title: "Fideto — Toutes vos cartes de fidélité au même endroit",
  description:
    "Fideto réunit les cartes, les points et les avantages des clients, tout en donnant aux commerçants les outils pour créer et gérer leur programme de fidélité.",
};

const GUARANTEES = ["Sans carte plastique", "Toujours à jour", "Disponible sur mobile"] as const;

const PROOF_ITEMS = [
  { label: "Un scan suffit", Icon: ScanLineIcon },
  { label: "Avantages en temps réel", Icon: GiftIcon },
  { label: "Pensé pour les commerces", Icon: StoreIcon },
  { label: "Données protégées", Icon: ShieldCheckIcon },
] as const;

const CLIENT_STEPS = [
  {
    number: "01",
    title: "Créez votre compte Fideto",
    text: "Créez gratuitement votre compte et retrouvez un QR personnel unique, utilisable dans tous les commerces partenaires.",
  },
  {
    number: "02",
    title: "Présentez votre QR personnel",
    text: "Lors de votre passage en caisse, le commerçant scanne votre QR pour ajouter sa carte à votre espace ou retrouver votre programme de fidélité.",
  },
  {
    number: "03",
    title: "Profitez de vos avantages",
    text: "Suivez vos points, consultez votre progression et utilisez vos récompenses directement chez vos commerçants.",
  },
] as const;

const MERCHANT_BENEFITS = [
  "Points, passages et récompenses configurables",
  "Caisse rapide pour vous et vos employés",
  "Cartes numériques personnalisées à votre image",
  "Suivi simple de vos clients et de leur engagement",
] as const;

const BENTO_ITEMS = [
  {
    Icon: LayersIcon,
    title: "Une expérience vraiment universelle",
    text: "Une seule application côté client, des programmes personnalisés côté commerçant, et un parcours cohérent à chaque visite.",
    span: "main",
  },
  {
    Icon: PaletteIcon,
    title: "À votre image",
    text: "Chaque commerce garde ses couleurs, sa carte et ses propres avantages.",
    span: "normal",
  },
  {
    Icon: ZapIcon,
    title: "Rapide en caisse",
    text: "Scannez, ajoutez les points et validez l'avantage sans ralentir le service.",
    span: "normal",
  },
  {
    Icon: UsersIcon,
    title: "Une équipe bien organisée",
    text: "Invitez vos employés et attribuez uniquement les permissions nécessaires à chacun.",
    span: "normal",
  },
  {
    Icon: NetworkIcon,
    title: "Rejoignez le réseau Fideto",
    text: "Intégrez une communauté de commerçants, développez votre visibilité auprès des clients Fideto et renforcez l'image moderne de votre établissement.",
    span: "normal",
  },
] as const;

export default async function HomePage() {
  const { clientHref, proHref } = await resolveLandingAuthTargets();

  return (
    <div className="fidelo-landing relative w-full overflow-hidden font-sans">
      <LandingHeader clientHref={clientHref} proHref={proHref} />

      <main>
        {/* Hero */}
        <section className="mx-auto grid w-full max-w-[1180px] gap-10 px-5 py-16 lg:min-h-[670px] lg:grid-cols-[1.04fr_0.96fr] lg:items-center lg:gap-16 lg:py-[78px]">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-[var(--fh-purple-soft)] px-3 py-1.5 text-[12px] font-extrabold uppercase tracking-[0.04em] text-[light-dark(#6d28d9,#d8b4fe)]">
              <span className="h-[7px] w-[7px] rounded-full bg-[#a855f7] shadow-[0_0_0_5px_rgba(168,85,247,0.14)]" />
              La fidélité, enfin simple
            </div>

            <h1 className="mt-5 max-w-[560px] text-[46px] font-extrabold leading-[0.98] tracking-[-0.045em] text-[var(--fh-text)] sm:text-[64px]">
              Une seule carte.
              <br />
              <span
                className="bg-clip-text text-transparent"
                style={{ backgroundImage: "linear-gradient(100deg, #6d28d9, #a855f7 65%, #c026d3)" }}
              >
                Toutes vos fidélités.
              </span>
            </h1>

            <p className="max-w-[560px] text-lg leading-[1.68] text-[var(--fh-muted)]">
              Fideto réunit vos cartes, vos points et vos avantages dans un seul espace. Pour les commerçants,
              c&apos;est un programme de fidélité moderne, simple à lancer et agréable à utiliser.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href={clientHref}
                className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-[14px] px-[18px] text-sm font-bold text-white shadow-[0_12px_30px_rgba(124,58,237,0.28)] transition hover:opacity-95"
                style={{ background: "linear-gradient(135deg, #7c3aed, #a855f7)" }}
              >
                Se connecter
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
              <Link
                href={proHref}
                className="inline-flex min-h-[44px] items-center justify-center rounded-[14px] border border-[var(--fh-border)] bg-[var(--fh-surface)] px-[18px] text-sm font-bold text-[var(--fh-text)] shadow-[0_8px_28px_rgba(30,18,45,0.06)] transition hover:opacity-90"
              >
                Je suis commerçant
              </Link>
            </div>

            <div className="mt-5 grid grid-cols-3 gap-2 sm:flex sm:flex-wrap sm:gap-4.5">
              {GUARANTEES.map((item) => (
                <span
                  key={item}
                  className="flex flex-col items-center gap-1 text-center text-[11px] leading-tight text-[var(--fh-muted)] sm:flex-row sm:gap-1.5 sm:text-left sm:text-[13px]"
                >
                  <CheckIcon className="h-[13px] w-[13px] shrink-0 text-[var(--fh-purple)] sm:h-[15px] sm:w-[15px]" />
                  {item}
                </span>
              ))}
            </div>
          </div>

          <LandingHeroVisual />
        </section>

        {/* Proof bar */}
        <section className="border-y border-[var(--fh-border)] bg-[light-dark(rgba(255,255,255,0.46),rgba(18,13,27,0.45))]">
          <div className="mx-auto grid min-h-[108px] w-full max-w-[1180px] grid-cols-2 items-center px-5 lg:grid-cols-4">
            {PROOF_ITEMS.map(({ label, Icon }, index) => (
              <div
                key={label}
                className={`flex min-h-14 items-center justify-center gap-2.5 py-4 text-sm font-bold text-[var(--fh-muted)] ${
                  index > 0 ? "border-l border-[var(--fh-border)] max-lg:border-l-0" : ""
                } ${index === 2 ? "max-lg:border-l max-lg:border-[var(--fh-border)]" : ""}`}
              >
                <Icon className="h-5 w-5 shrink-0 text-[var(--fh-purple)]" />
                {label}
              </div>
            ))}
          </div>
        </section>

        {/* Section clients */}
        <section id="fonctionnement" className="mx-auto w-full max-w-[1180px] scroll-mt-20 px-5 py-[90px]">
          <div className="max-w-[690px]">
            <p className="text-[13px] font-extrabold uppercase tracking-[0.08em] text-[var(--fh-purple)]">
              Pour vos clients
            </p>
            <h2 className="mt-3 text-[32px] font-extrabold leading-[1.06] tracking-[-0.03em] text-[var(--fh-text)] sm:text-[42px]">
              Vos récompenses vous suivent partout.
            </h2>
            <p className="mt-3.5 leading-[1.7] text-[var(--fh-muted)]">
              Plus besoin de chercher une carte papier ou de retenir plusieurs identifiants. Fideto rassemble
              l&apos;essentiel dans une expérience unique.
            </p>
          </div>

          <div className="mt-9 grid gap-4.5 sm:grid-cols-3">
            {CLIENT_STEPS.map((step) => (
              <article
                key={step.number}
                className="min-h-[220px] rounded-[25px] border border-[var(--fh-border)] bg-[var(--fh-surface)] p-7"
                style={{ boxShadow: "0 16px 45px rgba(35,18,52,0.06)" }}
              >
                <div className="grid h-11 w-11 place-items-center rounded-[14px] bg-[var(--fh-purple-soft)] text-sm font-black text-[var(--fh-purple)]">
                  {step.number}
                </div>
                <h3 className="mb-2.5 mt-7 text-[19px] font-extrabold tracking-[-0.02em] text-[var(--fh-text)]">
                  {step.title}
                </h3>
                <p className="leading-[1.6] text-[var(--fh-muted)]">{step.text}</p>
              </article>
            ))}
          </div>
        </section>

        {/* Section commerçants */}
        <section
          id="commercants"
          className="scroll-mt-20 py-[90px]"
          style={{
            background:
              "linear-gradient(180deg, transparent, var(--fh-bg-soft) 18%, var(--fh-bg-soft) 82%, transparent)",
          }}
        >
          <div className="mx-auto grid w-full max-w-[1180px] items-center gap-12 px-5 lg:grid-cols-[0.88fr_1.12fr] lg:gap-16">
            <div>
              <p className="text-[13px] font-extrabold uppercase tracking-[0.08em] text-[var(--fh-purple)]">
                Pour les commerçants
              </p>
              <h2 className="mt-3 text-[32px] font-extrabold leading-[1.06] tracking-[-0.03em] text-[var(--fh-text)] sm:text-[42px]">
                Créez une fidélité qui donne envie de revenir.
              </h2>
              <p className="mt-3.5 leading-[1.7] text-[var(--fh-muted)]">
                Lancez votre programme, personnalisez vos avantages et pilotez votre activité depuis un tableau de
                bord clair.
              </p>

              <div className="mt-6.5 grid gap-3.5">
                {MERCHANT_BENEFITS.map((benefit) => (
                  <div key={benefit} className="flex items-start gap-2.5 text-[var(--fh-muted)]">
                    <CheckCircleIcon className="mt-0.5 h-[18px] w-[18px] shrink-0 text-[var(--fh-purple)]" />
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>

              <Link
                href={proHref}
                className="mt-7 inline-flex min-h-[44px] items-center justify-center gap-2 rounded-[14px] px-[18px] text-sm font-bold text-white shadow-[0_12px_30px_rgba(124,58,237,0.28)] transition hover:opacity-95"
                style={{ background: "linear-gradient(135deg, #7c3aed, #a855f7)" }}
              >
                Créer mon programme
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
            </div>

            <div className="flex justify-center lg:justify-end">
              <LandingMerchantPreview />
            </div>
          </div>
        </section>

        {/* Pourquoi Fideto */}
        <section id="avantages" className="mx-auto w-full max-w-[1180px] scroll-mt-20 px-5 py-[90px]">
          <div className="max-w-[690px]">
            <p className="text-[13px] font-extrabold uppercase tracking-[0.08em] text-[var(--fh-purple)]">
              Pourquoi Fideto
            </p>
            <h2 className="mt-3 text-[32px] font-extrabold leading-[1.06] tracking-[-0.03em] text-[var(--fh-text)] sm:text-[42px]">
              Tout ce qu&apos;il faut. Rien de compliqué.
            </h2>
          </div>

          <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-[1.2fr_0.8fr_0.8fr]">
            {BENTO_ITEMS.map((item) => (
              <article
                key={item.title}
                className={`min-h-[220px] rounded-[25px] border border-[var(--fh-border)] p-7 ${
                  item.span === "main" ? "sm:col-span-2 sm:row-span-2 lg:col-span-1 lg:row-span-2 lg:min-h-[456px]" : ""
                }`}
                style={{
                  background:
                    item.span === "main"
                      ? "linear-gradient(155deg, var(--fh-surface-solid), var(--fh-purple-soft))"
                      : "var(--fh-surface)",
                }}
              >
                <div className="grid h-[46px] w-[46px] place-items-center rounded-[15px] bg-[var(--fh-purple-soft)] text-[var(--fh-purple)]">
                  <item.Icon className="h-5 w-5" />
                </div>
                <h3 className="mb-2 mt-6 text-xl font-extrabold text-[var(--fh-text)]">{item.title}</h3>
                <p className="leading-[1.6] text-[var(--fh-muted)]">{item.text}</p>
              </article>
            ))}
          </div>
        </section>

        {/* Confidentialité */}
        <section className="mx-auto w-full max-w-[1180px] px-5 py-[90px]">
          <div
            className="flex flex-col items-start justify-between gap-7 rounded-[28px] border border-[var(--fh-border)] p-9 sm:flex-row sm:items-center"
            style={{ background: "linear-gradient(110deg, var(--fh-surface-solid), var(--fh-purple-soft))" }}
          >
            <div>
              <p className="text-[13px] font-extrabold uppercase tracking-[0.08em] text-[var(--fh-purple)]">
                Confidentialité
              </p>
              <h2 className="mt-2.5 text-[28px] font-extrabold tracking-[-0.02em] text-[var(--fh-text)] sm:text-[36px]">
                Vos données restent les vôtres.
              </h2>
              <p className="mt-2.5 max-w-[680px] leading-[1.65] text-[var(--fh-muted)]">
                Fideto utilise uniquement les données nécessaires au fonctionnement du service et vous permet de
                garder le contrôle sur vos informations et vos préférences.
              </p>
            </div>
            <Link
              href="/confidentialite"
              className="inline-flex min-h-[44px] shrink-0 items-center justify-center rounded-[14px] border border-[var(--fh-border)] bg-[var(--fh-surface)] px-[18px] text-sm font-bold text-[var(--fh-text)] shadow-[0_8px_28px_rgba(30,18,45,0.06)] transition hover:opacity-90"
            >
              Comprendre notre approche
            </Link>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="mx-auto w-full max-w-[1180px] scroll-mt-20 px-5 py-[90px]">
          <div className="mb-9 max-w-[690px]">
            <p className="text-[13px] font-extrabold uppercase tracking-[0.08em] text-[var(--fh-purple)]">
              Questions fréquentes
            </p>
            <h2 className="mt-3 text-[32px] font-extrabold leading-[1.06] tracking-[-0.03em] text-[var(--fh-text)] sm:text-[42px]">
              Vous vous demandez peut-être…
            </h2>
          </div>
          <LandingFaq />
        </section>

        {/* CTA final */}
        <section className="mx-auto w-full max-w-[1180px] px-5 py-[90px]">
          <div
            className="rounded-[34px] p-10 text-center text-white sm:p-14"
            style={{
              background:
                "radial-gradient(circle at 15% 20%, rgba(216,180,254,.28), transparent 19rem), linear-gradient(135deg, #261538, #6d28d9 64%, #a855f7)",
              boxShadow: "0 32px 80px rgba(91,33,182,0.27)",
            }}
          >
            <h2 className="mx-auto max-w-[760px] text-[28px] font-extrabold tracking-[-0.02em] sm:text-[38px]">
              Prêt à créer une fidélité qui compte vraiment ?
            </h2>
            <p className="mx-auto mt-4 max-w-[650px] leading-[1.65] text-white/78">
              Rejoignez Fideto et proposez à vos clients une expérience simple, moderne et toujours accessible.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <Link
                href={proHref}
                className="inline-flex min-h-[44px] items-center justify-center rounded-[14px] bg-white px-[18px] text-sm font-bold text-[#5b21b6] transition hover:opacity-90"
              >
                Créer mon programme
              </Link>
              <a
                href="mailto:support@fideto.fr"
                className="inline-flex min-h-[44px] items-center justify-center rounded-[14px] border border-white/26 bg-white/10 px-[18px] text-sm font-bold text-white transition hover:bg-white/15"
              >
                Nous contacter
              </a>
            </div>
            <p className="mt-6 text-sm text-white/70">
              Déjà inscrit ?{" "}
              <Link href={clientHref} className="font-bold text-white underline underline-offset-2">
                Se connecter
              </Link>
            </p>
          </div>
        </section>
      </main>

      <LandingFooter />
    </div>
  );
}
