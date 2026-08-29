"use client";

import { useState } from "react";
import { Alert, Button, Card, Field, Input } from "@/components/ui";

export default function ChangePasswordPage() {
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/auth/change-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        currentPassword: form.get("currentPassword"),
        nextPassword: form.get("nextPassword"),
      }),
    });
    const data = await response.json();
    if (!response.ok) {
      setError(data.error ?? "Modification impossible.");
      return;
    }
    setOk(true);
  }

  return (
    <main className="mx-auto max-w-md px-6 py-10">
      <h1 className="text-3xl font-semibold">Nouveau mot de passe</h1>
      <Card className="mt-6">
        <form className="space-y-4" onSubmit={(event) => void onSubmit(event)}>
          {error ? <Alert>{error}</Alert> : null}
          {ok ? <Alert tone="ok">Mot de passe mis à jour.</Alert> : null}
          <Field label="Mot de passe actuel">
            <Input name="currentPassword" type="password" required />
          </Field>
          <Field label="Nouveau mot de passe">
            <Input name="nextPassword" type="password" required minLength={8} />
          </Field>
          <Button className="w-full">Enregistrer</Button>
        </form>
      </Card>
    </main>
  );
}
