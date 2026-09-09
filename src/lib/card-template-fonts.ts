/** Polices réellement disponibles dans l'application (wallet + éditeur). */
export const CARD_FONT_OPTIONS = [
  { id: "system", label: "Manrope / système", css: 'var(--font-manrope), "Segoe UI", system-ui, sans-serif' },
  { id: "card", label: "Card Sans", css: '"Card Sans", "Segoe UI", sans-serif' },
  { id: "serif", label: "Serif", css: 'Georgia, "Times New Roman", serif' },
  { id: "mono", label: "Monospace", css: 'ui-monospace, "Cascadia Code", monospace' },
] as const;

export type CardFontId = (typeof CARD_FONT_OPTIONS)[number]["id"];

export function cardFontCss(id: CardFontId | string | undefined) {
  if (id === "display") return CARD_FONT_OPTIONS.find((f) => f.id === "card")!.css;
  return CARD_FONT_OPTIONS.find((f) => f.id === id)?.css ?? CARD_FONT_OPTIONS[0].css;
}
