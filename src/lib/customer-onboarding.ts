import { CustomerAccessTokenKind, PlatformRole, type User } from "@prisma/client";
import { sendCustomerFinalizationEmail, sendCustomerFinalizationReminderEmail } from "./email";
import { publicCustomerUrl } from "./hosts";
import { prisma } from "./prisma";
import { createSession } from "./session";
import {
  CUSTOMER_TOKEN_TTL,
  invalidateCustomerAccessTokens,
  issueCustomerAccessToken,
} from "./customer-access-token";

export const PROVISIONAL_ACCESS_MS = 24 * 60 * 60 * 1000;
export const FINALIZATION_REMINDER_MS = 2 * 60 * 60 * 1000;

export type CustomerAccessLevel = "full" | "provisional" | "limited";

export type CustomerOnboardingUser = Pick<
  User,
  | "id"
  | "email"
  | "firstName"
  | "lastName"
  | "city"
  | "phoneVerified"
  | "platformRole"
  | "onboardingStartedAt"
  | "emailConfirmedAt"
  | "profileFinalizedAt"
  | "finalizationReminderSentAt"
>;

export function isLegacyCustomerAccount(user: CustomerOnboardingUser) {
  return !user.onboardingStartedAt;
}

export function isCustomerProfileComplete(user: CustomerOnboardingUser) {
  return Boolean(
    user.firstName?.trim() &&
      user.lastName?.trim() &&
      user.emailConfirmedAt &&
      user.city?.trim() &&
      user.phoneVerified,
  );
}

export function isCustomerProfileFinalized(user: CustomerOnboardingUser) {
  if (user.profileFinalizedAt) return true;
  if (isLegacyCustomerAccount(user)) return true;
  return isCustomerProfileComplete(user);
}

export function provisionalAccessEndsAt(user: CustomerOnboardingUser) {
  if (!user.onboardingStartedAt) return null;
  return new Date(user.onboardingStartedAt.getTime() + PROVISIONAL_ACCESS_MS);
}

export function isWithinProvisionalWindow(user: CustomerOnboardingUser, now = new Date()) {
  const ends = provisionalAccessEndsAt(user);
  if (!ends) return false;
  return now < ends;
}

export function resolveCustomerAccessLevel(user: CustomerOnboardingUser, now = new Date()): CustomerAccessLevel {
  if (isCustomerProfileFinalized(user)) return "full";
  if (isWithinProvisionalWindow(user, now)) return "provisional";
  return "limited";
}

export function customerPostAuthRedirect(user: CustomerOnboardingUser) {
  const level = resolveCustomerAccessLevel(user);
  if (level === "limited") return "/finalisation";
  if (level === "provisional" && !isCustomerProfileComplete(user)) return "/carte?onboarding=1";
  return "/carte";
}

const FINALIZATION_PATH_PREFIXES = [
  "/finalisation",
  "/connexion",
  "/inscription",
  "/api/customer",
  "/api/auth/logout",
  "/api/auth/google",
];

export function isFinalizationAllowedPath(pathname: string) {
  if (pathname.startsWith("/api/auth/google")) return true;
  if (pathname.startsWith("/api/auth/logout")) return true;
  return FINALIZATION_PATH_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

export function customerWalletGuardRedirect(
  pathname: string,
  user: CustomerOnboardingUser | null,
  now = new Date(),
) {
  if (!user) return null;
  if (isFinalizationAllowedPath(pathname)) return null;
  if (resolveCustomerAccessLevel(user, now) !== "limited") return null;
  return "/finalisation";
}

export function sessionExpiryForCustomer(user: CustomerOnboardingUser, now = new Date()) {
  if (isCustomerProfileFinalized(user)) return undefined;
  const provisionalEnd = provisionalAccessEndsAt(user);
  if (provisionalEnd && provisionalEnd > now) return provisionalEnd;
  return undefined;
}

export async function createCustomerSession(
  userId: string,
  meta: { ip?: string; userAgent?: string } = {},
) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error("Utilisateur introuvable.");
  const expiresAt = sessionExpiryForCustomer(user);
  return createSession(userId, { ...meta, expiresAt });
}

export function buildEmailVerificationUrl(rawToken: string) {
  return publicCustomerUrl(`/api/customer/auth/verify-email?token=${encodeURIComponent(rawToken)}`);
}

export function buildAccountRecoveryUrl(rawToken: string) {
  return publicCustomerUrl(`/api/customer/auth/recover?token=${encodeURIComponent(rawToken)}`);
}

export async function sendCustomerFinalizationInvite(user: Pick<User, "id" | "email" | "firstName">) {
  await invalidateCustomerAccessTokens(user.id, CustomerAccessTokenKind.EMAIL_VERIFICATION);
  const { raw, expiresAt } = await issueCustomerAccessToken(
    user.id,
    CustomerAccessTokenKind.EMAIL_VERIFICATION,
    CUSTOMER_TOKEN_TTL.emailVerificationMs,
  );
  const verifyUrl = buildEmailVerificationUrl(raw);
  const finalizeUrl = publicCustomerUrl("/finalisation");
  return sendCustomerFinalizationEmail({
    to: user.email,
    firstName: user.firstName,
    verifyUrl,
    finalizeUrl,
    expiresAt,
  });
}

export async function maybeSendFinalizationReminder(user: CustomerOnboardingUser, now = new Date()) {
  if (isCustomerProfileFinalized(user)) return;
  if (!user.onboardingStartedAt || user.finalizationReminderSentAt) return;
  const reminderAt = new Date(user.onboardingStartedAt.getTime() + FINALIZATION_REMINDER_MS);
  if (now < reminderAt) return;

  const result = await sendCustomerFinalizationReminderEmail({
    to: user.email,
    firstName: user.firstName,
    finalizeUrl: publicCustomerUrl("/finalisation"),
  });

  if (result.ok) {
    await prisma.user.update({
      where: { id: user.id },
      data: { finalizationReminderSentAt: now },
    });
  }
}

export async function runCustomerOnboardingSideEffects(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user || user.platformRole !== PlatformRole.CUSTOMER) return;
  await maybeSendFinalizationReminder(user);
}

export async function markCustomerProfileFinalized(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user || !isCustomerProfileComplete(user)) return false;
  await prisma.user.update({
    where: { id: userId },
    data: { profileFinalizedAt: user.profileFinalizedAt ?? new Date() },
  });
  return true;
}

export async function beginCustomerOnboarding(userId: string, now = new Date()) {
  await prisma.user.update({
    where: { id: userId },
    data: {
      onboardingStartedAt: now,
      platformRole: PlatformRole.CUSTOMER,
    },
  });
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return;
  await sendCustomerFinalizationInvite(user);
}

export async function requestAccountRecovery(email: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user?.isActive || user.platformRole !== PlatformRole.CUSTOMER) {
    return { ok: true as const };
  }
  await invalidateCustomerAccessTokens(user.id, CustomerAccessTokenKind.ACCOUNT_RECOVERY);
  const { raw } = await issueCustomerAccessToken(
    user.id,
    CustomerAccessTokenKind.ACCOUNT_RECOVERY,
    CUSTOMER_TOKEN_TTL.accountRecoveryMs,
  );
  const { sendCustomerAccountRecoveryEmail } = await import("./email");
  await sendCustomerAccountRecoveryEmail({
    to: user.email,
    firstName: user.firstName,
    recoveryUrl: buildAccountRecoveryUrl(raw),
  });
  return { ok: true as const };
}
