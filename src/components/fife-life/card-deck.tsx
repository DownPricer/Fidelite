"use client";

import Link from "next/link";
import { motion, useMotionValue, useReducedMotion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { DEMO_TIER_DECK_ORDER } from "@/lib/demo-tier-card-images";
import { GlobalCard } from "./global-card";
import { preloadWalletQr } from "./qr-cache";
import { MerchantCardRenderer } from "./merchant-card-renderer";
import { resolveTier } from "./tier";
import type { MerchantCardData, WalletTier } from "./types";

const SWIPE_THRESHOLD = 50;
const VELOCITY_THRESHOLD = 500;
const VISIBLE_RANGE = 2;

type DeckItem =
  | { kind: "global" }
  | { kind: "global-tier"; tier: WalletTier }
  | { kind: "merchant"; card: MerchantCardData };

function readDeckMetrics(root: HTMLElement | null) {
  if (!root) return { spread: 32, offsetY: 105 };
  const style = getComputedStyle(root);
  const cardW = parseFloat(style.getPropertyValue("--wallet-card-width")) || 320;
  const cardH = parseFloat(style.getPropertyValue("--wallet-card-height")) || cardW / (1427 / 863);
  const spread = parseFloat(style.getPropertyValue("--wallet-spread")) || Math.round(32 * (cardW / 320));
  return { spread, offsetY: cardH / 2 };
}

function demoStartIndex(points: number) {
  const current = resolveTier(points).name;
  const idx = DEMO_TIER_DECK_ORDER.indexOf(current);
  return idx >= 0 ? idx : 0;
}

export function CardDeck({
  points,
  customerName,
  clientNumber,
  cards,
  personalizedQr = null,
  onOpenMerchant,
  onEnlargeCard,
  demoVisual = false,
}: {
  points: number;
  customerName: string;
  clientNumber?: string | null;
  cards: MerchantCardData[];
  personalizedQr?: string | null;
  onOpenMerchant: (card: MerchantCardData) => void;
  onEnlargeCard?: (card: MerchantCardData) => void;
  demoVisual?: boolean;
}) {
  const prefersReduced = useReducedMotion();
  const sceneRef = useRef<HTMLDivElement>(null);
  const [isDesktop, setIsDesktop] = useState(false);
  const [index, setIndex] = useState(() => (demoVisual ? demoStartIndex(points) : 0));
  const [deckMetrics, setDeckMetrics] = useState({ spread: 32, offsetY: 105 });
  const dragY = useMotionValue(0);

  const deck = useMemo<DeckItem[]>(() => {
    if (demoVisual) {
      return [
        ...DEMO_TIER_DECK_ORDER.map((tier) => ({ kind: "global-tier" as const, tier })),
        ...cards.map((card) => ({ kind: "merchant" as const, card })),
      ];
    }
    return [{ kind: "global" }, ...cards.map((card) => ({ kind: "merchant" as const, card }))];
  }, [cards, demoVisual]);

  useEffect(() => {
    if (index > deck.length - 1) setIndex(Math.max(0, deck.length - 1));
  }, [deck.length, index]);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 1024px)");
    const update = () => setIsDesktop(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const el = sceneRef.current;
    if (!el) return;
    const update = () => setDeckMetrics(readDeckMetrics(el));
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    window.addEventListener("resize", update);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", update);
    };
  }, []);

  useEffect(() => {
    if (demoVisual) return;
    const item = deck[index];
    if (!item) return;
    if (item.kind === "global" || item.kind === "global-tier") {
      preloadWalletQr("fife-life");
      return;
    }
    if (item.card.slug) preloadWalletQr(item.card.slug);
  }, [deck, index, demoVisual]);

  function snapTo(next: number) {
    const wrapped = ((next % deck.length) + deck.length) % deck.length;
    setIndex(wrapped);
    dragY.set(0);
  }

  function handleDragEnd(_: unknown, info: { offset: { y: number }; velocity: { y: number } }) {
    const swipe = info.offset.y;
    const velocity = info.velocity.y;

    if (Math.abs(swipe) > SWIPE_THRESHOLD || Math.abs(velocity) > VELOCITY_THRESHOLD) {
      if (swipe < 0) snapTo(index + 1);
      else snapTo(index - 1);
    } else {
      dragY.set(0);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      snapTo(index - 1);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      snapTo(index + 1);
    }
  }

  function globalEnlargePayload(tier?: WalletTier): MerchantCardData {
    return {
      id: tier ? `fife-life-tier-${tier}` : "fife-life-global",
      merchantId: "fife-life",
      slug: "fife-life",
      name: "Fife Life",
      logoUrl: null,
      primaryColor: "#8557ff",
      points,
      visitsRequired: 100,
      rewardLabel: "Avantage Fife Life",
      demoTier: tier,
    };
  }

  if (deck.length === 1 && cards.length === 0 && !demoVisual) {
    return (
      <div ref={sceneRef} className="deck-scene fife-deck-scene deck-scene-solo relative mx-auto w-full select-none overflow-visible">
        <Link href="/carte/identite" className="absolute inset-x-0 top-1/2 z-20 mx-auto block w-[var(--wallet-card-width)] max-w-full -translate-y-1/2">
          <GlobalCard
            points={points}
            customerName={customerName}
            clientNumber={clientNumber}
            qrSrc={personalizedQr}
            large
            mode="wallet"
          />
        </Link>
      </div>
    );
  }

  return (
    <div className="fife-deck-wrap relative">
      <button
        type="button"
        onClick={() => snapTo(index - 1)}
        className="deck-nav-btn deck-nav-prev"
        aria-label="Carte précédente"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-5 w-5">
          <path d="M18 15l-6-6-6 6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <div
        ref={sceneRef}
        className="deck-scene fife-deck-scene relative mx-auto w-full select-none overflow-visible"
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="region"
        aria-label="Carousel de cartes"
      >
        <motion.div
          className="deck-stage relative grid h-full w-full place-items-center"
          style={{ y: dragY, transformStyle: "preserve-3d" }}
          drag={prefersReduced ? false : "y"}
          dragConstraints={{ top: 0, bottom: 0 }}
          dragElastic={0.2}
          onDragEnd={handleDragEnd}
        >
          {deck.map((item, i) => {
            let rel = i - index;
            if (rel > deck.length / 2) rel -= deck.length;
            if (rel < -deck.length / 2) rel += deck.length;

            const dist = Math.abs(rel);
            if (dist > VISIBLE_RANGE) return null;

            const active = rel === 0;
            const behind = rel > 0;
            const translateY = rel * deckMetrics.spread;
            const translateZ = isDesktop || prefersReduced ? 0 : active ? 0 : -Math.abs(rel) * 35;
            const rotateX = isDesktop || prefersReduced ? 0 : active ? -3 : rel * 4;
            const scale = isDesktop || prefersReduced ? 1 : active ? 1.0 : Math.max(0.88, 1 - dist * 0.08);
            const opacity = active ? 1 : Math.max(0.55, 1 - dist * 0.22);
            const zIndex = active ? 50 : behind ? 40 - dist * 5 : 45 - dist * 5;
            const brightness = active ? 1 : Math.max(0.7, 1 - dist * 0.18);

            const key =
              item.kind === "global"
                ? "global"
                : item.kind === "global-tier"
                  ? `global-tier-${item.tier}`
                  : item.card.id;

            const content =
              item.kind === "global" || item.kind === "global-tier" ? (
                <button
                  type="button"
                  className="deck-card-slot block w-full cursor-pointer border-0 bg-transparent p-0"
                  onClick={() => {
                    if (active && onEnlargeCard) {
                      onEnlargeCard(globalEnlargePayload(item.kind === "global-tier" ? item.tier : undefined));
                    }
                  }}
                >
                  <GlobalCard
                    points={points}
                    customerName={customerName}
                    clientNumber={clientNumber}
                    qrSrc={personalizedQr}
                    large
                    mode="wallet"
                    preview={demoVisual}
                    tierOverride={item.kind === "global-tier" ? item.tier : undefined}
                    demoTierPreview={demoVisual && item.kind === "global-tier"}
                    interactive={active && !isDesktop}
                    qrZoomEnabled={false}
                    qrFetchPriority={active ? "high" : "auto"}
                  />
                </button>
              ) : (
                <div
                  role="button"
                  tabIndex={0}
                  className="deck-card-slot block w-full cursor-pointer border-0 bg-transparent p-0 text-left"
                  onClick={() => {
                    if (active && onEnlargeCard) onEnlargeCard(item.card);
                    else if (!active) setIndex(i);
                  }}
                  onKeyDown={(event) => {
                    if (event.key !== "Enter" && event.key !== " ") return;
                    event.preventDefault();
                    if (active && onEnlargeCard) onEnlargeCard(item.card);
                    else if (!active) setIndex(i);
                  }}
                >
                  <MerchantCardRenderer
                    as="div"
                    template={item.card.cardTemplate}
                    merchant={{
                      name: item.card.name,
                      logoUrl: item.card.logoUrl,
                      primaryColor: item.card.primaryColor,
                    }}
                    card={item.card}
                    slug={item.card.slug}
                    clientName={customerName}
                    clientNumber={clientNumber}
                    displayMode={demoVisual ? "adminPreview" : "personalized"}
                    showQr
                    qrFetchPriority={active ? "high" : "auto"}
                    interactive={active && !isDesktop}
                  />
                </div>
              );

            return (
              <div
                key={key}
                className="deck-card-layer col-start-1 row-start-1 max-w-full"
                style={{
                  width: "var(--wallet-card-width)",
                  zIndex,
                }}
              >
                <motion.div
                  className="w-full"
                  style={{
                    filter: `brightness(${brightness})`,
                    transformStyle: "preserve-3d",
                    willChange: active ? "transform, opacity" : "auto",
                  }}
                  initial={false}
                  animate={
                    prefersReduced || isDesktop
                      ? { rotateX: 0, y: translateY, z: 0, scale: 1, opacity }
                      : { rotateX, y: translateY, z: translateZ, scale, opacity }
                  }
                  transition={{
                    type: "spring",
                    stiffness: 340,
                    damping: 28,
                    mass: 0.7,
                  }}
                  whileHover={active && !prefersReduced && !isDesktop ? { rotateX: -5, scale: 1.02 } : undefined}
                >
                  {content}
                </motion.div>
              </div>
            );
          })}
        </motion.div>
      </div>

      <button
        type="button"
        onClick={() => snapTo(index + 1)}
        className="deck-nav-btn deck-nav-next"
        aria-label="Carte suivante"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-5 w-5">
          <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <div className="deck-rotate-hint absolute left-0 top-1/2 z-10 -translate-y-1/2 lg:hidden" aria-hidden>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/rotate-phone-icon.png" alt="" className="h-8 w-8 opacity-40" />
      </div>
    </div>
  );
}
