"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { cn } from "@/components/ui";

export function MerchantBackButton({ href }: { href?: string }) {
  const router = useRouter();
  return (
    <button
      type="button"
      onClick={() => (href ? router.push(href) : router.back())}
      className="merchant-back-btn"
      aria-label="Retour"
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-5 w-5">
        <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}

export function MerchantPageShell({
  children,
  narrow = false,
}: {
  children: ReactNode;
  narrow?: boolean;
}) {
  return <main className={cn("merchant-page-shell obsidian-scene", narrow && "merchant-page-shell-narrow")}>{children}</main>;
}

export function MerchantPageHeader({
  eyebrow,
  title,
  subtitle,
  backHref,
  action,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  backHref?: string;
  action?: ReactNode;
}) {
  return (
    <header className="merchant-page-header mb-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="flex min-w-0 items-start gap-3">
          {backHref !== undefined ? <MerchantBackButton href={backHref} /> : null}
          <div className="min-w-0 flex-1">
            {eyebrow ? (
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--muted)]">{eyebrow}</p>
            ) : null}
            <h1 className="mt-0.5 text-2xl font-black tracking-tight text-[var(--ink)] sm:text-3xl">{title}</h1>
            {subtitle ? <p className="mt-1 text-sm text-[var(--muted-strong)]">{subtitle}</p> : null}
          </div>
        </div>
        {action ? <div className="flex shrink-0 flex-wrap items-center gap-2">{action}</div> : null}
      </div>
    </header>
  );
}

export function CompactListHeader({
  columns,
}: {
  columns: string[];
}) {
  const isFourCol = columns.length >= 4;
  return (
    <div className={cn("compact-list-header", isFourCol && "compact-list-header-4col")} aria-hidden>
      <span />
      <span>{columns[0]}</span>
      <span>{columns[1]}</span>
      {isFourCol ? (
        <>
          <span>{columns[2]}</span>
          <span className="compact-list-header-meta">{columns[3]}</span>
        </>
      ) : (
        <>
          <span className="compact-list-header-meta">{columns[2] ?? ""}</span>
        </>
      )}
      <span />
    </div>
  );
}

export function CompactListRow({
  href,
  onClick,
  avatar,
  title,
  subtitle,
  meta,
  desktopMeta,
  badge,
  desktopBadge,
  chevron = true,
}: {
  href?: string;
  onClick?: () => void;
  avatar: ReactNode;
  title: string;
  subtitle?: string;
  meta?: string;
  desktopMeta?: string;
  badge?: ReactNode;
  desktopBadge?: ReactNode;
  chevron?: boolean;
}) {
  const desktopSecondary = desktopMeta ?? subtitle;
  const isFourCol = Boolean(desktopBadge);
  const inner = (
    <>
      <div className="compact-row-avatar">{avatar}</div>
      <div className="compact-row-main min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate text-[15px] font-bold text-[var(--ink)]">{title}</p>
          {badge ? <span className={cn("compact-row-badge-inline shrink-0", isFourCol && "md:hidden")}>{badge}</span> : null}
        </div>
        {subtitle ? <p className="compact-row-sub-mobile truncate text-xs text-[var(--muted)]">{subtitle}</p> : null}
      </div>
      {subtitle ? <p className="compact-row-col compact-row-sub-desktop truncate text-sm text-[var(--muted-strong)]">{subtitle}</p> : <span className="compact-row-col" />}
      {isFourCol && desktopBadge ? <div className="compact-row-col compact-row-badge-desktop">{desktopBadge}</div> : null}
      {(meta || desktopSecondary) ? (
        <p className="compact-row-col compact-row-meta truncate text-xs font-semibold text-[var(--muted-strong)]">{meta ?? desktopSecondary}</p>
      ) : (
        <span className="compact-row-col" />
      )}
      {chevron ? (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="compact-row-chevron h-4 w-4 shrink-0 text-[var(--muted)]">
          <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ) : (
        <span className="compact-row-chevron" />
      )}
    </>
  );

  const className = "compact-list-row";
  if (href) {
    return (
      <Link href={href} className={className}>
        {inner}
      </Link>
    );
  }
  return (
    <button type="button" onClick={onClick} className={cn(className, "w-full text-left")}>
      {inner}
    </button>
  );
}

export function InitialsAvatar({ name, size = "md" }: { name: string; size?: "sm" | "md" }) {
  const initials = name
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
  return (
    <span className={cn("initials-avatar", size === "sm" ? "initials-avatar-sm" : "initials-avatar-md")}>{initials}</span>
  );
}

export function CompactListShell({
  children,
  className,
  columns = 3,
  layout = "auto",
}: {
  children: ReactNode;
  className?: string;
  columns?: 3 | 4;
  layout?: "auto" | "stack";
}) {
  return (
    <div
      className={cn(
        "compact-list-shell",
        columns === 4 && "compact-list-shell-4col",
        layout === "stack" && "compact-list-shell-stacked",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function ListToolbar({
  search,
  onSearchChange,
  searchPlaceholder = "Rechercher…",
  filters,
  sort,
}: {
  search: string;
  onSearchChange: (v: string) => void;
  searchPlaceholder?: string;
  filters?: ReactNode;
  sort?: ReactNode;
}) {
  return (
    <div className="merchant-toolbar mb-4">
      <div className="merchant-search-wrap relative">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]">
          <circle cx="11" cy="11" r="7" />
          <path d="M20 20l-3-3" strokeLinecap="round" />
        </svg>
        <input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={searchPlaceholder}
          className="merchant-search-input"
        />
      </div>
      {(filters || sort) && (
        <div className="merchant-toolbar-filters">
          {filters}
          {sort}
        </div>
      )}
    </div>
  );
}

export function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button type="button" onClick={onClick} className={cn("merchant-filter-chip", active && "merchant-filter-chip-active")}>
      {children}
    </button>
  );
}

export function StatusBadge({ tone, children }: { tone: "ok" | "warn" | "muted" | "danger"; children: ReactNode }) {
  return <span className={cn("merchant-status-badge", `merchant-status-badge-${tone}`)}>{children}</span>;
}

export function EmptyState({ title, hint }: { title: string; hint?: string }) {
  return (
    <div className="merchant-empty-state">
      <p className="font-bold text-[var(--ink)]">{title}</p>
      {hint ? <p className="mt-1 text-sm text-[var(--muted)]">{hint}</p> : null}
    </div>
  );
}

export function TxTypeLabel({ type, delta }: { type: string; delta: number }) {
  const sign = delta > 0 ? "+" : delta < 0 ? "−" : "";
  const abs = Math.abs(delta);
  if (type === "REDEEM_REWARD") return <span className="tx-label tx-label-use">Récompense utilisée</span>;
  if (type === "CANCEL") return <span className="tx-label tx-label-cancel">Annulation</span>;
  if (type === "ADJUSTMENT") return <span className="tx-label tx-label-correct">{sign}{abs} · Correction</span>;
  return <span className="tx-label tx-label-earn">{sign}{abs} {delta === 1 || delta === -1 ? "passage" : "points/passages"}</span>;
}
