"use client";

import { InteractiveLoyaltyCard } from "./interactive-loyalty-card";

export function LandingCardShowcase() {
  return (
    <section className="landing-deck flex flex-1 items-center justify-center">
      <div className="deck-halo absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2" />
      <div className="landing-card landing-card-back landing-card-back-left" aria-hidden />
      <div className="landing-card landing-card-back landing-card-back-right" aria-hidden />
      <div className="landing-card landing-card-featured z-10">
        <InteractiveLoyaltyCard
          tier="Silver"
          name="Marie Terese"
          points={180}
          interactive
          className="h-full w-full"
          shellClassName="h-full w-full"
        />
      </div>
    </section>
  );
}
