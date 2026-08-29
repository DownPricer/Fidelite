"use client";

import { usePathname } from "next/navigation";
import { AppNav } from "@/components/app-nav";
import { cn } from "@/components/ui";

export default function DashboardLayout({ children, admin }: { children: React.ReactNode, admin: boolean }) {
  const pathname = usePathname();
  const isCaisse = pathname === "/app/caisse";

  return (
    <div className="min-h-dvh bg-surface">
      {!isCaisse && <AppNav admin={admin} />}
      <div className={cn(!isCaisse && "lg:pl-64")}>
        {children}
      </div>
    </div>
  );
}
