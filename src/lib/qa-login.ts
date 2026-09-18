import { randomBytes } from "crypto";
import { MerchantRole, PlatformRole, Prisma, type QaLoginRole } from "@prisma/client";
import { writeAudit } from "@/lib/audit";
import { canEmployeeAccess } from "@/lib/employee-invitation";
import { employeeSessionCookieName } from "@/lib/employee-session";
import { env, isProduction } from "@/lib/env";
import { hashToken } from "@/lib/session";
import { destroyEmployeeSession } from "@/lib/employee-session";
import { destroySession, createSession } from "@/lib/session";
import { createEmployeeSession } from "@/lib/employee-session";
import { CLIENT_DEMO_COOKIE, EMPLOYEE_DEMO_COOKIE, MERCHANT_DEMO_COOKIE } from "@/lib/demo-mode";
import { prisma } from "@/lib/prisma";

export const QA_LOGIN_TTL_MS = 5 * 60 * 1000;
export const QA_LOGIN_DEFAULT_TTL_MINUTES = 5;
export const QA_LOGIN_MIN_TTL_MINUTES = 1;
export const QA_LOGIN_MAX_TTL_MINUTES = 120;
export const QA_LOGIN_ROLES = ["merchant", "employee", "customer"] as const;

export type QaLoginRoleName = (typeof QA_LOGIN_ROLES)[number];

type RequestMeta = {
  ip?: string;
  userAgent?: string;
};

type CreateQaMagicLoginTokenOptions = {
  ttlMinutes?: number;
};

type ResolvedQaSubject = {
  role: QaLoginRoleName;
  subjectId: string;
  userId: string;
  merchantMembershipId?: string;
  merchantId?: string;
};

type ExchangeSuccess = {
  ok: true;
  role: QaLoginRoleName;
  redirectTo: string;
};

type ExchangeFailure = {
  ok: false;
  status: number;
  code: "disabled" | "missing_token" | "invalid_token" | "subject_not_allowed";
};

export function isQaMagicLoginEnabled() {
  return env.qaMagicLoginEnabled;
}

export function parseQaLoginRole(value: string | undefined): QaLoginRoleName | null {
  return QA_LOGIN_ROLES.includes(value as QaLoginRoleName) ? (value as QaLoginRoleName) : null;
}

export function assertQaLoginTtlMinutes(value = QA_LOGIN_DEFAULT_TTL_MINUTES) {
  if (!Number.isInteger(value)) {
    throw new Error("TTL QA invalide : utilisez un nombre entier de minutes.");
  }
  if (value < QA_LOGIN_MIN_TTL_MINUTES) {
    throw new Error(`TTL QA invalide : minimum ${QA_LOGIN_MIN_TTL_MINUTES} minute.`);
  }
  if (value > QA_LOGIN_MAX_TTL_MINUTES) {
    throw new Error(`TTL QA invalide : maximum strict ${QA_LOGIN_MAX_TTL_MINUTES} minutes.`);
  }
  return value;
}

export function parseQaLoginTtlMinutes(raw: string | undefined) {
  if (raw === undefined) return QA_LOGIN_DEFAULT_TTL_MINUTES;
  if (!/^\d+$/.test(raw)) {
    throw new Error("TTL QA invalide : utilisez un nombre entier positif.");
  }
  return assertQaLoginTtlMinutes(Number(raw));
}

export function qaRedirectForRole(role: QaLoginRoleName) {
  switch (role) {
    case "merchant":
      return "/app";
    case "employee":
      return "/employe/scan";
    case "customer":
      return "/carte";
  }
}

function configuredSubjectId(role: QaLoginRoleName) {
  switch (role) {
    case "merchant":
      return env.qaMerchantUserId.trim();
    case "employee":
      return env.qaEmployeeId.trim();
    case "customer":
      return env.qaCustomerUserId.trim();
  }
}

async function resolveConfiguredQaSubject(role: QaLoginRoleName): Promise<ResolvedQaSubject | null> {
  const configuredId = configuredSubjectId(role);
  if (!configuredId) return null;

  if (role === "merchant") {
    const user = await prisma.user.findUnique({
      where: { id: configuredId },
      include: {
        merchantMemberships: {
          where: { role: MerchantRole.MERCHANT_ADMIN, isActive: true },
          include: { merchant: true },
        },
      },
    });
    const membership = user?.merchantMemberships.find((item) => item.merchant.isActive);
    if (!user?.isActive || !membership) return null;
    return { role, subjectId: user.id, userId: user.id, merchantId: membership.merchantId };
  }

  if (role === "customer") {
    const user = await prisma.user.findUnique({
      where: { id: configuredId },
      include: {
        customerMemberships: {
          where: { removedAt: null, merchant: { isActive: true } },
          take: 1,
        },
      },
    });
    if (!user?.isActive || user.platformRole !== PlatformRole.CUSTOMER || user.customerMemberships.length === 0) {
      return null;
    }
    return { role, subjectId: user.id, userId: user.id };
  }

  const memberships = await prisma.merchantMembership.findMany({
    where: {
      OR: [{ id: configuredId }, { userId: configuredId }],
      role: MerchantRole.EMPLOYEE,
    },
    include: { user: true, merchant: true },
  });
  if (memberships.length !== 1) return null;

  const membership = memberships[0];
  if (
    !canEmployeeAccess({
      userActive: membership.user.isActive,
      membershipActive: membership.isActive,
      invitationStatus: membership.invitationStatus,
      merchantActive: membership.merchant.isActive,
    })
  ) {
    return null;
  }

  return {
    role,
    subjectId: membership.id,
    userId: membership.userId,
    merchantMembershipId: membership.id,
    merchantId: membership.merchantId,
  };
}

export async function isQaSubjectAllowed(role: QaLoginRoleName, subjectId: string) {
  const resolved = await resolveConfiguredQaSubject(role);
  return Boolean(resolved && resolved.subjectId === subjectId);
}

export async function createQaMagicLoginToken(
  role: QaLoginRoleName,
  meta: RequestMeta = {},
  options: CreateQaMagicLoginTokenOptions = {},
) {
  if (!isQaMagicLoginEnabled()) {
    await auditQaLogin("QA_MAGIC_LOGIN_CREATE_REFUSED", { role, reason: "disabled" }, meta);
    throw new Error("QA magic login is disabled.");
  }

  const subject = await resolveConfiguredQaSubject(role);
  if (!subject) {
    await auditQaLogin("QA_MAGIC_LOGIN_CREATE_REFUSED", { role, reason: "subject_not_allowed" }, meta);
    throw new Error(`No allowed QA subject configured for role ${role}.`);
  }

  const ttlMinutes = assertQaLoginTtlMinutes(options.ttlMinutes);
  const token = randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + ttlMinutes * 60 * 1000);
  await prisma.qaMagicLoginToken.create({
    data: {
      tokenHash: hashToken(token),
      role: role as QaLoginRole,
      subjectId: subject.subjectId,
      expiresAt,
    },
  });

  await auditQaLogin(
    "QA_MAGIC_LOGIN_CREATE",
    { role, subjectId: subject.subjectId, expiresAt: expiresAt.toISOString(), ttlMinutes },
    meta,
    subject,
  );

  return {
    token,
    expiresAt,
    role,
    subjectId: subject.subjectId,
    url: qaLoginUrl(token),
  };
}

export function qaLoginUrl(token: string) {
  const origin = env.qaMagicLoginOrigin.replace(/\/$/, "");
  return `${origin}/qa-login#token=${encodeURIComponent(token)}`;
}

export async function exchangeQaMagicLoginToken(
  token: string | undefined,
  meta: RequestMeta = {},
): Promise<ExchangeSuccess | ExchangeFailure> {
  if (!isQaMagicLoginEnabled()) return { ok: false, status: 404, code: "disabled" };
  if (!token) {
    await auditQaLogin("QA_MAGIC_LOGIN_EXCHANGE_FAILED", { reason: "missing_token" }, meta);
    return { ok: false, status: 400, code: "missing_token" };
  }

  const tokenHash = hashToken(token);
  const now = new Date();
  const updated = await prisma.qaMagicLoginToken.updateMany({
    where: {
      tokenHash,
      usedAt: null,
      expiresAt: { gt: now },
    },
    data: { usedAt: now },
  });

  if (updated.count !== 1) {
    await auditQaLogin("QA_MAGIC_LOGIN_EXCHANGE_FAILED", { reason: "invalid_or_expired" }, meta);
    return { ok: false, status: 401, code: "invalid_token" };
  }

  const record = await prisma.qaMagicLoginToken.findUnique({ where: { tokenHash } });
  const role = parseQaLoginRole(record?.role);
  if (!record || !role) {
    await auditQaLogin("QA_MAGIC_LOGIN_EXCHANGE_FAILED", { reason: "invalid_role" }, meta);
    return { ok: false, status: 401, code: "invalid_token" };
  }

  const subject = await resolveConfiguredQaSubject(role);
  if (!subject || subject.subjectId !== record.subjectId) {
    await auditQaLogin(
      "QA_MAGIC_LOGIN_EXCHANGE_FAILED",
      { role, subjectId: record.subjectId, reason: "subject_not_allowed" },
      meta,
    );
    return { ok: false, status: 403, code: "subject_not_allowed" };
  }

  await resetBrowserAuthState();
  if (role === "employee") {
    if (!subject.merchantMembershipId) {
      await auditQaLogin("QA_MAGIC_LOGIN_EXCHANGE_FAILED", { role, reason: "employee_membership_missing" }, meta);
      return { ok: false, status: 403, code: "subject_not_allowed" };
    }
    await createEmployeeSession(
      { userId: subject.userId, merchantMembershipId: subject.merchantMembershipId },
      meta,
    );
  } else {
    await createSession(subject.userId, meta);
  }

  await auditQaLogin(
    "QA_MAGIC_LOGIN_EXCHANGE",
    { role, subjectId: subject.subjectId },
    meta,
    subject,
  );

  return { ok: true, role, redirectTo: qaRedirectForRole(role) };
}

async function resetBrowserAuthState() {
  await destroySession();
  await destroyEmployeeSession();

  const { cookies } = await import("next/headers");
  const jar = await cookies();
  const expired = {
    path: "/",
    httpOnly: true,
    sameSite: "lax" as const,
    secure: isProduction(),
    maxAge: 0,
    expires: new Date(0),
  };

  for (const name of [
    env.sessionCookie,
    employeeSessionCookieName(),
    CLIENT_DEMO_COOKIE,
    MERCHANT_DEMO_COOKIE,
    EMPLOYEE_DEMO_COOKIE,
  ]) {
    jar.set(name, "", expired);
  }
}

async function auditQaLogin(
  action: string,
  metadata: Prisma.InputJsonValue,
  meta: RequestMeta,
  subject?: ResolvedQaSubject,
) {
  await writeAudit({
    actorId: subject?.userId,
    merchantId: subject?.merchantId,
    action,
    metadata,
    ip: meta.ip,
    userAgent: meta.userAgent,
  });
}
