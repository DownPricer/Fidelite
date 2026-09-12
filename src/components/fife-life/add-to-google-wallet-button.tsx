"use client";

import { useState } from "react";

const BADGE_SRC = "/google-wallet/add-to-google-wallet-fr.svg";

export function AddToGoogleWalletButton({
  endpoint,
  disabled = false,
  className = "",
}: {
  endpoint: string;
  disabled?: boolean;
  className?: string;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function addToWallet() {
    if (busy || disabled) return;
    setBusy(true);
    setError(null);
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
      });
      const data = (await response.json()) as { saveUrl?: string; error?: string };
      if (!response.ok || !data.saveUrl) {
        throw new Error(data.error ?? "Google Wallet est temporairement indisponible.");
      }
      window.location.href = data.saveUrl;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Google Wallet est temporairement indisponible.");
      setBusy(false);
    }
  }

  return (
    <div className={`google-wallet-action flex flex-col items-center gap-2 ${className}`}>
      <button
        type="button"
        onClick={() => void addToWallet()}
        disabled={busy || disabled}
        aria-busy={busy}
        aria-label="Ajouter à Google Wallet"
        className="inline-flex min-h-12 touch-manipulation items-center justify-center disabled:cursor-not-allowed disabled:opacity-55"
      >
        <img
          src={BADGE_SRC}
          alt="Ajouter à Google Wallet"
          className="h-12 w-auto select-none"
          draggable={false}
        />
      </button>
      {busy ? <p className="text-xs font-semibold text-[var(--ink-soft)]">Préparation de la carte…</p> : null}
      {error ? (
        <p className="max-w-xs text-center text-xs font-semibold text-[var(--danger)]">{error}</p>
      ) : null}
    </div>
  );
}
