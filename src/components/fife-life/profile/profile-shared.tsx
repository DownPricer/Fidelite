"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import type { ProfilePayload } from "@/lib/customer-profile";
import { displayFullName } from "@/lib/customer-profile";

export function profileInitials(profile: ProfilePayload) {
  const name = displayFullName(profile);
  const parts = name.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return (parts[0]?.[0] ?? profile.firstName[0] ?? "?").toUpperCase();
}

export function toneClass(tone: "gain" | "use" | "expire" | "correction" | "pending") {
  if (tone === "gain") return "text-[#9fd88a]";
  if (tone === "use") return "text-[#f18a9a]";
  if (tone === "expire") return "text-[#f0b86a]";
  if (tone === "correction") return "text-[#c4b5ff]";
  return "text-[var(--muted)]";
}

export function ProfileShell({
  title,
  backHref,
  settingsHref,
  toast,
  children,
}: {
  title: string;
  backHref: string;
  settingsHref?: string;
  toast?: string | null;
  children: ReactNode;
}) {
  return (
    <main className="profile-scene obsidian-scene min-h-dvh text-[var(--ink-soft)]">
      <div className="profile-halo-top" aria-hidden />
      <div className="profile-halo-mid" aria-hidden />

      <div className="relative z-[1] mx-auto flex min-h-dvh w-full max-w-md flex-col px-5 pb-10 pt-[max(0.75rem,env(safe-area-inset-top))] fife-page-shell fife-profile-layout">
        <header className="flex shrink-0 items-center justify-between">
          <Link href={backHref} className="back-btn-glassy grid h-10 w-10 place-items-center rounded-full text-sm">
            ←
          </Link>
          <h1 className="text-sm font-bold uppercase tracking-[0.18em] text-[var(--ink)]">{title}</h1>
          {settingsHref ? (
            <Link
              href={settingsHref}
              aria-label="Paramètres"
              className="settings-btn-glassy grid h-9 w-9 place-items-center rounded-full"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--violet-bright)]" />
            </Link>
          ) : (
            <div className="w-9" aria-hidden />
          )}
        </header>

        {toast ? (
          <p className="profile-toast mt-4 text-center text-xs font-medium text-[#9fd88a]" role="status">
            {toast}
          </p>
        ) : null}

        {children}
      </div>
    </main>
  );
}

export function MerchantLogo({ name, logoUrl }: { name: string; logoUrl: string | null }) {
  if (logoUrl) {
    return (
      <img src={logoUrl} alt="" className="h-9 w-9 shrink-0 rounded-xl object-cover ring-1 ring-white/10" />
    );
  }
  return (
    <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white/8 text-xs font-bold text-[var(--ink-soft)] ring-1 ring-white/10">
      {name.slice(0, 1).toUpperCase()}
    </div>
  );
}

export function SettingsRow({
  icon,
  label,
  value,
  hint,
  onClick,
}: {
  icon: string;
  label: string;
  value: string;
  hint?: string;
  onClick: () => void;
}) {
  return (
    <button type="button" onClick={onClick} className="profile-settings-row">
      <span className="profile-settings-icon" aria-hidden>
        {icon}
      </span>
      <span className="min-w-0 flex-1 text-left">
        <span className="block text-xs text-[var(--muted)]">{label}</span>
        <span className="block truncate text-sm font-medium text-[var(--ink)]">{value || "—"}</span>
        {hint ? <span className="mt-0.5 block text-[11px] text-[#f0b86a]">{hint}</span> : null}
      </span>
      <span className="text-[var(--muted)]" aria-hidden>
        ›
      </span>
    </button>
  );
}

export function ToggleRow({
  label,
  checked,
  disabled,
  onChange,
}: {
  label: string;
  checked: boolean;
  disabled?: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="profile-toggle-row">
      <span className="text-sm text-[var(--ink-soft)]">{label}</span>
      <input
        type="checkbox"
        className="profile-toggle"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
      />
    </label>
  );
}

export function PasswordStrength({ password }: { password: string }) {
  const score =
    password.length >= 12 ? 3 : password.length >= 8 && /[A-Z]/.test(password) && /[0-9]/.test(password) ? 2 : password.length >= 8 ? 1 : 0;
  const labels = ["Trop faible", "Acceptable", "Bon", "Fort"];
  const colors = ["bg-red-500/60", "bg-amber-500/60", "bg-emerald-500/60", "bg-emerald-400/80"];
  if (!password) return null;
  return (
    <div className="mt-2">
      <div className="flex gap-1">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className={`h-1 flex-1 rounded-full ${i <= score ? colors[score] : "bg-white/10"}`} />
        ))}
      </div>
      <p className="mt-1 text-[11px] text-[var(--muted)]">{labels[score]}</p>
    </div>
  );
}

export const APP_VERSION = "1.0.0";

export type EditField =
  | "firstName"
  | "lastName"
  | "displayName"
  | "phone"
  | "email"
  | "addressLine1"
  | "addressLine2"
  | "postalCode"
  | "city"
  | "country"
  | "password";

export const fieldLabels: Record<EditField, string> = {
  firstName: "Prénom",
  lastName: "Nom",
  displayName: "Nom d'affichage",
  phone: "Téléphone",
  email: "Adresse e-mail",
  addressLine1: "Adresse",
  addressLine2: "Complément d'adresse",
  postalCode: "Code postal",
  city: "Ville",
  country: "Pays",
  password: "Mot de passe",
};

export function demoQuery(preview: boolean) {
  return preview ? "?demo=1" : "";
}
