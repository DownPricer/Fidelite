"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { MenuIcon, XIcon } from "@/components/landing/icons";
import { LANDING_NAV_LINKS, MERCHANT_PROGRAM_HREF } from "@/components/landing/landing-nav-config";

function isInternalRoute(href: string) {
  return href.startsWith("/");
}

const PRIMARY_BTN =
  "inline-flex min-h-[44px] flex-1 items-center justify-center rounded-[14px] px-3 text-center text-[13px] font-bold leading-tight text-white shadow-[0_12px_30px_rgba(124,58,237,0.28)] transition hover:opacity-95 sm:text-sm";
const SECONDARY_BTN =
  "inline-flex min-h-[44px] flex-1 items-center justify-center rounded-[14px] border border-[var(--fh-border)] bg-[var(--fh-surface)] px-3 text-center text-[13px] font-bold leading-tight text-[var(--fh-text)] transition hover:opacity-90 sm:text-sm";

export function LandingMobileNav({ clientHref }: { clientHref: string }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  return (
    <div className="flex items-center gap-2">
      <Link
        href={clientHref}
        className="text-sm font-bold text-[var(--fh-muted)] transition hover:text-[var(--fh-text)] max-[380px]:hidden"
      >
        Voir mes cartes
      </Link>

      <button
        type="button"
        className="inline-flex h-11 w-11 items-center justify-center rounded-[14px] border border-[var(--fh-border)] bg-[var(--fh-surface)] text-[var(--fh-text)] transition hover:opacity-90"
        aria-expanded={open}
        aria-controls="landing-mobile-menu"
        aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
        onClick={() => setOpen((value) => !value)}
      >
        {open ? <XIcon className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
      </button>

      {open ? (
        <div className="fixed inset-0 z-[60] lg:hidden" role="presentation">
          <button
            type="button"
            className="absolute inset-0 bg-[rgba(15,10,22,0.45)] backdrop-blur-[2px]"
            aria-label="Fermer le menu"
            onClick={() => setOpen(false)}
          />
          <div
            id="landing-mobile-menu"
            className="absolute right-0 top-0 flex max-h-[min(88dvh,520px)] w-[min(100%,22rem)] flex-col border-l border-[var(--fh-border)] bg-[var(--fh-bg)] shadow-[0_24px_60px_rgba(30,18,45,0.18)]"
          >
            <div className="flex items-center justify-between border-b border-[var(--fh-border)] px-5 py-4">
              <p className="text-sm font-extrabold text-[var(--fh-text)]">Menu</p>
              <button
                type="button"
                className="inline-flex h-10 w-10 items-center justify-center rounded-[12px] border border-[var(--fh-border)] bg-[var(--fh-surface)]"
                aria-label="Fermer le menu"
                onClick={() => setOpen(false)}
              >
                <XIcon className="h-5 w-5" />
              </button>
            </div>

            <nav aria-label="Navigation mobile" className="flex-1 overflow-y-auto px-5 py-4">
              <ul className="space-y-1 text-sm font-semibold text-[var(--fh-muted)]">
                {LANDING_NAV_LINKS.map((link) => (
                  <li key={link.href}>
                    {isInternalRoute(link.href) ? (
                      <Link
                        href={link.href}
                        className="block rounded-[12px] px-3 py-2.5 transition hover:bg-[var(--fh-surface)] hover:text-[var(--fh-text)]"
                        onClick={() => setOpen(false)}
                      >
                        {link.label}
                      </Link>
                    ) : (
                      <a
                        href={link.href}
                        className="block rounded-[12px] px-3 py-2.5 transition hover:bg-[var(--fh-surface)] hover:text-[var(--fh-text)]"
                        onClick={() => setOpen(false)}
                      >
                        {link.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </nav>

            <div className="border-t border-[var(--fh-border)] px-5 py-4">
              <div className="flex gap-2">
                <Link href={clientHref} className={SECONDARY_BTN} onClick={() => setOpen(false)}>
                  Voir mes cartes
                </Link>
                <Link
                  href={MERCHANT_PROGRAM_HREF}
                  className={PRIMARY_BTN}
                  style={{ background: "linear-gradient(135deg, #7c3aed, #a855f7)" }}
                  onClick={() => setOpen(false)}
                >
                  Créer mon programme
                </Link>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
