"use client";

import Link from "next/link";
import { useState } from "react";
import { Alert, Button, Card, Field } from "@/components/ui";

export function AccountPanel({ firstName, email }: { firstName: string; email: string }) {
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function requestDeletion(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/customer/deletion", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: form.get("message") }),
    });
    if (!response.ok) {
      const data = await response.json();
      setError(data.error ?? "Demande impossible.");
      return;
    }
    setDone(true);
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/";
  }

  return (
    <main className="mx-auto max-w-md px-6 py-10">
      <Link href="/carte" className="text-sm underline">
        Retour à la carte
      </Link>
      <h1 className="mt-6 text-3xl font-semibold">Mon compte</h1>
      <Card className="mt-6 space-y-2">
        <p className="font-medium">{firstName}</p>
        <p className="text-sm text-slate-600">{email}</p>
        <Button variant="secondary" onClick={() => void logout()}>
          Se déconnecter
        </Button>
      </Card>
      <Card className="mt-4">
        <h2 className="text-lg font-semibold">Demander la suppression</h2>
        <p className="mt-2 text-sm text-slate-600">
          Votre demande est enregistrée. FifeLite traitera la suppression de vos données.
        </p>
        {done ? (
          <Alert tone="ok">Demande enregistrée.</Alert>
        ) : (
          <form className="mt-4 space-y-3" onSubmit={(event) => void requestDeletion(event)}>
            {error ? <Alert>{error}</Alert> : null}
            <Field label="Message (optionnel)">
              <textarea
                name="message"
                className="min-h-24 w-full rounded-2xl border border-slate-200 px-4 py-3"
              />
            </Field>
            <Button variant="danger" className="w-full">
              Demander la suppression
            </Button>
          </form>
        )}
      </Card>
    </main>
  );
}
