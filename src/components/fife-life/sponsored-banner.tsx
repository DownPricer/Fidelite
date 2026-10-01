"use client";

import { useState } from "react";

export type SponsoredAd = {
  id: string;
  merchantSlug: string;
  merchantName: string;
  merchantLogoUrl: string | null;
  imageUrl: string | null;
  text: string;
  ctaLabel: string | null;
  impressionUrl: string;
  clickUrl: string;
};

/**
 * Bandeau "Sponsorisé" réutilisable — Découvrir et tout autre emplacement client.
 * Fermable côté viewer uniquement (aucune préférence enregistrée côté serveur).
 */
export type SponsoredVariant = "search" | "home" | "notifications";

const IMAGE_CLASS: Record<SponsoredVariant, string> = {
  search: "h-14 w-14",
  home: "h-20 w-20",
  notifications: "h-12 w-12",
};

export function SponsoredBanner({
  ad,
  variant = "search",
  onDismiss,
}: {
  ad: SponsoredAd;
  variant?: SponsoredVariant;
  /**
   * Fermeture par la croix. Fournie par SponsoredSlot : la publicité est alors masquée pour toute
   * l'utilisation en cours de l'application (voir sponsored-slot.tsx) — jamais un refus définitif.
   * Sans onDismiss (aperçus), la croix ne masque que ce rendu.
   */
  onDismiss?: () => void;
}) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <a href={ad.clickUrl} data-variant={variant}
      className={`glass-panel profile-panel relative block overflow-hidden p-3 ${variant === "notifications" ? "border border-[var(--violet-bright)]/30" : ""}`}>
      <span className="absolute right-9 top-2 rounded-full bg-black/60 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white">
        Sponsorisé
      </span>
      <button
        type="button"
        aria-label="Masquer cette publicité"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (onDismiss) onDismiss();
          else setDismissed(true);
        }}
        className="absolute right-2 top-2 grid h-5 w-5 place-items-center rounded-full bg-black/60 text-white"
      >
        <svg viewBox="0 0 24 24" width={11} height={11} fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
        </svg>
      </button>
      <div className="flex items-center gap-3">
        {ad.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={ad.imageUrl} alt="" className={`${IMAGE_CLASS[variant]} shrink-0 rounded-xl object-cover`} />
        ) : null}
        <div className="min-w-0">
          <p className="truncate text-xs font-bold uppercase tracking-wide text-[var(--muted)]">{ad.merchantName}</p>
          <p className="text-sm font-semibold text-[var(--ink)]">{ad.text}</p>
          {ad.ctaLabel ? (
            <span className="mt-1 inline-block text-xs font-bold text-[var(--violet-bright)]">{ad.ctaLabel}</span>
          ) : null}
        </div>
      </div>
    </a>
  );
}
