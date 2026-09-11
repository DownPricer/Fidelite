"use client";

import type { CardNextRewardStyle } from "@/lib/card-template-schema";
import { CARD_FONT_OPTIONS } from "@/lib/card-template-fonts";
import { Field, Input } from "@/components/ui";
import {
  defaultNextRewardStyle,
  NEXT_REWARD_STYLE_LABELS,
  NEXT_REWARD_STYLE_VARIANTS,
  type NextRewardStyleVariant,
} from "@/lib/next-reward-styles";

export function NextRewardStylePicker({
  style,
  primaryColor,
  onChange,
}: {
  style?: CardNextRewardStyle | null;
  primaryColor: string;
  onChange: (next: CardNextRewardStyle) => void;
}) {
  const resolved = style ?? defaultNextRewardStyle(primaryColor);

  function patch(partial: Partial<CardNextRewardStyle>) {
    onChange({ ...resolved, ...partial });
  }

  return (
    <div className="space-y-2">
      <p className="text-xs font-bold uppercase tracking-widest text-[var(--muted-text)]">
        Style du prochain avantage
      </p>
      <div className="grid grid-cols-2 gap-2">
        {NEXT_REWARD_STYLE_VARIANTS.map((variant) => (
          <button
            key={variant}
            type="button"
            onClick={() => patch({ variant })}
            className={`rounded-lg border p-2 text-left text-[10px] transition ${
              resolved.variant === variant
                ? "border-[var(--violet-bright)] bg-white/10 ring-1 ring-[var(--violet-bright)]"
                : "border-white/10 hover:bg-white/5"
            }`}
          >
            {NEXT_REWARD_STYLE_LABELS[variant as NextRewardStyleVariant]}
          </button>
        ))}
      </div>
      <Field label="Couleur principale">
        <input type="color" value={resolved.primaryColor} onChange={(e) => patch({ primaryColor: e.target.value })} />
      </Field>
      <Field label="Couleur du texte">
        <input type="color" value={resolved.textColor} onChange={(e) => patch({ textColor: e.target.value })} />
      </Field>
      <Field label="Fond">
        <input
          type="color"
          value={resolved.backgroundColor}
          onChange={(e) => patch({ backgroundColor: e.target.value })}
        />
      </Field>
      <Field label="Bordure">
        <input
          type="color"
          value={resolved.borderColor ?? resolved.primaryColor}
          onChange={(e) => patch({ borderColor: e.target.value })}
        />
      </Field>
      <Field label="Épaisseur bordure">
        <Input
          type="number"
          min={0}
          max={8}
          value={resolved.borderWidth ?? 1}
          onChange={(e) => patch({ borderWidth: Number(e.target.value) })}
        />
      </Field>
      <Field label="Police">
        <select
          className="w-full rounded-lg border border-white/10 bg-transparent px-2 py-1.5 text-xs"
          value={resolved.fontFamily ?? "system"}
          onChange={(e) => patch({ fontFamily: e.target.value as CardNextRewardStyle["fontFamily"] })}
        >
          {CARD_FONT_OPTIONS.map((font) => (
            <option key={font.id} value={font.id}>
              {font.label}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Taille">
        <Input
          type="number"
          min={8}
          max={48}
          value={resolved.fontSize ?? 12}
          onChange={(e) => patch({ fontSize: Number(e.target.value) })}
        />
      </Field>
      <Field label="Icône">
        <Input maxLength={2} value={resolved.icon ?? "🎁"} onChange={(e) => patch({ icon: e.target.value })} />
      </Field>
      <Field label="Alignement">
        <select
          className="w-full rounded-lg border border-white/10 bg-transparent px-2 py-1.5 text-xs"
          value={resolved.textAlign ?? "center"}
          onChange={(e) => patch({ textAlign: e.target.value as "left" | "center" | "right" })}
        >
          <option value="left">Gauche</option>
          <option value="center">Centre</option>
          <option value="right">Droite</option>
        </select>
      </Field>
      <label className="flex items-center gap-2 text-xs">
        <input type="checkbox" checked={resolved.glow ?? false} onChange={(e) => patch({ glow: e.target.checked })} />
        Effet lumineux
      </label>
      <label className="flex items-center gap-2 text-xs">
        <input
          type="checkbox"
          checked={resolved.shadow ?? true}
          onChange={(e) => patch({ shadow: e.target.checked })}
        />
        Ombre
      </label>
      <label className="flex items-center gap-2 text-xs">
        <input
          type="checkbox"
          checked={resolved.showRemaining !== false}
          onChange={(e) => patch({ showRemaining: e.target.checked })}
        />
        Afficher la quantité manquante
      </label>
      <label className="flex items-center gap-2 text-xs">
        <input
          type="checkbox"
          checked={resolved.hideWhenComplete ?? false}
          onChange={(e) => patch({ hideWhenComplete: e.target.checked })}
        />
        Masquer quand tout est débloqué
      </label>
    </div>
  );
}
