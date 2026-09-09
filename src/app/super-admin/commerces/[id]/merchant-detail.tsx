"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { SuperAdminShell } from "@/components/super-admin/layout-shell";
import { Alert, Button, Card } from "@/components/ui";

export function MerchantDetailPage({ firstName, merchantId }: { firstName: string; merchantId: string }) {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void fetch(`/api/super-admin/merchants/${merchantId}`)
      .then((r) => r.json())
      .then((json) => {
        if (json.error) setError(json.error);
        else setData(json);
      });
  }, [merchantId]);

  async function action(kind: "suspend" | "reactivate" | "archive") {
    const password = window.prompt("Mot de passe super-admin :");
    if (!password) return;
    const response = await fetch(`/api/super-admin/merchants/${merchantId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: kind, password }),
    });
    const json = await response.json();
    if (!response.ok) alert(json.error ?? "Action impossible.");
    else window.location.reload();
  }

  const merchant = data?.merchant;

  return (
    <SuperAdminShell firstName={firstName}>
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-[var(--ink)]">{merchant?.name ?? "Commerce"}</h1>
            <p className="text-sm text-[var(--muted-text)]">/{merchant?.slug} · {merchant?.status}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href={`/super-admin/cartes/${merchantId}/editeur`}><Button variant="secondary">Modifier la carte</Button></Link>
            <Button variant="danger" onClick={() => void action("suspend")}>Suspendre</Button>
            <Button onClick={() => void action("reactivate")}>Réactiver</Button>
            <Button variant="secondary" onClick={() => void action("archive")}>Archiver</Button>
          </div>
        </div>

        {error ? <Alert>{error}</Alert> : null}
        {!merchant ? <p className="text-sm text-[var(--muted-text)]">Chargement…</p> : (
          <div className="grid gap-4 lg:grid-cols-2">
            <Card className="p-5 space-y-2 text-sm">
              <h2 className="font-bold">Informations publiques</h2>
              <p>{merchant.shortDescription || merchant.description || "—"}</p>
              <p><strong>Catégorie :</strong> {merchant.category || "—"}</p>
              <p><strong>Visible recherche :</strong> {merchant.visibleInSearch ? "Oui" : "Non"}</p>
            </Card>
            <Card className="p-5 space-y-2 text-sm">
              <h2 className="font-bold">Informations légales</h2>
              <p><strong>Nom légal :</strong> {merchant.legalName || "—"}</p>
              <p><strong>Responsable :</strong> {merchant.ownerName || "—"}</p>
              <p><strong>Adresse :</strong> {[merchant.addressLine1, merchant.postalCode, merchant.city].filter(Boolean).join(", ") || "—"}</p>
            </Card>
            <Card className="p-5 space-y-2 text-sm">
              <h2 className="font-bold">Programme actif</h2>
              <p><strong>Mode :</strong> {merchant.program?.mode}</p>
              <p><strong>Récompense :</strong> {merchant.program?.rewardLabel}</p>
              <p><strong>Récompenses configurées :</strong> {merchant.program?.rewards?.length ?? 0}</p>
            </Card>
            <Card className="p-5 space-y-2 text-sm">
              <h2 className="font-bold">Statistiques</h2>
              <p><strong>Clients :</strong> {data.stats.customers}</p>
              <p><strong>Scans :</strong> {data.stats.scans}</p>
              <p><strong>Transactions :</strong> {data.stats.transactions}</p>
            </Card>
            <Card className="p-5 space-y-2 text-sm lg:col-span-2">
              <h2 className="font-bold">Abonnement & contrat</h2>
              <p><strong>Plan :</strong> {merchant.subscription?.plan ?? "—"} · {merchant.subscription?.amount ?? 0} € / {merchant.subscription?.frequency ?? "—"}</p>
              <p><strong>Statut :</strong> {merchant.subscription?.status ?? "—"}</p>
              <p><strong>Contrats :</strong> {merchant.contracts?.length ?? 0}</p>
            </Card>
            <Card className="p-5 lg:col-span-2">
              <h2 className="mb-3 font-bold">Journal d&apos;audit récent</h2>
              <div className="max-h-64 overflow-auto text-xs">
                {(data.recentAudit ?? []).map((log: any) => (
                  <div key={log.id} className="border-b border-white/5 py-2">
                    <strong>{log.action}</strong> — {new Date(log.createdAt).toLocaleString("fr-FR")}
                    {log.actor ? ` · ${log.actor.firstName}` : ""}
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}
      </div>
    </SuperAdminShell>
  );
}
