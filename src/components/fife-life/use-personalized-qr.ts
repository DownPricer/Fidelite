"use client";

import { useCallback, useEffect, useState } from "react";

import {
  loadPersonalizedQr,
  PERSONALIZED_QR_KEY,
} from "./qr-cache";

export function usePersonalizedQr(enabled: boolean) {
  const [qrSrc, setQrSrc] = useState<string | null>(null);
  const [qrFailed, setQrFailed] = useState(false);

  const reload = useCallback(async () => {
    if (!enabled) return;
    setQrFailed(false);
    const next = await loadPersonalizedQr(PERSONALIZED_QR_KEY, { force: true });
    setQrSrc(next);
    if (!next) setQrFailed(true);
  }, [enabled]);

  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;
    void loadPersonalizedQr(PERSONALIZED_QR_KEY).then((next) => {
      if (cancelled) return;
      setQrSrc(next);
      if (!next) setQrFailed(true);
    });
    return () => {
      cancelled = true;
    };
  }, [enabled]);

  return { qrSrc, qrFailed, reload };
}
