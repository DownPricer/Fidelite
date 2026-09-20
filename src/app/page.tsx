import type { Metadata } from "next";
import Link from "next/link";
import { LandingHeader } from "@/components/landing/landing-header";
import { LandingFooter } from "@/components/landing/landing-footer";
import { LandingFaq } from "@/components/landing/landing-faq";
import { LandingHeroVisual } from "@/components/landing/landing-hero-visual";
import { LandingMerchantPreview } from "@/components/landing/landing-merchant-preview";
import {
  GiftIcon,
  ScanLineIcon,
  ShieldCheckIcon,
  StoreIcon,
  WalletIcon,
} from "@/components/landing/icons";

export const metadata: Metadata = {
  title: "Fidelo — Toutes vos cartes de fidélité au même endroit",
  description:
    "Fidelo réunit les cartes, les points et les avantages des clients, tout en donnant aux commerçants les outils pour créer et gérer leur programme de fidélité.",
};

const BENEFITS_BAR = [
  { label: "Un scan suffit", Icon: ScanLineIcon },
  { label: "Avantages en temps réel", Icon: GiftIcon },
  { label: "Pensé pour les commerces", Icon: StoreIcon },
  { label: "Données protégées", Icon: ShieldCheckIcon },
] as const;

const CLIENT_STEPS = [
  {
    title: "Rejoignez un commerce",
    text: "Scannez son QR code ou ouvrez son lien Fidelo pour ajouter votre carte en quelques secondes.",
  },
  {
    title: "Présentez votre QR personnel",
    text: "Le commerçant retrouve votre carte et met à jour votre fidélité depuis sa caisse.",
  },
  {
    title: "Profitez de vos avantages",
    text: "Suivez votre progression et utilisez vos récompenses directement chez le commerçant.",
  },
] as const;

const CLIENT_BENEFITS = [
  "Toutes vos cartes au même endroit",
  "Points et passages clairement séparés",
  "Vos prochains avantages en un coup d'œil",
  "Historique de votre fidélité",
  "Partage de carte",
  "Ajout à Google Wallet lorsque disponible",
] as const;

const MERCHANT_BENEFITS = [
  "Programme en points ou en passages",
  "Avantages configurables",
  "Cartes personnalisées",
  "Caisse rapide",
  "Accès employés et permissions",
  "Suivi des clients et activité récente",
  "Google Wallet lorsque configuré",
] as const;

const COMMON_ADVANTAGES = [
  {
    title: "Une expérience commune",
    text: "Clients et commerçants évoluent dans le même univers Fidelo, pensé pour les deux publics.",
  },
  {
    title: "Personnalisation du commerce",
    text: "Chaque commerçant adapte sa carte, ses couleurs et ses avantages à son image.",
  },
  {
    title: "Rapidité en caisse",
    text: "Un scan suffit pour identifier le client et mettre à jour sa fidélité.",
  },
  {
    title: "Accès des employés",
    text: "Des accès dédiés permettent à l'équipe d'utiliser la caisse sans partager de compte principal.",
  },
  {
    title: "QR personnel",
    text: "Chaque client dispose d'un identifiant unique, valable chez tous les commerces Fidelo.",
  },
  {
    title: "Google Wallet",
    text: "Les cartes compatibles peuvent être ajoutées directement au portefeuille du téléphone.",
  },
  {
    title: "Respect des données",
    text: "Seules les données nécessaires au fonctionnement du service sont utilisées.",
  },
  {
    title: "Thèmes clair et sombre",
    text: "Fidelo s'adapte à la préférence d'affichage de chaque utilisateur.",
  },
] as const;

export default function HomePage() {
  return (
    <div className="obsidian-scene relative min-h-dvh overflow-x-hidden text-[var(--ink-soft)]">
      <LandingHeader />

      <main>
        {/* Hero */}
        <section className="mx-auto flex max-w-7xl flex-col gap-12 px-6 py-14 lg:flex-row lg:items-center lg:justify-between lg:gap-16 lg:py-20">
          <div className="max-w-xl">
            <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[var(--violet-bright)]">
              La fidélité, enfin simple
            </p>
            <h1 className="mt-3 text-4xl font-black tracking-tight text-[var(--ink)] sm:text-5xl">
              Une seule carte. Toutes vos fidélités.
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-[var(--muted-strong)]">
              Fidelo réunit vos cartes, vos points et vos avantages dans un seul espace. Pour les commerçants,
              c&apos;est un programme moderne, simple à lancer et agréable à utiliser.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <a href="#clients" className="glass-cta min-w-[200px] justify-center px-6 py-3.5 text-sm">
                Je suis client
              </a>
              <a
                href="#commercants"
                className="inline-flex min-w-[200px] items-center justify-center rounded-full border border-[light-dark(rgba(122,69,242,0.24),rgba(190,164,255,0.3))] bg-[light-dark(rgba(255,255,255,0.75),rgba(255,255,255,0.06))] px-6 py-3.5 text-sm font-bold text-[var(--ink)] transition hover:bg-[light-dark(rgba(255,255,255,0.92),rgba(255,255,255,0.1))]"
              >
                Je suis commerçant
              </a>
            </div>
            <p className="mt-8 max-w-md text-sm text-[var(--muted)]">
              Un seul QR en caisse. Des programmes en points ou en passages. Des cartes qui donnent envie
              d&apos;être collectionnées.
            </p>
          </div>

          <LandingHeroVisual />
        </section>

        {/* Choix de parcours */}
        <section id="parcours" className="mx-auto max-w-7xl px-6 py-16 scroll-mt-24">
          <h2 className="text-center text-3xl font-black tracking-tight text-[var(--ink)] sm:text-4xl">
            Que souhaitez-vous faire avec Fidelo ?
          </h2>
          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            <div className="glass-panel flex flex-col p-7 sm:p-8">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[light-dark(rgba(122,69,242,0.1),rgba(255,255,255,0.08))] text-[var(--violet-bright)]" aria-hidden>
                <WalletIcon className="h-6 w-6" />
              </span>
              <h3 className="mt-5 text-2xl font-black text-[var(--ink)]">Je suis client</h3>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-[var(--muted-strong)]">
                Retrouvez vos cartes, suivez vos récompenses et présentez un seul QR chez vos commerces préférés.
              </p>
              <a href="#clients" className="glass-cta mt-6 justify-center px-6 py-3.5 text-sm">
                Découvrir l&apos;expérience client
              </a>
            </div>
            <div className="glass-panel flex flex-col p-7 sm:p-8">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[light-dark(rgba(201,63,214,0.1),rgba(231,116,255,0.12))] text-[var(--violet-bright)]" aria-hidden>
                <StoreIcon className="h-6 w-6" />
              </span>
              <h3 className="mt-5 text-2xl font-black text-[var(--ink)]">Je suis commerçant</h3>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-[var(--muted-strong)]">
                Créez votre programme, récompensez vos clients et gérez facilement votre fidélité au quotidien.
              </p>
              <a href="#commercants" className="glass-cta mt-6 justify-center px-6 py-3.5 text-sm">
                Découvrir l&apos;espace commerçant
              </a>
            </div>
          </div>
        </section>

        {/* Barre de bénéfices communs */}
        <section className="border-y border-[light-dark(rgba(122,69,242,0.1),rgba(255,255,255,0.08))] bg-[light-dark(rgba(255,255,255,0.4),rgba(255,255,255,0.02))] px-6 py-6">
          <ul className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-10 gap-y-3">
            {BENEFITS_BAR.map(({ label, Icon }) => (
              <li key={label} className="flex items-center gap-2 text-sm font-bold text-[var(--ink-soft)]">
                <Icon className="h-4 w-4 shrink-0 text-[var(--violet-bright)]" />
                {label}
              </li>
            ))}
          </ul>
        </section>

        {/* Comment ça marche (vue d'ensemble) */}
        <section id="fonctionnement" className="mx-auto max-w-7xl px-6 py-16 scroll-mt-24">
          <h2 className="text-center text-3xl font-black tracking-tight text-[var(--ink)] sm:text-4xl">
            Comment ça marche
          </h2>
          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            <div className="glass-panel p-6 sm:p-7">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--violet-bright)]">Côté client</p>
              <ol className="mt-4 space-y-3">
                {CLIENT_STEPS.map((step, index) => (
                  <li key={step.title} className="flex items-start gap-3">
                    <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[light-dark(rgba(122,69,242,0.12),rgba(255,255,255,0.1))] text-xs font-black text-[var(--ink)]">
                      {index + 1}
                    </span>
                    <span className="text-sm font-semibold text-[var(--ink-soft)]">{step.title}</span>
                  </li>
                ))}
              </ol>
            </div>
            <div className="glass-panel p-6 sm:p-7">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--violet-bright)]">Côté commerçant</p>
              <ol className="mt-4 space-y-3">
                {[
                  "Créez votre programme",
                  "Personnalisez votre carte et vos avantages",
                  "Utilisez une caisse simple au quotidien",
                  "Suivez l'activité de votre programme",
                ].map((step, index) => (
                  <li key={step} className="flex items-start gap-3">
                    <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[light-dark(rgba(122,69,242,0.12),rgba(255,255,255,0.1))] text-xs font-black text-[var(--ink)]">
                      {index + 1}
                    </span>
                    <span className="text-sm font-semibold text-[var(--ink-soft)]">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        {/* Section clients */}
        <section id="clients" className="mx-auto max-w-7xl px-6 py-16 scroll-mt-24">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[var(--violet-bright)]">Pour les clients</p>
              <h2 className="mt-3 text-3xl font-black tracking-tight text-[var(--ink)] sm:text-4xl">
                Vos récompenses vous suivent partout.
              </h2>
              <p className="mt-4 text-base leading-relaxed text-[var(--muted-strong)]">
                Plus besoin de chercher une carte papier ou de retenir plusieurs identifiants. Fidelo rassemble vos
                cartes et votre progression dans une expérience unique.
              </p>

              <div className="mt-8 space-y-5">
                {CLIENT_STEPS.map((step, index) => (
                  <div key={step.title} className="flex gap-4">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[light-dark(rgba(122,69,242,0.1),rgba(255,255,255,0.08))] text-sm font-black text-[var(--ink)]">
                      {index + 1}
                    </span>
                    <div>
                      <p className="font-bold text-[var(--ink)]">{step.title}</p>
                      <p className="mt-1 text-sm leading-relaxed text-[var(--muted-strong)]">{step.text}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Link href="/connexion" className="glass-cta mt-9 inline-flex px-6 py-3.5 text-sm">
                Créer mon espace client
              </Link>
            </div>

            <ul className="glass-panel grid grid-cols-1 gap-4 p-7 sm:grid-cols-2 sm:p-8">
              {CLIENT_BENEFITS.map((benefit) => (
                <li key={benefit} className="flex items-start gap-2.5 text-sm font-semibold text-[var(--ink-soft)]">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--violet-bright)]" aria-hidden />
                  {benefit}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Section commerçants */}
        <section id="commercants" className="mx-auto max-w-7xl px-6 py-16 scroll-mt-24">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[var(--violet-bright)]">Pour les commerçants</p>
              <h2 className="mt-3 text-3xl font-black tracking-tight text-[var(--ink)] sm:text-4xl">
                Créez une fidélité qui donne envie de revenir.
              </h2>
              <p className="mt-4 text-base leading-relaxed text-[var(--muted-strong)]">
                Lancez votre programme, personnalisez vos avantages et gérez votre activité depuis un espace simple
                et moderne.
              </p>

              <ul className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {MERCHANT_BENEFITS.map((benefit) => (
                  <li key={benefit} className="flex items-start gap-2.5 text-sm font-semibold text-[var(--ink-soft)]">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--violet-bright)]" aria-hidden />
                    {benefit}
                  </li>
                ))}
              </ul>

              <div className="mt-9 flex flex-wrap gap-3">
                <Link href="/app/connexion" className="glass-cta px-6 py-3.5 text-sm">
                  Créer mon programme
                </Link>
                <a
                  href="#fonctionnement"
                  className="inline-flex items-center justify-center rounded-full border border-[light-dark(rgba(122,69,242,0.2),rgba(255,255,255,0.14))] bg-transparent px-6 py-3.5 text-sm font-bold text-[var(--ink)] transition hover:bg-[light-dark(rgba(255,255,255,0.6),rgba(255,255,255,0.06))]"
                >
                  Voir comment ça fonctionne
                </a>
              </div>
            </div>

            <div className="flex justify-center lg:justify-end">
              <LandingMerchantPreview />
            </div>
          </div>

          {/* Tarifs */}
          <div id="tarifs" className="glass-panel mt-14 p-8 text-center scroll-mt-24 sm:p-10">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--violet-bright)]">
              Offre commerçant
            </p>
            <h3 className="mt-2 text-2xl font-black text-[var(--ink)] sm:text-3xl">
              Des formules adaptées à votre activité
            </h3>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-[var(--muted-strong)]">
              Contactez-nous pour découvrir l&apos;offre correspondant à votre commerce.
            </p>
            <a href="#contact" className="glass-cta mt-6 inline-flex px-6 py-3.5 text-sm">
              Nous contacter
            </a>
          </div>
        </section>

        {/* Avantages communs */}
        <section id="avantages" className="mx-auto max-w-7xl px-6 py-16 scroll-mt-24">
          <h2 className="text-center text-3xl font-black tracking-tight text-[var(--ink)] sm:text-4xl">
            Tout ce qu&apos;il faut. Rien de compliqué.
          </h2>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {COMMON_ADVANTAGES.map((item) => (
              <div key={item.title} className="glass-panel p-6">
                <h3 className="text-base font-black text-[var(--ink)]">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--muted-strong)]">{item.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Confidentialité */}
        <section className="mx-auto max-w-3xl px-6 py-16 text-center">
          <h2 className="text-2xl font-black tracking-tight text-[var(--ink)] sm:text-3xl">
            Vos données restent les vôtres.
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-[var(--muted-strong)]">
            Fidelo utilise uniquement les données nécessaires au fonctionnement du service et vous permet de garder
            le contrôle sur vos informations et vos préférences.
          </p>
          <Link
            href="/confidentialite"
            className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-[var(--violet-bright)] hover:underline"
          >
            Comprendre notre approche
            <span aria-hidden>→</span>
          </Link>
        </section>

        {/* FAQ */}
        <section id="faq" className="mx-auto max-w-3xl px-6 py-16 scroll-mt-24">
          <h2 className="text-center text-3xl font-black tracking-tight text-[var(--ink)] sm:text-4xl">
            Questions fréquentes
          </h2>
          <div className="mt-10">
            <LandingFaq />
          </div>
        </section>

        {/* Contact */}
        <section id="contact" className="mx-auto max-w-3xl px-6 py-16 text-center scroll-mt-24">
          <h2 className="text-2xl font-black tracking-tight text-[var(--ink)] sm:text-3xl">Une question ?</h2>
          <p className="mt-4 text-sm leading-relaxed text-[var(--muted-strong)]">
            Notre équipe vous répond rapidement, que vous soyez client ou commerçant.
          </p>
          <a
            href="mailto:support@fidelo.app"
            className="glass-cta mt-6 inline-flex px-6 py-3.5 text-sm"
          >
            support@fidelo.app
          </a>
        </section>

        {/* CTA final double */}
        <section className="mx-auto max-w-7xl px-6 py-16">
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="glass-panel p-8 text-center sm:p-10">
              <h3 className="text-xl font-black text-[var(--ink)] sm:text-2xl">
                Toutes vos cartes, enfin réunies.
              </h3>
              <Link href="/connexion" className="glass-cta mt-6 inline-flex px-6 py-3.5 text-sm">
                Créer mon espace client
              </Link>
            </div>
            <div className="glass-panel p-8 text-center sm:p-10">
              <h3 className="text-xl font-black text-[var(--ink)] sm:text-2xl">
                Une fidélité moderne pour votre commerce.
              </h3>
              <Link href="/app/connexion" className="glass-cta mt-6 inline-flex px-6 py-3.5 text-sm">
                Créer mon programme
              </Link>
            </div>
          </div>
          <p className="mt-8 text-center text-sm font-medium text-[var(--muted-strong)]">
            Déjà inscrit ?{" "}
            <Link href="/connexion" className="font-bold text-[var(--violet-bright)] hover:underline">
              Se connecter
            </Link>
          </p>
        </section>
      </main>

      <LandingFooter />
    </div>
  );
}
