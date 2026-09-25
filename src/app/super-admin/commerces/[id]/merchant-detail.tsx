"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { GoogleWalletMediaCrop } from "@/components/super-admin/google-wallet-media-crop";
import { SuperAdminShell } from "@/components/super-admin/layout-shell";
import { MerchantActionsMenu, type MerchantQuickAction } from "@/components/super-admin/merchant-actions-menu";
import { Alert, Button, Card, Field, Input } from "@/components/ui";
import type { GoogleWalletMediaKind } from "@/lib/google-wallet-media-crop";

const RECOMMENDED_WALLET_COLORS = ["#0B0B12", "#123456", "#5B3FD8", "#0F766E", "#111827"];

type WalletAppearance = {
  backgroundColor?: string;
  appLinkLabel?: string;
  heroImageUrl?: string | null;
  logoUrl?: string | null;
  wideLogoUrl?: string | null;
};

type WalletMediaKey = "hero" | "logo" | "wideLogo";

type WalletMediaPreview = {
  objectUrl: string;
  publicUrl: string;
};

type WalletPreviewView = {
  programName: string;
  issuerName: string;
  backgroundColor: string;
  logoUrl: string | null;
  wideLogoUrl: string | null;
  heroImageUrl: string | null;
  appLinkLabel: string;
  demoOnly: boolean;
  decorativeQrValue: string;
  customer: { name: string; clientNumber: string; isExample: boolean };
  loyalty: {
    mode: string;
    modeLabel: string;
    programDescription: string;
    balance: number;
    balanceLabel: string;
    target: number;
    targetLabel: string;
    unit: "points" | "passages";
    nextRewardName: string | null;
    remainingLabel: string | null;
    availableRewardsCount: number;
    availableRewardNames: string[];
  };
};

const MEDIA_TO_APPEARANCE_KEY: Record<WalletMediaKey, keyof Pick<WalletAppearance, "heroImageUrl" | "logoUrl" | "wideLogoUrl">> = {
  hero: "heroImageUrl",
  logo: "logoUrl",
  wideLogo: "wideLogoUrl",
};

function walletMediaKey(kind: GoogleWalletMediaKind): WalletMediaKey {
  return kind === "wide-logo" ? "wideLogo" : kind;
}

function revokeWalletPreviews(previews: Partial<Record<WalletMediaKey, WalletMediaPreview>>) {
  for (const preview of Object.values(previews)) {
    if (preview?.objectUrl) URL.revokeObjectURL(preview.objectUrl);
  }
}

export function MerchantDetailPage({ firstName, merchantId }: { firstName: string; merchantId: string }) {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [walletBusy, setWalletBusy] = useState<string | null>(null);
  const [walletMessage, setWalletMessage] = useState<string | null>(null);
  const [walletFailedAction, setWalletFailedAction] = useState<"sync" | "test" | "publishAppearance" | "resetAppearance" | null>(null);
  const [walletEditorOpen, setWalletEditorOpen] = useState(false);
  const [walletPreviewMembershipId, setWalletPreviewMembershipId] = useState<string>("model");
  const [walletCrop, setWalletCrop] = useState<{ kind: GoogleWalletMediaKind; file: File } | null>(null);
  const [walletMediaPreviews, setWalletMediaPreviews] = useState<Partial<Record<WalletMediaKey, WalletMediaPreview>>>({});
  const [walletMediaErrors, setWalletMediaErrors] = useState<Partial<Record<WalletMediaKey, string>>>({});
  const walletMediaPreviewsRef = useRef<Partial<Record<WalletMediaKey, WalletMediaPreview>>>({});
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
    walletMediaPreviewsRef.current = walletMediaPreviews;
  }, [walletMediaPreviews]);

  useEffect(() => {
    return () => revokeWalletPreviews(walletMediaPreviewsRef.current);
  }, []);

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

  async function action(kind: MerchantQuickAction, password: string) {
    const response = await fetch(`/api/super-admin/merchants/${merchantId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: kind, password }),
    });
    const json = await response.json();
    if (!response.ok) return { ok: false, error: json.error ?? "Action impossible." };
    window.location.reload();
    return { ok: true };
  }

  const publishedAppearance = useMemo(() => {
    const walletClass = data?.merchant?.googleWalletClasses?.[0] ?? null;
    const config = (walletClass?.configByMode ?? {}) as any;
    return (config.publishedAppearance ?? {}) as WalletAppearance;
  }, [data]);

  function clearWalletLocalPreviews() {
    setWalletMediaPreviews((current) => {
      revokeWalletPreviews(current);
      return {};
    });
    setWalletMediaErrors({});
  }

  async function walletAction(kind: "preview" | "sync" | "test" | "publishAppearance" | "resetAppearance") {
    setWalletBusy(kind);
    setWalletMessage(null);
    setWalletFailedAction(null);
    const response = await fetch(`/api/super-admin/merchants/${merchantId}/google-wallet`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(kind === "publishAppearance" ? { action: kind, appearance: walletAppearance } : { action: kind }),
    });
    const json = await response.json();
    setWalletBusy(null);
    if (!response.ok) {
      setWalletMessage(json.error ?? "Action Google Wallet impossible.");
      if (kind === "publishAppearance") {
        setWalletMediaErrors((current) => ({
          ...current,
          hero: "Erreur de synchronisation Google",
          logo: "Erreur de synchronisation Google",
          wideLogo: "Erreur de synchronisation Google",
        }));
      }
      if (kind !== "preview") setWalletFailedAction(kind);
      return;
    }
    setWalletFailedAction(null);
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
    if (kind === "resetAppearance") {
      clearWalletLocalPreviews();
      setWalletAppearance({
        backgroundColor: merchant?.primaryColor ?? "#0B0B12",
        appLinkLabel: "Voir ma carte",
        heroImageUrl: null,
        logoUrl: null,
        wideLogoUrl: null,
      });
    }
    if (kind === "publishAppearance") {
      clearWalletLocalPreviews();
    }
    void fetch(`/api/super-admin/merchants/${merchantId}`)
      .then((r) => r.json())
      .then((next) => {
        if (!next.error) setData(next);
      });
  }

  async function saveWalletDraft() {
    setWalletBusy("saveAppearance");
    setWalletMessage(null);
    setWalletFailedAction(null);
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

  function selectWalletMedia(kind: GoogleWalletMediaKind, file: File | null) {
    if (!file) return;
    setWalletMessage(null);
    setWalletCrop({ kind, file });
  }

  async function uploadWalletMedia(kind: GoogleWalletMediaKind, file: File) {
    const mediaKey = walletMediaKey(kind);
    setWalletBusy(`upload-${kind}`);
    setWalletMessage(null);
    setWalletFailedAction(null);
    setWalletMediaErrors((current) => ({ ...current, [mediaKey]: undefined }));
    const form = new FormData();
    form.set("action", "uploadMedia");
    form.set("kind", kind);
    form.set("file", file);
    const response = await fetch(`/api/super-admin/merchants/${merchantId}/google-wallet`, {
      method: "POST",
      body: form,
    });
    const json = await response.json();
    setWalletBusy(null);
    if (!response.ok) {
      setWalletMessage(json.error ?? "Upload Google Wallet impossible.");
      setWalletMediaErrors((current) => ({ ...current, [mediaKey]: "Erreur d'upload" }));
      return;
    }
    const next = json.config?.draftAppearance ?? {};
    setWalletAppearance((current) => ({ ...current, ...next }));
    const appearanceKey = MEDIA_TO_APPEARANCE_KEY[mediaKey];
    const publicUrl = next[appearanceKey];
    if (typeof publicUrl === "string" && publicUrl) {
      const objectUrl = URL.createObjectURL(file);
      setWalletMediaPreviews((current) => {
        const previous = current[mediaKey];
        if (previous?.objectUrl) URL.revokeObjectURL(previous.objectUrl);
        return { ...current, [mediaKey]: { objectUrl, publicUrl } };
      });
    }
    setWalletCrop(null);
    setWalletMessage("Média ajouté au brouillon Google Wallet.");
  }

  async function reloadMerchant() {
    const next = await fetch(`/api/super-admin/merchants/${merchantId}`).then((r) => r.json());
    if (!next.error) setData(next);
  }

  const merchant = data?.merchant;
  const walletPreviewCustomers = (data?.walletPreview?.customers ?? []) as Array<{
    membershipId: string;
    label: string;
    view: WalletPreviewView;
  }>;
  const walletPreviewModel = (data?.walletPreview?.model ?? null) as WalletPreviewView | null;
  const walletPreviewView =
    walletPreviewCustomers.find((item) => item.membershipId === walletPreviewMembershipId)?.view ??
    walletPreviewCustomers[0]?.view ??
    walletPreviewModel;
  const walletClass = merchant?.googleWalletClasses?.[0] ?? null;
  const walletObjects = merchant?.googleWalletObjects ?? [];
  const walletConfig = (walletClass?.configByMode ?? {}) as Record<string, unknown>;
  const walletError =
    walletClass?.lastError ?? walletObjects.find((item: any) => item.lastError)?.lastError ?? null;

  function walletMediaState(key: WalletMediaKey) {
    const appearanceKey = MEDIA_TO_APPEARANCE_KEY[key];
    const local = walletMediaPreviews[key];
    const currentUrl = walletAppearance[appearanceKey] ?? null;
    const publishedUrl = publishedAppearance[appearanceKey] ?? null;
    const error = walletMediaErrors[key] ?? null;
    if (error) return { status: error, src: null as string | null };
    if (local && local.publicUrl === currentUrl) {
      return { status: "Image prête — non publiée", src: local.objectUrl };
    }
    if (currentUrl && currentUrl === publishedUrl) {
      return { status: "Image publiée", src: currentUrl };
    }
    if (currentUrl && currentUrl !== publishedUrl) {
      return { status: "Image prête — non publiée", src: null as string | null };
    }
    return { status: "Aucune image", src: null as string | null };
  }

  function markWalletMediaError(key: WalletMediaKey, message: string) {
    setWalletMediaErrors((current) => ({ ...current, [key]: message }));
  }

  function WalletMediaPlaceholder({ label, status }: { label: string; status: string }) {
    return (
      <div className="grid h-full min-h-16 place-items-center bg-white/10 px-3 text-center text-xs font-semibold text-white/65">
        <span>{status === "Aucune image" ? label : status}</span>
      </div>
    );
  }

  return (
    <SuperAdminShell firstName={firstName}>
      {walletCrop ? (
        <GoogleWalletMediaCrop
          file={walletCrop.file}
          kind={walletCrop.kind}
          busy={walletBusy === `upload-${walletCrop.kind}`}
          onCancel={() => setWalletCrop(null)}
          onConfirm={(file) => uploadWalletMedia(walletCrop.kind, file)}
        />
      ) : null}
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="rounded-2xl border border-[var(--stroke)] bg-[var(--surface)] p-4 shadow-[0_22px_70px_rgba(0,0,0,0.1)] backdrop-blur-2xl sm:p-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex min-w-0 items-center gap-4">
              <div className="grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-2xl text-xl font-black text-white ring-1 ring-white/20" style={{ backgroundColor: merchant?.primaryColor ?? "#8557ff" }}>
                {merchant?.logoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={merchant.logoUrl} alt="" className="h-full w-full object-cover" />
                ) : merchant?.name?.slice(0, 1) ?? "C"}
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="truncate text-2xl font-black text-[var(--ink)]">{merchant?.name ?? "Commerce"}</h1>
                  <span className="rounded-full border border-[var(--stroke)] bg-[var(--surface-strong)] px-2.5 py-1 text-[10px] font-black uppercase text-[var(--muted-text)]">
                    {merchant?.status ?? "—"}
                  </span>
                </div>
                <p className="mt-1 truncate text-sm text-[var(--muted-text)]">/{merchant?.slug ?? "slug"}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="secondary" disabled>Modifier</Button>
              <Link href={`/super-admin/commerces/${merchantId}/cartes`}>
                <Button variant="secondary">Gérer mes cartes</Button>
              </Link>
              {merchant ? (
                <MerchantActionsMenu status={merchant.status} label="Actions" onAction={(kind, password) => action(kind, password)} />
              ) : null}
            </div>
          </div>
        </div>

        {error ? <Alert>{error}</Alert> : null}
        {!merchant ? <p className="text-sm text-[var(--muted-text)]">Chargement…</p> : (
          <div className="space-y-4">
            <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-6">
              <Card className="p-4"><p className="text-xs text-[var(--muted-text)]">Programme actif</p><p className="mt-1 text-sm font-black">{merchant.program?.mode ?? "—"}</p></Card>
              <Card className="p-4"><p className="text-xs text-[var(--muted-text)]">Clients</p><p className="mt-1 text-sm font-black">{data.stats.customers}</p></Card>
              <Card className="p-4"><p className="text-xs text-[var(--muted-text)]">Employés</p><p className="mt-1 text-sm font-black">{data.stats.employees ?? "—"}</p></Card>
              <Card className="p-4"><p className="text-xs text-[var(--muted-text)]">Cartes publiées</p><p className="mt-1 text-sm font-black">{data.stats.publishedCardTemplates ?? merchant.cardTemplates?.filter((item: any) => item.status === "PUBLISHED").length ?? "—"}</p></Card>
              <Card className="p-4"><p className="text-xs text-[var(--muted-text)]">Google Wallet</p><p className="mt-1 text-sm font-black">{walletClass?.syncStatus ?? "—"}</p></Card>
              <Card className="p-4"><p className="text-xs text-[var(--muted-text)]">Abonnement</p><p className="mt-1 text-sm font-black">{merchant.subscription?.plan ?? "—"}</p></Card>
            </section>

          <div className="grid gap-4 lg:grid-cols-2">
            <Card className="p-5 space-y-2 text-sm">
              <h2 className="font-bold">Informations du commerce</h2>
              <p>{merchant.shortDescription || merchant.description || "—"}</p>
              <p><strong>Catégorie :</strong> {merchant.category || "—"}</p>
              <p><strong>Visible recherche :</strong> {merchant.visibleInSearch ? "Oui" : "Non"}</p>
              <p><strong>Nom légal :</strong> {merchant.legalName || "—"}</p>
              <p><strong>Responsable :</strong> {merchant.ownerName || "—"}</p>
              <p><strong>Adresse :</strong> {[merchant.addressLine1, merchant.postalCode, merchant.city].filter(Boolean).join(", ") || "—"}</p>
            </Card>
            <Card className="p-5 space-y-2 text-sm">
              <h2 className="font-bold">Fidélité et avantages</h2>
              <div className="grid gap-2 sm:grid-cols-2">
                <p><strong>Mode actif :</strong> {data.loyalty?.mode ?? "—"}</p>
                <p><strong>Version :</strong> {data.loyalty?.version ?? "—"}</p>
                <p><strong>Unité :</strong> {data.loyalty?.unit === "visits" ? "passages" : data.loyalty?.unit ?? "—"}</p>
                <p><strong>Avantages actifs :</strong> {data.loyalty?.activeRewardsCount ?? 0} / {data.loyalty?.activeRewardsLimit ?? 10}</p>
                <p><strong>Droits historiques disponibles :</strong> {data.loyalty?.historicalEntitlementsAvailable ?? 0}</p>
              </div>
              {data.loyalty?.conversionIncomplete ? (
                <p className="rounded-xl border border-amber-300/25 bg-amber-400/10 p-3 text-xs font-semibold text-amber-100">
                  Certains avantages appartiennent à votre ancien programme. Choisissez un équivalent pour terminer leur conversion.
                </p>
              ) : null}
              {(data.loyalty?.activeRewards ?? []).length ? (
                <ul className="space-y-1 text-xs text-[var(--muted-text)]">
                  {data.loyalty.activeRewards.map((reward: any) => (
                    <li key={reward.id}>{reward.threshold} {reward.thresholdUnit === "visits" ? "passages" : "points"} · {reward.name}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-[var(--muted-text)]">Aucun avantage actif compatible.</p>
              )}
              <Link href="/app/parametres/programme" className="inline-flex text-xs font-bold text-[var(--violet-bright)] hover:underline">
                Ouvrir la gestion fidélité
              </Link>
            </Card>
            <Card className="p-5 space-y-2 text-sm">
              <h2 className="font-bold">Cartes</h2>
              <p><strong>Publiées :</strong> {data.stats.publishedCardTemplates ?? merchant.cardTemplates?.filter((item: any) => item.status === "PUBLISHED").length ?? "—"}</p>
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
                  <strong>Gabarit Fideto :</strong>{" "}
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
                    <Field
                      label="Client d'aperçu"
                      hint="Le QR reste décoratif : aucun QR personnel réel n'est affiché ici."
                    >
                      <select
                        value={walletPreviewCustomers.length ? walletPreviewMembershipId : "model"}
                        onChange={(event) => setWalletPreviewMembershipId(event.target.value)}
                        className="w-full rounded-xl border border-[var(--stroke)] bg-white/80 px-3 py-3 text-sm font-semibold text-[var(--ink)] outline-none focus:ring-2 focus:ring-[var(--violet-bright)]"
                      >
                        {walletPreviewCustomers.map((item) => (
                          <option key={item.membershipId} value={item.membershipId}>
                            {item.label}
                          </option>
                        ))}
                        <option value="model">
                          {walletPreviewCustomers.length ? "Exemple modèle" : "Aucun client disponible pour un aperçu réel"}
                        </option>
                      </select>
                    </Field>
                    {!walletPreviewCustomers.length ? (
                      <Alert>
                        Aucun client disponible pour un aperçu réel. L'aperçu ci-dessous utilise un exemple généré
                        depuis les seuils du programme actif.
                      </Alert>
                    ) : null}
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
                        <Input
                          type="file"
                          accept="image/png,image/jpeg,image/webp"
                          onChange={(event) => selectWalletMedia("hero", event.target.files?.[0] ?? null)}
                          disabled={Boolean(walletBusy)}
                        />
                      </Field>
                      <Field label="Logo carré 1:1" hint="Google masque le logo en cercle.">
                        <Input
                          type="file"
                          accept="image/png,image/jpeg,image/webp"
                          onChange={(event) => selectWalletMedia("logo", event.target.files?.[0] ?? null)}
                          disabled={Boolean(walletBusy)}
                        />
                      </Field>
                      <Field label="Logo large 16:5" hint="Facultatif.">
                        <Input
                          type="file"
                          accept="image/png,image/jpeg,image/webp"
                          onChange={(event) => selectWalletMedia("wide-logo", event.target.files?.[0] ?? null)}
                          disabled={Boolean(walletBusy)}
                        />
                      </Field>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button onClick={() => void saveWalletDraft()} disabled={Boolean(walletBusy)}>
                        {walletBusy === "saveAppearance" ? "Enregistrement…" : "Enregistrer le brouillon"}
                      </Button>
                      <Button variant="success" onClick={() => void walletAction("publishAppearance")} disabled={Boolean(walletBusy)}>
                        {walletBusy === "publishAppearance" ? "Publication…" : "Publier et synchroniser"}
                      </Button>
                      {walletFailedAction ? (
                        <Button variant="secondary" onClick={() => void walletAction(walletFailedAction)} disabled={Boolean(walletBusy)}>
                          Réessayer
                        </Button>
                      ) : null}
                      <Button variant="secondary" onClick={() => void walletAction("resetAppearance")} disabled={Boolean(walletBusy)}>
                        Réinitialiser
                      </Button>
                    </div>
                  </div>
                  {walletPreviewView ? (
                    <div
                      className="overflow-hidden rounded-[28px] border border-white/15 p-4 shadow-2xl"
                      style={{ backgroundColor: walletAppearance.backgroundColor ?? walletPreviewView.backgroundColor }}
                    >
                      <p className="mb-3 text-xs font-semibold text-white/70">
                        Aperçu indicatif — Google Wallet contrôle la mise en page finale.
                      </p>
                      <div className="flex items-center gap-3">
                        <div className="grid h-12 w-12 place-items-center overflow-hidden rounded-full bg-white/20 ring-1 ring-white/30">
                          {walletMediaState("logo").src || walletPreviewView.logoUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={walletMediaState("logo").src ?? walletPreviewView.logoUrl ?? ""}
                              alt=""
                              className="h-full w-full object-cover"
                              onError={() => markWalletMediaError("logo", "Erreur d'upload")}
                            />
                          ) : (
                            <span className="text-lg font-black text-white">{merchant.name.slice(0, 1)}</span>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-black text-white">{walletPreviewView.issuerName}</p>
                          <p className="truncate text-xs text-white/72">{walletPreviewView.programName}</p>
                        </div>
                      </div>
                      {walletPreviewView.demoOnly ? (
                        <p className="mt-3 text-center text-[11px] font-black uppercase tracking-[0.18em] text-white/70">
                          TESTS UNIQUEMENT
                        </p>
                      ) : null}
                      <div className="mx-auto mt-4 grid h-28 w-28 grid-cols-5 gap-1 rounded-xl bg-white p-3">
                        {Array.from({ length: 25 }).map((_, index) => (
                          <span
                            key={index}
                            className={
                              index % 2 === 0 || index % 7 === 0 || index === 18
                                ? "rounded-[2px] bg-black"
                                : "rounded-[2px] bg-white"
                            }
                          />
                        ))}
                      </div>
                      <p className="mt-2 text-center text-[11px] font-semibold text-white/75">
                        N° client {walletPreviewView.customer.clientNumber}
                      </p>
                      <p className="mt-1 text-center text-[11px] text-white/55">
                        {walletPreviewView.customer.isExample ? "Exemple" : walletPreviewView.customer.name}
                      </p>
                      <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-white">
                        <div className="rounded-xl bg-white/12 p-3">
                          <p className="text-white/60">Solde ({walletPreviewView.loyalty.unit})</p>
                          <p className="text-lg font-black">{walletPreviewView.loyalty.balance}</p>
                        </div>
                        <div className="rounded-xl bg-white/12 p-3">
                          <p className="text-white/60">Objectif ({walletPreviewView.loyalty.unit})</p>
                          <p className="text-lg font-black">{walletPreviewView.loyalty.target}</p>
                        </div>
                      </div>
                      <div className="mt-3 rounded-xl bg-white/12 p-3 text-xs text-white">
                        <p className="font-bold">{walletPreviewView.loyalty.nextRewardName ?? "Aucun avantage configuré"}</p>
                        <p className="mt-1 text-white/65">
                          {walletPreviewView.loyalty.remainingLabel ?? "Aucun seuil suivant"} · {walletPreviewView.loyalty.modeLabel}
                        </p>
                        <p className="mt-1 text-white/65">
                          Avantages disponibles : {walletPreviewView.loyalty.availableRewardsCount}
                        </p>
                      </div>
                      <div className="mt-3 rounded-xl bg-white/92 px-3 py-2 text-center text-xs font-black text-black">
                        {walletAppearance.appLinkLabel ?? walletPreviewView.appLinkLabel}
                      </div>
                      {walletMediaState("wideLogo").src || walletPreviewView.wideLogoUrl ? (
                        <div className="mt-3 flex justify-center">
                          <div className="h-10 max-w-48 overflow-hidden rounded-xl bg-white/12 px-3 py-2">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={walletMediaState("wideLogo").src ?? walletPreviewView.wideLogoUrl ?? ""}
                              alt=""
                              className="h-full w-full object-contain"
                              onError={() => markWalletMediaError("wideLogo", "Erreur d'upload")}
                            />
                          </div>
                        </div>
                      ) : null}
                      <div className="mt-3 aspect-[1032/812] overflow-hidden rounded-2xl bg-black/20">
                        {walletMediaState("hero").src || walletPreviewView.heroImageUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={walletMediaState("hero").src ?? walletPreviewView.heroImageUrl ?? ""}
                            alt=""
                            className="h-full w-full object-cover"
                            onError={() => markWalletMediaError("hero", "Erreur d'upload")}
                          />
                        ) : (
                          <WalletMediaPlaceholder label="Image principale" status={walletMediaState("hero").status} />
                        )}
                      </div>
                    </div>
                  ) : (
                    <Alert>Programme actif indisponible pour l'aperçu Google Wallet.</Alert>
                  )}
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
              <h2 className="mb-3 font-bold">Actions sensibles et audit récent</h2>
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
          </div>
        )}
      </div>
    </SuperAdminShell>
  );
}
