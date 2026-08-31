"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "./ui";

const scanIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-5 w-5">
    <path d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export function AppNav({ admin }: { admin: boolean }) {
  const pathname = usePathname();

  const links = [
    { href: "/app/caisse", label: "Caisse", highlight: true, icon: scanIcon },
    ...(admin
      ? [
          {
            href: "/app",
            label: "Tableau de bord",
            icon: (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-5 w-5">
                <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            ),
          },
          {
            href: "/app/clients",
            label: "Clients",
            icon: (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-5 w-5">
                <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            ),
          },
          {
            href: "/app/employes",
            label: "Équipe",
            icon: (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-5 w-5">
                <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            ),
          },
          {
            href: "/app/parametres",
            label: "Réglages",
            icon: (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-5 w-5">
                <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            ),
          },
        ]
      : []),
  ];

  if (pathname === "/app/caisse") return null;

  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col bg-[var(--sidebar)] lg:flex">
        <div className="flex h-16 items-center border-b border-white/10 px-6">
          <Link href={admin ? "/app" : "/app/caisse"} className="flex items-center gap-3 font-bold tracking-tighter text-[var(--sidebar-foreground)]">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-[radial-gradient(circle_at_0%_0%,#b86cff,#4c228c)] text-[var(--ink)] shadow-lg shadow-black/70 ring-1 ring-[var(--stroke-strong)]">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="h-5 w-5">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <span className="text-lg">Fife Life</span>
          </Link>
        </div>
        <nav className="flex-1 space-y-1 px-3 py-4">
          {links.map((link) => {
            const active = pathname === link.href;
            const isCaisseLink = link.href === "/app/caisse";
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-bold transition-all",
                  isCaisseLink
                    ? active
                      ? "bg-[var(--violet)] text-[var(--ink)] shadow-lg shadow-black/70 ring-1 ring-[var(--stroke-strong)]"
                      : "bg-[rgba(135,91,255,0.16)] text-[var(--violet-bright)] ring-1 ring-[var(--stroke-strong)]/60 hover:bg-[rgba(135,91,255,0.24)]"
                    : active
                      ? "bg-[rgba(255,255,255,0.04)] text-[var(--ink)]"
                      : "text-[var(--sidebar-muted)] hover:bg-[rgba(255,255,255,0.02)] hover:text-[var(--sidebar-foreground)]",
                )}
              >
                {link.icon}
                {link.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      <nav className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around border-t border-white/10 bg-[var(--sidebar)] px-2 py-2 lg:hidden">
        {links.map((link) => {
          const active = pathname === link.href;
          const isCaisseLink = link.href === "/app/caisse";
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex flex-col items-center gap-1 rounded-xl px-3 py-2 text-[10px] font-bold uppercase tracking-widest transition-all",
                isCaisseLink
                  ? active
                    ? "bg-[var(--violet)] text-[var(--ink)]"
                    : "bg-[rgba(135,91,255,0.18)] text-[var(--violet-bright)] ring-1 ring-[var(--stroke-strong)]/60"
                  : active
                    ? "text-white"
                    : "text-[var(--sidebar-muted)]",
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
