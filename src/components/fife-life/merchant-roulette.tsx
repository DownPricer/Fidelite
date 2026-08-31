"use client";

import { animate, motion, useMotionValue, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import { LinearGauge } from "./linear-gauge";
import { MerchantFace } from "./merchant-face";
import type { MerchantCardData } from "./types";

const ITEM = 152;

export function MerchantRoulette({
  cards,
  onOpen,
}: {
  cards: MerchantCardData[];
  onOpen: (card: MerchantCardData) => void;
}) {
  const reduced = useReducedMotion();
  const [index, setIndex] = useState(0);
  const y = useMotionValue(0);

  useEffect(() => {
    if (index > cards.length - 1) setIndex(Math.max(0, cards.length - 1));
  }, [cards.length, index]);

  function snapTo(next: number) {
    const clamped = Math.max(0, Math.min(Math.max(0, cards.length - 1), next));
    setIndex(clamped);
    if (reduced) {
      y.set(-clamped * ITEM);
      return;
    }
    void animate(y, -clamped * ITEM, { type: "spring", stiffness: 340, damping: 34, mass: 0.8 });
  }

  if (cards.length === 0) {
    return (
      <div className="flex h-full items-center justify-center rounded-[22px] border border-[var(--stroke)] bg-[var(--surface)] px-6 text-center">
        <p className="text-sm text-[var(--muted-strong)]">
          Aucune carte commerçant pour le moment. Présentez votre QR Fife Life en caisse.
        </p>
      </div>
    );
  }

  return (
    <div className="relative h-full min-h-0 overflow-hidden">
      <motion.div
        className="flex cursor-grab flex-col touch-pan-y active:cursor-grabbing"
        style={{ y }}
        drag={reduced ? false : "y"}
        dragConstraints={{ top: -Math.max(0, cards.length - 1) * ITEM, bottom: 0 }}
        dragElastic={0.14}
        onDragEnd={(_, info) => {
          const projected = -y.get() - info.velocity.y * 0.12;
          snapTo(Math.round(projected / ITEM));
        }}
      >
        {cards.map((card, i) => {
          const active = i === index;
          return (
            <motion.button
              key={card.id}
              type="button"
              onClick={() => onOpen(card)}
              className="mb-3 w-full shrink-0 overflow-hidden rounded-[22px] border border-white/10 p-4 text-left"
              style={{
                height: ITEM - 12,
                background: `linear-gradient(145deg, color-mix(in srgb, ${card.primaryColor} 32%, #12101c) 0%, #0c0b12 72%)`,
              }}
              animate={
                reduced
                  ? undefined
                  : { scale: active ? 1 : 0.94, opacity: active ? 1 : 0.48 }
              }
              transition={reduced ? { duration: 0 } : { type: "spring", stiffness: 380, damping: 28 }}
            >
              <MerchantFace card={card} />
              <div className="mt-3">
                <LinearGauge value={card.points} max={card.visitsRequired} />
              </div>
            </motion.button>
          );
        })}
      </motion.div>
    </div>
  );
}
