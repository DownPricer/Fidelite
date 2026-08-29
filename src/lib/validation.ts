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
  password: passwordSchema,
});

export const resetEmployeePasswordSchema = z.object({
  employeeId: z.string().min(1),
});

export const merchantSettingsSchema = z.object({
  name: z.string().trim().min(2).max(80),
  logoUrl: z.string().trim().url().max(500).optional().or(z.literal("")),
  primaryColor: colorSchema,
  visitsRequired: z.number().int().min(2).max(100),
  rewardLabel: z.string().trim().min(2).max(80),
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
