"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Alert, Button, Card, EmployeeBrandMark, Field, Input } from "@/components/ui";

export function EmployeeInvitationScreen() {
  const params = useSearchParams();
  const token = params.get("token") ?? "";
  const [loading, setLoading] = useState(true);
  const [inviteError, setInviteError] = useState<string | null>(null);
  const [invite, setInvite] = useState<{
    firstName: string;
    merchantName: string;
    message?: string | null;
    expiresAt?: string;
  } | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [activated, setActivated] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    if (!token) {
      setInviteError("Lien d'invitation invalide.");
      setLoading(false);
      return;
    }
    void fetch(`/api/employe/auth/invitation?token=${encodeURIComponent(token)}`)
      .then(async (response) => {
        const data = (await response.json()) as { error?: string; invitation?: typeof invite };
        if (!response.ok) {
          setInviteError(data.error ?? "Invitation invalide.");
          return;
        }
        setInvite(data.invitation ?? null);
      })
      .catch(() => setInviteError("Impossible de vérifier l'invitation."))
      .finally(() => setLoading(false));
  }, [token]);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setSubmitError(null);
    const form = new FormData(event.currentTarget);
    const password = String(form.get("password") ?? "");
    const passwordConfirm = String(form.get("passwordConfirm") ?? "");

    if (password !== passwordConfirm) {
      setSubmitError("Les mots de passe ne correspondent pas.");
      setPending(false);
      return;
    }

    const response = await fetch("/api/employe/auth/accept-invitation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password, passwordConfirm }),
    });
    const data = (await response.json()) as { error?: string };
    setPending(false);
    if (!response.ok) {
      setSubmitError(data.error ?? "Activation impossible.");
      return;
    }
    setActivated(true);
  }

  function formatExpiry(iso?: string) {
    if (!iso) return null;
    return new Date(iso).toLocaleString("fr-FR", {
      weekday: "long",
      day: "numeric",
      month: "long",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return (
    <main className="obsidian-scene flex min-h-dvh flex-col items-center justify-center px-6 py-10">
      <div className="w-full max-w-[390px]">
        <div className="mb-8 flex flex-col items-center text-center">
          <EmployeeBrandMark className="mb-4" />
          <h1 className="text-2xl font-black tracking-tight text-[var(--ink)]">
            {activated ? "Compte activé" : "Activer votre accès"}
          </h1>
        </div>

        <Card className="glass-panel border-0 p-8 shadow-none">
          {loading ? <p className="text-center text-sm text-[var(--muted)]">Vérification de l&apos;invitation...</p> : null}
          {inviteError ? <Alert>{inviteError}</Alert> : null}

          {activated ? (
            <div className="space-y-5 text-center">
              <Alert tone="ok">Votre compte employé est maintenant actif.</Alert>
              <p className="text-sm text-[var(--muted-strong)]">
                Vous pouvez vous connecter à l&apos;application employé pour commencer à scanner les cartes clients.
              </p>
              <Link href="/employe/connexion">
                <Button className="w-full py-4">Ouvrir la connexion employé</Button>
              </Link>
            </div>
          ) : null}

          {!activated && invite ? (
            <>
              <p className="mb-4 text-sm text-[var(--muted-strong)]">
                Bonjour {invite.firstName}, définissez votre mot de passe pour rejoindre{" "}
                <strong className="text-[var(--ink)]">{invite.merchantName}</strong>.
              </p>
              {invite.message ? (
                <p className="mb-4 rounded-xl border border-white/10 bg-white/5 p-3 text-sm italic text-[var(--muted-strong)]">
                  {invite.message}
                </p>
              ) : null}
              {invite.expiresAt ? (
                <p className="mb-4 text-xs text-[var(--muted)]">
                  Ce lien expire le {formatExpiry(invite.expiresAt)}.
                </p>
              ) : null}
              <form className="space-y-5" onSubmit={(event) => void onSubmit(event)}>
                {submitError ? <Alert>{submitError}</Alert> : null}
                <Field label="Nouveau mot de passe" hint="8 caractères minimum">
                  <div className="relative">
                    <Input
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      required
                      minLength={8}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-[var(--muted)]"
                      onClick={() => setShowPassword((v) => !v)}
                    >
                      {showPassword ? "Masquer" : "Afficher"}
                    </button>
                  </div>
                </Field>
                <Field label="Confirmer le mot de passe">
                  <div className="relative">
                    <Input
                      name="passwordConfirm"
                      type={showConfirm ? "text" : "password"}
                      autoComplete="new-password"
                      required
                      minLength={8}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-[var(--muted)]"
                      onClick={() => setShowConfirm((v) => !v)}
                    >
                      {showConfirm ? "Masquer" : "Afficher"}
                    </button>
                  </div>
                </Field>
                <Button type="submit" className="w-full py-4" disabled={pending}>
                  {pending ? "Activation..." : "Activer mon compte employé"}
                </Button>
              </form>
            </>
          ) : null}
        </Card>
      </div>
    </main>
  );
}
