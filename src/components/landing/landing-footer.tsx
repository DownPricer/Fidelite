import Link from "next/link";
import { BrandMark } from "@/components/ui";

const COLUMNS = [
  {
    title: "Découvrir",
    links: [
      { label: "Pour les clients", href: "#clients" },
      { label: "Pour les commerçants", href: "#commercants" },
      { label: "Comment ça marche", href: "#fonctionnement" },
      { label: "Pourquoi Fidelo", href: "#avantages" },
      { label: "Tarifs", href: "#tarifs" },
      { label: "FAQ", href: "#faq" },
    ],
  },
  {
    title: "Assistance",
    links: [
      { label: "Contact", href: "#contact" },
      { label: "Se connecter", href: "/connexion" },
    ],
  },
  {
    title: "Informations",
    links: [
      { label: "Confidentialité", href: "/confidentialite" },
      { label: "Conditions d'utilisation", href: "/conditions" },
    ],
  },
] as const;

export function LandingFooter() {
  return (
    <footer className="border-t border-[light-dark(rgba(122,69,242,0.1),rgba(255,255,255,0.08))] px-6 py-14">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr_1fr_1fr]">
          <div>
            <BrandMark />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-[var(--muted-strong)]">
              Fidelo réunit les cartes de fidélité des clients et donne aux commerçants les outils pour créer et
              gérer leur programme.
            </p>
          </div>

          {COLUMNS.map((column) => (
            <nav key={column.title} aria-label={column.title}>
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--muted)]">{column.title}</p>
              <ul className="mt-4 space-y-3">
                {column.links.map((link) => (
                  <li key={link.label}>
                    {link.href.startsWith("#") ? (
                      <a href={link.href} className="text-sm font-medium text-[var(--muted-strong)] hover:text-[var(--ink)]">
                        {link.label}
                      </a>
                    ) : (
                      <Link href={link.href} className="text-sm font-medium text-[var(--muted-strong)] hover:text-[var(--ink)]">
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <p className="mt-12 text-xs font-medium text-[var(--muted)]">
          © {new Date().getFullYear()} Fidelo. Tous droits réservés.
        </p>
      </div>
    </footer>
  );
}
