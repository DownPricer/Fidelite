"use client";

import { usePathname } from "next/navigation";
import { AppNav } from "@/components/app-nav";
import { cn } from "@/components/ui";

export default function DashboardLayout({ children, admin }: { children: React.ReactNode; admin: boolean }) {
  const pathname = usePathname();
  const isLogin = pathname === "/app/connexion";
  const showShell = !isLogin;

  return (
    <div className="obsidian-scene min-h-dvh text-[var(--ink-soft)]">
      {showShell && <AppNav admin={admin} />}
      <div className={cn(showShell && "lg:pl-64")}>
        {showShell ? <div className="min-h-dvh pb-[calc(4.5rem+env(safe-area-inset-bottom))] lg:pb-0">{children}</div> : children}
      </div>
    </div>
  );
}
