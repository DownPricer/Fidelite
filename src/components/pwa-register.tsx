"use client";

import { useEffect } from "react";

export function PwaRegister() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;
    navigator.serviceWorker.register("/sw.js").catch(() => {
      // L'installation PWA reste possible via le manifeste même si le SW échoue.
    });
  }, []);
  return null;
}
