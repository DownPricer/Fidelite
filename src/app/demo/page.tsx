import Link from "next/link";
import { BrandMark } from "@/components/ui";

const SPACES = [
  {
    title: "Wallet client",
    description: "Cartes Fife Life, points et QR universel.",
    href: "/demo/enter/client",
    cta: "Voir la démo client",
  },
  {
    title: "Espace commerçant",
    description: "Gérer le Café Demo, clients, employés et programme.",
    href: "/demo/enter/merchant",
    cta: "Voir la démo commerçant",
  },
  {
    title: "App employé",
    description: "Scanner les QR clients et valider les passages.",
    href: "/demo/enter/employee",
    cta: "Voir la démo employé",
  },
] as const;

export default function DemoHubPage() {
  return (
    <main className="obsidian-scene relative flex min-h-dvh flex-col items-center justify-center px-5 py-10 text-[var(--ink)]">
      <div className="relative w-full max-w-lg">
        <div className="mb-8 flex flex-col items-center text-center">
          <BrandMark className="mb-6" />
          <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[var(--violet-bright)]">
            Mode démonstration
          </p>
          <h1 className="mt-2 text-3xl font-black tracking-tight">Choisissez un espace</h1>
          <p className="mt-2 text-sm font-medium leading-relaxed text-[var(--muted-strong)]">
            Explorez Fife Life sans mot de passe ni configuration.
          </p>
        </div>

        <div className="space-y-3">
          {SPACES.map((space) => (
            <Link
              key={space.href}
              href={space.href}
              className="glass-panel group block rounded-2xl p-5 transition hover:border-[rgba(190,164,255,0.45)]"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-lg font-black text-[var(--ink)]">{space.title}</h2>
                  <p className="mt-1 text-sm leading-relaxed text-[var(--muted-strong)]">{space.description}</p>
                </div>
                <span
                  className="mt-0.5 shrink-0 text-[var(--violet-bright)] transition group-hover:translate-x-0.5"
                  aria-hidden
                >
                  →
                </span>
              </div>
              <span className="mt-4 inline-flex rounded-full border border-[rgba(190,164,255,0.32)] bg-[rgba(12,10,24,0.88)] px-4 py-2 text-xs font-bold text-[var(--ink)]">
                {space.cta}
              </span>
            </Link>
          ))}
        </div>

        <div className="glass-panel mt-6 p-4 text-center text-sm text-[var(--muted-strong)]">
          <p>Vous avez déjà un compte ?</p>
          <div className="mt-3 flex flex-wrap justify-center gap-x-4 gap-y-2 text-xs font-bold">
            <Link href="/connexion" className="text-[var(--violet-bright)] hover:underline">
              Client
            </Link>
            <Link href="/app/connexion" className="text-[var(--violet-bright)] hover:underline">
              Commerçant
            </Link>
            <Link href="/employe/connexion" className="text-[var(--violet-bright)] hover:underline">
              Employé
            </Link>
          </div>
        </div>

        <details className="glass-panel mt-4 p-4 text-sm text-[var(--muted-strong)]">
          <summary className="cursor-pointer font-bold text-[var(--ink-soft)]">
            Comptes de test (avec base de données)
          </summary>
          <ul className="mt-3 space-y-2 text-left text-xs leading-relaxed">
            <li>
              <strong className="text-[var(--ink)]">Client :</strong> client@demo.local
            </li>
            <li>
              <strong className="text-[var(--ink)]">Commerçant :</strong> admin@cafe-demo.local
            </li>
            <li>
              <strong className="text-[var(--ink)]">Employés :</strong> employe@, sam@, noa@cafe-demo.local
            </li>
            <li>
              <strong className="text-[var(--ink)]">Numéro client carte :</strong> 482 917
            </li>
            <li className="text-[var(--muted)]">Exécutez <code className="text-[var(--violet-bright)]">npm run db:seed</code> pour créer les comptes et afficher le QR de test.</li>
          </ul>
        </details>
      </div>
    </main>
  );
}
