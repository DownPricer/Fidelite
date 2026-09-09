"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";

import {
  cardFromUnlockEvent,
  isUnlockEventType,
} from "@/lib/wallet-unlock";
import { canEnqueueUnlockEvent, shouldDeferUnlockPlayback } from "@/lib/wallet-unlock-client";
import { logWalletUnlockClient } from "@/lib/wallet-unlock-client-log";
import { markWalletEventSeen } from "@/lib/wallet-event-dedup";
import type { MerchantCardData, WalletEventPayload } from "./types";

function isDocumentVisible() {
  if (typeof document === "undefined") return true;
  return document.visibilityState === "visible";
}

export function useWalletUnlockAnimation(
  enabled: boolean,
  setCards: Dispatch<SetStateAction<MerchantCardData[]>>,
) {
  const [newCardName, setNewCardName] = useState<string | null>(null);
  const [newCard, setNewCard] = useState<MerchantCardData | null>(null);
  const [activeEventId, setActiveEventId] = useState<string | null>(null);

  const queuedOrPlayingIdsRef = useRef(new Set<string>());
  const queueRef = useRef<WalletEventPayload[]>([]);
  const playingRef = useRef(false);
  const ackSentRef = useRef(new Set<string>());

  const ackEvent = useCallback(async (eventId: string) => {
    if (ackSentRef.current.has(eventId)) return;
    ackSentRef.current.add(eventId);
    logWalletUnlockClient("acquittement envoyé", { eventId });
    try {
      const response = await fetch(
        `/api/customer/wallet/events/${encodeURIComponent(eventId)}/ack`,
        { method: "POST" },
      );
      if (response.ok) {
        markWalletEventSeen(eventId);
        logWalletUnlockClient("acquittement réussi", { eventId });
      } else {
        ackSentRef.current.delete(eventId);
      }
    } catch {
      ackSentRef.current.delete(eventId);
    }
  }, []);

  const startNextUnlock = useCallback(() => {
    if (playingRef.current) return;
    if (shouldDeferUnlockPlayback(isDocumentVisible())) return;

    const event = queueRef.current.shift();
    if (!event) return;

    playingRef.current = true;
    const created = cardFromUnlockEvent(event);
    setCards((prev) => {
      const exists =
        Boolean(event.customerMembershipId) &&
        prev.some((card) => card.id === event.customerMembershipId);
      if (exists) return prev;
      return [created, ...prev];
    });
    setNewCardName(created.name);
    setNewCard(created);
    setActiveEventId(event.id);
  }, [setCards]);

  const enqueueUnlock = useCallback(
    (event: WalletEventPayload) => {
      if (!isUnlockEventType(event.type)) return;
      if (!canEnqueueUnlockEvent(event, queuedOrPlayingIdsRef.current)) return;

      queuedOrPlayingIdsRef.current.add(event.id);
      logWalletUnlockClient("événement reçu", { eventId: event.id });

      if (shouldDeferUnlockPlayback(isDocumentVisible())) {
        logWalletUnlockClient("événement mis en attente", { eventId: event.id });
        queueRef.current.push(event);
        return;
      }

      queueRef.current.push(event);
      startNextUnlock();
    },
    [startNextUnlock],
  );

  const onOverlayDisplayed = useCallback(
    (eventId: string) => {
      if (activeEventId !== eventId) return;
      if (!isDocumentVisible()) return;
      logWalletUnlockClient("overlay monté", { eventId });
      logWalletUnlockClient("animation démarrée", { eventId });
      markWalletEventSeen(eventId);
      void ackEvent(eventId);
    },
    [activeEventId, ackEvent],
  );

  const onAnimationDone = useCallback(() => {
    setNewCardName(null);
    setNewCard(null);
    setActiveEventId(null);
    playingRef.current = false;
    startNextUnlock();
  }, [startNextUnlock]);

  useEffect(() => {
    if (!enabled) return;

    function flushWhenVisible() {
      if (shouldDeferUnlockPlayback(isDocumentVisible())) return;
      startNextUnlock();
    }

    document.addEventListener("visibilitychange", flushWhenVisible);
    return () => document.removeEventListener("visibilitychange", flushWhenVisible);
  }, [enabled, startNextUnlock]);

  useEffect(() => {
    if (!enabled) return;
    if (shouldDeferUnlockPlayback(isDocumentVisible())) return;

    let cancelled = false;
    fetch("/api/customer/wallet/pending-unlocks")
      .then((res) => (res.ok ? res.json() : null))
      .then((data: { events?: WalletEventPayload[] } | null) => {
        if (cancelled || !data?.events?.length) return;
        for (const event of data.events) {
          enqueueUnlock(event);
        }
      })
      .catch(() => {
        /* le flux SSE complète la livraison */
      });

    return () => {
      cancelled = true;
    };
  }, [enabled, enqueueUnlock]);

  return {
    newCardName,
    newCard,
    activeEventId,
    enqueueUnlock,
    onOverlayDisplayed,
    onAnimationDone,
  };
}
