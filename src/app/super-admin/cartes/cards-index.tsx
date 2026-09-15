"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { LoyaltyMode, MerchantCardSlot } from "@prisma/client";
import { MerchantCardRenderer } from "@/components/fife-life/merchant-card-renderer";
import { SuperAdminShell } from "@/components/super-admin/layout-shell";
import { Alert, Button, Card, cn } from "@/components/ui";
import type { CardTemplateConfig } from "@/lib/card-template-schema";
import { CARD_SLOT_TITLES, cardSlotForLoyaltyMode } from "@/lib/merchant-card-slots";

const ALL_SLOTS: MerchantCardSlot[] = ["GENERAL", "VISITS", "POINTS_BY_AMOUNT", "FIXED_POINTS", "AMOUNT_TIERS"];

type TemplateSummary = {
  id: string;
  cardSlot: MerchantCardSlot;
  loyaltyMode: LoyaltyMode | null;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  backgroundUrl: string | null;
  config: CardTemplateConfig;
  version: number;
  isDefault?: boolean;
  publishedAt?: string | null;
  updatedAt?: string | null;
};

type MerchantCardRow = {
  id: string;
  name: string;
  slug: string;
  logoUrl: string | null;
  primaryColor: string;
  status: string;
  loyaltyMode: LoyaltyMode | null;
  customers?: number;
  cardTemplates?: TemplateSummary[];
  publishedCardTemplates?: TemplateSummary[];
};

function modeLabel(mode: LoyaltyMode | null) {
  if (mode === "VISITS") return "Passages";
  if (mode === "POINTS_BY_AMOUNT") return "Points selon le montant";
  if (mode === "FIXED_POINTS") return "Points fixes par achat";
  if (mode === "AMOUNT_TIERS") return "Paliers selon le montant";
  return "Non configuré";
}

function statusLabel(status: string) {
  if (status === "ACTIVE") return "Actif";
  if (status === "SUSPENDED") return "Suspendu";
  if (status === "ARCHIVED") return "Archivé";
  if (status === "TRIAL") return "Essai";
  return status;
}

function pickCurrentTemplate(row: MerchantCardRow) {
  const published = row.publishedCardTemplates ?? [];
  const activeSlot = row.loyaltyMode ? cardSlotForLoyaltyMode(row.loyaltyMode) : null;
  return (
    (activeSlot ? published.find((template) => template.cardSlot === activeSlot) : null) ??
    published.find((template) => template.cardSlot === "GENERAL") ??
    null
  );
}

function cardCounts(row: MerchantCardRow) {
  const templates = row.cardTemplates ?? [];
  const liveTemplates = templates.filter((template) => template.status !== "ARCHIVED");
  return {
    created: new Set(liveTemplates.map((template) => template.cardSlot)).size,
    drafts: liveTemplates.filter((template) => template.status === "DRAFT").length,
    published: liveTemplates.filter((template) => template.status === "PUBLISHED").length,
  };
}

function hasPublishedActiveSlot(row: MerchantCardRow) {
  if (!row.loyaltyMode) return true;
  const activeSlot = cardSlotForLoyaltyMode(row.loyaltyMode);
  return Boolean((row.publishedCardTemplates ?? []).some((template) => template.cardSlot === activeSlot));
}

export function CardsIndexPage({ firstName }: { firstName: string }) {
  const [merchants, setMerchants] = useState<MerchantCardRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    void fetch("/api/super-admin/merchants?pageSize=50")
      .then((response) => response.json().then((data) => ({ response, data })))
      .then(({ response, data }) => {
        if (cancelled) return;
        if (!response.ok) {
          setError(data.error ?? "Impossible de charger les cartes commerçants.");
          setMerchants([]);
          return;
        }
        setMerchants(data.merchants ?? []);
        setError(null);
      })
      .catch(() => {
        if (!cancelled) setError("Impossible de charger les cartes commerçants.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const totals = useMemo(
    () =>
      merchants.reduce(
        (acc, merchant) => {
          const counts = cardCounts(merchant);
          acc.created += counts.created;
          acc.drafts += counts.drafts;
          acc.published += counts.published;
          return acc;
        },
        { created: 0, drafts: 0, published: 0 },
      ),
    [merchants],
  );

  return (
    <SuperAdminShell firstName={firstName}>
      <div className="mx-auto w-full max-w-7xl space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-4 rounded-[28px] border border-white/10 bg-white/[0.055] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.22)] backdrop-blur-2xl">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.22em] text-[var(--muted-text)]">Super-admin</p>
            <h1 className="mt-2 text-2xl font-black text-[var(--ink)]">Cartes commerçant</h1>
            <p className="mt-1 max-w-3xl text-sm text-[var(--muted-text)]">
              Vue centrale des cinq emplacements, brouillons et cartes publiées par commerce.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2">
              <p className="text-[var(--muted-text)]">Créées</p>
              <p className="text-lg font-black text-[var(--ink)]">{totals.created}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2">
              <p className="text-[var(--muted-text)]">Brouillons</p>
              <p className="text-lg font-black text-amber-100">{totals.drafts}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2">
              <p className="text-[var(--muted-text)]">Publiées</p>
              <p className="text-lg font-black text-emerald-200">{totals.published}</p>
            </div>
          </div>
        </div>

        {error ? <Alert>{error}</Alert> : null}

        {loading ? (
          <Card className="p-10 text-center text-sm text-[var(--muted-text)]">Chargement…</Card>
        ) : merchants.length === 0 ? (
          <Card className="p-10 text-center text-sm text-[var(--muted-text)]">Aucun commerce.</Card>
        ) : (
          <div className="grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(min(100%,340px),1fr))]">
            {merchants.map((merchant) => {
              const currentTemplate = pickCurrentTemplate(merchant);
              const counts = cardCounts(merchant);
              const activeMissing = !hasPublishedActiveSlot(merchant);
              const activeSlot = merchant.loyaltyMode ? cardSlotForLoyaltyMode(merchant.loyaltyMode) : null;
              const muted = merchant.status === "SUSPENDED" || merchant.status === "ARCHIVED";

              return (
                <article
                  key={merchant.id}
                  className={cn(
                    "group relative overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.055] p-4 shadow-[0_22px_70px_rgba(0,0,0,0.22)] backdrop-blur-2xl transition hover:-translate-y-0.5 hover:border-white/20",
                    muted && "bg-white/[0.035]",
                  )}
                >
                  <div
                    className="pointer-events-none absolute inset-x-0 top-0 h-28 opacity-50 blur-2xl"
                    style={{ background: `linear-gradient(90deg, ${merchant.primaryColor}, transparent)` }}
                    aria-hidden
                  />
                  <div className="relative z-10 flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="grid h-14 w-14 shrink-0 place-items-center overflow-hidden rounded-2xl text-lg font-black text-white ring-1 ring-white/20" style={{ backgroundColor: merchant.primaryColor }}>
                        {merchant.logoUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={merchant.logoUrl} alt="" className="h-full w-full object-cover" />
                        ) : merchant.name.slice(0, 1)}
                      </div>
                      <div className="min-w-0">
                        <h2 className="truncate text-base font-black text-[var(--ink)]">{merchant.name}</h2>
                        <p className="truncate text-xs text-[var(--muted-text)]">/{merchant.slug}</p>
                      </div>
                    </div>
                    <span className={cn("shrink-0 rounded-full px-2.5 py-1 text-[10px] font-black uppercase", merchant.status === "ACTIVE" ? "bg-emerald-500/15 text-emerald-200" : merchant.status === "SUSPENDED" ? "bg-amber-500/15 text-amber-100" : "bg-white/10 text-[var(--muted-text)]")}>
                      {statusLabel(merchant.status)}
                    </span>
                  </div>

                  <div className="relative z-10 mt-4 overflow-hidden rounded-2xl border border-white/10 bg-black/25">
                    {currentTemplate ? (
                      <MerchantCardRenderer
                        merchant={{ name: merchant.name, logoUrl: merchant.logoUrl, primaryColor: merchant.primaryColor }}
                        card={{
                          id: `cards-index-${merchant.id}`,
                          merchantId: merchant.id,
                          slug: merchant.slug,
                          name: merchant.name,
                          logoUrl: merchant.logoUrl,
                          primaryColor: merchant.primaryColor,
                          points: merchant.loyaltyMode === "VISITS" ? 3 : 120,
                          visitsRequired: merchant.loyaltyMode === "VISITS" ? 10 : 500,
                          rewardLabel: "Aperçu",
                          loyaltyMode: merchant.loyaltyMode ?? "VISITS",
                          cardTemplate: {
                            backgroundUrl: currentTemplate.backgroundUrl,
                            config: currentTemplate.config,
                            loyaltyMode: merchant.loyaltyMode ?? "VISITS",
                          },
                        }}
                        slug={merchant.slug}
                        clientName="Aperçu client"
                        displayMode="adminPreview"
                        className="h-full w-full"
                      />
                    ) : (
                      <div className="grid aspect-[1.586/1] place-items-center px-5 text-center text-xs font-semibold text-[var(--muted-text)]">
                        Aucune carte publiée
                      </div>
                    )}
                  </div>

                  <div className="relative z-10 mt-4 grid grid-cols-2 gap-2 text-xs">
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                      <p className="text-[var(--muted-text)]">Programme actif</p>
                      <p className="mt-1 font-black text-[var(--ink)]">{modeLabel(merchant.loyaltyMode)}</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                      <p className="text-[var(--muted-text)]">Emplacements</p>
                      <p className="mt-1 font-black text-[var(--ink)]">{counts.created} / {ALL_SLOTS.length}</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                      <p className="text-[var(--muted-text)]">Brouillons</p>
                      <p className="mt-1 font-black text-amber-100">{counts.drafts}</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                      <p className="text-[var(--muted-text)]">Publiées</p>
                      <p className="mt-1 font-black text-emerald-200">{counts.published}</p>
                    </div>
                  </div>

                  {activeMissing && activeSlot ? (
                    <p className="relative z-10 mt-3 rounded-2xl border border-amber-400/20 bg-amber-400/10 p-3 text-xs font-semibold text-amber-100">
                      Carte manquante pour le mode actif : {CARD_SLOT_TITLES[activeSlot]}
                    </p>
                  ) : null}

                  <div className="relative z-10 mt-4 flex flex-wrap items-center justify-between gap-3">
                    <p className="text-xs text-[var(--muted-text)]">
                      {currentTemplate ? `Carte utilisée : ${CARD_SLOT_TITLES[currentTemplate.cardSlot]} · v${currentTemplate.version}` : "Aucune carte publiée"}
                    </p>
                    <Link href={`/super-admin/commerces/${merchant.id}/cartes`} className="shrink-0 rounded-full bg-white px-4 py-2 text-xs font-black text-black transition hover:bg-[var(--violet-bright)] hover:text-white">
                      Gérer les cartes
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </SuperAdminShell>
  );
}
