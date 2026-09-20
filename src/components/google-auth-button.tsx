"use client";

import { useState } from "react";
import { cn } from "./ui";

function GoogleLogo() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 shrink-0">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06L5.84 9.9C6.71 7.3 9.14 5.38 12 5.38z"
      />
    </svg>
  );
}

export function GoogleAuthButton({
  href,
  disabled = false,
  disabledReason,
  className,
}: {
  href: string;
  disabled?: boolean;
  disabledReason?: string;
  className?: string;
}) {
  const [pending, setPending] = useState(false);
  const isDisabled = disabled || pending;

  return (
    <div className={className}>
      <button
        type="button"
        disabled={isDisabled}
        aria-describedby={disabledReason && disabled ? "google-auth-disabled-reason" : undefined}
        className={cn(
          "inline-flex min-h-12 w-full items-center justify-center gap-3 rounded-xl border border-[var(--stroke)] bg-white px-4 py-3 text-sm font-bold text-[#1f1f1f] shadow-sm transition-colors hover:bg-[#f8fafd] focus:outline-none focus:ring-4 focus:ring-[var(--violet)]/30 disabled:cursor-not-allowed disabled:opacity-60",
          "dark:border-white/15 dark:bg-white dark:text-[#1f1f1f] dark:hover:bg-[#f8fafd]",
        )}
        onClick={() => {
          if (isDisabled) return;
          setPending(true);
          window.location.assign(href);
        }}
      >
        <GoogleLogo />
        <span>{pending ? "Connexion avec Google..." : "Continuer avec Google"}</span>
      </button>
      {disabledReason && disabled ? (
        <p id="google-auth-disabled-reason" className="mt-2 text-xs font-medium text-[var(--muted)]">
          {disabledReason}
        </p>
      ) : null}
    </div>
  );
}

export function AuthSeparator() {
  return (
    <div className="flex items-center gap-3" aria-hidden="true">
      <span className="h-px flex-1 bg-[var(--stroke)]" />
      <span className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--muted)]">ou</span>
      <span className="h-px flex-1 bg-[var(--stroke)]" />
    </div>
  );
}
