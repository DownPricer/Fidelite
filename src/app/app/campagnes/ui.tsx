"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui";

type Channel = "IN_APP_PUSH" | "EMAIL";
type Audience = "MERCHANT_MEMBERS" | "NETWORK_LOCAL";
type AdStatus = "DRAFT" | "PENDING_REVIEW" | "APPROVED" | "REJECTED" | "SCHEDULED" | "LIVE" | "ENDED" | "CANCELLED";

type Quota = { kind: string; limit: number; used: number; remaining: number };

type CampaignSummary = {
  id: string;
  channel: Channel | "SPONSORED_AD";
  audienceType: Audience | null;
  status: string;
  statusLabel: string;
  title: string;
  body: string;
  imageUrl: string | null;
  actionLabel: string | null;
  actionUrl: string | null;
  scheduledAt: string | null;
  sentAt?: string | null;
  estimatedRecipients: number | null;
  priceCents: number | null;
  requiresPayment: boolean;
  rejectionReason: string | null;
  payment?: { status: string; amountCents: number } | null;
  adStatus?: AdStatus | null;
  createdAt: string;
};

type Dashboard = { plan: string; period: string; quotas: Quota[]; campaigns: CampaignSummary[] };

type AdRequest = {
  id: string;
  campaignId: string | null;
  status: AdStatus;
  requestedText: string;
  requestedImageUrl: string | null;
  finalImageUrl: string | null;
  startDate: string;
  endDate: string;
};

const CHANNEL_LABELS: Record<Channel, string> = {
  IN_APP_PUSH: "Notification dans l'application",
  EMAIL: "E-mail",
};

const AUDIENCE_LABELS: Record<Audience, string> = {
  MERCHANT_MEMBERS: "Mes membres",
  NETWORK_LOCAL: "Clients Fidelo de mon secteur",
};

const QUOTA_LABELS: Record<string, string> = {
  MEMBER_NOTIFICATION: "Notifications restantes",
  MEMBER_EMAIL: "E-mails restants",
  SPONSORED_DAY: "Jours de mise en avant",
};

const AD_STATUS_LABELS: Record<AdStatus, string> = {
  DRAFT: "Brouillon",
  PENDING_REVIEW: "En préparation par Fidelo",
  APPROVED: "Visuel prêt — à valider",
  REJECTED: "Refusée",
  SCHEDULED: "Programmée",
  LIVE: "En cours de diffusion",
  ENDED: "Terminée",
  CANCELLED: "Annulée",
};

function formatCents(cents: number) {
  return (cents / 100).toLocaleString("fr-FR", { style: "currency", currency: "EUR" });
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" });
}

const DEMO_DASHBOARD: Dashboard = {
  plan: "insight",
  period: "2026-09",
  quotas: [
    { kind: "MEMBER_NOTIFICATION", limit: 3, used: 1, remaining: 2 },
    { kind: "MEMBER_EMAIL", limit: 3, used: 0, remaining: 3 },
    { kind: "SPONSORED_DAY", limit: 3, used: 0, remaining: 3 },
  ],
  campaigns: [
    {
      id: "demo-1",
      channel: "EMAIL",
      audienceType: "MERCHANT_MEMBERS",
      status: "SENT",
      statusLabel: "Envoyée",
      title: "Offre de rentrée",
      body: "-15% sur votre prochaine visite.",
      imageUrl: null,
      actionLabel: null,
      actionUrl: null,
      scheduledAt: null,
      estimatedRecipients: 84,
      priceCents: 0,
      requiresPayment: false,
      rejectionReason: null,
      createdAt: new Date().toISOString(),
    },
  ],
};

export function CampagnesPanel({ demo = false }: { demo?: boolean }) {
  const [dashboard, setDashboard] = useState<Dashboard | null>(demo ? DEMO_DASHBOARD : null);
  const [ads, setAds] = useState<AdRequest[]>([]);
  const [loading, setLoading] = useState(!demo);
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState<"announcement" | "sponsor" | null>(null);

  const load = useCallback(async () => {
    if (demo) return;
    setLoading(true);
    setError(null);
    try {
      const [dashRes, adsRes] = await Promise.all([
        fetch("/api/merchant/campaigns"),
        fetch("/api/merchant/ads"),
      ]);
      if (!dashRes.ok) throw new Error();
      const data = (await dashRes.json()) as Dashboard;
      setDashboard(data);
      if (adsRes.ok) {
        const adData = (await adsRes.json()) as { ads: AdRequest[] };
        setAds(adData.ads ?? []);
      }
    } catch {
      setError("Impossible de charger vos campagnes. Réessayez.");
    } finally {
      setLoading(false);
    }
  }, [demo]);

  useEffect(() => {
    void load();
  }, [load]);

  async function cancelCampaign(id: string) {
    if (demo) return;
    await fetch(`/api/merchant/campaigns/${id}`, { method: "DELETE" }).catch(() => {});
    void load();
  }

  async function duplicateCampaign(id: string) {
    if (demo) return;
    await fetch(`/api/merchant/campaigns/${id}/duplicate`, { method: "POST" }).catch(() => {});
    void load();
  }

  async function confirmSponsor(adRequestId: string) {
    if (demo) return;
    setError(null);
    try {
      const response = await fetch(`/api/merchant/ads/${adRequestId}/confirm`, { method: "POST" });
      const data = (await response.json()) as { checkoutUrl?: string; error?: string };
      if (!response.ok) {
        setError(data.error ?? "Impossible de valider la mise en avant.");
        return;
      }
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
        return;
      }
      void load();
    } catch {
      setError("Impossible de valider la mise en avant. Réessayez.");
    }
  }

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="metric-card h-20 animate-pulse" />
        ))}
      </div>
    );
  }

  if (error && !dashboard) {
    return (
      <div className="glass-panel p-6 text-center">
        <p className="text-sm text-[var(--danger)]">{error}</p>
        <Button variant="secondary" className="mt-3" onClick={() => void load()}>
          Réessayer
        </Button>
      </div>
    );
  }

  if (!dashboard) return null;

  if (creating === "announcement") {
    return (
      <CampaignWizard
        demo={demo}
        onClose={() => setCreating(null)}
        onDone={() => {
          setCreating(null);
          void load();
        }}
      />
    );
  }

  if (creating === "sponsor") {
    return (
      <SponsorWizard
        demo={demo}
        onClose={() => setCreating(null)}
        onDone={() => {
          setCreating(null);
          void load();
        }}
      />
    );
  }

  const adsByCampaignId = new Map(ads.filter((a) => a.campaignId).map((a) => [a.campaignId as string, a]));

  return (
    <div className="space-y-6">
      <section aria-label="Quotas du mois">
        <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--violet-bright)]">
          Quotas — {dashboard.plan === "insight" ? "Fidelo Insight" : "Fidelo"} · {dashboard.period}
        </p>
        <div className="campaign-quota-grid">
          {dashboard.quotas.map((q) => (
            <div key={q.kind} className="metric-card p-3">
              <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted)]">
                {QUOTA_LABELS[q.kind] ?? q.kind}
              </p>
              <p className="mt-1 text-xl font-black text-[var(--ink)]">
                {q.remaining}/{q.limit}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="campaign-type-grid" aria-label="Créer une campagne">
        <article className="campaign-type-card">
          <div className="campaign-type-head">
            <span className="campaign-type-icon campaign-type-icon-blue">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 2L11 13" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M22 2l-7 20-4-9-9-4 20-7z" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <div>
              <h2 className="text-base font-black text-[var(--ink)]">Envoyer une annonce</h2>
              <p className="mt-1 text-sm text-[var(--muted-strong)]">
                Choisissez une notification dans l&apos;application ou un e-mail, puis sélectionnez votre audience.
              </p>
            </div>
          </div>
          <Button className="mt-4 w-full" onClick={() => setCreating("announcement")}>
            Créer une annonce
          </Button>
        </article>

        <article className="campaign-type-card">
          <div className="campaign-type-head">
            <span className="campaign-type-icon campaign-type-icon-orange">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="7" width="13" height="10" rx="2" />
                <path d="M16 10l5-3v10l-5-3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <div>
              <h2 className="text-base font-black text-[var(--ink)]">Mettre mon commerce en avant</h2>
              <p className="mt-1 text-sm text-[var(--muted-strong)]">
                Un bandeau discret « Sponsorisé » dans l&apos;application client, préparé par Fidelo puis validé par vous.
              </p>
            </div>
          </div>
          <p className="mt-3 text-xs text-[var(--muted)]">3 € / jour · 19 € les 7 jours</p>
          <Button className="mt-4 w-full" variant="secondary" onClick={() => setCreating("sponsor")}>
            Demander une mise en avant
          </Button>
        </article>
      </section>

      {error ? <p className="text-sm text-[var(--danger)]">{error}</p> : null}

      <section className="space-y-2" aria-label="Historique des campagnes">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--muted)]">Activité récente</p>
        {dashboard.campaigns.length === 0 ? (
          <p className="glass-panel p-8 text-center text-sm text-[var(--muted)]">
            Aucune campagne pour le moment. Créez-en une pour toucher vos clients.
          </p>
        ) : (
          dashboard.campaigns.map((c) => {
            const ad = c.channel === "SPONSORED_AD" ? adsByCampaignId.get(c.id) : undefined;
            const typeLabel =
              c.channel === "SPONSORED_AD" ? "Mise en avant" : CHANNEL_LABELS[c.channel as Channel];
            const audienceLabel =
              c.channel === "SPONSORED_AD"
                ? "Clients Fidelo de votre secteur"
                : c.audienceType
                  ? AUDIENCE_LABELS[c.audienceType]
                  : "—";
            const canConfirmSponsor = ad && ad.status === "APPROVED" && ad.finalImageUrl && c.status === "PENDING_REVIEW";
            return (
              <div key={c.id} className="glass-panel p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-wide text-[var(--muted)]">
                      {typeLabel} · {audienceLabel}
                    </p>
                    <p className="truncate text-sm font-bold text-[var(--ink)]">{c.title || "(Sans titre)"}</p>
                    <p className="mt-1 text-xs text-[var(--muted-strong)]">
                      {formatDate(c.createdAt)} · {c.statusLabel}
                      {ad ? ` · ${AD_STATUS_LABELS[ad.status]}` : ""}
                    </p>
                    {c.rejectionReason ? (
                      <p className="mt-1 text-xs text-[var(--danger)]">Motif : {c.rejectionReason}</p>
                    ) : null}
                    {c.estimatedRecipients !== null ? (
                      <p className="mt-1 text-[11px] text-[var(--muted)]">
                        {c.status === "SENT" || c.status === "PARTIALLY_SENT" ? "Envoyés" : "Destinataires estimés"} :{" "}
                        ~{c.estimatedRecipients}
                        {c.priceCents ? ` · ${formatCents(c.priceCents)}` : ""}
                      </p>
                    ) : null}
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-1">
                    {canConfirmSponsor ? (
                      <button
                        type="button"
                        onClick={() => void confirmSponsor(ad!.id)}
                        className="text-xs font-semibold text-[var(--violet-bright)]"
                      >
                        Valider le visuel
                      </button>
                    ) : null}
                    {["DRAFT", "PENDING_REVIEW", "PAYMENT_REQUIRED", "PAID", "SCHEDULED"].includes(c.status) &&
                    !canConfirmSponsor ? (
                      <button
                        type="button"
                        onClick={() => void cancelCampaign(c.id)}
                        className="text-xs font-semibold text-[var(--danger)]"
                      >
                        Annuler
                      </button>
                    ) : null}
                    {c.status !== "SENDING" && c.channel !== "SPONSORED_AD" ? (
                      <button
                        type="button"
                        onClick={() => void duplicateCampaign(c.id)}
                        className="text-xs font-semibold text-[var(--muted-strong)]"
                      >
                        Dupliquer
                      </button>
                    ) : null}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </section>
    </div>
  );
}

type WizardStep = "channel" | "content" | "review";

function CampaignWizard({ demo, onClose, onDone }: { demo: boolean; onClose: () => void; onDone: () => void }) {
  const [step, setStep] = useState<WizardStep>("channel");
  const [channel, setChannel] = useState<Channel>("IN_APP_PUSH");
  const [audience, setAudience] = useState<Audience>("MERCHANT_MEMBERS");
  const [campaignId, setCampaignId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [actionUrl, setActionUrl] = useState("");
  const [scheduledAt, setScheduledAt] = useState("");
  const [estimate, setEstimate] = useState<{ estimatedRecipients: number; priceCents: number; requiresPayment: boolean } | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function startWizard() {
    if (demo) {
      setCampaignId("demo-new");
      setStep("content");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const response = await fetch("/api/merchant/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ channel, audienceType: audience }),
      });
      if (!response.ok) throw new Error();
      const data = (await response.json()) as { campaign: { id: string } };
      setCampaignId(data.campaign.id);
      setStep("content");
    } catch {
      setError("Impossible de créer la campagne. Réessayez.");
    } finally {
      setBusy(false);
    }
  }

  async function saveAndEstimate() {
    if (!campaignId) return;
    if (demo) {
      setEstimate({ estimatedRecipients: 42, priceCents: 0, requiresPayment: false });
      setStep("review");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const patchResponse = await fetch(`/api/merchant/campaigns/${campaignId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          body,
          actionUrl: actionUrl.trim() || null,
          actionLabel: actionUrl.trim() ? "Voir" : null,
          scheduledAt: scheduledAt ? new Date(scheduledAt).toISOString() : null,
        }),
      });
      if (!patchResponse.ok) throw new Error();

      const estimateResponse = await fetch(`/api/merchant/campaigns/${campaignId}/estimate`);
      if (!estimateResponse.ok) throw new Error();
      const data = (await estimateResponse.json()) as {
        audience: { estimatedRecipients: number };
        pricing: { priceCents: number; requiresPayment: boolean };
      };
      setEstimate({
        estimatedRecipients: data.audience.estimatedRecipients,
        priceCents: data.pricing.priceCents,
        requiresPayment: data.pricing.requiresPayment,
      });
      setStep("review");
    } catch {
      setError("Impossible d'enregistrer le contenu. Vérifiez les champs et réessayez.");
    } finally {
      setBusy(false);
    }
  }

  async function confirmSend() {
    if (!campaignId) return;
    if (demo) {
      onDone();
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const response = await fetch(`/api/merchant/campaigns/${campaignId}/confirm`, { method: "POST" });
      const data = (await response.json()) as { checkoutUrl?: string; error?: string };
      if (!response.ok) {
        setError(data.error ?? "Impossible de confirmer la campagne.");
        return;
      }
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
        return;
      }
      onDone();
    } catch {
      setError("Impossible de confirmer la campagne. Réessayez.");
    } finally {
      setBusy(false);
    }
  }

  const steps: { key: WizardStep; label: string }[] = [
    { key: "channel", label: "Canal et audience" },
    { key: "content", label: "Contenu" },
    { key: "review", label: "Récapitulatif" },
  ];
  const stepIndex = steps.findIndex((s) => s.key === step);

  return (
    <div className="space-y-4">
      <button type="button" onClick={onClose} className="text-xs font-semibold text-[var(--muted)]">
        ← Retour aux campagnes
      </button>

      <ol className="campaign-wizard-steps">
        {steps.map((s, i) => (
          <li key={s.key} className={i <= stepIndex ? "is-active" : ""}>
            <span>{i + 1}</span>
            {s.label}
          </li>
        ))}
      </ol>

      {step === "channel" ? (
        <div className="glass-panel space-y-4 p-5">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-wide text-[var(--muted)]">
              Comment souhaitez-vous communiquer ?
            </p>
            <div className="grid grid-cols-2 gap-2">
              {(["IN_APP_PUSH", "EMAIL"] as Channel[]).map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setChannel(c)}
                  className={`merchant-filter-chip ${channel === c ? "merchant-filter-chip-active" : ""}`}
                >
                  {CHANNEL_LABELS[c]}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-wide text-[var(--muted)]">À qui l&apos;envoyer ?</p>
            <div className="grid grid-cols-1 gap-2">
              <button
                type="button"
                onClick={() => setAudience("MERCHANT_MEMBERS")}
                className={`merchant-filter-chip text-left ${audience === "MERCHANT_MEMBERS" ? "merchant-filter-chip-active" : ""}`}
              >
                Mes membres — clients possédant déjà votre carte
              </button>
              <button
                type="button"
                onClick={() => setAudience("NETWORK_LOCAL")}
                className={`merchant-filter-chip text-left ${audience === "NETWORK_LOCAL" ? "merchant-filter-chip-active" : ""}`}
              >
                Clients Fidelo de mon secteur — toujours payant, sous réserve de leur consentement
              </button>
            </div>
          </div>
          {error ? <p className="text-sm text-[var(--danger)]">{error}</p> : null}
          <Button className="w-full" onClick={() => void startWizard()} disabled={busy}>
            {busy ? "…" : "Continuer"}
          </Button>
        </div>
      ) : null}

      {step === "content" ? (
        <div className="glass-panel space-y-3 p-5">
          <label className="block text-xs text-[var(--muted)]">
            Titre
            <input
              className="profile-select mt-1 w-full"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={120}
            />
          </label>
          <label className="block text-xs text-[var(--muted)]">
            Message
            <textarea
              className="profile-select mt-1 w-full"
              rows={4}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              maxLength={2000}
            />
          </label>
          <label className="block text-xs text-[var(--muted)]">
            Lien du bouton (facultatif)
            <input
              className="profile-select mt-1 w-full"
              value={actionUrl}
              onChange={(e) => setActionUrl(e.target.value)}
              placeholder="https://…"
            />
          </label>
          <label className="block text-xs text-[var(--muted)]">
            Programmer pour (facultatif — sinon envoi dès confirmation)
            <input
              type="datetime-local"
              className="profile-select mt-1 w-full"
              value={scheduledAt}
              onChange={(e) => setScheduledAt(e.target.value)}
            />
          </label>
          <div className="rounded-xl border border-[var(--border)] bg-[var(--panel-bg)] p-3">
            <p className="text-[10px] font-bold uppercase tracking-wide text-[var(--muted)]">Aperçu réel</p>
            <p className="mt-1 text-sm font-bold text-[var(--ink)]">{title || "Titre de la campagne"}</p>
            <p className="text-xs text-[var(--muted-strong)]">{body || "Votre message apparaîtra ici."}</p>
          </div>
          {error ? <p className="text-sm text-[var(--danger)]">{error}</p> : null}
          <Button className="w-full" onClick={() => void saveAndEstimate()} disabled={busy || !title.trim() || !body.trim()}>
            {busy ? "…" : "Voir le récapitulatif"}
          </Button>
        </div>
      ) : null}

      {step === "review" && estimate ? (
        <div className="glass-panel space-y-3 p-5">
          <p className="text-sm text-[var(--muted-strong)]">
            Vous envoyez <strong className="text-[var(--ink)]">{CHANNEL_LABELS[channel]}</strong> à{" "}
            <strong className="text-[var(--ink)]">{AUDIENCE_LABELS[audience]}</strong>.
          </p>
          <p className="text-sm text-[var(--muted-strong)]">
            Destinataires estimés : <strong className="text-[var(--ink)]">{estimate.estimatedRecipients}</strong>
          </p>
          <p className="text-sm text-[var(--muted-strong)]">
            {estimate.requiresPayment
              ? `Paiement requis : ${formatCents(estimate.priceCents)}`
              : "Couverte par votre quota inclus — gratuit"}
          </p>
          <p className="text-xs text-[var(--muted)]">
            {scheduledAt ? `Envoi programmé pour le ${new Date(scheduledAt).toLocaleString("fr-FR")}.` : "Envoi dès confirmation."}
          </p>
          {error ? <p className="text-sm text-[var(--danger)]">{error}</p> : null}
          <Button className="w-full" onClick={() => void confirmSend()} disabled={busy}>
            {busy ? "…" : estimate.requiresPayment ? "Payer et confirmer" : "Confirmer l'envoi"}
          </Button>
        </div>
      ) : null}
    </div>
  );
}

function SponsorWizard({ demo, onClose, onDone }: { demo: boolean; onClose: () => void; onDone: () => void }) {
  const [days, setDays] = useState(7);
  const [objective, setObjective] = useState("");
  const [text, setText] = useState("");
  const [ctaUrl, setCtaUrl] = useState("");
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  function onFileChange(file: File | null) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setImageDataUrl(result);
      setImagePreview(result);
    };
    reader.readAsDataURL(file);
  }

  async function submit() {
    if (demo) {
      setDone(true);
      return;
    }
    setBusy(true);
    setError(null);
    try {
      let requestedImageUrl: string | null = null;
      if (imageDataUrl) {
        const mediaRes = await fetch("/api/merchant/campaigns/media", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ dataUrl: imageDataUrl }),
        });
        if (!mediaRes.ok) throw new Error("image");
        const mediaData = (await mediaRes.json()) as { url: string };
        requestedImageUrl = mediaData.url;
      }
      const start = new Date();
      const end = new Date(start.getTime() + days * 86_400_000);
      const response = await fetch("/api/merchant/ads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requestedText: text,
          requestedImageUrl,
          objective: objective.trim() || null,
          ctaUrl: ctaUrl.trim() || null,
          startDate: start.toISOString(),
          endDate: end.toISOString(),
        }),
      });
      if (!response.ok) throw new Error();
      setDone(true);
    } catch {
      setError("Impossible d'envoyer la demande. Vérifiez les champs (l'image doit être valide) et réessayez.");
    } finally {
      setBusy(false);
    }
  }

  const price = days <= 7 ? 1900 : 1900 + (days - 7) * 300;

  if (done) {
    return (
      <div className="space-y-4">
        <button type="button" onClick={onClose} className="text-xs font-semibold text-[var(--muted)]">
          ← Retour aux campagnes
        </button>
        <div className="glass-panel space-y-3 p-6 text-center">
          <p className="text-sm font-bold text-[var(--ink)]">Demande envoyée</p>
          <p className="text-sm text-[var(--muted-strong)]">
            Fidelo prépare votre visuel. Vous recevrez un aperçu à valider avant tout paiement — suivez son statut
            dans l&apos;historique des campagnes.
          </p>
          <Button className="w-full" onClick={onDone}>
            Terminer
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <button type="button" onClick={onClose} className="text-xs font-semibold text-[var(--muted)]">
        ← Retour aux campagnes
      </button>

      <div className="glass-panel space-y-4 p-5">
        <div className="rounded-xl border border-[var(--border)] bg-[var(--panel-bg)] p-3 text-xs text-[var(--muted-strong)]">
          Comment ça marche : vous envoyez votre demande → Fidelo prépare le visuel → vous recevez un aperçu → vous
          validez → vous payez → la campagne est programmée automatiquement → vous suivez affichages et clics.
        </div>

        <label className="block text-xs text-[var(--muted)]">
          Durée
          <select className="profile-select mt-1 w-full" value={days} onChange={(e) => setDays(Number(e.target.value))}>
            {[3, 7, 14, 21, 30].map((d) => (
              <option key={d} value={d}>
                {d} jours
              </option>
            ))}
          </select>
        </label>
        <p className="text-xs font-semibold text-[var(--violet-bright)]">Tarif estimé : {formatCents(price)}</p>

        <label className="block text-xs text-[var(--muted)]">
          Titre ou objectif (facultatif)
          <input
            className="profile-select mt-1 w-full"
            value={objective}
            onChange={(e) => setObjective(e.target.value)}
            maxLength={200}
            placeholder="Ex. Faire découvrir notre nouvelle carte"
          />
        </label>
        <label className="block text-xs text-[var(--muted)]">
          Texte du bandeau
          <textarea
            className="profile-select mt-1 w-full"
            rows={3}
            value={text}
            onChange={(e) => setText(e.target.value)}
            maxLength={1000}
          />
        </label>
        <label className="block text-xs text-[var(--muted)]">
          Image (facultatif — Fidelo peut l&apos;ajuster)
          <input
            type="file"
            accept="image/*"
            className="profile-select mt-1 w-full"
            onChange={(e) => onFileChange(e.target.files?.[0] ?? null)}
          />
        </label>
        {imagePreview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={imagePreview} alt="Aperçu" className="h-24 w-full rounded-lg object-cover" />
        ) : null}
        <label className="block text-xs text-[var(--muted)]">
          Lien ou commerce à ouvrir (facultatif)
          <input
            className="profile-select mt-1 w-full"
            value={ctaUrl}
            onChange={(e) => setCtaUrl(e.target.value)}
            placeholder="https://…"
          />
        </label>

        {error ? <p className="text-sm text-[var(--danger)]">{error}</p> : null}
        <Button className="w-full" variant="secondary" onClick={() => void submit()} disabled={busy || !text.trim()}>
          {busy ? "…" : "Envoyer ma demande"}
        </Button>
      </div>
    </div>
  );
}
