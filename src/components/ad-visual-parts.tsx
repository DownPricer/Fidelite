"use client";

import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent, type ReactNode } from "react";
import { CoverCropEditor } from "@/components/cover-crop-editor";
import { SponsoredBanner, type SponsoredVariant } from "@/components/fife-life/sponsored-banner";
import { Alert, Button } from "@/components/ui";
import { AD_BANNER_CROP_SPEC } from "@/lib/ad-visual-crop-specs";
import type { CropState } from "@/lib/cover-crop";

/** Taille d'export du bandeau (carré, identique au bandeau public — voir src/lib/ad-visuals.ts). */
const OUTPUT_PX = 800;
const FRAME_PX = 280;

export type VisualVersion = {
  id: string;
  number: number;
  author: "MERCHANT" | "FIDETO";
  status: "DRAFT" | "SUBMITTED" | "PROPOSED" | "APPROVED" | "CHANGES_REQUESTED" | "SUPERSEDED";
  url: string;
  originalUrl: string;
  width: number | null;
  height: number | null;
  reframed: boolean;
  comment: string | null;
  createdAt: string;
  decidedAt: string | null;
};

export type NextActionInfo = { actor: "MERCHANT" | "FIDETO" | "NONE"; title: string; detail: string };

export const VERSION_STATUS_LABELS: Record<VisualVersion["status"], string> = {
  DRAFT: "Brouillon",
  SUBMITTED: "En attente de décision Fideto",
  PROPOSED: "Proposée au commerçant",
  APPROVED: "Version finale",
  CHANGES_REQUESTED: "Refusée / modification demandée",
  SUPERSEDED: "Remplacée",
};

export function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("fr-FR", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

export function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("Lecture du fichier impossible."));
    reader.readAsDataURL(file);
  });
}

export function loadImageElement(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Image illisible."));
    img.src = src;
  });
}

/** Même règle que le serveur (isExactBannerFormat) : carré 1:1, au moins 400 px. */
export function isExactBanner(width: number, height: number) {
  return width === height && Math.min(width, height) >= 400;
}

/** Bandeau qui « doit agir maintenant » — toujours affiché en tête des fiches. */
export function NextActionBanner({ action }: { action: NextActionInfo }) {
  const tone =
    action.actor === "MERCHANT"
      ? "border-[#e0a100] bg-[#e0a10018]"
      : action.actor === "FIDETO"
        ? "border-[var(--violet-bright)] bg-[#7c5cff18]"
        : "border-[var(--border)] bg-[var(--surface)]";
  const who = action.actor === "MERCHANT" ? "À vous de jouer" : action.actor === "FIDETO" ? "Action Fideto" : "Aucune action requise";
  return (
    <div className={`rounded-2xl border p-4 ${tone}`} data-testid="next-action" role="status">
      <p className="text-[10px] font-black uppercase tracking-widest text-[var(--muted)]">{who}</p>
      <p className="mt-0.5 text-base font-black text-[var(--ink)]">{action.title}</p>
      <p className="mt-0.5 text-sm text-[var(--muted-strong,var(--muted))]">{action.detail}</p>
    </div>
  );
}

/** Image cliquable : s'ouvre en grand (aperçu), avec téléchargement optionnel du fichier d'origine. */
export function ImageThumb({
  src,
  fullSrc,
  downloadHref,
  label,
  size = 72,
  children,
}: {
  src: string;
  fullSrc?: string;
  downloadHref?: string;
  label: string;
  size?: number;
  children?: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`Ouvrir en grand : ${label}`}
        className="rounded-lg border border-[var(--border)] p-0.5"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={label} style={{ width: size, height: size }} className="rounded-md object-cover" />
      </button>
      {children}
      {open ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={label}
          className="fixed inset-0 z-[100] grid place-items-center bg-black/80 p-4"
          onClick={() => setOpen(false)}
        >
          <div className="max-h-full max-w-full space-y-3" onClick={(e) => e.stopPropagation()}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={fullSrc ?? src} alt={label} className="mx-auto max-h-[78vh] max-w-full rounded-xl bg-white object-contain" />
            <div className="flex justify-center gap-2">
              {downloadHref ? (
                <a href={downloadHref} className="rounded-full bg-white px-4 py-2 text-sm font-bold text-black">
                  Télécharger (qualité complète)
                </a>
              ) : null}
              <button type="button" onClick={() => setOpen(false)} className="rounded-full bg-white/20 px-4 py-2 text-sm font-bold text-white">
                Fermer
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

/** Aperçu dans le vrai format d'affichage : le composant public SponsoredBanner lui-même. */
export function RealBannerPreview({
  imageUrl,
  merchantName,
  text,
  ctaLabel,
  variant,
}: {
  imageUrl: string;
  merchantName: string;
  text: string;
  ctaLabel: string | null;
  variant?: SponsoredVariant;
}) {
  return (
    <div className="max-w-sm" data-testid="real-banner-preview" onClickCapture={(e) => e.preventDefault()}>
      <SponsoredBanner
        ad={{
          id: "preview",
          merchantSlug: "apercu",
          merchantName,
          merchantLogoUrl: null,
          imageUrl,
          text,
          ctaLabel,
          impressionUrl: "#",
          clickUrl: "#",
        }}
        variant={variant}
      />
    </div>
  );
}

export function VersionHistory({
  versions,
  adminView,
}: {
  versions: VisualVersion[];
  adminView?: boolean;
}) {
  if (versions.length === 0) return <p className="text-sm text-[var(--muted)]">Aucune version pour le moment.</p>;
  return (
    <ol className="space-y-3" aria-label="Historique des versions du visuel">
      {versions.map((v) => (
        <li key={v.id} className="flex gap-3 rounded-xl border border-[var(--border)] p-2.5" data-testid="version-row">
          <ImageThumb
            src={v.url}
            label={`Version ${v.number}`}
            size={56}
            downloadHref={adminView ? `${v.originalUrl}?telecharger=1` : undefined}
          />
          <div className="min-w-0 flex-1 text-sm">
            <p className="font-bold text-[var(--ink)]">
              Version {v.number} · {v.author === "FIDETO" ? "préparée par Fideto" : "fournie par le commerçant"}
            </p>
            <p className="text-xs text-[var(--muted)]">
              {VERSION_STATUS_LABELS[v.status]} · {formatDateTime(v.createdAt)}
              {v.reframed ? " · recadrée" : ""}
            </p>
            {v.comment ? <p className="mt-1 text-xs text-[var(--danger)]">« {v.comment} »</p> : null}
          </div>
        </li>
      ))}
    </ol>
  );
}

export type FramingExport = { url: string; originalUrl: string; previewUrl: string };

/**
 * Recadrage bandeau : éditeur + fichier final généré côté serveur (EXIF + coordonnées normalisées).
 */
export function FramingTool({
  src,
  merchantId,
  onExport,
  onCancel,
}: {
  src: string;
  merchantId: string;
  onExport: (result: FramingExport) => void;
  onCancel: () => void;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  async function applyCrop(crop: CropState) {
    setBusy(true);
    setError(null);
    try {
      const originalRes = await fetch("/api/merchant/visuels/televerser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dataUrl: src, kind: "original" }),
      });
      const originalBody = (await originalRes.json()) as { url?: string; error?: string };
      if (!originalRes.ok || !originalBody.url) throw new Error(originalBody.error ?? "Envoi de l'original impossible.");

      const cropRes = await fetch("/api/merchant/visuels/recadrer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          merchantId,
          originalUrl: originalBody.url,
          target: "banniere",
          crop,
        }),
      });
      const cropBody = (await cropRes.json()) as { url?: string; error?: string };
      if (!cropRes.ok || !cropBody.url) throw new Error(cropBody.error ?? "Recadrage impossible.");

      setPreviewUrl(cropBody.url);
      onExport({ url: cropBody.url, originalUrl: originalBody.url, previewUrl: cropBody.url });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Recadrage impossible.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-3" data-testid="framing-tool">
      {error ? <Alert>{error}</Alert> : null}
      {previewUrl ? (
        <div className="mx-auto max-w-[280px]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={previewUrl} alt="Bandeau recadré enregistré" className="w-full rounded-lg border border-[var(--border)]" />
          <p className="mt-1 text-[11px] text-[var(--muted-text)]">Fichier final enregistré — c&apos;est celui-ci qui sera diffusé.</p>
        </div>
      ) : (
        <CoverCropEditor previewSrc={src} spec={AD_BANNER_CROP_SPEC} busy={busy} onCancel={onCancel} onConfirm={applyCrop} />
      )}
    </div>
  );
}


export type PreviewLinks = { home: string; search: string; notifications: string };

const frameStyle: React.CSSProperties = {
  width: 280,
  minHeight: 440,
  borderRadius: 28,
  border: "6px solid #2b2238",
  background: "linear-gradient(160deg,#3a2a5c,#1d1630)",
  padding: 12,
  color: "#f4eefc",
  fontSize: 11,
  display: "flex",
  flexDirection: "column",
  gap: 8,
};
const block: React.CSSProperties = { borderRadius: 12, background: "rgba(255,255,255,0.08)", padding: 10 };

/**
 * Aperçu mobile de la publicité dans ses trois emplacements réels (accueil du Wallet, recherche,
 * notifications) avec le vrai composant de bandeau et ses vraies données. Purement visuel : aucune
 * requête, aucune impression, jamais visible d'un autre utilisateur que celui qui ouvre cette fiche.
 */
export function MobilePlacementPreview({
  ad,
  simulated,
  links,
}: {
  ad: { imageUrl: string; merchantName: string; text: string; ctaLabel: string | null };
  simulated: boolean;
  links?: PreviewLinks;
}) {
  const banner = (variant: SponsoredVariant) => (
    <RealBannerPreview imageUrl={ad.imageUrl} merchantName={ad.merchantName} text={ad.text} ctaLabel={ad.ctaLabel} variant={variant} />
  );
  return (
    <div data-testid="mobile-preview" style={{ display: "grid", gap: 12 }}>
      <p style={{ fontSize: 11, opacity: 0.85 }}>
        Aperçu réservé — {simulated ? "campagne de test (simulée) : " : ""}personne d&apos;autre ne la voit et aucune impression n&apos;est comptée.
      </p>
      <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
        <div style={frameStyle} aria-label="Accueil du Wallet">
          <b style={{ fontSize: 10, letterSpacing: 1.5 }}>ACCUEIL DU WALLET</b>
          <div style={{ ...block, height: 90 }}>Votre carte Fideto · 180 pts</div>
          <div style={block}>Prochaine récompense</div>
          {banner("home")}
        </div>
        <div style={frameStyle} aria-label="Recherche">
          <b style={{ fontSize: 10, letterSpacing: 1.5 }}>RECHERCHE</b>
          <div style={block}>Nom du commerce ou ville…</div>
          <div style={block}>Café du Coin · Lyon</div>
          {banner("search")}
        </div>
        <div style={frameStyle} aria-label="Notifications">
          <b style={{ fontSize: 10, letterSpacing: 1.5 }}>NOTIFICATIONS</b>
          <div style={{ display: "flex", gap: 6 }}>
            <span style={{ ...block, padding: "4px 8px" }}>Toutes</span>
            <span style={{ ...block, padding: "4px 8px" }}>Offres</span>
          </div>
          {banner("notifications")}
          <div style={block}>Bienvenue sur Fideto — votre carte est prête.</div>
        </div>
      </div>
      {links ? (
        <p style={{ fontSize: 11 }}>
          Sur votre téléphone, avec votre compte connecté :{" "}
          <a href={links.home} style={{ textDecoration: "underline" }} data-testid="preview-link-home">accueil</a> ·{" "}
          <a href={links.search} style={{ textDecoration: "underline" }}>recherche</a> ·{" "}
          <a href={links.notifications} style={{ textDecoration: "underline" }}>notifications</a>
        </p>
      ) : null}
    </div>
  );
}
