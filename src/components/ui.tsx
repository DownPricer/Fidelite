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
    primary: "bg-primary text-primary-foreground hover:opacity-90 shadow-sm shadow-primary/20",
    secondary: "bg-white text-ink border border-border hover:bg-slate-50 shadow-sm",
    ghost: "bg-transparent text-muted hover:bg-slate-100 hover:text-ink",
    danger: "bg-rose-500 text-white hover:bg-rose-600 shadow-sm shadow-rose-200",
    success: "bg-emerald-500 text-white hover:bg-emerald-600 shadow-sm shadow-emerald-200",
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
        "w-full rounded-xl border border-border bg-white px-4 py-3 text-base text-ink outline-none transition-all placeholder:text-muted focus:border-primary focus:ring-4 focus:ring-primary/10",
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
      <span className="text-[13px] font-bold uppercase tracking-wider text-muted/80">{label}</span>
      {children}
      {hint ? <span className="block text-xs text-muted italic">{hint}</span> : null}
    </label>
  );
}

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <section className={cn("rounded-2xl bg-white p-8 shadow-premium border border-border/50", className)}>
      {children}
    </section>
  );
}

export function Alert({ children, tone = "error" }: { children: ReactNode; tone?: "error" | "ok" }) {
  return (
    <p
      role="alert"
      className={cn(
        "rounded-xl px-4 py-3.5 text-sm font-medium flex items-center gap-3",
        tone === "error" ? "bg-rose-50 text-rose-700 border border-rose-100" : "bg-emerald-50 text-emerald-700 border border-emerald-100",
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", tone === "error" ? "bg-rose-500" : "bg-emerald-500")} />
      {children}
    </p>
  );
}

export function BrandMark({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-3 font-bold tracking-tighter text-ink", className)}>
      <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/30">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-6 h-6">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      <span className="text-xl">FifeLite</span>
    </div>
  );
}
