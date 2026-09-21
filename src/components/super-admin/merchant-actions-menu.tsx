"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui";

export type MerchantQuickAction = "suspend" | "reactivate" | "archive";

const ACTION_LABEL: Record<MerchantQuickAction, string> = {
  suspend: "Suspendre",
  reactivate: "Réactiver",
  archive: "Archiver",
};

const ACTION_DESCRIPTION: Record<MerchantQuickAction, string> = {
  suspend: "Le commerce et son équipe perdent l'accès immédiatement. Les clients gardent leurs cartes.",
  reactivate: "Le commerce et son équipe retrouvent l'accès immédiatement.",
  archive: "Le commerce est masqué du réseau. Cette action reste réversible depuis la fiche commerce.",
};

/**
 * Menu d'actions rapides (Suspendre/Réactiver, Archiver) + confirmation avec ré-authentification
 * mot de passe — remplace les anciens window.prompt()/window.alert() dupliqués dans la liste et
 * la fiche commerce, par un composant partagé unique.
 */
export function MerchantActionsMenu({
  status,
  onAction,
  label = "…",
}: {
  status: string;
  onAction: (action: MerchantQuickAction, password: string) => Promise<{ ok: boolean; error?: string }>;
  /** "…" renders a compact icon-only trigger; any other label renders a full button matching Button/secondary sizing. */
  label?: string;
}) {
  const iconVariant = label === "…";
  const [pending, setPending] = useState<MerchantQuickAction | null>(null);
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const detailsRef = useRef<HTMLDetailsElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const canSuspend = status === "ACTIVE" || status === "TRIAL";

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (pending && !dialog.open) {
      dialog.showModal();
      requestAnimationFrame(() => passwordRef.current?.focus());
    }
    if (!pending && dialog.open) dialog.close();
  }, [pending]);

  function requestAction(action: MerchantQuickAction) {
    if (detailsRef.current) detailsRef.current.open = false;
    setPending(action);
    setPassword("");
    setError(null);
  }

  function cancel() {
    setPending(null);
    setPassword("");
    setError(null);
  }

  async function confirm() {
    if (!pending || !password) {
      setError("Mot de passe requis.");
      return;
    }
    setSubmitting(true);
    setError(null);
    const result = await onAction(pending, password);
    setSubmitting(false);
    if (!result.ok) {
      setError(result.error ?? "Action impossible.");
      return;
    }
    cancel();
  }

  return (
    <>
      <details ref={detailsRef} className="relative">
        <summary
          className={
            iconVariant
              ? "grid h-9 min-w-9 cursor-pointer list-none place-items-center rounded-full border border-[var(--stroke)] bg-[var(--surface)] px-3 text-[var(--muted-text)] transition hover:text-[var(--ink)] [&::-webkit-details-marker]:hidden"
              : "inline-flex h-full cursor-pointer list-none items-center rounded-xl border border-[var(--stroke)] bg-[var(--surface-raised)] px-4 py-3 text-sm font-bold text-[var(--ink-soft)] transition hover:text-[var(--ink)] [&::-webkit-details-marker]:hidden"
          }
        >
          <span className={iconVariant ? "text-sm font-bold leading-none" : undefined}>{label}</span>
        </summary>
        <div className="absolute right-0 z-20 mt-2 w-44 rounded-2xl border border-[var(--stroke)] bg-[var(--surface-strong)] p-2 text-xs shadow-2xl">
          {canSuspend ? (
            <button
              type="button"
              className="block w-full rounded-xl px-3 py-2 text-left text-[var(--danger)] hover:bg-[var(--surface)]"
              onClick={() => requestAction("suspend")}
            >
              Suspendre
            </button>
          ) : (
            <button
              type="button"
              className="block w-full rounded-xl px-3 py-2 text-left text-[var(--panel-text)] hover:bg-[var(--surface)]"
              onClick={() => requestAction("reactivate")}
            >
              Réactiver
            </button>
          )}
          <button
            type="button"
            className="block w-full rounded-xl px-3 py-2 text-left text-[var(--panel-text)] hover:bg-[var(--surface)]"
            onClick={() => requestAction("archive")}
          >
            Archiver
          </button>
        </div>
      </details>

      <dialog ref={dialogRef} className="confirm-dialog" onCancel={cancel} onClose={cancel}>
        {pending ? (
          <>
            <p className="confirm-dialog-title">{ACTION_LABEL[pending]} ce commerce ?</p>
            <p className="confirm-dialog-desc">{ACTION_DESCRIPTION[pending]}</p>
            <label className="mt-4 block text-xs font-bold uppercase tracking-widest text-[var(--muted-text)]">
              Mot de passe super-admin
              <input
                ref={passwordRef}
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    void confirm();
                  }
                }}
                className="mt-1.5 w-full rounded-xl border border-[var(--stroke)] bg-[var(--surface)] px-3 py-2 text-sm font-normal normal-case text-[var(--panel-text)]"
                autoComplete="current-password"
              />
            </label>
            {error ? <p className="mt-2 text-xs font-semibold text-[var(--danger)]">{error}</p> : null}
            <div className="confirm-dialog-actions">
              <Button type="button" variant="ghost" className="h-10 px-4 text-xs" onClick={cancel}>
                Annuler
              </Button>
              <Button
                type="button"
                variant={pending === "archive" || pending === "suspend" ? "danger" : "primary"}
                className="h-10 px-4 text-xs"
                disabled={submitting}
                onClick={() => void confirm()}
              >
                {submitting ? "Confirmation…" : ACTION_LABEL[pending]}
              </Button>
            </div>
          </>
        ) : null}
      </dialog>
    </>
  );
}
