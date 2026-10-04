"use client";

import { useCallback, useEffect, useRef, useState, type PointerEvent as ReactPointerEvent, type WheelEvent } from "react";
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
  initialState,
  confirmLabel = "Valider le cadrage",
  onCancel,
  onConfirm,
}: {
  previewSrc: string;
  spec: CoverCropEditorSpec;
  busy?: boolean;
  initialState?: CropState;
  confirmLabel?: string;
  onCancel: () => void;
  onConfirm: (crop: CropState) => void | Promise<void>;
}) {
  const frameRef = useRef<HTMLDivElement>(null);
  const dragOrigin = useRef<{ x: number; y: number; px: number; py: number } | null>(null);
  const pinchOrigin = useRef<{ distance: number; zoom: number } | null>(null);
  const [state, setState] = useState<CropState>(() => clampCropState(initialState ?? centeredCropState()));
  const [imageSize, setImageSize] = useState<{ width: number; height: number } | null>(null);
  const [framePx, setFramePx] = useState({ w: 0, h: 0 });
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    setState(clampCropState(initialState ?? centeredCropState()));
    setImageSize(null);
    const img = new Image();
    img.onload = () => setImageSize({ width: img.naturalWidth, height: img.naturalHeight });
    img.onerror = () => setImageSize(null);
    img.src = previewSrc;
  }, [previewSrc, initialState]);

  useEffect(() => {
    const el = frameRef.current;
    if (!el) return;
    const measure = () => {
      const rect = el.getBoundingClientRect();
      setFramePx({ w: rect.width, h: rect.height });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const patchState = useCallback((patch: Partial<CropState>) => {
    setState((current) => clampCropState({ ...current, ...patch }));
  }, []);

  const crop =
    imageSize &&
    framePx.w > 0 &&
    computeCoverCrop({
      sourceWidth: imageSize.width,
      sourceHeight: imageSize.height,
      outputWidth: spec.width,
      outputHeight: spec.height,
      state,
    });

  const scale = framePx.w > 0 ? framePx.w / spec.width : 1;

  function onPointerDown(ev: ReactPointerEvent) {
    if (busy) return;
    if ((ev.target as HTMLElement).dataset.handle === "zoom") return;
    ev.preventDefault();
    setDragging(true);
    dragOrigin.current = { x: ev.clientX, y: ev.clientY, px: state.x, py: state.y };
    (ev.currentTarget as HTMLElement).setPointerCapture(ev.pointerId);
  }

  function onPointerMove(ev: ReactPointerEvent) {
    if (pinchOrigin.current && ev.pointerType === "touch") return;
    if (!dragging || !dragOrigin.current || !frameRef.current) return;
    const rect = frameRef.current.getBoundingClientRect();
    patchState({
      x: dragOrigin.current.px - (ev.clientX - dragOrigin.current.x) / rect.width,
      y: dragOrigin.current.py - (ev.clientY - dragOrigin.current.y) / rect.height,
    });
  }

  function onPointerUp(ev: ReactPointerEvent) {
    if ((ev.target as HTMLElement).releasePointerCapture) {
      try {
        (ev.target as HTMLElement).releasePointerCapture(ev.pointerId);
      } catch {
        /* ignore */
      }
    }
    setDragging(false);
    dragOrigin.current = null;
    pinchOrigin.current = null;
  }

  function onWheel(ev: WheelEvent) {
    if (busy) return;
    ev.preventDefault();
    const delta = ev.deltaY > 0 ? -0.06 : 0.06;
    patchState({ zoom: clampCropState({ ...state, zoom: state.zoom + delta }).zoom });
  }

  function onHandlePointerDown(ev: ReactPointerEvent, corner: "nw" | "ne" | "sw" | "se") {
    if (busy) return;
    ev.preventDefault();
    ev.stopPropagation();
    const startY = ev.clientY;
    const startZoom = state.zoom;
    const sign = corner === "nw" || corner === "sw" ? 1 : -1;
    (ev.target as HTMLElement).setPointerCapture(ev.pointerId);

    function move(e: PointerEvent) {
      const dy = (e.clientY - startY) * sign;
      patchState({ zoom: clampCropState({ ...state, zoom: startZoom + dy * 0.008 }).zoom });
    }
    function up() {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    }
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  }

  return (
    <div className="space-y-3" data-testid="cover-crop-editor">
      <p className="text-xs text-[var(--muted-text)]">
        {spec.label} — sortie {spec.width} × {spec.height} px. Déplacez l&apos;image, zoomez (curseur, molette ou poignées),
        puis validez : le fichier final est généré côté serveur.
      </p>
      <div
        ref={frameRef}
        className="relative mx-auto w-full max-w-[min(100%,520px)] touch-none overflow-hidden rounded-lg border border-[var(--border)] bg-[#2a2438]"
        style={{ aspectRatio: `${spec.width} / ${spec.height}`, cursor: dragging ? "grabbing" : "grab" }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
        onWheel={onWheel}
        role="application"
        aria-label="Éditeur de recadrage"
      >
        {previewSrc && crop ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={previewSrc}
            alt=""
            className="absolute max-w-none select-none"
            style={{
              width: crop.drawWidth * scale,
              height: crop.drawHeight * scale,
              left: crop.drawX * scale,
              top: crop.drawY * scale,
              pointerEvents: "none",
            }}
            draggable={false}
          />
        ) : previewSrc ? (
          <div className="absolute inset-0 flex items-center justify-center text-xs text-[var(--muted)]">Chargement…</div>
        ) : null}
        <div className="pointer-events-none absolute inset-0 ring-2 ring-[var(--violet-bright,#7c5cff)]" aria-hidden />
        {(["nw", "ne", "sw", "se"] as const).map((corner) => (
          <button
            key={corner}
            type="button"
            data-handle="zoom"
            aria-label="Redimensionner le cadrage"
            className="absolute z-10 h-4 w-4 rounded-sm border-2 border-white bg-[var(--violet-bright,#7c5cff)] shadow"
            style={{
              top: corner.startsWith("n") ? 4 : undefined,
              bottom: corner.startsWith("s") ? 4 : undefined,
              left: corner.endsWith("w") ? 4 : undefined,
              right: corner.endsWith("e") ? 4 : undefined,
              cursor: `${corner}-resize`,
            }}
            onPointerDown={(e) => onHandlePointerDown(e, corner)}
          />
        ))}
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
            data-testid="crop-zoom-slider"
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
