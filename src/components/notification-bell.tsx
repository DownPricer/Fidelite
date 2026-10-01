"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

type BellItem = { id: string; message: string; createdAt: string; readAt: string | null; href: string };

function formatWhen(iso: string) {
  return new Date(iso).toLocaleString("fr-FR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
}

/**
 * Cloche de notifications persistantes (espace commerçant et super-admin) : compteur de non lues,
 * messages courts datés, lien direct vers la campagne, marquage « lu » enregistré côté serveur
 * (donc conservé après reconnexion). L'historique complet reste sur la fiche de la campagne.
 */
export function NotificationBell({ endpoint, className = "" }: { endpoint: string; className?: string }) {
  const [unread, setUnread] = useState(0);
  const [items, setItems] = useState<BellItem[]>([]);
  const [open, setOpen] = useState(false);
  const [failed, setFailed] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

  const load = useCallback(async () => {
    try {
      const res = await fetch(endpoint, { cache: "no-store" });
      if (!res.ok) throw new Error();
      const data = (await res.json()) as { unread: number; items: BellItem[] };
      setUnread(data.unread);
      setItems(data.items);
      setFailed(false);
    } catch {
      setFailed(true);
    }
  }, [endpoint]);

  useEffect(() => {
    void load();
    const timer = window.setInterval(() => void load(), 60_000);
    return () => window.clearInterval(timer);
  }, [load]);

  useEffect(() => {
    if (!open) return;
    function onDown(event: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  async function mark(body: { ids?: string[]; all?: boolean }) {
    try {
      await fetch(endpoint, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    } catch {
      // Le marquage sera retenté au prochain clic ; l'affichage se resynchronise ci-dessous.
    }
    void load();
  }

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={unread > 0 ? `Notifications, ${unread} non lue${unread > 1 ? "s" : ""}` : "Notifications"}
        aria-expanded={open}
        data-testid="notification-bell"
        className="relative grid h-10 w-10 place-items-center rounded-full border border-[var(--border)] bg-[var(--surface)] text-[var(--ink)]"
      >
        <svg viewBox="0 0 24 24" width={20} height={20} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 8a6 6 0 1112 0c0 7 3 9 3 9H3s3-2 3-9" />
          <path d="M10.3 21a1.94 1.94 0 003.4 0" />
        </svg>
        {unread > 0 ? (
          <span
            data-testid="notification-count"
            className="absolute -right-1 -top-1 grid min-w-[18px] place-items-center rounded-full bg-[var(--danger,#e5484d)] px-1 text-[10px] font-black leading-[18px] text-white"
          >
            {unread > 99 ? "99+" : unread}
          </span>
        ) : null}
      </button>

      {open ? (
        <div
          role="dialog"
          aria-label="Notifications"
          className="absolute right-0 z-50 mt-2 w-[min(22rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--canvas,#fff)] shadow-xl"
        >
          <div className="flex items-center justify-between border-b border-[var(--border)] px-4 py-3">
            <p className="text-sm font-black text-[var(--ink)]">Notifications</p>
            {unread > 0 ? (
              <button type="button" onClick={() => void mark({ all: true })} className="text-xs font-bold text-[var(--violet-bright)]">
                Tout marquer comme lu
              </button>
            ) : null}
          </div>
          <ul className="max-h-80 overflow-y-auto">
            {items.length === 0 ? (
              <li className="px-4 py-6 text-center text-sm text-[var(--muted)]">{failed ? "Chargement impossible." : "Aucune notification."}</li>
            ) : (
              items.map((item) => (
                <li key={item.id} className="border-b border-[var(--border)] last:border-b-0">
                  <Link
                    href={item.href}
                    onClick={() => {
                      setOpen(false);
                      if (!item.readAt) void mark({ ids: [item.id] });
                    }}
                    className={`block px-4 py-3 text-left ${item.readAt ? "" : "bg-[var(--surface)]"}`}
                  >
                    <span className="flex items-start gap-2">
                      {!item.readAt ? <span aria-hidden className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[var(--violet-bright)]" /> : null}
                      <span className="min-w-0">
                        <span className={`block text-sm text-[var(--ink)] ${item.readAt ? "" : "font-bold"}`}>{item.message}</span>
                        <span className="mt-0.5 block text-[11px] text-[var(--muted)]">{formatWhen(item.createdAt)}</span>
                      </span>
                    </span>
                  </Link>
                </li>
              ))
            )}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
