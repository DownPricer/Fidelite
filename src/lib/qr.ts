import { SignJWT, jwtVerify, errors } from "jose";
import { env } from "./env";

export type QrPayload = {
  mid: string;
  merch: string;
  jti: string;
  exp: number;
  iat: number;
};

export class QrError extends Error {
  constructor(
    message: string,
    public code: "expired" | "invalid" | "reused" | "merchant" | "missing",
  ) {
    super(message);
    this.name = "QrError";
  }
}

function secretKey() {
  return new TextEncoder().encode(env.qrSecret);
}

export async function signQrToken(input: {
  membershipId: string;
  merchantId: string;
  jti: string;
  ttlSeconds?: number;
}) {
  const ttl = input.ttlSeconds ?? env.qrTtlSeconds;
  return new SignJWT({
    mid: input.membershipId,
    merch: input.merchantId,
  })
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setJti(input.jti)
    .setIssuedAt()
    .setExpirationTime(`${ttl}s`)
    .sign(secretKey());
}

export async function verifyQrToken(token: string): Promise<QrPayload> {
  try {
    const { payload } = await jwtVerify(token, secretKey(), {
      algorithms: ["HS256"],
    });
    if (typeof payload.mid !== "string" || typeof payload.merch !== "string" || typeof payload.jti !== "string") {
      throw new QrError("QR invalide.", "invalid");
    }
    return {
      mid: payload.mid,
      merch: payload.merch,
      jti: payload.jti,
      exp: Number(payload.exp ?? 0),
      iat: Number(payload.iat ?? 0),
    };
  } catch (error) {
    if (error instanceof QrError) throw error;
    if (error instanceof errors.JWTExpired) {
      throw new QrError("Ce QR a expiré. Demandez au client de l'actualiser.", "expired");
    }
    throw new QrError("QR invalide.", "invalid");
  }
}

export function assertQrUsable(input: {
  payload: QrPayload;
  merchantId: string;
  usedAt?: Date | null;
  now?: Date;
}) {
  const now = input.now ?? new Date();
  if (input.payload.exp * 1000 <= now.getTime()) {
    throw new QrError("Ce QR a expiré. Demandez au client de l'actualiser.", "expired");
  }
  if (input.payload.merch !== input.merchantId) {
    throw new QrError("Ce QR n'appartient pas à ce commerce.", "merchant");
  }
  if (input.usedAt) {
    throw new QrError("Ce QR a déjà été utilisé.", "reused");
  }
}

export function publicQrErrorMessage(error: unknown) {
  if (error instanceof QrError) return error.message;
  return "Impossible de lire ce QR.";
}
