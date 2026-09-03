"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "./ui";

const icons = {
  home: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="h-5 w-5">
      <path d="M3 10.5L12 4l9 6.5V20a1 1 0 01-1 1h-5v-6H9v6H4a1 1 0 01-1-1v-9.5z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  scan: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="h-5 w-5">
      <path d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  clients: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="h-5 w-5">
      <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  team: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="h-5 w-5">
      <path d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  settings: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="h-5 w-5">
      <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
};

function isActive(pathname: string, href: string) {
  if (href === "/app") return pathname === "/app";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AppNav({ admin }: { admin: boolean }) {
  const pathname = usePathname();
  if (pathname === "/app/connexion") return null;

  const links = admin
    ? [
        { href: "/app", label: "Accueil", icon: icons.home },
        { href: "/app/caisse", label: "Caisse", icon: icons.scan, emphasize: true },
        { href: "/app/clients", label: "Clients", icon: icons.clients },
        { href: "/app/employes", label: "Équipe", icon: icons.team },
        { href: "/app/parametres", label: "Réglages", icon: icons.settings },
      ]
    : [{ href: "/app/caisse", label: "Caisse", icon: icons.scan, emphasize: true }];

  return (
    <>
      <aside className="merchant-sidebar hidden lg:flex">
        <div className="flex h-16 items-center border-b border-white/10 px-6">
          <Link href={admin ? "/app" : "/app/caisse"} className="flex items-center gap-3 font-bold tracking-tighter text-[var(--ink)]">
            <span className="merchant-brand-mark">FL</span>
            <span className="text-lg">Fife Life</span>
          </Link>
        </div>
        <nav className="flex-1 space-y-1 px-3 py-4">
          {links.map((link) => {
            const active = isActive(pathname, link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "merchant-sidebar-link",
                  link.emphasize && "merchant-sidebar-link-caisse",
                  active && "merchant-sidebar-link-active",
                )}
              >
                {link.icon}
                {link.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      <nav className="merchant-bottom-nav lg:hidden" aria-label="Navigation commerçant">
        {links.map((link) => {
          const active = isActive(pathname, link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "merchant-bottom-nav-item",
                link.emphasize && "merchant-bottom-nav-caisse",
                active && "merchant-bottom-nav-active",
              )}
            >
              {link.icon}
              <span>{link.label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
