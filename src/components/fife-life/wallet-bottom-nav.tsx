"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { cn } from "@/components/ui";
import { useSponsoredAvailable } from "./use-sponsored-available";

const items = [
  { href: "/carte", label: "Portefeuille", match: (path: string, sheet: boolean) => path === "/carte" && !sheet && !path.startsWith("/carte/avantages") },
  { href: "/carte/avantages", label: "Avantages", match: (path: string) => path === "/carte/avantages", badgePlacement: "WALLET_HOME" as const },
  { href: "/carte?sheet=1", label: "Cartes", match: (_path: string, sheet: boolean) => sheet },
  { href: "/carte/identite", label: "Activité", match: (path: string) => path === "/carte/identite" },
  { href: "/compte", label: "Compte", match: (path: string) => path === "/compte" },
];

export function WalletBottomNav({ demo = false }: { demo?: boolean }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const sheetOpen = searchParams.get("sheet") === "1";
  const sponsoredOnAvantages = useSponsoredAvailable("WALLET_HOME", !demo);

  return (
    <div className="wallet-bottom-nav-wrap lg:hidden" data-testid="wallet-bottom-nav">
      <nav className="glass-nav flex w-full max-w-[360px] items-center justify-between px-3 py-2.5" aria-label="Navigation Wallet">
        {items.map((item) => {
          const active = item.match(pathname, sheetOpen);
          const href = demo && item.href.startsWith("/carte") ? `${item.href}${item.href.includes("?") ? "&" : "?"}demo=1` : item.href;
          const showBadge = item.badgePlacement && sponsoredOnAvantages;
          return (
            <Link
              key={item.label}
              href={href}
              className={cn(
                "relative flex min-w-0 flex-1 flex-col items-center gap-0.5 px-0.5 text-[9px] font-semibold tracking-wide transition-opacity",
                active ? "text-[var(--ink)] opacity-100" : "text-[var(--muted)] opacity-70 hover:opacity-90",
              )}
            >
              <span className="relative grid h-3.5 w-3.5 place-items-center">
                <span
                  className={cn(
                    "h-3.5 w-3.5 rounded-full",
                    active
                      ? "bg-[radial-gradient(circle_at_30%_20%,#c4b5ff,#8557ff)] shadow-[0_0_12px_rgba(133,87,255,0.55)]"
                      : "bg-[rgba(120,110,180,0.45)]",
                  )}
                />
                {showBadge ? (
                  <span
                    className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-[#e5484d] ring-2 ring-[light-dark(#fff,#0f0a1d)]"
                    aria-hidden
                    data-testid="avantages-sponsored-badge"
                  />
                ) : null}
              </span>
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
