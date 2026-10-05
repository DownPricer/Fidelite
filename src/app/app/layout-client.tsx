"use client";

import { usePathname } from "next/navigation";
import { AppNav } from "@/components/app-nav";
import { cn } from "@/components/ui";
import { NotificationBell } from "@/components/notification-bell";

export default function DashboardLayout({
  children,
  admin,
  canViewStatistics,
  identity,
  showNotifications = false,
}: {
  children: React.ReactNode;
  admin: boolean;
  canViewStatistics: boolean;
  identity: { firstName: string; merchantName: string } | null;
  showNotifications?: boolean;
}) {
  const pathname = usePathname();
  const isLogin = pathname === "/app/connexion" || pathname === "/app/compte-commercant";
  const showShell = !isLogin;

  return (
    <div className="obsidian-scene obsidian-scene-root min-h-dvh text-[var(--ink-soft)]">
      {showShell && <AppNav admin={admin} canViewStatistics={canViewStatistics} identity={identity} />}
      <div className={cn(showShell && "md:pl-[var(--merchant-sidebar-w)]")}>
        {showShell && showNotifications ? (
          <header className="sticky top-0 z-40 flex items-center justify-end gap-3 px-4 py-2 md:px-8" data-testid="merchant-topbar">
            <NotificationBell endpoint="/api/merchant/notifications" />
          </header>
        ) : null}
        {showShell ? <div className="min-h-dvh pb-[calc(4.5rem+env(safe-area-inset-bottom))] md:pb-0">{children}</div> : children}
      </div>
    </div>
  );
}
