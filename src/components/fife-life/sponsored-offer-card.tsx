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
  impressionUrl: string | null;
  clickUrl: string;
};

export type SponsoredVariant = "search" | "home" | "notifications" | "avantages";

export type SponsoredOfferLayout = "feed" | "compact";

/**
 * Carte publicitaire Fideto (Avantages, Recherche) — visuellement distincte des cartes de fidélité.
 */
export function SponsoredOfferCard({
  ad,
  layout = "feed",
  variant = "search",
  onDismiss,
}: {
  ad: SponsoredAd;
  layout?: SponsoredOfferLayout;
  variant?: SponsoredVariant;
  onDismiss?: () => void;
}) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);
  const showImage = Boolean(ad.imageUrl) && !imageFailed;

  return (
    <a
      href={ad.clickUrl}
      data-testid="sponsored-offer-card"
      data-variant={variant}
      data-layout={layout}
      className="sponsored-offer-card group relative block overflow-hidden rounded-2xl border border-[rgba(190,120,255,0.45)] bg-[linear-gradient(145deg,rgba(72,38,120,0.55),rgba(28,16,48,0.92))] shadow-[0_12px_32px_rgba(0,0,0,0.35)] transition-transform active:scale-[0.99]"
    >
      <span className="absolute left-3 top-3 z-10 rounded-full border border-[rgba(255,180,240,0.35)] bg-[rgba(12,8,22,0.75)] px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.14em] text-[#f0d4ff]">
        Sponsorisé
      </span>
      {onDismiss ? (
        <button
          type="button"
          aria-label="Masquer cette publicité"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onDismiss();
          }}
          className="absolute right-2 top-2 z-10 grid h-6 w-6 place-items-center rounded-full bg-[rgba(12,8,22,0.8)] text-white/90 ring-1 ring-white/10"
        >
          <svg viewBox="0 0 24 24" width={11} height={11} fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
          </svg>
        </button>
      ) : null}

      <div className={layout === "feed" ? "flex flex-col" : "flex items-stretch gap-3 p-3 pt-10"}>
        <div
          className={
            layout === "feed"
              ? "relative aspect-[2.4/1] w-full shrink-0 bg-[rgba(255,255,255,0.06)]"
              : "relative h-[4.5rem] w-[4.5rem] shrink-0 overflow-hidden rounded-xl bg-[rgba(255,255,255,0.06)]"
          }
          aria-hidden={!showImage}
        >
          {!imageLoaded && showImage ? (
            <div className="absolute inset-0 animate-pulse bg-[rgba(190,120,255,0.12)]" data-testid="sponsored-image-skeleton" />
          ) : null}
          {showImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={ad.imageUrl!}
              alt=""
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-200 ${imageLoaded ? "opacity-100" : "opacity-0"}`}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageFailed(true)}
            />
          ) : (
            <div className="absolute inset-0 grid place-items-center text-lg font-black text-[var(--violet-bright)]">
              {ad.merchantLogoUrl && !imageFailed ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={ad.merchantLogoUrl}
                  alt=""
                  className="h-full w-full object-cover"
                  onError={() => setImageFailed(true)}
                />
              ) : (
                ad.merchantName.slice(0, 1).toUpperCase()
              )}
            </div>
          )}
        </div>

        <div className={layout === "feed" ? "flex items-center gap-3 px-3 py-3" : "min-w-0 flex-1 py-0.5"}>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[11px] font-bold uppercase tracking-[0.12em] text-[#d8b8ff]">{ad.merchantName}</p>
            <p className="mt-0.5 line-clamp-2 text-sm font-semibold leading-snug text-[var(--ink)]">{ad.text}</p>
            {ad.ctaLabel ? (
              <span className="mt-1.5 inline-flex items-center gap-1 text-xs font-bold text-[#e8c4ff]">
                {ad.ctaLabel}
                <svg viewBox="0 0 24 24" width={14} height={14} fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden>
                  <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            ) : (
              <span className="mt-1.5 inline-flex items-center gap-1 text-xs font-bold text-[#e8c4ff]">
                Découvrir
                <svg viewBox="0 0 24 24" width={14} height={14} fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden>
                  <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            )}
          </div>
        </div>
      </div>
    </a>
  );
}
