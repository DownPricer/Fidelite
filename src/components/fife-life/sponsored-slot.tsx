"use client";

import { useEffect, useRef, useState } from "react";
import { SponsoredBanner, type SponsoredAd, type SponsoredVariant } from "./sponsored-banner";
import { notifySponsoredAvailabilityChanged } from "./use-sponsored-available";

export type SponsoredPlacement = "WALLET_HOME" | "SEARCH" | "NOTIFICATIONS";

const VARIANT_BY_PLACEMENT: Record<SponsoredPlacement, SponsoredVariant> = {
  WALLET_HOME: "avantages",
  SEARCH: "search",
  NOTIFICATIONS: "notifications",
};

/** Délai de visibilité continue avant de compter une impression (évite les passages éclairs). */
const VISIBLE_MS = 1000;
/**
 * Fermeture par croix : masquage par campagne ET par emplacement (sessionStorage uniquement).
 * Fermer dans Avantages n'affecte pas Recherche ni Notifications. Nouvelle ouverture d'app → peut réapparaître.
 */
const DISMISS_KEY = "fideto-sponsored-dismissed";
let dismissedThisSession: Set<string> | null = null;

function dismissToken(placement: SponsoredPlacement, adId: string) {
  return `${placement}:${adId}`;
}

function loadDismissedTokens(): Set<string> {
  if (!dismissedThisSession) {
    dismissedThisSession = new Set();
    try {
      const raw = sessionStorage.getItem(DISMISS_KEY);
      if (raw) {
        for (const entry of JSON.parse(raw) as string[]) {
          if (typeof entry === "string" && entry.includes(":")) dismissedThisSession.add(entry);
          // ignore anciennes entrées globales (id seul) — pas de migration localStorage
        }
      }
    } catch {
      // stockage indisponible (navigation privée…) : la mémoire du module suffit pour cette session
    }
  }
  return dismissedThisSession;
}

/** Identifiants de campagnes masqués pour un emplacement donné (session en cours). */
export function getDismissedAdIds(placement: SponsoredPlacement): Set<string> {
  const prefix = `${placement}:`;
  const ids = new Set<string>();
  for (const token of loadDismissedTokens()) {
    if (token.startsWith(prefix)) ids.add(token.slice(prefix.length));
  }
  return ids;
}

/** @deprecated Préférer getDismissedAdIds(placement). Conservé pour compatibilité tests outils. */
export function getDismissedAds(): Set<string> {
  return getDismissedAdIds("WALLET_HOME");
}

function rememberDismissed(placement: SponsoredPlacement, adId: string) {
  const set = loadDismissedTokens();
  set.add(dismissToken(placement, adId));
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
    const exclude = [...getDismissedAdIds(placement)].join(",");
    fetch(`/api/customer/sponsored?placement=${placement}${exclude ? `&exclude=${encodeURIComponent(exclude)}` : ""}`, {
      signal: controller.signal,
      cache: "no-store",
    })
      .then((r) => (r.ok ? r.json() : { ad: null }))
      .then((data: { ad: (SponsoredAd & { placement: SponsoredPlacement }) | null }) => {
        const next = data.ad && !getDismissedAdIds(placement).has(data.ad.id) ? data.ad : null;
        setAd(next);
        notifySponsoredAvailabilityChanged();
      })
      .catch(() => undefined);
    return () => controller.abort();
  }, [placement, previewId]);

  useEffect(() => {
    const node = hostRef.current;
    const impressionUrl = ad?.impressionUrl;
    if (previewId || !ad || !node || !impressionUrl || typeof IntersectionObserver === "undefined") return;
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
          void fetch(impressionUrl, {
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
          rememberDismissed(placement, ad.id);
          setAd(null);
          notifySponsoredAvailabilityChanged();
        }}
      />
    </div>
  );
}
