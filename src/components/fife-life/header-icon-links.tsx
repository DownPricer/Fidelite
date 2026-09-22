"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

/** Icône Recherche/Découvrir (Partie 3) — ouvre la page de découverte des commerces. */
export function DiscoverIconLink({ href = "/decouvrir" }: { href?: string }) {
  return (
    <Link href={href} aria-label="Rechercher et découvrir des commerces" className="settings-btn-glassy relative z-50 grid h-9 w-9 place-items-center rounded-full">
      <svg viewBox="0 0 24 24" width={18} height={18} fill="none" stroke="currentColor" strokeWidth="2.2">
        <circle cx="11" cy="11" r="7" />
        <path d="M20 20l-3.5-3.5" strokeLinecap="round" />
      </svg>
    </Link>
  );
}

/** Rafraîchit toutes les 45 s le temps que le badge reste monté ; pas de système temps réel disponible. */
const UNREAD_POLL_INTERVAL_MS = 45_000;

/** Cloche Notifications avec badge non lu (Partie 3/5). */
export function NotificationBellLink({ href = "/notifications", demo = false }: { href?: string; demo?: boolean }) {
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (demo) {
      setUnreadCount(2);
      return;
    }
    let cancelled = false;
    const fetchUnread = () => {
      void fetch("/api/customer/notifications", { cache: "no-store" })
        .then((r) => (r.ok ? r.json() : null))
        .then((data: { unreadCount?: number } | null) => {
          if (!cancelled && data && typeof data.unreadCount === "number") {
            setUnreadCount(data.unreadCount);
          }
        })
        .catch(() => {});
    };
    fetchUnread();
    const onVisible = () => {
      if (document.visibilityState === "visible") fetchUnread();
    };
    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener("focus", fetchUnread);
    const interval = window.setInterval(() => {
      if (document.visibilityState === "visible") fetchUnread();
    }, UNREAD_POLL_INTERVAL_MS);
    return () => {
      cancelled = true;
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("focus", fetchUnread);
      window.clearInterval(interval);
    };
  }, [demo]);

  return (
    <Link
      href={href}
      aria-label={unreadCount > 0 ? `Notifications, ${unreadCount} non lues` : "Notifications"}
      className="settings-btn-glassy relative z-50 grid h-9 w-9 place-items-center rounded-full"
    >
      <svg viewBox="0 0 24 24" width={18} height={18} fill="none" stroke="currentColor" strokeWidth="2.2">
        <path d="M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M13.73 21a2 2 0 01-3.46 0" strokeLinecap="round" />
      </svg>
      {unreadCount > 0 ? (
        <span className="absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-[var(--violet-bright)] px-1 text-[9px] font-bold text-white">
          {unreadCount > 9 ? "9+" : unreadCount}
        </span>
      ) : null}
    </Link>
  );
}
