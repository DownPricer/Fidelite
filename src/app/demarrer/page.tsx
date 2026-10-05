import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { formatEurosFromCents, isMerchantPlanId, MERCHANT_PLANS } from "@/lib/merchant-plans";
import { publicAppUrl } from "@/lib/hosts";
import { isMerchantSignupBetaForm } from "@/lib/merchant-signup-mode";
import { MerchantSignupForm } from "./ui";
import "./beta-signup.css";

export const metadata: Metadata = {
  alternates: { canonical: "/demarrer" },
  title: "Fideto — Demande d'accès commerçant",
  description: "Fideto est en phase bêta : déposez votre demande d'accès commerçant sans engagement.",
};

export default async function DemarrerPage({
  searchParams,
}: {
  searchParams: Promise<{ plan?: string }>;
}) {
  if (!isMerchantSignupBetaForm()) {
    redirect("/tarifs");
  }

  const params = await searchParams;
  if (!isMerchantPlanId(params.plan)) {
    redirect("/tarifs");
  }

  const plan = MERCHANT_PLANS[params.plan];
  const planSummary = {
    id: plan.id,
    name: plan.name,
    monthlyLabel: formatEurosFromCents(plan.monthlyPriceCents),
    setupLabel: plan.setupPriceCents ? formatEurosFromCents(plan.setupPriceCents) : null,
    firstMonthIncluded: plan.firstMonthIncluded,
  };

  return (
    <div className="fd-beta-scene">
      <header className="fd-header">
        <Link href="/" className="fd-brand">
          <span className="fd-brand-mark" aria-hidden>FL</span>
          <span>Fideto</span>
        </Link>
        <nav className="fd-nav" aria-label="Navigation principale">
          <Link href="/tarifs" className="fd-link">Tarifs</Link>
          <Link href="/contact" className="fd-link">Besoin d&apos;aide ?</Link>
          <a href={publicAppUrl("/app/connexion")} className="fd-nav-cta">Se connecter</a>
        </nav>
      </header>

      <main className="fd-shell">
        <MerchantSignupForm plan={planSummary} />
      </main>
    </div>
  );
}
