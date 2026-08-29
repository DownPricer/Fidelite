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
      "bg-[var(--teal)] text-white hover:bg-[var(--teal-hover)] shadow-sm shadow-[var(--teal)]/20",
    secondary:
      "bg-[var(--panel-bg)] text-[var(--panel-text)] border border-[var(--border)] hover:bg-[var(--page-bg)] shadow-sm",
    ghost:
      "bg-transparent text-[var(--muted-text)] hover:bg-[var(--page-bg)] hover:text-[var(--panel-text)]",
    danger: "bg-[var(--danger)] text-white hover:opacity-90 shadow-sm",
    success: "bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm",
  }[variant];
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-xl px-6 py-3.5 text-sm font-bold tracking-tight transition-all active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50",
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
        "w-full rounded-xl border border-[var(--border)] bg-[var(--panel-bg)] px-4 py-3 text-base text-[var(--panel-text)] outline-none transition-all placeholder:text-[var(--muted-text)] focus:border-[var(--teal)] focus:ring-4 focus:ring-[var(--teal)]/10",
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
        "rounded-2xl border border-[var(--border)] bg-[var(--panel-bg)] p-8 text-[var(--panel-text)] shadow-premium",
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
          ? "border border-rose-200 bg-rose-50 text-[var(--danger)]"
          : "border border-emerald-200 bg-emerald-50 text-emerald-800",
      )}
    >
      <span
        className={cn(
          "h-1.5 w-1.5 rounded-full",
          tone === "error" ? "bg-[var(--danger)]" : "bg-emerald-600",
        )}
      />
      {children}
    </p>
  );
}

export function BrandMark({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-3 font-bold tracking-tighter text-[var(--panel-text)]", className)}>
      <span className="grid h-10 w-10 place-items-center rounded-xl bg-[var(--teal)] text-white shadow-lg shadow-[var(--teal)]/30">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="h-6 w-6">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      <span className="text-xl">FifeLite</span>
    </div>
  );
}
