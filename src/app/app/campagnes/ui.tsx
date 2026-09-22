"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui";

type Channel = "IN_APP_PUSH" | "EMAIL";
type Audience = "MERCHANT_MEMBERS" | "NETWORK_LOCAL";

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
  estimatedRecipients: number | null;
  priceCents: number | null;
  requiresPayment: boolean;
  rejectionReason: string | null;
  createdAt: string;
};

type Dashboard = { plan: string; period: string; quotas: Quota[]; campaigns: CampaignSummary[] };

const CHANNEL_LABELS: Record<Channel, string> = {
  IN_APP_PUSH: "Message Fidelo + push",
  EMAIL: "E-mail",
};

const QUOTA_LABELS: Record<string, string> = {
  MEMBER_NOTIFICATION: "Notifications membres",
  MEMBER_EMAIL: "E-mails membres",
  SPONSORED_DAY: "Jours sponsorisés",
};

function formatCents(cents: number) {
  return (cents / 100).toLocaleString("fr-FR", { style: "currency", currency: "EUR" });
}

const DEMO_DASHBOARD: Dashboard = {
  plan: "normal",
  period: "2026-09",
  quotas: [
    { kind: "MEMBER_NOTIFICATION", limit: 1, used: 0, remaining: 1 },
    { kind: "MEMBER_EMAIL", limit: 1, used: 1, remaining: 0 },
    { kind: "SPONSORED_DAY", limit: 0, used: 0, remaining: 0 },
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
  const [loading, setLoading] = useState(!demo);
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  const load = useCallback(async () => {
    if (demo) return;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/merchant/campaigns");
      if (!response.ok) throw new Error();
      const data = (await response.json()) as Dashboard;
      setDashboard(data);
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

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="metric-card h-20 animate-pulse" />
        ))}
      </div>
    );
  }

  if (error) {
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

  if (creating) {
    return (
      <CampaignWizard
        demo={demo}
        onClose={() => setCreating(false)}
        onDone={() => {
          setCreating(false);
          void load();
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      <section>
        <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--violet-bright)]">
          Quotas — {dashboard.plan === "insight" ? "Fidelo Insight" : "Fidelo"} · {dashboard.period}
        </p>
        <div className="grid grid-cols-3 gap-3">
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

      <Button className="w-full" onClick={() => setCreating(true)}>
        Nouvelle campagne
      </Button>

      <section className="space-y-2">
        {dashboard.campaigns.length === 0 ? (
          <p className="glass-panel p-8 text-center text-sm text-[var(--muted)]">
            Aucune campagne pour le moment. Créez-en une pour toucher vos clients.
          </p>
        ) : (
          dashboard.campaigns.map((c) => (
            <div key={c.id} className="glass-panel p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-wide text-[var(--muted)]">
                    {c.channel === "SPONSORED_AD" ? "Publicité" : CHANNEL_LABELS[c.channel as Channel]} ·{" "}
                    {c.audienceType === "NETWORK_LOCAL" ? "Réseau local" : "Mes membres"}
                  </p>
                  <p className="truncate text-sm font-bold text-[var(--ink)]">{c.title || "(Sans titre)"}</p>
                  <p className="mt-1 text-xs text-[var(--muted-strong)]">{c.statusLabel}</p>
                  {c.rejectionReason ? (
                    <p className="mt-1 text-xs text-[var(--danger)]">Motif : {c.rejectionReason}</p>
                  ) : null}
                  {c.estimatedRecipients !== null ? (
                    <p className="mt-1 text-[11px] text-[var(--muted)]">
                      ~{c.estimatedRecipients} destinataires
                      {c.priceCents ? ` · ${formatCents(c.priceCents)}` : ""}
                    </p>
                  ) : null}
                </div>
                <div className="flex shrink-0 flex-col gap-1">
                  {["DRAFT", "PENDING_REVIEW", "PAYMENT_REQUIRED", "PAID", "SCHEDULED"].includes(c.status) ? (
                    <button
                      type="button"
                      onClick={() => void cancelCampaign(c.id)}
                      className="text-xs font-semibold text-[var(--danger)]"
                    >
                      Annuler
                    </button>
                  ) : null}
                  {c.status !== "SENDING" ? (
                    <button
                      type="button"
                      onClick={() => void duplicateCampaign(c.id)}
                      className="text-xs font-semibold text-[var(--violet-bright)]"
                    >
                      Dupliquer
                    </button>
                  ) : null}
                </div>
              </div>
            </div>
          ))
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

  return (
    <div className="space-y-4">
      <button type="button" onClick={onClose} className="text-xs font-semibold text-[var(--muted)]">
        ← Retour
      </button>

      {step === "channel" ? (
        <div className="glass-panel space-y-4 p-5">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-wide text-[var(--muted)]">Canal</p>
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
            <p className="mb-2 text-xs font-bold uppercase tracking-wide text-[var(--muted)]">Audience</p>
            <div className="grid grid-cols-1 gap-2">
              <button
                type="button"
                onClick={() => setAudience("MERCHANT_MEMBERS")}
                className={`merchant-filter-chip text-left ${audience === "MERCHANT_MEMBERS" ? "merchant-filter-chip-active" : ""}`}
              >
                Mes membres — clients possédant votre carte
              </button>
              <button
                type="button"
                onClick={() => setAudience("NETWORK_LOCAL")}
                className={`merchant-filter-chip text-left ${audience === "NETWORK_LOCAL" ? "merchant-filter-chip-active" : ""}`}
              >
                Clients Fidelo de mon secteur — toujours payant
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
            <p className="text-[10px] font-bold uppercase tracking-wide text-[var(--muted)]">Aperçu</p>
            <p className="mt-1 text-sm font-bold text-[var(--ink)]">{title || "Titre de la campagne"}</p>
            <p className="text-xs text-[var(--muted-strong)]">{body || "Votre message apparaîtra ici."}</p>
          </div>
          {error ? <p className="text-sm text-[var(--danger)]">{error}</p> : null}
          <Button className="w-full" onClick={() => void saveAndEstimate()} disabled={busy || !title.trim() || !body.trim()}>
            {busy ? "…" : "Estimer l'audience"}
          </Button>
        </div>
      ) : null}

      {step === "review" && estimate ? (
        <div className="glass-panel space-y-3 p-5">
          <p className="text-sm text-[var(--muted-strong)]">
            Destinataires estimés : <strong className="text-[var(--ink)]">{estimate.estimatedRecipients}</strong>
          </p>
          <p className="text-sm text-[var(--muted-strong)]">
            {estimate.requiresPayment
              ? `Paiement requis : ${formatCents(estimate.priceCents)}`
              : "Couverte par votre quota inclus — gratuit"}
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
