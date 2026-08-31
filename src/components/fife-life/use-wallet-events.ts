"use client";

import { useEffect, useRef } from "react";
import type { WalletEventPayload } from "./types";

export function useWalletEvents(
  enabled: boolean,
  onEvent: (event: WalletEventPayload) => void,
) {
  const onEventRef = useRef(onEvent);
  onEventRef.current = onEvent;

  useEffect(() => {
    if (!enabled) return;

    let stopped = false;
    let source: EventSource | null = null;
    let lastEventId: string | undefined;
    let retryTimer: ReturnType<typeof setTimeout> | null = null;

    function disconnect() {
      if (retryTimer) {
        clearTimeout(retryTimer);
        retryTimer = null;
      }
      source?.close();
      source = null;
    }

    function connect() {
      if (stopped || document.hidden) return;
      disconnect();
      const url = lastEventId
        ? `/api/customer/wallet/events?lastEventId=${encodeURIComponent(lastEventId)}`
        : "/api/customer/wallet/events";
      source = new EventSource(url);
      source.addEventListener("wallet", (raw) => {
        const ev = raw as MessageEvent<string>;
        if (ev.lastEventId) lastEventId = ev.lastEventId;
        try {
          const parsed = JSON.parse(ev.data) as WalletEventPayload;
          if (parsed.id) lastEventId = parsed.id;
          onEventRef.current(parsed);
        } catch {
          /* flux malformé ignoré */
        }
      });
      source.onerror = () => {
        disconnect();
        if (!stopped && !document.hidden) {
          retryTimer = setTimeout(connect, 1600);
        }
      };
    }

    function onVisibility() {
      if (document.hidden) {
        disconnect();
        return;
      }
      connect();
    }

    connect();
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      stopped = true;
      document.removeEventListener("visibilitychange", onVisibility);
      disconnect();
    };
  }, [enabled]);
}
