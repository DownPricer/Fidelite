import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { env, isProduction } from "./env";

const COOKIE = "fideto_merchant_signup_grant";

type GrantPayload = {
  requestId: string;
  email: string;
  exp: number;
};

function sign(payload: string) {
  return createHmac("sha256", env.merchantSignupGrantSecret).update(payload).digest("base64url");
}

export function encodeMerchantSignupGrant(input: { requestId: string; email: string }) {
  const exp = Date.now() + env.merchantSignupGrantHours * 60 * 60 * 1000;
  const body = JSON.stringify({ requestId: input.requestId, email: input.email.toLowerCase(), exp });
  const bodyB64 = Buffer.from(body, "utf8").toString("base64url");
  return `${bodyB64}.${sign(bodyB64)}`;
}

export function decodeMerchantSignupGrant(token: string): GrantPayload | null {
  const [bodyB64, sig] = token.split(".");
  if (!bodyB64 || !sig) return null;
  const expected = sign(bodyB64);
  try {
    const a = Buffer.from(sig);
    const b = Buffer.from(expected);
    if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  } catch {
    return null;
  }
  try {
    const parsed = JSON.parse(Buffer.from(bodyB64, "base64url").toString("utf8")) as GrantPayload;
    if (!parsed.requestId || !parsed.email || !parsed.exp) return null;
    if (parsed.exp < Date.now()) return null;
    return parsed;
  } catch {
    return null;
  }
}

export async function setMerchantSignupGrantCookie(token: string) {
  const store = await cookies();
  store.set(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: isProduction(),
    path: "/",
    maxAge: env.merchantSignupGrantHours * 60 * 60,
  });
}

export async function readMerchantSignupGrantCookie(): Promise<GrantPayload | null> {
  const store = await cookies();
  const raw = store.get(COOKIE)?.value;
  if (!raw) return null;
  return decodeMerchantSignupGrant(raw);
}

export async function clearMerchantSignupGrantCookie() {
  const store = await cookies();
  store.delete(COOKIE);
}
