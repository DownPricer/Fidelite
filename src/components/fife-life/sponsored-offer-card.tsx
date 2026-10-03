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

/**
 * Bandeau compact aligné sur les lignes de cartes (sheet Avantages, Recherche, Notifications).
 */
export function SponsoredOfferCard({
  ad,
  variant = "search",
  onDismiss,
}: {
  ad: SponsoredAd;
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
      data-layout="compact"
      className="sponsored-offer-row group relative flex w-full items-center gap-3.5 text-left no-underline"
    >
      <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-xl bg-[rgba(0,0,0,0.25)]" aria-hidden={!showImage}>
        {!imageLoaded && showImage ? (
          <div className="absolute inset-0 animate-pulse bg-[rgba(180,120,70,0.15)]" data-testid="sponsored-image-skeleton" />
        ) : null}
        {showImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={ad.imageUrl!}
            alt=""
            className={`h-full w-full object-cover transition-opacity duration-200 ${imageLoaded ? "opacity-100" : "opacity-0"}`}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageFailed(true)}
          />
        ) : ad.merchantLogoUrl && !imageFailed ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={ad.merchantLogoUrl}
            alt=""
            className="h-full w-full object-cover"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <span className="grid h-full w-full place-items-center text-sm font-black text-[#e8d4bc]">
            {ad.merchantName.slice(0, 1).toUpperCase()}
          </span>
        )}
      </div>

      <div className="min-w-0 flex-1 pr-7">
        <div className="mb-0.5 flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-[rgba(196,150,90,0.35)] bg-[rgba(0,0,0,0.2)] px-2 py-0.5 text-[8px] font-bold uppercase tracking-[0.14em] text-[#e8d4bc]">
            Sponsorisé
          </span>
          <p className="truncate text-[11px] font-bold uppercase tracking-wide text-[#c9a87a]">{ad.merchantName}</p>
        </div>
        <p className="line-clamp-2 text-sm font-semibold leading-snug text-[#f5ebe0]">{ad.text}</p>
        <span className="mt-0.5 inline-flex items-center gap-1 text-xs font-semibold text-[#dcc4a8]">
          {ad.ctaLabel ?? "Découvrir"}
          <svg viewBox="0 0 24 24" width={13} height={13} fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden>
            <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </div>

      {onDismiss ? (
        <button
          type="button"
          aria-label="Masquer cette publicité"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onDismiss();
          }}
          className="absolute right-2.5 top-1/2 z-10 grid h-6 w-6 -translate-y-1/2 place-items-center rounded-full bg-[rgba(0,0,0,0.35)] text-[#f0e0cc] ring-1 ring-[rgba(196,150,90,0.25)]"
        >
          <svg viewBox="0 0 24 24" width={11} height={11} fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
          </svg>
        </button>
      ) : null}
    </a>
  );
}
