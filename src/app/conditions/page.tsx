import Link from "next/link";
import { BrandMark, Card } from "@/components/ui";

export default function TermsPage() {
  return (
    <main className="min-h-dvh bg-[var(--void)] px-6 py-10 text-[var(--ink-soft)]">
      <div className="mx-auto max-w-2xl">
        <BrandMark />
        <h1 className="mt-8 text-3xl font-semibold text-[var(--ink)]">Conditions d’utilisation</h1>
        <Card className="mt-6 space-y-4 text-sm leading-6">
          <p>
            Les conditions d’utilisation complètes de Fideto sont en cours de finalisation.
            Cette page sera publiée avant toute validation juridique définitive.
          </p>
        </Card>
        <Link href="/" className="mt-6 inline-block text-sm text-[var(--violet-bright)] underline">
          Retour
        </Link>
      </div>
    </main>
  );
}
