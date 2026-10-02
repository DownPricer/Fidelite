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
/**
 * Publicités fermées avec la croix pendant cette utilisation de l'application : masquées partout
 * (accueil, recherche, notifications) jusqu'à la fin de la session (sessionStorage = jusqu'à la
 * fermeture de l'application/de l'onglet). Aucune trace serveur : à la prochaine ouverture, si le
 * créneau est toujours actif et si la règle de fréquence le permet, la publicité peut réapparaître.
 */
const DISMISS_KEY = "fideto-sponsored-dismissed";
let dismissedThisSession: Set<string> | null = null;

export function getDismissedAds(): Set<string> {
  if (!dismissedThisSession) {
    dismissedThisSession = new Set();
    try {
      const raw = sessionStorage.getItem(DISMISS_KEY);
      if (raw) for (const id of JSON.parse(raw) as string[]) dismissedThisSession.add(id);
    } catch {
      // stockage indisponible (navigation privée…) : la mémoire du module suffit pour cette session
    }
  }
  return dismissedThisSession;
}

function rememberDismissed(id: string) {
  const set = getDismissedAds();
  set.add(id);
  try {
    sessionStorage.setItem(DISMISS_KEY, JSON.stringify([...set]));
  } catch {
    // ignore
  }
}

/** Réinitialise l'état de session (tests uniquement). */
export function resetSponsoredSessionState() {
  dismissedThisSession = null;
  reportedThisSession.clear();
}

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
  const [previewInfo, setPreviewInfo] = useState<{ simulated: boolean } | null>(null);
  const hostRef = useRef<HTMLDivElement | null>(null);
  // ?apercu=<id> : aperçu réservé (commerçant de la campagne / super-admin), jamais compté ni montré aux autres.
  const [previewId] = useState<string | null>(() => {
    try {
      return new URLSearchParams(window.location.search).get("apercu");
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (!previewId) return;
    const controller = new AbortController();
    fetch(`/api/customer/sponsored?placement=${placement}&preview=${encodeURIComponent(previewId)}`, { signal: controller.signal, cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((data: { ad: (SponsoredAd & { placement: SponsoredPlacement }) | null; simulated?: boolean } | null) => {
        setAd(data?.ad ?? null);
        setPreviewInfo(data?.ad ? { simulated: Boolean(data.simulated) } : null);
      })
      .catch(() => undefined);
    return () => controller.abort();
  }, [placement, previewId]);

  useEffect(() => {
    if (previewId) return;
    const controller = new AbortController();
    const exclude = [...getDismissedAds()].join(",");
    fetch(`/api/customer/sponsored?placement=${placement}${exclude ? `&exclude=${encodeURIComponent(exclude)}` : ""}`, {
      signal: controller.signal,
      cache: "no-store",
    })
      .then((r) => (r.ok ? r.json() : { ad: null }))
      .then((data: { ad: (SponsoredAd & { placement: SponsoredPlacement }) | null }) =>
        setAd(data.ad && !getDismissedAds().has(data.ad.id) ? data.ad : null),
      )
      .catch(() => undefined);
    return () => controller.abort();
  }, [placement]);

  useEffect(() => {
    const node = hostRef.current;
    if (previewId || !ad || !node || !ad.impressionUrl || typeof IntersectionObserver === "undefined") return;
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
  }, [ad, placement, previewId]);

  if (!ad) return null;
  return (
    <div ref={hostRef} className={className} data-testid={`sponsored-slot-${placement}`}>
      {previewInfo ? (
        <p className="mb-1 rounded-lg border border-amber-400/50 bg-amber-400/10 px-2 py-1 text-[11px] font-bold text-[var(--ink)]" data-testid="preview-label">
          Aperçu réservé — {previewInfo.simulated ? "campagne de test, simulée : " : ""}non diffusé aux autres, aucune impression comptée
        </p>
      ) : null}
      <SponsoredBanner
        ad={ad}
        variant={VARIANT_BY_PLACEMENT[placement]}
        onDismiss={() => {
          if (previewId) return setAd(null);
          rememberDismissed(ad.id);
          setAd(null);
        }}
      />
    </div>
  );
}
