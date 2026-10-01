"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui";
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

type Detail = {
  id: string;
  status: AdStatus;
  visualMode: "SELF" | "FIDETO" | null;
  visualBrief: string | null;
  requestedText: string;
  ctaLabel: string | null;
  finalImageUrl: string | null;
  rejectionReason: string | null;
  campaign: { id: string; title: string; payment: { status: string; amountCents: number } | null } | null;
  images: { id: string; url: string }[];
  versions: VisualVersion[];
};
type HistoryRow = { id: string; message: string; createdAt: string };
type PaymentPreview = { requiresPayment: boolean; priceCents: number; days: number; description: string };

const STATUS_LABELS: Record<AdStatus, string> = {
  DRAFT: "Brouillon",
  PENDING_REVIEW: "En cours d'examen par Fideto",
  AWAITING_MERCHANT: "Proposition de Fideto — à vous de répondre",
  NEEDS_CHANGES: "Visuel refusé — à corriger",
  APPROVED: "Visuel validé — à payer",
  REJECTED: "Campagne refusée",
  SCHEDULED: "Programmée",
  LIVE: "En cours de diffusion",
  SUSPENDED: "Suspendue par Fideto",
  ENDED: "Terminée",
  STOPPED: "Arrêtée par Fideto",
  CANCELLED: "Annulée",
};

const MAX_SOURCES = 5;

function euros(cents: number) {
  return (cents / 100).toLocaleString("fr-FR", { style: "currency", currency: "EUR" });
}

async function api(url: string, init?: RequestInit) {
  const res = await fetch(url, init);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error((data as { error?: string }).error ?? "Action impossible.");
  return data as Record<string, unknown>;
}

const post = (url: string, body: unknown) =>
  api(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });

export function MerchantCampaignFiche({ adId, paid, cancelled }: { adId: string; paid: boolean; cancelled: boolean }) {
  const [ad, setAd] = useState<Detail | null>(null);
  const [history, setHistory] = useState<HistoryRow[]>([]);
  const [nextAction, setNextAction] = useState<NextActionInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(paid ? "Paiement reçu : votre campagne sera programmée dès confirmation." : cancelled ? "Paiement annulé : vous pouvez le relancer ci-dessous." : null);
  const [busy, setBusy] = useState(false);

  // Réponse à une proposition
  const [changeComment, setChangeComment] = useState("");
  const [showChange, setShowChange] = useState(false);
  // Remplacement du visuel (après refus)
  const [pendingFile, setPendingFile] = useState<{ dataUrl: string } | null>(null);
  const [draft, setDraft] = useState<{ url: string; originalUrl: string; previewUrl: string } | null>(null);
  const [sources, setSources] = useState<{ url: string }[]>([]);
  const [brief, setBrief] = useState("");
  // Paiement
  const [pricing, setPricing] = useState<PaymentPreview | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);

  const load = useCallback(async () => {
    try {
      const data = (await api(`/api/merchant/visuels/${adId}`, { cache: "no-store" })) as unknown as {
        adRequest: Detail;
        history: HistoryRow[];
        nextAction: NextActionInfo;
      };
      setAd(data.adRequest);
      setHistory(data.history);
      setNextAction(data.nextAction);
      setSources(data.adRequest.images.map((i) => ({ url: i.url })));
      setBrief(data.adRequest.visualBrief ?? "");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Chargement impossible.");
    } finally {
      setLoading(false);
    }
  }, [adId]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    if (ad?.status !== "APPROVED") return;
    api(`/api/merchant/visuels/${adId}/paiement`)
      .then((d) => setPricing(d as unknown as PaymentPreview))
      .catch((e) => setError(e instanceof Error ? e.message : "Prix indisponible."));
  }, [ad?.status, adId]);

  async function run(task: () => Promise<void>, done: string | null) {
    setBusy(true);
    setError(null);
    setNotice(null);
    try {
      await task();
      if (done) setNotice(done);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur.");
    } finally {
      setBusy(false);
    }
  }

  const accept = () => run(() => post(`/api/merchant/visuels/${adId}/reponse`, { action: "accept" }).then(() => undefined), "Version acceptée.");
  const requestChanges = () =>
    run(async () => {
      await post(`/api/merchant/visuels/${adId}/reponse`, { action: "request_changes", comment: changeComment });
      setChangeComment("");
      setShowChange(false);
    }, "Votre demande de modification a été envoyée à Fideto.");

  async function onFile(file: File | null) {
    if (!file) return;
    setError(null);
    setDraft(null);
    setPendingFile(null);
    setBusy(true);
    try {
      if (file.size > 10 * 1024 * 1024) throw new Error("Image trop lourde (10 Mo maximum).");
      const dataUrl = await readFileAsDataUrl(file);
      const img = await loadImageElement(dataUrl);
      if (isExactBanner(img.naturalWidth, img.naturalHeight)) {
        const staged = await post("/api/merchant/visuels/televerser", { dataUrl, kind: "banniere" });
        setDraft({ url: staged.url as string, originalUrl: staged.url as string, previewUrl: dataUrl });
      } else {
        setPendingFile({ dataUrl });
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Fichier invalide.");
    } finally {
      setBusy(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  async function onFramed(cropped: string) {
    if (!pendingFile) return;
    setBusy(true);
    try {
      const original = await post("/api/merchant/visuels/televerser", { dataUrl: pendingFile.dataUrl, kind: "original" });
      const display = await post("/api/merchant/visuels/televerser", { dataUrl: cropped, kind: "banniere" });
      setDraft({ url: display.url as string, originalUrl: original.url as string, previewUrl: cropped });
      setPendingFile(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Envoi impossible.");
    } finally {
      setBusy(false);
    }
  }

  async function addSources(files: FileList | null) {
    if (!files?.length) return;
    setBusy(true);
    setError(null);
    try {
      const next = [...sources];
      for (const file of Array.from(files).slice(0, MAX_SOURCES - sources.length)) {
        if (file.size > 10 * 1024 * 1024) throw new Error(`« ${file.name} » dépasse 10 Mo.`);
        const staged = await post("/api/merchant/visuels/televerser", { dataUrl: await readFileAsDataUrl(file), kind: "source" });
        next.push({ url: staged.url as string });
      }
      setSources(next);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Envoi impossible.");
    } finally {
      setBusy(false);
    }
  }

  const resubmitSelf = () =>
    run(async () => {
      if (!draft) throw new Error("Ajoutez votre nouveau bandeau avant de soumettre.");
      await post(`/api/merchant/visuels/${adId}/soumettre`, { displayUrl: draft.url, originalUrl: draft.originalUrl });
      setDraft(null);
    }, "Bandeau re-soumis : Fideto va l'examiner.");

  const resubmitFideto = () =>
    run(async () => {
      await post(`/api/merchant/visuels/${adId}/soumettre`, { sourceUrls: sources.map((s) => s.url), brief: brief.trim() || null });
    }, "Images envoyées : Fideto reprend la création.");

  const pay = () =>
    run(async () => {
      const data = await post(`/api/merchant/visuels/${adId}/paiement`, {});
      if (typeof data.checkoutUrl === "string") {
        window.location.href = data.checkoutUrl;
        return;
      }
    }, "Votre campagne est programmée.");

  if (loading) return <div className="metric-card h-24 animate-pulse" />;
  if (!ad) return <p className="text-sm text-[var(--danger)]">{error ?? "Campagne introuvable."}</p>;

  const proposed = ad.versions.find((v) => v.status === "PROPOSED") ?? null;
  const awaitingMyAnswer = Boolean(proposed);
  const canReplace = ad.status === "NEEDS_CHANGES" || ad.status === "DRAFT";
  const latestRefusal = ad.versions.find((v) => v.status === "CHANGES_REQUESTED" && v.author === "MERCHANT") ?? null;
  const current = ad.finalImageUrl;
  const merchantName = "Votre commerce";

  return (
    <div className="space-y-5" data-testid="merchant-fiche">
      {error ? <p className="rounded-xl border border-[var(--danger)] p-3 text-sm text-[var(--danger)]">{error}</p> : null}
      {notice ? <p className="glass-panel p-3 text-sm text-[var(--ink)]">{notice}</p> : null}

      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-bold text-[var(--ink)]">{ad.campaign?.title ?? "Mise en avant"}</p>
        <span className="campaign-status-pill campaign-status-pill-scheduled" data-testid="fiche-status">
          {STATUS_LABELS[ad.status]}
        </span>
      </div>

      {nextAction ? <NextActionBanner action={nextAction} /> : null}

      {/* Proposition de Fideto : accepter ou demander une modification */}
      {awaitingMyAnswer && proposed ? (
        <section className="glass-panel space-y-3 p-4" aria-label="Proposition de Fideto" data-testid="proposal">
          <p className="text-sm font-black text-[var(--ink)]">Version {proposed.number} proposée par Fideto</p>
          <div className="flex flex-wrap items-start gap-4">
            <ImageThumb src={proposed.url} label={`Bandeau proposé, version ${proposed.number}`} size={160} />
            <RealBannerPreview imageUrl={proposed.url} merchantName={merchantName} text={ad.requestedText} ctaLabel={ad.ctaLabel} />
          </div>
          <p className="text-xs text-[var(--muted)]">Cliquez sur l&apos;image pour l&apos;ouvrir en grand. Seule la version que vous acceptez sera diffusée.</p>
          {showChange ? (
            <div className="space-y-2">
              <label className="block text-xs text-[var(--muted)]">
                Que souhaitez-vous modifier ?
                <textarea className="profile-select mt-1 w-full" rows={3} value={changeComment} onChange={(e) => setChangeComment(e.target.value)} maxLength={500} />
              </label>
              <div className="flex gap-2">
                <Button disabled={busy || changeComment.trim().length < 3} onClick={() => void requestChanges()} data-testid="send-change-request">
                  Envoyer ma demande
                </Button>
                <Button variant="secondary" onClick={() => setShowChange(false)}>
                  Annuler
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              <Button disabled={busy} onClick={() => void accept()} data-testid="accept-proposal">
                Accepter cette version
              </Button>
              <Button variant="secondary" disabled={busy} onClick={() => setShowChange(true)} data-testid="ask-change">
                Demander une modification
              </Button>
            </div>
          )}
        </section>
      ) : null}

      {/* Visuel refusé : motif + remplacement */}
      {canReplace ? (
        <section className="glass-panel space-y-3 p-4" aria-label="Corriger le visuel" data-testid="replace-visual">
          {ad.rejectionReason ? (
            <p className="rounded-xl border border-[var(--danger)] p-3 text-sm text-[var(--ink)]">
              <span className="font-black text-[var(--danger)]">Motif du refus : </span>
              {ad.rejectionReason}
            </p>
          ) : null}
          {ad.visualMode === "SELF" ? (
            <>
              <p className="text-sm font-black text-[var(--ink)]">Remplacer mon bandeau</p>
              {latestRefusal ? (
                <div className="flex items-center gap-3 text-xs text-[var(--muted)]">
                  <ImageThumb src={latestRefusal.url} label="Bandeau refusé" size={56} /> Version refusée (conservée dans l&apos;historique)
                </div>
              ) : null}
              <Button variant="secondary" disabled={busy} onClick={() => fileRef.current?.click()}>
                {draft || pendingFile ? "Choisir un autre fichier" : "Importer un nouveau bandeau"}
              </Button>
              <input ref={fileRef} type="file" accept="image/png,image/jpeg,image/webp" className="hidden" data-testid="replace-file" onChange={(e) => void onFile(e.target.files?.[0] ?? null)} />
              {pendingFile ? <FramingTool src={pendingFile.dataUrl} onExport={(d) => void onFramed(d)} onCancel={() => setPendingFile(null)} /> : null}
              {draft ? (
                <div className="space-y-3">
                  <RealBannerPreview imageUrl={draft.previewUrl} merchantName={merchantName} text={ad.requestedText} ctaLabel={ad.ctaLabel} />
                  <Button disabled={busy} onClick={() => void resubmitSelf()} data-testid="resubmit">
                    Soumettre de nouveau
                  </Button>
                </div>
              ) : null}
            </>
          ) : (
            <>
              <p className="text-sm font-black text-[var(--ink)]">Mes images sources</p>
              <div className="sponsor-files">
                {sources.map((s) => (
                  <div key={s.url} className="sponsor-file">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={s.url} alt="" />
                    <button type="button" aria-label="Retirer cette image" onClick={() => setSources((prev) => prev.filter((x) => x.url !== s.url))}>
                      ×
                    </button>
                  </div>
                ))}
              </div>
              <label className="sponsor-dropzone">
                <b>Ajouter ou remplacer des images</b>
                <small>Jusqu&apos;à {MAX_SOURCES} images · PNG, JPG ou WebP · 10 Mo max</small>
                <input type="file" accept="image/png,image/jpeg,image/webp" multiple disabled={sources.length >= MAX_SOURCES || busy} className="sr-only" onChange={(e) => void addSources(e.target.files)} />
              </label>
              <label className="block text-xs text-[var(--muted)]">
                Ce que vous souhaitez (facultatif)
                <textarea className="profile-select mt-1 w-full" rows={2} value={brief} onChange={(e) => setBrief(e.target.value)} maxLength={500} />
              </label>
              <Button disabled={busy || sources.length === 0} onClick={() => void resubmitFideto()} data-testid="resubmit">
                Soumettre de nouveau
              </Button>
            </>
          )}
        </section>
      ) : null}

      {/* Paiement */}
      {ad.status === "APPROVED" ? (
        <section className="glass-panel space-y-3 p-4" aria-label="Paiement" data-testid="payment-panel">
          <p className="text-sm font-black text-[var(--ink)]">Votre visuel est validé — étape suivante : le paiement</p>
          {pricing ? (
            <>
              <p className="text-sm text-[var(--muted-strong)]">{pricing.description}</p>
              <p className="text-sm font-black text-[var(--ink)]">
                {pricing.requiresPayment ? euros(pricing.priceCents) : "0 € — couvert par votre quota"}
              </p>
              <Button disabled={busy} onClick={() => void pay()} data-testid="pay">
                {pricing.requiresPayment ? `Confirmer et payer ${euros(pricing.priceCents)}` : "Confirmer"}
              </Button>
              <p className="text-xs text-[var(--muted)]">La diffusion n&apos;a lieu que pendant vos créneaux, une fois le paiement confirmé.</p>
            </>
          ) : (
            <p className="text-sm text-[var(--muted)]">Calcul du prix…</p>
          )}
        </section>
      ) : null}

      {/* Visuel diffusé / final */}
      {current ? (
        <section className="glass-panel space-y-2 p-4" aria-label="Version finale">
          <p className="text-sm font-black text-[var(--ink)]">Version finale validée</p>
          <div className="flex flex-wrap items-start gap-4">
            <ImageThumb src={current} label="Version finale" size={96} />
            <RealBannerPreview imageUrl={current} merchantName={merchantName} text={ad.requestedText} ctaLabel={ad.ctaLabel} />
          </div>
        </section>
      ) : null}

      {ad.visualMode !== "SELF" && ad.images.length > 0 && !canReplace ? (
        <section className="glass-panel space-y-2 p-4" aria-label="Mes images">
          <p className="text-sm font-black text-[var(--ink)]">Images envoyées à Fideto</p>
          <div className="flex flex-wrap gap-2">
            {ad.images.map((img, i) => (
              <ImageThumb key={img.id} src={img.url} label={`Image ${i + 1}`} size={64} />
            ))}
          </div>
          {ad.visualBrief ? <p className="text-xs text-[var(--muted)]">Votre indication : « {ad.visualBrief} »</p> : null}
        </section>
      ) : null}

      <section className="glass-panel space-y-3 p-4" aria-label="Historique des versions">
        <p className="text-sm font-black text-[var(--ink)]">Versions du visuel</p>
        <VersionHistory versions={ad.versions} />
      </section>

      <section className="glass-panel space-y-2 p-4" aria-label="Historique" data-testid="fiche-history">
        <p className="text-sm font-black text-[var(--ink)]">Historique</p>
        {history.length === 0 ? (
          <p className="text-sm text-[var(--muted)]">Rien pour le moment.</p>
        ) : (
          history.map((row) => (
            <p key={row.id} className="text-xs text-[var(--muted)]">
              <span className="font-bold text-[var(--ink)]">{row.message}</span> — {formatDateTime(row.createdAt)}
            </p>
          ))
        )}
      </section>
    </div>
  );
}
