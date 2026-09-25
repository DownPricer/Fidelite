import Link from "next/link";
import { BrandMark } from "@/components/ui";
import { ThemeToggle } from "@/components/landing/theme-toggle";

const NAV_LINKS = [
  { href: "#fonctionnement", label: "Comment ça marche" },
  { href: "#commercants", label: "Commerçants" },
  { href: "#avantages", label: "Pourquoi Fideto" },
  { href: "#faq", label: "FAQ" },
] as const;

export function LandingHeader({ clientHref, proHref }: { clientHref: string; proHref: string }) {
  return (
    <header className="sticky top-0 z-50 border-b border-[var(--fh-border)] bg-[var(--fh-bg)]/90 backdrop-blur-xl">
      <div className="mx-auto flex h-[76px] w-full max-w-[1180px] items-center justify-between gap-6 px-5">
        <Link href="/" aria-label="Fideto — accueil">
          <BrandMark className="scale-90" />
        </Link>

        <nav aria-label="Navigation principale" className="hidden items-center gap-6 text-sm font-semibold text-[var(--fh-muted)] lg:flex">
          {NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href} className="transition hover:text-[var(--fh-text)]">
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2.5">
          <ThemeToggle />
          <Link
            href={clientHref}
            className="hidden min-h-[44px] items-center justify-center rounded-[14px] border border-[var(--fh-border)] bg-[var(--fh-surface)] px-4.5 text-sm font-bold text-[var(--fh-text)] shadow-[0_8px_28px_rgba(30,18,45,0.06)] transition hover:opacity-90 sm:inline-flex"
          >
            Se connecter
          </Link>
          <Link
            href={proHref}
            className="inline-flex min-h-[44px] items-center justify-center rounded-[14px] px-4.5 text-sm font-bold text-white shadow-[0_12px_30px_rgba(124,58,237,0.28)] transition hover:opacity-95"
            style={{ background: "linear-gradient(135deg, #7c3aed, #a855f7)" }}
          >
            Créer mon programme
          </Link>
        </div>
      </div>
    </header>
  );
}
