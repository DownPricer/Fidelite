import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { formatEurosFromCents, isMerchantPlanId, MERCHANT_PLANS } from "@/lib/merchant-plans";
import { isMerchantSignupBetaForm } from "@/lib/merchant-signup-mode";
import { MerchantSignupForm } from "./ui";

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
    <div className="pr-scene min-h-dvh">
      <header className="pr-head">
        <div className="pr-wrap pr-head-inner">
          <Link href="/" className="pr-brand">
            <span className="pr-brand-mark">FL</span>Fideto
          </Link>
          <nav className="pr-nav" aria-label="Navigation">
            <Link href="/tarifs">Tarifs</Link>
            <Link href="/app/connexion">Se connecter</Link>
          </nav>
        </div>
      </header>

      <main className="pr-wrap pb-16 pt-8">
        <MerchantSignupForm plan={planSummary} />
      </main>
    </div>
  );
}
