import { z } from "zod";
import { merchantSignupApplicationSchema } from "./merchant-signup-validation";

export type MerchantSignupApplication = z.infer<typeof merchantSignupApplicationSchema>;

export type MerchantSignupFieldErrors = Partial<Record<keyof MerchantSignupApplication | "contactConsent", string>>;

const WEBSITE_PLACEHOLDERS = new Set(["https://", "http://", "https:///", "http:///"]);

function asTrimmedString(value: unknown): string {
  if (value === null || value === undefined) return "";
  return String(value).trim();
}

function normalizePhoneDigits(value: unknown): string {
  const raw = asTrimmedString(value);
  if (!raw) return "";
  return raw.replace(/[\s.\-()]/g, "");
}

function normalizeWebsite(value: unknown): string {
  const raw = asTrimmedString(value);
  if (!raw || WEBSITE_PLACEHOLDERS.has(raw.toLowerCase())) return "";
  return raw;
}

function normalizeSiret(value: unknown): string {
  const raw = asTrimmedString(value);
  if (!raw) return "";
  return raw.replace(/\s/g, "");
}

function coerceContactConsent(value: unknown): boolean {
  if (value === true || value === 1) return true;
  if (typeof value === "string") {
    const v = value.trim().toLowerCase();
    return v === "true" || v === "on" || v === "1" || v === "yes";
  }
  return false;
}

/** Normalise le corps JSON ou les entrées FormData avant validation Zod (front + API). */
export function normalizeMerchantSignupApplicationInput(raw: unknown): Record<string, unknown> {
  if (!raw || typeof raw !== "object") {
    return { contactConsent: false };
  }
  const input = raw as Record<string, unknown>;
  return {
    planId: asTrimmedString(input.planId),
    firstName: asTrimmedString(input.firstName),
    lastName: asTrimmedString(input.lastName),
    businessName: asTrimmedString(input.businessName),
    businessActivity: asTrimmedString(input.businessActivity),
    email: asTrimmedString(input.email),
    mobilePhone: normalizePhoneDigits(input.mobilePhone),
    landlinePhone: normalizePhoneDigits(input.landlinePhone),
    website: normalizeWebsite(input.website),
    siret: normalizeSiret(input.siret),
    message: asTrimmedString(input.message),
    addressLine1: asTrimmedString(input.addressLine1),
    postalCode: asTrimmedString(input.postalCode),
    city: asTrimmedString(input.city),
    contactConsent: coerceContactConsent(input.contactConsent),
  };
}

export function merchantSignupApplicationFromFormData(data: FormData, planId: string) {
  return normalizeMerchantSignupApplicationInput({
    planId,
    firstName: data.get("firstName"),
    lastName: data.get("lastName"),
    businessName: data.get("businessName"),
    businessActivity: data.get("businessActivity"),
    email: data.get("email"),
    mobilePhone: data.get("mobilePhone"),
    landlinePhone: data.get("landlinePhone"),
    website: data.get("website"),
    siret: data.get("siret"),
    message: data.get("message"),
    addressLine1: data.get("addressLine1"),
    postalCode: data.get("postalCode"),
    city: data.get("city"),
    contactConsent: data.get("contactConsent") === "on" || data.get("contactConsent") === "true",
  });
}

export function zodToMerchantSignupFieldErrors(error: z.ZodError): MerchantSignupFieldErrors {
  const fieldErrors: MerchantSignupFieldErrors = {};
  for (const issue of error.issues) {
    const key = (issue.path[0] as keyof MerchantSignupFieldErrors | undefined) ?? "contactConsent";
    if (!fieldErrors[key]) {
      fieldErrors[key] = issue.message;
    }
  }
  return fieldErrors;
}

export type ParseMerchantSignupResult =
  | { ok: true; data: MerchantSignupApplication }
  | { ok: false; message: string; fieldErrors: MerchantSignupFieldErrors };

export function parseMerchantSignupApplication(raw: unknown): ParseMerchantSignupResult {
  const normalized = normalizeMerchantSignupApplicationInput(raw);
  const parsed = merchantSignupApplicationSchema.safeParse(normalized);
  if (!parsed.success) {
    const fieldErrors = zodToMerchantSignupFieldErrors(parsed.error);
    return {
      ok: false,
      message: "Certaines informations sont incorrectes. Vérifiez les champs signalés ci-dessous.",
      fieldErrors,
    };
  }
  return { ok: true, data: parsed.data };
}
