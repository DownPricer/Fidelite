import { createHash, randomBytes } from "crypto";
import { cookies } from "next/headers";
import type { NextRequest } from "next/server";
import { SessionKind } from "@prisma/client";
import { env, isProduction } from "./env";
import { prisma } from "./prisma";
import { isSuperAdmin } from "./rbac";

export function hashSuperAdminToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

function cookieOptions(expires: Date) {
  return {
    httpOnly: true,
    sameSite: "strict" as const,
    secure: isProduction(),
    path: "/",
    expires,
  };
}

export function isSuperAdminEmailAllowed(email: string) {
  const raw = process.env.SUPER_ADMIN_ALLOWED_EMAILS ?? env.superAdminAllowedEmails;
  const allowed = raw
    .split(",")
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);
  if (allowed.length === 0) {
    return !isProduction();
  }
  return allowed.includes(email.trim().toLowerCase());
}

export async function createSuperAdminSession(
  userId: string,
  meta: { ip?: string; userAgent?: string } = {},
) {
  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + env.superAdminSessionHours * 60 * 60 * 1000);
  await prisma.session.create({
    data: {
      userId,
      tokenHash: hashSuperAdminToken(token),
      kind: SessionKind.SUPER_ADMIN,
      expiresAt,
      ip: meta.ip,
      userAgent: meta.userAgent,
    },
  });
  const jar = await cookies();
  jar.set(env.superAdminSessionCookie, token, cookieOptions(expiresAt));
  return token;
}

export async function destroySuperAdminSession(token?: string) {
  const jar = await cookies();
  const value = token ?? jar.get(env.superAdminSessionCookie)?.value;
  if (value) {
    await prisma.session.deleteMany({
      where: { tokenHash: hashSuperAdminToken(value), kind: SessionKind.SUPER_ADMIN },
    });
  }
  jar.set(env.superAdminSessionCookie, "", { ...cookieOptions(new Date(0)), maxAge: 0 });
}

export async function revokeAllSuperAdminSessions(userId: string) {
  await prisma.session.deleteMany({
    where: { userId, kind: SessionKind.SUPER_ADMIN },
  });
}

export function superAdminTokenFromRequest(req: Request | NextRequest) {
  const cookie = req.headers.get("cookie") ?? "";
  const match = new RegExp(`(?:^|;\\s*)${env.superAdminSessionCookie}=([^;]+)`).exec(cookie);
  return match?.[1] ? decodeURIComponent(match[1]) : null;
}

export async function getSuperAdminUserFromToken(token: string) {
  const session = await prisma.session.findFirst({
    where: { tokenHash: hashSuperAdminToken(token), kind: SessionKind.SUPER_ADMIN },
    include: { user: true },
  });
  if (!session || session.expiresAt < new Date() || !session.user.isActive) return null;
  if (!isSuperAdmin(session.user.platformRole)) return null;
  if (!isSuperAdminEmailAllowed(session.user.email)) return null;
  return session.user;
}

export async function getSuperAdminSessionUser() {
  const jar = await cookies();
  const token = jar.get(env.superAdminSessionCookie)?.value;
  if (!token) return null;
  return getSuperAdminUserFromToken(token);
}

export async function getRequestSuperAdminUser(req: Request | NextRequest) {
  const token = superAdminTokenFromRequest(req);
  if (!token) return null;
  return getSuperAdminUserFromToken(token);
}
