import { createHash, randomBytes } from "crypto";
import { cookies } from "next/headers";
import type { NextRequest } from "next/server";
import { env, isProduction } from "./env";
import { prisma } from "./prisma";

export function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

function cookieOptions(expires: Date) {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: isProduction(),
    path: "/",
    expires,
  };
}

export async function createSession(
  userId: string,
  meta: { ip?: string; userAgent?: string } = {},
) {
  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + env.sessionDays * 24 * 60 * 60 * 1000);
  await prisma.session.create({
    data: {
      userId,
      tokenHash: hashToken(token),
      expiresAt,
      ip: meta.ip,
      userAgent: meta.userAgent,
    },
  });
  const jar = await cookies();
  jar.set(env.sessionCookie, token, cookieOptions(expiresAt));
  return token;
}

export async function destroySession(token?: string) {
  const jar = await cookies();
  const value = token ?? jar.get(env.sessionCookie)?.value;
  if (value) {
    await prisma.session.deleteMany({ where: { tokenHash: hashToken(value) } });
  }
  jar.set(env.sessionCookie, "", { ...cookieOptions(new Date(0)), maxAge: 0 });
}

export async function getSessionUser() {
  const jar = await cookies();
  const token = jar.get(env.sessionCookie)?.value;
  if (!token) return null;
  return userFromToken(token);
}

export function tokenFromRequest(req: Request | NextRequest) {
  const cookie = req.headers.get("cookie") ?? "";
  const match = cookie.match(new RegExp(`(?:^|;\\s*)${env.sessionCookie}=([^;]+)`));
  return match?.[1] ? decodeURIComponent(match[1]) : null;
}

export async function userFromToken(token: string) {
  try {
    const session = await prisma.session.findUnique({
      where: { tokenHash: hashToken(token) },
      include: {
        user: {
          include: {
            merchantMemberships: {
              where: { isActive: true },
              include: { merchant: true },
            },
          },
        },
      },
    });
    if (!session || session.expiresAt < new Date() || !session.user.isActive) {
      return null;
    }
    return session.user;
  } catch (error) {
    console.error("[session] Impossible de lire la session:", error);
    return null;
  }
}

export async function getRequestUser(req: Request | NextRequest) {
  const token = tokenFromRequest(req);
  if (!token) return null;
  return userFromToken(token);
}

export type SessionUser = NonNullable<Awaited<ReturnType<typeof userFromToken>>>;
