"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

import { CardDeck } from "./card-deck";
import { CardEnlargedView } from "./card-enlarged-view";
import { CardsSheet } from "./cards-sheet";
import { WalletCardsList } from "./wallet-cards-list";
import { NewCardToast } from "./new-card-toast";
import { resolveTier } from "./tier";
import type { MerchantCardData, WalletEventPayload } from "./types";
import { markWalletEventSeen } from "@/lib/wallet-event-dedup";
import { formatLoyaltyPoints } from "@/lib/loyalty-card-view-model";
import { isUnlockEventType } from "@/lib/wallet-unlock";
import { useWalletEvents } from "./use-wallet-events";
import { preloadWalletQr } from "./qr-cache";
import { usePersonalizedQr } from "./use-personalized-qr";
import { useWalletUnlockAnimation } from "./use-wallet-unlock-animation";
import { WalletMotionRoot } from "./wallet-motion-root";

const ACTIVITY = [
  { label: "Brasserie Nova · 3 cocktails", delta: "+ 480 pts" },
  { label: "Cinéma Lumière · 2 places", delta: "+ 260 pts" },
  { label: "Prism Hôtel · Check-in", delta: "+ 1 200 pts" },
];

export function WalletHome({
  firstName,
  lastName,
  customerName,
  clientNumber,
  fifeLifePoints,
  cards: initialCards,
  preview = false,
  initialSheetOpen = false,
  initialNewCard = null,
}: {
  firstName: string;
  lastName?: string;
  customerName?: string;
  clientNumber?: string | null;
  fifeLifePoints: number;
  cards: MerchantCardData[];
  preview?: boolean;
  initialSheetOpen?: boolean;
  initialNewCard?: string | null;
}) {
  const displayName = customerName ?? (lastName ? `${firstName} ${lastName}` : firstName);
  const profileHref = preview ? "/compte?demo=1" : "/compte";
  const settingsHref = preview ? "/compte/parametres?demo=1" : "/compte/parametres";

  const [points, setPoints] = useState(fifeLifePoints);
  const [cards, setCards] = useState(initialCards);
  const [sheetOpen, setSheetOpen] = useState(initialSheetOpen);
  const [enlargedCard, setEnlargedCard] = useState<MerchantCardData | null>(null);
  const { qrSrc: personalizedQr } = usePersonalizedQr(!preview);
  const {
    unlockPhase,
    unlockCard,
    activeEventId,
    enqueueUnlock,
    onOverlayDisplayed,
    onAnimationDone,
  } = useWalletUnlockAnimation(!preview, setCards);

  const tier = resolveTier(points);

  useEffect(() => {
    setCards(initialCards);
  }, [initialCards]);

  useEffect(() => {
    setPoints(fifeLifePoints);
  }, [fifeLifePoints]);

  useEffect(() => {
    setSheetOpen(initialSheetOpen);
  }, [initialSheetOpen]);

  useEffect(() => {
    if (preview) return;
    preloadWalletQr("fife-life");
  }, [preview]);

  const onEvent = useCallback(
    (event: WalletEventPayload) => {
      if (event.type === "FIFE_LIFE_POINTS_UPDATED") {
        const total = event.payload.total;
        if (typeof total === "number") setPoints(total);
      }
      if (event.type === "MERCHANT_CARD_UPDATED") {
        const membershipId = event.customerMembershipId;
        if (membershipId) {
          void fetch(`/api/customer/wallet/cards/detail?membershipId=${membershipId}`)
            .then((response) => response.json())
            .then((data) => {
              if (!data.card) return;
              setCards((prev) =>
                prev.map((card) => (card.id === membershipId ? { ...card, ...data.card } : card)),
              );
            })
            .catch(() => undefined);
        }
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
    [enqueueUnlock],
  );

  useWalletEvents(!preview, onEvent);

  function openCard(card: MerchantCardData) {
    if (!card.slug) return;
    window.location.href = `/carte/${card.slug}`;
  }

  return (
    <WalletMotionRoot>
    <main className="wallet-shell fife-page-shell obsidian-scene mx-auto flex w-full max-w-md flex-col px-5 pb-8 pt-3 lg:max-w-none">
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
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--ink-soft)]">Fife Life</p>
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
          <section className="wallet-points-block mt-6 shrink-0 px-1">
            <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[var(--muted-strong)]">Points Fife Life</p>
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

          <div className="wallet-deck-block mt-4 shrink-0">
            <CardDeck
              points={points}
              customerName={displayName}
              clientNumber={clientNumber}
              cards={cards}
              personalizedQr={personalizedQr}
              onOpenMerchant={openCard}
              onEnlargeCard={setEnlargedCard}
              demoVisual={preview}
            />
          </div>
        </div>

        <div className="wallet-lower-spacer" aria-hidden />

        <aside className="wallet-sidebar-column">
          <section className="wallet-reward-block glass-panel shrink-0 p-4">
            <h3 className="section-title mb-2">Prochaine récompense</h3>
            <p className="text-sm font-semibold text-[var(--ink)]">Nuit offerte chez Prism Hôtel</p>
            <p className="mt-1 text-xs text-[var(--muted-strong)]">Encore 1 240 pts Fife Life</p>
          </section>

          <div className="wallet-activity-block wallet-lower mt-4 shrink-0 lg:mt-0">
            <section className="glass-panel p-4">
              <h3 className="section-title mb-3">Activité récente</h3>
              <p className="wallet-reward-inline mb-3 text-xs font-medium text-[var(--ink-soft)]">
                Prochaine récompense · Nuit offerte chez Prism Hôtel
              </p>
              <ul className="space-y-2">
                {ACTIVITY.map((row) => (
                  <li key={row.label} className="flex items-center justify-between gap-3 text-[11px]">
                    <span className="flex min-w-0 items-center gap-2 text-[var(--ink-soft)]">
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--violet-bright)]" />
                      <span className="truncate">{row.label}</span>
                    </span>
                    <span className="shrink-0 font-semibold text-[#9fd88a]">{row.delta}</span>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          <aside className="wallet-cards-rail glass-panel" aria-label="Mes cartes et mes avantages">
            <h3 className="section-title mb-4">Mes cartes et avantages</h3>
            <WalletCardsList cards={cards} onOpenCard={openCard} compact desktopGrid />
          </aside>
        </aside>

        <div className="wallet-sheet-trigger mt-auto flex flex-col items-center gap-3 pb-6">
          <p className="text-xs font-medium text-[var(--ink-soft)]">Mes cartes et mes avantages</p>
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
