import { requireMutatingRequest, requireUser } from "@/lib/api-guard";
import { jsonError, jsonOk, readJson } from "@/lib/http";
import { prisma } from "@/lib/prisma";
import { pushSubscribeSchema, pushUnsubscribeSchema, zodErrorMessage } from "@/lib/validation";

/** Enregistre un abonnement Web Push pour cet appareil (Partie 11 — un par appareil). */
export async function POST(req: Request) {
  const csrf = await requireMutatingRequest(req);
  if (csrf.error) return csrf.error;
  const auth = await requireUser(req);
  if (auth.error || !auth.user) return auth.error ?? jsonError("Connexion requise.", 401);

  const parsed = pushSubscribeSchema.safeParse(await readJson(req));
  if (!parsed.success) return jsonError(zodErrorMessage(parsed.error));

  await prisma.pushSubscription.upsert({
    where: { endpoint: parsed.data.endpoint },
    create: {
      userId: auth.user.id,
      endpoint: parsed.data.endpoint,
      p256dh: parsed.data.keys.p256dh,
      auth: parsed.data.keys.auth,
      userAgent: req.headers.get("user-agent")?.slice(0, 300),
    },
    update: {
      userId: auth.user.id,
      p256dh: parsed.data.keys.p256dh,
      auth: parsed.data.keys.auth,
      lastSeenAt: new Date(),
    },
  });

  return jsonOk({ ok: true });
}

/** Désabonne cet appareil (bouton explicite ou nettoyage côté client). */
export async function DELETE(req: Request) {
  const csrf = await requireMutatingRequest(req);
  if (csrf.error) return csrf.error;
  const auth = await requireUser(req);
  if (auth.error || !auth.user) return auth.error ?? jsonError("Connexion requise.", 401);

  const parsed = pushUnsubscribeSchema.safeParse(await readJson(req));
  if (!parsed.success) return jsonError(zodErrorMessage(parsed.error));

  await prisma.pushSubscription.deleteMany({
    where: { endpoint: parsed.data.endpoint, userId: auth.user.id },
  });

  return jsonOk({ ok: true });
}
