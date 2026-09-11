import { randomBytes } from "crypto";
import { cookies } from "next/headers";
import type { NextRequest } from "next/server";
import { MerchantRole, SessionKind } from "@prisma/client";
import { canEmployeeAccess } from "./employee-invitation";
import { env, isProduction } from "./env";
import { prisma } from "./prisma";
import { hashToken } from "./session";

function cookieOptions(expires: Date) {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: isProduction(),
    path: "/",
    expires,
  };
}

export function employeeSessionCookieName() {
  return env.employeeSessionCookie;
}

function employeeCookieName() {
  return employeeSessionCookieName();
}

export function employeeTokenFromRequest(req: Request | import("next/server").NextRequest) {
  return readEmployeeCookie(req.headers.get("cookie") ?? "");
}

function readEmployeeCookie(cookieHeader: string) {
  const name = employeeCookieName();
  const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}=([^;]+)`));
  return match?.[1] ? decodeURIComponent(match[1]) : null;
}

export async function createEmployeeSession(
  input: {
    userId: string;
    merchantMembershipId: string;
  },
  meta: { ip?: string; userAgent?: string } = {},
) {
  const rawToken = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + env.sessionDays * 24 * 60 * 60 * 1000);

  await prisma.session.create({
    data: {
      userId: input.userId,
      merchantMembershipId: input.merchantMembershipId,
      kind: SessionKind.EMPLOYEE,
      tokenHash: hashToken(rawToken),
      expiresAt,
      ip: meta.ip,
      userAgent: meta.userAgent,
    },
  });

  const jar = await cookies();
  jar.set(employeeCookieName(), rawToken, cookieOptions(expiresAt));
  return rawToken;
}

export async function revokeEmployeeSessionToken(token: string) {
  await prisma.session.deleteMany({
    where: { tokenHash: hashToken(token), kind: SessionKind.EMPLOYEE },
  });
}

export async function destroyEmployeeSession(token?: string) {
  const jar = await cookies();
  const value = token ?? jar.get(employeeCookieName())?.value;
  if (value) {
    await revokeEmployeeSessionToken(value);
  }
  jar.set(employeeCookieName(), "", { ...cookieOptions(new Date(0)), maxAge: 0 });
}

export async function revokeEmployeeSessions(userId: string) {
  await prisma.session.deleteMany({
    where: { userId, kind: SessionKind.EMPLOYEE },
  });
}

export async function employeeFromToken(token: string) {
  try {
    const session = await prisma.session.findFirst({
      where: { tokenHash: hashToken(token), kind: SessionKind.EMPLOYEE },
      include: {
        user: true,
        merchantMembership: {
          include: { merchant: true },
        },
      },
    });

    if (!session || session.expiresAt < new Date()) return null;
    if (!session.merchantMembership) return null;

    const membership = session.merchantMembership;
    if (
      membership.role !== MerchantRole.EMPLOYEE ||
      !canEmployeeAccess({
        userActive: session.user.isActive,
        membershipActive: membership.isActive,
        invitationStatus: membership.invitationStatus,
        merchantActive: membership.merchant.isActive,
      })
    ) {
      return null;
    }

    return {
      user: session.user,
      membership,
      sessionId: session.id,
    };
  } catch (error) {
    console.error("[employee-session] Impossible de lire la session:", error);
    return null;
  }
}

export async function getEmployeeSession() {
  const jar = await cookies();
  const token = jar.get(employeeCookieName())?.value;
  if (!token) return null;
  return employeeFromToken(token);
}

export async function getRequestEmployee(req: Request | NextRequest) {
  const token = employeeTokenFromRequest(req);
  if (!token) return null;
  return employeeFromToken(token);
}

export type EmployeeSession = NonNullable<Awaited<ReturnType<typeof employeeFromToken>>>;
