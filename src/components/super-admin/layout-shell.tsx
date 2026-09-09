"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/components/ui";

const NAV = [
  { href: "/super-admin", label: "Vue d'ensemble", icon: "M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" },
  { href: "/super-admin/commerces", label: "Commerces", icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" },
  { href: "/super-admin/commerces/nouveau", label: "Créer un commerce", icon: "M12 4v16m8-8H4" },
  { href: "/super-admin/cartes", label: "Cartes", icon: "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" },
  { href: "/super-admin/abonnements", label: "Abonnements", icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8V7m0 10v1" },
  { href: "/super-admin/contrats", label: "Contrats", icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" },
  { href: "/super-admin/statistiques", label: "Statistiques", icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" },
  { href: "/super-admin/audit", label: "Sécurité et audit", icon: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" },
];

export function SuperAdminShell({
  firstName,
  children,
}: {
  firstName: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  async function logout() {
    await fetch("/api/super-admin/auth/logout", { method: "POST" });
    window.location.href = "/super-admin/connexion";
  }

  return (
    <div className="min-h-dvh bg-[var(--void)] text-[var(--body-text)]">
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-64 flex-col border-r border-white/10 bg-[var(--sidebar)] lg:flex">
        <div className="flex h-16 items-center border-b border-white/5 px-6">
          <span className="text-lg font-bold tracking-tighter text-[var(--ink)]">
            Fife Life <span className="text-[10px] font-black uppercase tracking-widest text-[var(--violet-bright)]">Super</span>
          </span>
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-6">
          {NAV.map((item) => {
            const active = pathname === item.href || (item.href !== "/super-admin" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition",
                  active
                    ? "bg-[rgba(255,255,255,0.08)] text-[var(--ink)]"
                    : "text-[var(--ink-soft)] hover:bg-white/5 hover:text-[var(--ink)]",
                )}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5 shrink-0">
                  <path d={item.icon} strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-white/5 p-4">
          <button type="button" onClick={() => void logout()} className="w-full rounded-xl px-3 py-2 text-sm text-[var(--ink-soft)] hover:bg-white/5 hover:text-[var(--ink)]">
            Déconnexion
          </button>
        </div>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-10 border-b border-[var(--border)] bg-[var(--canvas)]/85 px-4 py-3 backdrop-blur-md sm:px-8">
          <div className="flex items-center justify-between gap-4">
            <div className="lg:hidden overflow-x-auto">
              <div className="flex gap-2 pb-1">
                {NAV.slice(0, 5).map((item) => (
                  <Link key={item.href} href={item.href} className="whitespace-nowrap rounded-full border border-white/10 px-3 py-1 text-xs font-semibold">
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
            <div className="ml-auto flex items-center gap-3">
              <div className="hidden text-right sm:block">
                <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted-text)]">Super-admin</p>
                <p className="text-sm font-bold text-[var(--panel-text)]">{firstName}</p>
              </div>
              <div className="grid h-9 w-9 place-items-center rounded-full bg-[var(--surface-strong)] text-xs font-bold text-[var(--ink-soft)]">
                {firstName.slice(0, 1)}
              </div>
            </div>
          </div>
        </header>
        <main className="px-4 py-6 sm:px-8 sm:py-8">{children}</main>
      </div>
    </div>
  );
}
