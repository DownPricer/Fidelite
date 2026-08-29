"use client";

import { useEffect, useState } from "react";
import { Alert, Button, Card, Field, Input } from "@/components/ui";

type Merchant = {
  id: string;
  name: string;
  slug: string;
  isActive: boolean;
  customers: number;
  visitsRequired?: number;
  rewardLabel?: string;
};

export function AdminHome({ firstName }: { firstName: string }) {
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    const response = await fetch("/api/admin/merchants");
    const data = await response.json();
    if (response.ok) setMerchants(data.merchants);
  }

  useEffect(() => {
    void load();
  }, []);

  async function create(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/admin/merchants", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.get("name"),
        slug: form.get("slug"),
        logoUrl: form.get("logoUrl"),
        primaryColor: form.get("primaryColor") || "#0F766E",
        visitsRequired: Number(form.get("visitsRequired") || 10),
        rewardLabel: form.get("rewardLabel"),
        adminFirstName: form.get("adminFirstName"),
        adminEmail: form.get("adminEmail"),
        adminPassword: form.get("adminPassword"),
      }),
    });
    const data = await response.json();
    if (!response.ok) {
      setError(data.error ?? "Création impossible.");
      return;
    }
    setError(null);
    event.currentTarget.reset();
    void load();
  }

  async function toggle(id: string, isActive: boolean) {
    await fetch(`/api/admin/merchants/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !isActive }),
    });
    void load();
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/admin/connexion";
  }

  return (
    <main className="mx-auto max-w-4xl px-6 py-8">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-500">FifeLite</p>
          <h1 className="text-3xl font-semibold">Super-admin, {firstName}</h1>
        </div>
        <Button variant="ghost" onClick={() => void logout()}>
          Déconnexion
        </Button>
      </div>

      <Card className="mt-6">
        <h2 className="text-lg font-semibold">Nouveau commerce</h2>
        {error ? <div className="mt-3"><Alert>{error}</Alert></div> : null}
        <form className="mt-4 grid gap-3 sm:grid-cols-2" onSubmit={(event) => void create(event)}>
          <Field label="Nom">
            <Input name="name" required />
          </Field>
          <Field label="Slug">
            <Input name="slug" required />
          </Field>
          <Field label="URL du logo">
            <Input name="logoUrl" />
          </Field>
          <Field label="Couleur">
            <Input name="primaryColor" defaultValue="#0F766E" />
          </Field>
          <Field label="Passages requis">
            <Input name="visitsRequired" type="number" defaultValue={10} />
          </Field>
          <Field label="Récompense">
            <Input name="rewardLabel" required />
          </Field>
          <Field label="Prénom admin commerce">
            <Input name="adminFirstName" required />
          </Field>
          <Field label="E-mail admin commerce">
            <Input name="adminEmail" type="email" required />
          </Field>
          <Field label="Mot de passe admin">
            <Input name="adminPassword" type="password" required minLength={8} />
          </Field>
          <Button className="self-end">Créer le commerce</Button>
        </form>
      </Card>

      <div className="mt-6 space-y-3">
        {merchants.map((merchant) => (
          <Card key={merchant.id} className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="font-semibold">{merchant.name}</p>
              <p className="text-sm text-slate-500">/{merchant.slug} · {merchant.customers} clients</p>
              <p className="text-sm text-slate-500">
                {merchant.visitsRequired} passages = {merchant.rewardLabel}
              </p>
              <p className="text-xs text-slate-400">{merchant.isActive ? "Actif" : "Désactivé"}</p>
            </div>
            <Button variant={merchant.isActive ? "danger" : "secondary"} onClick={() => void toggle(merchant.id, merchant.isActive)}>
              {merchant.isActive ? "Désactiver" : "Réactiver"}
            </Button>
          </Card>
        ))}
      </div>
    </main>
  );
}
