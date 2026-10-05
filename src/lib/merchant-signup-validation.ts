import { z } from "zod";
import { emailSchema, firstNameSchema } from "./validation";

const phoneSchema = z.string().trim().min(6, "Numéro de téléphone invalide.").max(30);
const optionalPhoneSchema = z.string().trim().max(30).optional().or(z.literal(""));
const optionalUrlSchema = z.string().trim().max(200).optional().or(z.literal(""));
const siretSchema = z.string().trim().max(20).optional().or(z.literal(""));

export const merchantSignupApplicationSchema = z.object({
  planId: z.enum(["fideto", "fideto-phone"]),
  firstName: firstNameSchema,
  lastName: z.string().trim().min(1, "Le nom est obligatoire.").max(80),
  businessName: z.string().trim().min(1, "Le nom du commerce est obligatoire.").max(120),
  businessActivity: z.string().trim().min(1, "L'activité du commerce est obligatoire.").max(120),
  email: emailSchema,
  mobilePhone: phoneSchema,
  landlinePhone: optionalPhoneSchema,
  website: optionalUrlSchema,
  siret: siretSchema,
  message: z.string().trim().max(4000).optional().or(z.literal("")),
  addressLine1: z.string().trim().min(1, "L'adresse du commerce est obligatoire.").max(200),
  postalCode: z.string().trim().min(4, "Code postal invalide.").max(12),
  city: z.string().trim().min(1, "La ville est obligatoire.").max(80),
  contactConsent: z.literal(true, { errorMap: () => ({ message: "Le consentement de contact est obligatoire." }) }),
});

export const merchantSignupVerifyCodeSchema = z.object({
  email: emailSchema,
  code: z.string().trim().min(6).max(8),
});

export const merchantSignupCompleteSchema = z.object({
  mode: z.enum(["register", "login"]),
  password: z.string().min(8).max(128),
  email: emailSchema.optional(),
});

export function zodMerchantSignupError(error: z.ZodError) {
  return error.issues[0]?.message ?? "Données invalides.";
}
