import type { MerchantSignupRequestStatus } from "@prisma/client";
import { LoyaltyMode } from "@prisma/client";
import { prisma } from "./prisma";
import { MERCHANT_PLANS, isMerchantPlanId, type MerchantPlanId } from "./merchant-plans";
import {
  generateSignupCode,
  hashSignupCode,
  signupCodeExpiryDate,
  verifySignupCode,
} from "./merchant-signup-codes";
import {
  encodeMerchantSignupGrant,
  setMerchantSignupGrantCookie,
} from "./merchant-signup-grant";
import { createMerchantCardSlots } from "./merchant-card-template-service";
import { syncIsActiveFromStatus } from "./merchant-status";
import { DEFAULT_RULES } from "./loyalty-program";
import { hashPassword, verifyPassword } from "./password";
import { createMerchantPlanCheckoutSession } from "./merchant-plan-checkout";
import { publicAppUrl } from "./hosts";
import {
  sendMerchantSignupAckEmail,
  sendMerchantSignupAdminNotifyEmail,
  sendMerchantSignupCodeEmail,
  sendMerchantSignupRejectionEmail,
} from "./merchant-signup-emails";
import type { z } from "zod";
import type { merchantSignupApplicationSchema } from "./merchant-signup-validation";

export const SIGNUP_STATUS_LABELS: Record<MerchantSignupRequestStatus, string> = {
  PENDING_REVIEW: "À étudier",
  REJECTED: "Refusée",
  CODE_SENT: "Code envoyé",
  CODE_REVOKED: "Code révoqué",
  ACCOUNT_LINKED: "Compte rattaché",
};

export async function submitMerchantSignupApplication(
  data: z.infer<typeof merchantSignupApplicationSchema>,
) {
  if (!isMerchantPlanId(data.planId)) {
    throw new Error("INVALID_PLAN");
  }

  const email = data.email.toLowerCase();
  const record = await prisma.merchantSignupRequest.create({
    data: {
      planId: data.planId,
      firstName: data.firstName,
      lastName: data.lastName,
      businessName: data.businessName,
      businessActivity: data.businessActivity,
      email,
      mobilePhone: data.mobilePhone,
      landlinePhone: data.landlinePhone || null,
      website: data.website || null,
      siret: data.siret || null,
      message: data.message || null,
      addressLine1: data.addressLine1,
      postalCode: data.postalCode,
      city: data.city,
      contactConsentAt: new Date(),
      status: "PENDING_REVIEW",
    },
  });

  await prisma.staffNotification.create({
    data: {
      audience: "SUPER_ADMIN",
      kind: "MERCHANT_SIGNUP_REQUEST",
      message: `Nouvelle demande d'inscription — ${data.businessName}`,
      merchantId: null,
      campaignId: null,
      adRequestId: null,
    },
  });

  void sendMerchantSignupAckEmail({
    to: email,
    firstName: data.firstName,
    businessName: data.businessName,
    planId: data.planId,
  });
  void sendMerchantSignupAdminNotifyEmail({
    businessName: data.businessName,
    email,
    planId: data.planId,
    requestId: record.id,
  });

  return record;
}

const GENERIC_CODE_ERROR = "Si un code correspond à cette adresse, il sera accepté. Sinon, vérifiez vos informations ou contactez contact@fideto.fr.";

export async function verifyMerchantSignupCode(email: string, code: string) {
  const normalizedEmail = email.toLowerCase();
  const request = await prisma.merchantSignupRequest.findFirst({
    where: {
      email: normalizedEmail,
      status: { in: ["CODE_SENT"] },
      codeUsedAt: null,
      codeRevokedAt: null,
    },
    orderBy: { codeSentAt: "desc" },
  });

  if (
    !request ||
    !request.codeHash ||
    !request.codeExpiresAt ||
    request.codeExpiresAt < new Date() ||
    !verifySignupCode(code, request.codeHash)
  ) {
    return { ok: false as const, error: GENERIC_CODE_ERROR };
  }

  const grant = encodeMerchantSignupGrant({ requestId: request.id, email: normalizedEmail });
  await setMerchantSignupGrantCookie(grant);
  return { ok: true as const, requestId: request.id, planId: request.planId as MerchantPlanId };
}

async function uniqueSlug(base: string) {
  const slugBase =
    base
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 48) || "commerce";
  let slug = slugBase;
  let n = 0;
  while (await prisma.merchant.findUnique({ where: { slug } })) {
    n += 1;
    slug = `${slugBase}-${n}`;
  }
  return slug;
}

export async function completeMerchantSignupAccount(input: {
  grantRequestId: string;
  grantEmail: string;
  mode: "register" | "login";
  password: string;
  ip?: string;
  userAgent?: string;
}) {
  const request = await prisma.merchantSignupRequest.findUnique({ where: { id: input.grantRequestId } });
  if (!request || request.email !== input.grantEmail.toLowerCase()) {
    return { ok: false as const, error: "Session d'inscription invalide ou expirée." };
  }
  if (request.status !== "CODE_SENT" || request.codeUsedAt) {
    return { ok: false as const, error: "Cette demande n'est plus éligible à la création de compte." };
  }
  if (!isMerchantPlanId(request.planId)) {
    return { ok: false as const, error: "Formule invalide." };
  }

  if (request.merchantId) {
    return { ok: true as const, merchantId: request.merchantId, existing: true };
  }

  const existingUser = await prisma.user.findUnique({ where: { email: request.email } });
  let userId: string;

  if (input.mode === "login") {
    if (!existingUser || !(await verifyPassword(input.password, existingUser.passwordHash))) {
      return { ok: false as const, error: "Identifiants incorrects." };
    }
    userId = existingUser.id;
    const alreadyAdmin = await prisma.merchantMembership.findFirst({
      where: { userId, role: "MERCHANT_ADMIN", isActive: true },
    });
    if (alreadyAdmin) {
      return { ok: false as const, error: "Ce compte est déjà rattaché à un commerce." };
    }
  } else {
    if (existingUser) {
      return { ok: false as const, error: "Un compte existe déjà avec cet e-mail. Connectez-vous." };
    }
    const created = await prisma.user.create({
      data: {
        email: request.email,
        passwordHash: await hashPassword(input.password),
        firstName: request.firstName,
        lastName: request.lastName,
        phone: request.mobilePhone,
        privacyConsentAt: new Date(),
      },
    });
    userId = created.id;
  }

  const plan = MERCHANT_PLANS[request.planId];
  const monthlyEuros = plan.monthlyPriceCents / 100;
  const slug = await uniqueSlug(request.businessName);
  const mode = LoyaltyMode.VISITS;
  const rules = DEFAULT_RULES[mode];

  const result = await prisma.$transaction(async (tx) => {
    const merchant = await tx.merchant.create({
      data: {
        name: request.businessName,
        slug,
        category: request.businessActivity,
        website: request.website,
        publicPhone: request.mobilePhone,
        publicEmail: request.email,
        addressLine1: request.addressLine1,
        postalCode: request.postalCode,
        city: request.city,
        country: request.country,
        siret: request.siret,
        ownerName: `${request.firstName} ${request.lastName}`.trim(),
        ownerPhone: request.mobilePhone,
        adminEmail: request.email,
        status: "DRAFT",
        isActive: syncIsActiveFromStatus("DRAFT"),
        program: {
          create: {
            mode,
            visitsRequired: 10,
            rewardLabel: "Récompense offerte",
            config: { mode, rules, rewards: [] },
            status: "DRAFT",
          },
        },
        subscription: {
          create: {
            plan: "STARTER",
            amount: monthlyEuros,
            currency: "EUR",
            frequency: "MONTHLY",
            status: "DRAFT",
            notes: `Offre publique ${plan.name} (${request.planId})`,
          },
        },
      },
    });

    await tx.merchantMembership.create({
      data: { userId, merchantId: merchant.id, role: "MERCHANT_ADMIN" },
    });

    await createMerchantCardSlots(tx, merchant.id, { activeMode: mode, backgroundUrl: null, duplicateToAll: false });

    await tx.merchantSignupRequest.update({
      where: { id: request.id },
      data: {
        merchantId: merchant.id,
        userId,
        codeUsedAt: new Date(),
        status: "ACCOUNT_LINKED",
      },
    });

    return merchant;
  });

  return { ok: true as const, merchantId: result.id, existing: false };
}

export async function startMerchantSignupCheckout(input: {
  grantRequestId: string;
  grantEmail: string;
  hostHeader?: string;
}) {
  const request = await prisma.merchantSignupRequest.findUnique({
    where: { id: input.grantRequestId },
    include: { merchant: true },
  });
  if (!request || request.email !== input.grantEmail.toLowerCase() || !request.merchantId || !request.merchant) {
    return { ok: false as const, error: "Impossible de démarrer le paiement." };
  }
  if (!isMerchantPlanId(request.planId)) {
    return { ok: false as const, error: "Formule invalide." };
  }

  const successUrl = publicAppUrl("/app/outils/facturation?checkout=success");
  const cancelUrl = publicAppUrl("/app/outils/facturation?checkout=cancel");

  const session = await createMerchantPlanCheckoutSession({
    merchantId: request.merchantId,
    signupRequestId: request.id,
    planId: request.planId,
    successUrl,
    cancelUrl,
    customer: {
      email: request.email,
      name: request.businessName,
    },
  });

  await prisma.merchantSignupRequest.update({
    where: { id: request.id },
    data: { stripeCheckoutSessionId: session.id },
  });

  if (!session.url) {
    return { ok: false as const, error: "Stripe n'a pas renvoyé d'URL de paiement." };
  }
  return { ok: true as const, checkoutUrl: session.url };
}

export async function acceptMerchantSignupRequest(requestId: string, internalNote?: string) {
  const request = await prisma.merchantSignupRequest.findUnique({ where: { id: requestId } });
  if (!request || request.status !== "PENDING_REVIEW") {
    throw new Error("INVALID_STATE");
  }
  const code = generateSignupCode();
  const expiresAt = signupCodeExpiryDate();
  await prisma.merchantSignupRequest.update({
    where: { id: requestId },
    data: {
      status: "CODE_SENT",
      codeHash: hashSignupCode(code),
      codeExpiresAt: expiresAt,
      codeSentAt: new Date(),
      codeRevokedAt: null,
      internalNote: internalNote?.trim() || request.internalNote,
    },
  });
  const emailResult = await sendMerchantSignupCodeEmail({
    to: request.email,
    firstName: request.firstName,
    code,
    expiresAt,
    planId: request.planId as MerchantPlanId,
  });
  return { code, emailResult };
}

export async function rejectMerchantSignupRequest(requestId: string, reason?: string, internalNote?: string) {
  const request = await prisma.merchantSignupRequest.findUnique({ where: { id: requestId } });
  if (!request || request.status !== "PENDING_REVIEW") {
    throw new Error("INVALID_STATE");
  }
  await prisma.merchantSignupRequest.update({
    where: { id: requestId },
    data: {
      status: "REJECTED",
      rejectedAt: new Date(),
      rejectionReason: reason?.trim() || null,
      internalNote: internalNote?.trim() || request.internalNote,
      codeHash: null,
      codeExpiresAt: null,
    },
  });
  await sendMerchantSignupRejectionEmail({
    to: request.email,
    firstName: request.firstName,
    reason,
  });
}

export async function resendMerchantSignupCode(requestId: string) {
  const request = await prisma.merchantSignupRequest.findUnique({ where: { id: requestId } });
  if (!request || !["CODE_SENT", "CODE_REVOKED"].includes(request.status) || request.codeUsedAt) {
    throw new Error("INVALID_STATE");
  }
  const code = generateSignupCode();
  const expiresAt = signupCodeExpiryDate();
  await prisma.merchantSignupRequest.update({
    where: { id: requestId },
    data: {
      status: "CODE_SENT",
      codeHash: hashSignupCode(code),
      codeExpiresAt: expiresAt,
      codeSentAt: new Date(),
      codeRevokedAt: null,
    },
  });
  const emailResult = await sendMerchantSignupCodeEmail({
    to: request.email,
    firstName: request.firstName,
    code,
    expiresAt,
    planId: request.planId as MerchantPlanId,
  });
  return { code, emailResult };
}

export async function revokeMerchantSignupCode(requestId: string) {
  const request = await prisma.merchantSignupRequest.findUnique({ where: { id: requestId } });
  if (!request || request.status !== "CODE_SENT" || request.codeUsedAt) {
    throw new Error("INVALID_STATE");
  }
  await prisma.merchantSignupRequest.update({
    where: { id: requestId },
    data: {
      status: "CODE_REVOKED",
      codeRevokedAt: new Date(),
      codeHash: null,
      codeExpiresAt: null,
    },
  });
}
