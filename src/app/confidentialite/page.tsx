import Link from "next/link";
import { BrandMark, Card } from "@/components/ui";

export default function PrivacyPage() {
  return (
    <main className="min-h-dvh bg-[var(--void)] px-6 py-10 text-[var(--ink-soft)]">
      <div className="mx-auto max-w-2xl">
        <BrandMark />
        <h1 className="mt-8 text-3xl font-semibold text-[var(--ink)]">Politique de confidentialité</h1>
        <Card className="mt-6 space-y-4 text-sm leading-6">
          <p>
            Fife Life collecte uniquement les données nécessaires au fonctionnement de la carte
            de fidélité : prénom, adresse e-mail, mot de passe hashé, passages et récompenses.
          </p>
          <p>
            Ces données sont isolées par commerce. Un client peut appartenir à plusieurs
            commerces, mais ses points restent séparés.
          </p>
          <p>
            Nous n’envoyons pas de SMS marketing et aucun consentement marketing n’est coché
            par défaut. Les mots de passe ne sont jamais stockés en clair.
          </p>
          <p>
            Vous pouvez demander la suppression de votre compte depuis votre espace client.
            La demande est enregistrée et traitée par l’équipe Fife Life.
          </p>
          <p>Responsable : Fife Life — domaine sitereadyshd.fr.</p>
        </Card>
        <Link href="/" className="mt-6 inline-block text-sm text-[var(--violet-bright)] underline">
          Retour
        </Link>
      </div>
    </main>
  );
}
