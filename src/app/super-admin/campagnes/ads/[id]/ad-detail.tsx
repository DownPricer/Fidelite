"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { SuperAdminShell } from "@/components/super-admin/layout-shell";
import { Alert, Button, Card } from "@/components/ui";
import { priceSponsoredHours, type SponsoredDaySelection } from "@/lib/sponsored-hours-pricing";

const OUTPUT_PX = 800;
const FRAME_PX = 280;

function formatCents(cents: number | null) {
  if (cents === null || cents === undefined) return "—";
  return (cents / 100).toLocaleString("fr-FR", { style: "currency", currency: "EUR" });
}

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("fr-FR", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

type AdImage = { id: string; url: string };
type AdStatus =
  | "DRAFT"
  | "PENDING_REVIEW"
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
};

type AuditRow = {
  id: string;
  action: string;
  createdAt: string;
  metadata: unknown;
  actor: { firstName: string; lastName: string } | null;
};

type AdStatsPayload = {
  byDay: { date: string; impressions: number; clicks: number; ctr: number | null }[];
  totalImpressions: number;
  totalClicks: number;
  ctr: number | null;
};

const STATUS_LABELS: Record<AdStatus, string> = {
  DRAFT: "Brouillon",
  PENDING_REVIEW: "En attente de validation",
  NEEDS_CHANGES: "Correction demandée",
  APPROVED: "Approuvée (en attente de paiement)",
  REJECTED: "Refusée",
  SCHEDULED: "Programmée",
  LIVE: "En cours de diffusion",
  SUSPENDED: "Suspendue",
  ENDED: "Terminée",
  STOPPED: "Arrêtée",
  CANCELLED: "Annulée",
};

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("Lecture du fichier impossible."));
    reader.readAsDataURL(file);
  });
}

function loadImageElement(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Image illisible."));
    img.src = src;
  });
}

/**
 * Éditeur de bandeau super-admin : recadrage carré (import, remplacement, déplacement, zoom)
 * au format exact du bandeau public (800×800, même convention que le recadrage commerçant
 * SELF — voir SelfVisualCropper dans campagnes/ui.tsx), avec aperçu en dimensions réelles.
 */
function AdVisualEditor({ initialSrc, onExport }: { initialSrc: string | null; onExport: (dataUrl: string) => void }) {
  const [imgEl, setImgEl] = useState<HTMLImageElement | null>(null);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [error, setError] = useState<string | null>(null);
  const dragRef = useRef<{ startX: number; startY: number; origin: { x: number; y: number } } | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const loadSrc = useCallback((src: string) => {
    setError(null);
    loadImageElement(src)
      .then((img) => {
        setImgEl(img);
        setZoom(1);
        setOffset({ x: 0, y: 0 });
      })
      .catch(() => setError("Image illisible. Utilisez un fichier PNG, JPEG ou WebP."));
  }, []);

  useEffect(() => {
    if (initialSrc) loadSrc(initialSrc);
  }, [initialSrc, loadSrc]);

  async function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await readFileAsDataUrl(file);
      loadSrc(dataUrl);
    } catch {
      setError("Lecture du fichier impossible.");
    }
    e.target.value = "";
  }

  if (!imgEl) {
    return (
      <div className="space-y-2">
        {error ? <Alert>{error}</Alert> : null}
        <Button type="button" variant="secondary" onClick={() => fileInputRef.current?.click()}>
          Importer une image
        </Button>
        <input ref={fileInputRef} type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={(e) => void onFileChange(e)} />
      </div>
    );
  }

  const baseScale = Math.max(FRAME_PX / imgEl.width, FRAME_PX / imgEl.height);
  const displayScale = baseScale * zoom;
  const displayWidth = imgEl.width * displayScale;
  const displayHeight = imgEl.height * displayScale;
  const maxOffsetX = Math.max(0, (displayWidth - FRAME_PX) / 2);
  const maxOffsetY = Math.max(0, (displayHeight - FRAME_PX) / 2);
  const clampedOffset = {
    x: Math.min(maxOffsetX, Math.max(-maxOffsetX, offset.x)),
    y: Math.min(maxOffsetY, Math.max(-maxOffsetY, offset.y)),
  };

  function onPointerDown(e: ReactPointerEvent) {
    (e.target as Element).setPointerCapture(e.pointerId);
    dragRef.current = { startX: e.clientX, startY: e.clientY, origin: clampedOffset };
  }
  function onPointerMove(e: ReactPointerEvent) {
    if (!dragRef.current) return;
    const dx = e.clientX - dragRef.current.startX;
    const dy = e.clientY - dragRef.current.startY;
    setOffset({ x: dragRef.current.origin.x + dx, y: dragRef.current.origin.y + dy });
  }
  function onPointerUp() {
    dragRef.current = null;
  }

  function exportCrop() {
    const canvas = document.createElement("canvas");
    canvas.width = OUTPUT_PX;
    canvas.height = OUTPUT_PX;
    const ctx = canvas.getContext("2d");
    if (!ctx || !imgEl) {
      setError("Recadrage impossible sur cet appareil.");
      return;
    }
    const exportScale = OUTPUT_PX / FRAME_PX;
    const drawWidth = displayWidth * exportScale;
    const drawHeight = displayHeight * exportScale;
    const drawX = OUTPUT_PX / 2 - drawWidth / 2 + clampedOffset.x * exportScale;
    const drawY = OUTPUT_PX / 2 - drawHeight / 2 + clampedOffset.y * exportScale;
    ctx.drawImage(imgEl, drawX, drawY, drawWidth, drawHeight);
    onExport(canvas.toDataURL("image/jpeg", 0.92));
  }

  return (
    <div className="space-y-3">
      {error ? <Alert>{error}</Alert> : null}
      <div
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
        className="relative mx-auto overflow-hidden rounded-lg border border-[var(--border)]"
        style={{ width: FRAME_PX, height: FRAME_PX, touchAction: "none", cursor: "grab" }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imgEl.src}
          alt=""
          draggable={false}
          className="pointer-events-none absolute select-none"
          style={{
            width: displayWidth,
            height: displayHeight,
            left: FRAME_PX / 2 - displayWidth / 2 + clampedOffset.x,
            top: FRAME_PX / 2 - displayHeight / 2 + clampedOffset.y,
          }}
        />
      </div>
      <label className="block text-xs text-[var(--muted-text)]">
        Zoom
        <input type="range" min={1} max={3} step={0.05} value={zoom} onChange={(e) => setZoom(Number(e.target.value))} className="mt-1 w-full" />
      </label>
      <p className="text-[11px] text-[var(--muted-text)]">
        Déplacez l&apos;image pour cadrer le bandeau (format carré {OUTPUT_PX}×{OUTPUT_PX}, identique au format public).
      </p>
      <div className="flex flex-wrap gap-2">
        <Button type="button" onClick={exportCrop}>
          Valider le recadrage
        </Button>
        <Button type="button" variant="secondary" onClick={() => fileInputRef.current?.click()}>
          Changer d&apos;image
        </Button>
        <input ref={fileInputRef} type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={(e) => void onFileChange(e)} />
      </div>
    </div>
  );
}

export function AdDetailPage({ id, firstName }: { id: string; firstName: string }) {
  const [ad, setAd] = useState<AdRequestDetail | null>(null);
  const [audit, setAudit] = useState<AuditRow[]>([]);
  const [stats, setStats] = useState<AdStatsPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const [editorSource, setEditorSource] = useState<string | null>(null);
  const [draftImage, setDraftImage] = useState<string | null>(null);
  const [text, setText] = useState("");
  const [ctaLabel, setCtaLabel] = useState("");
  const [ctaUrl, setCtaUrl] = useState("");
  const [reason, setReason] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/super-admin/ads/${id}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Chargement impossible.");
      setAd(data.adRequest);
      setAudit(data.audit ?? []);
      setStats(data.stats ?? null);
      setText(data.adRequest.requestedText ?? "");
      setCtaLabel(data.adRequest.ctaLabel ?? "");
      setCtaUrl(data.adRequest.ctaUrl ?? "");
      setDraftImage(null);
      setEditorSource(
        data.adRequest.finalImageUrl ??
          (data.adRequest.visualMode === "SELF" ? data.adRequest.requestedImageUrl : data.adRequest.images?.[0]?.url ?? null),
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    void load();
  }, [load]);

  async function action(kind: "approve" | "reject" | "request_changes" | "suspend" | "resume" | "stop") {
    if (!ad) return;
    setBusy(true);
    setError(null);
    setNotice(null);
    try {
      const body: Record<string, unknown> = { action: kind };
      if (kind === "reject" || kind === "request_changes" || kind === "suspend" || kind === "stop") {
        body.rejectionReason = reason.trim() || null;
      }
      if (kind === "approve") {
        let finalImageUrl = ad.finalImageUrl;
        if (draftImage) {
          const uploadRes = await fetch(`/api/super-admin/ads/${id}/media`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ dataUrl: draftImage }),
          });
          const uploadData = await uploadRes.json();
          if (!uploadRes.ok) throw new Error(uploadData.error ?? "Envoi du visuel impossible.");
          finalImageUrl = uploadData.url;
        }
        if (!finalImageUrl) throw new Error("Recadrez et validez un visuel avant d'approuver.");
        body.finalImageUrl = finalImageUrl;
        body.requestedText = text.trim();
        body.ctaLabel = ctaLabel.trim() || null;
        body.ctaUrl = ctaUrl.trim() || null;
      }

      const res = await fetch(`/api/super-admin/ads/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Action impossible.");
      setNotice("Effectué.");
      setReason("");
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur.");
    } finally {
      setBusy(false);
    }
  }

  const pricing = ad?.hourlySchedule ? priceSponsoredHours(ad.hourlySchedule) : null;

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
            <span className="rounded-full border border-[var(--border)] px-3 py-1 text-xs font-bold text-[var(--ink)]">
              {STATUS_LABELS[ad.status]}
            </span>
          ) : null}
        </div>

        {error ? <Alert>{error}</Alert> : null}
        {notice ? <Card className="p-3 text-sm text-[var(--ink)]">{notice}</Card> : null}

        {loading || !ad ? (
          <p className="text-sm text-[var(--muted-text)]">Chargement…</p>
        ) : (
          <>
            <Card className="space-y-3 p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-[var(--muted-text)]">Commerce</p>
              <p className="text-sm font-bold text-[var(--ink)]">
                {ad.merchant.name} {ad.merchant.city ? `· ${ad.merchant.city}` : ""}
              </p>
              <p className="text-xs text-[var(--muted-text)]">Demande créée le {formatDateTime(ad.createdAt)}</p>
              {ad.rejectionReason ? (
                <p className="text-xs text-[var(--danger)]">Dernier motif transmis au commerçant : {ad.rejectionReason}</p>
              ) : null}
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
                    <span>Total ({pricing.totalDays} j, {pricing.totalHours} h)</span>
                    <span>{formatCents(pricing.totalCents)}</span>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-[var(--muted-text)]">
                  Ancienne demande (tarif jour) : {formatDateTime(ad.startDate)} → {formatDateTime(ad.endDate)}
                </p>
              )}
              <p className="text-xs text-[var(--muted-text)]">
                Paiement : {ad.campaign?.payment ? `${ad.campaign.payment.status} · ${formatCents(ad.campaign.payment.amountCents)} (${ad.campaign.payment.mode})` : "Couvert par quota ou non requis"}
              </p>
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
              {ad.objective ? <p className="text-xs text-[var(--muted-text)]">Objectif indiqué par le commerçant : {ad.objective}</p> : null}
            </Card>

            <Card className="space-y-3 p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-[var(--muted-text)]">
                Visuel — {ad.visualMode === "SELF" ? "déjà recadré par le commerçant" : "à préparer par Fideto"}
              </p>
              {ad.images.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {ad.images.map((img) => (
                    <button
                      key={img.id}
                      type="button"
                      onClick={() => setEditorSource(img.url)}
                      className="rounded-lg border border-[var(--border)] p-0.5"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={img.url} alt="" className="h-16 w-16 rounded-md object-cover" />
                    </button>
                  ))}
                </div>
              ) : null}
              <AdVisualEditor key={editorSource ?? "empty"} initialSrc={editorSource} onExport={setDraftImage} />
              {draftImage ? (
                <div>
                  <p className="mb-1 text-xs text-[var(--muted-text)]">Aperçu du recadrage (non enregistré tant que vous n&apos;approuvez pas) :</p>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={draftImage} alt="" className="h-20 w-20 rounded-lg object-cover" />
                </div>
              ) : ad.finalImageUrl ? (
                <div>
                  <p className="mb-1 text-xs text-[var(--muted-text)]">Visuel final actuellement enregistré :</p>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={ad.finalImageUrl} alt="" className="h-20 w-20 rounded-lg object-cover" />
                </div>
              ) : null}
            </Card>

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
                  <div className="flex justify-between border-t border-[var(--border)] pt-2 font-bold text-[var(--ink)]">
                    <span>Total</span>
                    <span>
                      {stats.totalImpressions} impr. · {stats.totalClicks} clics{stats.ctr !== null ? ` · ${stats.ctr.toFixed(1)}% CTR` : ""}
                    </span>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-[var(--muted-text)]">Aucune impression ni clic enregistré pour le moment.</p>
              )}
            </Card>

            <Card className="space-y-3 p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-[var(--muted-text)]">Actions</p>
              <label className="block text-xs text-[var(--muted-text)]">
                Motif (refus, correction, suspension ou arrêt)
                <textarea className="profile-select mt-1 w-full" rows={2} value={reason} onChange={(e) => setReason(e.target.value)} />
              </label>
              <div className="flex flex-wrap gap-2">
                <Button disabled={busy || !["PENDING_REVIEW", "NEEDS_CHANGES"].includes(ad.status)} onClick={() => void action("approve")}>
                  Approuver avec ce visuel
                </Button>
                <Button
                  variant="secondary"
                  disabled={busy || !["PENDING_REVIEW", "APPROVED"].includes(ad.status)}
                  onClick={() => void action("request_changes")}
                >
                  Demander une correction
                </Button>
                <Button
                  variant="secondary"
                  disabled={busy || !["PENDING_REVIEW", "NEEDS_CHANGES", "APPROVED"].includes(ad.status)}
                  onClick={() => void action("reject")}
                >
                  Refuser
                </Button>
                <Button
                  variant="secondary"
                  disabled={busy || !["SCHEDULED", "LIVE"].includes(ad.status)}
                  onClick={() => void action("suspend")}
                >
                  Suspendre
                </Button>
                <Button variant="secondary" disabled={busy || ad.status !== "SUSPENDED"} onClick={() => void action("resume")}>
                  Relancer
                </Button>
                <Button
                  variant="secondary"
                  disabled={busy || !["SCHEDULED", "LIVE", "SUSPENDED"].includes(ad.status)}
                  onClick={() => void action("stop")}
                >
                  Arrêter définitivement
                </Button>
              </div>
            </Card>

            <Card className="space-y-2 p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-[var(--muted-text)]">Historique</p>
              {audit.length === 0 ? (
                <p className="text-sm text-[var(--muted-text)]">Aucune décision enregistrée pour le moment.</p>
              ) : (
                <div className="space-y-2">
                  {audit.map((row) => (
                    <div key={row.id} className="text-xs text-[var(--muted-text)]">
                      <span className="font-bold text-[var(--ink)]">{row.action}</span> — {formatDateTime(row.createdAt)}
                      {row.actor ? ` · ${row.actor.firstName} ${row.actor.lastName}` : ""}
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
