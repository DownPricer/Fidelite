"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import type { MerchantCardSlot } from "@prisma/client";

import { MerchantCardRenderer } from "@/components/fife-life/merchant-card-renderer";
import { Alert, Button, Card } from "@/components/ui";
import type { CardTemplateConfig } from "@/lib/card-template-schema";
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

function slotStatusLabel(summary: MerchantCardSlotSummary) {
  if (summary.status === "PUBLISHED") return "Publiée";
  if (summary.status === "DRAFT") return "Brouillon";
  return "Non créée";
}

function slotTone(cardSlot: MerchantCardSlot) {
  if (cardSlot === "GENERAL") return "from-white/18 to-white/5";
  if (cardSlot === "VISITS") return "from-emerald-400/18 to-white/5";
  if (cardSlot === "POINTS_BY_AMOUNT") return "from-sky-400/18 to-white/5";
  if (cardSlot === "FIXED_POINTS") return "from-violet-400/20 to-white/5";
  return "from-amber-400/18 to-white/5";
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
  const [templates, setTemplates] = useState<Array<{
    id: string;
    cardSlot: MerchantCardSlot;
    status: string;
    backgroundUrl: string | null;
    config: CardTemplateConfig;
  }>>([]);
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
      <div className="rounded-[28px] border border-white/10 bg-white/[0.055] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.24)] backdrop-blur-2xl">
        <p className="text-[11px] font-black uppercase tracking-[0.22em] text-[var(--muted-text)]">Galerie publiée</p>
        <h2 className="mt-2 text-xl font-black text-[var(--ink)]">Cartes du programme de fidélité</h2>
        <p className="mt-1 max-w-3xl text-sm text-[var(--muted-text)]">
          Cinq emplacements indépendants pour {merchantName}. La carte générale sert de secours si une variante n’est pas encore publiée.
        </p>
      </div>

      {error ? <Alert>{error}</Alert> : null}

      <div className="grid gap-5 [grid-template-columns:repeat(auto-fit,minmax(min(100%,340px),1fr))]">
        {orderedSummaries.map((summary) => {
          const template = summary.templateId
            ? templates.find((item) => item.id === summary.templateId)
            : null;
          const previewConfig = template?.config ?? null;
          const exists = summary.status !== "unconfigured";
          const canPreview = Boolean(previewConfig);
          const editorHref = cardSlotEditorPath(merchantId, summary.cardSlot);
          const previewPoints = summary.cardSlot === "VISITS" ? 3 : 120;
          const statusLabel = slotStatusLabel(summary);

          return (
            <Card
              key={summary.cardSlot}
              className={`group flex flex-col overflow-hidden rounded-[28px] border-white/10 bg-gradient-to-br ${slotTone(summary.cardSlot)} p-0 shadow-[0_22px_70px_rgba(0,0,0,0.2)] transition duration-200 hover:-translate-y-0.5 hover:border-white/20 ${
                summary.isCurrentlyUsed ? "ring-2 ring-[var(--violet)]/60" : ""
              }`}
            >
              <div className="flex items-start justify-between gap-3 p-4 pb-0">
                <div className="min-w-0">
                  <h3 className="truncate text-base font-black leading-snug text-[var(--ink)]">{summary.title}</h3>
                  <p className="mt-1 text-xs text-[var(--muted-text)]">
                    {summary.version ? `Version ${summary.version}` : "Aucune version publiée"}
                  </p>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-2">
                  {summary.isCurrentlyUsed ? (
                    <span className="rounded-full bg-[var(--violet)] px-2.5 py-1 text-[10px] font-black uppercase text-white">
                      Programme actif
                    </span>
                  ) : null}
                  <span
                    className={`rounded-full px-2.5 py-1 text-[10px] font-black uppercase ${statusBadgeClass(statusLabel as MerchantCardSlotSummary["displayStatus"])}`}
                  >
                    {statusLabel}
                  </span>
                </div>
              </div>

              <div className="relative mx-4 mt-4 aspect-[1.586/1] overflow-hidden rounded-2xl border border-white/10 bg-black/30 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
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
                        backgroundUrl: template?.backgroundUrl ?? summary.backgroundUrl,
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
                  <div className="grid h-full place-items-center px-4 text-center text-sm font-semibold text-[var(--muted-text)]">
                    Aucune carte
                  </div>
                )}
              </div>

              <div className="flex flex-1 flex-col gap-4 p-4">
                <p className="text-xs text-[var(--muted-text)]">
                  {summary.isCurrentlyUsed ? "Utilisée actuellement dans le wallet · " : ""}
                  {summary.updatedAt
                    ? `Modifiée le ${new Date(summary.updatedAt).toLocaleString("fr-FR")}`
                    : "Jamais configurée"}
                  {summary.publishedAt ? ` · Publiée le ${new Date(summary.publishedAt).toLocaleDateString("fr-FR")}` : ""}
                </p>

                <div className="mt-auto grid gap-2 min-[560px]:grid-cols-2">
                  {exists ? (
                    <Link href={editorHref}>
                      <Button className="w-full">Modifier la carte</Button>
                    </Link>
                  ) : (
                    <Link href={editorHref}>
                      <Button className="w-full">Créer cette carte</Button>
                    </Link>
                  )}
                  {canPreview ? (
                    <Link href={editorHref} target="_blank" rel="noreferrer">
                      <Button variant="secondary" className="w-full">Prévisualiser</Button>
                    </Link>
                  ) : null}
                  <Button
                    variant="secondary"
                    className={canPreview ? "min-[560px]:col-span-2" : ""}
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
                    Dupliquer le design
                  </Button>
                  {summary.templateId && summary.status === "DRAFT" ? (
                    <Button
                      variant="secondary"
                      className="min-[560px]:col-span-2"
                      onClick={() => void slotAction(summary.templateId!, "reset-draft")}
                    >
                      Réinitialiser le brouillon
                    </Button>
                  ) : null}
                  {summary.templateId && summary.status !== "unconfigured" ? (
                    <Button
                      variant="secondary"
                      className="min-[560px]:col-span-2"
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
