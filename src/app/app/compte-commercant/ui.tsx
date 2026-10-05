"use client";

import { useState } from "react";
import { Alert, BrandMark, Button, Card, Field, Input, PasswordInput } from "@/components/ui";

export function MerchantSignupAccountForm({ email }: { email: string }) {
  const [mode, setMode] = useState<"register" | "login">("register");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError(null);
    const form = new FormData(event.currentTarget);
    try {
      const response = await fetch("/api/merchant/signup/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode,
          password: form.get("password"),
        }),
      });
      const data = (await response.json()) as { error?: string; checkoutUrl?: string };
      if (!response.ok) {
        setError(data.error ?? "Impossible de finaliser le compte.");
        return;
      }
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
        return;
      }
      setError("Paiement indisponible pour le moment. Réessayez depuis votre espace facturation.");
    } catch {
      setError("Impossible de finaliser le compte.");
    } finally {
      setPending(false);
    }
  }

  return (
    <main className="login-scene obsidian-scene flex min-h-dvh flex-col items-center justify-center px-5 py-10">
      <div className="w-full max-w-[480px]">
        <div className="mb-8 flex flex-col items-center text-center">
          <BrandMark className="mb-6 scale-110" />
          <h1 className="text-2xl font-black text-[var(--ink)]">Finalisez votre compte commerçant</h1>
          <p className="mt-2 text-sm text-[var(--muted-strong)]">
            Code validé pour <strong className="text-[var(--ink)]">{email}</strong>. Créez votre mot de passe ou connectez-vous si vous avez déjà un compte Fideto avec cet e-mail.
          </p>
        </div>

        <Card className="glass-panel border-0 p-6 sm:p-8">
          <div className="mb-6 flex gap-2">
            <Button type="button" variant={mode === "register" ? "primary" : "ghost"} className="flex-1" onClick={() => setMode("register")}>
              Créer mon compte
            </Button>
            <Button type="button" variant={mode === "login" ? "primary" : "ghost"} className="flex-1" onClick={() => setMode("login")}>
              Me connecter
            </Button>
          </div>
          <form className="space-y-5" onSubmit={(e) => void onSubmit(e)}>
            {error ? <Alert>{error}</Alert> : null}
            <Field label="Mot de passe">
              <PasswordInput name="password" required minLength={8} autoComplete={mode === "register" ? "new-password" : "current-password"} />
            </Field>
            <Button type="submit" className="w-full" disabled={pending}>
              {pending ? "Redirection vers le paiement…" : "Continuer vers le paiement sécurisé"}
            </Button>
          </form>
          <p className="mt-4 text-center text-xs text-[var(--muted)]">
            Vous serez redirigé vers Stripe pour régler l&apos;abonnement correspondant à la formule validée par Fideto.
          </p>
        </Card>
      </div>
    </main>
  );
}
