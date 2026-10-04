"use client";

import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { Button } from "@/components/ui";
import { centeredCropState, clampCropState, computeCoverCrop, type CropState } from "@/lib/cover-crop";

export type CoverCropEditorSpec = {
  width: number;
  height: number;
  label: string;
};

export function CoverCropEditor({
  previewSrc,
  spec,
  busy,
  confirmLabel = "Valider le cadrage",
  onCancel,
  onConfirm,
}: {
  previewSrc: string;
  spec: CoverCropEditorSpec;
  busy?: boolean;
  confirmLabel?: string;
  onCancel: () => void;
  onConfirm: (crop: CropState) => void | Promise<void>;
}) {
  const frameRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const dragOrigin = useRef<{ x: number; y: number; px: number; py: number } | null>(null);
  const [state, setState] = useState<CropState>(() => centeredCropState());
  const [imageSize, setImageSize] = useState<{ width: number; height: number } | null>(null);
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    setState(centeredCropState());
    setImageSize(null);
  }, [previewSrc]);

  function patchState(patch: Partial<CropState>) {
    setState((current) => clampCropState({ ...current, ...patch }));
  }

  function onPointerDown(ev: ReactPointerEvent) {
    if (busy) return;
    ev.preventDefault();
    setDragging(true);
    dragOrigin.current = { x: ev.clientX, y: ev.clientY, px: state.x, py: state.y };
    (ev.currentTarget as HTMLElement).setPointerCapture(ev.pointerId);
  }

  function onPointerMove(ev: ReactPointerEvent) {
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
    <div className="space-y-3" data-testid="cover-crop-editor">
      <p className="text-xs text-[var(--muted-text)]">
        {spec.label} — sortie {spec.width} × {spec.height} px. Déplacez l&apos;image, zoomez, puis validez : le fichier final est généré côté serveur.
      </p>
      <div
        ref={frameRef}
        className="relative mx-auto w-full max-w-[min(100%,520px)] touch-none overflow-hidden rounded-lg border border-[var(--border)] bg-black"
        style={{ aspectRatio: `${spec.width} / ${spec.height}` }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
      >
        {previewSrc && crop ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            ref={imageRef}
            src={previewSrc}
            alt=""
            className="absolute max-w-none select-none"
            style={{
              width: `${(crop.drawWidth / spec.width) * 100}%`,
              height: `${(crop.drawHeight / spec.height) * 100}%`,
              left: `${(crop.drawX / spec.width) * 100}%`,
              top: `${(crop.drawY / spec.height) * 100}%`,
            }}
            draggable={false}
            onLoad={(event) => {
              const img = event.currentTarget;
              setImageSize({ width: img.naturalWidth, height: img.naturalHeight });
            }}
          />
        ) : previewSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            ref={imageRef}
            src={previewSrc}
            alt=""
            className="h-full w-full object-contain opacity-40"
            onLoad={(event) => {
              const img = event.currentTarget;
              setImageSize({ width: img.naturalWidth, height: img.naturalHeight });
            }}
          />
        ) : null}
        <div className="pointer-events-none absolute inset-0 ring-2 ring-[var(--violet-bright,#7c5cff)]/55" />
      </div>
      <div className="flex flex-wrap items-end gap-2">
        <label className="min-w-[12rem] flex-1 text-xs text-[var(--muted-text)]">
          Zoom ({Math.round(state.zoom * 100)} %)
          <input
            type="range"
            min={1}
            max={4}
            step={0.02}
            value={state.zoom}
            onChange={(e) => patchState({ zoom: Number(e.target.value) })}
            className="mt-1 w-full"
            disabled={busy}
          />
        </label>
        <Button type="button" variant="secondary" disabled={busy} onClick={() => patchState({ zoom: clampCropState({ ...state, zoom: state.zoom - 0.08 }).zoom })}>
          −
        </Button>
        <Button type="button" variant="secondary" disabled={busy} onClick={() => patchState({ zoom: clampCropState({ ...state, zoom: state.zoom + 0.08 }).zoom })}>
          +
        </Button>
        <Button type="button" variant="secondary" disabled={busy} onClick={() => setState(centeredCropState())}>
          Réinitialiser
        </Button>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button type="button" disabled={busy || !imageSize} onClick={() => void onConfirm(clampCropState(state))}>
          {busy ? "Génération…" : confirmLabel}
        </Button>
        <Button type="button" variant="secondary" disabled={busy} onClick={onCancel}>
          Annuler
        </Button>
      </div>
    </div>
  );
}
