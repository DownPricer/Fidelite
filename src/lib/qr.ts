import { SignJWT, jwtVerify } from "jose";
import { env } from "./env";

/**
 * Charge minimale véhiculée dans le QR côté client.
 * - jti est un identifiant opaque stocké côté serveur
 * - aucune information brute sur le client n’est exposée
 */
export type QrPayload = {
  jti: string;
};

export class QrError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "QrError";
  }
}

function secretKey() {
  return new TextEncoder().encode(env.qrSecret);
}

/**
 * Génère un jeton signé à partir d’un identifiant opaque (jti).
 * Pas d’expiration ni de données client brutes : c’est la base d’un QR fixe.
 */
export async function signQrToken(input: { jti: string }) {
  return new SignJWT({})
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setJti(input.jti)
    .sign(secretKey());
}

export async function verifyQrToken(token: string): Promise<QrPayload> {
  try {
    const { payload } = await jwtVerify(token, secretKey(), {
      algorithms: ["HS256"],
    });
    if (typeof payload.jti !== "string") {
      throw new QrError("QR invalide.");
    }
    return {
      jti: payload.jti,
    };
  } catch (error) {
    if (error instanceof QrError) throw error;
    throw new QrError("QR invalide.");
  }
}

/**
 * Contrôle métier d’un QR fixe : le commerce doit correspondre.
 * `usedAt` n’est jamais un motif de refus — le même QR peut être scanné à chaque visite.
 */
export function assertQrUsable(input: {
  payload: QrPayload;
  merchantId: string;
  storedMerchantId: string;
  usedAt?: Date | null;
  now?: Date;
}) {
  void input.payload;
  void input.usedAt;
  void input.now;
  if (input.storedMerchantId !== input.merchantId) {
    throw new QrError("Ce QR n'appartient pas à ce commerce.");
  }
}

export function publicQrErrorMessage(error: unknown) {
  if (error instanceof QrError) return error.message;
  return "Impossible de lire ce QR.";
}
