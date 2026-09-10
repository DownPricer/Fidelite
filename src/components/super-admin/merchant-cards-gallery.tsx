"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import type { MerchantCardSlot } from "@prisma/client";

import { MerchantCardRenderer } from "@/components/fife-life/merchant-card-renderer";
import { Alert, Button, Card } from "@/components/ui";
import { defaultCardTemplateConfig } from "@/lib/card-template-schema";
import type { MerchantCardSlotSummary } from "@/lib/merchant-card-template-service";
import {
  ALL_MERCHANT_CARD_SLOTS,
  CARD_SLOT_TITLES,
  cardSlotEditorPath,
} from "@/lib/merchant-card-slots";

function statusBadgeClass(displayStatus: MerchantCardSlotSummary["displayStatus"]) {
  if (displayStatus === "Actuellement utilisée") return "bg-[var(--violet)] text-white";
  if (displayStatus === "Publiée") return "bg-emerald-500/15 text-emerald-200";
  if (displayStatus === "Brouillon") return "bg-amber-500/15 text-amber-100";
  return "bg-white/5 text-[var(--muted-text)]";
}

export function MerchantCardsGallery({
  merchantId,
  merchantName,
  merchantSlug,
}: {
  merchantId: string;
  merchantName: string;
  merchantSlug: string;
}) {
  const [summaries, setSummaries] = useState<MerchantCardSlotSummary[]>([]);
  const [templates, setTemplates] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [busySlot, setBusySlot] = useState<MerchantCardSlot | null>(null);

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

  async function duplicateFrom(sourceSlot: MerchantCardSlot, targetSlot: MerchantCardSlot) {
    const source = templates.find((template) => template.cardSlot === sourceSlot);
    if (!source?.id) {
      alert("Aucune carte source disponible pour cet emplacement.");
      return;
    }
    setBusySlot(targetSlot);
    const response = await fetch(`/api/super-admin/card-templates/${source.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "duplicate-to-slots", targetSlots: [targetSlot] }),
    });
    setBusySlot(null);
    const data = await response.json();
    if (!response.ok) {
      alert(data.error ?? "Duplication impossible.");
      return;
    }
    await load();
  }

  async function slotAction(templateId: string, action: "archive" | "reset-draft") {
    const label = action === "archive" ? "archiver cette carte" : "réinitialiser le brouillon";
    if (!window.confirm(`Confirmer : ${label} ?`)) return;
    const response = await fetch(`/api/super-admin/card-templates/${templateId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }),
    });
    const data = await response.json();
    if (!response.ok) alert(data.error ?? "Action impossible.");
    else await load();
  }

  const orderedSummaries =
    summaries.length === 5
      ? summaries
      : ALL_MERCHANT_CARD_SLOTS.map((cardSlot) => ({
          cardSlot,
          title: CARD_SLOT_TITLES[cardSlot],
          templateId: null,
          status: "unconfigured" as const,
          displayStatus: "Carte à créer" as const,
          version: null,
          backgroundUrl: null,
          updatedAt: null,
          publishedAt: null,
          isCurrentlyUsed: false,
        }));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-black text-[var(--ink)]">Cartes du programme de fidélité</h2>
        <p className="text-sm text-[var(--muted-text)]">
          Cinq emplacements indépendants pour {merchantName}. La carte générale sert de secours si une variante n’est pas encore publiée.
        </p>
      </div>

      {error ? <Alert>{error}</Alert> : null}

      <div className="grid gap-5 lg:grid-cols-2 xl:grid-cols-3">
        {orderedSummaries.map((summary) => {
          const previewConfig = summary.backgroundUrl
            ? defaultCardTemplateConfig(summary.backgroundUrl)
            : null;
          const exists = summary.status !== "unconfigured";
          const editorHref = cardSlotEditorPath(merchantId, summary.cardSlot);
          const previewPoints = summary.cardSlot === "VISITS" ? 3 : 120;

          return (
            <Card
              key={summary.cardSlot}
              className={`flex flex-col overflow-hidden p-0 ${
                summary.isCurrentlyUsed ? "ring-2 ring-[var(--violet)]/60" : ""
              }`}
            >
              <div className="relative aspect-[1.586/1] w-full overflow-hidden bg-black/30">
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
                      points: previewPoints,
                      visitsRequired: summary.cardSlot === "VISITS" ? 10 : 500,
                      rewardLabel: "Récompense",
                      loyaltyMode:
                        summary.cardSlot === "GENERAL" ? "VISITS" : summary.cardSlot,
                      cardTemplate: {
                        backgroundUrl: summary.backgroundUrl,
                        config: previewConfig,
                        loyaltyMode:
                          summary.cardSlot === "GENERAL" ? "VISITS" : summary.cardSlot,
                      },
                    }}
                    slug={merchantSlug}
                    clientName="Marie Dupont"
                    displayMode="adminPreview"
                    progressPercentOverride={55}
                    className="h-full w-full"
                  />
                ) : (
                  <div className="grid h-full place-items-center px-4 text-center text-sm text-[var(--muted-text)]">
                    Aucun fond — importez une image pour créer cette carte
                  </div>
                )}
              </div>

              <div className="flex flex-1 flex-col gap-3 p-4">
                <div>
                  <h3 className="font-bold leading-snug">{summary.title}</h3>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${statusBadgeClass(summary.displayStatus)}`}
                    >
                      {summary.displayStatus}
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-[var(--muted-text)]">
                    {summary.updatedAt
                      ? `Modifiée le ${new Date(summary.updatedAt).toLocaleString("fr-FR")}`
                      : "Jamais configurée"}
                    {summary.version ? ` · v${summary.version}` : ""}
                  </p>
                </div>

                <div className="mt-auto flex flex-wrap gap-2">
                  {exists ? (
                    <Link href={editorHref}>
                      <Button>Modifier la carte</Button>
                    </Link>
                  ) : (
                    <Link href={editorHref}>
                      <Button>Créer la carte</Button>
                    </Link>
                  )}
                  <Link href={editorHref} target="_blank" rel="noreferrer">
                    <Button variant="secondary">Prévisualiser</Button>
                  </Link>
                  <Button
                    variant="secondary"
                    disabled={busySlot === summary.cardSlot}
                    onClick={() => {
                      const source = window.prompt(
                        "Dupliquer depuis quel emplacement ?\n(general, visits, points-by-amount, fixed-points, amount-tiers)",
                        "general",
                      );
                      if (!source) return;
                      const map: Record<string, MerchantCardSlot> = {
                        general: "GENERAL",
                        visits: "VISITS",
                        "points-by-amount": "POINTS_BY_AMOUNT",
                        "fixed-points": "FIXED_POINTS",
                        "amount-tiers": "AMOUNT_TIERS",
                      };
                      const sourceSlot = map[source.trim().toLowerCase()];
                      if (!sourceSlot) return;
                      void duplicateFrom(sourceSlot, summary.cardSlot);
                    }}
                  >
                    Dupliquer depuis une autre carte
                  </Button>
                  {summary.templateId && summary.status === "DRAFT" ? (
                    <Button
                      variant="secondary"
                      onClick={() => void slotAction(summary.templateId!, "reset-draft")}
                    >
                      Réinitialiser le brouillon
                    </Button>
                  ) : null}
                  {summary.templateId && summary.status !== "unconfigured" ? (
                    <Button
                      variant="secondary"
                      onClick={() => void slotAction(summary.templateId!, "archive")}
                    >
                      Archiver
                    </Button>
                  ) : null}
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
