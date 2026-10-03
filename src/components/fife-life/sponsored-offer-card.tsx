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
      className={`sponsored-offer-row sponsored-offer-row--${variant} group relative flex w-full max-w-full min-w-0 items-center text-left no-underline`}
    >
      <div className="sponsored-offer-thumb" aria-hidden={!showImage}>
        {!imageLoaded && showImage ? (
          <div className="sponsored-offer-thumb-skeleton" data-testid="sponsored-image-skeleton" />
        ) : null}
        {showImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={ad.imageUrl!}
            alt=""
            className={`sponsored-offer-thumb-img ${imageLoaded ? "is-loaded" : ""}`}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageFailed(true)}
          />
        ) : ad.merchantLogoUrl && !imageFailed ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={ad.merchantLogoUrl}
            alt=""
            className="sponsored-offer-thumb-img is-loaded"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <span className="sponsored-offer-thumb-fallback">{ad.merchantName.slice(0, 1).toUpperCase()}</span>
        )}
      </div>

      <div className="min-w-0 flex-1 pr-7">
        <div className="mb-0.5 flex flex-wrap items-center gap-2">
          <span className="sponsored-offer-badge">Sponsorisé</span>
          <p className="sponsored-offer-merchant truncate">{ad.merchantName}</p>
        </div>
        <p className="sponsored-offer-body line-clamp-2">{ad.text}</p>
        <span className="sponsored-offer-cta mt-0.5 inline-flex items-center gap-1">
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
          className="sponsored-offer-dismiss"
        >
          <svg viewBox="0 0 24 24" width={11} height={11} fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
          </svg>
        </button>
      ) : null}
    </a>
  );
}
