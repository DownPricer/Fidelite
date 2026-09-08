"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Alert, Button, Card, EmployeeBrandMark, Field, Input } from "@/components/ui";

export function EmployeeInvitationScreen() {
  const params = useSearchParams();
  const token = params.get("token") ?? "";
  const [loading, setLoading] = useState(true);
  const [inviteError, setInviteError] = useState<string | null>(null);
  const [invite, setInvite] = useState<{ firstName: string; merchantName: string; message?: string | null } | null>(
    null,
  );
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

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
    const response = await fetch("/api/employe/auth/accept-invitation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        token,
        password: form.get("password"),
      }),
    });
    const data = (await response.json()) as { error?: string };
    setPending(false);
    if (!response.ok) {
      setSubmitError(data.error ?? "Activation impossible.");
      return;
    }
    window.location.href = "/employe/connexion";
  }

  return (
    <main className="obsidian-scene flex min-h-dvh flex-col items-center justify-center px-6 py-10">
      <div className="w-full max-w-[390px]">
        <div className="mb-8 flex flex-col items-center text-center">
          <EmployeeBrandMark className="mb-4" />
          <h1 className="text-2xl font-black tracking-tight text-[var(--ink)]">Activer votre accès</h1>
        </div>

        <Card className="glass-panel border-0 p-8 shadow-none">
          {loading ? <p className="text-center text-sm text-[var(--muted)]">Vérification de l&apos;invitation...</p> : null}
          {inviteError ? <Alert>{inviteError}</Alert> : null}
          {invite ? (
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
              <form className="space-y-5" onSubmit={(event) => void onSubmit(event)}>
                {submitError ? <Alert>{submitError}</Alert> : null}
                <Field label="Nouveau mot de passe" hint="8 caractères minimum">
                  <Input name="password" type="password" autoComplete="new-password" required minLength={8} />
                </Field>
                <Button type="submit" className="w-full py-4" disabled={pending}>
                  {pending ? "Activation..." : "Activer mon compte"}
                </Button>
              </form>
            </>
          ) : null}
        </Card>
      </div>
    </main>
  );
}
