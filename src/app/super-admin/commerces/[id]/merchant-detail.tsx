"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { SuperAdminShell } from "@/components/super-admin/layout-shell";
import { Alert, Button, Card } from "@/components/ui";

export function MerchantDetailPage({ firstName, merchantId }: { firstName: string; merchantId: string }) {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [walletBusy, setWalletBusy] = useState<string | null>(null);
  const [walletMessage, setWalletMessage] = useState<string | null>(null);

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

  async function walletAction(kind: "preview" | "sync" | "test") {
    setWalletBusy(kind);
    setWalletMessage(null);
    const response = await fetch(`/api/super-admin/merchants/${merchantId}/google-wallet`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: kind }),
    });
    const json = await response.json();
    setWalletBusy(null);
    if (!response.ok) {
      setWalletMessage(json.error ?? "Action Google Wallet impossible.");
      return;
    }
    if (kind === "preview") {
      setWalletMessage(json.preview?.note ?? "Aperçu prêt.");
      return;
    }
    setWalletMessage(kind === "sync" ? `${json.syncedObjects ?? 0} objet(s) synchronisé(s).` : "Configuration valide.");
    void fetch(`/api/super-admin/merchants/${merchantId}`)
      .then((r) => r.json())
      .then((next) => {
        if (!next.error) setData(next);
      });
  }

  const merchant = data?.merchant;
  const walletClass = merchant?.googleWalletClasses?.[0] ?? null;
  const walletObjects = merchant?.googleWalletObjects ?? [];
  const walletError =
    walletClass?.lastError ?? walletObjects.find((item: any) => item.lastError)?.lastError ?? null;

  return (
    <SuperAdminShell firstName={firstName}>
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-[var(--ink)]">{merchant?.name ?? "Commerce"}</h1>
            <p className="text-sm text-[var(--muted-text)]">/{merchant?.slug} · {merchant?.status}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href={`/super-admin/commerces/${merchantId}/cartes`}>
              <Button variant="secondary">Cartes</Button>
            </Link>
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
            <Card className="p-5 space-y-4 text-sm lg:col-span-2">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="font-bold">Google Wallet</h2>
                  <p className="text-xs text-[var(--muted-text)]">
                    Aperçu approximatif conforme aux contraintes Google Wallet.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button variant="secondary" onClick={() => void walletAction("preview")} disabled={Boolean(walletBusy)}>
                    {walletBusy === "preview" ? "Prévisualisation…" : "Prévisualiser"}
                  </Button>
                  <Button onClick={() => void walletAction("sync")} disabled={Boolean(walletBusy)}>
                    {walletBusy === "sync" ? "Synchronisation…" : "Synchroniser avec Google"}
                  </Button>
                  <Button variant="secondary" onClick={() => void walletAction("test")} disabled={Boolean(walletBusy)}>
                    {walletBusy === "test" ? "Test…" : "Tester la configuration"}
                  </Button>
                </div>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                <p><strong>Identifiant de classe :</strong> {walletClass?.googleClassId ?? "—"}</p>
                <p><strong>État de la classe :</strong> {walletClass?.syncStatus ?? "NEVER_SYNCED"}</p>
                <p><strong>Profil actif :</strong> {walletClass?.activeProfile ?? merchant.program?.mode ?? "GENERAL"}</p>
                <p>
                  <strong>Dernière synchronisation :</strong>{" "}
                  {walletClass?.lastSyncedAt ? new Date(walletClass.lastSyncedAt).toLocaleString("fr-FR") : "—"}
                </p>
                <p><strong>Objets clients connus :</strong> {data.stats.googleWalletObjects ?? 0}</p>
                <p><strong>Objets en erreur :</strong> {walletObjects.filter((item: any) => item.syncStatus === "ERROR").length}</p>
              </div>
              {walletError ? <Alert>Dernière erreur Google Wallet : {walletError}</Alert> : null}
              {walletMessage ? <p className="text-xs font-semibold text-[var(--ink)]">{walletMessage}</p> : null}
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
