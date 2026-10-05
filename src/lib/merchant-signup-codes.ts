import { createHash, randomInt, timingSafeEqual } from "crypto";
import { env } from "./env";

export function generateSignupCode(): string {
  return String(randomInt(0, 1_000_000)).padStart(6, "0");
}

export function hashSignupCode(code: string) {
  return createHash("sha256")
    .update(`${env.merchantSignupCodePepper}:${code.replace(/\s/g, "")}`)
    .digest("hex");
}

export function verifySignupCode(code: string, codeHash: string | null | undefined) {
  if (!codeHash) return false;
  const normalized = code.replace(/\s/g, "");
  if (!/^\d{6}$/.test(normalized)) return false;
  const computed = hashSignupCode(normalized);
  try {
    return timingSafeEqual(Buffer.from(computed, "utf8"), Buffer.from(codeHash, "utf8"));
  } catch {
    return false;
  }
}

export function signupCodeExpiryDate() {
  return new Date(Date.now() + env.merchantSignupCodeDays * 24 * 60 * 60 * 1000);
}
