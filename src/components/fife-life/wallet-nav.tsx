"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/components/ui";

const items = [
  { href: "/carte", label: "Portefeuille" },
  { href: "/carte?sheet=1", label: "Cartes" },
  { href: "/carte/identite", label: "Activité" },
  { href: "/compte", label: "Compte" },
];

export function WalletNav() {
  const pathname = usePathname();

  return (
    <nav className="glass-nav mx-auto flex w-full max-w-[334px] items-center justify-between px-5 py-2.5">
      {items.map((item) => {
        const active =
          item.href === "/carte"
            ? pathname === "/carte"
            : item.href.startsWith("/carte/identite")
              ? pathname === "/carte/identite"
              : item.href.startsWith("/compte")
                ? pathname === "/compte"
                : false;
        return (
          <Link
            key={item.label}
            href={item.href}
            className={cn(
              "flex flex-col items-center gap-1 text-[10px] font-semibold tracking-wide transition-opacity",
              active ? "text-[var(--ink)] opacity-100" : "text-[var(--muted)] opacity-70 hover:opacity-90",
            )}
          >
            <span
              className={cn(
                "h-3.5 w-3.5 rounded-full",
                active
                  ? "bg-[radial-gradient(circle_at_30%_20%,#c4b5ff,#8557ff)] shadow-[0_0_12px_rgba(133,87,255,0.55)]"
                  : "bg-[rgba(120,110,180,0.45)]",
              )}
            />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
