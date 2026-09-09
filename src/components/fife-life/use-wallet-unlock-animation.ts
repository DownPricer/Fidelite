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
  shouldPlayUnlockAnimation,
} from "@/lib/wallet-unlock";
import { logWalletUnlock } from "@/lib/wallet-unlock-log";
import { markWalletEventSeen } from "@/lib/wallet-event-dedup";
import type { MerchantCardData, WalletEventPayload } from "./types";

export function useWalletUnlockAnimation(
  enabled: boolean,
  setCards: Dispatch<SetStateAction<MerchantCardData[]>>,
) {
  const [newCardName, setNewCardName] = useState<string | null>(null);
  const [newCard, setNewCard] = useState<MerchantCardData | null>(null);
  const [pendingAckEventId, setPendingAckEventId] = useState<string | null>(null);

  const processedIdsRef = useRef(new Set<string>());
  const queueRef = useRef<WalletEventPayload[]>([]);
  const playingRef = useRef(false);

  const ackEvent = useCallback(async (eventId: string) => {
    try {
      await fetch(`/api/customer/wallet/events/${encodeURIComponent(eventId)}/ack`, {
        method: "POST",
      });
      markWalletEventSeen(eventId);
      logWalletUnlock("événement acquitté", { eventId });
    } catch {
      /* l’acquittement sera retenté à la prochaine ouverture */
    }
  }, []);

  const startNextUnlock = useCallback(() => {
    if (playingRef.current) return;
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
    setPendingAckEventId(event.id);
    logWalletUnlock("animation démarrée", {
      eventId: event.id,
      merchantId: event.merchantId ?? undefined,
      membershipId: event.customerMembershipId ?? undefined,
    });
  }, [setCards]);

  const enqueueUnlock = useCallback(
    (event: WalletEventPayload) => {
      if (!isUnlockEventType(event.type)) return;
      if (!shouldPlayUnlockAnimation(event, processedIdsRef.current)) return;

      processedIdsRef.current.add(event.id);
      logWalletUnlock("événement reçu", {
        eventId: event.id,
        eventType: event.type,
        merchantId: event.merchantId ?? undefined,
        membershipId: event.customerMembershipId ?? undefined,
      });
      queueRef.current.push(event);
      startNextUnlock();
    },
    [startNextUnlock],
  );

  const onAnimationDone = useCallback(async () => {
    const eventId = pendingAckEventId;
    setNewCardName(null);
    setNewCard(null);
    setPendingAckEventId(null);
    playingRef.current = false;
    if (eventId) {
      await ackEvent(eventId);
    }
    startNextUnlock();
  }, [ackEvent, pendingAckEventId, startNextUnlock]);

  useEffect(() => {
    if (!enabled) return;

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
    enqueueUnlock,
    onAnimationDone,
  };
}
