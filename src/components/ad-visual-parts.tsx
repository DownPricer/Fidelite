"use client";

import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent, type ReactNode } from "react";
import { SponsoredBanner } from "@/components/fife-life/sponsored-banner";
import { Alert, Button } from "@/components/ui";

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
}: {
  imageUrl: string;
  merchantName: string;
  text: string;
  ctaLabel: string | null;
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

/**
 * Cadrage minimal d'un fichier qui n'a pas exactement le format du bandeau : déplacement + zoom
 * uniquement, sortie carrée 800×800. Aucun texte, calque ni outil de création (fait dans Photoshop).
 */
export function FramingTool({ src, onExport, onCancel }: { src: string; onExport: (dataUrl: string) => void; onCancel: () => void }) {
  const [imgEl, setImgEl] = useState<HTMLImageElement | null>(null);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [error, setError] = useState<string | null>(null);
  const dragRef = useRef<{ startX: number; startY: number; origin: { x: number; y: number } } | null>(null);

  useEffect(() => {
    loadImageElement(src)
      .then((img) => setImgEl(img))
      .catch(() => setError("Image illisible. Utilisez un fichier PNG, JPEG ou WebP."));
  }, [src]);

  if (!imgEl) return error ? <Alert>{error}</Alert> : <p className="text-sm text-[var(--muted-text)]">Chargement…</p>;

  const baseScale = Math.max(FRAME_PX / imgEl.width, FRAME_PX / imgEl.height);
  const displayWidth = imgEl.width * baseScale * zoom;
  const displayHeight = imgEl.height * baseScale * zoom;
  const maxX = Math.max(0, (displayWidth - FRAME_PX) / 2);
  const maxY = Math.max(0, (displayHeight - FRAME_PX) / 2);
  const clamped = { x: Math.min(maxX, Math.max(-maxX, offset.x)), y: Math.min(maxY, Math.max(-maxY, offset.y)) };

  function onPointerDown(e: ReactPointerEvent) {
    (e.target as Element).setPointerCapture(e.pointerId);
    dragRef.current = { startX: e.clientX, startY: e.clientY, origin: clamped };
  }
  function onPointerMove(e: ReactPointerEvent) {
    if (!dragRef.current) return;
    setOffset({ x: dragRef.current.origin.x + e.clientX - dragRef.current.startX, y: dragRef.current.origin.y + e.clientY - dragRef.current.startY });
  }

  function exportCrop() {
    const canvas = document.createElement("canvas");
    canvas.width = OUTPUT_PX;
    canvas.height = OUTPUT_PX;
    const ctx = canvas.getContext("2d");
    if (!ctx || !imgEl) {
      setError("Recadrage impossible sur cet appareil.");
      return;
    }
    const k = OUTPUT_PX / FRAME_PX;
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, OUTPUT_PX, OUTPUT_PX);
    ctx.drawImage(
      imgEl,
      OUTPUT_PX / 2 - (displayWidth * k) / 2 + clamped.x * k,
      OUTPUT_PX / 2 - (displayHeight * k) / 2 + clamped.y * k,
      displayWidth * k,
      displayHeight * k,
    );
    onExport(canvas.toDataURL("image/jpeg", 0.95));
  }

  return (
    <div className="space-y-3" data-testid="framing-tool">
      {error ? <Alert>{error}</Alert> : null}
      <p className="text-xs text-[var(--muted-text)]">
        Ce fichier n&apos;est pas carré : ajustez uniquement le cadrage et le zoom (sortie {OUTPUT_PX}×{OUTPUT_PX}, format du bandeau public).
      </p>
      <div
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={() => (dragRef.current = null)}
        onPointerLeave={() => (dragRef.current = null)}
        className="relative mx-auto overflow-hidden rounded-lg border border-[var(--border)] bg-white"
        style={{ width: FRAME_PX, height: FRAME_PX, touchAction: "none", cursor: "grab" }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imgEl.src}
          alt=""
          draggable={false}
          className="pointer-events-none absolute select-none"
          style={{ width: displayWidth, height: displayHeight, left: FRAME_PX / 2 - displayWidth / 2 + clamped.x, top: FRAME_PX / 2 - displayHeight / 2 + clamped.y }}
        />
      </div>
      <label className="block text-xs text-[var(--muted-text)]">
        Zoom
        <input type="range" min={1} max={3} step={0.05} value={zoom} onChange={(e) => setZoom(Number(e.target.value))} className="mt-1 w-full" />
      </label>
      <div className="flex gap-2">
        <Button type="button" onClick={exportCrop}>
          Valider le cadrage
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel}>
          Choisir un autre fichier
        </Button>
      </div>
    </div>
  );
}

