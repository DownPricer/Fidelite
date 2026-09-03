import { z } from "zod";

export const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .email("Adresse e-mail invalide.")
  .max(180);

export const passwordSchema = z
  .string()
  .min(8, "Le mot de passe doit contenir au moins 8 caractères.")
  .max(128);

export const firstNameSchema = z
  .string()
  .trim()
  .min(1, "Le prénom est obligatoire.")
  .max(80);

export const slugSchema = z
  .string()
  .trim()
  .toLowerCase()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug invalide (lettres, chiffres et tirets).")
  .min(2)
  .max(60);

export const colorSchema = z
  .string()
  .trim()
  .regex(/^#([0-9a-fA-F]{6})$/, "Couleur invalide (format #RRGGBB).");

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Mot de passe requis."),
});

export const customerRegisterSchema = z.object({
  firstName: firstNameSchema,
  email: emailSchema,
  password: passwordSchema,
  privacyConsent: z.literal(true, {
    errorMap: () => ({ message: "Le consentement à la politique de confidentialité est obligatoire." }),
  }),
  marketingConsent: z.boolean().optional(),
});

export const deletionRequestSchema = z.object({
  message: z.string().trim().max(500).optional(),
});

export const deletionConfirmSchema = z.object({
  password: z.string().min(1, "Mot de passe requis."),
  confirmationPhrase: z.literal("SUPPRIMER", {
    errorMap: () => ({ message: "Saisissez SUPPRIMER pour confirmer." }),
  }),
});

export const lastNameSchema = z.string().trim().max(80).optional().or(z.literal(""));

export const displayNameSchema = z.string().trim().max(120).optional().or(z.literal(""));

export const phoneSchema = z
  .string()
  .trim()
  .regex(/^[\d\s().+-]{6,20}$/, "Numéro de téléphone invalide.")
  .optional()
  .or(z.literal(""));

export const profileUpdateSchema = z.object({
  firstName: firstNameSchema.optional(),
  lastName: lastNameSchema,
  displayName: displayNameSchema,
  phone: phoneSchema,
  phoneCountryCode: z.string().trim().max(6).optional(),
  addressLine1: z.string().trim().max(200).optional().or(z.literal("")),
  addressLine2: z.string().trim().max(200).optional().or(z.literal("")),
  postalCode: z.string().trim().max(20).optional().or(z.literal("")),
  city: z.string().trim().max(100).optional().or(z.literal("")),
  country: z.string().trim().max(2).optional().or(z.literal("")),
});

export const emailChangeSchema = z.object({
  newEmail: emailSchema,
  password: z.string().min(1, "Mot de passe requis."),
});

export const avatarUploadSchema = z.object({
  dataUrl: z.string().min(30).max(700_000),
});

export const preferencesUpdateSchema = z.object({
  notifyPointsMovements: z.boolean().optional(),
  notifyNewBenefit: z.boolean().optional(),
  notifyBenefitExpiring: z.boolean().optional(),
  notifyNewCard: z.boolean().optional(),
  notifyMerchantOffers: z.boolean().optional(),
  notifyFifeLifeNews: z.boolean().optional(),
  notifyChannelPush: z.boolean().optional(),
  notifyChannelEmail: z.boolean().optional(),
  notifyChannelSms: z.boolean().optional(),
  consentPersonalizedOffers: z.boolean().optional(),
  consentMarketing: z.boolean().optional(),
  consentAnalytics: z.boolean().optional(),
  language: z.enum(["fr", "en"]).optional(),
});

export const historyFilterSchema = z.enum(["all", "earned", "used", "expired", "correction"]);

export const scanSchema = z.object({
  token: z.string().min(10, "QR invalide.").max(4000),
});

export const caisseActionSchema = z.object({
  grantId: z.string().min(1),
});

export const createEmployeeSchema = z.object({
  firstName: firstNameSchema,
  lastName: z.string().trim().max(80).optional(),
  email: emailSchema,
  phone: phoneSchema,
  password: passwordSchema.optional(),
  staffPreset: z.enum(["MANAGER", "CASHIER", "CUSTOM"]).default("CASHIER"),
  permissions: z.record(z.boolean()).optional(),
  inviteMessage: z.string().trim().max(500).optional(),
});

export const updateEmployeeSchema = z.object({
  firstName: firstNameSchema.optional(),
  lastName: z.string().trim().max(80).optional().or(z.literal("")),
  email: emailSchema.optional(),
  phone: phoneSchema,
  staffPreset: z.enum(["MANAGER", "CASHIER", "CUSTOM"]).optional(),
  permissions: z.record(z.boolean()).optional(),
  isActive: z.boolean().optional(),
  invitationStatus: z.enum(["NONE", "PENDING", "ACCEPTED", "CANCELLED"]).optional(),
  inviteMessage: z.string().trim().max(500).optional(),
});

export const merchantSettingsSchema = z.object({
  notifyLowStock: z.boolean().optional(),
});

export const loyaltyDraftSchema = z.object({
  mode: z.enum(["VISITS", "POINTS_BY_AMOUNT", "FIXED_POINTS", "AMOUNT_TIERS"]),
  rules: z.record(z.unknown()),
  rewards: z.array(
    z.object({
      id: z.string().optional(),
      name: z.string().trim().min(2).max(80),
      description: z.string().trim().max(300).optional().nullable(),
      rewardType: z.string().default("CUSTOM"),
      threshold: z.number().int().min(1).max(1_000_000),
      thresholdUnit: z.enum(["visits", "points"]),
      value: z.number().optional().nullable(),
      minPurchase: z.number().optional().nullable(),
      maxDiscount: z.number().optional().nullable(),
      isActive: z.boolean().default(true),
      sortOrder: z.number().int().default(0),
      validFrom: z.string().optional().nullable(),
      validUntil: z.string().optional().nullable(),
      maxUsesPerCustomer: z.number().int().optional().nullable(),
      reuseDelayDays: z.number().int().optional().nullable(),
      globalLimit: z.number().int().optional().nullable(),
    }),
  ),
  confirmImpact: z.boolean().optional(),
  scheduledAt: z.string().optional().nullable(),
});

export const programSimulateSchema = z.object({
  purchaseAmount: z.number().min(0).optional(),
  currentBalance: z.number().int().min(0),
  mode: z.enum(["VISITS", "POINTS_BY_AMOUNT", "FIXED_POINTS", "AMOUNT_TIERS"]).optional(),
  rules: z.record(z.unknown()).optional(),
  rewards: z.array(z.object({ threshold: z.number(), thresholdUnit: z.string(), name: z.string(), isActive: z.boolean() })).optional(),
});

export const createMerchantSchema = z.object({
  name: z.string().trim().min(2).max(80),
  slug: slugSchema,
  logoUrl: z.string().trim().url().max(500).optional().or(z.literal("")),
  primaryColor: colorSchema.optional(),
  visitsRequired: z.number().int().min(2).max(100).default(10),
  rewardLabel: z.string().trim().min(2).max(80),
  adminFirstName: firstNameSchema,
  adminEmail: emailSchema,
  adminPassword: passwordSchema,
});

export const updateMerchantSchema = z.object({
  name: z.string().trim().min(2).max(80).optional(),
  logoUrl: z.string().trim().url().max(500).optional().or(z.literal("")),
  primaryColor: colorSchema.optional(),
  isActive: z.boolean().optional(),
  visitsRequired: z.number().int().min(2).max(100).optional(),
  rewardLabel: z.string().trim().min(2).max(80).optional(),
});

export const adjustmentSchema = z.object({
  membershipId: z.string().min(1),
  delta: z.number().int().refine((n) => n !== 0, "L'ajustement ne peut pas être nul."),
  reason: z.string().trim().min(3, "Le motif est obligatoire.").max(200),
});

export function zodErrorMessage(error: z.ZodError) {
  return error.issues[0]?.message ?? "Données invalides.";
}
