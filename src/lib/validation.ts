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

/**
 * URL d'un média de campagne/publicité : soit une URL absolue, soit un chemin relatif renvoyé
 * par notre propre stockage (`saveCampaignMedia`, ex. `/api/media/campaigns/<merchant>/<file>`).
 * `.url()` seul rejette à tort ce chemin relatif — c'était la cause du message d'erreur
 * incompréhensible après l'ajout d'une image de campagne.
 */
export const mediaPathOrUrlSchema = z
  .string()
  .max(500)
  .refine((value) => /^https?:\/\//i.test(value) || value.startsWith("/api/media/"), {
    message: "Image invalide.",
  });

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

export const platformCustomerRegisterSchema = customerRegisterSchema.extend({
  lastName: z.string().trim().min(1, "Le nom est obligatoire.").max(80),
});

export const customerRecoveryRequestSchema = z.object({
  email: emailSchema,
});

export const publicContactFormSchema = z.object({
  name: z.string().trim().min(1, "Le nom est obligatoire.").max(120),
  email: emailSchema,
  message: z
    .string()
    .trim()
    .min(10, "Votre message doit contenir au moins 10 caractères.")
    .max(5000, "Message trop long."),
});

export const customerFinalizeSchema = z.object({
  firstName: firstNameSchema,
  lastName: z.string().trim().min(1, "Le nom est obligatoire.").max(80),
  city: z.string().trim().min(1, "La ville est obligatoire.").max(100),
  addressLine1: z.string().trim().max(200).optional().or(z.literal("")),
  addressLine2: z.string().trim().max(200).optional().or(z.literal("")),
  postalCode: z.string().trim().max(20).optional().or(z.literal("")),
  country: z.string().trim().max(2).optional().or(z.literal("")),
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

export const customerPhoneSendSchema = z.object({
  phone: z
    .string()
    .trim()
    .regex(/^[\d\s().+-]{6,20}$/, "Numéro de téléphone invalide."),
  phoneCountryCode: z.string().trim().max(6).default("+33"),
});

export const customerPhoneVerifySchema = z.object({
  code: z.string().trim().regex(/^\d{6}$/, "Code à 6 chiffres requis."),
});

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
  adsMerchantPush: z.boolean().optional(),
  adsMerchantEmail: z.boolean().optional(),
  adsNetworkPush: z.boolean().optional(),
  adsNetworkEmail: z.boolean().optional(),
  marketingZoneCity: z.string().trim().max(120).nullable().optional(),
  marketingZonePostalCode: z
    .string()
    .trim()
    .regex(/^[0-9]{4,10}$/, "Code postal invalide.")
    .nullable()
    .optional(),
  consentPersonalizedOffers: z.boolean().optional(),
  consentMarketing: z.boolean().optional(),
  consentAnalytics: z.boolean().optional(),
  language: z.enum(["fr", "en"]).optional(),
});

export const historyFilterSchema = z.enum(["all", "earned", "used", "expired", "correction"]);

export const pushSubscribeSchema = z.object({
  endpoint: z.string().url().max(2000),
  keys: z.object({
    p256dh: z.string().min(1).max(500),
    auth: z.string().min(1).max(500),
  }),
});

export const pushUnsubscribeSchema = z.object({
  endpoint: z.string().url().max(2000),
});

export const campaignCreateSchema = z.object({
  channel: z.enum(["IN_APP_PUSH", "EMAIL"]),
  audienceType: z.enum(["MERCHANT_MEMBERS", "NETWORK_LOCAL"]),
});

export const campaignContentSchema = z.object({
  title: z.string().trim().min(3, "Titre trop court.").max(120),
  body: z.string().trim().min(3, "Message trop court.").max(2000),
  imageUrl: mediaPathOrUrlSchema.nullable().optional(),
  actionLabel: z.string().trim().max(40).nullable().optional(),
  actionUrl: z.string().url().max(500).nullable().optional(),
  scheduledAt: z.string().datetime().nullable().optional(),
});

export const campaignMediaUploadSchema = z.object({
  dataUrl: z.string().min(1),
});

const sponsoredDaySelectionSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date invalide."),
  hours: z.array(z.number().int().min(0).max(23)).min(1).max(24),
});

/**
 * Deux parcours de visuel (Partie 14) : SELF = le commerçant a déjà recadré son image au bon
 * format (une seule image, prête à diffuser) ; FIDETO = 1 à 5 images libres envoyées pour que
 * Fideto prépare le visuel final (jamais diffusées telles quelles, voir adModerationSchema).
 * `hourlySchedule` remplace l'ancien couple startDate/endDate en jours pleins — voir
 * sponsored-hours-pricing.ts (validation fine et prix recalculés côté serveur à la confirmation).
 */
export const adRequestCreateSchema = z
  .object({
    requestedText: z.string().trim().min(3).max(1000),
    visualMode: z.enum(["SELF", "FIDETO"]).default("FIDETO"),
    requestedImageUrl: mediaPathOrUrlSchema.nullable().optional(),
    requestedOriginalUrl: mediaPathOrUrlSchema.nullable().optional(),
    requestedImageUrls: z.array(mediaPathOrUrlSchema).max(5).optional(),
    visualBrief: z.string().trim().max(500).nullable().optional(),
    objective: z.string().trim().max(200).nullable().optional(),
    ctaLabel: z.string().trim().max(40).nullable().optional(),
    ctaUrl: z.string().url().max(500).nullable().optional(),
    hourlySchedule: z.array(sponsoredDaySelectionSchema).min(1).max(60),
  })
  .refine(
    (data) => data.visualMode !== "SELF" || Boolean(data.requestedImageUrl),
    { message: "Ajoutez votre visuel recadré avant d'envoyer.", path: ["requestedImageUrl"] },
  )
  .refine(
    (data) =>
      data.visualMode !== "FIDETO" || ((data.requestedImageUrls?.length ?? 0) >= 1 && (data.requestedImageUrls?.length ?? 0) <= 5),
    { message: "Envoyez entre 1 et 5 images pour que Fideto prépare votre visuel.", path: ["requestedImageUrls"] },
  );

/**
 * Modification d'une demande de bandeau par le commerçant (PATCH /api/merchant/ads/[id]) —
 * tous les champs modifiables de adRequestCreateSchema, en partiel : seuls les champs fournis
 * sont mis à jour. hourlySchedule, s'il est fourni, est revalidé et re-tarifé côté serveur
 * exactement comme à la création (jamais de recalcul côté client).
 */
export const adRequestUpdateSchema = z
  .object({
    requestedText: z.string().trim().min(3).max(1000).optional(),
    requestedImageUrl: mediaPathOrUrlSchema.nullable().optional(),
    requestedImageUrls: z.array(mediaPathOrUrlSchema).max(5).optional(),
    objective: z.string().trim().max(200).nullable().optional(),
    ctaLabel: z.string().trim().max(40).nullable().optional(),
    ctaUrl: z.string().url().max(500).nullable().optional(),
    hourlySchedule: z.array(sponsoredDaySelectionSchema).min(1).max(60).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, { message: "Aucune modification fournie." });

/**
 * Modération super-admin (Partie 12 étapes 3-5, étendue) :
 *  - approve   : fournit finalImageUrl (+ dates optionnelles) → AdRequest.status = APPROVED.
 *  - reject    : refus définitif, motif obligatoire recommandé → REJECTED.
 *  - request_changes : correction demandée, motif obligatoire → NEEDS_CHANGES (le commerçant
 *    peut alors modifier sa demande via PATCH /api/merchant/ads/[id]).
 *  - suspend   : suspend une mise en avant SCHEDULED/LIVE → SUSPENDED (ne diffuse plus).
 *  - resume    : relance une mise en avant SUSPENDED → SCHEDULED.
 *  - stop      : arrêt définitif avant la fin naturelle des créneaux → STOPPED.
 */
export const adModerationSchema = z.object({
  action: z.enum(["approve", "reject", "request_changes", "suspend", "resume", "stop"]),
  rejectionReason: z.string().trim().max(500).nullable().optional(),
  finalImageUrl: mediaPathOrUrlSchema.nullable().optional(),
  startDate: z.string().datetime().nullable().optional(),
  endDate: z.string().datetime().nullable().optional(),
  // Correction facultative du texte/lien par Fideto au moment de l'approbation (l'éditeur de
  // bandeau du super-admin peut ajuster une coquille sans renvoyer au commerçant).
  requestedText: z.string().trim().min(3).max(1000).optional(),
  ctaLabel: z.string().trim().max(40).nullable().optional(),
  ctaUrl: z.string().url().max(500).nullable().optional(),
});

export const scanSchema = z.discriminatedUnion("inputType", [
  z.object({
    inputType: z.literal("QR"),
    value: z.string().trim().min(10, "QR invalide.").max(4000),
    confirmNewMembership: z.boolean().optional(),
  }),
  z.object({
    inputType: z.literal("CLIENT_NUMBER"),
    value: z.string().trim().min(1, "Numéro client invalide.").max(20),
    confirmNewMembership: z.boolean().optional(),
  }),
]);

export const caisseActionSchema = z.object({
  grantId: z.string().min(1),
  rewardId: z.string().min(1).optional(),
  purchaseAmount: z.number().min(0).max(100_000).optional(),
  purchaseAmountCents: z.number().int().min(0).max(10_000_000).optional(),
  idempotencyKey: z.string().min(8).max(80).optional(),
});

export const caisseEarnSchema = z.object({
  grantId: z.string().min(1),
  purchaseAmount: z.number().min(0).max(100_000).optional(),
  purchaseAmountCents: z.number().int().min(0).max(10_000_000).optional(),
  idempotencyKey: z.string().min(8).max(80).optional(),
});

export const caissePreviewSchema = z.object({
  grantId: z.string().min(1),
  action: z.enum(["EARN", "REDEEM"]).default("EARN"),
  rewardId: z.string().min(1).optional(),
  purchaseAmount: z.number().min(0).max(100_000).optional(),
  purchaseAmountCents: z.number().int().min(0).max(10_000_000).optional(),
});

export const caisseCommitSchema = z.object({
  grantId: z.string().min(1),
  action: z.enum(["EARN", "REDEEM"]),
  rewardId: z.string().min(1).optional(),
  purchaseAmount: z.number().min(0).max(100_000).optional(),
  purchaseAmountCents: z.number().int().min(0).max(10_000_000).optional(),
  idempotencyKey: z.string().min(8, "Clé d'idempotence requise.").max(80),
});

export const createEmployeeSchema = z
  .object({
    firstName: firstNameSchema,
    lastName: z.string().trim().max(80).optional(),
    email: emailSchema,
    phone: phoneSchema,
    password: passwordSchema,
    passwordConfirm: z.string().min(1, "Confirmez le mot de passe."),
    staffPreset: z.enum(["MANAGER", "CASHIER", "CUSTOM"]).default("CASHIER"),
    permissions: z.record(z.boolean()).optional(),
  })
  .refine((value) => value.password === value.passwordConfirm, {
    message: "Les mots de passe ne correspondent pas.",
    path: ["passwordConfirm"],
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
      archivedAt: z.string().optional().nullable(),
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

export const acceptInvitationSchema = z
  .object({
    token: z.string().min(16).max(128),
    password: passwordSchema,
    passwordConfirm: z.string().min(1, "Confirmez votre mot de passe."),
  })
  .refine((value) => value.password === value.passwordConfirm, {
    message: "Les mots de passe ne correspondent pas.",
    path: ["passwordConfirm"],
  });

export const invitationTokenQuerySchema = z.object({
  token: z.string().min(16).max(128),
});

export function zodErrorMessage(error: z.ZodError) {
  return error.issues[0]?.message ?? "Données invalides.";
}
