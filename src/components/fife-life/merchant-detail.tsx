"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import { MerchantCardRenderer } from "./merchant-card-renderer";
import { CardEnlargedView } from "./card-enlarged-view";
import type { CardHistoryItem, MerchantCardData, WalletEventPayload } from "./types";
import { usePersonalizedQr } from "./use-personalized-qr";
import { mergeMerchantCardUpdate } from "@/lib/merchant-card-update";
import type { buildCustomerProgramView } from "@/lib/loyalty-context";
import { formatUnitCount, historyEntryLabel, type HistoryTxMetadata } from "@/lib/loyalty-labels";
import {
  activityFromWalletEvent,
  type ActivityItem,
  type NextRewardOverview,
} from "@/lib/customer-loyalty-overview";
import { useWalletEvents } from "./use-wallet-events";
import {
  MerchantRewardProgressPanel,
  notifyMerchantRewardProgressRefresh,
} from "./merchant-reward-progress-panel";
import type { CustomerMerchantRewardProgress } from "@/lib/customer-reward-progress-types";
import { AddToGoogleWalletButton } from "./add-to-google-wallet-button";
import { WalletQrAction } from "./wallet-qr-action";

type CustomerProgramView = ReturnType<typeof buildCustomerProgramView>;

// Référence stable pour la valeur par défaut de `recentActivity` : un littéral
// `[]` en valeur par défaut de paramètre est réévalué (nouvelle référence) à
// chaque appel du composant. Combiné à un useEffect qui dépend de cette prop
// (pour resynchroniser l'état interne quand le serveur renvoie de nouvelles
// données), ça provoque une boucle de rendu infinie dès qu'un appelant omet
// `recentActivity` (ex. la page carte en mode démo) : effet → setState →
// re-render → nouveau `[]` → effet à nouveau déclenché, etc.
const EMPTY_RECENT_ACTIVITY: ActivityItem[] = [];

const DETAIL_TABS = [
  { id: "rewards", label: "Avantages" },
  { id: "activity", label: "Activité" },
  { id: "info", label: "Informations" },
] as const;

type DetailTabId = (typeof DETAIL_TABS)[number]["id"];

export function MerchantCardDetail({
  slug,
  merchant,
  history,
  programView,
  nextReward: initialNextReward = null,
  rewardProgress: initialRewardProgress = null,
  recentActivity: initialRecentActivity = EMPTY_RECENT_ACTIVITY,
  activityTotal: initialActivityTotal = 0,
  clientName = null,
  clientNumber = null,
  preview = false,
  walletEnabled = false,
}: {
  slug: string;
  merchant: MerchantCardData;
  history: CardHistoryItem[];
  programView?: CustomerProgramView;
  nextReward?: NextRewardOverview | null;
  rewardProgress?: CustomerMerchantRewardProgress | null;
  recentActivity?: ActivityItem[];
  activityTotal?: number;
  clientName?: string | null;
  clientNumber?: string | null;
  preview?: boolean;
  walletEnabled?: boolean;
}) {
  const [card, setCard] = useState(merchant);
  const [rows, setRows] = useState(history);
  const [nextReward, setNextReward] = useState<NextRewardOverview | null>(initialNextReward);
  const [recentActivity, setRecentActivity] = useState(initialRecentActivity);
  const [activityTotal, setActivityTotal] = useState(initialActivityTotal);
  const [showFullHistory, setShowFullHistory] = useState(false);
  const [overviewError, setOverviewError] = useState<string | null>(null);
  const [shareBusy, setShareBusy] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cardEnlarged, setCardEnlarged] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteBusy, setDeleteBusy] = useState(false);
  const [conditionsExpanded, setConditionsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<DetailTabId>("rewards");
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const { qrSrc: personalizedQr, qrFailed, reload: reloadQr } = usePersonalizedQr(!preview);

  const handleTabKeyDown = useCallback((event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
    event.preventDefault();
    const nextIndex =
      event.key === "ArrowRight"
        ? (index + 1) % DETAIL_TABS.length
        : (index - 1 + DETAIL_TABS.length) % DETAIL_TABS.length;
    setActiveTab(DETAIL_TABS[nextIndex].id);
    tabRefs.current[nextIndex]?.focus();
  }, []);

  const mode = programView?.mode ?? card.loyaltyMode ?? "VISITS";
  // En présence d'un programView réel (client connecté), l'existence d'un
  // objectif se juge sur les récompenses réellement compatibles avec le
  // mode actif — jamais sur card.visitsRequired, qui peut être un simple
  // solde de repli lorsqu'aucune récompense n'est compatible (voir
  // resolveWalletCardObjective).
  const hasProgramReward = programView ? programView.rewards.length > 0 : true;
  const remaining = programView
    ? (hasProgramReward ? (programView.upcomingRemaining ?? 0) : 0)
    : Math.max(0, card.visitsRequired - card.points);
  const rewardAvailable = programView
    ? hasProgramReward && programView.rewards.some((reward) => card.points >= reward.threshold)
    : card.points >= card.visitsRequired;
  // Progression affichée sur la carte elle-même. Sans récompense compatible
  // avec le mode actif, target est explicitement null (jamais le solde, ni
  // "1", ni aucune autre valeur fabriquée) : LoyaltyWidgetView masque alors
  // le dénominateur et la progression sans modifier le gabarit/style.
  const cardProgress = programView
    ? hasProgramReward
      ? {
          current: card.points,
          target: card.visitsRequired,
          label: rewardAvailable ? `${card.rewardLabel} disponible` : `Encore ${remaining} · ${card.rewardLabel}`,
          nextReward: card.rewardLabel,
        }
      : {
          current: card.points,
          target: null,
          label: "Aucun objectif configuré",
          nextReward: null,
        }
    : undefined;

  useEffect(() => {
    setNextReward(initialNextReward);
    setRecentActivity(initialRecentActivity);
    setActivityTotal(initialActivityTotal);
  }, [initialNextReward, initialRecentActivity, initialActivityTotal]);

  const refreshOverview = useCallback(async () => {
    if (preview) return;
    try {
      const response = await fetch(
        `/api/customer/loyalty/overview?merchantSlug=${encodeURIComponent(slug)}&activityLimit=3`,
        { cache: "no-store" },
      );
      if (!response.ok) throw new Error("overview");
      const data = await response.json();
      setNextReward(data.nextReward ?? null);
      setRecentActivity(data.recentActivity ?? []);
      setActivityTotal(data.activityTotal ?? 0);
      setOverviewError(null);
    } catch {
      setOverviewError("Impossible de charger l'activité.");
    }
  }, [preview, slug]);

  const onEvent = useCallback((event: WalletEventPayload) => {
    const match =
      (event.customerMembershipId && event.customerMembershipId === card.id) ||
      (event.merchantId && event.merchantId === card.merchantId);
    if (!match && event.type !== "FIFE_LIFE_POINTS_UPDATED") return;

    if (event.type === "MERCHANT_CARD_UPDATED") {
      setCard((prev) => mergeMerchantCardUpdate(prev, event.payload));
      void fetch(`/api/customer/wallet/cards/detail?membershipId=${card.id}`, { cache: "no-store" })
        .then((response) => response.json())
        .then((data) => {
          if (data.card) setCard((prev) => ({ ...prev, ...data.card }));
        })
        .catch(() => undefined);
      return;
    }
    if (event.type === "MERCHANT_POINTS_UPDATED" || event.type === "REWARD_REDEEMED") {
      const nextPoints = event.payload.points;
      if (typeof nextPoints === "number") {
        setCard((prev) => ({ ...prev, points: nextPoints }));
      }
      const txId = typeof event.payload.txId === "string" ? event.payload.txId : event.id;
      const delta = typeof event.payload.delta === "number" ? event.payload.delta : 0;
      const txType = typeof event.payload.type === "string" ? event.payload.type : event.type;
      const metadata = (event.payload.metadata as HistoryTxMetadata | null) ?? null;
      setRows((prev) => {
        if (prev.some((row) => row.id === txId)) return prev;
        return [
          {
            id: txId,
            type: txType,
            pointsDelta: delta,
            reason: typeof event.payload.rewardLabel === "string" ? event.payload.rewardLabel : null,
            createdAt: event.createdAt,
            metadata: metadata as Record<string, unknown> | null,
          },
          ...prev,
        ];
      });

      const activityItem = activityFromWalletEvent({
        eventId: txId,
        merchantId: card.merchantId,
        merchantName: card.name,
        merchantSlug: slug,
        merchantLogoUrl: card.logoUrl,
        createdAt: event.createdAt,
        type: txType,
        delta,
        rewardLabel: typeof event.payload.rewardLabel === "string" ? event.payload.rewardLabel : null,
        purchaseAmountCents:
          typeof event.payload.purchaseAmountCents === "number" ? event.payload.purchaseAmountCents : null,
        metadata,
      });
      setRecentActivity((prev) => {
        if (prev.some((row) => row.id === activityItem.id)) return prev;
        return [activityItem, ...prev].slice(0, 3);
      });
      setActivityTotal((prev) => prev + 1);
      void refreshOverview();
      notifyMerchantRewardProgressRefresh();
    }
  }, [card.id, card.merchantId, card.logoUrl, card.name, slug, refreshOverview]);

  useWalletEvents(!preview, onEvent);

  async function shareCard() {
    if (preview) {
      setShareSuccess(true);
      setTimeout(() => setShareSuccess(false), 2000);
      return;
    }

    setShareBusy(true);
    setError(null);

    const shareUrl = `${window.location.origin}/c/${slug}`;
    const shareData = {
      title: `Carte ${card.name} - Fideto`,
      text: `Découvrez le programme de fidélité ${card.name}`,
      url: shareUrl,
    };

    if (navigator.share && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
        setShareBusy(false);
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          await fallbackCopyLink(shareUrl);
        }
        setShareBusy(false);
      }
    } else {
      await fallbackCopyLink(shareUrl);
    }
  }

  async function fallbackCopyLink(url: string) {
    try {
      await navigator.clipboard.writeText(url);
      setShareSuccess(true);
      setTimeout(() => setShareSuccess(false), 2500);
    } catch {
      setError("Impossible de copier le lien.");
    }
    setShareBusy(false);
  }

  async function deleteCard() {
    if (preview) return;
    setDeleteBusy(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/customer/cards/${slug}`, {
        method: "DELETE",
      });
      
      if (!response.ok) {
        throw new Error("Échec de la suppression");
      }
      
      // Redirect to wallet after successful deletion
      window.location.href = "/carte";
    } catch {
      setError("Impossible de supprimer la carte.");
      setDeleteBusy(false);
      setShowDeleteConfirm(false);
    }
  }

  // Un programView présent (client connecté, programme réellement actif)
  // fait foi : s'il ne contient aucune récompense compatible, il n'y a
  // simplement aucun avantage à afficher (pas de repli fabriqué depuis un
  // ancien avantage incompatible). Le repli sur card.* ne sert qu'en
  // aperçu (pas de programView, ex. carte de démonstration).
  const rewards = programView
    ? programView.rewards.map((reward) => ({
        threshold: reward.threshold,
        thresholdUnit: reward.thresholdUnit,
        reward: reward.name,
      }))
    : [{ threshold: card.visitsRequired, thresholdUnit: "visits" as const, reward: card.rewardLabel }];

  const conditions = `Les points sont crédités lors de chaque achat validé par le commerçant. 
  
Les points sont valables pendant 12 mois à compter de la date d'acquisition. 

Les récompenses doivent être utilisées dans les 30 jours suivant leur obtention.

Le commerçant se réserve le droit de modifier ou d'annuler le programme de fidélité à tout moment.`;

  // Coordonnées réelles du commerce (super-admin) — jamais de valeur fabriquée.
  const streetLine = [card.addressLine1, card.addressLine2].filter(Boolean).join(", ");
  const cityLine = [card.postalCode, card.city].filter(Boolean).join(" ");
  const fullAddress = [streetLine, cityLine].filter(Boolean).join(", ") || null;
  const hasLocation = Boolean(fullAddress);
  const merchantInfo = {
    phone: card.publicPhone || null,
    email: card.publicEmail || null,
    website: card.website || null,
  };
  const hasContactInfo = Boolean(merchantInfo.phone || merchantInfo.email || merchantInfo.website);

  return (
    <>
      <main className="merchant-detail-scene min-h-dvh">
        <div className="merchant-detail-container fife-page-shell fife-merchant-layout mx-auto w-full max-w-md px-5 pb-16 pt-3 lg:max-w-none">
          {/* Header */}
          <header className="merchant-detail-header flex shrink-0 items-center justify-between">
            <Link
              href="/carte"
              className="back-btn-glassy grid h-10 w-10 place-items-center rounded-full text-[var(--ink)]"
              aria-label="Retour au portefeuille"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </Link>
            <div className="merchant-name-pill flex-1 mx-4 py-2.5 px-4">
              <h1 className="text-center text-base font-bold tracking-tight text-[var(--ink)]">
                {card.name}
              </h1>
            </div>
            <div className="w-10" aria-hidden />
          </header>

          {/* Card with QR */}
          <div className="merchant-primary-column">
          <section className="merchant-card-block mt-16">
            <button
              type="button"
              onClick={() => setCardEnlarged(true)}
              className="card-preview-btn group relative w-full"
              aria-label="Agrandir la carte pour le scan"
            >
              <MerchantCardRenderer
                as="div"
                template={card.cardTemplate}
                merchant={{
                  name: card.name,
                  logoUrl: card.logoUrl,
                  primaryColor: card.primaryColor,
                }}
                card={card}
                slug={slug}
                clientName={clientName ?? undefined}
                displayMode={preview ? "adminPreview" : "personalized"}
                showQr
                qrSrc={personalizedQr}
                progress={cardProgress}
                className="h-auto aspect-[1.586/1] w-full"
              />

              {/* Expand icon hint */}
              <div className="expand-hint absolute bottom-3 right-3 grid h-8 w-8 place-items-center rounded-full bg-black/40 backdrop-blur-sm opacity-60 group-hover:opacity-100 transition-opacity">
                <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                </svg>
              </div>
            </button>
          </section>

          {/* Actions : QR, Google Wallet, Partager — un seul bloc, un seul QR canonique */}
          <section className="merchant-actions-block merchant-action-row mt-5">
            <WalletQrAction
              qrSrc={personalizedQr}
              qrFailed={qrFailed}
              onRetry={() => void reloadQr()}
              clientNumber={clientNumber}
              merchantName={card.name}
            />
            {!preview && walletEnabled ? (
              <AddToGoogleWalletButton
                endpoint={`/api/customer/google-wallet/merchant/${encodeURIComponent(slug)}`}
                className="wallet-google-action"
              />
            ) : null}
            <button
              type="button"
              onClick={() => void shareCard()}
              disabled={shareBusy}
              className="merchant-share-btn action-btn-glassy flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold text-[var(--ink)] disabled:opacity-50"
            >
              {shareBusy ? (
                <div className="h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
              ) : shareSuccess ? (
                <>
                  <svg className="h-5 w-5 text-[var(--positive)]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                  Copié !
                </>
              ) : (
                <>
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                  Partager la carte
                </>
              )}
            </button>
          </section>

          <MerchantRewardProgressPanel
            slug={slug}
            merchantName={card.name}
            initialProgress={initialRewardProgress}
            qrSrc={personalizedQr}
            clientNumber={clientNumber}
            preview={preview}
          />

          {error ? (
            <p className="merchant-actions-error mt-3 text-center text-xs font-semibold text-[var(--danger)]">{error}</p>
          ) : null}
          </div>

          <div className="merchant-side-panel">
          <nav className="merchant-tabs" role="tablist" aria-label="Sections de la carte">
            {DETAIL_TABS.map((tab, index) => (
              <button
                key={tab.id}
                ref={(el) => {
                  tabRefs.current[index] = el;
                }}
                type="button"
                role="tab"
                id={`merchant-tab-${tab.id}`}
                aria-selected={activeTab === tab.id}
                aria-controls={`merchant-panel-${tab.id}`}
                tabIndex={activeTab === tab.id ? 0 : -1}
                className={`merchant-tab${activeTab === tab.id ? " is-active" : ""}`}
                onClick={() => setActiveTab(tab.id)}
                onKeyDown={(event) => handleTabKeyDown(event, index)}
              >
                {tab.label}
              </button>
            ))}
          </nav>

          <div
            id="merchant-panel-rewards"
            role="tabpanel"
            aria-labelledby="merchant-tab-rewards"
            hidden={activeTab !== "rewards"}
          >
          {/* Avantages : détail des récompenses du programme actif publié (canonique) */}
          <section className="merchant-advantages-block glass-panel mt-4 p-5">
            <div className="flex items-center justify-between gap-3">
              <h2 className="section-title">Avantages</h2>
              <span className="text-[10px] font-semibold uppercase tracking-wide text-[var(--muted)]">
                {rewards.length} avantage{rewards.length > 1 ? "s" : ""}
              </span>
            </div>
            {rewards.length ? (
              <ul className="merchant-reward-list mt-4">
                {rewards.map((reward, idx) => {
                  const unit = reward.thresholdUnit === "points" ? "points" : "passages";
                  const unlocked = card.points >= reward.threshold;
                  return (
                    <li key={idx} className="merchant-reward-row">
                      <span className={`merchant-reward-level${unlocked ? " is-unlocked" : ""}`}>
                        {unlocked ? (
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                            <path d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          reward.threshold
                        )}
                      </span>
                      <div className="min-w-0">
                        <strong className="block text-sm font-semibold text-[var(--ink)]">{reward.reward}</strong>
                        <span className="block text-xs text-[var(--muted)] mt-0.5">
                          {unlocked ? "Débloqué" : `Débloqué après ${formatUnitCount(reward.threshold, unit)}`}
                        </span>
                      </div>
                      <svg className="merchant-reward-chevron h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden>
                        <path d="M9 18l6-6-6-6" />
                      </svg>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="mt-4 text-sm text-[var(--muted)]">
                {programView
                  ? "Aucun avantage actif publié pour ce mode."
                  : "Aucun avantage configuré pour ce programme."}
              </p>
            )}
          </section>

          {/* Localisation : adresse réelle du commerce, jamais de position inventée */}
          {hasLocation && (
            <section className="merchant-location-block glass-panel mt-4 overflow-hidden p-0">
              <div className="merchant-mini-map" role="img" aria-label={`Localisation approximative de ${card.name}`}>
                <span className="merchant-mini-map-road" />
                <span className="merchant-mini-map-road is-second" />
                <span className="merchant-mini-map-road is-third" />
                <span className="merchant-mini-map-block is-one" />
                <span className="merchant-mini-map-block is-two" />
                <span className="merchant-mini-map-block is-three" />
                <span className="merchant-mini-map-pin">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </span>
              </div>
              <div className="merchant-location-body">
                <div className="min-w-0">
                  <strong className="block text-sm font-semibold text-[var(--ink)]">{card.name}</strong>
                  <span className="block text-xs text-[var(--muted)] mt-0.5">{fullAddress}</span>
                </div>
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(fullAddress ?? "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="merchant-route-btn"
                >
                  <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                  Itinéraire
                </a>
              </div>
            </section>
          )}
          </div>

          <div
            id="merchant-panel-activity"
            role="tabpanel"
            aria-labelledby="merchant-tab-activity"
            hidden={activeTab !== "activity"}
          >
          <section className="merchant-activity-block glass-panel mt-4 p-5">
            <h2 className="section-title">Activité récente</h2>
            {overviewError ? (
              <div className="mt-3 space-y-2">
                <p className="text-sm text-[var(--muted-strong)]">{overviewError}</p>
                <button
                  type="button"
                  onClick={() => void refreshOverview()}
                  className="text-xs font-semibold text-[var(--violet-bright)] hover:underline"
                >
                  Réessayer
                </button>
              </div>
            ) : recentActivity.length === 0 ? (
              <p className="mt-3 text-sm text-[var(--muted)]">
                Aucune activité enregistrée chez {card.name}.
              </p>
            ) : (
              <>
                <ul className="mt-4 divide-y divide-white/8">
                  {recentActivity.slice(0, 3).map((row) => (
                    <li key={row.id} className="flex items-start justify-between gap-4 py-2.5 first:pt-0">
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-[var(--ink)]">{row.detail}</p>
                        <p className="text-xs text-[var(--muted)] mt-0.5">{row.formattedDate}</p>
                      </div>
                      <span
                        className={`text-sm font-black tabular-nums ${
                          row.deltaLabel.startsWith("−") ? "text-[var(--danger)]" : "text-[var(--positive)]"
                        }`}
                      >
                        {row.deltaLabel}
                      </span>
                    </li>
                  ))}
                </ul>
                {(activityTotal > 3 || recentActivity.length > 3) && !showFullHistory ? (
                  <button
                    type="button"
                    onClick={() => setShowFullHistory(true)}
                    className="mt-3 text-xs font-semibold text-[var(--violet-bright)] hover:underline"
                  >
                    Voir toute l’activité
                  </button>
                ) : null}
              </>
            )}
          </section>

          {/* History section */}
          {showFullHistory ? (
          <section className="merchant-history-block glass-panel mt-4 p-5">
            <h2 className="section-title">Historique</h2>
            {rows.length === 0 ? (
              <p className="mt-4 text-sm text-[var(--muted)]">Aucun mouvement pour le moment.</p>
            ) : (
              <ul className="mt-4 divide-y divide-white/8">
                {rows.slice(0, 15).map((row) => {
                  const isPositive = row.pointsDelta > 0;
                  const history = historyEntryLabel({
                    type: row.type,
                    pointsDelta: row.pointsDelta,
                    reason: row.reason,
                    metadata: row.metadata as Parameters<typeof historyEntryLabel>[0]["metadata"],
                    ruleApplied: row.ruleApplied,
                  });
                  return (
                    <li key={row.id} className="flex items-start justify-between gap-4 py-3 first:pt-0">
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-[var(--ink)]">{history.title}</p>
                        <p className="text-xs text-[var(--muted)] mt-0.5">
                          {new Date(row.createdAt).toLocaleString("fr-FR", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                        {row.reason ? (
                          <p className="text-xs text-[var(--muted-strong)] mt-1">{row.reason}</p>
                        ) : null}
                      </div>
                      <span
                        className={`text-sm font-black tabular-nums ${
                          isPositive ? "text-[var(--positive)]" : "text-[var(--danger)]"
                        }`}
                      >
                        {history.deltaLabel}
                      </span>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
          ) : null}
          </div>

          <div
            id="merchant-panel-info"
            role="tabpanel"
            aria-labelledby="merchant-tab-info"
            hidden={activeTab !== "info"}
          >
          <section className="merchant-program-block glass-panel mt-4 p-5">
            <h2 className="section-title">Programme</h2>
            <div className="mt-3 space-y-1 text-sm text-[var(--ink-soft)]">
              <p className="font-semibold text-[var(--ink)]">
                {programView?.programTitle ?? (mode === "FIXED_POINTS" ? "Points fixes par achat" : "Programme fidélité")}
              </p>
              {programView?.programDescription ? <p>{programView.programDescription}</p> : null}
              {programView?.minimumPurchaseLabel ? <p>{programView.minimumPurchaseLabel}</p> : null}
            </div>
          </section>

          {/* Conditions section */}
          <section className="merchant-conditions-block glass-panel mt-4 p-5">
            <h2 className="section-title">Conditions d'utilisation</h2>
            <div className={`mt-4 text-sm text-[var(--ink-soft)] leading-relaxed whitespace-pre-line ${!conditionsExpanded ? "line-clamp-4" : ""}`}>
              {conditions}
            </div>
            {conditions.split("\n").length > 4 && (
              <button
                type="button"
                onClick={() => setConditionsExpanded(!conditionsExpanded)}
                className="mt-3 text-xs font-semibold text-[var(--violet-bright)] hover:underline"
              >
                {conditionsExpanded ? "Réduire" : "Voir plus"}
              </button>
            )}
          </section>

          {/* Merchant info section */}
          {hasContactInfo && (
            <section className="merchant-info-block glass-panel mt-4 p-5">
              <h2 className="section-title">Informations</h2>
              <div className="mt-4 space-y-3">
                {merchantInfo.phone && (
                  <a href={`tel:${merchantInfo.phone}`} className="merchant-info-row group">
                    <svg className="h-5 w-5 text-[var(--muted)]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span className="text-sm text-[var(--ink-soft)] group-hover:text-[var(--violet-bright)]">
                      {merchantInfo.phone}
                    </span>
                  </a>
                )}
                {merchantInfo.email && (
                  <a href={`mailto:${merchantInfo.email}`} className="merchant-info-row group">
                    <svg className="h-5 w-5 text-[var(--muted)]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span className="text-sm text-[var(--ink-soft)] group-hover:text-[var(--violet-bright)]">
                      {merchantInfo.email}
                    </span>
                  </a>
                )}
                {merchantInfo.website && (
                  <a
                    href={merchantInfo.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="merchant-info-row group"
                  >
                    <svg className="h-5 w-5 text-[var(--muted)]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                    </svg>
                    <span className="text-sm text-[var(--ink-soft)] group-hover:text-[var(--violet-bright)]">
                      {merchantInfo.website}
                    </span>
                  </a>
                )}
              </div>
            </section>
          )}

          {/* Delete section */}
          <section className="delete-zone mt-8 p-5">
            {error ? <p className="mb-3 text-center text-sm text-red-300">{error}</p> : null}
            {!showDeleteConfirm ? (
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                className="delete-btn w-full py-3 px-4 text-sm font-semibold"
              >
                Supprimer la carte
              </button>
            ) : (
              <div className="space-y-3">
                <p className="text-sm text-center text-[var(--ink-soft)]">
                  Voulez-vous vraiment retirer la carte {card.name} de votre portefeuille ?
                </p>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowDeleteConfirm(false)}
                    disabled={deleteBusy}
                    className="flex-1 py-2.5 px-4 text-sm font-semibold text-[var(--ink-soft)] rounded-xl bg-white/5 hover:bg-white/8 transition-colors disabled:opacity-50"
                  >
                    Annuler
                  </button>
                  <button
                    type="button"
                    onClick={() => void deleteCard()}
                    disabled={deleteBusy}
                    className="delete-btn flex-1 py-2.5 px-4 text-sm font-semibold disabled:opacity-50"
                  >
                    {deleteBusy ? (
                      <div className="h-4 w-4 mx-auto rounded-full border-2 border-current border-t-transparent animate-spin" />
                    ) : (
                      "Supprimer la carte"
                    )}
                  </button>
                </div>
              </div>
            )}
          </section>
          </div>
          </div>
        </div>
      </main>

      <CardEnlargedView
        open={cardEnlarged}
        card={card}
        slug={slug}
        customerName={clientName ?? undefined}
        personalizedQr={personalizedQr}
        preview={preview}
        progress={cardProgress}
        onClose={() => setCardEnlarged(false)}
      />
    </>
  );
}
