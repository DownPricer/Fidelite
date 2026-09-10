"use client";

import { MotionConfig, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

import { useClientMounted } from "./use-client-mounted";

/** Force un rendu motion identique SSR / premier paint client, puis applique prefers-reduced-motion. */
export function WalletMotionRoot({ children }: { children: ReactNode }) {
  const mounted = useClientMounted();
  const prefersReduced = useReducedMotion();
  const reducedMotion = mounted && prefersReduced ? "always" : "never";

  return <MotionConfig reducedMotion={reducedMotion}>{children}</MotionConfig>;
}
