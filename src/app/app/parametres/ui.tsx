"use client";

import { useState } from "react";
import { Alert, Button, Card, Field, Input } from "@/components/ui";

export function SettingsForm({
  initial,
}: {
  initial: {
    name: string;
    logoUrl: string;
    primaryColor: string;
    visitsRequired: number;
    rewardLabel: string;
  };
}) {
  const [ok, setOk] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/merchant/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.get("name"),
        logoUrl: form.get("logoUrl"),
        primaryColor: form.get("primaryColor"),
        visitsRequired: Number(form.get("visitsRequired")),
        rewardLabel: form.get("rewardLabel"),
      }),
    });
    const data = await response.json();
    if (!response.ok) {
      setError(data.error ?? "Enregistrement impossible.");
      setOk(false);
      return;
    }
    setError(null);
    setOk(true);
  }

  return (
    <Card className="mt-6">
      <form className="space-y-4" onSubmit={(event) => void onSubmit(event)}>
        {error ? <Alert>{error}</Alert> : null}
        {ok ? <Alert tone="ok">Modifications enregistrées.</Alert> : null}
        <Field label="Nom du commerce">
          <Input name="name" defaultValue={initial.name} required />
        </Field>
        <Field label="URL du logo">
          <Input name="logoUrl" defaultValue={initial.logoUrl} />
        </Field>
        <Field label="Couleur principale">
          <Input name="primaryColor" defaultValue={initial.primaryColor} />
        </Field>
        <Field label="Passages pour une récompense">
          <Input name="visitsRequired" type="number" min={2} max={100} defaultValue={initial.visitsRequired} />
        </Field>
        <Field label="Libellé de la récompense">
          <Input name="rewardLabel" defaultValue={initial.rewardLabel} />
        </Field>
        <Button>Enregistrer</Button>
      </form>
    </Card>
  );
}
