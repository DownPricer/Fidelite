"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { SuperAdminShell } from "@/components/super-admin/layout-shell";
import { RealBannerPreview, formatDateTime, isExactBanner, loadImageElement, readFileAsDataUrl, type NextActionInfo, type VisualVersion } from "@/components/ad-visual-parts";
import { priceSponsoredHours, type SponsoredDaySelection } from "@/lib/sponsored-hours-pricing";
import s from "./fiche.module.css";

/** Taille d'export du bandeau (carré, identique au bandeau public — voir src/lib/ad-visuals.ts). */
const OUTPUT_PX = 800;
const PREVIEW_PX = 340;

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

type Version = VisualVersion & { createdBy?: string | null; decidedBy?: string | null };

type AdRequestDetail = {
  id: string;
  status: AdStatus;
  requestedText: string;
  visualMode: "SELF" | "FIDETO" | null;
  visualBrief: string | null;
  finalImageUrl: string | null;
  finalVersionId: string | null;
  objective: string | null;
  ctaLabel: string | null;
  ctaUrl: string | null;
  startDate: string;
  endDate: string;
  hourlySchedule: SponsoredDaySelection[] | null;
  rejectionReason: string | null;
  createdAt: string;
  merchant: { id: string; name: string; slug: string; city: string | null; logoUrl: string | null };
  campaign: {
    id: string;
    priceCents: number | null;
    quotaConsumedAt: string | null;
    requiresPayment: boolean;
    payment: { status: string; amountCents: number; mode: string; paidAt: string | null } | null;
  } | null;
  images: { id: string; url: string; sizeBytes: number | null; createdAt: string }[];
  versions: Version[];
};

type AuditRow = { id: string; action: string; createdAt: string; actor: { firstName: string; lastName: string } | null };
type Journey = { label: string; state: "done" | "current" | "todo" }[];
type Delivery = {
  mode: "TEST" | "LIVE";
  simulated: boolean;
  deliverable: boolean;
  eligibleCustomers: number;
  checks: { key: string; ok: boolean; label: string; detail: string }[];
};
type Stats = {
  byDay: { date: string }[];
  byPlacement?: { placement: string; impressions: number; clicks: number }[];
  totalImpressions: number;
  totalClicks: number;
  ctr: number | null;
};

const STATUS_LABELS: Record<AdStatus, string> = {
  DRAFT: "Brouillon",
  PENDING_REVIEW: "À traiter par Fideto",
  AWAITING_MERCHANT: "En attente du commerçant",
  NEEDS_CHANGES: "Visuel à corriger par le commerçant",
  APPROVED: "Visuel validé — en attente de paiement",
  REJECTED: "Campagne refusée",
  SCHEDULED: "Programmée",
  LIVE: "En cours de diffusion",
  SUSPENDED: "Suspendue",
  ENDED: "Terminée",
  STOPPED: "Arrêtée",
  CANCELLED: "Annulée",
};

const PLACEMENT_LABELS: Record<string, string> = {
  WALLET_HOME: "Accueil du Wallet",
  SEARCH: "Recherche",
  NOTIFICATIONS: "Notifications",
  UNKNOWN: "Avant le suivi par emplacement",
};

const AUDIT_LABELS: Record<string, string> = {
  AD_REJECT: "Campagne refusée",
  AD_SUSPEND: "Mise en avant suspendue",
  AD_RESUME: "Mise en avant relancée",
  AD_STOP: "Mise en avant arrêtée",
};

/** Statuts où Fideto peut encore envoyer une proposition (aligné sur le serveur). */
const PROPOSABLE: AdStatus[] = ["PENDING_REVIEW", "NEEDS_CHANGES", "AWAITING_MERCHANT", "APPROVED", "SCHEDULED", "LIVE", "SUSPENDED"];

type ReasonKind = "campaign" | "visual" | "suspend" | "stop";
const REASON_DIALOGS: Record<ReasonKind, { title: string; text: string; label: string; confirm: string; required: boolean }> = {
  campaign: {
    title: "Refuser la campagne entière",
    text: "Cette action met fin à la demande. Si le problème concerne uniquement l'image, demandez plutôt une correction du visuel.",
    label: "Motif du refus",
    confirm: "Confirmer le refus",
    required: true,
  },
  visual: {
    title: "Demander une correction du visuel",
    text: "La campagne reste active : le commerçant voit votre motif et peut remplacer son visuel puis le soumettre de nouveau.",
    label: "Motif précis et correction demandée",
    confirm: "Envoyer la demande",
    required: true,
  },
  suspend: {
    title: "Suspendre la mise en avant",
    text: "Elle ne sera plus diffusée tant que vous ne la relancez pas.",
    label: "Motif (facultatif)",
    confirm: "Suspendre",
    required: false,
  },
  stop: {
    title: "Arrêter définitivement",
    text: "La diffusion s'arrête avant la fin des créneaux achetés. Action définitive.",
    label: "Motif (facultatif)",
    confirm: "Arrêter",
    required: false,
  },
};

const VERSION_STATUS: Record<VisualVersion["status"], string> = {
  DRAFT: "Brouillon",
  SUBMITTED: "En attente de décision Fideto",
  PROPOSED: "Proposée au commerçant",
  APPROVED: "Version finale",
  CHANGES_REQUESTED: "Refusée / modification demandée",
  SUPERSEDED: "Remplacée",
};

function formatCents(cents: number | null | undefined) {
  if (cents === null || cents === undefined) return "—";
  return (cents / 100).toLocaleString("fr-FR", { style: "currency", currency: "EUR" });
}

function formatDay(date: string) {
  const [y, m, d] = date.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d, 12)).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", timeZone: "UTC" });
}

function hourRanges(hours: number[]) {
  const sorted = [...hours].sort((a, b) => a - b);
  const ranges: string[] = [];
  let start = sorted[0];
  for (let i = 0; i < sorted.length; i += 1) {
    if (sorted[i + 1] !== sorted[i] + 1) {
      ranges.push(`${String(start).padStart(2, "0")} h–${String(sorted[i] + 1).padStart(2, "0")} h`);
      start = sorted[i + 1];
    }
  }
  return ranges.join(", ");
}

async function api(url: string, init?: RequestInit) {
  const res = await fetch(url, init);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error((data as { error?: string }).error ?? "Action impossible.");
  return data as Record<string, unknown>;
}
const post = (url: string, body: unknown) =>
  api(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });

/** Recadrage réel : même calcul pour l'aperçu et pour le fichier enregistré (zoom + position, sortie carrée). */
function renderFrame(img: HTMLImageElement, size: number, zoom: number, h: number, v: number) {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Recadrage impossible sur cet appareil.");
  const scale = Math.max(size / img.naturalWidth, size / img.naturalHeight) * (zoom / 100);
  const dw = img.naturalWidth * scale;
  const dh = img.naturalHeight * scale;
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, size, size);
  ctx.drawImage(img, -(dw - size) * (h / 100), -(dh - size) * (v / 100), dw, dh);
  return canvas.toDataURL("image/jpeg", 0.95);
}

type Draft = { dataUrl: string; name: string; width: number; height: number };

export function AdDetailPage({ id, firstName }: { id: string; firstName: string }) {
  const [ad, setAd] = useState<AdRequestDetail | null>(null);
  const [audit, setAudit] = useState<AuditRow[]>([]);
  const [people, setPeople] = useState<Record<string, string>>({});
  const [journey, setJourney] = useState<Journey>([]);
  const [nextAction, setNextAction] = useState<NextActionInfo | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [delivery, setDelivery] = useState<Delivery | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState<{ msg: string; error: boolean } | null>(null);

  const [draft, setDraft] = useState<Draft | null>(null);
  const [zoom, setZoom] = useState(100);
  const [horizontal, setHorizontal] = useState(50);
  const [vertical, setVertical] = useState(50);
  const [framePreview, setFramePreview] = useState<string | null>(null);
  const draftImg = useRef<HTMLImageElement | null>(null);
  const fileInput = useRef<HTMLInputElement | null>(null);

  const directDialog = useRef<HTMLDialogElement | null>(null);
  const replaceDialog = useRef<HTMLDialogElement | null>(null);
  const reasonDialog = useRef<HTMLDialogElement | null>(null);
  const imageDialog = useRef<HTMLDialogElement | null>(null);
  const [reasonKind, setReasonKind] = useState<ReasonKind>("campaign");
  const [reason, setReason] = useState("");
  const [bigImage, setBigImage] = useState<string | null>(null);

  const notify = useCallback((msg: string, error = false) => {
    setToast({ msg, error });
    window.setTimeout(() => setToast((t) => (t?.msg === msg ? null : t)), 4200);
  }, []);

  const load = useCallback(async () => {
    try {
      const data = (await api(`/api/super-admin/visuels/${id}`)) as unknown as {
        adRequest: AdRequestDetail;
        audit: AuditRow[];
        people: Record<string, string>;
        journey: Journey;
        nextAction: NextActionInfo;
        stats: Stats | null;
        delivery: Delivery | null;
      };
      setAd(data.adRequest);
      setAudit(data.audit ?? []);
      setPeople(data.people ?? {});
      setJourney(data.journey ?? []);
      setNextAction(data.nextAction ?? null);
      setStats(data.stats ?? null);
      setDelivery(data.delivery ?? null);
    } catch (e) {
      notify(e instanceof Error ? e.message : "Chargement impossible.", true);
    } finally {
      setLoading(false);
    }
  }, [id, notify]);

  useEffect(() => {
    void load();
  }, [load]);

  /* ----------------------------- actions serveur ----------------------------- */

  async function run(task: () => Promise<void>, done: string) {
    if (busy) return; // jamais deux actions en parallèle depuis la même page
    setBusy(true);
    try {
      await task();
      notify(done);
      await load();
    } catch (e) {
      notify(e instanceof Error ? e.message : "Erreur.", true);
      await load();
    } finally {
      setBusy(false);
    }
  }

  async function patch(body: Record<string, unknown>) {
    await api(`/api/super-admin/visuels/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  }

  const approveAsIs = async () => {
    directDialog.current?.close();
    await run(() => patch({ action: "approve" }), "Visuel validé : le commerçant peut passer au paiement.");
  };

  function openReason(kind: ReasonKind) {
    setReasonKind(kind);
    setReason("");
    reasonDialog.current?.showModal();
  }

  async function confirmReason() {
    const cfg = REASON_DIALOGS[reasonKind];
    const text = reason.trim();
    if (cfg.required && !text) {
      notify("Expliquez la décision au commerçant.", true);
      return;
    }
    reasonDialog.current?.close();
    const action = { campaign: "reject", visual: "request_changes", suspend: "suspend", stop: "stop" }[reasonKind];
    const done = {
      campaign: "Campagne refusée.",
      visual: "Correction demandée : le commerçant voit votre motif.",
      suspend: "Mise en avant suspendue.",
      stop: "Mise en avant arrêtée.",
    }[reasonKind];
    await run(() => patch({ action, rejectionReason: text || null }), done);
  }

  /* ------------------------------ import & recadrage ------------------------------ */

  async function onFileChosen(file: File | null) {
    if (!file) return;
    try {
      if (!["image/png", "image/jpeg", "image/webp"].includes(file.type)) throw new Error("Choisissez une image PNG, JPG ou WebP.");
      if (file.size > 10 * 1024 * 1024) throw new Error("Ce fichier dépasse la limite de 10 Mo.");
      const dataUrl = await readFileAsDataUrl(file);
      const img = await loadImageElement(dataUrl);
      draftImg.current = img;
      setZoom(100);
      setHorizontal(50);
      setVertical(50);
      setDraft({ dataUrl, name: file.name, width: img.naturalWidth, height: img.naturalHeight });
    } catch (e) {
      notify(e instanceof Error ? e.message : "Fichier invalide.", true);
    } finally {
      if (fileInput.current) fileInput.current.value = "";
    }
  }

  const exact = draft ? isExactBanner(draft.width, draft.height) : false;
  const adjusted = zoom !== 100 || horizontal !== 50 || vertical !== 50;
  // Fichier non carré : le recadrage est obligatoire (cadrage centré par défaut) ; carré : facultatif.
  const needsFrame = Boolean(draft) && (!exact || adjusted);

  useEffect(() => {
    if (!draft || !draftImg.current) {
      setFramePreview(null);
      return;
    }
    try {
      // Le rendu affiché est celui qui sera enregistré (même calcul, seule la taille change).
      setFramePreview(needsFrame ? renderFrame(draftImg.current, PREVIEW_PX, zoom, horizontal, vertical) : draft.dataUrl);
    } catch {
      setFramePreview(draft.dataUrl);
    }
  }, [draft, zoom, horizontal, vertical, needsFrame]);

  const pendingProposal = ad?.versions.find((v) => v.status === "PROPOSED") ?? null;

  function requestSend() {
    if (!draft) return;
    if (pendingProposal) replaceDialog.current?.showModal();
    else void sendProposal();
  }

  async function sendProposal() {
    replaceDialog.current?.close();
    if (!draft || !draftImg.current) return;
    const current = draft;
    const img = draftImg.current;
    await run(async () => {
      if (!needsFrame) {
        // Fichier déjà au bon format : envoyé tel quel, sans recadrage.
        const staged = await post(`/api/super-admin/visuels/${id}/fichier`, { dataUrl: current.dataUrl, kind: "banniere" });
        await post(`/api/super-admin/visuels/${id}/proposition`, { url: staged.url });
      } else {
        // Fichier recadré : on enregistre le rendu recadré (800×800) ET le fichier d'origine.
        const cropped = renderFrame(img, OUTPUT_PX, zoom, horizontal, vertical);
        const original = await post(`/api/super-admin/visuels/${id}/fichier`, { dataUrl: current.dataUrl, kind: "original" });
        const display = await post(`/api/super-admin/visuels/${id}/fichier`, { dataUrl: cropped, kind: "banniere" });
        await post(`/api/super-admin/visuels/${id}/proposition`, { url: display.url, originalUrl: original.url });
      }
      setDraft(null);
      draftImg.current = null;
    }, "Nouvelle version envoyée au commerçant.");
  }

  function openImage(src: string) {
    setBigImage(src);
    imageDialog.current?.showModal();
  }

  /* ------------------------------ données dérivées ------------------------------ */

  const view = useMemo(() => {
    if (!ad) return null;
    const pending = ad.versions.find((v) => v.status === "SUBMITTED" || v.status === "PROPOSED") ?? null;
    const final = ad.finalVersionId ? (ad.versions.find((v) => v.id === ad.finalVersionId) ?? null) : null;
    const shown = pending ?? final ?? ad.versions[0] ?? null;
    const submittedByMerchant = ad.versions.find((v) => v.status === "SUBMITTED" && v.author === "MERCHANT") ?? null;
    const lastMerchantRequest = ad.versions.find((v) => v.status === "CHANGES_REQUESTED" && v.author === "FIDETO") ?? null;
    const pricing = ad.hourlySchedule ? priceSponsoredHours(ad.hourlySchedule) : null;
    return { pending, final, shown, submittedByMerchant, lastMerchantRequest, pricing };
  }, [ad]);

  const events = useMemo(() => {
    if (!ad) return [];
    const who = (uid?: string | null) => (uid ? (people[uid] ?? null) : null);
    const list: { key: string; at: string; icon: string; title: string; sub: string }[] = [];
    list.push({ key: "created", at: ad.createdAt, icon: "◷", title: "Demande de mise en avant créée", sub: ad.merchant.name });
    if (ad.images.length > 0) {
      const n = ad.images.length;
      list.push({ key: "sources", at: ad.images[0].createdAt, icon: "＋", title: `${n} image${n > 1 ? "s" : ""} source${n > 1 ? "s" : ""} reçue${n > 1 ? "s" : ""}`, sub: ad.merchant.name });
    }
    for (const v of ad.versions) {
      const author = v.author === "FIDETO" ? (who(v.createdBy) ?? "Fideto") : ad.merchant.name;
      list.push({
        key: `v${v.id}`,
        at: v.createdAt,
        icon: "✓",
        title: v.author === "FIDETO" ? "Visuel proposé au commerçant" : "Bandeau soumis par le commerçant",
        sub: `Version ${v.number} · ${author}`,
      });
      if (v.decidedAt && v.status === "CHANGES_REQUESTED") {
        list.push({ key: `d${v.id}`, at: v.decidedAt, icon: "↺", title: v.author === "FIDETO" ? "Modification demandée par le commerçant" : "Visuel refusé — correction demandée", sub: `Version ${v.number}${v.comment ? ` · « ${v.comment} »` : ""}` });
      }
      if (v.decidedAt && v.status === "APPROVED") {
        const name = who(v.decidedBy) ?? (v.author === "FIDETO" ? ad.merchant.name : "Super-admin");
        list.push({ key: `a${v.id}`, at: v.decidedAt, icon: "✓", title: v.author === "FIDETO" ? "Version acceptée par le commerçant" : "Visuel validé tel quel", sub: `Version ${v.number} · ${name}` });
      }
    }
    for (const row of audit) {
      if (!AUDIT_LABELS[row.action]) continue;
      list.push({ key: `u${row.id}`, at: row.createdAt, icon: "•", title: AUDIT_LABELS[row.action], sub: row.actor ? `${row.actor.firstName} ${row.actor.lastName}` : "" });
    }
    if (ad.campaign?.payment?.paidAt) {
      list.push({ key: "paid", at: ad.campaign.payment.paidAt, icon: "€", title: "Paiement confirmé", sub: formatCents(ad.campaign.payment.amountCents) });
    }
    return list.sort((a, b) => +new Date(b.at) - +new Date(a.at));
  }, [ad, audit, people]);

  if (loading || !ad || !view) {
    return (
      <SuperAdminShell firstName={firstName}>
        <div className={s.fiche}>
          <Link href="/super-admin/campagnes" className={s.back}>
            ← Retour aux campagnes
          </Link>
          <p className={s.loading}>{loading ? "Chargement…" : "Mise en avant introuvable."}</p>
        </div>
        {toast ? (
          <div className={`${s.toast} ${toast.error ? s.toastError : ""}`} role="status">
            {toast.msg}
          </div>
        ) : null}
      </SuperAdminShell>
    );
  }

  const { pending, final, shown, submittedByMerchant, lastMerchantRequest, pricing } = view;
  const campaignCode = (ad.campaign?.id ?? ad.id).slice(-9).toUpperCase();
  const statusTone = ["APPROVED", "SCHEDULED", "LIVE"].includes(ad.status) ? s.statusGood : ["REJECTED", "STOPPED", "CANCELLED"].includes(ad.status) ? s.statusBad : "";
  const canPropose = PROPOSABLE.includes(ad.status);
  const awaiting = ad.status === "AWAITING_MERCHANT" || Boolean(pendingProposal);
  const canDecide = ad.status === "PENDING_REVIEW" && Boolean(submittedByMerchant);
  const dl = (url: string) => `${url}?telecharger=1`;

  const shownTexts = (() => {
    if (!shown) {
      return {
        pill: "Aucun bandeau",
        h3: "Pas encore de bandeau",
        p: ad.visualMode === "SELF" ? "Le commerçant n'a pas encore fourni de bandeau." : "Téléchargez les images du commerçant, créez le bandeau puis importez-le ci-dessous.",
      };
    }
    if (shown.status === "PROPOSED") return { pill: `✓ Version ${shown.number} envoyée`, h3: "En attente de son retour", p: "Le commerçant voit cette image depuis sa campagne. Il peut l'accepter ou demander une modification. Aucune nouvelle version ne sera publiée sans son accord." };
    if (shown.status === "SUBMITTED") return { pill: `Version ${shown.number} soumise`, h3: "À examiner", p: "Le commerçant a fourni ce bandeau. Validez-le tel quel, ou importez votre propre version." };
    if (shown.status === "APPROVED") return { pill: `✓ Version ${shown.number} validée`, h3: "Version finale validée", p: "C'est la seule version qui pourra être diffusée, après paiement et pendant les créneaux réservés." };
    if (shown.status === "CHANGES_REQUESTED") return { pill: `Version ${shown.number} refusée`, h3: "Modification demandée", p: shown.comment ? `« ${shown.comment} »` : "Une modification a été demandée." };
    return { pill: `Version ${shown.number}`, h3: "Version remplacée", p: "Cette version a été remplacée par une plus récente." };
  })();

  const visualTitle = shown?.status === "SUBMITTED" ? "Bandeau fourni par le commerçant" : shown?.status === "PROPOSED" ? "Bandeau proposé au commerçant" : "Visuel de la campagne";
  const authorLine = shown ? (shown.author === "FIDETO" ? `Fideto · ${shown.createdBy ? (people[shown.createdBy] ?? "Super-admin") : "Super-admin"}` : ad.merchant.name) : null;
  const decider = shown?.decidedBy ? (people[shown.decidedBy] ?? null) : null;

  /* ------------------------------------ rendu ------------------------------------ */

  return (
    <SuperAdminShell firstName={firstName}>
      <div className={s.fiche}>
        <Link href="/super-admin/campagnes" className={s.back}>
          ← Retour aux campagnes
        </Link>

        <div className={s.head}>
          <div>
            <div className={s.eyebrow}>CAMPAGNES · MISE EN AVANT</div>
            <h1 className={s.title}>Fiche de la mise en avant</h1>
            <p>Visuel, décision et programmation au même endroit.</p>
          </div>
          <div className={`${s.status} ${statusTone}`} data-testid="ad-status">
            <i />
            {STATUS_LABELS[ad.status]}
          </div>
        </div>

        <div className={`${s.card} ${s.hero}`}>
          <div className={s.initial}>
            {ad.merchant.logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={ad.merchant.logoUrl} alt="" />
            ) : (
              ad.merchant.name.slice(0, 1).toUpperCase()
            )}
          </div>
          <div>
            <strong>
              {ad.merchant.name}
              {ad.merchant.city ? ` · ${ad.merchant.city}` : ""}
            </strong>
            <small>
              Demande créée le {formatDateTime(ad.createdAt)} · {ad.visualMode === "SELF" ? "Bandeau fourni par le commerçant" : "Création du visuel par Fideto"}
            </small>
          </div>
          <div className={s.heroId}>
            CAMPAGNE<b>#{campaignCode}</b>
          </div>
        </div>

        <div className={s.journey} aria-label="Progression de la campagne" data-testid="journey">
          {journey.map((stage, i) => (
            <div key={stage.label} className={`${s.stage} ${stage.state === "done" ? s.stageDone : stage.state === "current" ? s.stageCurrent : ""}`}>
              <span>{stage.state === "done" ? "✓" : i + 1}</span>
              {stage.label}
            </div>
          ))}
        </div>

        <div className={s.workspace}>
          <div className={s.left}>
            {/* ------------------------- Visuel de la campagne ------------------------- */}
            <section className={`${s.card} ${s.pad}`} aria-labelledby="visual-title" data-testid="visual-section">
              <div className={s.sectionTitle}>
                <div>
                  <div className={s.eyebrow}>VISUEL DE LA CAMPAGNE</div>
                  <h2 className={s.h2} id="visual-title">
                    {visualTitle}
                  </h2>
                  <p className={s.sub}>La version soumise et les sources restent accessibles ici.</p>
                </div>
              </div>

              <div className={s.bannerDisplay}>
                <div className={s.bannerShell} aria-label="Aperçu du bandeau au format public">
                  <div className={s.bannerArt}>
                    {shown ? (
                      <>
                        <button type="button" className={s.bannerButton} onClick={() => openImage(shown.url)} aria-label="Agrandir l'aperçu">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={shown.url} alt={`Bandeau, version ${shown.number}`} />
                        </button>
                        <span className={s.sponsored}>SPONSORISÉ</span>
                        <div className={s.caption}>
                          <strong>{ad.merchant.name}</strong>
                          <small>{ad.ctaLabel ?? "Découvrez le commerce"} →</small>
                        </div>
                      </>
                    ) : (
                      <span>Aucun bandeau à afficher</span>
                    )}
                  </div>
                </div>
                <div className={s.meta}>
                  <span className={s.pill}>{shownTexts.pill}</span>
                  <h3>{shownTexts.h3}</h3>
                  <p>{shownTexts.p}</p>
                  {shown ? (
                    <>
                      <div className={s.metaLine}>
                        <span>{shown.author === "FIDETO" ? "Préparée par" : "Fournie par"}</span>
                        <b>{authorLine}</b>
                      </div>
                      <div className={s.metaLine}>
                        <span>{shown.author === "FIDETO" ? "Envoyée" : "Soumise"}</span>
                        <b>{formatDateTime(shown.createdAt)}</b>
                      </div>
                      {shown.width && shown.height ? (
                        <div className={s.metaLine}>
                          <span>Format</span>
                          <b>
                            {shown.width} × {shown.height} px{shown.reframed ? " · recadrée" : ""}
                          </b>
                        </div>
                      ) : null}
                      {shown.decidedAt && shown.status === "APPROVED" ? (
                        <div className={s.metaLine}>
                          <span>Validée</span>
                          <b>
                            {decider ?? "Super-admin"} · {formatDateTime(shown.decidedAt)}
                          </b>
                        </div>
                      ) : null}
                      <div className={s.buttonRow}>
                        <a className={`${s.button} ${s.secondary}`} href={dl(shown.originalUrl)} download data-testid="download-final">
                          ↓ Télécharger le bandeau
                        </a>
                        <button className={s.button} type="button" onClick={() => openImage(shown.url)} data-testid="large-preview">
                          Agrandir l&apos;aperçu
                        </button>
                      </div>
                      <div className={s.realBanner}>
                        <p className={s.note}>Rendu réel dans l&apos;application :</p>
                        <RealBannerPreview imageUrl={shown.url} merchantName={ad.merchant.name} text={ad.requestedText} ctaLabel={ad.ctaLabel} />
                      </div>
                    </>
                  ) : null}
                </div>
              </div>

              <hr className={s.rule} />
              <div className={`${s.sectionTitle} ${s.sourceHead}`}>
                <div>
                  <div className={s.eyebrow}>FICHIERS DU COMMERÇANT</div>
                  <h2 className={s.h2}>Images reçues</h2>
                </div>
                {ad.images.length > 0 ? (
                  <a className={s.textAction} href={`/api/super-admin/visuels/${id}/archive`} data-testid="download-archive">
                    Tout télécharger ({ad.images.length}) ↓
                  </a>
                ) : null}
              </div>
              {ad.visualBrief ? (
                <div className={s.requestNote}>
                  <b>Indication du commerçant :</b> « {ad.visualBrief} »
                </div>
              ) : null}
              {ad.images.map((img, i) => (
                <div key={img.id} className={s.sourceList}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img className={s.sourceThumb} src={img.url} alt={`Image source ${i + 1}`} onClick={() => openImage(img.url)} />
                  <div>
                    <strong>Image source {i + 1}</strong>
                    <small>Source originale{img.sizeBytes ? ` · ${(img.sizeBytes / 1024 / 1024).toFixed(1)} Mo` : ""}</small>
                  </div>
                  <a className={s.textAction} href={dl(img.url)} download>
                    Télécharger ↓
                  </a>
                </div>
              ))}
              {ad.visualMode === "SELF"
                ? ad.versions
                    .filter((v) => v.author === "MERCHANT")
                    .map((v) => (
                      <div key={v.id} className={s.sourceList}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img className={s.sourceThumb} src={v.url} alt={`Bandeau du commerçant, version ${v.number}`} onClick={() => openImage(v.url)} />
                        <div>
                          <strong>Bandeau du commerçant · version {v.number}</strong>
                          <small>Fichier d&apos;origine en qualité complète</small>
                        </div>
                        <a className={s.textAction} href={dl(v.originalUrl)} download>
                          Télécharger ↓
                        </a>
                      </div>
                    ))
                : null}
              {ad.images.length === 0 && !(ad.visualMode === "SELF" && ad.versions.some((v) => v.author === "MERCHANT")) ? (
                <p className={s.note}>Aucun fichier reçu pour le moment.</p>
              ) : null}

              {/* ------------------------- Importer une nouvelle version ------------------------- */}
              {canPropose ? (
                <>
                  <hr className={s.rule} />
                  <section aria-label="Importer un bandeau" id="importer">
                    <div className={s.sectionTitle}>
                      <div>
                        <div className={s.eyebrow}>NOUVELLE VERSION</div>
                        <h2 className={s.h2}>Importer un bandeau Photoshop</h2>
                        <p className={s.sub}>Ajoutez le fichier terminé. Le recadrage reste facultatif s&apos;il est déjà carré.</p>
                      </div>
                    </div>
                    <label className={s.uploadZone} htmlFor="upload">
                      <span className={s.uploadIcon}>↥</span>
                      <strong>{draft ? "Remplacer le fichier" : "Déposez votre bandeau final"}</strong>
                      <small>PNG, JPG ou WebP · 10 Mo maximum · aperçu au format du bandeau public</small>
                      <span className={s.button}>Choisir un fichier</span>
                      <input
                        id="upload"
                        ref={fileInput}
                        className={s.srOnly}
                        type="file"
                        accept="image/png,image/jpeg,image/webp"
                        data-testid="import-file"
                        onChange={(e) => void onFileChosen(e.target.files?.[0] ?? null)}
                      />
                    </label>

                    {draft ? (
                      <div className={s.crop} data-testid="crop">
                        <header>
                          <b>{exact ? "Recadrage (facultatif)" : "Recadrage simple"}</b>
                          <small>
                            {draft.name} · {draft.width}×{draft.height}
                          </small>
                        </header>
                        <div className={s.cropLayout}>
                          <div className={s.cropPreview}>
                            {framePreview ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={framePreview}
                                alt="Aperçu du fichier qui sera enregistré"
                                onClick={() => openImage(needsFrame && draftImg.current ? renderFrame(draftImg.current, OUTPUT_PX, zoom, horizontal, vertical) : draft.dataUrl)}
                              />
                            ) : null}
                          </div>
                          <div className={s.cropControls}>
                            <label>
                              Zoom
                              <input type="range" min={100} max={180} value={zoom} onChange={(e) => setZoom(Number(e.target.value))} data-testid="zoom" />
                            </label>
                            <label>
                              Horizontal
                              <input type="range" min={0} max={100} value={horizontal} onChange={(e) => setHorizontal(Number(e.target.value))} />
                            </label>
                            <label>
                              Vertical
                              <input type="range" min={0} max={100} value={vertical} onChange={(e) => setVertical(Number(e.target.value))} />
                            </label>
                            <small>
                              {needsFrame
                                ? `Le fichier enregistré sera ce rendu carré ${OUTPUT_PX}×${OUTPUT_PX} ; l'original est conservé.`
                                : "Format exact : le fichier sera envoyé tel quel."}
                            </small>
                          </div>
                        </div>
                      </div>
                    ) : null}

                    <div className={s.uploadActions}>
                      <span>{draft ? "Nouvelle version prête à être proposée." : "Choisissez un fichier pour préparer une nouvelle proposition."}</span>
                      <button className={`${s.button} ${s.primary}`} type="button" disabled={!draft || busy} onClick={requestSend} data-testid="send-proposal">
                        Envoyer au commerçant →
                      </button>
                    </div>
                  </section>
                </>
              ) : null}

              <hr className={s.rule} />
              <div className={s.eyebrow}>HISTORIQUE DES VERSIONS</div>
              {ad.versions.length === 0 ? <p className={s.note}>Aucune version pour le moment.</p> : null}
              {ad.versions.map((v) => (
                <div key={v.id} className={s.versionRow} data-testid="version-row">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={v.url} alt={`Version ${v.number}`} onClick={() => openImage(v.url)} />
                  <div>
                    <strong>
                      Version {v.number} · {v.author === "FIDETO" ? "préparée par Fideto" : "fournie par le commerçant"}
                    </strong>
                    <small>
                      {VERSION_STATUS[v.status]} · {formatDateTime(v.createdAt)}
                      {v.comment ? ` · « ${v.comment} »` : ""}
                    </small>
                  </div>
                  <a className={s.textAction} href={dl(v.originalUrl)} download>
                    ↓
                  </a>
                </div>
              ))}
            </section>
          </div>

          {/* ------------------------------ colonne droite ------------------------------ */}
          <div className={s.right}>
            <section className={`${s.card} ${s.decision}`} aria-labelledby="decision-title" data-testid="decision">
              <div className={s.eyebrow}>PROCHAINE ACTION</div>
              {canDecide ? (
                <>
                  <h2 id="decision-title">Le visuel du commerçant attend votre décision</h2>
                  <p>Vous pouvez le valider tel quel, sans importer de nouvelle image, ou demander une correction.</p>
                  <div className={s.decisionStack}>
                    <button className={`${s.button} ${s.primary} ${s.full}`} type="button" disabled={busy} onClick={() => directDialog.current?.showModal()} data-testid="approve-as-is">
                      Valider le visuel tel quel
                    </button>
                    <button className={`${s.button} ${s.secondary} ${s.full}`} type="button" disabled={busy} onClick={() => openReason("visual")} data-testid="refuse-visual">
                      Demander une correction…
                    </button>
                  </div>
                  <div className={s.after}>Vous pouvez aussi préparer votre propre version avec le formulaire à gauche : elle sera envoyée au commerçant pour validation.</div>
                </>
              ) : awaiting ? (
                <>
                  <h2 id="decision-title">Le commerçant doit répondre</h2>
                  <p>{pending ? `Vous avez envoyé la version ${pending.number}. Sa réponse déterminera la suite de la campagne.` : "Une proposition est en attente de sa réponse."}</p>
                  <div className={s.waiting} data-testid="waiting">
                    <span>◷</span>
                    <div>
                      <b>En attente de sa décision</b>
                      <br />
                      Il peut accepter le bandeau ou demander des corrections. Rien n&apos;est validé à sa place.
                    </div>
                  </div>
                  {canPropose ? <div className={s.after}>Vous pouvez préparer une autre version avec le formulaire à gauche. Elle remplacera la proposition en cours après confirmation.</div> : null}
                </>
              ) : ad.status === "PENDING_REVIEW" ? (
                <>
                  <h2 id="decision-title">{lastMerchantRequest ? "Une nouvelle version est attendue" : "Fideto doit créer le bandeau"}</h2>
                  {lastMerchantRequest?.comment ? <div className={s.reasonBox}>Demande du commerçant : « {lastMerchantRequest.comment} »</div> : null}
                  <p>Téléchargez les images du commerçant, créez le bandeau dans Photoshop, puis importez-le pour l&apos;envoyer au commerçant.</p>
                  <a className={`${s.button} ${s.primary} ${s.full}`} href="#importer">
                    Importer le bandeau final ↓
                  </a>
                </>
              ) : ad.status === "NEEDS_CHANGES" ? (
                <>
                  <h2 id="decision-title">Le commerçant doit corriger son visuel</h2>
                  {ad.rejectionReason ? <div className={s.reasonBox}>Motif transmis : « {ad.rejectionReason} »</div> : null}
                  <div className={s.waiting}>
                    <span>◷</span>
                    <div>
                      <b>En attente de sa correction</b>
                      <br />
                      Il peut remplacer son fichier et le soumettre de nouveau.
                    </div>
                  </div>
                </>
              ) : ad.status === "APPROVED" ? (
                <>
                  <h2 id="decision-title">Visuel validé</h2>
                  <p>Le commerçant peut maintenant passer au paiement. Rien n&apos;est diffusé avant le paiement et les créneaux réservés.</p>
                  <div className={s.waiting}>
                    <span>€</span>
                    <div>
                      <b>En attente du paiement</b>
                      {final?.decidedAt ? (
                        <>
                          <br />
                          Validé par {final.decidedBy ? (people[final.decidedBy] ?? "—") : "—"} · {formatDateTime(final.decidedAt)}
                        </>
                      ) : null}
                    </div>
                  </div>
                </>
              ) : ad.status === "REJECTED" ? (
                <>
                  <h2 id="decision-title">Campagne refusée</h2>
                  {ad.rejectionReason ? <div className={s.reasonBox}>Motif transmis : « {ad.rejectionReason} »</div> : null}
                </>
              ) : (
                <>
                  <h2 id="decision-title">{nextAction?.title ?? STATUS_LABELS[ad.status]}</h2>
                  <p>{nextAction?.detail}</p>
                </>
              )}
            </section>

            <section className={`${s.card} ${s.pad} ${s.details}`}>
              <div className={s.eyebrow}>PLANIFICATION</div>
              <h2>Créneaux et paiement</h2>
              {ad.hourlySchedule && pricing ? (
                <>
                  <div className={s.row}>
                    <span>Date{ad.hourlySchedule.length > 1 ? "s" : ""}</span>
                    <b>
                      {ad.hourlySchedule.length === 1
                        ? formatDay(ad.hourlySchedule[0].date)
                        : `${formatDay(ad.hourlySchedule[0].date)} → ${formatDay(ad.hourlySchedule[ad.hourlySchedule.length - 1].date)}`}
                    </b>
                  </div>
                  <div className={s.row}>
                    <span>Exposition</span>
                    <b>
                      {pricing.totalHours} heure{pricing.totalHours > 1 ? "s" : ""} sur {pricing.totalDays} jour{pricing.totalDays > 1 ? "s" : ""}
                    </b>
                  </div>
                  <div className={s.row}>
                    <span>Tarif prévu</span>
                    <b>{formatCents(pricing.totalCents)}</b>
                  </div>
                </>
              ) : (
                <div className={s.row}>
                  <span>Période (ancien tarif au jour)</span>
                  <b>
                    {formatDateTime(ad.startDate)} → {formatDateTime(ad.endDate)}
                  </b>
                </div>
              )}
              <div className={s.row}>
                <span>Financement</span>
                <b>
                  {ad.campaign?.payment?.status === "PAID"
                    ? `Payé · ${formatCents(ad.campaign.payment.amountCents)}${ad.campaign.payment.mode === "TEST" ? " (test)" : ""}`
                    : ad.campaign?.quotaConsumedAt
                      ? "Couvert par quota"
                      : ad.campaign?.payment
                        ? "Paiement en attente"
                        : "Pas encore confirmé par le commerçant"}
                </b>
              </div>
              {ad.hourlySchedule?.map((day) => (
                <div key={day.date} className={s.schedule}>
                  <strong style={{ textTransform: "capitalize" }}>{formatDay(day.date)}</strong>
                  <small>{hourRanges(day.hours)} · heure de Paris</small>
                  <div className={s.hours} aria-hidden="true">
                    {Array.from({ length: 24 }, (_, h) => (
                      <span key={h} className={day.hours.includes(h) ? s.on : ""} />
                    ))}
                  </div>
                </div>
              ))}
              <p className={s.note}>Le visuel sera diffusé uniquement après les accords requis et selon les créneaux réservés.</p>
            </section>

            <section className={`${s.card} ${s.pad} ${s.details}`} data-testid="delivery">
              <div className={s.eyebrow}>DIFFUSION AUX CLIENTS</div>
              <h2>{delivery?.simulated ? "Campagne de test — simulée" : delivery?.deliverable ? "Diffusable maintenant" : "Pas diffusée pour le moment"}</h2>
              {delivery?.simulated ? (
                <div className={s.reasonBox} data-testid="simulated-banner">
                  Cette campagne a été payée en <b>mode test</b> : elle reste simulée et n&apos;est <b>jamais affichée aux vrais clients</b>.
                </div>
              ) : null}
              {delivery ? (
                <>
                  {delivery.checks.map((check) => (
                    <div key={check.key} className={s.row}>
                      <span>
                        {check.ok ? "✓" : "✗"} {check.label}
                      </span>
                      <b style={{ fontWeight: 500, color: check.ok ? "#b6ddc6" : "#f0a8b8" }}>{check.detail}</b>
                    </div>
                  ))}
                  <p className={s.note}>
                    Un client ne voit la campagne que si, en plus, la règle de fréquence l&apos;autorise (1 bandeau max. toutes les 30 min, tirage occasionnel).
                  </p>
                </>
              ) : (
                <p className={s.note}>Diagnostic indisponible.</p>
              )}
            </section>

            <section className={`${s.card} ${s.pad} ${s.details}`}>
              <div className={s.eyebrow}>CONTENU DE LA DEMANDE</div>
              <h2>Informations fournies</h2>
              <div className={s.row}>
                <span>Texte saisi</span>
                <b>« {ad.requestedText} »</b>
              </div>
              <div className={s.row}>
                <span>Libellé du bouton</span>
                <b>{ad.ctaLabel ?? "Non renseigné"}</b>
              </div>
              <div className={s.row}>
                <span>Lien</span>
                <b>{ad.ctaUrl ?? "Non renseigné"}</b>
              </div>
              {ad.objective ? (
                <div className={s.row}>
                  <span>Objectif</span>
                  <b>{ad.objective}</b>
                </div>
              ) : null}
              <p className={s.note}>Le texte éventuel du bandeau final est ajouté dans Photoshop. Aucun éditeur de texte n&apos;est nécessaire ici.</p>
            </section>

            <section className={`${s.card} ${s.pad} ${s.details}`}>
              <div className={s.eyebrow}>ADMINISTRATION</div>
              <h2>Actions exceptionnelles</h2>
              <p className={s.sub}>Une campagne entière se refuse uniquement si le problème dépasse le visuel.</p>
              <div style={{ marginTop: 14, display: "flex", flexWrap: "wrap", gap: 12 }}>
                {["PENDING_REVIEW", "NEEDS_CHANGES", "AWAITING_MERCHANT", "APPROVED"].includes(ad.status) ? (
                  <button className={s.dangerLink} type="button" disabled={busy} onClick={() => openReason("campaign")} data-testid="refuse-campaign">
                    Refuser la campagne entière…
                  </button>
                ) : null}
                {["SCHEDULED", "LIVE"].includes(ad.status) ? (
                  <button className={s.dangerLink} type="button" disabled={busy} onClick={() => openReason("suspend")}>
                    Suspendre…
                  </button>
                ) : null}
                {ad.status === "SUSPENDED" ? (
                  <button className={s.textAction} type="button" disabled={busy} onClick={() => void run(() => patch({ action: "resume" }), "Mise en avant relancée.")}>
                    Relancer
                  </button>
                ) : null}
                {["SCHEDULED", "LIVE", "SUSPENDED"].includes(ad.status) ? (
                  <button className={s.dangerLink} type="button" disabled={busy} onClick={() => openReason("stop")}>
                    Arrêter définitivement…
                  </button>
                ) : null}
                {!["PENDING_REVIEW", "NEEDS_CHANGES", "AWAITING_MERCHANT", "APPROVED", "SCHEDULED", "LIVE", "SUSPENDED"].includes(ad.status) ? (
                  <span className={s.note}>Aucune action exceptionnelle disponible pour ce statut.</span>
                ) : null}
              </div>
            </section>
          </div>
        </div>

        <div className={s.bottomGrid}>
          <section className={`${s.card} ${s.pad} ${s.details}`} data-testid="history">
            <div className={s.eyebrow}>SUIVI</div>
            <h2>Historique de la campagne</h2>
            {events.map((e) => (
              <div key={e.key} className={s.log}>
                <i>{e.icon}</i>
                <div>
                  <strong>{e.title}</strong>
                  <small>
                    {formatDateTime(e.at)}
                    {e.sub ? ` · ${e.sub}` : ""}
                  </small>
                </div>
              </div>
            ))}
          </section>
          <section className={`${s.card} ${s.pad} ${s.details}`} data-testid="stats">
            <div className={s.eyebrow}>DIFFUSION</div>
            <h2>Statistiques réelles</h2>
            <div className={s.dataGrid}>
              <div>
                <strong>{stats?.totalImpressions ?? 0}</strong>
                <span>Impressions</span>
              </div>
              <div>
                <strong>{stats?.totalClicks ?? 0}</strong>
                <span>Clics</span>
              </div>
              <div>
                <strong>{stats?.ctr !== null && stats?.ctr !== undefined ? `${stats.ctr.toFixed(1)} %` : "—"}</strong>
                <span>Taux de clic</span>
              </div>
            </div>
            {stats?.byPlacement?.length ? (
              <div className={s.placements} data-testid="stats-by-placement">
                {stats.byPlacement.map((p) => (
                  <div key={p.placement}>
                    <span>{PLACEMENT_LABELS[p.placement] ?? p.placement}</span>
                    <b>
                      {p.impressions} impr. · {p.clicks} clics
                    </b>
                  </div>
                ))}
              </div>
            ) : null}
            <p className={s.note}>La proposition et les aperçus ne sont pas comptés comme des affichages.</p>
          </section>
        </div>
      </div>

      {/* ------------------------------ boîtes de dialogue ------------------------------ */}
      <dialog ref={directDialog} className={s.modal} data-testid="direct-dialog">
        <div className={s.modalInner}>
          <h2>Valider le visuel tel quel ?</h2>
          <p>
            Le bandeau fourni par le commerçant sera approuvé sans modification. Il sera prévenu et pourra passer au paiement. Aucun paiement n&apos;est encaissé et rien n&apos;est diffusé avant le paiement et les créneaux réservés.
          </p>
          <div className={s.modalActions}>
            <button className={`${s.button} ${s.secondary}`} type="button" onClick={() => directDialog.current?.close()}>
              Annuler
            </button>
            <button className={`${s.button} ${s.primary}`} type="button" disabled={busy} onClick={() => void approveAsIs()} data-testid="confirm-approve">
              Valider le visuel
            </button>
          </div>
        </div>
      </dialog>

      <dialog ref={replaceDialog} className={s.modal}>
        <div className={s.modalInner}>
          <h2>Remplacer la proposition en cours ?</h2>
          <p>Le commerçant a déjà reçu la version {pendingProposal?.number}. Elle sera remplacée par cette nouvelle version, qui lui sera envoyée pour validation.</p>
          <div className={s.modalActions}>
            <button className={`${s.button} ${s.secondary}`} type="button" onClick={() => replaceDialog.current?.close()}>
              Annuler
            </button>
            <button className={`${s.button} ${s.primary}`} type="button" disabled={busy} onClick={() => void sendProposal()} data-testid="confirm-replace">
              Remplacer et envoyer
            </button>
          </div>
        </div>
      </dialog>

      <dialog ref={reasonDialog} className={s.modal} data-testid="reason-dialog">
        <div className={s.modalInner}>
          <h2>{REASON_DIALOGS[reasonKind].title}</h2>
          <p>{REASON_DIALOGS[reasonKind].text}</p>
          <label htmlFor="reason">{REASON_DIALOGS[reasonKind].label}</label>
          <textarea id="reason" value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Expliquez la décision au commerçant…" maxLength={500} />
          <div className={s.modalActions}>
            <button className={`${s.button} ${s.secondary}`} type="button" onClick={() => reasonDialog.current?.close()}>
              Annuler
            </button>
            <button className={s.button} type="button" disabled={busy} onClick={() => void confirmReason()} data-testid="confirm-reason">
              {REASON_DIALOGS[reasonKind].confirm}
            </button>
          </div>
        </div>
      </dialog>

      <dialog ref={imageDialog} className={s.modal} data-testid="image-dialog" onClick={(e) => e.target === imageDialog.current && imageDialog.current?.close()}>
        <div className={s.modalInner}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center" }}>
            <h2>Aperçu</h2>
            <button className={`${s.button} ${s.secondary}`} type="button" onClick={() => imageDialog.current?.close()}>
              Fermer
            </button>
          </div>
          {bigImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img className={s.bigImage} src={bigImage} alt="Image en grand" />
          ) : null}
        </div>
      </dialog>

      {toast ? (
        <div className={`${s.toast} ${toast.error ? s.toastError : ""}`} role="status" aria-live="polite" data-testid="toast">
          {toast.msg}
        </div>
      ) : null}
    </SuperAdminShell>
  );
}
