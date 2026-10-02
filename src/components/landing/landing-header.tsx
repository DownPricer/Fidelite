import Link from "next/link";
import { BrandMark } from "@/components/ui";
import { ThemeToggle } from "@/components/landing/theme-toggle";

const NAV_LINKS = [
  { href: "#fonctionnement", label: "Comment ça marche" },
  { href: "#commercants", label: "Commerçants" },
  { href: "/tarifs", label: "Tarifs" },
  { href: "#avantages", label: "Pourquoi Fideto" },
  { href: "#faq", label: "FAQ" },
] as const;

function isInternalRoute(href: string) {
  return href.startsWith("/");
}

export function LandingHeader({ clientHref }: { clientHref: string; proHref?: string }) {
  return (
    <header className="sticky top-0 z-50 border-b border-[var(--fh-border)] bg-[var(--fh-bg)]/90 backdrop-blur-xl">
      <div className="mx-auto flex h-[76px] w-full max-w-[1180px] items-center justify-between gap-6 px-5">
        <Link href="/" aria-label="Fideto — accueil">
          <BrandMark className="scale-90" />
        </Link>

        <nav aria-label="Navigation principale" className="hidden items-center gap-6 text-sm font-semibold text-[var(--fh-muted)] lg:flex">
          {NAV_LINKS.map((link) =>
            isInternalRoute(link.href) ? (
              <Link key={link.href} href={link.href} className="transition hover:text-[var(--fh-text)]">
                {link.label}
              </Link>
            ) : (
              <a key={link.href} href={link.href} className="transition hover:text-[var(--fh-text)]">
                {link.label}
              </a>
            ),
          )}
        </nav>

        <div className="flex items-center gap-2.5">
          <ThemeToggle />
          <Link
            href={clientHref}
            className="inline-flex min-h-[44px] items-center justify-center rounded-[14px] px-4.5 text-sm font-bold text-white shadow-[0_12px_30px_rgba(124,58,237,0.28)] transition hover:opacity-95"
            style={{ background: "linear-gradient(135deg, #7c3aed, #a855f7)" }}
          >
            Se connecter
          </Link>
        </div>
      </div>
    </header>
  );
}
