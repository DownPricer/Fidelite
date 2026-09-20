import Link from "next/link";
import { BrandMark } from "@/components/ui";
import { ThemeToggle } from "@/components/landing/theme-toggle";

const NAV_LINKS = [
  { href: "#clients", label: "Pour les clients" },
  { href: "#commercants", label: "Pour les commerçants" },
  { href: "#fonctionnement", label: "Comment ça marche" },
  { href: "#avantages", label: "Pourquoi Fidelo" },
  { href: "#faq", label: "FAQ" },
] as const;

export function LandingHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-[light-dark(rgba(122,69,242,0.1),rgba(255,255,255,0.08))] bg-[light-dark(rgba(248,246,252,0.82),rgba(9,9,17,0.78))] backdrop-blur-xl">
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between gap-6 px-6">
        <Link href="/" aria-label="Fidelo — accueil">
          <BrandMark />
        </Link>

        <nav aria-label="Navigation principale" className="hidden items-center gap-7 lg:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-semibold text-[var(--muted-strong)] transition hover:text-[var(--ink)]"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link
            href="/connexion"
            className="hidden items-center justify-center rounded-full border border-[light-dark(rgba(122,69,242,0.2),rgba(255,255,255,0.14))] bg-[light-dark(rgba(255,255,255,0.7),rgba(255,255,255,0.05))] px-5 py-2.5 text-sm font-semibold text-[var(--ink)] transition hover:bg-[light-dark(rgba(255,255,255,0.9),rgba(255,255,255,0.09))] sm:inline-flex"
          >
            Se connecter
          </Link>
          <a href="#parcours" className="glass-cta px-5 py-2.5 text-sm">
            Découvrir Fidelo
          </a>
        </div>
      </div>
    </header>
  );
}
