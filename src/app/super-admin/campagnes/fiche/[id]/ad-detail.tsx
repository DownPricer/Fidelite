"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { SuperAdminShell } from "@/components/super-admin/layout-shell";
import { Alert, Button, Card } from "@/components/ui";
import {
  FramingTool,
  ImageThumb,
  NextActionBanner,
  RealBannerPreview,
  VersionHistory,
  formatDateTime,
  isExactBanner,
  loadImageElement,
  readFileAsDataUrl,
  type NextActionInfo,
  type VisualVersion,
} from "@/components/ad-visual-parts";
import { priceSponsoredHours, type SponsoredDaySelection } from "@/lib/sponsored-hours-pricing";

function formatCents(cents: number | null) {
  if (cents === null || cents === undefined) return "—";
  return (cents / 100).toLocaleString("fr-FR", { style: "currency", currency: "EUR" });
}

type AdImage = { id: string; url: string };
type AdStatus =
  | "DRAFT"
  | "PENDING_REVIEW"
  | "AWAITING_MERCHANT"
  | "NEEDS_CHANGES"
  | "APPROVED"
  | "REJECTED"
  | "SCHEDULED"
  | "LIVE"
  | "SUSPENDED"
  | "ENDED"
  | "STOPPED"
  | "CANCELLED";

type AdRequestDetail = {
  id: string;
  status: AdStatus;
  requestedText: string;
  visualMode: "SELF" | "FIDETO" | null;
  visualBrief: string | null;
  requestedImageUrl: string | null;
  finalImageUrl: string | null;
  objective: string | null;
  ctaLabel: string | null;
  ctaUrl: string | null;
  startDate: string;
  endDate: string;
  hourlySchedule: SponsoredDaySelection[] | null;
  rejectionReason: string | null;
  createdAt: string;
  merchant: { id: string; name: string; slug: string; city: string | null; logoUrl: string | null };
  campaign: { id: string; priceCents: number | null; payment: { status: string; amountCents: number; mode: string } | null } | null;
  images: AdImage[];
  versions: VisualVersion[];
};

type AuditRow = { id: string; action: string; createdAt: string; metadata: unknown; actor: { firstName: string; lastName: string } | null };
type NotificationRow = { id: string; message: string; createdAt: string; audience: "MERCHANT" | "SUPER_ADMIN" };

type AdStatsPayload = {
  byDay: { date: string; impressions: number; clicks: number; ctr: number | null }[];
  totalImpressions: number;
  totalClicks: number;
  ctr: number | null;
};

const STATUS_LABELS: Record<AdStatus, string> = {
  DRAFT: "Brouillon",
  PENDING_REVIEW: "En attente de Fideto",
  AWAITING_MERCHANT: "Proposition envoyée — en attente du commerçant",
  NEEDS_CHANGES: "Visuel refusé — à corriger par le commerçant",
  APPROVED: "Visuel approuvé (en attente de paiement)",
  REJECTED: "Campagne refusée",
  SCHEDULED: "Programmée",
  LIVE: "En cours de diffusion",
  SUSPENDED: "Suspendue",
  ENDED: "Terminée",
  STOPPED: "Arrêtée",
  CANCELLED: "Annulée",
};

/** Statuts où Fideto peut encore envoyer une proposition (aligné sur le serveur). */
const PROPOSABLE: AdStatus[] = ["PENDING_REVIEW", "NEEDS_CHANGES", "AWAITING_MERCHANT", "APPROVED", "SCHEDULED", "LIVE", "SUSPENDED"];

async function postJson(url: string, body: unknown) {
  const res = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error ?? "Action impossible.");
  return data as Record<string, unknown>;
}

type Draft = { url: string; originalUrl: string; previewUrl: string; reframed: boolean };

export function AdDetailPage({ id, firstName }: { id: string; firstName: string }) {
  const [ad, setAd] = useState<AdRequestDetail | null>(null);
  const [audit, setAudit] = useState<AuditRow[]>([]);
  const [notifications, setNotifications] = useState<NotificationRow[]>([]);
  const [nextAction, setNextAction] = useState<NextActionInfo | null>(null);
  const [stats, setStats] = useState<AdStatsPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const [text, setText] = useState("");
  const [ctaLabel, setCtaLabel] = useState("");
  const [ctaUrl, setCtaUrl] = useState("");
  const [visualReason, setVisualReason] = useState("");
  const [campaignReason, setCampaignReason] = useState("");
  const [lifecycleReason, setLifecycleReason] = useState("");

  const [pendingFile, setPendingFile] = useState<{ dataUrl: string; width: number; height: number } | null>(null);
  const [draft, setDraft] = useState<Draft | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/super-admin/visuels/${id}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Chargement impossible.");
      setAd(data.adRequest);
      setAudit(data.audit ?? []);
      setNotifications(data.notifications ?? []);
      setNextAction(data.nextAction ?? null);
      setStats(data.stats ?? null);
      setText(data.adRequest.requestedText ?? "");
      setCtaLabel(data.adRequest.ctaLabel ?? "");
      setCtaUrl(data.adRequest.ctaUrl ?? "");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    void load();
  }, [load]);

  async function run(task: () => Promise<void>, done: string) {
    setBusy(true);
    setError(null);
    setNotice(null);
    try {
      await task();
      setNotice(done);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur.");
    } finally {
      setBusy(false);
    }
  }

  async function patch(body: Record<string, unknown>) {
    const res = await fetch(`/api/super-admin/visuels/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error ?? "Action impossible.");
  }

  const approveMerchantBanner = () =>
    run(async () => {
      await patch({ action: "approve", requestedText: text.trim(), ctaLabel: ctaLabel.trim() || null, ctaUrl: ctaUrl.trim() || null });
    }, "Bandeau approuvé : le commerçant peut passer au paiement.");

  const refuseVisual = () =>
    run(async () => {
      if (!visualReason.trim()) throw new Error("Indiquez le motif précis et la correction demandée.");
      await patch({ action: "request_changes", rejectionReason: visualReason.trim() });
      setVisualReason("");
    }, "Visuel refusé : le commerçant voit votre motif et peut le corriger.");

  const refuseCampaign = () =>
    run(async () => {
      if (!campaignReason.trim()) throw new Error("Indiquez le motif du refus de la campagne.");
      if (!window.confirm("Refuser définitivement toute la campagne ?")) throw new Error("Refus annulé.");
      await patch({ action: "reject", rejectionReason: campaignReason.trim() });
      setCampaignReason("");
    }, "Campagne refusée.");

  const lifecycle = (kind: "suspend" | "resume" | "stop") =>
    run(async () => {
      await patch({ action: kind, rejectionReason: lifecycleReason.trim() || null });
      setLifecycleReason("");
    }, "Effectué.");

  async function onFileChosen(file: File | null) {
    if (!file) return;
    setError(null);
    setDraft(null);
    setPendingFile(null);
    try {
      if (!["image/png", "image/jpeg", "image/webp"].includes(file.type)) throw new Error("Format non accepté : PNG, JPEG ou WebP.");
      if (file.size > 10 * 1024 * 1024) throw new Error("Image trop lourde (10 Mo maximum).");
      const dataUrl = await readFileAsDataUrl(file);
      const img = await loadImageElement(dataUrl);
      if (isExactBanner(img.naturalWidth, img.naturalHeight)) {
        // Bon format : envoi direct, aucun recadrage obligatoire.
        setBusy(true);
        const staged = await postJson(`/api/super-admin/visuels/${id}/fichier`, { dataUrl, kind: "banniere" });
        setDraft({ url: staged.url as string, originalUrl: staged.url as string, previewUrl: dataUrl, reframed: false });
      } else {
        setPendingFile({ dataUrl, width: img.naturalWidth, height: img.naturalHeight });
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Fichier invalide.");
    } finally {
      setBusy(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  async function onFramed(cropped: string) {
    if (!pendingFile) return;
    setBusy(true);
    setError(null);
    try {
      const original = await postJson(`/api/super-admin/visuels/${id}/fichier`, { dataUrl: pendingFile.dataUrl, kind: "original" });
      const display = await postJson(`/api/super-admin/visuels/${id}/fichier`, { dataUrl: cropped, kind: "banniere" });
      setDraft({ url: display.url as string, originalUrl: original.url as string, previewUrl: cropped, reframed: true });
      setPendingFile(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Envoi impossible.");
    } finally {
      setBusy(false);
    }
  }

  const sendProposal = () =>
    run(async () => {
      if (!draft) throw new Error("Importez d'abord le bandeau.");
      await postJson(`/api/super-admin/visuels/${id}/proposition`, { url: draft.url, originalUrl: draft.originalUrl });
      setDraft(null);
    }, "Proposition envoyée au commerçant.");

  const pricing = ad?.hourlySchedule ? priceSponsoredHours(ad.hourlySchedule) : null;
  const pendingVersion = ad?.versions.find((v) => v.status === "SUBMITTED" || v.status === "PROPOSED") ?? null;
  const submittedByMerchant = ad?.versions.find((v) => v.status === "SUBMITTED" && v.author === "MERCHANT") ?? null;
  const canPropose = ad ? PROPOSABLE.includes(ad.status) : false;
  const canDecide = ad?.status === "PENDING_REVIEW";

  return (
    <SuperAdminShell firstName={firstName}>
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <Link href="/super-admin/campagnes" className="text-xs font-bold text-[var(--muted-text)] hover:underline">
              ← Campagnes
            </Link>
            <h1 className="mt-1 text-2xl font-black text-[var(--ink)]">Fiche de la mise en avant</h1>
          </div>
          {ad ? (
            <span className="rounded-full border border-[var(--border)] px-3 py-1 text-xs font-bold text-[var(--ink)]" data-testid="ad-status">
              {STATUS_LABELS[ad.status]}
            </span>
          ) : null}
        </div>

        {error ? <Alert>{error}</Alert> : null}
        {notice ? <Card className="p-3 text-sm text-[var(--ink)]">{notice}</Card> : null}

        {loading && !ad ? (
          <p className="text-sm text-[var(--muted-text)]">Chargement…</p>
        ) : !ad ? null : (
          <>
            {nextAction ? <NextActionBanner action={nextAction} /> : null}

            <Card className="space-y-3 p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-[var(--muted-text)]">Commerce</p>
              <p className="text-sm font-bold text-[var(--ink)]">
                {ad.merchant.name} {ad.merchant.city ? `· ${ad.merchant.city}` : ""}
              </p>
              <p className="text-xs text-[var(--muted-text)]">Demande créée le {formatDateTime(ad.createdAt)}</p>
              {ad.rejectionReason ? <p className="text-xs text-[var(--danger)]">Dernier motif transmis au commerçant : {ad.rejectionReason}</p> : null}
            </Card>

            {/* ------------------------------ VISUEL ------------------------------ */}
            <Card className="space-y-5 p-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-[var(--muted-text)]">Visuel</p>
                <p className="text-sm font-bold text-[var(--ink)]">
                  {ad.visualMode === "SELF" ? "Le commerçant a fourni son propre bandeau" : "Le commerçant demande à Fideto de créer son bandeau"}
                </p>
              </div>

              {/* Reçu du commerçant */}
              <section className="space-y-2" aria-label="Images reçues">
                <p className="text-sm font-bold text-[var(--ink)]">Reçu du commerçant</p>
                {ad.visualBrief ? (
                  <p className="rounded-lg bg-[var(--surface)] p-2 text-xs text-[var(--ink)]">Indication : « {ad.visualBrief} »</p>
                ) : null}
                {ad.visualMode === "SELF" ? (
                  ad.versions.filter((v) => v.author === "MERCHANT").length === 0 ? (
                    <p className="text-sm text-[var(--muted-text)]">Aucun bandeau reçu.</p>
                  ) : (
                    ad.versions
                      .filter((v) => v.author === "MERCHANT")
                      .slice(0, 1)
                      .map((v) => (
                        <div key={v.id} className="flex flex-wrap items-center gap-3">
                          <ImageThumb src={v.url} label="Bandeau du commerçant" size={96} downloadHref={`${v.originalUrl}?telecharger=1`} />
                          <a className="text-sm font-bold text-[var(--violet-bright)] underline" href={`${v.originalUrl}?telecharger=1`} download>
                            Télécharger le fichier original (qualité complète)
                          </a>
                        </div>
                      ))
                  )
                ) : ad.images.length === 0 ? (
                  <p className="text-sm text-[var(--muted-text)]">Aucune image source reçue.</p>
                ) : (
                  <div className="space-y-2">
                    <div className="flex flex-wrap gap-3">
                      {ad.images.map((img, index) => (
                        <div key={img.id} className="space-y-1 text-center">
                          <ImageThumb src={img.url} label={`Image source ${index + 1}`} size={96} downloadHref={`${img.url}?telecharger=1`} />
                          <a className="block text-[11px] font-bold text-[var(--violet-bright)] underline" href={`${img.url}?telecharger=1`} download>
                            Télécharger
                          </a>
                        </div>
                      ))}
                    </div>
                    <a
                      className="inline-block rounded-full border border-[var(--border)] px-3 py-1.5 text-xs font-bold text-[var(--ink)]"
                      href={`/api/super-admin/visuels/${id}/archive`}
                      data-testid="download-archive"
                    >
                      Tout télécharger (.zip — {ad.images.length} image{ad.images.length > 1 ? "s" : ""})
                    </a>
                  </div>
                )}
              </section>

              {/* Version en cours */}
              <section className="space-y-2" aria-label="Version actuelle">
                <p className="text-sm font-bold text-[var(--ink)]">Version actuellement proposée</p>
                {pendingVersion ? (
                  <div className="flex flex-wrap items-start gap-4">
                    <RealBannerPreview imageUrl={pendingVersion.url} merchantName={ad.merchant.name} text={ad.requestedText} ctaLabel={ad.ctaLabel} />
                    <p className="text-xs text-[var(--muted-text)]">
                      Version {pendingVersion.number} ·{" "}
                      {pendingVersion.status === "PROPOSED" ? "envoyée au commerçant, en attente de sa réponse" : "soumise, en attente de votre décision"}
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-[var(--muted-text)]">Aucune version en attente.</p>
                )}
                {ad.finalImageUrl ? (
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-[var(--ink)]">Version finale validée (seule version diffusable)</p>
                    <ImageThumb src={ad.finalImageUrl} label="Version finale" size={72} downloadHref={`${ad.finalImageUrl}?telecharger=1`} />
                  </div>
                ) : null}
              </section>

              {/* Décisions sur le bandeau du commerçant */}
              {canDecide ? (
                <section className="space-y-2 rounded-xl border border-[var(--border)] p-3" aria-label="Décision sur le visuel">
                  <p className="text-sm font-bold text-[var(--ink)]">Décision</p>
                  <label className="block text-xs text-[var(--muted-text)]">
                    Motif précis et correction demandée (obligatoire pour refuser le visuel)
                    <textarea className="profile-select mt-1 w-full" rows={2} value={visualReason} onChange={(e) => setVisualReason(e.target.value)} />
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {submittedByMerchant ? (
                      <Button disabled={busy} onClick={() => void approveMerchantBanner()} data-testid="approve-banner">
                        Approuver ce bandeau
                      </Button>
                    ) : null}
                    <Button variant="secondary" disabled={busy} onClick={() => void refuseVisual()} data-testid="refuse-visual">
                      Refuser le visuel (à corriger)
                    </Button>
                  </div>
                  {!submittedByMerchant ? (
                    <p className="text-xs text-[var(--muted-text)]">Aucun bandeau soumis à approuver : importez le bandeau final ci-dessous.</p>
                  ) : null}
                </section>
              ) : null}

              {/* Import du bandeau final */}
              {canPropose ? (
                <section className="space-y-3 rounded-xl border border-[var(--border)] p-3" aria-label="Importer un bandeau final">
                  <p className="text-sm font-bold text-[var(--ink)]">
                    {ad.visualMode === "SELF" ? "Importer une autre proposition" : "Importer le bandeau final"}
                  </p>
                  <p className="text-xs text-[var(--muted-text)]">
                    PNG, JPEG ou WebP · 10 Mo max · idéalement carré (format du bandeau public). Texte et mise en page : à faire dans Photoshop.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Button type="button" variant="secondary" disabled={busy} onClick={() => fileInputRef.current?.click()}>
                      {draft || pendingFile ? "Remplacer le fichier" : "Choisir un fichier"}
                    </Button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      className="hidden"
                      data-testid="import-file"
                      onChange={(e) => void onFileChosen(e.target.files?.[0] ?? null)}
                    />
                  </div>
                  {pendingFile ? <FramingTool src={pendingFile.dataUrl} onExport={(d) => void onFramed(d)} onCancel={() => setPendingFile(null)} /> : null}
                  {draft ? (
                    <div className="space-y-3" data-testid="draft-preview">
                      <p className="text-xs font-bold text-[var(--ink)]">
                        {draft.reframed ? "Cadrage appliqué." : "Format exact : prêt à envoyer sans recadrage."} Aperçu dans le format d&apos;affichage réel :
                      </p>
                      <div className="flex flex-wrap items-start gap-4">
                        <RealBannerPreview imageUrl={draft.previewUrl} merchantName={ad.merchant.name} text={ad.requestedText} ctaLabel={ad.ctaLabel} />
                        <ImageThumb src={draft.previewUrl} label="Aperçu en grand" size={96} />
                      </div>
                      <Button disabled={busy} onClick={() => void sendProposal()} data-testid="send-proposal">
                        Envoyer au commerçant comme proposition
                      </Button>
                    </div>
                  ) : null}
                </section>
              ) : null}

              {/* Refus de la campagne */}
              {["PENDING_REVIEW", "NEEDS_CHANGES", "AWAITING_MERCHANT", "APPROVED"].includes(ad.status) ? (
                <section className="space-y-2 rounded-xl border border-[var(--danger)] p-3" aria-label="Refuser la campagne">
                  <p className="text-sm font-bold text-[var(--danger)]">Refuser la campagne entière</p>
                  <p className="text-xs text-[var(--muted-text)]">
                    Définitif — à utiliser si le problème n&apos;est pas simplement le visuel (sinon utilisez « Refuser le visuel »).
                  </p>
                  <textarea
                    className="profile-select w-full"
                    rows={2}
                    placeholder="Motif du refus de la campagne"
                    value={campaignReason}
                    onChange={(e) => setCampaignReason(e.target.value)}
                  />
                  <Button variant="secondary" disabled={busy} onClick={() => void refuseCampaign()} data-testid="refuse-campaign">
                    Refuser la campagne
                  </Button>
                </section>
              ) : null}

              <section className="space-y-2" aria-label="Historique des versions">
                <p className="text-sm font-bold text-[var(--ink)]">Historique des versions</p>
                <VersionHistory versions={ad.versions} adminView />
              </section>
            </Card>

            <Card className="space-y-3 p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-[var(--muted-text)]">Texte et lien</p>
              <label className="block text-xs text-[var(--muted-text)]">
                Texte du bandeau
                <textarea className="profile-select mt-1 w-full" rows={2} value={text} onChange={(e) => setText(e.target.value)} />
              </label>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="block text-xs text-[var(--muted-text)]">
                  Libellé du bouton
                  <input className="profile-select mt-1 w-full" value={ctaLabel} onChange={(e) => setCtaLabel(e.target.value)} />
                </label>
                <label className="block text-xs text-[var(--muted-text)]">
                  Lien (http/https)
                  <input className="profile-select mt-1 w-full" value={ctaUrl} onChange={(e) => setCtaUrl(e.target.value)} />
                </label>
              </div>
              <p className="text-[11px] text-[var(--muted-text)]">Ces champs sont enregistrés lorsque vous approuvez le bandeau.</p>
              {ad.objective ? <p className="text-xs text-[var(--muted-text)]">Objectif indiqué par le commerçant : {ad.objective}</p> : null}
            </Card>

            <Card className="space-y-3 p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-[var(--muted-text)]">Créneaux et prix</p>
              {pricing ? (
                <div className="space-y-1 text-sm">
                  {pricing.byDay.map((day) => (
                    <div key={day.date} className="flex justify-between text-[var(--ink)]">
                      <span>
                        {day.date} · {day.hours.length} h ({day.hours.map((h) => `${h}h`).join(", ")})
                      </span>
                      <span className="font-bold">{formatCents(day.priceCents)}</span>
                    </div>
                  ))}
                  <div className="flex justify-between border-t border-[var(--border)] pt-2 font-bold text-[var(--ink)]">
                    <span>
                      Total ({pricing.totalDays} j, {pricing.totalHours} h)
                    </span>
                    <span>{formatCents(pricing.totalCents)}</span>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-[var(--muted-text)]">
                  Ancienne demande (tarif jour) : {formatDateTime(ad.startDate)} → {formatDateTime(ad.endDate)}
                </p>
              )}
              <p className="text-xs text-[var(--muted-text)]">
                Paiement :{" "}
                {ad.campaign?.payment
                  ? `${ad.campaign.payment.status} · ${formatCents(ad.campaign.payment.amountCents)} (${ad.campaign.payment.mode})`
                  : "Couvert par quota ou non requis"}
              </p>
            </Card>

            {["SCHEDULED", "LIVE", "SUSPENDED"].includes(ad.status) ? (
              <Card className="space-y-3 p-4">
                <p className="text-xs font-bold uppercase tracking-wide text-[var(--muted-text)]">Diffusion</p>
                <label className="block text-xs text-[var(--muted-text)]">
                  Motif (suspension ou arrêt)
                  <textarea className="profile-select mt-1 w-full" rows={2} value={lifecycleReason} onChange={(e) => setLifecycleReason(e.target.value)} />
                </label>
                <div className="flex flex-wrap gap-2">
                  <Button variant="secondary" disabled={busy || !["SCHEDULED", "LIVE"].includes(ad.status)} onClick={() => void lifecycle("suspend")}>
                    Suspendre
                  </Button>
                  <Button variant="secondary" disabled={busy || ad.status !== "SUSPENDED"} onClick={() => void lifecycle("resume")}>
                    Relancer
                  </Button>
                  <Button variant="secondary" disabled={busy} onClick={() => void lifecycle("stop")}>
                    Arrêter définitivement
                  </Button>
                </div>
              </Card>
            ) : null}

            <Card className="space-y-3 p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-[var(--muted-text)]">Statistiques réelles</p>
              {stats && stats.totalImpressions + stats.totalClicks > 0 ? (
                <div className="space-y-1 text-sm">
                  {stats.byDay.map((d) => (
                    <div key={d.date} className="flex justify-between text-[var(--ink)]">
                      <span>{d.date}</span>
                      <span>
                        {d.impressions} impr. · {d.clicks} clics{d.ctr !== null ? ` · ${d.ctr.toFixed(1)}% CTR` : ""}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-[var(--muted-text)]">Aucune impression ni clic enregistré pour le moment.</p>
              )}
            </Card>

            <Card className="space-y-2 p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-[var(--muted-text)]">Historique complet</p>
              {audit.length === 0 && notifications.length === 0 ? (
                <p className="text-sm text-[var(--muted-text)]">Aucun événement enregistré pour le moment.</p>
              ) : (
                <div className="space-y-2">
                  {[
                    ...audit.map((row) => ({
                      key: `a-${row.id}`,
                      at: row.createdAt,
                      label: row.action,
                      who: row.actor ? `${row.actor.firstName} ${row.actor.lastName}` : null,
                    })),
                    ...notifications.map((n) => ({ key: `n-${n.id}`, at: n.createdAt, label: n.message, who: n.audience === "MERCHANT" ? "→ commerçant" : "→ Fideto" })),
                  ]
                    .sort((a, b) => +new Date(b.at) - +new Date(a.at))
                    .map((row) => (
                      <div key={row.key} className="text-xs text-[var(--muted-text)]">
                        <span className="font-bold text-[var(--ink)]">{row.label}</span> — {formatDateTime(row.at)}
                        {row.who ? ` · ${row.who}` : ""}
                      </div>
                    ))}
                </div>
              )}
            </Card>
          </>
        )}
      </div>
    </SuperAdminShell>
  );
}
