import { z } from "zod";
import {
  colorSchema,
  emailSchema,
  firstNameSchema,
  passwordSchema,
  phoneSchema,
  slugSchema,
} from "./validation";

export const createMerchantFullSchema = z.object({
  identity: z.object({
    name: z.string().trim().min(2).max(80),
    slug: slugSchema,
    category: z.string().trim().max(80).optional(),
    shortDescription: z.string().trim().max(200).optional(),
    description: z.string().trim().max(5000).optional(),
    logoUrl: z.string().trim().url().max(500).optional().or(z.literal("")),
    coverUrl: z.string().trim().url().max(500).optional().or(z.literal("")),
    website: z.string().trim().url().max(500).optional().or(z.literal("")),
    socialLinks: z.record(z.string()).optional(),
    publicPhone: phoneSchema,
    publicEmail: emailSchema.optional().or(z.literal("")),
    primaryColor: colorSchema.optional(),
  }),
  legal: z.object({
    legalName: z.string().trim().max(120).optional(),
    ownerName: z.string().trim().max(120).optional(),
    ownerPhone: phoneSchema,
    adminEmail: emailSchema.optional().or(z.literal("")),
    addressLine1: z.string().trim().max(200).optional(),
    addressLine2: z.string().trim().max(200).optional(),
    postalCode: z.string().trim().max(20).optional(),
    city: z.string().trim().max(100).optional(),
    country: z.string().trim().max(2).optional(),
    siret: z.string().trim().max(20).optional(),
    vatNumber: z.string().trim().max(20).optional(),
    billingAddressLine1: z.string().trim().max(200).optional(),
    billingAddressLine2: z.string().trim().max(200).optional(),
    billingPostalCode: z.string().trim().max(20).optional(),
    billingCity: z.string().trim().max(100).optional(),
    billingCountry: z.string().trim().max(2).optional(),
  }),
  availability: z.object({
    timezone: z.string().trim().max(60).optional(),
    openingHours: z.unknown().optional(),
    closedDays: z.unknown().optional(),
    exceptionalClosures: z.unknown().optional(),
    visibleInSearch: z.boolean().optional(),
  }),
  admin: z
    .object({
      firstName: firstNameSchema,
      lastName: z.string().trim().max(80).optional(),
      email: emailSchema,
      phone: phoneSchema,
      password: passwordSchema,
      passwordConfirm: z.string().min(1),
    })
    .refine((v) => v.password === v.passwordConfirm, {
      message: "Les mots de passe ne correspondent pas.",
      path: ["passwordConfirm"],
    }),
  program: z.object({
    mode: z.enum(["VISITS", "POINTS_BY_AMOUNT", "FIXED_POINTS", "AMOUNT_TIERS"]),
    visitsRequired: z.number().int().min(2).max(1000).optional(),
    rewardLabel: z.string().trim().min(2).max(80),
    rules: z.record(z.unknown()).optional(),
  }),
  subscription: z.object({
    plan: z.enum(["STARTER", "PRO", "ENTERPRISE"]),
    amount: z.number().min(0).max(1_000_000),
    currency: z.string().trim().max(3).optional(),
    frequency: z.enum(["MONTHLY", "YEARLY"]),
    status: z.enum(["DRAFT", "TRIAL", "ACTIVE"]).optional(),
    trialDays: z.number().int().min(0).max(365).optional(),
    startsAt: z.string().optional(),
    autoRenew: z.boolean().optional(),
    notes: z.string().trim().max(1000).optional(),
  }),
  contract: z
    .object({
      reference: z.string().trim().min(2).max(80),
      contractType: z.string().trim().max(40).optional(),
      amount: z.number().min(0).optional(),
      startsAt: z.string().optional(),
      endsAt: z.string().optional(),
      notes: z.string().trim().max(1000).optional(),
    })
    .optional(),
  cardBackgroundUrl: z.string().trim().max(500).optional(),
  merchantStatus: z.enum(["DRAFT", "TRIAL", "ACTIVE"]).optional(),
});

export const merchantStatusActionSchema = z.object({
  action: z.enum(["suspend", "reactivate", "archive", "restore"]),
  password: z.string().min(1),
  confirmationName: z.string().optional(),
});

export const merchantDeleteSchema = z.object({
  password: z.string().min(1),
  confirmationName: z.string().min(1),
});

export const cardTemplateSaveSchema = z.object({
  name: z.string().trim().min(1).max(80).optional(),
  loyaltyMode: z.enum(["VISITS", "POINTS_BY_AMOUNT", "FIXED_POINTS", "AMOUNT_TIERS"]),
  backgroundUrl: z.string().trim().max(500).optional().nullable(),
  config: z.record(z.unknown()),
  isDefault: z.boolean().optional(),
});

export const reauthSchema = z.object({
  password: z.string().min(1),
});

export function zodErrorMessage(error: z.ZodError) {
  return error.issues[0]?.message ?? "Données invalides.";
}
