"use client";

import { useEffect } from "react";
import { shouldRegisterFidetoServiceWorker } from "@/lib/pwa-client";

export function PwaRegister() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;
    if (!shouldRegisterFidetoServiceWorker(window.location.hostname)) return;
    navigator.serviceWorker.register("/sw.js").catch(() => {
      // L'installation PWA reste possible via le manifeste même si le SW échoue.
    });
  }, []);
  return null;
}
