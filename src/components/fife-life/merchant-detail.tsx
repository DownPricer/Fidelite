"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { PrismCard } from "./prism-card";
import { QrBlock } from "./qr-block";
import { CardEnlargedView } from "./card-enlarged-view";
import type { CardHistoryItem, MerchantCardData, WalletEventPayload } from "./types";
import { useWalletEvents } from "./use-wallet-events";

function historyLabel(type: string) {
  if (type === "EARN_VISIT") return "Passage";
  if (type === "REDEEM_REWARD") return "Récompense";
  if (type === "ADJUSTMENT") return "Ajustement";
  return type;
}

export function MerchantCardDetail({
  slug,
  merchant,
  history,
  preview = false,
  walletEnabled = false,
}: {
  slug: string;
  merchant: MerchantCardData;
  history: CardHistoryItem[];
  preview?: boolean;
  walletEnabled?: boolean;
}) {
  const [card, setCard] = useState(merchant);
  const [rows, setRows] = useState(history);
  const [walletBusy, setWalletBusy] = useState(false);
  const [shareBusy, setShareBusy] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [android, setAndroid] = useState(preview);
  const [cardEnlarged, setCardEnlarged] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteBusy, setDeleteBusy] = useState(false);
  const [conditionsExpanded, setConditionsExpanded] = useState(false);

  const remaining = Math.max(0, card.visitsRequired - card.points);
  const rewardAvailable = card.points >= card.visitsRequired;

  useEffect(() => {
    setAndroid(preview || /android/i.test(navigator.userAgent));
  }, [preview]);

  const onEvent = useCallback((event: WalletEventPayload) => {
    const match =
      (event.customerMembershipId && event.customerMembershipId === card.id) ||
      (event.merchantId && event.merchantId === card.merchantId);
    if (!match && event.type !== "FIFE_LIFE_POINTS_UPDATED") return;

    if (event.type === "MERCHANT_POINTS_UPDATED" || event.type === "REWARD_REDEEMED") {
      const nextPoints = event.payload.points;
      if (typeof nextPoints === "number") {
        setCard((prev) => ({ ...prev, points: nextPoints }));
      }
      const txId = typeof event.payload.txId === "string" ? event.payload.txId : event.id;
      const delta = typeof event.payload.delta === "number" ? event.payload.delta : 0;
      setRows((prev) => [
        {
          id: txId,
          type: typeof event.payload.type === "string" ? event.payload.type : event.type,
          pointsDelta: delta,
          reason: typeof event.payload.rewardLabel === "string" ? event.payload.rewardLabel : null,
          createdAt: event.createdAt,
        },
        ...prev,
      ]);
    }
  }, [card.id, card.merchantId]);

  useWalletEvents(!preview, onEvent);

  async function addWallet() {
    if (preview) return;
    setWalletBusy(true);
    setError(null);
    const response = await fetch("/api/customer/wallet", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug }),
    });
    const data = await response.json();
    setWalletBusy(false);
    if (!response.ok || !data.url) {
      setError("Google Wallet est temporairement indisponible.");
      return;
    }
    window.location.href = data.url;
  }

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
      title: `Carte ${card.name} - Fife Life`,
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

  // Mock data for demonstration (in reality, these would come from the database)
  const rewards = [
    { threshold: card.visitsRequired, reward: card.rewardLabel },
  ];

  const conditions = `Les points sont crédités lors de chaque achat validé par le commerçant. 
  
Les points sont valables pendant 12 mois à compter de la date d'acquisition. 

Les récompenses doivent être utilisées dans les 30 jours suivant leur obtention.

Le commerçant se réserve le droit de modifier ou d'annuler le programme de fidélité à tout moment.`;

  const merchantInfo = {
    address: card.logoUrl ? "12 Rue de la République, 75001 Paris" : null,
    phone: card.logoUrl ? "+33 1 23 45 67 89" : null,
    email: card.logoUrl ? `contact@${slug}.fr` : null,
    website: card.logoUrl ? `https://${slug}.fr` : null,
  };

  return (
    <>
      <main className="merchant-detail-scene min-h-dvh">
        <div className="merchant-detail-container fife-page-shell fife-merchant-layout mx-auto w-full max-w-md px-5 pb-16 pt-3">
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
              <PrismCard
                as="div"
                material="merchant"
                hue={card.primaryColor}
                className="h-auto aspect-[1.586/1] w-full p-5"
              >
                <div className="flex h-full flex-col">
                  <div className="flex items-center gap-3">
                    {card.logoUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={card.logoUrl} alt="" className="h-12 w-12 rounded-2xl object-cover" />
                    ) : (
                      <div
                        className="grid h-12 w-12 place-items-center rounded-2xl text-lg font-black text-[var(--ink)]"
                        style={{ backgroundColor: card.primaryColor }}
                      >
                        {card.name.slice(0, 1)}
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold uppercase tracking-wider text-[var(--ink-soft)]">{card.name}</p>
                      <p className="text-xs text-[var(--muted-strong)]">Fife Life</p>
                    </div>
                  </div>

                  <div className="flex-1 flex items-center justify-center -mx-2">
                    <div className="scale-75">
                      <QrBlock slug={slug} preview={preview} />
                    </div>
                  </div>

                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-2xl font-black tabular-nums text-[var(--ink)]">
                        {card.points}<span className="text-base font-bold text-[var(--muted)]">/{card.visitsRequired}</span>
                      </p>
                      <p className="text-xs font-medium text-[var(--ink-soft)] mt-0.5">
                        {rewardAvailable ? "Récompense disponible" : `Encore ${remaining}`}
                      </p>
                    </div>
                  </div>
                </div>
              </PrismCard>

              {/* Expand icon hint */}
              <div className="expand-hint absolute bottom-3 right-3 grid h-8 w-8 place-items-center rounded-full bg-black/40 backdrop-blur-sm opacity-60 group-hover:opacity-100 transition-opacity">
                <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                </svg>
              </div>
            </button>
          </section>

          {/* Actions: Add to Wallet & Share */}
          <section className="merchant-actions-block mt-5 flex gap-3">
            <button
              type="button"
              onClick={() => void addWallet()}
              disabled={walletBusy || !(walletEnabled && android)}
              className="action-btn-glassy flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold text-[var(--ink)] disabled:opacity-50"
            >
              {walletBusy ? (
                <div className="h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
              ) : (
                <>
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M21 18v1c0 1.1-.9 2-2 2H5c-1.11 0-2-.9-2-2V5c0-1.1.89-2 2-2h14c1.1 0 2 .9 2 2v1h-9c-1.11 0-2 .9-2 2v8c0 1.1.89 2 2 2h9zm-9-2h10V8H12v8zm4-2.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
                  </svg>
                  Google Wallet
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => void shareCard()}
              disabled={shareBusy}
              className="action-btn-glassy flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold text-[var(--ink)] disabled:opacity-50"
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
                  Partager
                </>
              )}
            </button>
          </section>

          {error ? (
            <p className="mt-3 text-center text-xs font-semibold text-[var(--danger)]">{error}</p>
          ) : null}
          </div>

          <div className="merchant-side-panel">
          {/* Advantages section */}
          <section className="glass-panel mt-6 p-5">
            <h2 className="section-title">Avantages</h2>
            <ul className="mt-4 divide-y divide-white/8">
              {rewards.map((reward, idx) => (
                <li key={idx} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                  <span className="text-sm font-semibold text-[var(--positive)]">
                    {reward.threshold} {reward.threshold > 1 ? "passages" : "passage"}
                  </span>
                  <span className="text-sm text-[var(--ink-soft)]">=</span>
                  <span className="text-sm font-medium text-[var(--ink)]">{reward.reward}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* History section */}
          <section className="glass-panel mt-4 p-5">
            <h2 className="section-title">Historique</h2>
            {rows.length === 0 ? (
              <p className="mt-4 text-sm text-[var(--muted)]">Aucun mouvement pour le moment.</p>
            ) : (
              <ul className="mt-4 divide-y divide-white/8">
                {rows.slice(0, 15).map((row) => {
                  const isPositive = row.pointsDelta > 0;
                  return (
                    <li key={row.id} className="flex items-start justify-between gap-4 py-3 first:pt-0">
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-[var(--ink)]">{historyLabel(row.type)}</p>
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
                        {isPositive ? "+" : ""}
                        {row.pointsDelta}
                      </span>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>

          {/* Conditions section */}
          <section className="glass-panel mt-4 p-5">
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
          {(merchantInfo.address || merchantInfo.phone || merchantInfo.email || merchantInfo.website) && (
            <section className="glass-panel mt-4 p-5">
              <h2 className="section-title">Informations</h2>
              <div className="mt-4 space-y-3">
                {merchantInfo.address && (
                  <a
                    href={`https://maps.google.com/?q=${encodeURIComponent(merchantInfo.address)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="merchant-info-row group"
                  >
                    <svg className="h-5 w-5 text-[var(--muted)]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-sm text-[var(--ink-soft)] group-hover:text-[var(--violet-bright)]">
                      {merchantInfo.address}
                    </span>
                  </a>
                )}
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
      </main>

      <CardEnlargedView
        open={cardEnlarged}
        card={card}
        slug={slug}
        preview={preview}
        onClose={() => setCardEnlarged(false)}
      />
    </>
  );
}
