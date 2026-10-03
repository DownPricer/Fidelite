"use client";

import { useCallback, useEffect, useState } from "react";
import { getDismissedAds, type SponsoredPlacement } from "./sponsored-slot";

export const SPONSORED_AVAILABILITY_EVENT = "fideto-sponsored-availability-changed";

export function notifySponsoredAvailabilityChanged() {
  if (typeof window !== "undefined") window.dispatchEvent(new Event(SPONSORED_AVAILABILITY_EVENT));
}

/** Indique si une campagne est proposée pour cet emplacement (sans compter d'impression). */
export function useSponsoredAvailable(placement: SponsoredPlacement, enabled = true) {
  const [available, setAvailable] = useState(false);

  const refresh = useCallback(async () => {
    if (!enabled) {
      setAvailable(false);
      return;
    }
    try {
      const exclude = [...getDismissedAds()].join(",");
      const response = await fetch(
        `/api/customer/sponsored?placement=${placement}${exclude ? `&exclude=${encodeURIComponent(exclude)}` : ""}`,
        { cache: "no-store" },
      );
      const data = (await response.json()) as { ad?: { id: string } | null };
      const ad = data.ad && !getDismissedAds().has(data.ad.id) ? data.ad : null;
      setAvailable(Boolean(ad));
    } catch {
      setAvailable(false);
    }
  }, [enabled, placement]);

  useEffect(() => {
    void refresh();
    const onChange = () => void refresh();
    window.addEventListener(SPONSORED_AVAILABILITY_EVENT, onChange);
    window.addEventListener("focus", onChange);
    return () => {
      window.removeEventListener(SPONSORED_AVAILABILITY_EVENT, onChange);
      window.removeEventListener("focus", onChange);
    };
  }, [refresh]);

  return available;
}
