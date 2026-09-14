"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { MerchantCardRenderer } from "@/components/fife-life/merchant-card-renderer";
import { SuperAdminShell } from "@/components/super-admin/layout-shell";
import { Alert, Button, Card, Input, cn } from "@/components/ui";
import type { CardTemplateConfig } from "@/lib/card-template-schema";

type MerchantRow = {
  id: string;
  name: string;
  legalName: string | null;
  slug: string;
  logoUrl: string | null;
  primaryColor: string;
  status: string;
  ownerName: string | null;
  loyaltyMode: string | null;
  plan: string | null;
  customers: number;
  lastActivityAt: string | null;
  monthlyContractual: number;
  createdAt: string;
  publishedCardTemplates?: Array<{
    id: string;
    cardSlot: string;
    loyaltyMode: string | null;
    backgroundUrl: string | null;
    config: CardTemplateConfig;
    version: number;
  }>;
};

function statusLabel(status: string) {
  if (status === "ACTIVE") return "Actif";
  if (status === "SUSPENDED") return "Suspendu";
  if (status === "ARCHIVED") return "Archivé";
  if (status === "TRIAL") return "Essai";
  if (status === "DRAFT") return "Brouillon";
  return status;
}

function modeLabel(mode: string | null) {
  if (mode === "VISITS") return "Passages";
  if (mode === "POINTS_BY_AMOUNT") return "Points selon montant";
  if (mode === "FIXED_POINTS") return "Points fixes";
  if (mode === "AMOUNT_TIERS") return "Paliers de montant";
  return "Non configuré";
}

function formatActivity(value: string | null) {
  if (!value) return "Aucune activité";
  return new Date(value).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" });
}

function pickPreviewTemplate(row: MerchantRow) {
  const templates = row.publishedCardTemplates ?? [];
  return (
    templates.find((template) => template.cardSlot === row.loyaltyMode) ??
    templates.find((template) => template.cardSlot === "GENERAL") ??
    templates[0] ??
    null
  );
}

export function MerchantsListPage({ firstName }: { firstName: string }) {
  const [rows, setRows] = useState<MerchantRow[]>([]);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), pageSize: "20" });
    if (q) params.set("q", q);
    if (status) params.set("status", status);
    const response = await fetch(`/api/super-admin/merchants?${params}`);
    const data = await response.json();
    setLoading(false);
    if (!response.ok) {
      setError(data.error ?? "Chargement impossible.");
      return;
    }
    setError(null);
    setRows(data.merchants);
    setPages(data.pagination.pages);
  }, [page, q, status]);

  useEffect(() => {
    void load();
  }, [load]);

  async function quickAction(id: string, action: "suspend" | "reactivate" | "archive") {
    const password = window.prompt("Confirmez votre mot de passe super-admin :");
    if (!password) return;
    const response = await fetch(`/api/super-admin/merchants/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, password }),
    });
    if (!response.ok) {
      const data = await response.json();
      alert(data.error ?? "Action impossible.");
      return;
    }
    void load();
  }

  return (
    <SuperAdminShell firstName={firstName}>
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-[var(--ink)]">Commerces</h1>
            <p className="text-sm text-[var(--muted-text)]">Recherche, filtres et actions rapides.</p>
          </div>
          <Link href="/super-admin/commerces/nouveau">
            <Button>Créer un commerce</Button>
          </Link>
        </div>

        <div className="grid gap-3 sm:grid-cols-[1fr_auto_auto]">
          <Input placeholder="Rechercher nom, slug, e-mail, téléphone…" value={q} onChange={(e) => { setPage(1); setQ(e.target.value); }} />
          <select
            className="rounded-xl border border-white/10 bg-[var(--surface)] px-3 py-2 text-sm"
            value={status}
            onChange={(e) => { setPage(1); setStatus(e.target.value); }}
          >
            <option value="">Tous statuts</option>
            <option value="ACTIVE">Actif</option>
            <option value="TRIAL">Essai</option>
            <option value="SUSPENDED">Suspendu</option>
            <option value="ARCHIVED">Archivé</option>
            <option value="DRAFT">Brouillon</option>
          </select>
          <Button variant="secondary" onClick={() => void load()}>Actualiser</Button>
        </div>

        {error ? <Alert>{error}</Alert> : null}

        {loading ? (
          <Card className="p-10 text-center text-sm text-[var(--muted-text)]">Chargement…</Card>
        ) : rows.length === 0 ? (
          <Card className="p-10 text-center text-sm text-[var(--muted-text)]">Aucun commerce trouvé.</Card>
        ) : (
          <div className="grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(min(100%,330px),1fr))]">
            {rows.map((row) => {
              const previewTemplate = pickPreviewTemplate(row);
              return (
                <article
                  key={row.id}
                  className="group relative overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.055] p-4 shadow-[0_22px_70px_rgba(0,0,0,0.22)] backdrop-blur-2xl transition duration-200 hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/[0.075]"
                >
                  <div
                    className="pointer-events-none absolute inset-x-0 top-0 h-28 opacity-55 blur-2xl"
                    style={{ background: `linear-gradient(90deg, ${row.primaryColor}, transparent)` }}
                    aria-hidden
                  />
                  <div className="relative z-10 flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="grid h-14 w-14 shrink-0 place-items-center overflow-hidden rounded-2xl text-lg font-black text-white ring-1 ring-white/20" style={{ backgroundColor: row.primaryColor }}>
                        {row.logoUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={row.logoUrl} alt="" className="h-full w-full object-cover" />
                        ) : row.name.slice(0, 1)}
                      </div>
                      <div className="min-w-0">
                        <h2 className="truncate text-base font-black text-[var(--ink)]">{row.name}</h2>
                        <p className="truncate text-xs text-[var(--muted-text)]">/{row.slug}</p>
                      </div>
                    </div>
                    <details className="relative">
                      <summary className="grid h-9 w-9 cursor-pointer list-none place-items-center rounded-full border border-white/10 bg-white/5 text-[var(--muted-text)] transition hover:text-[var(--ink)] [&::-webkit-details-marker]:hidden">
                        <span className="text-lg leading-none">…</span>
                      </summary>
                      <div className="absolute right-0 z-20 mt-2 w-36 rounded-2xl border border-white/10 bg-[#171225] p-2 text-xs shadow-2xl">
                        {row.status === "ACTIVE" || row.status === "TRIAL" ? (
                          <button type="button" className="block w-full rounded-xl px-3 py-2 text-left text-[var(--danger)] hover:bg-white/5" onClick={() => void quickAction(row.id, "suspend")}>Suspendre</button>
                        ) : (
                          <button type="button" className="block w-full rounded-xl px-3 py-2 text-left hover:bg-white/5" onClick={() => void quickAction(row.id, "reactivate")}>Réactiver</button>
                        )}
                        <button type="button" className="block w-full rounded-xl px-3 py-2 text-left hover:bg-white/5" onClick={() => void quickAction(row.id, "archive")}>Archiver</button>
                      </div>
                    </details>
                  </div>

                  <div className="relative z-10 mt-4 overflow-hidden rounded-2xl border border-white/10 bg-black/25">
                    {previewTemplate ? (
                      <MerchantCardRenderer
                        merchant={{ name: row.name, logoUrl: row.logoUrl, primaryColor: row.primaryColor }}
                        card={{
                          id: `preview-${row.id}`,
                          merchantId: row.id,
                          slug: row.slug,
                          name: row.name,
                          logoUrl: row.logoUrl,
                          primaryColor: row.primaryColor,
                          points: row.loyaltyMode === "VISITS" ? 3 : 120,
                          visitsRequired: row.loyaltyMode === "VISITS" ? 10 : 500,
                          rewardLabel: "Aperçu",
                          loyaltyMode: row.loyaltyMode === "POINTS_BY_AMOUNT" || row.loyaltyMode === "FIXED_POINTS" || row.loyaltyMode === "AMOUNT_TIERS" || row.loyaltyMode === "VISITS" ? row.loyaltyMode : "VISITS",
                          cardTemplate: {
                            backgroundUrl: previewTemplate.backgroundUrl,
                            config: previewTemplate.config,
                            loyaltyMode: row.loyaltyMode === "POINTS_BY_AMOUNT" || row.loyaltyMode === "FIXED_POINTS" || row.loyaltyMode === "AMOUNT_TIERS" || row.loyaltyMode === "VISITS" ? row.loyaltyMode : "VISITS",
                          },
                        }}
                        slug={row.slug}
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
                      <p className="text-[var(--muted-text)]">Statut</p>
                      <span className={cn("mt-1 inline-flex rounded-full px-2 py-1 text-[10px] font-black uppercase", row.status === "ACTIVE" ? "bg-emerald-500/15 text-emerald-200" : row.status === "SUSPENDED" ? "bg-amber-500/15 text-amber-100" : row.status === "ARCHIVED" ? "bg-white/10 text-[var(--muted-text)]" : "bg-violet-500/15 text-violet-100")}>{statusLabel(row.status)}</span>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                      <p className="text-[var(--muted-text)]">Fidélité</p>
                      <p className="mt-1 font-bold text-[var(--ink)]">{modeLabel(row.loyaltyMode)}</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                      <p className="text-[var(--muted-text)]">Clients</p>
                      <p className="mt-1 font-black text-[var(--ink)]">{row.customers}</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                      <p className="text-[var(--muted-text)]">Dernière activité</p>
                      <p className="mt-1 font-bold text-[var(--ink)]">{formatActivity(row.lastActivityAt)}</p>
                    </div>
                  </div>

                  <div className="relative z-10 mt-4 flex items-center justify-between gap-3">
                    <p className="truncate text-xs text-[var(--muted-text)]">
                      {row.plan ?? "Sans plan"} · {row.monthlyContractual.toFixed(2)} € MRR
                    </p>
                    <Link href={`/super-admin/commerces/${row.id}`} className="shrink-0 rounded-full bg-white px-4 py-2 text-xs font-black text-black transition hover:bg-[var(--violet-bright)] hover:text-white">
                      Ouvrir le commerce
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        <div className="flex items-center justify-between">
          <Button variant="secondary" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Précédent</Button>
          <span className="text-xs text-[var(--muted-text)]">Page {page} / {pages}</span>
          <Button variant="secondary" disabled={page >= pages} onClick={() => setPage((p) => p + 1)}>Suivant</Button>
        </div>
      </div>
    </SuperAdminShell>
  );
}
