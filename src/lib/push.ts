import webpush from "web-push";
import { env, isWebPushConfigured } from "./env";
import { prisma } from "./prisma";

export class WebPushNotConfiguredError extends Error {
  constructor() {
    super("Le push n'est pas disponible : les clés VAPID ne sont pas configurées.");
    this.name = "WebPushNotConfiguredError";
  }
}

let configured = false;

function ensureConfigured() {
  if (!isWebPushConfigured()) throw new WebPushNotConfiguredError();
  if (!configured) {
    webpush.setVapidDetails(env.vapidSubject, env.vapidPublicKey, env.vapidPrivateKey);
    configured = true;
  }
}

export type PushPayload = {
  title: string;
  body: string;
  imageUrl?: string | null;
  url?: string | null;
  campaignId?: string | null;
};

export type PushSendResult = { ok: true } | { ok: false; expired: boolean; error: string };

/**
 * Envoie une notification à un abonnement précis. `expired: true` signale un endpoint
 * mort (404/410) à nettoyer côté appelant (Partie 11 — suppression automatique).
 */
export async function sendPushToSubscription(
  subscription: { endpoint: string; p256dh: string; auth: string },
  payload: PushPayload,
): Promise<PushSendResult> {
  ensureConfigured();
  try {
    await webpush.sendNotification(
      {
        endpoint: subscription.endpoint,
        keys: { p256dh: subscription.p256dh, auth: subscription.auth },
      },
      JSON.stringify(payload),
    );
    return { ok: true };
  } catch (error) {
    const statusCode = (error as { statusCode?: number } | undefined)?.statusCode;
    const expired = statusCode === 404 || statusCode === 410;
    return {
      ok: false,
      expired,
      error: error instanceof Error ? error.message : "Échec d'envoi push.",
    };
  }
}

/** Envoie à tous les appareils d'un utilisateur, nettoie automatiquement les endpoints expirés. */
export async function sendPushToUser(userId: string, payload: PushPayload) {
  const subscriptions = await prisma.pushSubscription.findMany({ where: { userId } });
  const results = await Promise.all(
    subscriptions.map(async (sub) => {
      const result = await sendPushToSubscription(sub, payload);
      if (!result.ok && result.expired) {
        await prisma.pushSubscription.delete({ where: { id: sub.id } }).catch(() => {});
      }
      return { subscriptionId: sub.id, ...result };
    }),
  );
  return results;
}
