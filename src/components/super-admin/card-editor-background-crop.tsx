"use client";

import { useCallback, useRef, useState } from "react";
import { CardTemplateBackground } from "@/components/fife-life/card-template-background";
import { Button } from "@/components/ui";
import { CARD_ASPECT_RATIO } from "@/lib/card-template-schema";
import type { CardTemplateConfig } from "@/lib/card-template-schema";

export function CardEditorBackgroundCrop({
  backgroundUrl,
  background,
  onChange,
}: {
  backgroundUrl: string;
  background: CardTemplateConfig["background"];
  onChange: (patch: Partial<CardTemplateConfig["background"]>) => void;
}) {
  const frameRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);
  const dragOrigin = useRef<{ x: number; y: number; px: number; py: number } | null>(null);

  const patchBackground = useCallback(
    (patch: Partial<CardTemplateConfig["background"]>) => {
      onChange(patch);
    },
    [onChange],
  );

  function onPointerDown(ev: React.PointerEvent) {
    ev.preventDefault();
    setDragging(true);
    dragOrigin.current = {
      x: ev.clientX,
      y: ev.clientY,
      px: background.position.x,
      py: background.position.y,
    };
    (ev.currentTarget as HTMLElement).setPointerCapture(ev.pointerId);
  }

  function onPointerMove(ev: React.PointerEvent) {
    if (!dragging || !dragOrigin.current || !frameRef.current) return;
    const rect = frameRef.current.getBoundingClientRect();
    const dx = (ev.clientX - dragOrigin.current.x) / rect.width;
    const dy = (ev.clientY - dragOrigin.current.y) / rect.height;
    patchBackground({
      position: {
        x: Math.min(1, Math.max(0, dragOrigin.current.px - dx)),
        y: Math.min(1, Math.max(0, dragOrigin.current.py - dy)),
      },
    });
  }

  function onPointerUp() {
    setDragging(false);
    dragOrigin.current = null;
  }

  return (
    <div className="space-y-3">
      <p className="text-xs text-[var(--muted-text)]">
        Déplacez l’image dans le cadre. Le PNG d’origine n’est pas modifié.
      </p>
      <div
        ref={frameRef}
        className="relative mx-auto w-full max-w-[640px] touch-none overflow-hidden rounded-2xl border border-white/15 bg-black/40"
        style={{ aspectRatio: `${CARD_ASPECT_RATIO} / 1` }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
      >
        <CardTemplateBackground backgroundUrl={backgroundUrl} background={background} />
        <div className="pointer-events-none absolute inset-0 ring-2 ring-[var(--violet-bright)]/40" />
      </div>

      <div className="flex flex-wrap gap-2">
        <Button variant="secondary" className="text-xs" onClick={() => patchBackground({ position: { x: 0.5, y: 0.5 } })}>
          Centrer
        </Button>
        <Button
          variant="secondary"
          className="text-xs"
          onClick={() => patchBackground({ fit: "cover", scale: 1, position: { x: 0.5, y: 0.5 } })}
        >
          Remplir
        </Button>
        <Button
          variant="secondary"
          className="text-xs"
          onClick={() => patchBackground({ fit: "contain", scale: 1, position: { x: 0.5, y: 0.5 } })}
        >
          Afficher entièrement
        </Button>
        <Button
          variant="secondary"
          className="text-xs"
          onClick={() => patchBackground({ fit: "cover", scale: 1, position: { x: 0.5, y: 0.5 } })}
        >
          Réinitialiser
        </Button>
      </div>

      <label className="block text-xs text-[var(--muted-text)]">
        Zoom de l’image ({Math.round(background.scale * 100)} %)
        <input
          type="range"
          min={0.5}
          max={3}
          step={0.05}
          value={background.scale}
          onChange={(e) => patchBackground({ scale: Number(e.target.value) })}
          className="mt-1 w-full"
        />
      </label>
    </div>
  );
}
