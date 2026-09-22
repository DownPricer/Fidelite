import { recordConsentEvents } from "@/lib/consent";
import { jsonError, jsonOk, readJson } from "@/lib/http";
import { prisma } from "@/lib/prisma";
import { UnsubscribeTokenError, verifyUnsubscribeToken } from "@/lib/unsubscribe-token";
import { z } from "zod";

const bodySchema = z.object({ token: z.string().min(1) });

/**
 * Désinscription en un clic depuis un e-mail — jamais de connexion requise (Partie 10/17).
 * Le jeton signé scope l'action à un seul champ pour un seul utilisateur ; retrait
 * immédiat, journalisé comme tout changement de consentement.
 */
export async function POST(req: Request) {
  const parsed = bodySchema.safeParse(await readJson(req));
  if (!parsed.success) return jsonError("Lien de désinscription invalide.", 400);

  let payload;
  try {
    payload = await verifyUnsubscribeToken(parsed.data.token);
  } catch (error) {
    if (error instanceof UnsubscribeTokenError) {
      return jsonError(error.message, 400, { code: "INVALID_TOKEN" });
    }
    throw error;
  }

  if (payload.scope === "all_marketing") {
    await prisma.$transaction(async (tx) => {
      await tx.customerPreferences.updateMany({
        where: { userId: payload.userId },
        data: {
          notifyMerchantOffers: false,
          notifyFifeLifeNews: false,
          adsMerchantPush: false,
          adsMerchantEmail: false,
          adsNetworkPush: false,
          adsNetworkEmail: false,
        },
      });
      await recordConsentEvents(tx, {
        userId: payload.userId,
        changes: {
          notifyMerchantOffers: false,
          notifyFifeLifeNews: false,
          adsMerchantPush: false,
          adsMerchantEmail: false,
          adsNetworkPush: false,
          adsNetworkEmail: false,
        },
        source: "email_unsubscribe_link",
      });
    });
    return jsonOk({ ok: true, scope: "all_marketing" });
  }

  await prisma.$transaction(async (tx) => {
    await tx.customerPreferences.updateMany({
      where: { userId: payload.userId },
      data: { [payload.scope]: false },
    });
    await recordConsentEvents(tx, {
      userId: payload.userId,
      changes: { [payload.scope]: false },
      source: "email_unsubscribe_link",
    });
  });

  return jsonOk({ ok: true, scope: payload.scope });
}
