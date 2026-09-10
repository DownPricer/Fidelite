"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";

/** True uniquement après le premier effet client — évite les écarts SSR/hydratation. */
export function useClientMounted() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return mounted;
}

/** Valeur stable au premier rendu serveur et client, puis respecte prefers-reduced-motion. */
export function useHydrationSafeReducedMotion() {
  const mounted = useClientMounted();
  const prefersReduced = useReducedMotion();
  return mounted ? prefersReduced : false;
}
