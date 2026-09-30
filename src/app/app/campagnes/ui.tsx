"use client";

import Link from "next/link";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type ReactElement,
} from "react";
import { Button } from "@/components/ui";
import { CAMPAIGN_PRICE_CENTS } from "@/lib/campaign-prices";
import {
  MIN_HOURS_PER_DAY,
  SPONSORED_HOUR_RATE_CENTS,
  priceSponsoredHours,
  rateForParisHour,
  validateSponsoredSchedule,
  type SponsoredDaySelection,
} from "@/lib/sponsored-hours-pricing";

type Channel = "IN_APP_PUSH" | "EMAIL";
type Audience = "MERCHANT_MEMBERS" | "NETWORK_LOCAL";
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
  fundingMode?: "TEST" | "LIVE" | null;
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
  NEEDS_CHANGES: "Correction demandée",
  APPROVED: "Visuel prêt — à valider",
  REJECTED: "Refusée",
  SCHEDULED: "Programmée",
  LIVE: "En cours de diffusion",
  SUSPENDED: "Suspendue par Fideto",
  ENDED: "Terminée",
  STOPPED: "Arrêtée par Fideto",
  CANCELLED: "Annulée",
};

export function formatCents(cents: number) {
  return (cents / 100).toLocaleString("fr-FR", { style: "currency", currency: "EUR" });
}

export function formatDate(iso: string) {
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
  const [sponsorPreview, setSponsorPreview] = useState<{
    adRequestId: string;
    loading: boolean;
    days: number;
    requiresPayment: boolean;
    priceCents: number;
    breakdown: { date: string; hours: number[]; priceCents: number }[] | null;
  } | null>(null);

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

  async function openSponsorPreview(adRequestId: string) {
    if (demo) return;
    setError(null);
    setSponsorPreview({ adRequestId, loading: true, days: 0, requiresPayment: false, priceCents: 0, breakdown: null });
    try {
      const response = await fetch(`/api/merchant/ads/${adRequestId}/confirm`);
      const data = (await response.json()) as {
        days?: number;
        requiresPayment?: boolean;
        priceCents?: number;
        breakdown?: { byDay: { date: string; hours: number[]; priceCents: number }[] } | null;
        error?: string;
      };
      if (!response.ok) {
        setError(data.error ?? "Impossible de calculer le prix.");
        setSponsorPreview(null);
        return;
      }
      setSponsorPreview({
        adRequestId,
        loading: false,
        days: data.days ?? 0,
        requiresPayment: Boolean(data.requiresPayment),
        priceCents: data.priceCents ?? 0,
        breakdown: data.breakdown?.byDay ?? null,
      });
    } catch {
      setError("Impossible de calculer le prix. Réessayez.");
      setSponsorPreview(null);
    }
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
      setSponsorPreview(null);
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

      <MarketingBalanceSummary demo={demo} />

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
                <span className="campaign-activity-meta">{recipientsLabel}{c.fundingMode === "TEST" ? " · test (simulation)" : ""}</span>
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
                            void openSponsorPreview(ad!.id);
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

      {sponsorPreview ? (
        <div className="glass-panel space-y-3 p-5" aria-label="Confirmation du paiement de la mise en avant">
          <p className="text-sm font-bold text-[var(--ink)]">Confirmer et payer la mise en avant</p>
          {sponsorPreview.loading ? (
            <p className="text-sm text-[var(--muted-strong)]">Calcul du prix…</p>
          ) : (
            <>
              {sponsorPreview.breakdown ? (
                <div className="space-y-1">
                  {sponsorPreview.breakdown.map((d) => (
                    <div key={d.date} className="campaign-wizard-summary-row">
                      <span className="text-xs text-[var(--muted)]">
                        {formatDate(new Date(`${d.date}T00:00:00`).toISOString())} — {d.hours.length} h
                      </span>
                      <span className="text-sm font-bold text-[var(--ink)]">{formatCents(d.priceCents)}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-[var(--muted)]">{sponsorPreview.days} jour{sponsorPreview.days > 1 ? "s" : ""} (tarif historique 5 €/jour).</p>
              )}
              <div className="campaign-wizard-summary-row border-t border-[var(--border)] pt-2">
                <span className="text-xs font-bold text-[var(--muted)]">Montant à débiter</span>
                <span className="text-sm font-black text-[var(--ink)]">
                  {sponsorPreview.requiresPayment ? formatCents(sponsorPreview.priceCents) : "0 € — couvert par votre quota"}
                </span>
              </div>
              <div className="flex gap-2">
                <Button type="button" onClick={() => void confirmSponsor(sponsorPreview.adRequestId)}>
                  {sponsorPreview.requiresPayment ? `Confirmer et payer ${formatCents(sponsorPreview.priceCents)}` : "Confirmer"}
                </Button>
                <Button type="button" variant="secondary" onClick={() => setSponsorPreview(null)}>
                  Annuler
                </Button>
              </div>
            </>
          )}
        </div>
      ) : null}
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
  testMode: boolean;
  paymentsAllowed: boolean;
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
            testMode: false,
            paymentsAllowed: true,
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
          testMode: boolean;
          paymentsAllowed: boolean;
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
            testMode: data.testMode,
            paymentsAllowed: data.paymentsAllowed,
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
  const paymentsBlocked = Boolean(estimate?.requiresPayment && !estimate.paymentsAllowed);
  const insufficientBalance = Boolean(
    estimate?.requiresPayment && (paymentsBlocked || estimate.balanceCents < estimate.priceCents),
  );
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

            {estimate?.testMode ? (
              <p className="text-sm font-semibold text-[var(--muted-strong)]">
                Paiements de test : cet envoi est simulé, aucun client réel ne sera contacté.
              </p>
            ) : null}

            {paymentsBlocked ? (
              <p className="text-sm font-semibold text-[var(--danger)]">
                Les paiements de test sont réservés au commerce de test. Vos quotas gratuits restent utilisables.
              </p>
            ) : null}

            {insufficientBalance && estimate && !paymentsBlocked ? (
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

function todayDateInputValue() {
  return new Date().toISOString().slice(0, 10);
}

function addDaysToDateInput(dateInput: string, days: number) {
  const d = new Date(`${dateInput}T00:00:00`);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

/** Reflète priceSponsoredHours (src/lib/sponsored-hours-pricing.ts) : le serveur recalcule
 * toujours le prix réel à la confirmation, ceci n'est qu'une estimation d'affichage. Même règle
 * « tout ou rien » que l'ancien tarif journalier : couverte entièrement par le quota si assez de
 * jours restants, sinon toute la réservation est payante (jamais de consommation partielle). */
function estimateSponsorPricing(days: SponsoredDaySelection[], includedDaysRemaining: number) {
  const hourly = priceSponsoredHours(days);
  const coveredByQuota = includedDaysRemaining >= hourly.totalDays && hourly.totalDays > 0;
  return {
    ...hourly,
    requiresPayment: !coveredByQuota,
    priceCents: coveredByQuota ? 0 : hourly.totalCents,
    daysFromQuota: coveredByQuota ? hourly.totalDays : 0,
  };
}

function formatHourRange(hour: number) {
  return `${String(hour).padStart(2, "0")}h–${String((hour + 1) % 24).padStart(2, "0")}h`;
}

const HOUR_BAND_CLASS: Record<string, string> = {
  NIGHT: "sponsor-hour-night",
  DAY: "sponsor-hour-day",
  EVENING: "sponsor-hour-evening",
  HAPPY_HOUR: "sponsor-hour-happy",
};

function bandForHour(hour: number): keyof typeof HOUR_BAND_CLASS {
  if (hour < 8) return "NIGHT";
  if (hour < 19) return "DAY";
  if (hour < 22) return "EVENING";
  return "HAPPY_HOUR";
}

/**
 * Sélection des jours et heures d'exposition (Partie 15) : au moins 1 jour, au moins 3 heures
 * par jour choisi. « Copier vers » permet de dupliquer les heures d'un jour sur d'autres jours
 * déjà ajoutés, qui restent ensuite ajustables individuellement.
 */
/** Créneau [début, fin) en heure locale Paris — fin 24 = jusqu'à minuit (reste dans le même jour). */
type Slot = [number, number];

function hoursToSlots(hours: number[]): Slot[] {
  const sorted = [...hours].sort((a, b) => a - b);
  const slots: Slot[] = [];
  for (const h of sorted) {
    const last = slots[slots.length - 1];
    if (last && last[1] === h) last[1] = h + 1;
    else slots.push([h, h + 1]);
  }
  return slots;
}

function slotsToHours(slots: Slot[]): number[] {
  const set = new Set<number>();
  for (const [start, end] of slots) {
    for (let h = start; h < end; h++) if (h >= 0 && h < 24) set.add(h);
  }
  return [...set].sort((a, b) => a - b);
}

function slotAmountCents(slot: Slot) {
  let sum = 0;
  for (let h = slot[0]; h < slot[1]; h++) sum += rateForParisHour(h);
  return sum;
}

function slotLabel(slot: Slot) {
  return `${formatHourRange(slot[0]).split("–")[0]}–${slot[1] === 24 ? "00h" : formatHourRange(slot[1]).split("–")[0]}`;
}

function scheduleDayError(hours: number[], slots: Slot[]): string {
  if (hours.length === 0) return "Choisissez au moins 3 h pour ce jour.";
  const ordered = [...slots].sort((a, b) => a[0] - b[0]);
  for (let i = 0; i < ordered.length; i++) {
    if (ordered[i][0] >= ordered[i][1]) return "La fin doit être après le début.";
    if (i > 0 && ordered[i][0] < ordered[i - 1][1]) return "Ces créneaux se chevauchent.";
  }
  if (hours.length < MIN_HOURS_PER_DAY) return `Il manque ${MIN_HOURS_PER_DAY - hours.length} h pour atteindre le minimum.`;
  return "";
}

function hourSelectOptions(value: number, isEnd: boolean) {
  const options: ReactElement[] = [];
  for (let h = 0; h <= 24; h++) {
    if ((!isEnd && h === 24) || (isEnd && h === 0)) continue;
    options.push(
      <option key={h} value={h}>
        {h === 24 ? "00 h (fin de journée)" : formatHourRange(h).split("–")[0]}
      </option>,
    );
  }
  return options;
}

type ScheduleDayState = { date: string; slots: Slot[] };

/**
 * Sélection des jours et heures d'exposition (Partie 15/16) : une journée ouverte à la fois,
 * créneaux modifiables (début/fin), ajout/retrait de jour ou de créneau, copie des horaires sur
 * les autres jours. Émet toujours des heures individuelles (0-23) au parent — c'est ce que
 * valide et facture le serveur (voir sponsored-hours-pricing.ts) ; les créneaux ne sont qu'une
 * représentation d'édition côté client.
 */
function HourlySchedulePicker({
  initial,
  onChange,
}: {
  initial: SponsoredDaySelection[];
  onChange: (value: SponsoredDaySelection[]) => void;
}) {
  const [days, setDays] = useState<ScheduleDayState[]>(() =>
    initial.length > 0 ? initial.map((d) => ({ date: d.date, slots: hoursToSlots(d.hours) })) : [],
  );
  const [active, setActive] = useState<string | null>(days[0]?.date ?? null);
  const [newDate, setNewDate] = useState(todayDateInputValue);

  useEffect(() => {
    onChange(days.map((d) => ({ date: d.date, hours: slotsToHours(d.slots) })));
    // onChange volontairement omis des dépendances : seul un changement de `days` doit émettre.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [days]);

  function addDay() {
    if (!newDate || days.some((d) => d.date === newDate)) return;
    const next = [...days, { date: newDate, slots: [[8, 11] as Slot] }].sort((a, b) => a.date.localeCompare(b.date));
    setDays(next);
    setActive(newDate);
    setNewDate(addDaysToDateInput(newDate, 1));
  }

  function removeDay(date: string) {
    const next = days.filter((d) => d.date !== date);
    setDays(next);
    if (active === date) setActive(next[0]?.date ?? null);
  }

  function updateSlots(date: string, slots: Slot[]) {
    setDays(days.map((d) => (d.date === date ? { ...d, slots } : d)));
  }

  function copyToOthers(date: string) {
    const source = days.find((d) => d.date === date);
    if (!source) return;
    setDays(days.map((d) => (d.date === date ? d : { ...d, slots: source.slots.map((s) => [...s] as Slot) })));
  }

  return (
    <div>
      <div className="sponsor-rates" aria-label="Tarifs par heure">
        <div className="sponsor-rate">
          <span>
            <i style={{ background: "var(--blue, #6366f1)" }} />
            00 h – 08 h
          </span>
          <strong>
            {formatCents(SPONSORED_HOUR_RATE_CENTS.NIGHT)} <small style={{ fontWeight: 500 }}>/ h</small>
          </strong>
        </div>
        <div className="sponsor-rate">
          <span>
            <i style={{ background: "#f2bd8c" }} />
            08 h – 19 h
          </span>
          <strong>
            {formatCents(SPONSORED_HOUR_RATE_CENTS.DAY)} <small style={{ fontWeight: 500 }}>/ h</small>
          </strong>
        </div>
        <div className="sponsor-rate">
          <span>
            <i style={{ background: "#ee97c9" }} />
            19 h – 22 h
          </span>
          <strong>
            {formatCents(SPONSORED_HOUR_RATE_CENTS.EVENING)} <small style={{ fontWeight: 500 }}>/ h</small>
          </strong>
        </div>
        <div className="sponsor-rate">
          <span>
            <i style={{ background: "var(--violet-bright)" }} />
            22 h – 00 h · Happy Hour
          </span>
          <strong>
            {formatCents(SPONSORED_HOUR_RATE_CENTS.HAPPY_HOUR)} <small style={{ fontWeight: 500 }}>/ h</small>
          </strong>
        </div>
      </div>

      <div className="sponsor-date-bar">
        <div>
          <p className="text-xs font-bold text-[var(--ink)]">Vos journées</p>
          <p className="text-[11px] text-[var(--muted)]">Modifiez uniquement le jour qui vous intéresse.</p>
        </div>
        <div className="sponsor-date-add">
          <input
            type="date"
            aria-label="Jour à ajouter"
            value={newDate}
            min={todayDateInputValue()}
            onChange={(e) => setNewDate(e.target.value)}
          />
          <Button type="button" variant="secondary" onClick={addDay}>
            + Ajouter un jour
          </Button>
        </div>
      </div>

      {days.length === 0 ? (
        <p className="text-xs text-[var(--muted)]">Ajoutez au moins un jour, puis choisissez ses heures d&apos;exposition.</p>
      ) : (
        <div className="sponsor-days">
          {days.map((day) => {
            const hours = slotsToHours(day.slots);
            const err = scheduleDayError(hours, day.slots);
            const opened = active === day.date;
            const amount = day.slots.reduce((sum, s) => sum + slotAmountCents(s), 0);
            return (
              <div key={day.date} className={`sponsor-day ${opened ? "is-open" : ""}`}>
                <div className="sponsor-day-top">
                  <div className="sponsor-date-main">
                    {formatDate(new Date(`${day.date}T00:00:00`).toISOString())}
                    <span>
                      {hours.length} h sélectionnée{hours.length > 1 ? "s" : ""}
                    </span>
                  </div>
                  <div className="sponsor-day-summary">
                    {day.slots.length > 0 ? (
                      day.slots.map((s, i) => (
                        <span key={i} className="sponsor-slot-tag">
                          {slotLabel(s)}
                        </span>
                      ))
                    ) : (
                      <span className="sponsor-slot-tag is-empty">Aucun créneau</span>
                    )}
                  </div>
                  <div className="sponsor-day-price">
                    {formatCents(amount)}
                    <span>{!err ? "Prêt" : "À compléter"}</span>
                  </div>
                  <div className="sponsor-day-action">
                    <button type="button" className="sponsor-tiny" onClick={() => setActive(opened ? null : day.date)}>
                      {opened ? "Réduire" : "Modifier"}
                    </button>
                    <button
                      type="button"
                      className="sponsor-tiny is-danger"
                      title="Retirer ce jour"
                      aria-label={`Retirer le ${day.date}`}
                      onClick={() => removeDay(day.date)}
                    >
                      ×
                    </button>
                  </div>
                </div>
                {opened ? (
                  <div className="sponsor-day-details">
                    <div className="sponsor-slots">
                      {day.slots.map((slot, i) => (
                        <div key={i} className="sponsor-slot-row">
                          <select
                            aria-label={`Début du créneau ${i + 1}`}
                            value={slot[0]}
                            onChange={(e) => {
                              const next = day.slots.map((s, j) => (j === i ? ([Number(e.target.value), s[1]] as Slot) : s));
                              updateSlots(day.date, next);
                            }}
                          >
                            {hourSelectOptions(slot[0], false)}
                          </select>
                          <span className="sponsor-dash">→</span>
                          <select
                            aria-label={`Fin du créneau ${i + 1}`}
                            value={slot[1]}
                            onChange={(e) => {
                              const next = day.slots.map((s, j) => (j === i ? ([s[0], Number(e.target.value)] as Slot) : s));
                              updateSlots(day.date, next);
                            }}
                          >
                            {hourSelectOptions(slot[1], true)}
                          </select>
                          <span className="sponsor-slot-amount">{formatCents(slotAmountCents(slot))}</span>
                          <button
                            type="button"
                            className="sponsor-tiny"
                            title="Retirer ce créneau"
                            aria-label={`Retirer le créneau ${i + 1}`}
                            onClick={() => updateSlots(day.date, day.slots.filter((_, j) => j !== i))}
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                    <div className="sponsor-slot-controls">
                      <button
                        type="button"
                        className="btn-secondary sponsor-tiny"
                        onClick={() => updateSlots(day.date, [...day.slots, [8, 11]])}
                      >
                        + Ajouter un créneau
                      </button>
                      {days.length > 1 ? (
                        <button type="button" className="btn-secondary sponsor-tiny" onClick={() => copyToOthers(day.date)}>
                          Copier sur les autres jours
                        </button>
                      ) : null}
                    </div>
                    {err ? <p className="sponsor-error mt-2 text-xs text-[var(--danger)]">{err}</p> : null}
                    <p className="sponsor-hint mt-1">
                      Chaque créneau reste dans le jour choisi ; un horaire 22 h–00 h compte pour ce jour.
                    </p>
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/* Visuel de la mise en avant — deux parcours (Partie 14)                  */
/* ---------------------------------------------------------------------- */

/** Taille du bandeau exporté par le recadrage (carré, cohérent avec le rendu SponsoredBanner). */
const SELF_VISUAL_OUTPUT_PX = 800;
const MAX_FIDETO_IMAGES = 5;

export type VisualPickerValue =
  | { mode: "SELF"; selfUrl: string | null; fidetoUrls: [] }
  | { mode: "FIDETO"; selfUrl: null; fidetoUrls: string[] };

async function uploadCampaignMedia(dataUrl: string): Promise<string> {
  const res = await fetch("/api/merchant/campaigns/media", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ dataUrl }),
  });
  const data = (await res.json().catch(() => null)) as { url?: string; error?: string } | null;
  if (!res.ok || !data?.url) throw new Error(data?.error || "Image invalide.");
  return data.url;
}

async function deleteCampaignMediaUrl(url: string) {
  try {
    await fetch("/api/merchant/campaigns/media", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
    });
  } catch {
    // Le fichier restera orphelin côté stockage — sans conséquence, jamais référencé nulle part.
  }
}

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
 * Recadrage carré simple : l'image source est affichée dans un cadre carré, déplaçable à la
 * souris/au doigt et zoomable via un curseur ; « Valider le recadrage » exporte exactement le
 * cadre visible en 800×800 — le format réellement accepté par le bandeau sponsorisé.
 */
function SelfVisualCropper({
  file,
  onCancel,
  onConfirm,
  onError,
}: {
  file: File;
  onCancel: () => void;
  onConfirm: (dataUrl: string) => void;
  onError: (message: string) => void;
}) {
  const [imgEl, setImgEl] = useState<HTMLImageElement | null>(null);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const dragRef = useRef<{ startX: number; startY: number; origin: { x: number; y: number } } | null>(null);
  const frameRef = useRef<HTMLDivElement | null>(null);
  const FRAME_PX = 260;

  useEffect(() => {
    let cancelled = false;
    readFileAsDataUrl(file)
      .then((dataUrl) => loadImageElement(dataUrl))
      .then((img) => {
        if (!cancelled) setImgEl(img);
      })
      .catch(() => onError("Image illisible. Utilisez un fichier PNG, JPEG ou WebP."));
    return () => {
      cancelled = true;
    };
  }, [file, onError]);

  if (!imgEl) {
    return <p className="text-xs text-[var(--muted)]">Chargement de l&apos;image…</p>;
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

  function confirmCrop() {
    if (!imgEl) return;
    const canvas = document.createElement("canvas");
    canvas.width = SELF_VISUAL_OUTPUT_PX;
    canvas.height = SELF_VISUAL_OUTPUT_PX;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      onError("Recadrage impossible sur cet appareil.");
      return;
    }
    const exportScale = SELF_VISUAL_OUTPUT_PX / FRAME_PX;
    const drawWidth = displayWidth * exportScale;
    const drawHeight = displayHeight * exportScale;
    const drawX = SELF_VISUAL_OUTPUT_PX / 2 - drawWidth / 2 + clampedOffset.x * exportScale;
    const drawY = SELF_VISUAL_OUTPUT_PX / 2 - drawHeight / 2 + clampedOffset.y * exportScale;
    ctx.drawImage(imgEl, drawX, drawY, drawWidth, drawHeight);
    onConfirm(canvas.toDataURL("image/jpeg", 0.9));
  }

  return (
    <div className="space-y-3 rounded-xl border border-[var(--border)] bg-[var(--panel-bg)] p-3">
      <div
        ref={frameRef}
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
      <label className="block text-xs text-[var(--muted)]">
        Zoom
        <input
          type="range"
          min={1}
          max={3}
          step={0.05}
          value={zoom}
          onChange={(e) => setZoom(Number(e.target.value))}
          className="mt-1 w-full"
        />
      </label>
      <p className="text-[11px] text-[var(--muted)]">Déplacez l&apos;image pour cadrer le bandeau (format carré).</p>
      <div className="flex gap-2">
        <Button type="button" onClick={confirmCrop}>
          Valider le recadrage
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel}>
          Annuler
        </Button>
      </div>
    </div>
  );
}

function VisualPicker({
  value,
  onChange,
  onError,
}: {
  value: VisualPickerValue;
  onChange: (value: VisualPickerValue) => void;
  onError: (message: string) => void;
}) {
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [selfBusy, setSelfBusy] = useState(false);
  const [fidetoBusy, setFidetoBusy] = useState(false);

  function switchMode(mode: "SELF" | "FIDETO") {
    if (mode === value.mode) return;
    // On change de parcours : on retire les fichiers déjà envoyés sous l'autre parcours.
    if (value.mode === "SELF" && value.selfUrl) void deleteCampaignMediaUrl(value.selfUrl);
    if (value.mode === "FIDETO") value.fidetoUrls.forEach((url) => void deleteCampaignMediaUrl(url));
    setPendingFile(null);
    onChange(mode === "SELF" ? { mode: "SELF", selfUrl: null, fidetoUrls: [] } : { mode: "FIDETO", selfUrl: null, fidetoUrls: [] });
  }

  async function onSelfFileSelected(file: File | null) {
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      onError("Image trop lourde (5 Mo maximum).");
      return;
    }
    if (value.mode === "SELF" && value.selfUrl) await deleteCampaignMediaUrl(value.selfUrl);
    onChange({ mode: "SELF", selfUrl: null, fidetoUrls: [] });
    setPendingFile(file);
  }

  async function onCropConfirm(dataUrl: string) {
    setSelfBusy(true);
    try {
      const url = await uploadCampaignMedia(dataUrl);
      onChange({ mode: "SELF", selfUrl: url, fidetoUrls: [] });
      setPendingFile(null);
    } catch (err) {
      onError(err instanceof Error ? err.message : "Envoi de l'image impossible.");
    } finally {
      setSelfBusy(false);
    }
  }

  async function removeSelfImage() {
    if (value.mode === "SELF" && value.selfUrl) await deleteCampaignMediaUrl(value.selfUrl);
    onChange({ mode: "SELF", selfUrl: null, fidetoUrls: [] });
    setPendingFile(null);
  }

  async function onFidetoFilesSelected(files: FileList | null) {
    if (!files || files.length === 0 || value.mode !== "FIDETO") return;
    const remaining = MAX_FIDETO_IMAGES - value.fidetoUrls.length;
    if (remaining <= 0) {
      onError(`Maximum ${MAX_FIDETO_IMAGES} images.`);
      return;
    }
    const selected = Array.from(files).slice(0, remaining);
    setFidetoBusy(true);
    try {
      const newUrls: string[] = [];
      for (const file of selected) {
        if (file.size > 5 * 1024 * 1024) {
          onError(`« ${file.name} » dépasse 5 Mo — ignorée.`);
          continue;
        }
        const dataUrl = await readFileAsDataUrl(file);
        newUrls.push(await uploadCampaignMedia(dataUrl));
      }
      onChange({ mode: "FIDETO", selfUrl: null, fidetoUrls: [...value.fidetoUrls, ...newUrls] });
    } catch (err) {
      onError(err instanceof Error ? err.message : "Envoi d'une image impossible.");
    } finally {
      setFidetoBusy(false);
    }
  }

  async function removeFidetoImage(url: string) {
    if (value.mode !== "FIDETO") return;
    await deleteCampaignMediaUrl(url);
    onChange({ mode: "FIDETO", selfUrl: null, fidetoUrls: value.fidetoUrls.filter((u) => u !== url) });
  }

  return (
    <div>
      <div className="sponsor-visual-grid" role="group" aria-label="Mode de création du visuel">
        <button
          type="button"
          onClick={() => switchMode("SELF")}
          className={`sponsor-visual-option ${value.mode === "SELF" ? "is-active" : ""}`}
        >
          <b>Je crée mon visuel</b>
          <span>J&apos;ajoute un bandeau et je contrôle son cadrage.</span>
        </button>
        <button
          type="button"
          onClick={() => switchMode("FIDETO")}
          className={`sponsor-visual-option ${value.mode === "FIDETO" ? "is-active" : ""}`}
        >
          <b>Fideto crée mon visuel</b>
          <span>J&apos;envoie jusqu&apos;à 5 images, Fideto prépare le bandeau.</span>
        </button>
      </div>

      {value.mode === "SELF" ? (
        <div>
          <div className="sponsor-notice">
            Ajoutez votre bandeau, vérifiez l&apos;aperçu et ajustez son cadrage avant de continuer.
          </div>
          {!pendingFile && !value.selfUrl ? (
            <label className="sponsor-dropzone">
              <span className="sponsor-drop-icon" aria-hidden>
                ▧
              </span>
              <b>Importer mon bandeau</b>
              <small>PNG, JPG ou WebP · 5 Mo max · aperçu au format de diffusion (carré)</small>
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                className="sr-only"
                onChange={(e) => void onSelfFileSelected(e.target.files?.[0] ?? null)}
              />
            </label>
          ) : null}
          {pendingFile ? (
            <SelfVisualCropper
              file={pendingFile}
              onCancel={() => setPendingFile(null)}
              onConfirm={onCropConfirm}
              onError={onError}
            />
          ) : null}
          {selfBusy ? <p className="mt-2 text-xs text-[var(--muted)]">Envoi de l&apos;image…</p> : null}
          {value.selfUrl ? (
            <div className="mt-3 flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={value.selfUrl} alt="Visuel recadré, tel qu'il sera publié" className="h-16 w-16 rounded-lg object-cover" />
              <div className="flex gap-2">
                <Button type="button" variant="secondary" onClick={() => document.getElementById("self-visual-replace")?.click()}>
                  Remplacer
                </Button>
                <input
                  id="self-visual-replace"
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  className="hidden"
                  onChange={(e) => void onSelfFileSelected(e.target.files?.[0] ?? null)}
                />
                <Button type="button" variant="secondary" onClick={() => void removeSelfImage()}>
                  Supprimer
                </Button>
              </div>
            </div>
          ) : null}
        </div>
      ) : (
        <div>
          <div className="sponsor-notice">
            Après votre demande, vous recevrez un aperçu à approuver. Aucun bandeau n&apos;est publié sans votre validation.
          </div>
          <label className="sponsor-dropzone">
            <span className="sponsor-drop-icon" aria-hidden>
              ＋
            </span>
            <b>Ajouter vos images</b>
            <small>Jusqu&apos;à {MAX_FIDETO_IMAGES} images · PNG, JPG ou WebP · 5 Mo maximum par image</small>
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp"
              multiple
              disabled={value.fidetoUrls.length >= MAX_FIDETO_IMAGES}
              className="sr-only"
              onChange={(e) => void onFidetoFilesSelected(e.target.files)}
            />
          </label>
          {fidetoBusy ? <p className="mt-2 text-xs text-[var(--muted)]">Envoi des images…</p> : null}
          {value.fidetoUrls.length > 0 ? (
            <div className="sponsor-files" aria-live="polite">
              {value.fidetoUrls.map((url) => (
                <div key={url} className="sponsor-file">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={url} alt="" />
                  <button type="button" aria-label="Retirer cette image" onClick={() => void removeFidetoImage(url)}>
                    ×
                  </button>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
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
  const [wizardStep, setWizardStep] = useState<"schedule" | "visual" | "validation">("schedule");
  const [schedule, setSchedule] = useState<SponsoredDaySelection[]>([]);
  const [objective, setObjective] = useState("");
  const [text, setText] = useState("");
  const [ctaUrl, setCtaUrl] = useState("");
  const [visual, setVisual] = useState<VisualPickerValue>({ mode: "FIDETO", selfUrl: null, fidetoUrls: [] });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const includedDaysRemaining = quotas.find((q) => q.kind === "SPONSORED_DAY")?.remaining ?? 0;
  const pricing = estimateSponsorPricing(schedule, includedDaysRemaining);
  const scheduleCheck = validateSponsoredSchedule(schedule);
  const visualComplete =
    (visual.mode === "SELF" && Boolean(visual.selfUrl)) || (visual.mode === "FIDETO" && visual.fidetoUrls.length > 0);

  function goToVisual() {
    if (!scheduleCheck.ok) {
      setError(scheduleCheck.error);
      return;
    }
    setError(null);
    setWizardStep("visual");
  }

  function goToValidation() {
    if (!text.trim()) {
      setError("Ajoutez le texte du bandeau avant de continuer.");
      return;
    }
    if (!visualComplete) {
      setError(
        visual.mode === "SELF" ? "Ajoutez et recadrez votre visuel avant de continuer." : "Envoyez au moins une image avant de continuer.",
      );
      return;
    }
    setError(null);
    setWizardStep("validation");
  }

  async function submit() {
    if (demo) {
      setDone(true);
      return;
    }
    if (!scheduleCheck.ok) {
      setError(scheduleCheck.error);
      setWizardStep("schedule");
      return;
    }
    if (!text.trim() || !visualComplete) {
      setError("Complétez les étapes précédentes avant d'envoyer.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const response = await fetch("/api/merchant/ads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requestedText: text,
          visualMode: visual.mode,
          requestedImageUrl: visual.mode === "SELF" ? visual.selfUrl : null,
          requestedImageUrls: visual.mode === "FIDETO" ? visual.fidetoUrls : undefined,
          objective: objective.trim() || null,
          ctaUrl: ctaUrl.trim() || null,
          hourlySchedule: schedule,
        }),
      });
      if (!response.ok) {
        const body = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(body?.error || "Envoi impossible.");
      }
      setDone(true);
    } catch (err) {
      setError(err instanceof Error && err.message ? err.message : "Impossible d'envoyer la demande. Réessayez.");
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

  const previewThumb = visual.mode === "SELF" ? visual.selfUrl : (visual.fidetoUrls[0] ?? null);

  return (
    <div className="space-y-4">
      <button type="button" onClick={onClose} className="text-xs font-semibold text-[var(--muted)]">
        ← Retour aux campagnes
      </button>

      <div className="sponsor-stepper" aria-label="Étapes de création">
        <button
          type="button"
          className={`sponsor-step ${wizardStep === "schedule" ? "is-active" : "is-done"}`}
          onClick={() => setWizardStep("schedule")}
        >
          <span className="sponsor-step-num">1</span> Horaires
        </button>
        <span className="sponsor-step-arrow">›</span>
        <button
          type="button"
          className={`sponsor-step ${wizardStep === "visual" ? "is-active" : scheduleCheck.ok ? "is-done" : ""}`}
          onClick={goToVisual}
        >
          <span className="sponsor-step-num">2</span> Visuel
        </button>
        <span className="sponsor-step-arrow">›</span>
        <span className={`sponsor-step ${wizardStep === "validation" ? "is-active" : ""}`}>
          <span className="sponsor-step-num">3</span> Validation
        </span>
      </div>

      <div className="sponsor-workspace">
        <div className="min-w-0">
          {wizardStep === "schedule" ? (
            <section className="card main-card p-5" aria-labelledby="schedule-title">
              <div>
                <h2 id="schedule-title" className="text-lg font-bold text-[var(--ink)]">
                  Quand voulez-vous être visible ?
                </h2>
                <p className="text-sm text-[var(--muted-strong)]">
                  Choisissez au moins {MIN_HOURS_PER_DAY} heures pour chaque jour. Vous pouvez combiner plusieurs créneaux.
                </p>
              </div>
              <HourlySchedulePicker initial={schedule} onChange={setSchedule} />
              {error ? <p className="mt-2 text-sm text-[var(--danger)]">{error}</p> : null}
              <div className="sponsor-bottom-actions">
                <span className="text-xs text-[var(--muted)]">Vous pourrez relire le total à l&apos;étape suivante.</span>
                <Button type="button" onClick={goToVisual} disabled={!scheduleCheck.ok}>
                  Continuer vers le visuel →
                </Button>
              </div>
            </section>
          ) : wizardStep === "visual" ? (
            <section className="card main-card p-5" aria-labelledby="visual-title">
              <div>
                <h2 id="visual-title" className="text-lg font-bold text-[var(--ink)]">
                  Votre visuel de campagne
                </h2>
                <p className="text-sm text-[var(--muted-strong)]">
                  Choisissez comment préparer le bandeau qui représentera votre commerce.
                </p>
              </div>
              <VisualPicker value={visual} onChange={setVisual} onError={setError} />
              <label className="mt-4 block text-xs text-[var(--muted)]">
                Texte du bandeau
                <textarea
                  className="profile-select mt-1 w-full"
                  rows={3}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  maxLength={1000}
                />
              </label>
              <label className="mt-3 block text-xs text-[var(--muted)]">
                Titre ou objectif (facultatif)
                <input
                  className="profile-select mt-1 w-full"
                  value={objective}
                  onChange={(e) => setObjective(e.target.value)}
                  maxLength={200}
                  placeholder="Ex. Faire découvrir notre nouvelle carte"
                />
              </label>
              <label className="mt-3 block text-xs text-[var(--muted)]">
                Lien à ouvrir (facultatif)
                <input
                  className="profile-select mt-1 w-full"
                  value={ctaUrl}
                  onChange={(e) => setCtaUrl(e.target.value)}
                  placeholder="https://…"
                />
              </label>
              {error ? <p className="mt-2 text-sm text-[var(--danger)]">{error}</p> : null}
              <div className="sponsor-bottom-actions">
                <button type="button" className="sponsor-tiny" onClick={() => setWizardStep("schedule")}>
                  ← Modifier les horaires
                </button>
                <Button type="button" onClick={goToValidation} disabled={!text.trim() || !visualComplete}>
                  Voir le récapitulatif →
                </Button>
              </div>
            </section>
          ) : (
            <section className="card main-card p-5" aria-labelledby="validation-title">
              <div>
                <h2 id="validation-title" className="text-lg font-bold text-[var(--ink)]">
                  Vérifiez avant d&apos;envoyer
                </h2>
                <p className="text-sm text-[var(--muted-strong)]">
                  Votre demande part en préparation chez Fideto. Le paiement n&apos;intervient qu&apos;après validation du visuel final.
                </p>
              </div>
              <div className="sponsor-notice">
                Comment ça marche : vous envoyez votre demande → Fideto prépare le visuel → vous recevez un aperçu → vous validez →
                vous payez → la campagne est programmée automatiquement.
              </div>
              <div className="campaign-wizard-summary space-y-1 rounded-xl border border-[var(--border)] bg-[var(--panel-bg)] p-4">
                <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--muted)]">Détail par jour</p>
                <div className="space-y-1">
                  {pricing.byDay.map((d) => (
                    <div key={d.date} className="campaign-wizard-summary-row">
                      <span className="text-xs text-[var(--muted)]">
                        {formatDate(new Date(`${d.date}T00:00:00`).toISOString())} — {d.hours.length} h
                      </span>
                      <span className="text-sm font-bold text-[var(--ink)]">{formatCents(d.priceCents)}</span>
                    </div>
                  ))}
                </div>
              </div>
              {error ? <p className="mt-2 text-sm text-[var(--danger)]">{error}</p> : null}
              <div className="sponsor-bottom-actions">
                <button type="button" className="sponsor-tiny" onClick={() => setWizardStep("visual")}>
                  ← Modifier le visuel
                </button>
                <Button type="button" onClick={() => void submit()} disabled={busy || !scheduleCheck.ok || !text.trim() || !visualComplete}>
                  {busy ? "…" : "Envoyer ma demande"}
                </Button>
              </div>
            </section>
          )}
        </div>

        <aside className="card sponsor-summary" aria-label="Récapitulatif">
          <h2 className="text-base font-bold text-[var(--ink)]">Votre mise en avant</h2>
          <p className="text-xs text-[var(--muted-strong)]">Le détail de votre sélection, à tout moment.</p>
          <div className="sponsor-ad-preview">
            {previewThumb ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={previewThumb} alt="" className="sponsor-ad-preview-thumb" />
            ) : (
              <span className="sponsor-ad-preview-empty" aria-hidden>
                ✦
              </span>
            )}
            <span className="sponsor-ad-preview-text">{text.trim() || "Votre commerce en lumière"}</span>
          </div>
          <p className="sponsor-summary-title">Réservation</p>
          <div className="sponsor-metric">
            <span>Jours choisis</span>
            <b>
              {pricing.totalDays} jour{pricing.totalDays > 1 ? "s" : ""}
            </b>
          </div>
          <div className="sponsor-metric">
            <span>Heures d&apos;exposition</span>
            <b>
              {pricing.totalHours} heure{pricing.totalHours > 1 ? "s" : ""}
            </b>
          </div>
          <div className="sponsor-divider" />
          <p className="sponsor-summary-title">Détail du prix</p>
          {pricing.byDay.length === 0 ? (
            <p className="text-xs text-[var(--muted)]">Ajoutez au moins un jour.</p>
          ) : (
            <div className="sponsor-cost-days">
              {pricing.byDay.map((d) => (
                <div key={d.date}>
                  <span>
                    {formatDate(new Date(`${d.date}T00:00:00`).toISOString())} · {d.hours.length} h
                  </span>
                  <b>{formatCents(d.priceCents)}</b>
                </div>
              ))}
            </div>
          )}
          <div className="sponsor-divider" />
          <div className="sponsor-total-row">
            <span>{pricing.requiresPayment ? "Total estimé" : "Couvert par votre quota"}</span>
            <strong>{pricing.requiresPayment ? formatCents(pricing.priceCents) : "0 €"}</strong>
          </div>
          <p className="sponsor-summary-note">Le montant exact est confirmé avant tout paiement.</p>
          {pricing.daysFromQuota > 0 ? (
            <p className="sponsor-summary-note">
              {pricing.daysFromQuota} jour{pricing.daysFromQuota > 1 ? "s" : ""} pris sur votre quota inclus.
            </p>
          ) : null}
          <div className="sponsor-steps-note">
            <span aria-hidden>✦</span>
            <span>
              {wizardStep === "schedule"
                ? "Étape suivante : ajoutez votre visuel ou confiez sa création à Fideto."
                : wizardStep === "visual"
                  ? "Votre visuel sera relu avant sa publication. Vous gardez la main sur le résultat."
                  : "Vérifiez le récapitulatif, puis envoyez votre demande."}
            </span>
          </div>
        </aside>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/* Solde marketing prépayé                                                 */
/* ---------------------------------------------------------------------- */

export type LedgerEntry = {
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

export type BalanceData = {
  balanceCents: number;
  presetsCents: number[];
  minTopupCents: number;
  maxTopupCents: number;
  history: LedgerEntry[];
  testMode?: boolean;
  paymentsAvailable?: boolean;
};

export const DEMO_BALANCE: BalanceData = {
  balanceCents: 1000,
  presetsCents: [500, 1000, 2000],
  minTopupCents: 500,
  maxTopupCents: 50000,
  history: [],
  testMode: false,
  paymentsAvailable: true,
};

/** Résumé compact affiché dans la page Campagnes — le détail (recharge, historique) vit sur /app/campagnes/solde. */
function MarketingBalanceSummary({ demo }: { demo: boolean }) {
  const [data, setData] = useState<{ balanceCents: number; testMode?: boolean } | null>(
    demo ? { balanceCents: DEMO_BALANCE.balanceCents, testMode: DEMO_BALANCE.testMode } : null,
  );

  useEffect(() => {
    if (demo) return;
    let active = true;
    fetch("/api/merchant/marketing-balance")
      .then((response) => (response.ok ? (response.json() as Promise<BalanceData>) : null))
      .then((json) => {
        if (active && json) setData({ balanceCents: json.balanceCents, testMode: json.testMode });
      })
      .catch(() => undefined);
    return () => {
      active = false;
    };
  }, [demo]);

  return (
    <section
      className="glass-panel flex flex-wrap items-center justify-between gap-3 p-5 sm:p-6"
      aria-label="Solde marketing"
    >
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--violet-bright)]">Solde marketing</p>
        <p className="mt-1 text-2xl font-black text-[var(--ink)]">{data ? formatCents(data.balanceCents) : "…"}</p>
        {data?.testMode ? (
          <p className="mt-1 text-xs font-bold text-[var(--violet-bright)]">
            Mode test — aucun vrai paiement n&apos;est encaissé.
          </p>
        ) : null}
      </div>
      <Link href="/app/campagnes/solde">
        <Button type="button" variant="secondary">
          Recharger
        </Button>
      </Link>
    </section>
  );
}

/** Démarre une recharge Stripe Checkout. Le montant est revalidé côté serveur. */
export async function startTopup(amountCents: number, onError: (message: string) => void) {
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

export function ledgerLabel(entry: LedgerEntry) {
  if (entry.type === "TOPUP") {
    if (entry.status === "PAID") return "Recharge";
    if (entry.status === "PENDING") return "Recharge en attente de paiement";
    if (entry.status === "FAILED") return "Recharge échouée";
    return "Recharge annulée";
  }
  if (entry.type === "REFUND") return entry.description;
  return entry.campaignTitle ? `Envoi — ${entry.campaignTitle}` : entry.description;
}
