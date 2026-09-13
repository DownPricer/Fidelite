"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { SuperAdminShell } from "@/components/super-admin/layout-shell";
import { Alert, Button, Card, Field, Input } from "@/components/ui";

const RECOMMENDED_WALLET_COLORS = ["#0B0B12", "#123456", "#5B3FD8", "#0F766E", "#111827"];

type WalletAppearance = {
  backgroundColor?: string;
  appLinkLabel?: string;
  heroImageUrl?: string | null;
  logoUrl?: string | null;
  wideLogoUrl?: string | null;
};

export function MerchantDetailPage({ firstName, merchantId }: { firstName: string; merchantId: string }) {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [walletBusy, setWalletBusy] = useState<string | null>(null);
  const [walletMessage, setWalletMessage] = useState<string | null>(null);
  const [walletEditorOpen, setWalletEditorOpen] = useState(false);
  const [walletAppearance, setWalletAppearance] = useState<WalletAppearance>({
    backgroundColor: "#0B0B12",
    appLinkLabel: "Voir ma carte",
  });

  useEffect(() => {
    void fetch(`/api/super-admin/merchants/${merchantId}`)
      .then((r) => r.json())
      .then((json) => {
        if (json.error) setError(json.error);
        else setData(json);
      });
  }, [merchantId]);

  useEffect(() => {
    const merchant = data?.merchant;
    const walletClass = merchant?.googleWalletClasses?.[0] ?? null;
    const config = (walletClass?.configByMode ?? {}) as any;
    const appearance = config.draftAppearance ?? config.publishedAppearance ?? {};
    if (!merchant) return;
    setWalletAppearance({
      backgroundColor: appearance.backgroundColor ?? merchant.primaryColor ?? "#0B0B12",
      appLinkLabel: appearance.appLinkLabel ?? "Voir ma carte",
      heroImageUrl: appearance.heroImageUrl ?? null,
      logoUrl: appearance.logoUrl ?? null,
      wideLogoUrl: appearance.wideLogoUrl ?? null,
    });
  }, [data]);

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

  async function walletAction(kind: "preview" | "sync" | "test" | "publishAppearance" | "resetAppearance") {
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
    setWalletMessage(
      kind === "sync" || kind === "publishAppearance"
        ? `${json.syncedObjects ?? 0} objet(s) synchronisé(s).`
        : kind === "resetAppearance"
          ? "Apparence Google Wallet réinitialisée."
          : "Configuration valide.",
    );
    void fetch(`/api/super-admin/merchants/${merchantId}`)
      .then((r) => r.json())
      .then((next) => {
        if (!next.error) setData(next);
      });
  }

  async function saveWalletDraft() {
    setWalletBusy("saveAppearance");
    setWalletMessage(null);
    const response = await fetch(`/api/super-admin/merchants/${merchantId}/google-wallet`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "saveAppearance", appearance: walletAppearance }),
    });
    const json = await response.json();
    setWalletBusy(null);
    if (!response.ok) {
      setWalletMessage(json.error ?? "Brouillon Google Wallet impossible.");
      return;
    }
    setWalletMessage("Brouillon Google Wallet enregistré.");
    await reloadMerchant();
  }

  async function uploadWalletMedia(kind: "hero" | "logo" | "wideLogo", file: File | null) {
    if (!file) return;
    setWalletBusy(`upload-${kind}`);
    setWalletMessage(null);
    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = () => reject(new Error("Lecture du fichier impossible."));
      reader.readAsDataURL(file);
    });
    const response = await fetch(`/api/super-admin/merchants/${merchantId}/google-wallet`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "uploadMedia", kind, dataUrl }),
    });
    const json = await response.json();
    setWalletBusy(null);
    if (!response.ok) {
      setWalletMessage(json.error ?? "Upload Google Wallet impossible.");
      return;
    }
    const next = json.config?.draftAppearance ?? {};
    setWalletAppearance((current) => ({ ...current, ...next }));
    setWalletMessage("Média ajouté au brouillon Google Wallet.");
    await reloadMerchant();
  }

  async function reloadMerchant() {
    const next = await fetch(`/api/super-admin/merchants/${merchantId}`).then((r) => r.json());
    if (!next.error) setData(next);
  }

  const merchant = data?.merchant;
  const walletClass = merchant?.googleWalletClasses?.[0] ?? null;
  const walletObjects = merchant?.googleWalletObjects ?? [];
  const walletConfig = (walletClass?.configByMode ?? {}) as Record<string, unknown>;
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
                  <Button variant="secondary" onClick={() => setWalletEditorOpen((value) => !value)}>
                    Personnaliser l&apos;apparence
                  </Button>
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
                <p><strong>Classe configurée :</strong> {walletClass ? "Oui" : "Non"}</p>
                <p><strong>Identifiant de classe :</strong> {walletClass?.googleClassId ?? "—"}</p>
                <p><strong>Statut Google :</strong> {(walletConfig.reviewStatus as string | null) ?? walletClass?.syncStatus ?? "—"}</p>
                <p><strong>Mode actif :</strong> {merchant.program?.mode ?? "—"}</p>
                <p><strong>Profil actif :</strong> {walletClass?.activeProfile ?? merchant.program?.mode ?? "GENERAL"}</p>
                <p>
                  <strong>Gabarit Fife Life :</strong>{" "}
                  {(walletConfig.templateId as string | null) ?? "—"}
                  {walletConfig.templateVersion ? ` · v${walletConfig.templateVersion}` : ""}
                  {walletConfig.templateUsedFallback ? " · fallback général" : ""}
                </p>
                <p>
                  <strong>Dernière synchronisation :</strong>{" "}
                  {walletClass?.lastSyncedAt ? new Date(walletClass.lastSyncedAt).toLocaleString("fr-FR") : "—"}
                </p>
                <p><strong>Objets clients connus :</strong> {data.stats.googleWalletObjects ?? 0}</p>
                <p><strong>Objets en erreur :</strong> {walletObjects.filter((item: any) => item.syncStatus === "ERROR").length}</p>
              </div>
              {walletError ? <Alert>Dernière erreur Google Wallet : {walletError}</Alert> : null}
              {walletMessage ? <p className="text-xs font-semibold text-[var(--ink)]">{walletMessage}</p> : null}
              {walletEditorOpen ? (
                <div className="grid gap-4 rounded-2xl border border-white/10 bg-black/20 p-4 lg:grid-cols-[1fr_360px]">
                  <div className="space-y-4">
                    <div className="grid gap-3 md:grid-cols-2">
                      <Field label="Couleur Google Wallet" hint="Format strict #RRGGBB. Publiée sur la classe commerce.">
                        <div className="flex gap-2">
                          <input
                            type="color"
                            value={walletAppearance.backgroundColor ?? "#0B0B12"}
                            onChange={(event) =>
                              setWalletAppearance((current) => ({ ...current, backgroundColor: event.target.value.toUpperCase() }))
                            }
                            className="h-12 w-14 shrink-0 rounded-xl border border-[var(--stroke)] bg-transparent"
                            aria-label="Sélecteur de couleur Google Wallet"
                          />
                          <Input
                            value={walletAppearance.backgroundColor ?? ""}
                            onChange={(event) =>
                              setWalletAppearance((current) => ({ ...current, backgroundColor: event.target.value.toUpperCase() }))
                            }
                            pattern="^#[0-9A-Fa-f]{6}$"
                          />
                        </div>
                      </Field>
                      <Field label="Libellé du bouton" hint="Maximum Google recommandé : 30 caractères.">
                        <Input
                          value={walletAppearance.appLinkLabel ?? ""}
                          maxLength={30}
                          onChange={(event) =>
                            setWalletAppearance((current) => ({ ...current, appLinkLabel: event.target.value }))
                          }
                        />
                      </Field>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {RECOMMENDED_WALLET_COLORS.map((color) => (
                        <button
                          key={color}
                          type="button"
                          className="h-9 w-9 rounded-full border border-white/25"
                          style={{ backgroundColor: color }}
                          aria-label={`Utiliser ${color}`}
                          onClick={() => setWalletAppearance((current) => ({ ...current, backgroundColor: color }))}
                        />
                      ))}
                    </div>
                    <div className="grid gap-3 md:grid-cols-3">
                      <Field label="Hero image 1032:812" hint="PNG/JPEG/WebP, max 5 Mo, ratio verrouillé côté serveur.">
                        <Input type="file" accept="image/png,image/jpeg,image/webp" onChange={(event) => void uploadWalletMedia("hero", event.target.files?.[0] ?? null)} />
                      </Field>
                      <Field label="Logo carré 1:1" hint="Google masque le logo en cercle.">
                        <Input type="file" accept="image/png,image/jpeg,image/webp" onChange={(event) => void uploadWalletMedia("logo", event.target.files?.[0] ?? null)} />
                      </Field>
                      <Field label="Logo large 16:5" hint="Facultatif.">
                        <Input type="file" accept="image/png,image/jpeg,image/webp" onChange={(event) => void uploadWalletMedia("wideLogo", event.target.files?.[0] ?? null)} />
                      </Field>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button onClick={() => void saveWalletDraft()} disabled={Boolean(walletBusy)}>
                        {walletBusy === "saveAppearance" ? "Enregistrement…" : "Enregistrer le brouillon"}
                      </Button>
                      <Button variant="success" onClick={() => void walletAction("publishAppearance")} disabled={Boolean(walletBusy)}>
                        {walletBusy === "publishAppearance" ? "Publication…" : "Publier et synchroniser"}
                      </Button>
                      <Button variant="secondary" onClick={() => void walletAction("resetAppearance")} disabled={Boolean(walletBusy)}>
                        Réinitialiser
                      </Button>
                    </div>
                  </div>
                  <div
                    className="overflow-hidden rounded-2xl border border-white/15 p-4"
                    style={{ backgroundColor: walletAppearance.backgroundColor ?? merchant.primaryColor ?? "#0B0B12" }}
                  >
                    <p className="mb-3 text-xs font-semibold text-white/70">
                      Aperçu indicatif — Google Wallet contrôle la mise en page finale.
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="grid h-14 w-14 place-items-center overflow-hidden rounded-full bg-white/20 ring-1 ring-white/30">
                        {walletAppearance.logoUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={walletAppearance.logoUrl} alt="" className="h-full w-full object-cover" />
                        ) : (
                          <span className="text-lg font-black text-white">{merchant.name.slice(0, 1)}</span>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-black text-white">Fidélité {merchant.name}</p>
                        <p className="truncate text-xs text-white/72">{merchant.program?.mode ?? "GENERAL"} · Démo aperçu</p>
                      </div>
                    </div>
                    <div className="mt-4 aspect-[1032/812] overflow-hidden rounded-xl bg-black/20">
                      {walletAppearance.heroImageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={walletAppearance.heroImageUrl} alt="" className="h-full w-full object-cover" />
                      ) : (
                        <div className="grid h-full place-items-center text-xs font-semibold text-white/60">Hero automatique</div>
                      )}
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-white">
                      <div className="rounded-xl bg-white/12 p-3">
                        <p className="text-white/60">Solde</p>
                        <p className="text-lg font-black">128</p>
                      </div>
                      <div className="rounded-xl bg-white/12 p-3">
                        <p className="text-white/60">Prochain avantage</p>
                        <p className="truncate font-bold">{merchant.program?.rewardLabel ?? "Avantage"}</p>
                      </div>
                    </div>
                    <div className="mt-3 rounded-xl bg-white/14 px-3 py-2 text-center text-xs font-black text-white">
                      {walletAppearance.appLinkLabel ?? "Voir ma carte"}
                    </div>
                  </div>
                </div>
              ) : null}
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
