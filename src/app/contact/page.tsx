import type { Metadata } from "next";
import Link from "next/link";
import { BrandMark } from "@/components/ui";
import { getConfiguredSupportEmail } from "@/lib/support-contact";
import { ContactForm } from "./ui";

export const metadata: Metadata = {
  title: "Contacter Fideto",
  description: "Assistance Fideto — support client et commerçants.",
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
};

export default function ContactPage() {
  const supportEmail = getConfiguredSupportEmail();

  return (
    <div className="fidelo-landing min-h-dvh bg-[var(--fh-bg)] px-5 py-10 text-[var(--fh-text)] sm:py-14">
      <div className="mx-auto w-full max-w-[560px]">
        <Link href="/" aria-label="Fideto — accueil" className="inline-flex">
          <BrandMark className="scale-95" />
        </Link>

        <h1 className="mt-8 text-3xl font-extrabold tracking-tight sm:text-4xl">Contacter Fideto</h1>
        <p className="mt-3 text-base leading-relaxed text-[var(--fh-muted)]">
          Une question sur votre compte, votre carte Google Wallet ou un commerce partenaire ? Notre équipe vous répond
          dès que possible. Aucune connexion n&apos;est requise.
        </p>

        <section
          className="mt-8 rounded-[24px] border border-[var(--fh-border)] bg-[var(--fh-surface)] p-6 shadow-[0_8px_28px_rgba(30,18,45,0.06)] sm:p-8"
          aria-labelledby="contact-form-title"
        >
          <h2 id="contact-form-title" className="sr-only">
            Formulaire de contact
          </h2>
          <ContactForm supportEmail={supportEmail} />
        </section>

        <p className="mt-8 text-center text-sm text-[var(--fh-muted)]">
          <Link href="/" className="font-semibold text-[var(--fh-purple)] hover:underline">
            Retour à l&apos;accueil
          </Link>
        </p>
      </div>
    </div>
  );
}
