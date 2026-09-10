import { z } from "zod";
import { CARD_ASPECT_RATIO, CARD_SCHEMA_VERSION, QR_MIN_SIZE } from "./card-template-constants";

export { CARD_ASPECT_RATIO, CARD_SCHEMA_VERSION, QR_MIN_SIZE };

const normalized = z.number().min(0).max(1);

const textStyleSchema = z.object({
  fontFamily: z.enum(["system", "card", "serif", "mono", "display"]).default("system"), // display = legacy alias
  fontSize: z.number().min(8).max(96).default(16),
  fontWeight: z.enum(["400", "500", "600", "700", "800"]).default("600"),
  fontStyle: z.enum(["normal", "italic"]).optional(),
  color: z.string().regex(/^#([0-9a-fA-F]{6})$/).default("#FFFFFF"),
  textAlign: z.enum(["left", "center", "right"]).default("left"),
  verticalAlign: z.enum(["top", "center", "bottom"]).optional(),
  opacity: z.number().min(0).max(1).default(1),
  lineHeight: z.number().min(0.8).max(2).default(1.2),
  letterSpacing: z.number().min(-2).max(10).optional(),
  textTransform: z.enum(["none", "uppercase"]).optional(),
  maxLines: z.number().int().min(1).max(5).optional(),
  shadow: z.boolean().default(false),
  textStroke: z.boolean().optional(),
  fitMode: z.enum(["manual", "autoShrink", "multiline"]).optional(),
  minFontSize: z.number().min(8).max(96).optional(),
  maxWidth: normalized.optional(),
  backgroundColor: z.string().regex(/^#([0-9a-fA-F]{6})$/).optional(),
  borderRadius: z.number().min(0).max(32).default(0),
});

const logoStyleSchema = z
  .object({
    objectFit: z.enum(["contain", "cover"]).optional(),
    borderRadius: z.number().min(0).max(32).optional(),
    padding: z.number().min(0).max(24).optional(),
    backgroundColor: z.string().regex(/^#([0-9a-fA-F]{6})$/).optional(),
    shadow: z.boolean().optional(),
    lockAspectRatio: z.boolean().optional(),
  })
  .optional();

const progressColorsSchema = z
  .object({
    fill: z.string().regex(/^#([0-9a-fA-F]{6})$/),
    track: z.string().regex(/^#([0-9a-fA-F]{6})$/),
    radius: z.number().min(0).max(32).default(8),
    borderColor: z.string().regex(/^#([0-9a-fA-F]{6})$/).optional(),
    borderWidth: z.number().min(0).max(8).optional(),
    shadow: z.boolean().optional(),
    glow: z.boolean().optional(),
    orientation: z.enum(["horizontal", "vertical"]).optional(),
    showLabel: z.boolean().optional(),
    labelColor: z.string().regex(/^#([0-9a-fA-F]{6})$/).optional(),
    labelFontSize: z.number().min(8).max(32).optional(),
  })
  .optional();

const loyaltyWidgetConfigSchema = z
  .object({
    loyaltyMode: z.enum(["VISITS", "POINTS_BY_AMOUNT", "FIXED_POINTS", "AMOUNT_TIERS"]),
    styleVariant: z.string().min(1).max(40),
    colors: z.object({
      fill: z.string().regex(/^#([0-9a-fA-F]{6})$/),
      track: z.string().regex(/^#([0-9a-fA-F]{6})$/),
      radius: z.number().min(0).max(32).optional(),
      borderColor: z.string().regex(/^#([0-9a-fA-F]{6})$/).optional(),
      borderWidth: z.number().min(0).max(8).optional(),
      glow: z.boolean().optional(),
      shadow: z.boolean().optional(),
    }),
    showCounter: z.boolean().optional(),
    cellShape: z.enum(["circle", "square", "rounded"]).optional(),
    spacing: z.number().min(0).max(32).optional(),
    icon: z.string().max(8).optional(),
    animateProgress: z.boolean().optional(),
    labelPosition: z.enum(["inside", "below", "none"]).optional(),
    fontSize: z.number().min(8).max(96).optional(),
    showNextReward: z.boolean().optional(),
    showRemainingPoints: z.boolean().optional(),
  })
  .optional();

const decorativeStyleSchema = z
  .object({
    backgroundColor: z.string().regex(/^#([0-9a-fA-F]{6})$/).default("#FFFFFF22"),
    borderColor: z.string().regex(/^#([0-9a-fA-F]{6})$/).optional(),
    borderWidth: z.number().min(0).max(8).optional(),
    borderRadius: z.number().min(0).max(64).optional(),
    shape: z.enum(["rectangle", "circle", "pill"]).optional(),
    shadow: z.boolean().optional(),
  })
  .optional();

const elementTypes = z.enum([
  "logo",
  "merchantName",
  "clientName",
  "qr",
  "pointsBalance",
  "visitsCount",
  "progressText",
  "progressBar",
  "nextReward",
  "unlockedReward",
  "tierLevel",
  "expiryDate",
  "staticText",
  "loyaltyWidget",
  "decorative",
]);

export const cardElementSchema = z.object({
  id: z.string().min(1),
  type: elementTypes,
  x: normalized,
  y: normalized,
  width: normalized,
  height: normalized,
  zIndex: z.number().int().min(0).max(999),
  locked: z.boolean().default(false),
  anchor: z
    .enum([
      "top-left",
      "top-center",
      "top-right",
      "center",
      "bottom-left",
      "bottom-center",
      "bottom-right",
    ])
    .default("top-left"),
  label: z.string().max(40).optional(),
  hidden: z.boolean().default(false),
  opacity: z.number().min(0).max(1).optional(),
  rotation: z.number().min(-180).max(180).optional(),
  lockAspectRatio: z.boolean().optional(),
  dataKey: z.string().max(64).optional(),
  style: textStyleSchema.optional(),
  logoStyle: logoStyleSchema,
  text: z.string().max(200).optional(),
  progressColors: progressColorsSchema,
  loyaltyWidget: loyaltyWidgetConfigSchema,
  decorativeStyle: decorativeStyleSchema,
});

export const cardTemplateConfigSchema = z.object({
  schemaVersion: z.literal(CARD_SCHEMA_VERSION),
  aspectRatio: z.literal(CARD_ASPECT_RATIO),
  background: z.object({
    url: z.string().min(1),
    fit: z.enum(["cover", "contain", "fill"]).default("cover"),
    position: z.object({ x: normalized, y: normalized }).default({ x: 0.5, y: 0.5 }),
    scale: z.number().min(0.5).max(3).default(1),
  }),
  safeZone: z
    .object({
      top: normalized,
      right: normalized,
      bottom: normalized,
      left: normalized,
    })
    .default({ top: 0.04, right: 0.04, bottom: 0.04, left: 0.04 }),
  elements: z.array(cardElementSchema).max(30),
});

export type CardTemplateConfig = z.infer<typeof cardTemplateConfigSchema>;
export type CardElement = z.infer<typeof cardElementSchema>;
export type CardTextStyle = z.infer<typeof textStyleSchema>;
export type CardLogoStyle = NonNullable<z.infer<typeof logoStyleSchema>>;
export type CardProgressColors = NonNullable<z.infer<typeof progressColorsSchema>>;
export type CardLoyaltyWidgetConfig = NonNullable<z.infer<typeof loyaltyWidgetConfigSchema>>;
export type CardDecorativeStyle = NonNullable<z.infer<typeof decorativeStyleSchema>>;

export { validateCardTemplateForPublish, validateCardTemplateForPublishDetailed } from "./card-template-validation";

export const defaultCardTemplateConfig = (backgroundUrl: string): CardTemplateConfig => ({
  schemaVersion: CARD_SCHEMA_VERSION,
  aspectRatio: CARD_ASPECT_RATIO,
  background: { url: backgroundUrl, fit: "cover", position: { x: 0.5, y: 0.5 }, scale: 1 },
  safeZone: { top: 0.04, right: 0.04, bottom: 0.04, left: 0.04 },
  elements: [
    {
      id: "logo-1",
      type: "logo",
      x: 0.05,
      y: 0.06,
      width: 0.14,
      height: 0.14,
      zIndex: 2,
      locked: false,
      hidden: false,
      anchor: "top-left",
      lockAspectRatio: true,
      logoStyle: { objectFit: "contain", borderRadius: 12, lockAspectRatio: true },
    },
    {
      id: "name-1",
      type: "merchantName",
      x: 0.22,
      y: 0.08,
      width: 0.5,
      height: 0.1,
      zIndex: 2,
      locked: false,
      hidden: false,
      anchor: "top-left",
      style: {
        fontFamily: "system",
        fontSize: 20,
        fontWeight: "700",
        color: "#FFFFFF",
        textAlign: "left",
        opacity: 1,
        lineHeight: 1.2,
        shadow: true,
        borderRadius: 0,
        fitMode: "autoShrink",
        maxLines: 2,
        minFontSize: 12,
      },
    },
    {
      id: "qr-1",
      type: "qr",
      x: 0.72,
      y: 0.12,
      width: 0.18,
      height: 0.18 * CARD_ASPECT_RATIO,
      zIndex: 3,
      locked: false,
      hidden: false,
      anchor: "top-left",
      lockAspectRatio: true,
    },
    {
      id: "loyalty-1",
      type: "loyaltyWidget",
      label: "Progression par passages",
      x: 0.06,
      y: 0.62,
      width: 0.88,
      height: 0.22,
      zIndex: 2,
      locked: false,
      hidden: false,
      anchor: "top-left",
      loyaltyWidget: {
        loyaltyMode: "VISITS",
        styleVariant: "stampGrid",
        colors: { fill: "#875BFF", track: "#FFFFFF", radius: 8 },
        showCounter: true,
        cellShape: "circle",
        spacing: 6,
        labelPosition: "below",
      },
    },
  ],
});
