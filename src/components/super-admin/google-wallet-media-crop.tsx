"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui";
import {
  centeredCropState,
  clampCropState,
  computeCoverCrop,
  exportGoogleWalletCrop,
  GOOGLE_WALLET_CROP_SPECS,
  type CropState,
  type GoogleWalletMediaKind,
} from "@/lib/google-wallet-media-crop";

export function GoogleWalletMediaCrop({
  file,
  kind,
  busy,
  onCancel,
  onConfirm,
}: {
  file: File;
  kind: GoogleWalletMediaKind;
  busy: boolean;
  onCancel: () => void;
  onConfirm: (file: File) => Promise<void>;
}) {
  const spec = GOOGLE_WALLET_CROP_SPECS[kind];
  const frameRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const dragOrigin = useRef<{ x: number; y: number; px: number; py: number } | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [state, setState] = useState<CropState>(() => centeredCropState());
  const [imageSize, setImageSize] = useState<{ width: number; height: number } | null>(null);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setState(centeredCropState());
    setImageSize(null);
    setError(null);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  function patchState(patch: Partial<CropState>) {
    setState((current) => clampCropState({ ...current, ...patch }));
  }

  function onPointerDown(ev: React.PointerEvent) {
    if (busy) return;
    ev.preventDefault();
    setDragging(true);
    dragOrigin.current = { x: ev.clientX, y: ev.clientY, px: state.x, py: state.y };
    (ev.currentTarget as HTMLElement).setPointerCapture(ev.pointerId);
  }

  function onPointerMove(ev: React.PointerEvent) {
    if (!dragging || !dragOrigin.current || !frameRef.current) return;
    const rect = frameRef.current.getBoundingClientRect();
    patchState({
      x: dragOrigin.current.px - (ev.clientX - dragOrigin.current.x) / rect.width,
      y: dragOrigin.current.py - (ev.clientY - dragOrigin.current.y) / rect.height,
    });
  }

  function onPointerUp() {
    setDragging(false);
    dragOrigin.current = null;
  }

  async function confirm() {
    const img = imageRef.current;
    if (!img || !imageSize) {
      setError("Image impossible à préparer pour Google Wallet.");
      return;
    }
    setError(null);
    try {
      const cropped = await exportGoogleWalletCrop({
        image: img,
        sourceWidth: imageSize.width,
        sourceHeight: imageSize.height,
        spec,
        state,
      });
      await onConfirm(cropped);
    } catch {
      setError("Le recadrage a échoué. Le fichier d'origine est conservé.");
    }
  }

  const crop =
    imageSize &&
    computeCoverCrop({
      sourceWidth: imageSize.width,
      sourceHeight: imageSize.height,
      outputWidth: spec.width,
      outputHeight: spec.height,
      state,
    });

  return (
    <div className="fixed inset-0 z-50 grid place-items-end bg-black/65 p-0 sm:place-items-center sm:p-6">
      <div className="w-full max-w-3xl rounded-t-2xl border border-white/15 bg-[var(--panel)] p-4 shadow-2xl sm:rounded-2xl">
        <div className="mb-3 flex items-start justify-between gap-3">
          <div>
            <h3 className="text-base font-black text-[var(--ink)]">Recadrer {spec.label}</h3>
            <p className="text-xs text-[var(--muted-text)]">
              Sortie PNG {spec.width} × {spec.height}
            </p>
          </div>
          <Button variant="secondary" className="text-xs" onClick={onCancel} disabled={busy}>
            Annuler
          </Button>
        </div>
        <div
          ref={frameRef}
          className="relative mx-auto w-full max-w-[620px] touch-none overflow-hidden rounded-lg border border-white/20 bg-black"
          style={{ aspectRatio: `${spec.width} / ${spec.height}` }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerLeave={onPointerUp}
        >
          {previewUrl && crop ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              ref={imageRef}
              src={previewUrl}
              alt=""
              className="absolute max-w-none select-none"
              style={{
                width: `${(crop.drawWidth / spec.width) * 100}%`,
                height: `${(crop.drawHeight / spec.height) * 100}%`,
                left: `${(crop.drawX / spec.width) * 100}%`,
                top: `${(crop.drawY / spec.height) * 100}%`,
              }}
              draggable={false}
            />
          ) : previewUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              ref={imageRef}
              src={previewUrl}
              alt=""
              className="h-full w-full object-contain"
              onLoad={(event) => {
                const img = event.currentTarget;
                setImageSize({ width: img.naturalWidth, height: img.naturalHeight });
              }}
            />
          ) : null}
          <div className="pointer-events-none absolute inset-0 ring-2 ring-[var(--violet-bright)]/60" />
          {kind === "logo" ? (
            <>
              <div className="pointer-events-none absolute inset-[15%] rounded-full border-2 border-white/80" />
              <div className="pointer-events-none absolute inset-0 rounded-lg shadow-[inset_0_0_0_9999px_rgba(0,0,0,0.18)]" />
            </>
          ) : null}
        </div>
        {error ? <p className="mt-2 text-xs font-semibold text-red-300">{error}</p> : null}
        <div className="mt-4 flex flex-wrap items-end gap-3">
          <label className="min-w-48 flex-1 text-xs text-[var(--muted-text)]">
            Zoom ({Math.round(state.zoom * 100)} %)
            <input
              type="range"
              min={1}
              max={4}
              step={0.05}
              value={state.zoom}
              onChange={(event) => patchState({ zoom: Number(event.target.value) })}
              className="mt-1 w-full"
              disabled={busy}
            />
          </label>
          <Button variant="secondary" className="text-xs" onClick={() => patchState({ x: 0.5, y: 0.5 })} disabled={busy}>
            Centrer
          </Button>
          <Button variant="secondary" className="text-xs" onClick={() => setState(centeredCropState())} disabled={busy}>
            Réinitialiser
          </Button>
          <Button onClick={() => void confirm()} disabled={busy || !imageSize}>
            {busy ? "Envoi…" : "Utiliser cette image"}
          </Button>
        </div>
      </div>
    </div>
  );
}
