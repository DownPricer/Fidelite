import Link from "next/link";
import { BrandMark } from "@/components/ui";

const COLUMNS = [
  {
    title: "Découvrir",
    links: [
      { label: "Comment ça marche", href: "#fonctionnement" },
      { label: "Pourquoi Fideto", href: "#avantages" },
      { label: "FAQ", href: "#faq" },
    ],
  },
  {
    title: "Solutions",
    links: [
      { label: "Pour les commerçants", href: "#commercants" },
      { label: "Pour les clients", href: "#fonctionnement" },
      { label: "Google Wallet", href: "#commercants" },
    ],
  },
  {
    title: "Informations",
    links: [
      { label: "Contact", href: "mailto:support@fideto.fr" },
      { label: "Confidentialité", href: "/confidentialite" },
      { label: "Conditions", href: "/conditions" },
      { label: "Se connecter", href: "/connexion" },
    ],
  },
] as const;

function isInternalPath(href: string) {
  return href.startsWith("/");
}

export function LandingFooter() {
  return (
    <footer className="mt-[90px] border-t border-[var(--fh-border)] px-5 pb-9 pt-14">
      <div className="mx-auto max-w-[1180px]">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <BrandMark className="scale-90" />
            <p className="mt-4 max-w-[320px] text-sm leading-relaxed text-[var(--fh-muted)]">
              La fidélité numérique pensée pour les commerces et leurs clients.
            </p>
          </div>

          {COLUMNS.map((column) => (
            <nav key={column.title} aria-label={column.title}>
              <h3 className="mb-3.5 text-sm font-bold text-[var(--fh-text)]">{column.title}</h3>
              <div className="grid gap-2.5">
                {column.links.map((link) =>
                  isInternalPath(link.href) ? (
                    <Link key={link.label} href={link.href} className="text-sm text-[var(--fh-muted)] hover:text-[var(--fh-text)]">
                      {link.label}
                    </Link>
                  ) : (
                    <a key={link.label} href={link.href} className="text-sm text-[var(--fh-muted)] hover:text-[var(--fh-text)]">
                      {link.label}
                    </a>
                  ),
                )}
              </div>
            </nav>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap justify-between gap-5 border-t border-[var(--fh-border)] pt-5 text-xs text-[var(--fh-muted)]">
          <span>© {new Date().getFullYear()} Fideto. Tous droits réservés.</span>
          <span>Une fidélité plus simple, pour tout le monde.</span>
        </div>
      </div>
    </footer>
  );
}
