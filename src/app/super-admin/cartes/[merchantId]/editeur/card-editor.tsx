"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { SuperAdminShell } from "@/components/super-admin/layout-shell";
import { CardEditorBackgroundCrop } from "@/components/super-admin/card-editor-background-crop";
import { CardEditorCanvas, elementLabel } from "@/components/super-admin/card-editor-canvas";
import { CardEditorProperties } from "@/components/super-admin/card-editor-properties";
import { useEditorHistory } from "@/hooks/use-editor-history";
import {
  defaultCardTemplateConfig,
  type CardElement,
  type CardTemplateConfig,
} from "@/lib/card-template-schema";
import { defaultDataKey } from "@/lib/card-template-data-keys";
import {
  applyEditorAutoFix,
  migrateLegacyOnLoad,
  summarizeEditorValidation,
} from "@/lib/card-template-editor-validation";
import {
  normalizeCardElement,
  normalizeCardTemplateConfig,
  normalizeCardTemplateForSlot,
} from "@/lib/card-template-normalize";
import { CARD_EDITOR_REFERENCE_WIDTH } from "@/lib/card-template-normalize";
import { ELEMENT_TYPE_LABELS, elementTypeLabel } from "@/lib/card-template-i18n";
import {
  allowedElementTypesForSlot,
  createDefaultLoyaltyWidgetElement,
  loyaltyWidgetLabelForSlot,
} from "@/lib/loyalty-widget";
import { pickCanonicalTemplate } from "@/lib/merchant-card-template-service";
import { CARD_SLOT_TITLES, isLoyaltyProgramSlot } from "@/lib/merchant-card-slots";
import { qrNormalizedHeight } from "@/lib/card-template-qr-geometry";
import { defaultNextRewardStyle } from "@/lib/next-reward-styles";
import { Alert, Button, Card, Field, Input } from "@/components/ui";
import type { CardTemplateStatus, LoyaltyMode, MerchantCardSlot } from "@prisma/client";

function buildElementCatalog(cardSlot: MerchantCardSlot): { type: CardElement["type"]; label: string }[] {
  const allowed = new Set(allowedElementTypesForSlot(cardSlot));
  const loyaltyLabel = loyaltyWidgetLabelForSlot(cardSlot);
  return (Object.entries(ELEMENT_TYPE_LABELS) as [CardElement["type"], string][])
    .filter(([type]) => allowed.has(type))
    .map(([type, label]) => ({
      type,
      label: type === "loyaltyWidget" && loyaltyLabel ? loyaltyLabel : label,
    }));
}

type PreviewScenario = "shortName" | "longName" | "noPoints" | "midProgress" | "rewardReached";

const SCENARIO_LABELS: Record<PreviewScenario, string> = {
  shortName: "Nom client court",
  longName: "Nom client long",
  noPoints: "Aucun point",
  midProgress: "Progression moyenne",
  rewardReached: "Récompense atteinte",
};

const PROGRESS_STEPS = [0, 25, 50, 75, 100];

export function CardEditorPage({
  firstName,
  merchantId,
  cardSlot,
  galleryHref,
}: {
  firstName: string;
  merchantId: string;
  cardSlot: MerchantCardSlot;
  galleryHref: string;
}) {
  const [merchant, setMerchant] = useState<any>(null);
  const [templateId, setTemplateId] = useState<string | null>(null);
  const [templateMeta, setTemplateMeta] = useState<{
    version: number;
    status: string;
    updatedAt?: string;
    cardSlot: MerchantCardSlot;
  } | null>(null);
  const [backgroundUrl, setBackgroundUrl] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [snapEnabled, setSnapEnabled] = useState(true);
  const [guides, setGuides] = useState<{ orientation: "h" | "v"; pos: number }[]>([]);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [zoom, setZoom] = useState(100);
  const [previewScenario, setPreviewScenario] = useState<PreviewScenario>("midProgress");
  const [progressTestPct, setProgressTestPct] = useState(50);
  const [recentColors, setRecentColors] = useState<string[]>([]);
  const [mobilePropsOpen, setMobilePropsOpen] = useState(false);
  const [cropBackgroundMode, setCropBackgroundMode] = useState(false);
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const [resetBusy, setResetBusy] = useState(false);

  const canvasViewportRef = useRef<HTMLDivElement>(null);

  const history = useEditorHistory<CardTemplateConfig | null>(null);
  const historySetRef = useRef(history.set);
  historySetRef.current = history.set;

  const load = useCallback(async () => {
    const [merchantRes, templatesRes] = await Promise.all([
      fetch(`/api/super-admin/merchants/${merchantId}`),
      fetch(`/api/super-admin/card-templates?merchantId=${merchantId}`),
    ]);
    const merchantData = await merchantRes.json();
    const templatesData = await templatesRes.json();
    setMerchant(merchantData.merchant);
    const templates = (templatesData.templates ?? []) as Array<{
      id: string;
      cardSlot: MerchantCardSlot;
      status: CardTemplateStatus;
      version: number;
      updatedAt: string;
      backgroundUrl?: string | null;
      config: CardTemplateConfig;
      isDefault: boolean;
    }>;
    const tpl =
      templates.find((template) => template.cardSlot === cardSlot && template.status === "DRAFT") ??
      pickCanonicalTemplate(templates, cardSlot);
    if (tpl) {
      setTemplateId(tpl.id);
      setTemplateMeta({
        version: tpl.version,
        status: tpl.status,
        updatedAt: tpl.updatedAt,
        cardSlot: tpl.cardSlot,
      });
      setBackgroundUrl(tpl.backgroundUrl ?? "");
      const loaded = tpl.config as CardTemplateConfig;
      const { config: migrated, migrated: hadLegacy } = migrateLegacyOnLoad(loaded, cardSlot);
      historySetRef.current(normalizeCardTemplateForSlot(migrated, cardSlot), !hadLegacy);
      if (hadLegacy) {
        setMessage("Anciens éléments convertis en bloc de fidélité. Enregistrez le brouillon.");
      }
    } else {
      setTemplateId(null);
      setTemplateMeta({ version: 1, status: "DRAFT", cardSlot });
      setBackgroundUrl("");
      historySetRef.current(null, true);
    }
  }, [cardSlot, merchantId]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    function onKey(ev: KeyboardEvent) {
      if ((ev.ctrlKey || ev.metaKey) && ev.key === "z" && !ev.shiftKey) {
        ev.preventDefault();
        history.undo();
      }
      if ((ev.ctrlKey || ev.metaKey) && (ev.key === "y" || (ev.key === "z" && ev.shiftKey))) {
        ev.preventDefault();
        history.redo();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [history]);

  const previewLoyaltyMode = (merchant?.program?.mode ?? "VISITS") as LoyaltyMode;
  const editorLoyaltyMode = isLoyaltyProgramSlot(cardSlot) ? cardSlot : previewLoyaltyMode;
  const config = history.value;
  const elementCatalog = useMemo(() => buildElementCatalog(cardSlot), [cardSlot]);

  const validation = useMemo(
    () => (config ? summarizeEditorValidation(config, cardSlot) : { ok: false, issues: [] }),
    [config, cardSlot],
  );

  function applyAutoFix(fix: "migrate_legacy" | "add_loyalty_widget") {
    if (!config) return;
    const next = normalizeCardTemplateForSlot(applyEditorAutoFix(config, cardSlot, fix), cardSlot);
    history.set(next);
    setMessage(
      fix === "migrate_legacy"
        ? "Anciens éléments remplacés par le bloc de fidélité."
        : "Bloc de fidélité ajouté.",
    );
    setError(null);
  }

  const visitsRequired = merchant?.program?.visitsRequired ?? 10;

  const previewClientName = useMemo(() => {
    switch (previewScenario) {
      case "shortName":
        return "Léa M.";
      case "longName":
        return "Jean-Baptiste de la Fontaine-Montclair";
      default:
        return "Marie Dupont";
    }
  }, [previewScenario]);

  const previewProgress = useMemo(() => {
    const target = editorLoyaltyMode === "VISITS" ? visitsRequired : 200;
    let current: number;
    switch (previewScenario) {
      case "noPoints":
        current = 0;
        break;
      case "rewardReached":
        current = target;
        break;
      case "midProgress":
        current = Math.round(target * 0.5);
        break;
      default:
        current = Math.round(target * (progressTestPct / 100));
    }
    if (previewScenario !== "noPoints" && previewScenario !== "midProgress" && previewScenario !== "rewardReached") {
      current = Math.round(target * (progressTestPct / 100));
    }
    const rewardName = merchant?.program?.rewardLabel ?? "Récompense";
    const remaining = Math.max(0, target - current);
    return {
      current,
      target,
      label:
        current >= target
          ? `${rewardName} disponible`
          : `Encore ${remaining} · ${rewardName}`,
      nextReward: rewardName,
      nextRewardName: rewardName,
      nextRewardHeadline: "Prochain avantage",
    };
  }, [previewScenario, progressTestPct, editorLoyaltyMode, visitsRequired, merchant?.program?.rewardLabel]);

  const previewCard = useMemo(() => {
    if (!merchant) return null;
    return {
      id: "preview",
      merchantId,
      slug: merchant.slug,
      name: merchant.name,
      logoUrl: merchant.logoUrl,
      primaryColor: merchant.primaryColor,
      points: previewProgress.current,
      visitsRequired: previewProgress.target,
      rewardLabel: merchant.program?.rewardLabel ?? "Récompense",
      loyaltyMode: editorLoyaltyMode,
    };
  }, [merchant, merchantId, editorLoyaltyMode, previewProgress]);

  const selected = config?.elements.find((el) => el.id === selectedId) ?? null;

  function updateElements(elements: CardElement[]) {
    if (!config) return;
    history.set({ ...config, elements: elements.map(normalizeCardElement) });
    setMessage(null);
  }

  function updateElement(id: string, patch: Partial<CardElement>) {
    if (!config) return;
    updateElements(
      config.elements.map((el) => (el.id === id ? normalizeCardElement({ ...el, ...patch }) : el)),
    );
  }

  function addElement(type: CardElement["type"]) {
    if (!config) return;
    if (type === "loyaltyWidget") {
      const existing = config.elements.some((el) => el.type === "loyaltyWidget");
      if (existing) {
        setError("Un seul bloc de fidélité est autorisé par carte.");
        return;
      }
      const widget = createDefaultLoyaltyWidgetElement(cardSlot, config.elements.length + 1);
      if (!widget) return;
      const normalized = normalizeCardElement(widget);
      updateElements([...config.elements, normalized]);
      setSelectedId(normalized.id);
      return;
    }

    const id = `${type}-${Date.now()}`;
    const element = normalizeCardElement({
      id,
      type,
      label: elementLabel(type),
      x: 0.1,
      y: 0.1,
      width: type === "qr" ? 0.18 : type === "decorative" ? 0.2 : 0.3,
      height: type === "qr" ? qrNormalizedHeight(0.18) : type === "decorative" ? 0.12 : 0.08,
      zIndex: config.elements.length + 1,
      locked: false,
      hidden: false,
      anchor: "top-left",
      lockAspectRatio: type === "qr" || type === "logo",
      dataKey: defaultDataKey(type),
      style: {
        fontFamily: "system",
        fontSize: 16,
        fontWeight: "600",
        color: "#FFFFFF",
        textAlign: "left",
        opacity: 1,
        lineHeight: 1.2,
        shadow: true,
        borderRadius: 0,
        fitMode: "manual",
        minFontSize: 10,
        maxLines: 2,
      },
      text: type === "staticText" ? "Texte" : undefined,
      decorativeStyle:
        type === "decorative"
          ? { backgroundColor: "#FFFFFF22", borderRadius: 12, shape: "rectangle" }
          : undefined,
      logoStyle: type === "logo" ? { objectFit: "contain", borderRadius: 12, lockAspectRatio: true } : undefined,
      nextRewardStyle:
        type === "nextReward"
          ? defaultNextRewardStyle(merchant?.primaryColor ?? "#875BFF")
          : undefined,
    });
    updateElements([...config.elements, element]);
    setSelectedId(id);
  }

  function fitToScreen() {
    const viewport = canvasViewportRef.current;
    if (!viewport) return;
    const available = viewport.clientWidth - 32;
    const fitZoom = Math.min(200, Math.max(50, Math.round((available / CARD_EDITOR_REFERENCE_WIDTH) * 100)));
    setZoom(fitZoom);
  }

  useEffect(() => {
    fitToScreen();
    function onResize() {
      fitToScreen();
    }
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [config, backgroundUrl]);

  function trackColor(color: string) {
    setRecentColors((prev) => [color, ...prev.filter((c) => c !== color)].slice(0, 8));
  }

  function updateBackground(patch: Partial<CardTemplateConfig["background"]>) {
    if (!config) return;
    history.set(
      normalizeCardTemplateConfig({
        ...config,
        background: { ...config.background, url: backgroundUrl, ...patch },
      }),
    );
    setMessage(null);
  }

  async function uploadBackground(file: File) {
    const reader = new FileReader();
    reader.onload = async () => {
      const dataUrl = String(reader.result ?? "");
      const response = await fetch("/api/super-admin/upload/card-background", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ merchantId, dataUrl }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error ?? "Upload impossible.");
        return;
      }
      setBackgroundUrl(data.url);
      if (config) {
        history.set(
          normalizeCardTemplateConfig({
            ...config,
            background: { ...config.background, url: data.url },
          }),
        );
      } else {
        history.set(defaultCardTemplateConfig(data.url), true);
      }
      setError(null);
    };
    reader.readAsDataURL(file);
  }

  async function saveDraft() {
    if (!config) return;
    setSaving(true);
    setError(null);
    const normalized = normalizeCardTemplateForSlot(
      {
        ...config,
        background: { ...config.background, url: backgroundUrl },
      },
      cardSlot,
    );
    const payload = {
      merchantId,
      cardSlot,
      backgroundUrl,
      config: normalized,
    };
    const response = await fetch(templateId ? `/api/super-admin/card-templates/${templateId}` : "/api/super-admin/card-templates", {
      method: templateId ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    setSaving(false);
    if (!response.ok) {
      setError(data.error ?? "Enregistrement impossible.");
      setMessage(null);
      return;
    }
    setTemplateId(data.template.id);
    setTemplateMeta({
      version: data.template.version,
      status: data.template.status ?? "DRAFT",
      cardSlot: data.template.cardSlot ?? cardSlot,
    });
    setSavedAt(new Date().toISOString());
    setMessage("Brouillon enregistré.");
    history.set(normalizeCardTemplateForSlot(data.template.config as CardTemplateConfig, cardSlot), true);
  }

  async function runResetAction(action: "restore-published" | "reset-draft") {
    if (!templateId) {
      setError("Aucun brouillon à réinitialiser.");
      return;
    }
    setResetBusy(true);
    setError(null);
    const response = await fetch(`/api/super-admin/card-templates/${templateId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }),
    });
    const data = await response.json();
    setResetBusy(false);
    setResetDialogOpen(false);
    if (!response.ok) {
      setError(data.error ?? "Réinitialisation impossible.");
      return;
    }
    setTemplateId(data.template.id);
    setTemplateMeta({
      version: data.template.version,
      status: data.template.status ?? "DRAFT",
      cardSlot: data.template.cardSlot ?? cardSlot,
    });
    setBackgroundUrl(data.template.backgroundUrl ?? "");
    history.set(
      normalizeCardTemplateForSlot(data.template.config as CardTemplateConfig, cardSlot),
      true,
    );
    setMessage(
      action === "restore-published"
        ? "Version publiée restaurée dans le brouillon."
        : "Brouillon réinitialisé avec les éléments obligatoires.",
    );
  }

  async function publish() {
    if (!validation.ok) {
      const first = validation.issues[0];
      setError(first.message);
      if (first.elementId) setSelectedId(first.elementId);
      return;
    }
    if (history.dirty) await saveDraft();
    if (!templateId) return;
    const response = await fetch(`/api/super-admin/card-templates/${templateId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "publish" }),
    });
    const data = await response.json();
    if (!response.ok) {
      setError(data.error ?? "Publication impossible.");
      return;
    }
    setTemplateMeta({
      version: data.template.version,
      status: "PUBLISHED",
      cardSlot: data.template.cardSlot ?? cardSlot,
    });
    setMessage(`Version ${data.template.version} publiée.`);
    setError(null);
  }

  const propertiesPanel = selected && config ? (
    <CardEditorProperties
      element={selected}
      config={config}
      loyaltyMode={editorLoyaltyMode}
      cardSlot={cardSlot}
      merchantPrimaryColor={merchant?.primaryColor ?? "#875BFF"}
      onUpdate={(patch) => updateElement(selected.id, patch)}
      onDuplicate={() => {
        const copy = normalizeCardElement({
          ...selected,
          id: `${selected.type}-copy-${Date.now()}`,
          x: Math.min(0.95, selected.x + 0.02),
          y: Math.min(0.95, selected.y + 0.02),
          zIndex: selected.zIndex + 1,
        });
        updateElements([...config.elements, copy]);
        setSelectedId(copy.id);
      }}
      onDelete={() => {
        updateElements(config.elements.filter((e) => e.id !== selected.id));
        setSelectedId(null);
      }}
      recentColors={recentColors}
      onColorUsed={trackColor}
    />
  ) : (
    <p className="text-xs text-[var(--muted-text)]">Sélectionnez un élément sur la carte.</p>
  );

  return (
    <SuperAdminShell firstName={firstName}>
      <div className="mx-auto max-w-[1800px] space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <Link href={galleryHref} className="text-xs font-semibold text-[var(--violet-bright)] hover:underline">
              ← Retour aux cartes du commerce
            </Link>
            <h1 className="mt-1 text-2xl font-black text-[var(--ink)]">Commerce : {merchant?.name ?? "…"}</h1>
            <p className="text-sm text-[var(--muted-text)]">
              Carte : {CARD_SLOT_TITLES[cardSlot]}
              {templateMeta ? ` · v${templateMeta.version} · ${templateMeta.status}` : ""}
            </p>
            <p className="text-xs text-[var(--muted-text)]">
              L’emplacement de cette carte est verrouillé. Pour éditer une autre variante, revenez à la galerie.
            </p>
            {history.dirty ? <p className="text-xs text-amber-300">Modifications non enregistrées</p> : savedAt ? <p className="text-xs text-green-300">Brouillon enregistré</p> : null}
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" disabled={resetBusy} onClick={() => setResetDialogOpen(true)}>
              Réinitialiser
            </Button>
            <Button variant="secondary" disabled={!history.canUndo} onClick={history.undo}>Annuler</Button>
            <Button variant="secondary" disabled={!history.canRedo} onClick={history.redo}>Rétablir</Button>
            <Button variant="secondary" disabled={saving} onClick={() => void saveDraft()}>{saving ? "…" : "Enregistrer le brouillon"}</Button>
            <Button disabled={!validation.ok || saving} onClick={() => void publish()}>Publier</Button>
          </div>
        </div>

        <p className="text-xs text-[var(--muted-text)] lg:hidden">Consultation mobile OK — placement précis recommandé sur écran large.</p>

        {message ? <Alert>{message}</Alert> : null}
        {error ? <Alert>{error}</Alert> : null}
        {!validation.ok && validation.issues.length ? (
          <div className="space-y-2">
            {validation.issues.map((issue) => (
              <div
                key={issue.code ?? issue.message}
                className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-100"
              >
                <p>{issue.message}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {issue.autoFix === "migrate_legacy" ? (
                    <Button
                      variant="secondary"
                      className="text-xs"
                      onClick={() => applyAutoFix("migrate_legacy")}
                    >
                      Corriger automatiquement
                    </Button>
                  ) : null}
                  {issue.autoFix === "add_loyalty_widget" ? (
                    <Button
                      variant="secondary"
                      className="text-xs"
                      onClick={() => applyAutoFix("add_loyalty_widget")}
                    >
                      Ajouter le bloc
                    </Button>
                  ) : null}
                  {issue.elementId ? (
                    <button
                      type="button"
                      className="text-[10px] underline opacity-80"
                      onClick={() => setSelectedId(issue.elementId!)}
                    >
                      Voir l’élément
                    </button>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        ) : null}

        {resetDialogOpen ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
            <Card className="max-w-md space-y-4 p-5">
              <h2 className="text-lg font-bold text-[var(--ink)]">Réinitialiser cette carte</h2>
              <p className="text-sm text-[var(--muted-text)]">
                La carte actuellement publiée restera visible par les clients jusqu’à la publication de
                votre nouveau brouillon.
              </p>
              <div className="space-y-2">
                <Button
                  variant="secondary"
                  className="w-full justify-start"
                  disabled={resetBusy}
                  onClick={() => void runResetAction("restore-published")}
                >
                  Restaurer la version publiée
                </Button>
                <p className="text-[10px] text-[var(--muted-text)]">
                  Abandonne les changements du brouillon et reprend la dernière version publiée.
                </p>
                <Button
                  variant="secondary"
                  className="w-full justify-start"
                  disabled={resetBusy}
                  onClick={() => void runResetAction("reset-draft")}
                >
                  Recommencer cette carte de zéro
                </Button>
                <p className="text-[10px] text-[var(--muted-text)]">
                  Crée un brouillon propre pour {CARD_SLOT_TITLES[cardSlot]} avec les éléments
                  obligatoires uniquement.
                </p>
              </div>
              <Button variant="secondary" className="w-full" disabled={resetBusy} onClick={() => setResetDialogOpen(false)}>
                Annuler
              </Button>
            </Card>
          </div>
        ) : null}

        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_340px] xl:grid-cols-[200px_minmax(0,1fr)_360px]">
          <Card className="hidden space-y-2 p-3 xl:block">
            <h2 className="text-xs font-bold uppercase tracking-widest text-[var(--muted-text)]">Éléments</h2>
            <p className="text-[10px] text-[var(--muted-text)]">Ajouter un élément</p>
            {elementCatalog.map((item) => (
              <Button key={item.type} variant="secondary" className="w-full justify-start text-xs" onClick={() => addElement(item.type)}>
                + {item.label}
              </Button>
            ))}
            <Field label="Fond PNG/JPEG/WebP">
              <Input type="file" accept="image/png,image/jpeg,image/webp" onChange={(e) => { const f = e.target.files?.[0]; if (f) void uploadBackground(f); }} />
            </Field>
            <label className="flex items-center gap-2 text-xs">
              <input type="checkbox" checked={snapEnabled} onChange={(e) => setSnapEnabled(e.target.checked)} />
              Aimantation
            </label>
            <Button
              variant="secondary"
              className="w-full text-xs"
              disabled={!backgroundUrl}
              onClick={() => { setCropBackgroundMode((v) => !v); setSelectedId(null); }}
            >
              {cropBackgroundMode ? "Retour à l’édition" : "Recadrer le fond de la carte"}
            </Button>
          </Card>

          <div className="min-w-0 space-y-3">
            <Card className="space-y-3 p-3 xl:hidden">
              <details>
                <summary className="cursor-pointer text-xs font-bold uppercase tracking-widest text-[var(--muted-text)]">Éléments & fond</summary>
                <div className="mt-2 space-y-2">
                  {elementCatalog.map((item) => (
                    <Button key={item.type} variant="secondary" className="w-full justify-start text-xs" onClick={() => addElement(item.type)}>
                      + {item.label}
                    </Button>
                  ))}
                  <Field label="Fond">
                    <Input type="file" accept="image/png,image/jpeg,image/webp" onChange={(e) => { const f = e.target.files?.[0]; if (f) void uploadBackground(f); }} />
                  </Field>
                </div>
              </details>
            </Card>

            <Card className="p-3">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-1">
                  <Button variant="secondary" className="text-xs" onClick={fitToScreen}>Ajuster à l&apos;écran</Button>
                  <Button variant="secondary" className="px-2 text-xs" onClick={() => setZoom((z) => Math.max(50, z - 10))}>−</Button>
                  <span className="min-w-[3rem] text-center text-xs font-bold">{zoom} %</span>
                  <Button variant="secondary" className="px-2 text-xs" onClick={() => setZoom((z) => Math.min(200, z + 10))}>+</Button>
                  <Button variant="secondary" className="text-xs" onClick={() => setZoom(100)}>100 %</Button>
                </div>
                <div className="min-w-[180px]">
                  <Field label="Scénario aperçu">
                    <select
                      className="w-full rounded-lg border border-white/10 bg-transparent px-2 py-1 text-xs"
                      value={previewScenario}
                      onChange={(e) => setPreviewScenario(e.target.value as PreviewScenario)}
                    >
                      {(Object.keys(SCENARIO_LABELS) as PreviewScenario[]).map((key) => (
                        <option key={key} value={key}>{SCENARIO_LABELS[key]}</option>
                      ))}
                    </select>
                  </Field>
                </div>
              </div>

              <div className="mb-3 flex flex-wrap items-center gap-2">
                <span className="text-[10px] uppercase tracking-widest text-[var(--muted-text)]">Progression test</span>
                {PROGRESS_STEPS.map((pct) => (
                  <button
                    key={pct}
                    type="button"
                    className={`rounded px-2 py-0.5 text-xs ${progressTestPct === pct ? "bg-[var(--violet-bright)] text-white" : "bg-white/10"}`}
                    onClick={() => setProgressTestPct(pct)}
                  >
                    {pct} %
                  </button>
                ))}
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={progressTestPct}
                  onChange={(e) => setProgressTestPct(Number(e.target.value))}
                  className="min-w-[120px] flex-1"
                />
              </div>

              <div ref={canvasViewportRef} className="overflow-x-auto overflow-y-visible py-2">
                {cropBackgroundMode && config && backgroundUrl ? (
                  <CardEditorBackgroundCrop
                    backgroundUrl={backgroundUrl}
                    background={config.background}
                    onChange={updateBackground}
                  />
                ) : null}
                {!cropBackgroundMode && config && backgroundUrl && previewCard && merchant ? (
                  <CardEditorCanvas
                    config={config}
                    backgroundUrl={backgroundUrl}
                    selectedId={selectedId}
                    onSelect={setSelectedId}
                    onChangeElements={updateElements}
                    snapEnabled={snapEnabled}
                    guides={guides}
                    onGuidesChange={setGuides}
                    zoom={zoom}
                    loyaltyMode={editorLoyaltyMode}
                    previewCard={previewCard}
                    previewMerchant={{
                      name: merchant.name,
                      logoUrl: merchant.logoUrl,
                      primaryColor: merchant.primaryColor,
                    }}
                    previewClientName={previewClientName}
                    progressPercentOverride={progressTestPct}
                  />
                ) : !cropBackgroundMode ? (
                  <p className="py-20 text-center text-sm text-[var(--muted-text)]">Importez un fond pour commencer.</p>
                ) : null}
              </div>
            </Card>
          </div>

          <div className="space-y-3">
            <Card className="space-y-2 p-3">
              <h2 className="text-xs font-bold uppercase tracking-widest text-[var(--muted-text)]">Calques</h2>
              <div className="max-h-48 space-y-1 overflow-y-auto xl:max-h-64">
                {[...(config?.elements ?? [])].sort((a, b) => b.zIndex - a.zIndex).map((el) => (
                  <div key={el.id} className={`flex items-center gap-1 rounded-lg px-2 py-1 text-xs ${selectedId === el.id ? "bg-white/10" : ""}`}>
                    <button type="button" className="flex-1 truncate text-left" onClick={() => setSelectedId(el.id)}>
                      {el.label?.trim() || elementTypeLabel(el.type)}
                    </button>
                    <button type="button" title="Verrouiller" onClick={() => updateElements(config!.elements.map((e) => e.id === el.id ? { ...e, locked: !e.locked } : e))}>{el.locked ? "🔒" : "🔓"}</button>
                    <button type="button" title="Monter" onClick={() => updateElements(config!.elements.map((e) => e.id === el.id ? { ...e, zIndex: e.zIndex + 1 } : e))}>↑</button>
                    <button type="button" title="Descendre" onClick={() => updateElements(config!.elements.map((e) => e.id === el.id ? { ...e, zIndex: Math.max(0, e.zIndex - 1) } : e))}>↓</button>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="hidden p-3 lg:block">
              <h2 className="mb-2 text-xs font-bold uppercase tracking-widest text-[var(--muted-text)]">Propriétés</h2>
              {propertiesPanel}
            </Card>

            <div className="lg:hidden">
              <Button variant="secondary" className="w-full" onClick={() => setMobilePropsOpen(true)}>
                Propriétés {selected ? `· ${selected.label ?? elementLabel(selected.type)}` : ""}
              </Button>
              {mobilePropsOpen ? (
                <div className="fixed inset-x-0 bottom-0 z-50 max-h-[70vh] overflow-y-auto rounded-t-2xl border border-white/15 bg-[var(--surface)] p-4 shadow-2xl">
                  <div className="mb-3 flex items-center justify-between">
                    <h2 className="text-sm font-bold">Propriétés</h2>
                    <button type="button" className="text-xs" onClick={() => setMobilePropsOpen(false)}>Fermer</button>
                  </div>
                  {propertiesPanel}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </SuperAdminShell>
  );
}
