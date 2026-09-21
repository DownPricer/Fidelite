"use client";

import { useState, type FormEvent } from "react";
import { Alert, Button, Field, Input } from "@/components/ui";

export function PasswordSection({ demo = false }: { demo?: boolean }) {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setOk(false);

    if (next.length < 8) {
      setError("Le nouveau mot de passe doit contenir au moins 8 caractères.");
      return;
    }
    if (next !== confirm) {
      setError("Les deux mots de passe ne correspondent pas.");
      return;
    }

    if (demo) {
      setOk(true);
      setCurrent("");
      setNext("");
      setConfirm("");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword: current, nextPassword: next }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Modification impossible.");
        return;
      }
      setOk(true);
      setCurrent("");
      setNext("");
      setConfirm("");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="space-y-3" onSubmit={(e) => void onSubmit(e)}>
      {error ? <Alert>{error}</Alert> : null}
      {ok ? <Alert tone="ok">Mot de passe mis à jour.</Alert> : null}
      <Field label="Mot de passe actuel">
        <Input
          type="password"
          required
          autoComplete="current-password"
          value={current}
          onChange={(e) => setCurrent(e.target.value)}
        />
      </Field>
      <Field label="Nouveau mot de passe">
        <Input
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          value={next}
          onChange={(e) => setNext(e.target.value)}
        />
      </Field>
      <Field label="Confirmer le nouveau mot de passe">
        <Input
          type="password"
          required
          autoComplete="new-password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
        />
      </Field>
      <Button type="submit" disabled={loading} className="h-10 px-4 text-sm">
        {loading ? "Enregistrement…" : "Mettre à jour le mot de passe"}
      </Button>
    </form>
  );
}
