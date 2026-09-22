import { SignJWT, jwtVerify } from "jose";
import { env } from "./env";

/**
 * Jeton de désinscription signé, expirable (Parties 10/17) : présent dans chaque
 * e-mail de campagne, il permet un retrait de consentement en un clic sans connexion,
 * scopé à un seul champ de préférence pour un seul utilisateur.
 */
export type UnsubscribeScope =
  | "adsMerchantPush"
  | "adsMerchantEmail"
  | "adsNetworkPush"
  | "adsNetworkEmail"
  | "notifyMerchantOffers"
  | "notifyFifeLifeNews"
  | "all_marketing";

export type UnsubscribePayload = {
  userId: string;
  scope: UnsubscribeScope;
  merchantId?: string;
};

export class UnsubscribeTokenError extends Error {
  constructor(message = "Ce lien de désinscription n'est plus valide.") {
    super(message);
    this.name = "UnsubscribeTokenError";
  }
}

function secretKey() {
  return new TextEncoder().encode(env.unsubscribeSecret);
}

/** Les liens de désinscription restent valides longtemps (Partie 17 : "expirables"). */
const UNSUBSCRIBE_TTL = "180d";

export async function signUnsubscribeToken(payload: UnsubscribePayload): Promise<string> {
  return new SignJWT({ scope: payload.scope, merchantId: payload.merchantId ?? null })
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setSubject(payload.userId)
    .setIssuedAt()
    .setExpirationTime(UNSUBSCRIBE_TTL)
    .sign(secretKey());
}

export async function verifyUnsubscribeToken(token: string): Promise<UnsubscribePayload> {
  try {
    const { payload } = await jwtVerify(token, secretKey(), { algorithms: ["HS256"] });
    if (typeof payload.sub !== "string" || typeof payload.scope !== "string") {
      throw new UnsubscribeTokenError();
    }
    return {
      userId: payload.sub,
      scope: payload.scope as UnsubscribeScope,
      merchantId: typeof payload.merchantId === "string" ? payload.merchantId : undefined,
    };
  } catch (error) {
    if (error instanceof UnsubscribeTokenError) throw error;
    throw new UnsubscribeTokenError();
  }
}

export function unsubscribeUrl(baseUrl: string, token: string): string {
  return `${baseUrl.replace(/\/$/, "")}/desinscription?token=${encodeURIComponent(token)}`;
}
