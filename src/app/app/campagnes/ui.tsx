"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui";
import { CAMPAIGN_PRICE_CENTS } from "@/lib/campaign-prices";

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
  failedDeliveries?: number;
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
  NETWORK_LOCAL: "Clients Fideto de mon secteur",
};

/** Libellé d'audience réseau selon le canal : un e-mail réseau vise les prospects (sans la carte). */
function audienceDisplay(aud: Audience, ch: Channel) {
  if (aud === "NETWORK_LOCAL" && ch === "EMAIL") return "Prospects de mon secteur (sans ma carte)";
  return AUDIENCE_LABELS[aud];
}

const QUOTA_LABELS: Record<string, string> = {
  MEMBER_NOTIFICATION: "Notifications restantes",
  MEMBER_EMAIL: "E-mails restants",
  SPONSORED_DAY: "Mise en avant incluse",
};

const AD_STATUS_LABELS: Record<AdStatus, string> = {
  DRAFT: "Brouillon",
  PENDING_REVIEW: "En préparation par Fideto",
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

function statusTone(status: string): "sent" | "scheduled" | "muted" | "danger" {
  if (status === "SENT" || status === "PARTIALLY_SENT") return "sent";
  if (status === "SCHEDULED" || status === "PAID" || status === "PENDING_REVIEW" || status === "PAYMENT_REQUIRED") {
    return "scheduled";
  }
  if (status === "REJECTED" || status === "FAILED" || status === "CANCELLED") return "danger";
  return "muted";
}

/* ---------------------------------------------------------------------- */
/* Icônes (traits, sans dépendance externe)                                */
/* ---------------------------------------------------------------------- */

function IconSparkles({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <path
        d="M12 3l1.6 4.4L18 9l-4.4 1.6L12 15l-1.6-4.4L6 9l4.4-1.6L12 3z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8L19 15z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconBell({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <path d="M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M13.73 21a2 2 0 01-3.46 0" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconMail({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="M22 6l-10 7L2 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconPanelBottom({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M3 15h18" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconSend({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <path d="M22 2L11 13" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M22 2l-7 20-4-9-9-4 20-7z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconBadgeAd({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <rect x="3" y="7" width="13" height="10" rx="2" />
      <path d="M16 10l5-3v10l-5-3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconMapPin({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 1116 0z" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function IconUsers({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 00-3-3.87" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M16 3.13a4 4 0 010 7.75" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconCalendarPlus({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M3 10h18M8 2v4M16 2v4M12 14v6M9 17h6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconEllipsis({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <circle cx="5" cy="12" r="1.6" />
      <circle cx="12" cy="12" r="1.6" />
      <circle cx="19" cy="12" r="1.6" />
    </svg>
  );
}

function IconCheck({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className={className}>
      <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconCircleCheck({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <circle cx="12" cy="12" r="10" />
      <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconArrowRight({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <path d="M5 12h14M13 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
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
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

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
        dashboard={dashboard}
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
        quotas={dashboard.quotas}
        onClose={() => setCreating(null)}
        onDone={() => {
          setCreating(null);
          void load();
        }}
      />
    );
  }

  const adsByCampaignId = new Map(ads.filter((a) => a.campaignId).map((a) => [a.campaignId as string, a]));
  const planLabel = dashboard.plan === "insight" ? "Fideto Insight" : "Fideto";

  const notifQuota = dashboard.quotas.find((q) => q.kind === "MEMBER_NOTIFICATION");
  const emailQuota = dashboard.quotas.find((q) => q.kind === "MEMBER_EMAIL");
  const sponsoredQuota = dashboard.quotas.find((q) => q.kind === "SPONSORED_DAY");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-end">
        <span className="campaign-plan-badge">
          <IconSparkles />
          {planLabel}
        </span>
      </div>

      <section className="campaign-quota-grid" aria-label="Quotas du mois">
        {dashboard.quotas.map((q) => (
          <div key={q.kind} className="campaign-quota-card">
            <span className="campaign-quota-icon">
              {q.kind === "MEMBER_NOTIFICATION" ? <IconBell /> : q.kind === "MEMBER_EMAIL" ? <IconMail /> : <IconPanelBottom />}
            </span>
            <span>
              <span className="campaign-quota-label">{QUOTA_LABELS[q.kind] ?? q.kind}</span>
              <strong className="campaign-quota-value">
                {q.kind === "SPONSORED_DAY" ? `${q.remaining} jour${q.remaining > 1 ? "s" : ""}` : `${q.remaining} sur ${q.limit}`}
              </strong>
            </span>
          </div>
        ))}
      </section>

      <MarketingBalanceCard demo={demo} />

      <section className="campaign-type-grid" aria-label="Créer une campagne">
        <article className="campaign-type-card">
          <div className="campaign-type-head">
            <span className="campaign-type-icon campaign-type-icon-blue">
              <IconSend />
            </span>
            <div>
              <h2 className="text-base font-black text-[var(--ink)]">Envoyer une annonce</h2>
              <p className="mt-1 text-sm text-[var(--muted-strong)]">
                Choisissez une notification dans l&apos;application ou un e-mail, puis sélectionnez votre audience.
              </p>
            </div>
          </div>
          <div className="campaign-channel-list">
            <div className="campaign-channel-row">
              <span className="campaign-channel-name">
                <IconBell />
                {CHANNEL_LABELS.IN_APP_PUSH}
              </span>
              <span className="campaign-channel-meta">
                <strong>
                  {notifQuota ? `${notifQuota.remaining} incluse${notifQuota.remaining > 1 ? "s" : ""}` : "—"}
                </strong>
                puis {formatCents(CAMPAIGN_PRICE_CENTS.MEMBER_NOTIFICATION)}
              </span>
            </div>
            <div className="campaign-channel-row">
              <span className="campaign-channel-name">
                <IconMail />
                {CHANNEL_LABELS.EMAIL}
              </span>
              <span className="campaign-channel-meta">
                <strong>{emailQuota ? `${emailQuota.remaining} inclus${emailQuota.remaining > 1 ? "" : ""}` : "—"}</strong>
                puis {formatCents(CAMPAIGN_PRICE_CENTS.MEMBER_EMAIL)}
              </span>
            </div>
          </div>
          <Button className="w-full" onClick={() => setCreating("announcement")}>
            Créer une annonce
          </Button>
        </article>

        <article className="campaign-type-card">
          <div className="campaign-type-head">
            <span className="campaign-type-icon campaign-type-icon-orange">
              <IconBadgeAd />
            </span>
            <div>
              <h2 className="text-base font-black text-[var(--ink)]">Mettre mon commerce en avant</h2>
              <p className="mt-1 text-sm text-[var(--muted-strong)]">
                Un bandeau discret « Sponsorisé » dans l&apos;application client, préparé par Fideto puis validé par vous.
              </p>
            </div>
          </div>
          <div className="campaign-price-row">
            <div>
              <span>Diffusion locale</span>
              <strong>{formatCents(CAMPAIGN_PRICE_CENTS.SPONSORED_AD_PER_DAY)} / jour</strong>
            </div>
            <small>Payé à la validation du visuel</small>
          </div>
          <div className="campaign-channel-list">
            <div className="campaign-channel-row">
              <span className="campaign-channel-name">
                <IconMapPin />
                Clients Fideto de votre secteur
              </span>
              <span className="campaign-channel-meta">
                <strong>
                  {sponsoredQuota ? `${sponsoredQuota.limit} jour${sponsoredQuota.limit > 1 ? "s" : ""} inclus` : "—"}
                </strong>
                avec {planLabel}
              </span>
            </div>
          </div>
          <Button className="w-full" variant="secondary" onClick={() => setCreating("sponsor")}>
            Demander une mise en avant
          </Button>
        </article>
      </section>

      {error ? <p className="text-sm text-[var(--danger)]">{error}</p> : null}

      <section className="campaign-history-panel" aria-label="Activité récente">
        <div className="campaign-history-head">
          <div>
            <h3 className="text-[15px] font-black text-[var(--ink)]">Activité récente</h3>
            <p className="mt-0.5 text-xs text-[var(--muted-strong)]">
              Vos annonces et mises en avant, avec un statut compréhensible.
            </p>
          </div>
        </div>

        {dashboard.campaigns.length === 0 ? (
          <p className="py-8 text-center text-sm text-[var(--muted)]">
            Aucune campagne pour le moment. Créez-en une pour toucher vos clients.
          </p>
        ) : (
          dashboard.campaigns.map((c) => {
            const ad = c.channel === "SPONSORED_AD" ? adsByCampaignId.get(c.id) : undefined;
            const typeLabel =
              c.channel === "SPONSORED_AD" ? "Mise en avant" : CHANNEL_LABELS[c.channel as Channel];
            const audienceLabel =
              c.channel === "SPONSORED_AD"
                ? "Clients Fideto de votre secteur"
                : c.audienceType
                  ? audienceDisplay(c.audienceType, c.channel as Channel)
                  : "—";
            const canConfirmSponsor = ad && ad.status === "APPROVED" && ad.finalImageUrl && c.status === "PENDING_REVIEW";
            const canCancel =
              ["DRAFT", "PENDING_REVIEW", "PAYMENT_REQUIRED", "PAID", "SCHEDULED"].includes(c.status) &&
              !canConfirmSponsor;
            const canDuplicate = c.status !== "SENDING" && c.channel !== "SPONSORED_AD";
            const tone = statusTone(c.status);
            const recipientsLabel =
              c.estimatedRecipients !== null
                ? `${c.status === "SENT" || c.status === "PARTIALLY_SENT" ? "" : "~"}${c.estimatedRecipients} destinataires`
                : "—";
            return (
              <div key={c.id} className="campaign-activity-row">
                <div className="campaign-activity-title">
                  <strong>{c.title || "(Sans titre)"}</strong>
                  <span>
                    {typeLabel} · {audienceLabel}
                  </span>
                  {c.rejectionReason ? (
                    <span className="text-[var(--danger)]">Motif : {c.rejectionReason}</span>
                  ) : null}
                  {c.failedDeliveries ? (
                    <span className="text-[var(--danger)]">
                      {c.failedDeliveries} envoi{c.failedDeliveries > 1 ? "s" : ""} en échec
                    </span>
                  ) : null}
                </div>
                <span className="campaign-activity-meta">{recipientsLabel}</span>
                <span className={`campaign-status-pill campaign-status-pill-${tone}`}>
                  <span className="campaign-status-pill-dot" />
                  {ad ? AD_STATUS_LABELS[ad.status] : c.statusLabel}
                </span>
                <div className="relative">
                  {canConfirmSponsor || canCancel || canDuplicate ? (
                    <button
                      type="button"
                      onClick={() => setOpenMenuId(openMenuId === c.id ? null : c.id)}
                      className="campaign-more-btn"
                      aria-label="Actions"
                    >
                      <IconEllipsis />
                    </button>
                  ) : (
                    <span className="campaign-more-btn opacity-0" aria-hidden />
                  )}
                  {openMenuId === c.id ? (
                    <div className="campaign-more-menu">
                      {canConfirmSponsor ? (
                        <button
                          type="button"
                          onClick={() => {
                            setOpenMenuId(null);
                            void confirmSponsor(ad!.id);
                          }}
                        >
                          Valider le visuel
                        </button>
                      ) : null}
                      {canDuplicate ? (
                        <button
                          type="button"
                          onClick={() => {
                            setOpenMenuId(null);
                            void duplicateCampaign(c.id);
                          }}
                        >
                          Dupliquer
                        </button>
                      ) : null}
                      {canCancel ? (
                        <button
                          type="button"
                          className="is-danger"
                          onClick={() => {
                            setOpenMenuId(null);
                            void cancelCampaign(c.id);
                          }}
                        >
                          Annuler
                        </button>
                      ) : null}
                    </div>
                  ) : null}
                </div>
              </div>
            );
          })
        )}
      </section>
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/* Créer une annonce — assistant 3 étapes (mockup B)                       */
/* ---------------------------------------------------------------------- */

type WizardStep = "channel" | "content" | "review";

type LiveEstimate = {
  estimatedRecipients: number;
  priceCents: number;
  requiresPayment: boolean;
  quota: { limit: number; used: number; remaining: number };
  balanceCents: number;
};

function CampaignWizard({
  demo,
  dashboard,
  onClose,
  onDone,
}: {
  demo: boolean;
  dashboard: Dashboard;
  onClose: () => void;
  onDone: () => void;
}) {
  const [step, setStep] = useState<WizardStep>("channel");
  const [channel, setChannel] = useState<Channel>("IN_APP_PUSH");
  const [audience, setAudience] = useState<Audience>("MERCHANT_MEMBERS");
  const [campaignId, setCampaignId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [actionUrl, setActionUrl] = useState("");
  const [scheduledAt, setScheduledAt] = useState("");
  const [estimateByCombo, setEstimateByCombo] = useState<Record<string, LiveEstimate>>({});
  const [estimating, setEstimating] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const comboKey = `${channel}:${audience}`;
  const estimate = estimateByCombo[comboKey] ?? null;
  const requestSeq = useRef(0);
  const activeCampaignRef = useRef<string | null>(null);

  const staticQuotaFor = useCallback(
    (ch: Channel, aud: Audience) => {
      if (aud === "NETWORK_LOCAL") return null;
      const kind = ch === "EMAIL" ? "MEMBER_EMAIL" : "MEMBER_NOTIFICATION";
      return dashboard.quotas.find((q) => q.kind === kind) ?? null;
    },
    [dashboard.quotas],
  );

  const staticPriceFor = useCallback((ch: Channel, aud: Audience) => {
    if (aud === "MERCHANT_MEMBERS") {
      return ch === "EMAIL" ? CAMPAIGN_PRICE_CENTS.MEMBER_EMAIL : CAMPAIGN_PRICE_CENTS.MEMBER_NOTIFICATION;
    }
    return ch === "EMAIL" ? CAMPAIGN_PRICE_CENTS.NETWORK_EMAIL : CAMPAIGN_PRICE_CENTS.NETWORK_NOTIFICATION;
  }, []);

  const ensureEstimate = useCallback(
    async (ch: Channel, aud: Audience) => {
      const key = `${ch}:${aud}`;
      if (estimateByCombo[key]) return;

      if (demo) {
        const recipients = aud === "MERCHANT_MEMBERS" ? 128 : 860;
        const quota = staticQuotaFor(ch, aud);
        const price = staticPriceFor(ch, aud);
        setEstimateByCombo((prev) => ({
          ...prev,
          [key]: {
            estimatedRecipients: recipients,
            priceCents: aud === "MERCHANT_MEMBERS" && quota && quota.remaining > 0 ? 0 : price,
            requiresPayment: !(aud === "MERCHANT_MEMBERS" && quota && quota.remaining > 0),
            quota: quota ?? { limit: 0, used: 0, remaining: 0 },
            balanceCents: 1000,
          },
        }));
        return;
      }

      const seq = ++requestSeq.current;
      setEstimating(true);
      setError(null);
      try {
        // Un brouillon doit exister côté serveur pour estimer une audience réelle : on annule
        // le brouillon précédent (s'il ne correspond plus à la sélection courante) et on en
        // recrée un pour le nouveau couple canal/audience, sans jamais rien envoyer.
        if (activeCampaignRef.current) {
          const staleId = activeCampaignRef.current;
          void fetch(`/api/merchant/campaigns/${staleId}`, { method: "DELETE" }).catch(() => {});
          activeCampaignRef.current = null;
        }
        const createResponse = await fetch("/api/merchant/campaigns", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ channel: ch, audienceType: aud }),
        });
        if (!createResponse.ok) throw new Error();
        const created = (await createResponse.json()) as { campaign: { id: string } };
        if (seq !== requestSeq.current) return;
        activeCampaignRef.current = created.campaign.id;
        setCampaignId(created.campaign.id);

        const estimateResponse = await fetch(`/api/merchant/campaigns/${created.campaign.id}/estimate`);
        if (!estimateResponse.ok) throw new Error();
        const data = (await estimateResponse.json()) as {
          audience: { estimatedRecipients: number };
          pricing: { priceCents: number; requiresPayment: boolean };
          quota: { limit: number; used: number; remaining: number };
          balanceCents: number;
        };
        if (seq !== requestSeq.current) return;
        setEstimateByCombo((prev) => ({
          ...prev,
          [key]: {
            estimatedRecipients: data.audience.estimatedRecipients,
            priceCents: data.pricing.priceCents,
            requiresPayment: data.pricing.requiresPayment,
            quota: data.quota,
            balanceCents: data.balanceCents,
          },
        }));
      } catch {
        if (seq === requestSeq.current) {
          setError("Impossible d'estimer l'audience pour le moment. Vous pouvez tout de même continuer.");
        }
      } finally {
        if (seq === requestSeq.current) setEstimating(false);
      }
    },
    [demo, estimateByCombo, staticPriceFor, staticQuotaFor],
  );

  useEffect(() => {
    void ensureEstimate(channel, audience);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [channel, audience]);

  async function saveAndEstimate() {
    if (!campaignId) {
      setStep("review");
      return;
    }
    if (demo) {
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
      setStep("review");
    } catch {
      setError("Impossible d'enregistrer le contenu. Vérifiez les champs et réessayez.");
    } finally {
      setBusy(false);
    }
  }

  async function confirmSend() {
    if (demo) {
      onDone();
      return;
    }
    if (!campaignId) return;
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

  function handleClose() {
    if (!demo && activeCampaignRef.current) {
      void fetch(`/api/merchant/campaigns/${activeCampaignRef.current}`, { method: "DELETE" }).catch(() => {});
    }
    onClose();
  }

  const steps: { key: WizardStep; label: string }[] = [
    { key: "channel", label: "Canal et audience" },
    { key: "content", label: "Contenu" },
    { key: "review", label: "Récapitulatif" },
  ];
  const stepIndex = steps.findIndex((s) => s.key === step);

  const memberQuota = staticQuotaFor(channel, "MERCHANT_MEMBERS");
  const memberComboEstimate = estimateByCombo[`${channel}:MERCHANT_MEMBERS`];
  const localComboEstimate = estimateByCombo[`${channel}:NETWORK_LOCAL`];
  const memberPrice = staticPriceFor(channel, "MERCHANT_MEMBERS");
  const localPrice = staticPriceFor(channel, "NETWORK_LOCAL");

  const summaryPrice = estimate
    ? estimate.requiresPayment
      ? formatCents(estimate.priceCents)
      : "Inclus"
    : estimating
      ? "…"
      : "—";
  const insufficientBalance = Boolean(estimate?.requiresPayment && estimate.balanceCents < estimate.priceCents);
  const summaryRecipients = estimate ? `~${estimate.estimatedRecipients}` : estimating ? "…" : "—";
  const summaryCredit =
    audience === "MERCHANT_MEMBERS" && estimate && !estimate.requiresPayment ? "1 crédit sera utilisé" : null;

  return (
    <div className="announce-form space-y-4">
      <button type="button" onClick={handleClose} className="text-xs font-semibold text-[var(--muted)]">
        ← Retour aux campagnes
      </button>

      <div className="glass-panel p-5 sm:p-6">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--violet-bright)]">Campagnes</p>
        <h2 className="mt-1 text-2xl font-black tracking-tight text-[var(--ink)]">Créer une annonce</h2>
        <p className="mt-1 text-sm text-[var(--muted-strong)]">
          Choisissez le canal et les clients que vous souhaitez contacter.
        </p>

        <ol className="announce-stepper" aria-label="Progression">
          {steps.map((s, i) => (
            <li key={s.key} className={`announce-step ${i === stepIndex ? "is-active" : i < stepIndex ? "is-done" : ""}`}>
              <span className="announce-step-number">{i < stepIndex ? <IconCheck className="h-3 w-3" /> : i + 1}</span>
              <span className="announce-step-label">{s.label}</span>
            </li>
          ))}
        </ol>

        {step === "channel" ? (
          <div className="space-y-6">
            <section>
              <div className="announce-section-head">
                <h3>Comment souhaitez-vous les contacter ?</h3>
                <p>Un seul canal par annonce</p>
              </div>
              <div className="announce-choice-grid">
                <button
                  type="button"
                  onClick={() => setChannel("IN_APP_PUSH")}
                  className={`announce-choice ${channel === "IN_APP_PUSH" ? "is-selected" : ""}`}
                  aria-pressed={channel === "IN_APP_PUSH"}
                >
                  <span className="announce-choice-icon">
                    <IconBell />
                  </span>
                  <span className="announce-choice-copy">
                    <strong>Notification dans l&apos;application</strong>
                    <span>Visible dans Fideto et envoyée sur le téléphone si les notifications sont autorisées.</span>
                  </span>
                  <span className="announce-choice-check">
                    <IconCheck />
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setChannel("EMAIL")}
                  className={`announce-choice ${channel === "EMAIL" ? "is-selected" : ""}`}
                  aria-pressed={channel === "EMAIL"}
                >
                  <span className="announce-choice-icon">
                    <IconMail />
                  </span>
                  <span className="announce-choice-copy">
                    <strong>E-mail</strong>
                    <span>Un message Fideto personnalisé, envoyé uniquement aux clients ayant donné leur accord.</span>
                  </span>
                  <span className="announce-choice-check">
                    <IconCheck />
                  </span>
                </button>
              </div>
            </section>

            <section>
              <div className="announce-section-head">
                <h3>À qui souhaitez-vous l&apos;envoyer ?</h3>
                <p>Consentements vérifiés automatiquement</p>
              </div>
              <div className="announce-audience-grid">
                <button
                  type="button"
                  onClick={() => setAudience("MERCHANT_MEMBERS")}
                  className={`announce-audience ${audience === "MERCHANT_MEMBERS" ? "is-selected" : ""}`}
                  aria-pressed={audience === "MERCHANT_MEMBERS"}
                >
                  <span className="announce-audience-icon">
                    <IconUsers />
                  </span>
                  <span className="announce-audience-copy">
                    <strong>Mes membres</strong>
                    <span>Clients qui possèdent déjà votre carte Fideto.</span>
                  </span>
                  <span className="announce-audience-meta">
                    <strong>
                      {memberComboEstimate
                        ? `${memberComboEstimate.estimatedRecipients} clients`
                        : estimating && audience === "MERCHANT_MEMBERS"
                          ? "…"
                          : "—"}
                    </strong>
                    <span>
                      {memberQuota
                        ? memberQuota.remaining > 0
                          ? `${memberQuota.remaining} crédit${memberQuota.remaining > 1 ? "s" : ""} disponible${memberQuota.remaining > 1 ? "s" : ""}`
                          : `${formatCents(memberPrice)}`
                        : "—"}
                    </span>
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setAudience("NETWORK_LOCAL")}
                  className={`announce-audience ${audience === "NETWORK_LOCAL" ? "is-selected" : ""}`}
                  aria-pressed={audience === "NETWORK_LOCAL"}
                >
                  <span className="announce-audience-icon">
                    <IconMapPin />
                  </span>
                  <span className="announce-audience-copy">
                    <strong>{channel === "EMAIL" ? "Prospects de mon secteur" : "Clients Fideto de mon secteur"}</strong>
                    <span>
                      {channel === "EMAIL"
                        ? "Clients locaux éligibles qui ne possèdent pas votre carte."
                        : "Clients locaux éligibles, avec ou sans votre carte."}
                    </span>
                  </span>
                  <span className="announce-audience-meta">
                    <strong>
                      {localComboEstimate
                        ? `≈ ${localComboEstimate.estimatedRecipients} clients`
                        : estimating && audience === "NETWORK_LOCAL"
                          ? "…"
                          : "—"}
                    </strong>
                    <span>{formatCents(localPrice)}</span>
                  </span>
                </button>
              </div>
            </section>

            <div className="announce-summary" aria-live="polite">
              <IconCircleCheck />
              <div>
                <strong>
                  {CHANNEL_LABELS[channel]} à{" "}
                  {audience === "MERCHANT_MEMBERS"
                    ? estimate
                      ? `vos ${estimate.estimatedRecipients} membres`
                      : "vos membres"
                    : estimate
                      ? `environ ${estimate.estimatedRecipients} clients de votre secteur`
                      : "vos clients du secteur"}
                </strong>
                <span>
                  {audience === "MERCHANT_MEMBERS"
                    ? summaryCredit ?? (estimate?.requiresPayment ? `Quota épuisé · ${summaryPrice}` : "Incluse dans votre forfait")
                    : "Audience locale · seuls les clients ayant donné leur accord seront contactés"}
                </span>
              </div>
            </div>

            {error ? <p className="text-sm text-[var(--danger)]">{error}</p> : null}
          </div>
        ) : null}

        {step === "content" ? (
          <div className="space-y-3">
            <div className="announce-content-card">
              <label className="announce-field">
                Titre
                <input
                  className="profile-select mt-1 w-full"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  maxLength={120}
                />
              </label>
              <label className="announce-field">
                Message
                <textarea
                  className="profile-select mt-1 w-full"
                  rows={4}
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  maxLength={2000}
                />
              </label>
              <label className="announce-field">
                Bouton d&apos;action (facultatif)
                <input
                  className="profile-select mt-1 w-full"
                  value={actionUrl}
                  onChange={(e) => setActionUrl(e.target.value)}
                  placeholder="https://…"
                />
              </label>
              <label className="announce-field">
                Programmer pour (facultatif — sinon envoi dès confirmation)
                <input
                  type="datetime-local"
                  className="profile-select mt-1 w-full"
                  value={scheduledAt}
                  onChange={(e) => setScheduledAt(e.target.value)}
                />
              </label>
            </div>

            <div className="announce-preview">
              <p className="announce-preview-label">Aperçu réel</p>
              <p className="mt-1 text-sm font-bold text-[var(--ink)]">{title || "Titre de la campagne"}</p>
              <p className="text-xs text-[var(--muted-strong)]">{body || "Votre message apparaîtra ici."}</p>
            </div>

            {error ? <p className="text-sm text-[var(--danger)]">{error}</p> : null}
          </div>
        ) : null}

        {step === "review" ? (
          <div className="space-y-3">
            <div className="announce-content-card">
              <div className="announce-recap-grid">
                <div className="announce-recap-row">
                  <span className="text-xs text-[var(--muted)]">Canal</span>
                  <span className="text-sm font-bold text-[var(--ink)]">{CHANNEL_LABELS[channel]}</span>
                </div>
                <div className="announce-recap-row">
                  <span className="text-xs text-[var(--muted)]">Audience</span>
                  <span className="text-sm font-bold text-[var(--ink)]">{audienceDisplay(audience, channel)}</span>
                </div>
                <div className="announce-recap-row">
                  <span className="text-xs text-[var(--muted)]">Destinataires estimés</span>
                  <span className="text-sm font-bold text-[var(--ink)]">{summaryRecipients}</span>
                </div>
                <div className="announce-recap-row">
                  <span className="text-xs text-[var(--muted)]">Date d&apos;envoi</span>
                  <span className="text-sm font-bold text-[var(--ink)]">
                    {scheduledAt ? new Date(scheduledAt).toLocaleString("fr-FR") : "Dès confirmation"}
                  </span>
                </div>
                <div className="announce-recap-row">
                  <span className="text-xs text-[var(--muted)]">Coût de l&apos;envoi (prix fixe)</span>
                  <span className="text-sm font-bold text-[var(--ink)]">{summaryPrice}</span>
                </div>
                {estimate?.requiresPayment ? (
                  <>
                    <div className="announce-recap-row">
                      <span className="text-xs text-[var(--muted)]">Solde marketing</span>
                      <span className="text-sm font-bold text-[var(--ink)]">{formatCents(estimate.balanceCents)}</span>
                    </div>
                    <div className="announce-recap-row">
                      <span className="text-xs text-[var(--muted)]">Solde après envoi</span>
                      <span className="text-sm font-bold text-[var(--ink)]">
                        {insufficientBalance ? "Insuffisant" : formatCents(estimate.balanceCents - estimate.priceCents)}
                      </span>
                    </div>
                  </>
                ) : null}
              </div>
            </div>

            <div className="announce-preview">
              <p className="announce-preview-label">Contenu</p>
              <p className="mt-1 text-sm font-bold text-[var(--ink)]">{title || "Titre de la campagne"}</p>
              <p className="text-xs text-[var(--muted-strong)]">{body || "Votre message apparaîtra ici."}</p>
            </div>

            <p className="text-sm text-[var(--muted-strong)]">
              Vérifiez le récapitulatif ci-dessus, puis confirmez l&apos;envoi. Vos clients ne recevront rien avant
              cette confirmation.
            </p>

            {insufficientBalance && estimate ? (
              <div className="announce-content-card space-y-2">
                <p className="text-sm font-semibold text-[var(--danger)]">
                  Solde insuffisant : il manque {formatCents(estimate.priceCents - estimate.balanceCents)} pour cet envoi.
                </p>
                <div className="flex flex-wrap gap-2">
                  {[500, 1000, 2000].map((cents) => (
                    <Button key={cents} type="button" variant="secondary" onClick={() => void startTopup(cents, setError)}>
                      Recharger {formatCents(cents)}
                    </Button>
                  ))}
                </div>
              </div>
            ) : null}

            {error ? <p className="text-sm text-[var(--danger)]">{error}</p> : null}
          </div>
        ) : null}

        <footer className="announce-footer">
          <div className="announce-footer-price">
            <strong>Total : {summaryPrice}</strong>
            <span>{step === "channel" ? "Rien n'est débité à cette étape" : "Débité de votre solde uniquement à la confirmation"}</span>
          </div>
          <div className="announce-footer-actions">
            <Button type="button" variant="secondary" onClick={handleClose}>
              Annuler
            </Button>
            {step === "channel" ? (
              <Button type="button" onClick={() => setStep("content")} disabled={estimating && !estimate}>
                Continuer
                <IconArrowRight className="ml-1 h-4 w-4" />
              </Button>
            ) : step === "content" ? (
              <Button type="button" onClick={() => void saveAndEstimate()} disabled={busy || !title.trim() || !body.trim()}>
                {busy ? "…" : "Voir le récapitulatif"}
              </Button>
            ) : (
              <Button type="button" onClick={() => void confirmSend()} disabled={busy || insufficientBalance}>
                {busy
                  ? "…"
                  : estimate?.requiresPayment
                    ? `Confirmer et débiter ${formatCents(estimate.priceCents)}`
                    : "Confirmer l'envoi"}
              </Button>
            )}
          </div>
        </footer>
      </div>
    </div>
  );
}

const SPONSOR_DURATIONS = [3, 7, 14, 21, 30];

function todayDateInputValue() {
  return new Date().toISOString().slice(0, 10);
}

function nowTimeInputValue() {
  return new Date().toTimeString().slice(0, 5);
}

function addDaysToDateInput(dateInput: string, days: number) {
  const d = new Date(`${dateInput}T00:00:00`);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

/** Reflète priceSponsoredAd (src/lib/campaign-pricing.ts) pour l'affichage : le serveur
 * recalcule toujours le prix réel à la confirmation, ceci n'est qu'une estimation. */
function estimateSponsorPrice(days: number, includedDaysRemaining: number) {
  if (includedDaysRemaining >= days) return { priceCents: 0, requiresPayment: false, daysFromQuota: days };
  return { priceCents: days * CAMPAIGN_PRICE_CENTS.SPONSORED_AD_PER_DAY, requiresPayment: true, daysFromQuota: 0 };
}

function SponsorWizard({
  demo,
  quotas,
  onClose,
  onDone,
}: {
  demo: boolean;
  quotas: Quota[];
  onClose: () => void;
  onDone: () => void;
}) {
  const [days, setDays] = useState(7);
  const [startDate, setStartDate] = useState(todayDateInputValue);
  const [startTime, setStartTime] = useState(nowTimeInputValue);
  const [endTime, setEndTime] = useState(nowTimeInputValue);
  const [objective, setObjective] = useState("");
  const [text, setText] = useState("");
  const [ctaUrl, setCtaUrl] = useState("");
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const endDate = addDaysToDateInput(startDate, days);
  const includedDaysRemaining = quotas.find((q) => q.kind === "SPONSORED_DAY")?.remaining ?? 0;
  const pricing = estimateSponsorPrice(days, includedDaysRemaining);

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
      const start = new Date(`${startDate}T${startTime}:00`);
      const end = new Date(`${endDate}T${endTime}:00`);
      if (end <= start) {
        setError("La date/heure de fin doit être après le début.");
        setBusy(false);
        return;
      }
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

  if (done) {
    return (
      <div className="space-y-4">
        <button type="button" onClick={onClose} className="text-xs font-semibold text-[var(--muted)]">
          ← Retour aux campagnes
        </button>
        <div className="glass-panel space-y-3 p-6 text-center">
          <p className="text-sm font-bold text-[var(--ink)]">Demande envoyée</p>
          <p className="text-sm text-[var(--muted-strong)]">
            Fideto prépare votre visuel. Vous recevrez un aperçu à valider avant tout paiement — suivez son statut
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
          Comment ça marche : vous envoyez votre demande → Fideto prépare le visuel → vous recevez un aperçu → vous
          validez → vous payez → la campagne est programmée automatiquement → vous suivez affichages et clics.
        </div>

        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-wide text-[var(--muted)]">Durée</p>
          <div className="sponsor-duration-grid">
            {SPONSOR_DURATIONS.map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setDays(d)}
                className={`sponsor-duration-card ${days === d ? "sponsor-duration-card-active" : ""}`}
              >
                <span className="sponsor-duration-card-value">{d}</span>
                <span className="sponsor-duration-card-label">jour{d > 1 ? "s" : ""}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <label className="block text-xs text-[var(--muted)]">
            Date de début
            <input
              type="date"
              className="profile-select mt-1 w-full"
              value={startDate}
              min={todayDateInputValue()}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </label>
          <label className="block text-xs text-[var(--muted)]">
            Heure de début
            <input
              type="time"
              className="profile-select mt-1 w-full"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            />
          </label>
          <label className="block text-xs text-[var(--muted)]">
            Date de fin
            <input type="date" className="profile-select mt-1 w-full" value={endDate} disabled />
          </label>
          <label className="block text-xs text-[var(--muted)]">
            Heure de fin
            <input
              type="time"
              className="profile-select mt-1 w-full"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
            />
          </label>
        </div>

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
          Image (facultatif — Fideto peut l&apos;ajuster)
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

        <div className="campaign-wizard-summary space-y-1 rounded-xl border border-[var(--border)] bg-[var(--panel-bg)] p-4">
          <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--muted)]">Récapitulatif</p>
          <div className="campaign-wizard-summary-row">
            <span className="text-xs text-[var(--muted)]">Dates</span>
            <span className="text-sm font-bold text-[var(--ink)]">
              {formatDate(new Date(`${startDate}T00:00:00`).toISOString())} → {formatDate(new Date(`${endDate}T00:00:00`).toISOString())}
            </span>
          </div>
          <div className="campaign-wizard-summary-row">
            <span className="text-xs text-[var(--muted)]">Horaires</span>
            <span className="text-sm font-bold text-[var(--ink)]">{startTime} → {endTime}</span>
          </div>
          <div className="campaign-wizard-summary-row">
            <span className="text-xs text-[var(--muted)]">Durée</span>
            <span className="text-sm font-bold text-[var(--ink)]">{days} jour{days > 1 ? "s" : ""}</span>
          </div>
          <div className="campaign-wizard-summary-row">
            <span className="text-xs text-[var(--muted)]">Audience</span>
            <span className="text-sm font-bold text-[var(--ink)]">Clients Fideto de votre secteur</span>
          </div>
          <div className="campaign-wizard-summary-row">
            <span className="text-xs text-[var(--muted)]">Emplacement</span>
            <span className="text-sm font-bold text-[var(--ink)]">Bandeau Découvrir</span>
          </div>
          <div className="campaign-wizard-summary-row">
            <span className="text-xs text-[var(--muted)]">Crédits utilisés</span>
            <span className="text-sm font-bold text-[var(--ink)]">{pricing.daysFromQuota} jour{pricing.daysFromQuota > 1 ? "s" : ""} inclus</span>
          </div>
          <div className="campaign-wizard-summary-row">
            <span className="text-xs text-[var(--muted)]">Montant restant à payer</span>
            <span className="text-sm font-bold text-[var(--ink)]">
              {pricing.requiresPayment ? formatCents(pricing.priceCents) : "0 € — couvert par votre quota"}
            </span>
          </div>
        </div>

        {error ? <p className="text-sm text-[var(--danger)]">{error}</p> : null}
        <Button className="w-full" variant="secondary" onClick={() => void submit()} disabled={busy || !text.trim()}>
          {busy ? "…" : "Envoyer ma demande"}
        </Button>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/* Solde marketing prépayé                                                 */
/* ---------------------------------------------------------------------- */

type LedgerEntry = {
  id: string;
  type: "TOPUP" | "DEBIT" | "REFUND";
  status: "PENDING" | "PAID" | "FAILED" | "CANCELLED";
  amountCents: number;
  balanceAfterCents: number | null;
  description: string;
  createdAt: string;
  campaignTitle: string | null;
  campaignStatus: string | null;
};

type BalanceData = {
  balanceCents: number;
  presetsCents: number[];
  minTopupCents: number;
  maxTopupCents: number;
  history: LedgerEntry[];
};

const DEMO_BALANCE: BalanceData = {
  balanceCents: 1000,
  presetsCents: [500, 1000, 2000],
  minTopupCents: 500,
  maxTopupCents: 50000,
  history: [],
};

/** Démarre une recharge Stripe Checkout. Le montant est revalidé côté serveur. */
async function startTopup(amountCents: number, onError: (message: string) => void) {
  try {
    const response = await fetch("/api/merchant/marketing-balance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amountCents }),
    });
    const data = (await response.json()) as { checkoutUrl?: string; error?: string };
    if (!response.ok || !data.checkoutUrl) {
      onError(data.error ?? "Impossible de démarrer la recharge.");
      return;
    }
    window.location.href = data.checkoutUrl;
  } catch {
    onError("Impossible de démarrer la recharge. Réessayez.");
  }
}

function ledgerLabel(entry: LedgerEntry) {
  if (entry.type === "TOPUP") {
    if (entry.status === "PAID") return "Recharge";
    if (entry.status === "PENDING") return "Recharge en attente de paiement";
    if (entry.status === "FAILED") return "Recharge échouée";
    return "Recharge annulée";
  }
  if (entry.type === "REFUND") return entry.description;
  return entry.campaignTitle ? `Envoi — ${entry.campaignTitle}` : entry.description;
}

function MarketingBalanceCard({ demo }: { demo: boolean }) {
  const [data, setData] = useState<BalanceData | null>(demo ? DEMO_BALANCE : null);
  const [custom, setCustom] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    if (demo) return;
    try {
      const response = await fetch("/api/merchant/marketing-balance");
      if (response.ok) setData((await response.json()) as BalanceData);
    } catch {
      // Le solde reste masqué ; les campagnes gratuites continuent de fonctionner.
    }
  }, [demo]);

  useEffect(() => {
    void load();
    const topup = new URLSearchParams(window.location.search).get("topup");
    if (topup === "success") {
      setNotice("Paiement reçu. Votre solde sera crédité dès la confirmation de Stripe (quelques secondes).");
      // Le crédit arrive par webhook : on relit le solde après un court délai.
      const timer = window.setTimeout(() => void load(), 4000);
      return () => window.clearTimeout(timer);
    }
    if (topup === "cancelled") setNotice("Recharge annulée : aucun montant n'a été débité ni crédité.");
  }, [load]);

  if (!data) return null;

  const customCents = Math.round(Number(custom.replace(",", ".")) * 100);
  const customValid = Number.isFinite(customCents) && customCents >= data.minTopupCents && customCents <= data.maxTopupCents;

  async function topup(cents: number) {
    if (demo) return;
    setBusy(true);
    setError(null);
    await startTopup(cents, setError);
    setBusy(false);
  }

  return (
    <section className="glass-panel space-y-4 p-5 sm:p-6" aria-label="Solde marketing">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--violet-bright)]">Solde marketing</p>
          <p className="mt-1 text-3xl font-black text-[var(--ink)]">{formatCents(data.balanceCents)}</p>
          <p className="text-xs text-[var(--muted-strong)]">
            Débité à chaque envoi payant : notification membres {formatCents(CAMPAIGN_PRICE_CENTS.MEMBER_NOTIFICATION)},
            secteur {formatCents(CAMPAIGN_PRICE_CENTS.NETWORK_NOTIFICATION)}, e-mail membres{" "}
            {formatCents(CAMPAIGN_PRICE_CENTS.MEMBER_EMAIL)}, e-mail prospects{" "}
            {formatCents(CAMPAIGN_PRICE_CENTS.NETWORK_EMAIL)} — prix fixes, quel que soit le nombre de destinataires.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {data.presetsCents.map((cents) => (
            <Button key={cents} type="button" variant="secondary" disabled={busy} onClick={() => void topup(cents)}>
              +{formatCents(cents)}
            </Button>
          ))}
        </div>
      </div>

      <form
        className="flex flex-wrap items-center gap-2"
        onSubmit={(event) => {
          event.preventDefault();
          if (customValid) void topup(customCents);
        }}
      >
        <label className="text-xs text-[var(--muted)]" htmlFor="marketing-topup-custom">
          Autre montant (min. {formatCents(data.minTopupCents)})
        </label>
        <input
          id="marketing-topup-custom"
          inputMode="decimal"
          value={custom}
          onChange={(event) => setCustom(event.target.value)}
          placeholder="25"
          className="w-24 rounded-lg border border-[var(--line)] bg-transparent px-2 py-1 text-sm"
        />
        <span className="text-sm text-[var(--muted)]">€</span>
        <Button type="submit" disabled={busy || !customValid}>
          Recharger
        </Button>
      </form>

      {notice ? <p className="text-sm text-[var(--muted-strong)]">{notice}</p> : null}
      {error ? <p className="text-sm text-[var(--danger)]">{error}</p> : null}

      {data.history.length > 0 ? (
        <div>
          <p className="text-xs font-bold text-[var(--muted)]">Historique</p>
          <ul className="mt-2 divide-y divide-[var(--line)]">
            {data.history.map((entry) => {
              const sign = entry.type === "DEBIT" ? "−" : entry.status === "PAID" ? "+" : "";
              return (
                <li key={entry.id} className="flex items-center justify-between gap-3 py-2 text-sm">
                  <span>
                    <span className="font-semibold text-[var(--ink)]">{ledgerLabel(entry)}</span>
                    <span className="block text-xs text-[var(--muted)]">
                      {formatDate(entry.createdAt)}
                      {entry.type === "DEBIT" && entry.campaignStatus === "PARTIALLY_SENT" ? " · livraison partielle" : ""}
                      {entry.type === "DEBIT" && entry.campaignStatus === "FAILED" ? " · envoi échoué" : ""}
                      {entry.type === "DEBIT" && entry.campaignStatus === "SCHEDULED" ? " · programmé" : ""}
                    </span>
                  </span>
                  <strong className="text-[var(--ink)]">
                    {sign}
                    {formatCents(entry.amountCents)}
                  </strong>
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}
    </section>
  );
}
