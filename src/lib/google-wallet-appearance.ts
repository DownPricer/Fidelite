import { z } from "zod";

export const GOOGLE_WALLET_RECOMMENDED_COLORS = ["#0B0B12", "#123456", "#5B3FD8", "#0F766E", "#111827"];

export const googleWalletHexSchema = z
  .string()
  .regex(/^#[0-9A-Fa-f]{6}$/, "Couleur invalide. Format attendu : #RRGGBB.")
  .transform((value) => value.toUpperCase());

export const googleWalletButtonLabelSchema = z.string().trim().min(2).max(30);

export const googleWalletAppearanceSchema = z.object({
  backgroundColor: googleWalletHexSchema.optional(),
  appLinkLabel: googleWalletButtonLabelSchema.optional(),
  heroImageUrl: z.string().optional().nullable(),
  logoUrl: z.string().optional().nullable(),
  wideLogoUrl: z.string().optional().nullable(),
});

export type GoogleWalletAppearance = z.infer<typeof googleWalletAppearanceSchema>;

export type GoogleWalletConfigMap = Record<string, unknown> & {
  draftAppearance?: GoogleWalletAppearance | null;
  publishedAppearance?: GoogleWalletAppearance | null;
  mediaGallery?: Array<{
    id: string;
    kind: "hero" | "logo" | "wideLogo";
    publicUrl: string;
    path: string;
    version: string;
    mime: string;
    dimensions: { width: number; height: number };
    active?: boolean;
    createdAt: string;
  }>;
};

function luminance(hex: string) {
  const parts = [hex.slice(1, 3), hex.slice(3, 5), hex.slice(5, 7)].map((part) => {
    const value = parseInt(part, 16) / 255;
    return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * parts[0] + 0.7152 * parts[1] + 0.0722 * parts[2];
}

export function contrastWithWhite(hex: string) {
  return (1.05) / (luminance(hex) + 0.05);
}

export function isReadableGoogleWalletColor(hex: string) {
  return contrastWithWhite(hex) >= 3;
}

export function parseGoogleWalletConfig(value: unknown): GoogleWalletConfigMap {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as GoogleWalletConfigMap) : {};
}

export function mergeGoogleWalletDraftConfig(input: {
  existing: unknown;
  appearance: GoogleWalletAppearance;
}) {
  const current = parseGoogleWalletConfig(input.existing);
  return {
    ...current,
    draftAppearance: {
      ...(current.draftAppearance ?? {}),
      ...input.appearance,
    },
    draftUpdatedAt: new Date().toISOString(),
  };
}

export function publishGoogleWalletConfig(existing: unknown) {
  const current = parseGoogleWalletConfig(existing);
  const draft = googleWalletAppearanceSchema.parse(current.draftAppearance ?? {});
  return {
    ...current,
    draftAppearance: draft,
    publishedAppearance: draft,
    publishedAt: new Date().toISOString(),
    lastPublishError: null,
  };
}

export function resetGoogleWalletConfig(existing: unknown) {
  const current = parseGoogleWalletConfig(existing);
  return {
    ...current,
    draftAppearance: null,
    publishedAppearance: null,
    resetAt: new Date().toISOString(),
  };
}
