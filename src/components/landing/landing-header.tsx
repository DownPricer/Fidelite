import Link from "next/link";
import { BrandMark } from "@/components/ui";
import { LandingMobileNav } from "@/components/landing/landing-mobile-nav";
import { LANDING_NAV_LINKS, MERCHANT_PROGRAM_HREF } from "@/components/landing/landing-nav-config";
import { ThemeToggle } from "@/components/landing/theme-toggle";

function isInternalRoute(href: string) {
  return href.startsWith("/");
}

const SECONDARY_CTA =
  "inline-flex min-h-[44px] items-center justify-center rounded-[14px] border border-[var(--fh-border)] bg-[var(--fh-surface)] px-4.5 text-sm font-bold text-[var(--fh-text)] shadow-[0_8px_28px_rgba(30,18,45,0.06)] transition hover:opacity-90";

const PRIMARY_CTA =
  "inline-flex min-h-[44px] items-center justify-center rounded-[14px] px-4.5 text-sm font-bold text-white shadow-[0_12px_30px_rgba(124,58,237,0.28)] transition hover:opacity-95";

export function LandingHeader({ clientHref }: { clientHref: string }) {
  return (
    <header className="sticky top-0 z-50 border-b border-[var(--fh-border)] bg-[var(--fh-bg)]/90 backdrop-blur-xl">
      <div className="mx-auto flex h-[76px] w-full max-w-[1180px] items-center justify-between gap-6 px-5">
        <Link href="/" aria-label="Fideto — accueil">
          <BrandMark className="scale-90" />
        </Link>

        <nav aria-label="Navigation principale" className="hidden items-center gap-6 text-sm font-semibold text-[var(--fh-muted)] lg:flex">
          {LANDING_NAV_LINKS.map((link) =>
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
          <div className="hidden items-center gap-2.5 lg:flex">
            <Link href={clientHref} className={SECONDARY_CTA}>
              Se connecter
            </Link>
            <Link
              href={MERCHANT_PROGRAM_HREF}
              className={PRIMARY_CTA}
              style={{ background: "linear-gradient(135deg, #7c3aed, #a855f7)" }}
            >
              Créer mon programme
            </Link>
          </div>
          <div className="lg:hidden">
            <LandingMobileNav clientHref={clientHref} />
          </div>
        </div>
      </div>
    </header>
  );
}
