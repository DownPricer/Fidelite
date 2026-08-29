"use client";

import { usePathname } from "next/navigation";
import { AppNav } from "@/components/app-nav";
import { cn } from "@/components/ui";

export default function DashboardLayout({ children, admin }: { children: React.ReactNode; admin: boolean }) {
  const pathname = usePathname();
  const isCaisse = pathname === "/app/caisse";
  const isLogin = pathname === "/app/connexion";
  const showShell = !isCaisse && !isLogin;

  return (
    <div className="min-h-dvh bg-[var(--app-shell)]">
      {showShell && <AppNav admin={admin} />}
      <div className={cn(showShell && "lg:pl-64")}>
        {showShell ? (
          <div className="mx-auto max-w-7xl px-4 py-4 pb-24 lg:px-8 lg:py-8 lg:pb-8">
            <div className="min-h-[calc(100dvh-2rem)] rounded-2xl border border-[var(--border)] bg-[var(--panel-bg)] text-[var(--panel-text)] shadow-sm">
              {children}
            </div>
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  );
}
