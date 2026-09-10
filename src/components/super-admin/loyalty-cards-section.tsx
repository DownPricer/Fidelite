"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import type { LoyaltyMode } from "@prisma/client";

import { MerchantCardRenderer } from "@/components/fife-life/merchant-card-renderer";
import { Alert, Button, Card } from "@/components/ui";
import type { MerchantCardTemplateSummary } from "@/lib/merchant-card-template-service";
import { ALL_LOYALTY_MODES, LOYALTY_MODE_CARD_TITLES } from "@/lib/merchant-card-template-service";
import { defaultCardTemplateConfig } from "@/lib/card-template-schema";

function statusLabel(status: MerchantCardTemplateSummary["status"]) {
  if (status === "unconfigured") return "À configurer";
  if (status === "DRAFT") return "Brouillon";
  if (status === "PUBLISHED") return "Publiée";
  return "Archivée";
}

function statusClass(status: MerchantCardTemplateSummary["status"]) {
  if (status === "PUBLISHED") return "bg-emerald-500/15 text-emerald-200";
  if (status === "DRAFT") return "bg-amber-500/15 text-amber-100";
  if (status === "unconfigured") return "bg-white/5 text-[var(--muted-text)]";
  return "bg-white/5 text-[var(--muted-text)]";
}

export function LoyaltyCardsSection({
  merchantId,
  merchantName,
  merchantSlug,
  activeMode,
}: {
  merchantId: string;
  merchantName: string;
  merchantSlug: string;
  activeMode: LoyaltyMode | null;
}) {
  const [summaries, setSummaries] = useState<MerchantCardTemplateSummary[]>([]);
  const [templates, setTemplates] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [busyMode, setBusyMode] = useState<LoyaltyMode | null>(null);

  const load = useCallback(async () => {
    const response = await fetch(`/api/super-admin/card-templates?merchantId=${merchantId}`);
    const data = await response.json();
    if (!response.ok) {
      setError(data.error ?? "Impossible de charger les cartes.");
      return;
    }
    setSummaries(data.summaries ?? []);
    setTemplates(data.templates ?? []);
    setError(null);
  }, [merchantId]);

  useEffect(() => {
    void load();
  }, [load]);

  async function duplicateFrom(sourceMode: LoyaltyMode, targetMode: LoyaltyMode) {
    const source = templates.find((template) => template.loyaltyMode === sourceMode);
    if (!source?.id) {
      alert("Aucune carte source disponible pour ce mode.");
      return;
    }
    setBusyMode(targetMode);
    const response = await fetch(`/api/super-admin/card-templates/${source.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "duplicate-to-modes", targetModes: [targetMode] }),
    });
    setBusyMode(null);
    if (!response.ok) {
      const data = await response.json();
      alert(data.error ?? "Duplication impossible.");
      return;
    }
    await load();
  }

  async function duplicateToMultiple(sourceTemplateId: string) {
    const raw = window.prompt(
      `Dupliquer vers quels modes ? (${ALL_LOYALTY_MODES.join(", ")})`,
      ALL_LOYALTY_MODES.join(", "),
    );
    if (!raw) return;
    const targetModes = raw
      .split(",")
      .map((value) => value.trim())
      .filter((value): value is LoyaltyMode =>
        ALL_LOYALTY_MODES.includes(value as LoyaltyMode),
      );
    if (targetModes.length === 0) return;
    setBusyMode(targetModes[0] ?? null);
    const response = await fetch(`/api/super-admin/card-templates/${sourceTemplateId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "duplicate-to-modes", targetModes }),
    });
    setBusyMode(null);
    if (!response.ok) {
      const data = await response.json();
      alert(data.error ?? "Duplication impossible.");
      return;
    }
    await load();
  }

  const orderedSummaries =
    summaries.length > 0
      ? summaries
      : ALL_LOYALTY_MODES.map((loyaltyMode) => ({
          loyaltyMode,
          title: LOYALTY_MODE_CARD_TITLES[loyaltyMode],
          templateId: null,
          status: "unconfigured" as const,
          version: null,
          backgroundUrl: null,
          updatedAt: null,
          publishedAt: null,
          isActiveProgramMode: activeMode === loyaltyMode,
        }));

  return (
    <Card className="space-y-4 p-5 lg:col-span-2">
      <div>
        <h2 className="font-bold">Cartes du programme de fidélité</h2>
        <p className="text-xs text-[var(--muted-text)]">
          Un gabarit par mode réel — le programme actif du commerce détermine la carte affichée dans le wallet.
        </p>
      </div>

      {error ? <Alert>{error}</Alert> : null}

      <div className="space-y-3">
        {orderedSummaries.map((summary) => {
          const previewConfig = summary.backgroundUrl
            ? defaultCardTemplateConfig(summary.backgroundUrl)
            : null;
          const isActive = summary.isActiveProgramMode;
          return (
            <div
              key={summary.loyaltyMode}
              className={`flex flex-col gap-3 rounded-2xl border p-4 sm:flex-row sm:items-center ${
                isActive ? "border-[var(--violet)]/50 bg-[var(--violet)]/10" : "border-white/10 bg-white/[0.02]"
              }`}
            >
              <div className="w-[140px] shrink-0 overflow-hidden rounded-xl border border-white/10 bg-black/20">
                {previewConfig ? (
                  <MerchantCardRenderer
                    merchant={{ name: merchantName, logoUrl: null, primaryColor: "#8557ff" }}
                    card={{
                      id: "preview",
                      merchantId,
                      slug: merchantSlug,
                      name: merchantName,
                      logoUrl: null,
                      primaryColor: "#8557ff",
                      points: summary.loyaltyMode === "VISITS" ? 3 : 120,
                      visitsRequired: summary.loyaltyMode === "VISITS" ? 10 : 500,
                      rewardLabel: "Récompense",
                      loyaltyMode: summary.loyaltyMode,
                      cardTemplate: {
                        backgroundUrl: summary.backgroundUrl,
                        config: previewConfig,
                        loyaltyMode: summary.loyaltyMode,
                      },
                    }}
                    slug={merchantSlug}
                    clientName="Marie Dupont"
                    displayMode="adminPreview"
                    progressPercentOverride={55}
                  />
                ) : (
                  <div className="grid aspect-[1.586/1] place-items-center text-[10px] text-[var(--muted-text)]">
                    Aperçu indisponible
                  </div>
                )}
              </div>

              <div className="min-w-0 flex-1 space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-semibold">{summary.title}</h3>
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${statusClass(summary.status)}`}>
                    {statusLabel(summary.status)}
                  </span>
                  {isActive ? (
                    <span className="rounded-full bg-[var(--violet)] px-2 py-0.5 text-[10px] font-semibold text-white">
                      Programme actuellement actif
                    </span>
                  ) : null}
                </div>
                <p className="text-xs text-[var(--muted-text)]">
                  {summary.version ? `Version ${summary.version}` : "Aucune version"}
                  {summary.updatedAt ? ` · Modifiée le ${new Date(summary.updatedAt).toLocaleString("fr-FR")}` : ""}
                  {summary.publishedAt ? ` · Publiée le ${new Date(summary.publishedAt).toLocaleString("fr-FR")}` : ""}
                </p>
              </div>

              <div className="flex flex-wrap gap-2 sm:justify-end">
                <Link href={`/super-admin/cartes/${merchantId}/editeur?mode=${summary.loyaltyMode}`}>
                  <Button variant="secondary">Modifier</Button>
                </Link>
                <Button
                  variant="secondary"
                  disabled={busyMode === summary.loyaltyMode}
                  onClick={() => {
                    const source = window.prompt(
                      "Dupliquer depuis quel mode ? (VISITS, POINTS_BY_AMOUNT, FIXED_POINTS, AMOUNT_TIERS)",
                      summary.loyaltyMode,
                    ) as LoyaltyMode | null;
                    if (!source || !ALL_LOYALTY_MODES.includes(source)) return;
                    void duplicateFrom(source, summary.loyaltyMode);
                  }}
                >
                  Dupliquer depuis une autre carte
                </Button>
                {summary.templateId ? (
                  <Button
                    variant="secondary"
                    onClick={() => void duplicateToMultiple(summary.templateId!)}
                  >
                    Dupliquer cette carte vers…
                  </Button>
                ) : null}
                <Link
                  href={`/super-admin/cartes/${merchantId}/editeur?mode=${summary.loyaltyMode}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Button>Prévisualiser</Button>
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
