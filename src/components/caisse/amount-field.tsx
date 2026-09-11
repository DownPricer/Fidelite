"use client";

import { formatEurosFromCents, tryParsePurchaseAmountToCents } from "@/lib/money";
import { cn } from "@/components/ui";

const KEYS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", ",", "0", "⌫"] as const;

export function AmountField({
  value,
  onChange,
  disabled,
  showKeypad = false,
  compact = false,
}: {
  value: string;
  onChange: (next: string) => void;
  disabled?: boolean;
  showKeypad?: boolean;
  compact?: boolean;
}) {
  const parsed = value.trim() ? tryParsePurchaseAmountToCents(value) : null;

  function press(key: (typeof KEYS)[number]) {
    if (disabled) return;
    if (key === "⌫") {
      onChange(value.slice(0, -1));
      return;
    }
    if (key === ",") {
      if (value.includes(",") || value.includes(".")) return;
      onChange(value ? `${value},` : "0,");
      return;
    }
    const next = `${value}${key}`;
    const check = tryParsePurchaseAmountToCents(next.endsWith(",") ? `${next}0` : next);
    if (!check.ok && next !== "0," && !/^\d+,$/.test(next)) return;
    onChange(next);
  }

  return (
    <div className={cn("w-full min-w-0", compact ? "space-y-2" : "space-y-3")}>
      <label className="block space-y-2">
        <span className="text-[13px] font-bold uppercase tracking-wider text-[var(--muted-text)]">
          Montant de l&apos;achat
        </span>
        <input
          inputMode="decimal"
          enterKeyHint="done"
          autoComplete="off"
          value={value}
          disabled={disabled}
          onChange={(event) => onChange(event.target.value)}
          placeholder="0,00"
          className={cn(
            "w-full min-w-0 rounded-xl border border-[var(--stroke)] bg-[var(--surface-raised)] px-4 font-black tracking-tight text-[var(--ink)] outline-none focus:border-[var(--violet)] focus:ring-4 focus:ring-[var(--violet)]/30",
            compact ? "py-3 text-2xl" : "py-4 text-3xl",
          )}
        />
      </label>
      {!compact ? (
        <p className="text-sm font-semibold text-[var(--violet-bright)]">
          {parsed?.ok ? formatEurosFromCents(parsed.cents) : value.trim() ? "Montant invalide" : "0,00 €"}
        </p>
      ) : null}
      {showKeypad ? (
        <div className="grid grid-cols-3 gap-2">
          {KEYS.map((key) => (
            <button
              key={key}
              type="button"
              disabled={disabled}
              onClick={() => press(key)}
              className={cn(
                "rounded-xl border border-[var(--stroke)] bg-[var(--surface-raised)] py-3 text-xl font-black text-[var(--ink)] active:scale-[0.98] disabled:opacity-50",
                key === "⌫" && "text-[var(--muted-strong)]",
              )}
            >
              {key}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
