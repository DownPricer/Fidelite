"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { CardElement, CardTemplateConfig } from "@/lib/card-template-schema";
import { CARD_ASPECT_RATIO } from "@/lib/card-template-schema";
import {
  clampRect,
  rectStyle,
  resolveElementRect,
  type NormalizedRect,
} from "@/lib/merchant-card-layout";
import { cn } from "@/components/ui";

type GuideLine = { orientation: "h" | "v"; pos: number };

type DragState =
  | { kind: "move"; id: string; startX: number; startY: number; origin: NormalizedRect }
  | { kind: "resize"; id: string; handle: string; startX: number; startY: number; origin: NormalizedRect };

const HANDLES = ["nw", "n", "ne", "e", "se", "s", "sw", "w"] as const;

function snapValue(value: number, targets: number[], threshold: number, enabled: boolean) {
  if (!enabled) return value;
  for (const target of targets) {
    if (Math.abs(value - target) <= threshold) return target;
  }
  return value;
}

function elementLabel(type: CardElement["type"]) {
  const labels: Record<CardElement["type"], string> = {
    logo: "Logo",
    merchantName: "Nom commerce",
    clientName: "Identité client",
    qr: "QR Fife Life",
    pointsBalance: "Solde points",
    visitsCount: "Passages",
    progressText: "Texte progression",
    progressBar: "Barre progression",
    nextReward: "Prochain avantage",
    unlockedReward: "Récompense",
    tierLevel: "Palier",
    expiryDate: "Expiration",
    staticText: "Texte statique",
  };
  return labels[type];
}

export function CardEditorCanvas({
  config,
  backgroundUrl,
  selectedId,
  onSelect,
  onChangeElements,
  snapEnabled,
  guides,
  onGuidesChange,
  readOnly = false,
}: {
  config: CardTemplateConfig;
  backgroundUrl: string;
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  onChangeElements: (elements: CardElement[]) => void;
  snapEnabled: boolean;
  guides: GuideLine[];
  onGuidesChange: (guides: GuideLine[]) => void;
  readOnly?: boolean;
}) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [drag, setDrag] = useState<DragState | null>(null);

  const elements = config.elements;

  const snapTargets = useMemo(() => {
    const t = [0, 0.5, 1, config.safeZone.left, config.safeZone.top, 1 - config.safeZone.right, 1 - config.safeZone.bottom];
    for (const el of elements) {
      const r = resolveElementRect(el);
      t.push(r.x, r.y, r.x + r.width, r.y + r.height, r.x + r.width / 2, r.y + r.height / 2);
    }
    return t;
  }, [elements, config.safeZone]);

  const updateElement = useCallback(
    (id: string, patch: Partial<CardElement>) => {
      onChangeElements(elements.map((el) => (el.id === id ? { ...el, ...patch } : el)));
    },
    [elements, onChangeElements],
  );

  const updateRect = useCallback(
    (id: string, rect: NormalizedRect) => {
      const el = elements.find((e) => e.id === id);
      if (!el || el.locked) return;
      onChangeElements(
        elements.map((item) =>
          item.id === id
            ? {
                ...item,
                x: rect.x,
                y: rect.y,
                width: rect.width,
                height: rect.height,
                anchor: "top-left" as const,
              }
            : item,
        ),
      );
    },
    [elements, onChangeElements],
  );

  const pointerToNormalized = useCallback((clientX: number, clientY: number) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return { x: 0, y: 0 };
    return {
      x: (clientX - rect.left) / rect.width,
      y: (clientY - rect.top) / rect.height,
    };
  }, []);

  useEffect(() => {
    if (!drag || readOnly) return;
    const activeDrag = drag;

    function onMove(ev: PointerEvent) {
      const pos = pointerToNormalized(ev.clientX, ev.clientY);
      const threshold = 0.012;

      if (activeDrag.kind === "move") {
        const el = elements.find((e) => e.id === activeDrag.id);
        if (!el?.locked) {
          let nx = snapValue(activeDrag.origin.x + (pos.x - activeDrag.startX), snapTargets, threshold, snapEnabled);
          let ny = snapValue(activeDrag.origin.y + (pos.y - activeDrag.startY), snapTargets, threshold, snapEnabled);
          const rect = clampRect({ x: nx, y: ny, width: activeDrag.origin.width, height: activeDrag.origin.height });
          updateRect(activeDrag.id, rect);
          onGuidesChange([
            ...(Math.abs(rect.x + rect.width / 2 - 0.5) < threshold ? [{ orientation: "v" as const, pos: 0.5 }] : []),
            ...(Math.abs(rect.y + rect.height / 2 - 0.5) < threshold ? [{ orientation: "h" as const, pos: 0.5 }] : []),
          ]);
        }
      } else if (activeDrag.kind === "resize") {
        const el = elements.find((e) => e.id === activeDrag.id);
        if (!el?.locked) {
          let { x, y, width, height } = activeDrag.origin;
          const dx = pos.x - activeDrag.startX;
          const dy = pos.y - activeDrag.startY;
          const h = activeDrag.handle;
          if (h.includes("e")) width = snapValue(width + dx, snapTargets, threshold, snapEnabled);
          if (h.includes("s")) height = snapValue(height + dy, snapTargets, threshold, snapEnabled);
          if (h.includes("w")) {
            const nw = snapValue(width - dx, snapTargets, threshold, snapEnabled);
            x = x + (width - nw);
            width = nw;
          }
          if (h.includes("n")) {
            const nh = snapValue(height - dy, snapTargets, threshold, snapEnabled);
            y = y + (height - nh);
            height = nh;
          }
          updateRect(activeDrag.id, clampRect({ x, y, width, height }));
        }
      }
    }

    function onUp() {
      setDrag(null);
      onGuidesChange([]);
    }

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, [drag, elements, onGuidesChange, pointerToNormalized, snapEnabled, snapTargets, updateRect, readOnly]);

  useEffect(() => {
    function onKey(ev: KeyboardEvent) {
      if (!selectedId || readOnly) return;
      const el = elements.find((e) => e.id === selectedId);
      if (!el || el.locked) return;
      const step = ev.shiftKey ? 0.01 : 0.005;
      const rect = resolveElementRect(el);
      if (ev.key === "ArrowLeft") {
        ev.preventDefault();
        updateRect(selectedId, clampRect({ ...rect, x: rect.x - step }));
      } else if (ev.key === "ArrowRight") {
        ev.preventDefault();
        updateRect(selectedId, clampRect({ ...rect, x: rect.x + step }));
      } else if (ev.key === "ArrowUp") {
        ev.preventDefault();
        updateRect(selectedId, clampRect({ ...rect, y: rect.y - step }));
      } else if (ev.key === "ArrowDown") {
        ev.preventDefault();
        updateRect(selectedId, clampRect({ ...rect, y: rect.y + step }));
      } else if (ev.key === "Delete" || ev.key === "Backspace") {
        ev.preventDefault();
        onChangeElements(elements.filter((e) => e.id !== selectedId));
        onSelect(null);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selectedId, elements, onChangeElements, onSelect, updateRect, readOnly]);

  return (
    <div
      ref={canvasRef}
      className="card-editor-canvas relative mx-auto select-none touch-none overflow-hidden rounded-2xl border border-white/15 bg-black/30"
      style={{ aspectRatio: `${CARD_ASPECT_RATIO} / 1`, width: "100%", maxWidth: 720 }}
      onPointerDown={() => onSelect(null)}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={backgroundUrl} alt="" className="absolute inset-0 h-full w-full object-cover" draggable={false} />

      {/* Zone sûre */}
      <div
        className="pointer-events-none absolute border border-dashed border-white/25"
        style={{
          left: `${config.safeZone.left * 100}%`,
          top: `${config.safeZone.top * 100}%`,
          right: `${config.safeZone.right * 100}%`,
          bottom: `${config.safeZone.bottom * 100}%`,
        }}
      />

      {guides.map((guide, index) => (
        <div
          key={`${guide.orientation}-${guide.pos}-${index}`}
          className="pointer-events-none absolute bg-[var(--violet-bright)]/70"
          style={
            guide.orientation === "v"
              ? { left: `${guide.pos * 100}%`, top: 0, bottom: 0, width: 1 }
              : { top: `${guide.pos * 100}%`, left: 0, right: 0, height: 1 }
          }
        />
      ))}

      {[...elements]
        .sort((a, b) => a.zIndex - b.zIndex)
        .map((element) => {
          if (element.hidden) return null;
          const rect = resolveElementRect(element);
          const selected = element.id === selectedId;
          return (
            <div
              key={element.id}
              className={cn(
                "absolute box-border",
                selected ? "ring-2 ring-[var(--violet-bright)]" : "ring-1 ring-white/30",
                element.locked && "opacity-70",
              )}
              style={{ ...rectStyle(rect), zIndex: element.zIndex + 10 }}
              onPointerDown={(ev) => {
                if (readOnly || element.locked) return;
                ev.stopPropagation();
                onSelect(element.id);
                setDrag({
                  kind: "move",
                  id: element.id,
                  startX: pointerToNormalized(ev.clientX, ev.clientY).x,
                  startY: pointerToNormalized(ev.clientX, ev.clientY).y,
                  origin: rect,
                });
                (ev.target as HTMLElement).setPointerCapture?.(ev.pointerId);
              }}
            >
              <span className="absolute left-0 top-0 max-w-full truncate bg-black/60 px-1 text-[8px] font-bold uppercase text-white">
                {element.label ?? elementLabel(element.type)}
              </span>
              {selected && !readOnly && !element.locked
                ? HANDLES.map((handle) => (
                    <span
                      key={handle}
                      className="absolute z-20 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow"
                      style={{
                        left: handle.includes("w") ? "0%" : handle.includes("e") ? "100%" : "50%",
                        top: handle.includes("n") ? "0%" : handle.includes("s") ? "100%" : "50%",
                        cursor: `${handle}-resize`,
                      }}
                      onPointerDown={(ev) => {
                        ev.stopPropagation();
                        setDrag({
                          kind: "resize",
                          id: element.id,
                          handle,
                          startX: pointerToNormalized(ev.clientX, ev.clientY).x,
                          startY: pointerToNormalized(ev.clientX, ev.clientY).y,
                          origin: rect,
                        });
                      }}
                    />
                  ))
                : null}
            </div>
          );
        })}
    </div>
  );
}

export { elementLabel };
