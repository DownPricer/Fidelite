"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { SuperAdminShell } from "@/components/super-admin/layout-shell";
import { MerchantCardRenderer } from "@/components/fife-life/merchant-card-renderer";
import { CardEditorCanvas, elementLabel } from "@/components/super-admin/card-editor-canvas";
import { useEditorHistory } from "@/hooks/use-editor-history";
import {
  CARD_SCHEMA_VERSION,
  defaultCardTemplateConfig,
  type CardElement,
  type CardTemplateConfig,
} from "@/lib/card-template-schema";
import { validateCardTemplateForPublishDetailed } from "@/lib/card-template-validation";
import { Alert, Button, Card, Field, Input } from "@/components/ui";
import type { LoyaltyMode } from "@prisma/client";

const ELEMENT_CATALOG: { type: CardElement["type"]; label: string }[] = [
  { type: "logo", label: "Logo" },
  { type: "merchantName", label: "Nom commerce" },
  { type: "clientName", label: "Identité client" },
  { type: "qr", label: "QR Fife Life" },
  { type: "pointsBalance", label: "Solde points" },
  { type: "visitsCount", label: "Passages" },
  { type: "progressText", label: "Texte progression" },
  { type: "progressBar", label: "Barre progression" },
  { type: "nextReward", label: "Prochain avantage" },
  { type: "unlockedReward", label: "Récompense débloquée" },
  { type: "tierLevel", label: "Palier" },
  { type: "staticText", label: "Texte statique" },
];

export function CardEditorPage({ firstName, merchantId }: { firstName: string; merchantId: string }) {
  const [merchant, setMerchant] = useState<any>(null);
  const [templateId, setTemplateId] = useState<string | null>(null);
  const [templateMeta, setTemplateMeta] = useState<{ version: number; status: string; updatedAt?: string } | null>(null);
  const [backgroundUrl, setBackgroundUrl] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [snapEnabled, setSnapEnabled] = useState(true);
  const [guides, setGuides] = useState<{ orientation: "h" | "v"; pos: number }[]>([]);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [serverVersion, setServerVersion] = useState<number | null>(null);

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
    const tpl = templatesData.templates?.find((t: { status: string }) => t.status === "DRAFT") ?? templatesData.templates?.[0];
    if (tpl) {
      setTemplateId(tpl.id);
      setTemplateMeta({ version: tpl.version, status: tpl.status, updatedAt: tpl.updatedAt });
      setServerVersion(tpl.version);
      setBackgroundUrl(tpl.backgroundUrl ?? "");
      historySetRef.current(tpl.config as CardTemplateConfig, true);
    }
  }, [merchantId]);

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

  const loyaltyMode = (merchant?.program?.mode ?? "VISITS") as LoyaltyMode;
  const config = history.value;

  const validation = useMemo(
    () => (config ? validateCardTemplateForPublishDetailed(config, loyaltyMode) : { ok: false, errors: [] }),
    [config, loyaltyMode],
  );

  const previewCard = useMemo(() => {
    if (!merchant) return null;
    return {
      id: "preview",
      merchantId,
      slug: merchant.slug,
      name: merchant.name,
      logoUrl: merchant.logoUrl,
      primaryColor: merchant.primaryColor,
      points: loyaltyMode === "VISITS" ? 3 : 120,
      visitsRequired: merchant.program?.visitsRequired ?? 10,
      rewardLabel: merchant.program?.rewardLabel ?? "Récompense",
      loyaltyMode,
    };
  }, [merchant, merchantId, loyaltyMode]);

  const selected = config?.elements.find((el) => el.id === selectedId) ?? null;

  function updateElements(elements: CardElement[]) {
    if (!config) return;
    history.set({ ...config, elements });
    setMessage(null);
  }

  function addElement(type: CardElement["type"]) {
    const id = `${type}-${Date.now()}`;
    const element: CardElement = {
      id,
      type,
      label: elementLabel(type),
      x: 0.1,
      y: 0.1,
      width: type === "qr" ? 0.18 : 0.3,
      height: type === "qr" ? 0.18 : 0.08,
      zIndex: (config?.elements.length ?? 0) + 1,
      locked: false,
      hidden: false,
      anchor: "top-left",
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
      },
      text: type === "staticText" ? "Texte" : undefined,
      progressColors: type === "progressBar" ? { fill: "#875BFF", track: "#FFFFFF", radius: 8 } : undefined,
    };
    updateElements([...(config?.elements ?? []), element]);
    setSelectedId(id);
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
        history.set({
          ...config,
          background: { ...config.background, url: data.url },
        });
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
    const payload = {
      merchantId,
      loyaltyMode,
      backgroundUrl,
      config: { ...config, background: { ...config.background, url: backgroundUrl } },
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
      return;
    }
    setTemplateId(data.template.id);
    setServerVersion(data.template.version);
    setSavedAt(new Date().toISOString());
    setMessage("Brouillon enregistré.");
    history.set(data.template.config as CardTemplateConfig, true);
  }

  async function publish() {
    if (!validation.ok) {
      const first = validation.errors[0];
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
    setTemplateMeta({ version: data.template.version, status: "PUBLISHED" });
    setMessage(`Version ${data.template.version} publiée.`);
    setError(null);
  }

  return (
    <SuperAdminShell firstName={firstName}>
      <div className="mx-auto max-w-[1600px] space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-black text-[var(--ink)]">Éditeur de carte</h1>
            <p className="text-sm text-[var(--muted-text)]">
              {merchant?.name ?? "…"} · {loyaltyMode}
              {templateMeta ? ` · v${templateMeta.version} · ${templateMeta.status}` : ""}
            </p>
            {history.dirty ? <p className="text-xs text-amber-300">Modifications non enregistrées</p> : savedAt ? <p className="text-xs text-green-300">Brouillon enregistré</p> : null}
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" disabled={!history.canUndo} onClick={history.undo}>Annuler</Button>
            <Button variant="secondary" disabled={!history.canRedo} onClick={history.redo}>Rétablir</Button>
            <Button variant="secondary" disabled={saving} onClick={() => void saveDraft()}>{saving ? "…" : "Enregistrer le brouillon"}</Button>
            <Button disabled={!validation.ok || saving} onClick={() => void publish()}>Publier</Button>
          </div>
        </div>

        <p className="text-xs text-[var(--muted-text)] lg:hidden">Consultation mobile OK — placement précis recommandé sur écran large.</p>

        {message ? <Alert>{message}</Alert> : null}
        {error ? <Alert>{error}</Alert> : null}
        {!validation.ok && validation.errors.length ? (
          <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-100">
            {validation.errors.map((e) => (
              <button key={e.message} type="button" className="block w-full text-left hover:underline" onClick={() => e.elementId && setSelectedId(e.elementId)}>
                {e.message}
              </button>
            ))}
          </div>
        ) : null}

        <div className="grid gap-4 xl:grid-cols-[240px_minmax(0,1fr)_280px_280px]">
          <Card className="space-y-2 p-3">
            <h2 className="text-xs font-bold uppercase tracking-widest text-[var(--muted-text)]">Éléments</h2>
            {ELEMENT_CATALOG.map((item) => (
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
          </Card>

          <Card className="overflow-auto p-4">
            {config && backgroundUrl ? (
              <CardEditorCanvas
                config={config}
                backgroundUrl={backgroundUrl}
                selectedId={selectedId}
                onSelect={setSelectedId}
                onChangeElements={updateElements}
                snapEnabled={snapEnabled}
                guides={guides}
                onGuidesChange={setGuides}
              />
            ) : (
              <p className="py-20 text-center text-sm text-[var(--muted-text)]">Importez un fond pour commencer.</p>
            )}
          </Card>

          <Card className="space-y-2 p-3">
            <h2 className="text-xs font-bold uppercase tracking-widest text-[var(--muted-text)]">Calques</h2>
            <div className="max-h-80 space-y-1 overflow-y-auto">
              {[...(config?.elements ?? [])].sort((a, b) => b.zIndex - a.zIndex).map((el) => (
                <div key={el.id} className={`flex items-center gap-1 rounded-lg px-2 py-1 text-xs ${selectedId === el.id ? "bg-white/10" : ""}`}>
                  <button type="button" className="flex-1 text-left" onClick={() => setSelectedId(el.id)}>
                    {el.label ?? elementLabel(el.type)}
                  </button>
                  <button type="button" title="Verrouiller" onClick={() => updateElements(config!.elements.map((e) => e.id === el.id ? { ...e, locked: !e.locked } : e))}>{el.locked ? "🔒" : "🔓"}</button>
                  <button type="button" title="Monter" onClick={() => updateElements(config!.elements.map((e) => e.id === el.id ? { ...e, zIndex: e.zIndex + 1 } : e))}>↑</button>
                  <button type="button" title="Descendre" onClick={() => updateElements(config!.elements.map((e) => e.id === el.id ? { ...e, zIndex: Math.max(0, e.zIndex - 1) } : e))}>↓</button>
                  <button type="button" title="Supprimer" onClick={() => { updateElements(config!.elements.filter((e) => e.id !== el.id)); if (selectedId === el.id) setSelectedId(null); }}>×</button>
                </div>
              ))}
            </div>
          </Card>

          <div className="space-y-3">
            <Card className="space-y-2 p-3">
              <h2 className="text-xs font-bold uppercase tracking-widest text-[var(--muted-text)]">Propriétés</h2>
              {!selected ? <p className="text-xs text-[var(--muted-text)]">Sélectionnez un élément sur la carte.</p> : (
                <>
                  <Field label="Ancrage">
                    <select className="w-full rounded-lg border border-white/10 bg-transparent px-2 py-1 text-xs" value={selected.anchor} onChange={(e) => updateElements(config!.elements.map((el) => el.id === selected.id ? { ...el, anchor: e.target.value as CardElement["anchor"] } : el))}>
                      <option value="top-left">Haut gauche</option>
                      <option value="top-center">Haut centre</option>
                      <option value="top-right">Haut droite</option>
                      <option value="center">Centre</option>
                      <option value="bottom-left">Bas gauche</option>
                      <option value="bottom-center">Bas centre</option>
                      <option value="bottom-right">Bas droite</option>
                    </select>
                  </Field>
                  <Button variant="secondary" className="w-full text-xs" onClick={() => {
                    const copy = { ...selected, id: `${selected.type}-copy-${Date.now()}`, x: selected.x + 0.02, y: selected.y + 0.02, zIndex: selected.zIndex + 1 };
                    updateElements([...(config?.elements ?? []), copy]);
                  }}>Dupliquer</Button>
                </>
              )}
            </Card>
            {previewCard && config && backgroundUrl ? (
              <Card className="p-3">
                <h2 className="mb-2 text-xs font-bold uppercase tracking-widest text-[var(--muted-text)]">Aperçu client</h2>
                <MerchantCardRenderer
                  template={{ backgroundUrl, config, loyaltyMode }}
                  merchant={{ name: merchant.name, logoUrl: merchant.logoUrl, primaryColor: merchant.primaryColor }}
                  card={previewCard}
                  slug={merchant.slug}
                  clientName="Aperçu Client"
                  displayMode="adminPreview"
                  showQr
                  interactive={false}
                />
              </Card>
            ) : null}
          </div>
        </div>
      </div>
    </SuperAdminShell>
  );
}
