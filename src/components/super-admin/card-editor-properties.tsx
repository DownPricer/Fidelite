"use client";

import { useMemo, useState } from "react";
import type { LoyaltyMode } from "@prisma/client";
import { Button, Field, Input } from "@/components/ui";
import {
  QR_MIN_SIZE,
  type CardElement,
  type CardTemplateConfig,
  type CardTextStyle,
} from "@/lib/card-template-schema";
import { ELEMENT_DATA_KEYS } from "@/lib/card-template-data-keys";
import { CARD_FONT_OPTIONS } from "@/lib/card-template-fonts";
import {
  enforceElementRect,
  qrOverlapsOthers,
  qrRecommendedSize,
  qrSizeValid,
} from "@/lib/card-template-editor-resize";
import { resolveElementRect } from "@/lib/merchant-card-layout";
import { elementLabel } from "./card-editor-canvas";

const REQUIRED_BY_MODE: Record<LoyaltyMode, CardElement["type"][]> = {
  VISITS: ["clientName", "qr", "visitsCount", "progressBar", "nextReward"],
  POINTS_BY_AMOUNT: ["clientName", "qr", "pointsBalance", "progressBar", "nextReward"],
  FIXED_POINTS: ["clientName", "qr", "pointsBalance", "progressBar", "nextReward"],
  AMOUNT_TIERS: ["clientName", "qr", "pointsBalance", "progressBar", "nextReward"],
};

const TEXT_TYPES = new Set<CardElement["type"]>([
  "merchantName",
  "clientName",
  "pointsBalance",
  "visitsCount",
  "progressText",
  "nextReward",
  "unlockedReward",
  "tierLevel",
  "expiryDate",
  "staticText",
]);

function Section({
  title,
  open,
  onToggle,
  children,
}: {
  title: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-white/10">
      <button type="button" className="flex w-full items-center justify-between px-3 py-2 text-left text-xs font-bold uppercase tracking-widest text-[var(--muted-text)]" onClick={onToggle}>
        {title}
        <span>{open ? "−" : "+"}</span>
      </button>
      {open ? <div className="space-y-2 border-t border-white/10 p-3">{children}</div> : null}
    </div>
  );
}

function pct(v: number) {
  return `${Math.round(v * 1000) / 10}%`;
}

function fromPct(raw: string) {
  const n = Number(raw);
  if (Number.isNaN(n)) return null;
  return Math.min(1, Math.max(0, n / 100));
}

export function CardEditorProperties({
  element,
  config,
  loyaltyMode,
  onUpdate,
  onDuplicate,
  onDelete,
  recentColors,
  onColorUsed,
}: {
  element: CardElement;
  config: CardTemplateConfig;
  loyaltyMode: LoyaltyMode;
  onUpdate: (patch: Partial<CardElement>) => void;
  onDuplicate: () => void;
  onDelete: () => void;
  recentColors: string[];
  onColorUsed: (color: string) => void;
}) {
  const [open, setOpen] = useState({
    position: true,
    typo: true,
    colors: false,
    appearance: false,
    data: false,
    layer: false,
    qr: element.type === "qr",
    progress: element.type === "progressBar",
    logo: element.type === "logo",
  });

  const rect = resolveElementRect(element);
  const isRequired = REQUIRED_BY_MODE[loyaltyMode].includes(element.type);
  const isText = TEXT_TYPES.has(element.type);
  const style = element.style;

  const qrStatus = useMemo(() => {
    if (element.type !== "qr") return null;
    const valid = qrSizeValid(rect);
    const overlap = qrOverlapsOthers(element.id, rect, config.elements);
    return { valid, overlap, pctWidth: rect.width * 100 };
  }, [element, rect, config.elements]);

  function patchRect(patch: Partial<typeof rect>) {
    const next = enforceElementRect(element, { ...rect, ...patch });
    onUpdate({
      x: next.x,
      y: next.y,
      width: next.width,
      height: next.height,
      anchor: "top-left",
    });
  }

  function patchStyle(patch: Partial<CardTextStyle>) {
    onUpdate({ style: { ...style, ...patch } as CardElement["style"] });
  }

  return (
    <div className="space-y-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-sm font-bold text-[var(--ink)]">{element.label ?? elementLabel(element.type)}</p>
          <p className="text-[10px] uppercase tracking-widest text-[var(--muted-text)]">{element.type}</p>
        </div>
        <div className="flex gap-1">
          <button type="button" title="Verrouiller" className="rounded px-2 py-1 text-xs hover:bg-white/10" onClick={() => onUpdate({ locked: !element.locked })}>
            {element.locked ? "🔒" : "🔓"}
          </button>
          <button type="button" title="Dupliquer" className="rounded px-2 py-1 text-xs hover:bg-white/10" onClick={onDuplicate}>⧉</button>
          <button
            type="button"
            title="Supprimer"
            className="rounded px-2 py-1 text-xs hover:bg-white/10 disabled:opacity-40"
            disabled={isRequired}
            onClick={onDelete}
          >
            ×
          </button>
        </div>
      </div>
      {isRequired ? <p className="text-[10px] text-amber-200">Élément obligatoire pour {loyaltyMode}.</p> : null}

      <Section title="Position et dimensions" open={open.position} onToggle={() => setOpen((s) => ({ ...s, position: !s.position }))}>
        <div className="grid grid-cols-2 gap-2">
          <Field label="X (%)">
            <Input type="number" step="0.1" value={pct(rect.x).replace("%", "")} onChange={(e) => { const v = fromPct(e.target.value); if (v != null) patchRect({ x: v }); }} />
          </Field>
          <Field label="Y (%)">
            <Input type="number" step="0.1" value={pct(rect.y).replace("%", "")} onChange={(e) => { const v = fromPct(e.target.value); if (v != null) patchRect({ y: v }); }} />
          </Field>
          <Field label="Largeur (%)">
            <Input type="number" step="0.1" value={pct(rect.width).replace("%", "")} onChange={(e) => { const v = fromPct(e.target.value); if (v != null) patchRect({ width: v }); }} />
          </Field>
          <Field label="Hauteur (%)">
            <Input type="number" step="0.1" value={pct(rect.height).replace("%", "")} onChange={(e) => { const v = fromPct(e.target.value); if (v != null) patchRect({ height: v }); }} />
          </Field>
        </div>
        <Field label="Rotation (°)">
          <Input type="number" min={-180} max={180} value={element.rotation ?? 0} onChange={(e) => onUpdate({ rotation: Number(e.target.value) })} />
        </Field>
        <Field label="Opacité">
          <input type="range" min={0} max={1} step={0.05} value={element.opacity ?? 1} onChange={(e) => onUpdate({ opacity: Number(e.target.value) })} className="w-full" />
        </Field>
        {element.type === "qr" ? (
          <p className="text-[10px] text-[var(--muted-text)]">QR : ratio 1:1 verrouillé.</p>
        ) : element.type === "logo" ? (
          <p className="text-[10px] text-[var(--muted-text)]">Proportions du logo : section Logo.</p>
        ) : (
          <label className="flex items-center gap-2 text-xs">
            <input type="checkbox" checked={element.lockAspectRatio ?? false} onChange={(e) => onUpdate({ lockAspectRatio: e.target.checked })} />
            Conserver les proportions
          </label>
        )}
      </Section>

      {isText ? (
        <Section title="Typographie" open={open.typo} onToggle={() => setOpen((s) => ({ ...s, typo: !s.typo }))}>
          <Field label="Police">
            <select className="w-full rounded-lg border border-white/10 bg-transparent px-2 py-1.5 text-xs" value={style?.fontFamily ?? "system"} onChange={(e) => patchStyle({ fontFamily: e.target.value as NonNullable<typeof style>["fontFamily"] })}>
              {CARD_FONT_OPTIONS.map((f) => (
                <option key={f.id} value={f.id}>{f.label}</option>
              ))}
            </select>
          </Field>
          <Field label={`Taille (${style?.fontSize ?? 16} px)`}>
            <input type="range" min={8} max={96} value={style?.fontSize ?? 16} onChange={(e) => patchStyle({ fontSize: Number(e.target.value) })} className="w-full" />
            <Input type="number" min={8} max={96} value={style?.fontSize ?? 16} onChange={(e) => patchStyle({ fontSize: Number(e.target.value) })} />
          </Field>
          <Field label="Graisse">
            <select className="w-full rounded-lg border border-white/10 bg-transparent px-2 py-1.5 text-xs" value={style?.fontWeight ?? "600"} onChange={(e) => patchStyle({ fontWeight: e.target.value as NonNullable<typeof style>["fontWeight"] })}>
              {["400", "500", "600", "700", "800"].map((w) => <option key={w} value={w}>{w}</option>)}
            </select>
          </Field>
          <div className="grid grid-cols-2 gap-2">
            <Field label="Style">
              <select className="w-full rounded-lg border border-white/10 bg-transparent px-2 py-1 text-xs" value={style?.fontStyle ?? "normal"} onChange={(e) => patchStyle({ fontStyle: e.target.value as "normal" | "italic" })}>
                <option value="normal">Normal</option>
                <option value="italic">Italique</option>
              </select>
            </Field>
            <Field label="Alignement H">
              <select className="w-full rounded-lg border border-white/10 bg-transparent px-2 py-1 text-xs" value={style?.textAlign ?? "left"} onChange={(e) => patchStyle({ textAlign: e.target.value as "left" | "center" | "right" })}>
                <option value="left">Gauche</option>
                <option value="center">Centre</option>
                <option value="right">Droite</option>
              </select>
            </Field>
            <Field label="Alignement V">
              <select className="w-full rounded-lg border border-white/10 bg-transparent px-2 py-1 text-xs" value={style?.verticalAlign ?? "center"} onChange={(e) => patchStyle({ verticalAlign: e.target.value as "top" | "center" | "bottom" })}>
                <option value="top">Haut</option>
                <option value="center">Centre</option>
                <option value="bottom">Bas</option>
              </select>
            </Field>
          </div>
          <Field label="Interligne">
            <Input type="number" step="0.1" min={0.8} max={2} value={style?.lineHeight ?? 1.2} onChange={(e) => patchStyle({ lineHeight: Number(e.target.value) })} />
          </Field>
          <Field label="Espacement lettres (px)">
            <Input type="number" step="0.5" value={style?.letterSpacing ?? 0} onChange={(e) => patchStyle({ letterSpacing: Number(e.target.value) })} />
          </Field>
          <Field label="Ajustement texte">
            <select className="w-full rounded-lg border border-white/10 bg-transparent px-2 py-1.5 text-xs" value={style?.fitMode ?? "manual"} onChange={(e) => patchStyle({ fitMode: e.target.value as "manual" | "autoShrink" | "multiline" })}>
              <option value="manual">Taille manuelle</option>
              <option value="autoShrink">Réduction automatique</option>
              <option value="multiline">Plusieurs lignes</option>
            </select>
          </Field>
          {(style?.fitMode === "autoShrink" || style?.fitMode === "multiline") ? (
            <Field label="Taille minimale (px)">
              <Input type="number" min={8} max={96} value={style?.minFontSize ?? 10} onChange={(e) => patchStyle({ minFontSize: Number(e.target.value) })} />
            </Field>
          ) : null}
          {style?.fitMode === "multiline" ? (
            <Field label="Lignes max">
              <Input type="number" min={1} max={5} value={style?.maxLines ?? 2} onChange={(e) => patchStyle({ maxLines: Number(e.target.value) })} />
            </Field>
          ) : null}
          <label className="flex items-center gap-2 text-xs">
            <input type="checkbox" checked={style?.shadow ?? false} onChange={(e) => patchStyle({ shadow: e.target.checked })} />
            Ombre du texte
          </label>
          <label className="flex items-center gap-2 text-xs">
            <input type="checkbox" checked={style?.textStroke ?? false} onChange={(e) => patchStyle({ textStroke: e.target.checked })} />
            Contour léger
          </label>
          <label className="flex items-center gap-2 text-xs">
            <input type="checkbox" checked={style?.textTransform === "uppercase"} onChange={(e) => patchStyle({ textTransform: e.target.checked ? "uppercase" : "none" })} />
            Majuscules
          </label>
        </Section>
      ) : null}

      {(isText || element.type === "progressBar") ? (
        <Section title="Couleurs" open={open.colors} onToggle={() => setOpen((s) => ({ ...s, colors: !s.colors }))}>
          {isText ? (
            <>
              <Field label="Couleur texte">
                <div className="flex gap-2">
                  <input type="color" value={style?.color ?? "#FFFFFF"} onChange={(e) => { patchStyle({ color: e.target.value }); onColorUsed(e.target.value); }} />
                  <Input value={style?.color ?? "#FFFFFF"} onChange={(e) => patchStyle({ color: e.target.value })} />
                </div>
              </Field>
              {recentColors.length ? (
                <div className="flex flex-wrap gap-1">
                  {recentColors.map((c) => (
                    <button key={c} type="button" className="h-5 w-5 rounded border border-white/20" style={{ backgroundColor: c }} onClick={() => patchStyle({ color: c })} />
                  ))}
                </div>
              ) : null}
            </>
          ) : null}
          {element.type === "progressBar" && element.progressColors ? (
            <>
              <Field label="Couleur progression">
                <input type="color" value={element.progressColors.fill} onChange={(e) => onUpdate({ progressColors: { ...element.progressColors!, fill: e.target.value } })} />
              </Field>
              <Field label="Couleur fond">
                <input type="color" value={element.progressColors.track} onChange={(e) => onUpdate({ progressColors: { ...element.progressColors!, track: e.target.value } })} />
              </Field>
              <Field label="Couleur bordure">
                <input type="color" value={element.progressColors.borderColor ?? "#FFFFFF"} onChange={(e) => onUpdate({ progressColors: { ...element.progressColors!, borderColor: e.target.value } })} />
              </Field>
            </>
          ) : null}
          <Button variant="secondary" className="w-full text-xs" onClick={() => {
            if (isText) patchStyle({ color: "#FFFFFF", opacity: 1 });
            if (element.type === "progressBar") onUpdate({ progressColors: { fill: "#875BFF", track: "#FFFFFF", radius: 8 } });
          }}>
            Réinitialiser couleurs
          </Button>
        </Section>
      ) : null}

      {element.type === "logo" ? (
        <Section title="Logo" open={open.logo} onToggle={() => setOpen((s) => ({ ...s, logo: !s.logo }))}>
          <label className="flex items-center gap-2 text-xs">
            <input
              type="checkbox"
              checked={element.logoStyle?.lockAspectRatio !== false}
              onChange={(e) =>
                onUpdate({
                  lockAspectRatio: e.target.checked,
                  logoStyle: { ...element.logoStyle, lockAspectRatio: e.target.checked },
                })
              }
            />
            Conserver les proportions
          </label>
          <Field label="Mode">
            <select className="w-full rounded-lg border border-white/10 bg-transparent px-2 py-1.5 text-xs" value={element.logoStyle?.objectFit ?? "contain"} onChange={(e) => onUpdate({ logoStyle: { ...element.logoStyle, objectFit: e.target.value as "contain" | "cover" } })}>
              <option value="contain">Contenir</option>
              <option value="cover">Couvrir</option>
            </select>
          </Field>
          <Field label="Couleur de fond">
            <div className="flex gap-2">
              <input
                type="color"
                value={element.logoStyle?.backgroundColor ?? "#000000"}
                onChange={(e) => {
                  onUpdate({ logoStyle: { ...element.logoStyle, backgroundColor: e.target.value } });
                  onColorUsed(e.target.value);
                }}
              />
              <Input
                value={element.logoStyle?.backgroundColor ?? ""}
                placeholder="Transparent"
                onChange={(e) => {
                  const v = e.target.value.trim();
                  if (!v) {
                    onUpdate({ logoStyle: { ...element.logoStyle, backgroundColor: undefined } });
                    return;
                  }
                  if (/^#[0-9a-fA-F]{6}$/.test(v)) {
                    onUpdate({ logoStyle: { ...element.logoStyle, backgroundColor: v } });
                    onColorUsed(v);
                  }
                }}
              />
            </div>
          </Field>
          <Button
            variant="secondary"
            className="w-full text-xs"
            onClick={() => onUpdate({ logoStyle: { ...element.logoStyle, backgroundColor: undefined } })}
          >
            Fond transparent
          </Button>
          <Field label="Rayon angles (px)">
            <Input type="number" min={0} max={32} value={element.logoStyle?.borderRadius ?? 12} onChange={(e) => onUpdate({ logoStyle: { ...element.logoStyle, borderRadius: Number(e.target.value) } })} />
          </Field>
          <Field label="Marge interne (px)">
            <Input type="number" min={0} max={24} value={element.logoStyle?.padding ?? 0} onChange={(e) => onUpdate({ logoStyle: { ...element.logoStyle, padding: Number(e.target.value) } })} />
          </Field>
          <label className="flex items-center gap-2 text-xs">
            <input type="checkbox" checked={element.logoStyle?.shadow ?? false} onChange={(e) => onUpdate({ logoStyle: { ...element.logoStyle, shadow: e.target.checked } })} />
            Ombre
          </label>
          <p className="text-[10px] text-[var(--muted-text)]">Image dynamique : merchant.logo</p>
        </Section>
      ) : null}

      {element.type === "qr" && qrStatus ? (
        <Section title="QR code" open={open.qr} onToggle={() => setOpen((s) => ({ ...s, qr: !s.qr }))}>
          <p className="text-xs">Taille : {qrStatus.pctWidth.toFixed(1)} % (min. {QR_MIN_SIZE * 100} %)</p>
          <p className={`text-xs ${qrStatus.valid ? "text-green-300" : "text-amber-300"}`}>
            {qrStatus.valid ? "Taille valide" : "Taille insuffisante — bloquée au minimum"}
          </p>
          {qrStatus.overlap ? <p className="text-xs text-amber-300">Un élément recouvre la zone du QR.</p> : null}
          <Button variant="secondary" className="w-full text-xs" onClick={() => {
            const size = qrRecommendedSize();
            patchRect({ width: size, height: size });
          }}>
            Taille recommandée
          </Button>
        </Section>
      ) : null}

      {element.type === "progressBar" ? (
        <Section title="Barre de progression" open={open.progress} onToggle={() => setOpen((s) => ({ ...s, progress: !s.progress }))}>
          <Field label="Orientation">
            <select
              className="w-full rounded-lg border border-white/10 bg-transparent px-2 py-1.5 text-xs"
              value={element.progressColors?.orientation ?? "horizontal"}
              onChange={(e) => onUpdate({ progressColors: { ...element.progressColors!, orientation: e.target.value as "horizontal" | "vertical" } })}
            >
              <option value="horizontal">Horizontale</option>
              <option value="vertical">Verticale</option>
            </select>
          </Field>
          <Field label="Rayon (px)">
            <Input type="number" min={0} max={32} value={element.progressColors?.radius ?? 8} onChange={(e) => onUpdate({ progressColors: { ...element.progressColors!, radius: Number(e.target.value) } })} />
          </Field>
          <Field label="Épaisseur bordure">
            <Input type="number" min={0} max={8} value={element.progressColors?.borderWidth ?? 0} onChange={(e) => onUpdate({ progressColors: { ...element.progressColors!, borderWidth: Number(e.target.value) } })} />
          </Field>
          <label className="flex items-center gap-2 text-xs">
            <input type="checkbox" checked={element.progressColors?.glow ?? false} onChange={(e) => onUpdate({ progressColors: { ...element.progressColors!, glow: e.target.checked } })} />
            Effet lumineux
          </label>
          <label className="flex items-center gap-2 text-xs">
            <input type="checkbox" checked={element.progressColors?.showLabel ?? false} onChange={(e) => onUpdate({ progressColors: { ...element.progressColors!, showLabel: e.target.checked } })} />
            Afficher le pourcentage
          </label>
        </Section>
      ) : null}

      <Section title="Données dynamiques" open={open.data} onToggle={() => setOpen((s) => ({ ...s, data: !s.data }))}>
        <p className="font-mono text-[11px] text-[var(--violet-bright)]">{element.dataKey ?? ELEMENT_DATA_KEYS[element.type]}</p>
        <p className="text-[10px] text-[var(--muted-text)]">Valeur fictive uniquement dans l&apos;aperçu éditeur.</p>
        {element.type === "staticText" ? (
          <Field label="Texte statique">
            <Input value={element.text ?? ""} onChange={(e) => onUpdate({ text: e.target.value })} />
          </Field>
        ) : null}
      </Section>

      <Section title="Calque" open={open.layer} onToggle={() => setOpen((s) => ({ ...s, layer: !s.layer }))}>
        <Field label="Ordre (z-index)">
          <Input type="number" min={0} max={999} value={element.zIndex} onChange={(e) => onUpdate({ zIndex: Number(e.target.value) })} />
        </Field>
        <Field label="Nom interne">
          <Input value={element.label ?? ""} onChange={(e) => onUpdate({ label: e.target.value })} />
        </Field>
        <label className="flex items-center gap-2 text-xs">
          <input type="checkbox" checked={element.hidden} onChange={(e) => onUpdate({ hidden: e.target.checked })} />
          Masquer dans l&apos;éditeur
        </label>
      </Section>
    </div>
  );
}
