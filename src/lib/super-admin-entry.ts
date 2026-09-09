import { cookies } from "next/headers";
import type { NextRequest } from "next/server";
import { env, isProduction } from "./env";

export const SUPER_ADMIN_ENTRY_COOKIE = "fifelite_super_admin_entry";

export function superAdminEntryCookieOptions(maxAgeSeconds: number) {
  return {
    httpOnly: true,
    sameSite: "strict" as const,
    secure: isProduction(),
    path: "/",
    maxAge: maxAgeSeconds,
  };
}

export function setSuperAdminEntryCookie() {
  // 8 h — aligné sur la session super-admin
  const maxAge = env.superAdminSessionHours * 60 * 60;
  return { name: SUPER_ADMIN_ENTRY_COOKIE, value: "1", options: superAdminEntryCookieOptions(maxAge) };
}

export function hasSuperAdminEntryCookie(req: NextRequest | Request) {
  const cookie = req.headers.get("cookie") ?? "";
  return new RegExp(`(?:^|;\\s*)${SUPER_ADMIN_ENTRY_COOKIE}=1`).test(cookie);
}

export async function hasSuperAdminEntryFromCookies() {
  const jar = await cookies();
  return jar.get(SUPER_ADMIN_ENTRY_COOKIE)?.value === "1";
}

export function isSuperAdminAllowedEmailsConfigured() {
  const raw = process.env.SUPER_ADMIN_ALLOWED_EMAILS ?? env.superAdminAllowedEmails;
  return raw.split(",").map((v) => v.trim()).filter(Boolean).length > 0;
}

export function assertSuperAdminProductionConfig() {
  if (isProduction() && !isSuperAdminAllowedEmailsConfigured()) {
    return "Configuration super-admin incomplète : SUPER_ADMIN_ALLOWED_EMAILS requis en production.";
  }
  return null;
}
