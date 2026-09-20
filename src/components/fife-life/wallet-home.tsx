"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";

import { CardDeck } from "./card-deck";
import { CardEnlargedView } from "./card-enlarged-view";
import { CardsSheet } from "./cards-sheet";
import { WalletCardsList } from "./wallet-cards-list";
import { NewCardToast } from "./new-card-toast";
import { resolveTier } from "./tier";
import type { MerchantCardData, WalletEventPayload } from "./types";
import { mergeMerchantCardUpdate } from "@/lib/merchant-card-update";
import { logMerchantCardSwitch } from "@/lib/merchant-card-switch-log";
import { markWalletEventSeen, hasSeenWalletEvent } from "@/lib/wallet-event-dedup";
import { formatLoyaltyPoints } from "@/lib/loyalty-card-view-model";
import { isUnlockEventType } from "@/lib/wallet-unlock";
import { useWalletEvents } from "./use-wallet-events";
import { preloadWalletQr } from "./qr-cache";
import { usePersonalizedQr } from "./use-personalized-qr";
import { useWalletUnlockAnimation } from "./use-wallet-unlock-animation";
import { WalletMotionRoot } from "./wallet-motion-root";
import { AddToGoogleWalletButton } from "./add-to-google-wallet-button";
import { WalletQrAction } from "./wallet-qr-action";
import {
  buildFifeLifeNextReward,
  resolveNextRewardForActiveCard,
  googleWalletEndpointForActiveCard,
  type ActiveWalletCard,
  type CardNextRewardEntry,
  type CustomerLoyaltyOverview,
} from "@/lib/customer-loyalty-overview";
import { progressBalanceLabel } from "@/lib/loyalty-labels";
import type { LoyaltyMode } from "@prisma/client";

export function WalletHome({
  firstName,
  lastName,
  customerName,
  clientNumber,
  fifeLifePoints,
  cards: initialCards,
  initialOverview = null,
  preview = false,
  initialSheetOpen = false,
  initialNewCard = null,
  walletEnabled = false,
}: {
  firstName: string;
  lastName?: string;
  customerName?: string;
  clientNumber?: string | null;
  fifeLifePoints: number;
  cards: MerchantCardData[];
  initialOverview?: CustomerLoyaltyOverview | null;
  preview?: boolean;
  initialSheetOpen?: boolean;
  initialNewCard?: string | null;
  walletEnabled?: boolean;
}) {
  const displayName = customerName ?? (lastName ? `${firstName} ${lastName}` : firstName);
  const profileHref = preview ? "/compte?demo=1" : "/compte";
  const settingsHref = preview ? "/compte/parametres?demo=1" : "/compte/parametres";

  const [points, setPoints] = useState(fifeLifePoints);
  const [cards, setCards] = useState(initialCards);
  const [cardRewards, setCardRewards] = useState<CardNextRewardEntry[]>(initialOverview?.cardRewards ?? []);
  const [recentActivity, setRecentActivity] = useState(initialOverview?.recentActivity ?? []);
  const [activeCard, setActiveCard] = useState<ActiveWalletCard>({
    cardType: "global",
    cardKey: "global",
    membershipId: null,
    merchantId: null,
    slug: "fife-life",
    activeIndex: 0,
  });
  const [sheetOpen, setSheetOpen] = useState(initialSheetOpen);
  const [enlargedCard, setEnlargedCard] = useState<MerchantCardData | null>(null);
  const { qrSrc: personalizedQr, qrFailed, reload: reloadQr } = usePersonalizedQr(!preview);
  const {
    unlockPhase,
    unlockCard,
    activeEventId,
    enqueueUnlock,
    onOverlayDisplayed,
    onAnimationDone,
  } = useWalletUnlockAnimation(!preview, setCards);

  const tier = resolveTier(points);

  const googleWalletEndpoint = useMemo(() => {
    return googleWalletEndpointForActiveCard(activeCard);
  }, [activeCard]);

  useEffect(() => {
    setCards(initialCards);
  }, [initialCards]);

  useEffect(() => {
    setPoints(fifeLifePoints);
  }, [fifeLifePoints]);

  useEffect(() => {
    if (initialOverview) {
      setCardRewards(initialOverview.cardRewards);
      setRecentActivity(initialOverview.recentActivity);
    }
  }, [initialOverview]);

  const activeNextReward = useMemo(() => {
    const reward = resolveNextRewardForActiveCard({
      cardRewards,
      activeCard,
      fifeLifePoints: points,
    });
    console.info(
      "[wallet-active-card] prochaine récompense trouvée",
      reward ? reward.rewardName : "aucune",
    );
    return reward;
  }, [cardRewards, activeCard, points]);

  const handleActiveCardChange = useCallback((nextActive: ActiveWalletCard) => {
    setActiveCard(nextActive);
  }, []);

  const activeMerchantCard = useMemo(
    () => (activeCard.membershipId ? cards.find((card) => card.id === activeCard.membershipId) : null),
    [activeCard.membershipId, cards],
  );
  const activeCardRewardEntry = useMemo(
    () =>
      cardRewards.find((entry) => entry.membershipId === activeCard.membershipId) ??
      cardRewards.find((entry) => entry.cardKey === activeCard.cardKey) ??
      null,
    [activeCard, cardRewards],
  );
  const activeAvailableRewards = useMemo(
    () => (activeCardRewardEntry?.availableReward ? [activeCardRewardEntry.availableReward] : []),
    [activeCardRewardEntry],
  );
  const activeCurrentRewards = activeCardRewardEntry?.currentRewards ?? [];
  const activeConservedRewards = activeCardRewardEntry?.conservedRewards ?? [];

  useEffect(() => {
    setSheetOpen(initialSheetOpen);
  }, [initialSheetOpen]);

  const refreshOverview = useCallback(async () => {
    if (preview) return;
    try {
      const response = await fetch("/api/customer/loyalty/overview?activityLimit=3", { cache: "no-store" });
      if (!response.ok) throw new Error("overview");
      const data = (await response.json()) as CustomerLoyaltyOverview;
      setCardRewards(data.cardRewards);
      setRecentActivity(data.recentActivity);
    } catch {
      // L'accueil conserve les dernières récompenses connues si l'overview échoue.
    }
  }, [preview]);

  useEffect(() => {
    if (preview) return;
    preloadWalletQr("fife-life");
  }, [preview]);

  const onEvent = useCallback(
    (event: WalletEventPayload) => {
      if (event.type === "FIFE_LIFE_POINTS_UPDATED") {
        const total = event.payload.total;
        if (typeof total === "number") {
          setPoints(total);
          setCardRewards((prev) =>
            prev.map((entry) =>
              entry.cardKey === "global"
                ? {
                    ...entry,
                    nextReward: buildFifeLifeNextReward(total),
                    progress: entry.progress
                      ? {
                          ...entry.progress,
                          current: total,
                          percent: buildFifeLifeNextReward(total)?.progressPercent ?? entry.progress.percent,
                        }
                      : null,
                  }
                : entry,
            ),
          );
        }
      }
      if (event.type === "MERCHANT_CARD_UPDATED") {
        if (hasSeenWalletEvent(event.id)) return;
        markWalletEventSeen(event.id);
        const membershipId = event.customerMembershipId;
        if (!membershipId) return;

        logMerchantCardSwitch("wallet rafraîchi", {
          merchantId: event.merchantId ?? undefined,
          mode: typeof event.payload.loyaltyMode === "string" ? event.payload.loyaltyMode : undefined,
          templateId:
            typeof event.payload.templateId === "string" ? event.payload.templateId : null,
          templateVersion:
            typeof event.payload.templateVersion === "number" ? event.payload.templateVersion : null,
        });

        setCards((prev) =>
          prev.map((card) =>
            card.id === membershipId ? mergeMerchantCardUpdate(card, event.payload) : card,
          ),
        );

        void fetch(`/api/customer/wallet/cards/detail?membershipId=${membershipId}`, {
          cache: "no-store",
        })
          .then((response) => response.json())
          .then((data) => {
            if (!data.card) return;
            setCards((prev) =>
              prev.map((card) => (card.id === membershipId ? { ...card, ...data.card } : card)),
            );
          })
          .catch(() => undefined);
        void refreshOverview();
        return;
      }
      if (event.type === "MERCHANT_POINTS_UPDATED" || event.type === "REWARD_REDEEMED") {
        const nextPoints = event.payload.points;
        setCards((prev) =>
          prev.map((card) => {
            const matchId = event.customerMembershipId && card.id === event.customerMembershipId;
            const matchMerchant = event.merchantId && card.merchantId === event.merchantId;
            if (!matchId && !matchMerchant) return card;
            return {
              ...card,
              points: typeof nextPoints === "number" ? nextPoints : card.points,
            };
          }),
        );

        void refreshOverview();
      }
      if (event.type === "CARD_REMOVED") {
        markWalletEventSeen(event.id);
        setCards((prev) =>
          prev.filter(
            (card) =>
              (event.customerMembershipId ? card.id !== event.customerMembershipId : true) &&
              (event.merchantId ? card.merchantId !== event.merchantId : true),
          ),
        );
        return;
      }
      if (isUnlockEventType(event.type)) {
        enqueueUnlock(event);
      }
    },
    [enqueueUnlock, cards, refreshOverview],
  );

  useWalletEvents(!preview, onEvent);

  function openCard(card: MerchantCardData) {
    if (!card.slug) return;
    window.location.href = `/carte/${card.slug}`;
  }

  return (
    <WalletMotionRoot>
      <main className="wallet-shell fife-page-shell obsidian-scene flex w-full flex-col px-5 pb-8 pt-3">
        <div className="wallet-page-body flex min-h-0 flex-1 flex-col">
          <header className="wallet-page-header relative z-50 flex shrink-0 items-center justify-between">
            <Link
              href={profileHref}
              className="avatar-orb-glassy relative z-50 grid h-10 w-10 place-items-center text-sm font-bold"
              aria-label="Mon profil"
            >
              {firstName.slice(0, 1).toUpperCase()}
            </Link>
            <div className="brand-pill-glassy pointer-events-none flex flex-col items-center gap-1 px-3 py-2">
              <span className="h-3 w-3 rounded-full bg-[radial-gradient(circle_at_30%_20%,#c4b5ff,#8557ff)] shadow-[0_0_14px_rgba(166,139,255,0.75)]" />
              <div className="text-center leading-tight">
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--ink-soft)]">Fidelo</p>
                <p className="text-[11px] font-medium text-[var(--muted-strong)]">Prism Wallet</p>
              </div>
            </div>
            <Link
              href={settingsHref}
            aria-label="Paramètres du compte"
              className="settings-btn-glassy relative z-50 grid h-9 w-9 place-items-center rounded-full"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--violet-bright)]" />
            </Link>
          </header>

          <div className="wallet-hero-column">
            <section className="wallet-points-block shrink-0 px-1">
              <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[var(--muted-strong)]">Points Fidelo</p>
              <p className="wallet-points-value mt-1 text-[2.35rem] font-black leading-none tabular-nums text-[var(--ink)]">
                {formatLoyaltyPoints(points)}
                <span className="ml-1 text-sm font-semibold text-[var(--muted)]">pts</span>
              </p>
              <p className="mt-2 text-xs font-medium text-[var(--ink-soft)]">
                Niveau global · {tier.name}
                {tier.nextName == null
                  ? " · palier maximum"
                  : ` · ${formatLoyaltyPoints(tier.remaining)} pts avant ${tier.nextName}`}
              </p>
            </section>

            <div className="wallet-deck-block shrink-0">
              <CardDeck
                points={points}
                customerName={displayName}
                clientNumber={clientNumber}
                cards={cards}
                personalizedQr={personalizedQr}
                onOpenMerchant={openCard}
                onEnlargeCard={setEnlargedCard}
                onActiveCardChange={handleActiveCardChange}
                demoVisual={preview}
              />
              <section className="wallet-primary-actions" aria-label="Actions QR et Google Wallet">
                <WalletQrAction
                  qrSrc={personalizedQr}
                  qrFailed={qrFailed}
                  onRetry={() => void reloadQr()}
                  clientNumber={clientNumber}
                  merchantName={activeMerchantCard?.name ?? "Fidelo"}
                />
                {!preview && walletEnabled ? (
                  <AddToGoogleWalletButton endpoint={googleWalletEndpoint} className="wallet-google-action" />
                ) : null}
              </section>
            </div>
          </div>

          <section className="wallet-reward-block glass-panel shrink-0 p-4 lg:hidden">
            <h3 className="section-title mb-2">Prochaine récompense</h3>
            {activeNextReward ? (
              <>
                <p className="text-sm font-semibold text-[var(--ink)]">{activeNextReward.rewardName}</p>
                <p className="mt-1 text-xs text-[var(--muted-strong)]">{activeNextReward.statusLabel}</p>
                {!activeNextReward.available ? (
                  <p className="mt-1 text-[10px] text-[var(--muted)]">
                    {progressBalanceLabel(
                      activeNextReward.mode as LoyaltyMode,
                      activeNextReward.progressCurrent,
                      activeNextReward.progressTarget,
                    )}{" "}
                    · {activeNextReward.progressPercent} %
                  </p>
                ) : null}
              </>
            ) : activeCard.cardType === "global" || activeCard.cardType === "global-tier" ? (
              <p className="text-xs text-[var(--muted-strong)]">
                Aucun prochain avantage Fidelo pour le moment.
              </p>
            ) : (
              <p className="text-xs text-[var(--muted-strong)]">
                {activeMerchantCard
                  ? `Aucun avantage configuré chez ${activeMerchantCard.name}.`
                  : "Aucun prochain avantage disponible pour le moment."}
              </p>
            )}
          </section>

          <div className="wallet-sheet-trigger mt-4 flex flex-col items-center gap-3 pb-6">
            <button
              type="button"
              onClick={() => setSheetOpen(true)}
              onMouseDown={(e) => {
                const startY = e.clientY;
                const handleMouseMove = (moveEvent: MouseEvent) => {
                  const diff = startY - moveEvent.clientY;
                  if (diff > 40) {
                    setSheetOpen(true);
                    document.removeEventListener("mousemove", handleMouseMove);
                  }
                };
                document.addEventListener("mousemove", handleMouseMove);
                document.addEventListener("mouseup", () => {
                  document.removeEventListener("mousemove", handleMouseMove);
                }, { once: true });
              }}
              onTouchStart={(e) => {
                const startY = e.touches[0].clientY;
                const handleTouchMove = (moveEvent: TouchEvent) => {
                  const diff = startY - moveEvent.touches[0].clientY;
                  if (diff > 40) {
                    setSheetOpen(true);
                    document.removeEventListener("touchmove", handleTouchMove);
                  }
                };
                document.addEventListener("touchmove", handleTouchMove);
                document.addEventListener("touchend", () => {
                  document.removeEventListener("touchmove", handleTouchMove);
                }, { once: true });
              }}
              className="wallet-chevron-btn wallet-chevron-glassy flex items-center justify-center"
              aria-label="Tirer vers le haut pour ouvrir"
            >
              <svg
                className={`wallet-chevron h-6 w-6 transition-transform duration-300 ${sheetOpen ? "rotate-180" : ""}`}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              >
                <path d="M5 12l7 7 7-7" />
              </svg>
            </button>
          </div>

          <aside className="wallet-sidebar-column hidden lg:flex">
            <section className="wallet-reward-block glass-panel p-4">
              <h3 className="section-title mb-2">Prochaine récompense</h3>
              {activeNextReward ? (
                <>
                  <p className="text-sm font-semibold text-[var(--ink)]">{activeNextReward.rewardName}</p>
                  <p className="mt-1 text-xs text-[var(--muted-strong)]">{activeNextReward.statusLabel}</p>
                  {!activeNextReward.available ? (
                    <p className="mt-1 text-[10px] text-[var(--muted)]">
                      {progressBalanceLabel(
                        activeNextReward.mode as LoyaltyMode,
                        activeNextReward.progressCurrent,
                        activeNextReward.progressTarget,
                      )}{" "}
                      · {activeNextReward.progressPercent} %
                    </p>
                  ) : null}
                </>
              ) : activeCard.cardType === "global" || activeCard.cardType === "global-tier" ? (
                <p className="text-xs text-[var(--muted-strong)]">
                  Aucun prochain avantage Fidelo pour le moment.
                </p>
              ) : (
                <p className="text-xs text-[var(--muted-strong)]">
                  {activeMerchantCard
                    ? `Aucun avantage configuré chez ${activeMerchantCard.name}.`
                    : "Aucun prochain avantage disponible pour le moment."}
                </p>
              )}
            </section>

            <section className="wallet-cards-rail glass-panel">
              <div className="mb-3 flex items-center justify-between gap-3">
                <h3 className="section-title">Mes cartes et avantages</h3>
                <div className="flex gap-2 text-xs font-semibold">
                  <Link href={profileHref} className="rounded-full border border-[light-dark(rgba(122,69,242,0.16),rgba(255,255,255,0.1))] px-3 py-2 text-[var(--ink-soft)] hover:text-[var(--ink)] focus:outline-none focus:ring-2 focus:ring-[var(--violet-bright)]">
                    Profil
                  </Link>
                  <Link href="/compte?tab=historique" className="rounded-full border border-[light-dark(rgba(122,69,242,0.16),rgba(255,255,255,0.1))] px-3 py-2 text-[var(--ink-soft)] hover:text-[var(--ink)] focus:outline-none focus:ring-2 focus:ring-[var(--violet-bright)]">
                    Historique
                  </Link>
                </div>
              </div>
              {activeAvailableRewards.length ? (
                <div className="mb-3 rounded-2xl border border-[light-dark(rgba(122,69,242,0.14),rgba(255,255,255,0.1))] bg-[light-dark(rgba(255,255,255,0.6),rgba(255,255,255,0.05))] p-3">
                  <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--muted)]">Avantages disponibles</p>
                  <ul className="mt-2 space-y-1 text-xs font-semibold text-[var(--ink)]">
                    {activeAvailableRewards.map((reward) => (
                      <li key={`${reward.merchantId}-${reward.rewardName}`}>
                        {reward.rewardName} · {reward.merchantName}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p className="mb-3 rounded-2xl border border-[light-dark(rgba(122,69,242,0.14),rgba(255,255,255,0.1))] bg-[light-dark(rgba(255,255,255,0.6),rgba(255,255,255,0.05))] p-3 text-xs text-[var(--muted-strong)]">
                  Aucun avantage disponible sur la carte active.
                </p>
              )}
              {activeCurrentRewards.length ? (
                <div className="mb-3 rounded-2xl border border-[light-dark(rgba(122,69,242,0.14),rgba(255,255,255,0.1))] bg-[light-dark(rgba(255,255,255,0.6),rgba(255,255,255,0.05))] p-3">
                  <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--muted)]">Avantages du programme actuel</p>
                  <ul className="mt-2 space-y-1 text-xs text-[var(--ink-soft)]">
                    {activeCurrentRewards.map((reward) => (
                      <li key={`${reward.merchantId}-${reward.rewardName}-${reward.progressTarget}`}>
                        {reward.progressTarget} {reward.unit} · {reward.rewardName}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
              {activeConservedRewards.length ? (
                <div className="mb-3 rounded-2xl border border-amber-300/20 bg-amber-400/10 p-3">
                  <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-amber-100">Avantages conservés</p>
                  <ul className="mt-2 space-y-1 text-xs text-[var(--ink-soft)]">
                    {activeConservedRewards.map((reward) => (
                      <li key={`${reward.merchantId}-${reward.rewardName}-${reward.progressTarget}`}>
                        {reward.rewardName}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
              <WalletCardsList cards={cards} onOpenCard={openCard} compact desktopGrid enablePublicSearch />
            </section>

            {recentActivity.length ? (
              <section className="wallet-activity-block glass-panel p-4">
                <h3 className="section-title mb-3">Activité récente</h3>
                <ul className="space-y-2">
                  {recentActivity.slice(0, 3).map((item) => (
                    <li key={item.id} className="flex items-center justify-between gap-3 text-xs">
                      <span className="min-w-0 truncate text-[var(--ink-soft)]">{item.lineLabel}</span>
                      <span className="shrink-0 font-bold text-[var(--ink)]">{item.deltaLabel}</span>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}
          </aside>
        </div>

        <CardsSheet open={sheetOpen} cards={cards} onClose={() => setSheetOpen(false)} onOpenCard={openCard} />
        <NewCardToast
          phase={unlockPhase}
          card={unlockCard}
          clientName={displayName}
          clientNumber={clientNumber}
          qrSrc={personalizedQr}
          eventId={activeEventId}
          onDisplayed={onOverlayDisplayed}
          onDone={onAnimationDone}
        />

        {enlargedCard ? (
          <CardEnlargedView
            open
            card={enlargedCard}
            slug={enlargedCard.slug}
            customerName={displayName}
            clientNumber={clientNumber}
            fifeLifePoints={points}
            personalizedQr={personalizedQr}
            preview={preview}
            onClose={() => setEnlargedCard(null)}
          />
        ) : null}
      </main>
    </WalletMotionRoot>
  );
}
