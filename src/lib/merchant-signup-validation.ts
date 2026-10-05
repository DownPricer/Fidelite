import { z } from "zod";
import { emailSchema, firstNameSchema } from "./validation";

const phoneSchema = z.string().trim().min(6, "Numéro de téléphone invalide.").max(30);
const optionalPhoneSchema = z
  .string()
  .trim()
  .max(30)
  .refine((value) => value === "" || value.length >= 6, { message: "Numéro de téléphone invalide." });
const optionalUrlSchema = z
  .string()
  .trim()
  .max(200)
  .refine(
    (value) => {
      if (!value) return true;
      try {
        const withScheme = /^https?:\/\//i.test(value) ? value : `https://${value}`;
        const url = new URL(withScheme);
        return url.protocol === "http:" || url.protocol === "https:";
      } catch {
        return false;
      }
    },
    { message: "Adresse de site internet invalide." },
  );
const siretSchema = z
  .string()
  .trim()
  .max(20)
  .refine((value) => value === "" || /^[0-9]{9,14}$/.test(value), { message: "Numéro SIRET invalide." });

export const merchantSignupApplicationSchema = z.object({
  planId: z.enum(["fideto", "fideto-phone"], { message: "Formule invalide." }),
  firstName: firstNameSchema,
  lastName: z.string().trim().min(1, "Le nom est obligatoire.").max(80),
  businessName: z.string().trim().min(1, "Le nom du commerce est obligatoire.").max(120),
  businessActivity: z.string().trim().min(1, "L'activité du commerce est obligatoire.").max(120),
  email: emailSchema,
  mobilePhone: phoneSchema,
  landlinePhone: optionalPhoneSchema.or(z.literal("")),
  website: optionalUrlSchema.or(z.literal("")),
  siret: siretSchema.or(z.literal("")),
  message: z.string().trim().max(4000).or(z.literal("")),
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

export function zodMerchantSignupFieldErrors(error: z.ZodError): Record<string, string> {
  const map: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.join(".") || "_form";
    if (!map[key]) map[key] = issue.message;
  }
  return map;
}
