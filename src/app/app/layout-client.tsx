"use client";

import { usePathname } from "next/navigation";
import { AppNav } from "@/components/app-nav";
import { cn } from "@/components/ui";

export default function DashboardLayout({ children, admin }: { children: React.ReactNode; admin: boolean }) {
  const pathname = usePathname();
  const isCaisse = pathname.startsWith("/app/caisse");
  const isLogin = pathname === "/app/connexion";
  const showShell = !isCaisse && !isLogin;

  return (
    <div className="obsidian-scene min-h-dvh text-[var(--ink-soft)]">
      {showShell && <AppNav admin={admin} />}
      <div className={cn(showShell && "lg:pl-64")}>
        {showShell ? <div className="min-h-dvh pb-24 lg:pb-0">{children}</div> : children}
      </div>
    </div>
  );
}
