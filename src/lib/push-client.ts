"use client";

/**
 * Abonnement Web Push côté client (Partie 11).
 * N'est appelé QUE sur un clic explicite ("Activer les notifications") — jamais au
 * chargement de la page. Sur iPhone, l'abonnement échoue tant que l'app n'est pas
 * ajoutée à l'écran d'accueil : isIosNotStandalone() sert à afficher l'explication
 * avant même de tenter l'appel.
 */

export type PushSupportState = "unsupported" | "ios-needs-home-screen" | "ready" | "denied" | "subscribed";

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = atob(base64);
  return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
}

export function isIosNotStandalone(): boolean {
  if (typeof navigator === "undefined") return false;
  const isIos = /iphone|ipad|ipod/i.test(navigator.userAgent);
  const isStandalone =
    window.matchMedia?.("(display-mode: standalone)").matches || (navigator as { standalone?: boolean }).standalone;
  return isIos && !isStandalone;
}

export function getPushSupportState(): PushSupportState {
  if (typeof window === "undefined") return "unsupported";
  if (!("serviceWorker" in navigator) || !("PushManager" in window)) return "unsupported";
  if (isIosNotStandalone()) return "ios-needs-home-screen";
  if (typeof Notification !== "undefined" && Notification.permission === "denied") return "denied";
  return "ready";
}

export async function enablePushNotifications(vapidPublicKey: string): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
      return { ok: false, error: "Les notifications ne sont pas prises en charge sur cet appareil." };
    }
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      return { ok: false, error: "Autorisation refusée." };
    }
    const registration = await navigator.serviceWorker.ready;
    const applicationServerKey = urlBase64ToUint8Array(vapidPublicKey);
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: applicationServerKey.buffer.slice(
        applicationServerKey.byteOffset,
        applicationServerKey.byteOffset + applicationServerKey.byteLength,
      ) as ArrayBuffer,
    });
    const json = subscription.toJSON();
    const response = await fetch("/api/customer/push", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ endpoint: json.endpoint, keys: json.keys }),
    });
    if (!response.ok) {
      return { ok: false, error: "Impossible d'enregistrer l'abonnement." };
    }
    return { ok: true };
  } catch {
    return { ok: false, error: "Impossible d'activer les notifications." };
  }
}

export async function disablePushNotifications(): Promise<void> {
  if (!("serviceWorker" in navigator)) return;
  const registration = await navigator.serviceWorker.ready.catch(() => null);
  const subscription = await registration?.pushManager.getSubscription().catch(() => null);
  if (!subscription) return;
  const endpoint = subscription.endpoint;
  await subscription.unsubscribe().catch(() => {});
  await fetch("/api/customer/push", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ endpoint }),
  }).catch(() => {});
}
