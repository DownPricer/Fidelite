"use client";

import { useEffect, useRef, useState } from "react";
import { SponsoredBanner, type SponsoredAd, type SponsoredVariant } from "./sponsored-banner";

export type SponsoredPlacement = "WALLET_HOME" | "SEARCH" | "NOTIFICATIONS";

const VARIANT_BY_PLACEMENT: Record<SponsoredPlacement, SponsoredVariant> = {
  WALLET_HOME: "home",
  SEARCH: "search",
  NOTIFICATIONS: "notifications",
};

/** Délai de visibilité continue avant de compter une impression (évite les passages éclairs). */
const VISIBLE_MS = 1000;
/** Garde de session : un même bandeau n'est annoncé qu'une fois par chargement de l'application, quels que soient les rendus. */
const reportedThisSession = new Set<string>();

/**
 * Emplacement de bandeau « Sponsorisé » (accueil Wallet, recherche, notifications) : le serveur
 * décide s'il y a quelque chose à montrer (éligibilité + fréquence, voir sponsored-selection.ts) ;
 * ce composant affiche la carte et compte l'impression quand elle est réellement visible
 * (≥ 50 % à l'écran, onglet actif, pendant 1 s) — jamais au simple rendu React. Il ne crée
 * aucune notification push, e-mail ni entrée de notification : c'est une carte intégrée.
 */
export function SponsoredSlot({ placement, className }: { placement: SponsoredPlacement; className?: string }) {
  const [ad, setAd] = useState<(SponsoredAd & { placement: SponsoredPlacement }) | null>(null);
  const hostRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    fetch(`/api/customer/sponsored?placement=${placement}`, { signal: controller.signal, cache: "no-store" })
      .then((r) => (r.ok ? r.json() : { ad: null }))
      .then((data: { ad: (SponsoredAd & { placement: SponsoredPlacement }) | null }) => setAd(data.ad ?? null))
      .catch(() => undefined);
    return () => controller.abort();
  }, [placement]);

  useEffect(() => {
    const node = hostRef.current;
    if (!ad || !node || typeof IntersectionObserver === "undefined") return;
    const key = `${placement}:${ad.id}`;
    if (reportedThisSession.has(key)) return;
    let timer: number | null = null;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.some((e) => e.isIntersecting && e.intersectionRatio >= 0.5) && document.visibilityState === "visible";
        if (timer !== null) {
          window.clearTimeout(timer);
          timer = null;
        }
        if (!visible) return;
        timer = window.setTimeout(() => {
          if (reportedThisSession.has(key)) return;
          reportedThisSession.add(key);
          observer.disconnect();
          void fetch(ad.impressionUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ placement }),
          }).catch(() => reportedThisSession.delete(key));
        }, VISIBLE_MS);
      },
      { threshold: [0, 0.5, 1] },
    );
    observer.observe(node);
    return () => {
      if (timer !== null) window.clearTimeout(timer);
      observer.disconnect();
    };
  }, [ad, placement]);

  if (!ad) return null;
  return (
    <div ref={hostRef} className={className} data-testid={`sponsored-slot-${placement}`}>
      <SponsoredBanner ad={ad} variant={VARIANT_BY_PLACEMENT[placement]} />
    </div>
  );
}
