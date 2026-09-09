import type { LoyaltyMode, Prisma } from "@prisma/client";
import { hashPassword } from "./password";
import { prisma } from "./prisma";
import { syncIsActiveFromStatus } from "./merchant-status";
import { defaultCardTemplateConfig } from "./card-template-schema";
import { DEFAULT_RULES, type RewardConfig } from "./loyalty-program";

export type CreateMerchantInput = {
  identity: {
    name: string;
    slug: string;
    category?: string;
    shortDescription?: string;
    description?: string;
    logoUrl?: string;
    coverUrl?: string;
    website?: string;
    socialLinks?: Record<string, string>;
    publicPhone?: string;
    publicEmail?: string;
    primaryColor?: string;
  };
  legal: {
    legalName?: string;
    ownerName?: string;
    ownerPhone?: string;
    adminEmail?: string;
    addressLine1?: string;
    addressLine2?: string;
    postalCode?: string;
    city?: string;
    country?: string;
    siret?: string;
    vatNumber?: string;
    billingAddressLine1?: string;
    billingAddressLine2?: string;
    billingPostalCode?: string;
    billingCity?: string;
    billingCountry?: string;
  };
  availability: {
    timezone?: string;
    openingHours?: unknown;
    closedDays?: unknown;
    exceptionalClosures?: unknown;
    visibleInSearch?: boolean;
  };
  admin: {
    firstName: string;
    lastName?: string;
    email: string;
    phone?: string;
    password: string;
  };
  program: {
    mode: LoyaltyMode;
    visitsRequired?: number;
    rewardLabel: string;
    rules?: Record<string, unknown>;
    rewards?: RewardConfig[];
  };
  subscription: {
    plan: "STARTER" | "PRO" | "ENTERPRISE";
    amount: number;
    currency?: string;
    frequency: "MONTHLY" | "YEARLY";
    status?: "DRAFT" | "TRIAL" | "ACTIVE";
    trialDays?: number;
    startsAt?: string;
    autoRenew?: boolean;
    notes?: string;
  };
  contract?: {
    reference: string;
    contractType?: string;
    amount?: number;
    startsAt?: string;
    endsAt?: string;
    notes?: string;
  };
  cardBackgroundUrl?: string;
  merchantStatus?: "DRAFT" | "TRIAL" | "ACTIVE";
};

export async function createMerchantFull(input: CreateMerchantInput) {
  const slugExists = await prisma.merchant.findUnique({ where: { slug: input.identity.slug } });
  if (slugExists) throw new Error("SLUG_TAKEN");

  const emailTaken = await prisma.user.findUnique({ where: { email: input.admin.email.toLowerCase() } });
  if (emailTaken) throw new Error("EMAIL_TAKEN");

  const status = input.merchantStatus ?? "ACTIVE";
  const rules = { ...DEFAULT_RULES[input.program.mode], ...(input.program.rules ?? {}) };
  const rewards = input.program.rewards ?? [
    {
      id: "reward-1",
      name: input.program.rewardLabel,
      rewardType: "CUSTOM",
      threshold: input.program.visitsRequired ?? 10,
      thresholdUnit: input.program.mode === "VISITS" ? ("visits" as const) : ("points" as const),
      isActive: true,
      sortOrder: 0,
    },
  ];

  const trialEndsAt =
    input.subscription.status === "TRIAL" && input.subscription.trialDays
      ? new Date(Date.now() + input.subscription.trialDays * 24 * 60 * 60 * 1000)
      : null;

  return prisma.$transaction(async (tx) => {
    const merchant = await tx.merchant.create({
      data: {
        name: input.identity.name,
        slug: input.identity.slug,
        logoUrl: input.identity.logoUrl || null,
        coverUrl: input.identity.coverUrl || null,
        primaryColor: input.identity.primaryColor ?? "#875BFF",
        category: input.identity.category,
        shortDescription: input.identity.shortDescription,
        description: input.identity.description,
        website: input.identity.website,
        socialLinks: input.identity.socialLinks as Prisma.InputJsonValue,
        publicPhone: input.identity.publicPhone,
        publicEmail: input.identity.publicEmail,
        legalName: input.legal.legalName,
        ownerName: input.legal.ownerName,
        ownerPhone: input.legal.ownerPhone,
        adminEmail: input.legal.adminEmail ?? input.admin.email,
        addressLine1: input.legal.addressLine1,
        addressLine2: input.legal.addressLine2,
        postalCode: input.legal.postalCode,
        city: input.legal.city,
        country: input.legal.country ?? "FR",
        siret: input.legal.siret,
        vatNumber: input.legal.vatNumber,
        billingAddressLine1: input.legal.billingAddressLine1,
        billingAddressLine2: input.legal.billingAddressLine2,
        billingPostalCode: input.legal.billingPostalCode,
        billingCity: input.legal.billingCity,
        billingCountry: input.legal.billingCountry,
        timezone: input.availability.timezone ?? "Europe/Paris",
        openingHours: input.availability.openingHours as Prisma.InputJsonValue,
        closedDays: input.availability.closedDays as Prisma.InputJsonValue,
        exceptionalClosures: input.availability.exceptionalClosures as Prisma.InputJsonValue,
        visibleInSearch: input.availability.visibleInSearch ?? true,
        status,
        isActive: syncIsActiveFromStatus(status),
        program: {
          create: {
            mode: input.program.mode,
            visitsRequired: input.program.visitsRequired ?? 10,
            rewardLabel: input.program.rewardLabel,
            config: { mode: input.program.mode, rules, rewards },
            status: "ACTIVE",
          },
        },
        subscription: {
          create: {
            plan: input.subscription.plan,
            amount: input.subscription.amount,
            currency: input.subscription.currency ?? "EUR",
            frequency: input.subscription.frequency,
            status: input.subscription.status ?? "ACTIVE",
            trialEndsAt,
            startsAt: input.subscription.startsAt ? new Date(input.subscription.startsAt) : new Date(),
            autoRenew: input.subscription.autoRenew ?? true,
            notes: input.subscription.notes,
          },
        },
      },
    });

    const adminUser = await tx.user.create({
      data: {
        email: input.admin.email.toLowerCase(),
        passwordHash: await hashPassword(input.admin.password),
        firstName: input.admin.firstName,
        lastName: input.admin.lastName,
        phone: input.admin.phone,
        privacyConsentAt: new Date(),
        mustChangePassword: true,
      },
    });

    await tx.merchantMembership.create({
      data: {
        userId: adminUser.id,
        merchantId: merchant.id,
        role: "MERCHANT_ADMIN",
      },
    });

    for (const [index, reward] of rewards.entries()) {
      await tx.loyaltyReward.create({
        data: {
          programId: (await tx.loyaltyProgram.findUniqueOrThrow({ where: { merchantId: merchant.id } })).id,
          name: reward.name,
          description: reward.description,
          rewardType: reward.rewardType as never,
          threshold: reward.threshold,
          thresholdUnit: reward.thresholdUnit,
          value: reward.value,
          minPurchase: reward.minPurchase,
          maxDiscount: reward.maxDiscount,
          isActive: reward.isActive,
          sortOrder: reward.sortOrder ?? index,
        },
      });
    }

    if (input.contract?.reference) {
      await tx.merchantContract.create({
        data: {
          merchantId: merchant.id,
          reference: input.contract.reference,
          contractType: input.contract.contractType ?? "subscription",
          status: "ACTIVE",
          amount: input.contract.amount ?? input.subscription.amount,
          currency: input.subscription.currency ?? "EUR",
          startsAt: input.contract.startsAt ? new Date(input.contract.startsAt) : new Date(),
          endsAt: input.contract.endsAt ? new Date(input.contract.endsAt) : null,
          notes: input.contract.notes,
        },
      });
    }

    const bgUrl = input.cardBackgroundUrl ?? "";
    await tx.merchantCardTemplate.create({
      data: {
        merchantId: merchant.id,
        loyaltyMode: input.program.mode,
        name: "Gabarit principal",
        backgroundUrl: bgUrl || null,
        config: bgUrl ? defaultCardTemplateConfig(bgUrl) : { schemaVersion: 1, aspectRatio: 1.586, background: { url: "", fit: "cover", position: { x: 0.5, y: 0.5 }, scale: 1 }, safeZone: { top: 0.04, right: 0.04, bottom: 0.04, left: 0.04 }, elements: [] },
        status: "DRAFT",
        isDefault: true,
      },
    });

    return { merchant, adminUserId: adminUser.id };
  });
}
