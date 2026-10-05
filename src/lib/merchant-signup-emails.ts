import { deliverEmail } from "@/emails/transport/send-email";
import { renderMerchantSignupAckEmail } from "@/emails/templates/merchant-signup/ack";
import { renderMerchantSignupAdminNotifyEmail } from "@/emails/templates/merchant-signup/admin-notify";
import { renderMerchantSignupCodeEmail } from "@/emails/templates/merchant-signup/code";
import { renderMerchantSignupRejectionEmail } from "@/emails/templates/merchant-signup/rejection";
import { renderMerchantSubscriptionActivatedEmail } from "@/emails/templates/merchant-signup/subscription-activated";
import type { EmailSendResult } from "./email";
import { isValidEmailAddress } from "./email";
import { publicAppUrl, publicCustomerUrl, superAdminSignupRequestUrl } from "./hosts";
import { formatEurosFromCents, MERCHANT_PLANS, type MerchantPlanId } from "./merchant-plans";
import { prisma } from "./prisma";
import { isSuperAdminEmailAllowed } from "./super-admin-session";

async function superAdminEmails() {
  const users = await prisma.user.findMany({
    where: { platformRole: "SUPER_ADMIN", isActive: true },
    select: { email: true },
  });
  return users.map((u) => u.email).filter((e) => e && isValidEmailAddress(e) && isSuperAdminEmailAllowed(e));
}

export async function sendMerchantSignupAckEmail(input: {
  to: string;
  firstName: string;
  businessName: string;
  planId: MerchantPlanId;
}): Promise<EmailSendResult> {
  const plan = MERCHANT_PLANS[input.planId];
  const content = renderMerchantSignupAckEmail({
    firstName: input.firstName,
    businessName: input.businessName,
    planName: plan.name,
  });
  return deliverEmail({ to: input.to, ...content });
}

export async function sendMerchantSignupAdminNotifyEmail(input: {
  businessName: string;
  email: string;
  planId: MerchantPlanId;
  requestId: string;
}): Promise<EmailSendResult> {
  const admins = await superAdminEmails();
  if (admins.length === 0) return { ok: true };
  const plan = MERCHANT_PLANS[input.planId];
  const content = renderMerchantSignupAdminNotifyEmail({
    businessName: input.businessName,
    email: input.email,
    planName: plan.name,
    openRequestUrl: superAdminSignupRequestUrl(input.requestId),
  });
  return deliverEmail({ to: admins, ...content });
}

export async function sendMerchantSignupCodeEmail(input: {
  to: string;
  firstName: string;
  code: string;
  expiresAt: Date;
  planId: MerchantPlanId;
}): Promise<EmailSendResult> {
  const plan = MERCHANT_PLANS[input.planId];
  const expiry = input.expiresAt.toLocaleString("fr-FR", { dateStyle: "long", timeStyle: "short" });
  const content = renderMerchantSignupCodeEmail({
    firstName: input.firstName,
    code: input.code,
    expiryLabel: expiry,
    planName: plan.name,
    entryUrl: publicCustomerUrl("/demarrer"),
  });
  return deliverEmail({ to: input.to, ...content });
}

export async function sendMerchantSignupRejectionEmail(input: {
  to: string;
  firstName: string;
  reason?: string | null;
}): Promise<EmailSendResult> {
  const content = renderMerchantSignupRejectionEmail(input);
  return deliverEmail({ to: input.to, ...content });
}

export async function sendMerchantSubscriptionActivatedEmail(input: {
  to: string;
  firstName: string;
  merchantName: string;
  planId: MerchantPlanId;
}): Promise<EmailSendResult> {
  const plan = MERCHANT_PLANS[input.planId];
  const content = renderMerchantSubscriptionActivatedEmail({
    firstName: input.firstName,
    merchantName: input.merchantName,
    planName: plan.name,
    monthlyLabel: formatEurosFromCents(plan.monthlyPriceCents),
    appUrl: publicAppUrl("/app"),
  });
  return deliverEmail({ to: input.to, ...content });
}
