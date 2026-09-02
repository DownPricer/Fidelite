"use client";

import Link from "next/link";
import { motion, useMotionValue, useReducedMotion } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import { GlobalCard } from "./global-card";
import { MerchantFace } from "./merchant-face";
import { PrismCard } from "./prism-card";
import type { MerchantCardData } from "./types";

const CARD_W = 320;
const SPREAD = 32;
const SWIPE_THRESHOLD = 50;
const VELOCITY_THRESHOLD = 500;
const VISIBLE_RANGE = 2;

type DeckItem =
  | { kind: "global" }
  | { kind: "merchant"; card: MerchantCardData };

export function CardDeck({
  points,
  cards,
  onOpenMerchant,
}: {
  points: number;
  fifeLifePoints?: number;
  cards: MerchantCardData[];
  onOpenMerchant: (card: MerchantCardData) => void;
}) {
  const prefersReduced = useReducedMotion();
  const [index, setIndex] = useState(0);
  const dragY = useMotionValue(0);

  const deck = useMemo<DeckItem[]>(() => [{ kind: "global" }, ...cards.map((card) => ({ kind: "merchant" as const, card }))], [cards]);

  useEffect(() => {
    if (index > deck.length - 1) setIndex(Math.max(0, deck.length - 1));
  }, [deck.length, index]);

  function snapTo(next: number) {
    // Boucler entre première et dernière carte
    const wrapped = ((next % deck.length) + deck.length) % deck.length;
    setIndex(wrapped);
    dragY.set(0);
  }

  function handleDragEnd(_: unknown, info: { offset: { y: number }; velocity: { y: number } }) {
    const swipe = info.offset.y;
    const velocity = info.velocity.y;

    // Swipe haut (suivant) ou bas (précédent)
    if (Math.abs(swipe) > SWIPE_THRESHOLD || Math.abs(velocity) > VELOCITY_THRESHOLD) {
      if (swipe < 0) {
        // Swipe haut = carte suivante
        snapTo(index + 1);
      } else {
        // Swipe bas = carte précédente
        snapTo(index - 1);
      }
    } else {
      // Retour au centre
      dragY.set(0);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      snapTo(index + 1);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      snapTo(index - 1);
    }
  }

  if (deck.length === 1 && cards.length === 0) {
    return (
      <div className="deck-scene relative mx-auto h-[220px] w-full max-w-[340px]">
        <Link href="/carte/identite" className="absolute inset-x-0 top-6 z-20 block">
          <GlobalCard points={points} large />
        </Link>
      </div>
    );
  }

  return (
    <div 
      className="deck-scene relative mx-auto h-[300px] w-full max-w-[360px] select-none overflow-visible" 
      style={{ perspective: "1400px" }}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="region"
      aria-label="Carousel de cartes"
    >
      {/* Boutons accessibles */}
      <button
        onClick={() => snapTo(index - 1)}
        className="absolute left-1/2 top-2 z-50 -translate-x-1/2 rounded-full bg-black/20 p-2 text-white/60 opacity-0 focus:opacity-100"
        aria-label="Carte précédente"
      >
        ↑
      </button>
      <button
        onClick={() => snapTo(index + 1)}
        className="absolute left-1/2 bottom-2 z-50 -translate-x-1/2 rounded-full bg-black/20 p-2 text-white/60 opacity-0 focus:opacity-100"
        aria-label="Carte suivante"
      >
        ↓
      </button>

      <motion.div
        className="relative h-full w-full touch-pan-y cursor-grab active:cursor-grabbing"
        style={{ y: dragY, transformStyle: "preserve-3d" }}
        drag={prefersReduced ? false : "y"}
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={0.2}
        onDragEnd={handleDragEnd}
      >
        {deck.map((item, i) => {
          let rel = i - index;
          
          // Rendre le carousel circulaire (infini)
          if (rel > deck.length / 2) rel -= deck.length;
          if (rel < -deck.length / 2) rel += deck.length;
          
          const dist = Math.abs(rel);
          
          // N'afficher que les cartes proches du centre
          if (dist > VISIBLE_RANGE) return null;
          
          const active = rel === 0;
          const behind = rel > 0;
          
          // Cartes empilées verticalement avec profondeur
          const translateY = rel * SPREAD; // Décalage vertical
          const translateZ = active ? 0 : -Math.abs(rel) * 35; // Profondeur
          const rotateX = active ? -3 : rel * 4; // Rotation légère
          
          // Taille et opacité
          const scale = active ? 1.0 : Math.max(0.88, 1 - dist * 0.08);
          const opacity = active ? 1 : Math.max(0.55, 1 - dist * 0.22);
          const zIndex = active ? 50 : behind ? 40 - dist * 5 : 45 - dist * 5;
          const brightness = active ? 1 : Math.max(0.7, 1 - dist * 0.18);

          const key = item.kind === "global" ? "global" : item.card.id;

          // FONCTIONNALITÉ EN PAUSE : Les clics sur les cartes sont désactivés
          // Ne pas rediriger vers des pages pour l'instant
          const content =
            item.kind === "global" ? (
              <div className="block h-full pointer-events-none">
                <GlobalCard points={points} large mode="wallet" />
              </div>
            ) : (
              <PrismCard
                as="div"
                material="merchant"
                hue={item.card.primaryColor}
                className="h-full w-full p-4 text-left pointer-events-none"
              >
                <MerchantFace card={item.card} />
              </PrismCard>
            );

          return (
            <motion.div
              key={key}
              className="absolute left-1/2 top-1/2 pointer-events-none"
              style={{
                width: CARD_W,
                marginLeft: -CARD_W / 2,
                marginTop: -105,
                zIndex,
                filter: `brightness(${brightness})`,
                transformStyle: "preserve-3d",
                willChange: active ? "transform, opacity" : "auto",
              }}
              initial={false}
              animate={
                prefersReduced
                  ? { rotateX: -3, y: translateY, z: translateZ, scale, opacity }
                  : {
                      rotateX,
                      y: translateY,
                      z: translateZ,
                      scale,
                      opacity,
                    }
              }
              transition={{
                type: "spring",
                stiffness: 340,
                damping: 28,
                mass: 0.7,
              }}
            >
              {content}
            </motion.div>
          );
        })}
      </motion.div>
      <div className="absolute inset-x-0 bottom-2 flex justify-center gap-1.5">
        {deck.map((item, i) => (
          <button
            key={item.kind === "global" ? "dot-global" : item.card.id}
            type="button"
            aria-label={item.kind === "global" ? "Carte Fife Life" : item.card.name}
            className={`deck-dot h-1.5 rounded-full transition-all ${
              i === index ? "w-5 is-active" : "w-1.5 bg-white/20"
            }`}
            onClick={() => snapTo(i)}
          />
        ))}
      </div>
    </div>
  );
}
