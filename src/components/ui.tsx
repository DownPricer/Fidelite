import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode } from "react";

export function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export function Button({
  children,
  variant = "primary",
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "success";
}) {
  const styles = {
    primary:
      "bg-[var(--violet)] text-[var(--ink)] hover:bg-[var(--violet-bright)] shadow-[0_0_0_1px_var(--stroke-strong)] shadow-premium",
    secondary:
      "bg-[var(--surface-raised)] text-[var(--ink-soft)] border border-[var(--stroke)] hover:bg-[var(--surface-strong)]",
    ghost:
      "bg-transparent text-[var(--muted-strong)] hover:bg-[rgba(255,255,255,0.05)] hover:text-[var(--ink)]",
    danger:
      "bg-[var(--danger)] text-[var(--ink)] hover:brightness-110 shadow-[0_0_0_1px_rgba(241,93,116,0.6)]",
    success:
      "bg-[var(--positive)] text-[var(--void)] hover:brightness-110 shadow-[0_0_0_1px_rgba(56,217,169,0.6)]",
  }[variant];
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-xl px-6 py-3.5 text-sm font-bold tracking-tight transition-transform duration-200 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50",
        styles,
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "w-full rounded-xl border border-[var(--stroke)] bg-[var(--surface-raised)] px-4 py-3 text-base text-[var(--ink)] outline-none transition-colors placeholder:text-[var(--muted)] focus:border-[var(--violet)] focus:ring-4 focus:ring-[var(--violet)]/30",
        className,
      )}
      {...props}
    />
  );
}

export function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: ReactNode;
  hint?: string;
}) {
  return (
    <label className="block space-y-2">
      <span className="text-[13px] font-bold uppercase tracking-wider text-[var(--muted-text)]">{label}</span>
      {children}
      {hint ? <span className="block text-xs text-[var(--muted-text)] italic">{hint}</span> : null}
    </label>
  );
}

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <section
      className={cn(
        "rounded-2xl border border-[var(--stroke)] bg-[var(--surface-raised)] p-8 text-[var(--ink)] shadow-premium",
        className,
      )}
    >
      {children}
    </section>
  );
}

export function Alert({ children, tone = "error" }: { children: ReactNode; tone?: "error" | "ok" }) {
  return (
    <p
      role="alert"
      className={cn(
        "flex items-center gap-3 rounded-xl px-4 py-3.5 text-sm font-medium",
        tone === "error"
          ? "border border-[var(--danger)]/60 bg-[rgba(241,93,116,0.18)] text-[var(--ink)]"
          : "border border-[var(--positive)]/60 bg-[rgba(56,217,169,0.16)] text-[var(--ink)]",
      )}
    >
      <span
        className={cn(
          "h-1.5 w-1.5 rounded-full",
          tone === "error" ? "bg-[var(--danger)]" : "bg-[var(--positive)]",
        )}
      />
      {children}
    </p>
  );
}

export function BrandMark({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 font-semibold tracking-tight text-[var(--ink)]",
        className,
      )}
    >
      <span className="grid h-10 w-10 place-items-center rounded-xl bg-[radial-gradient(circle_at_0%_0%,#b86cff,#4c228c)] text-[var(--ink)] shadow-[0_18px_40px_rgba(0,0,0,0.85)] ring-1 ring-[var(--stroke-strong)]">
        <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6" fill="none">
          <path
            d="M4 12.5C4 8.91 6.91 6 10.5 6h3A6.5 6.5 0 0120 12.5c0 3.59-2.91 6.5-6.5 6.5h-3A6.5 6.5 0 014 12.5Z"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M8 12.5c0-2.071 1.679-3.75 3.75-3.75S15.5 10.429 15.5 12.5 13.821 16.25 11.75 16.25 8 14.571 8 12.5Z"
            fill="currentColor"
            opacity="0.85"
          />
        </svg>
      </span>
      <span className="text-xl font-semibold tracking-tight">Fife Life</span>
    </div>
  );
}
