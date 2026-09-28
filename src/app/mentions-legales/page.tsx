import Link from "next/link";
import { BrandMark, Card } from "@/components/ui";

export default function LegalNoticePage() {
  return (
    <main className="min-h-dvh bg-[var(--void)] px-6 py-10 text-[var(--ink-soft)]">
      <div className="mx-auto max-w-2xl">
        <BrandMark />
        <h1 className="mt-8 text-3xl font-semibold text-[var(--ink)]">Mentions légales</h1>
        <Card className="mt-6 space-y-4 text-sm leading-6">
          <p>
            Les mentions légales de Fideto (éditeur, hébergeur, directeur de publication) sont en cours de
            finalisation. Cette page sera publiée avant toute validation juridique définitive.
          </p>
          <p>Responsable : Fideto — domaine sitereadyshd.fr.</p>
        </Card>
        <Link href="/tarifs" className="mt-6 inline-block text-sm text-[var(--violet-bright)] underline">
          Retour aux tarifs
        </Link>
      </div>
    </main>
  );
}
