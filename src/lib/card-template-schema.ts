import { z } from "zod";

export const CARD_ASPECT_RATIO = 1.586;
export const CARD_SCHEMA_VERSION = 1;
export const QR_MIN_SIZE = 0.12;

const normalized = z.number().min(0).max(1);

const textStyleSchema = z.object({
  fontFamily: z.enum(["system", "serif", "mono", "display"]).default("system"),
  fontSize: z.number().min(8).max(72).default(16),
  fontWeight: z.enum(["400", "500", "600", "700", "800"]).default("600"),
  color: z.string().regex(/^#([0-9a-fA-F]{6})$/).default("#FFFFFF"),
  textAlign: z.enum(["left", "center", "right"]).default("left"),
  opacity: z.number().min(0).max(1).default(1),
  lineHeight: z.number().min(0.8).max(2).default(1.2),
  shadow: z.boolean().default(false),
  maxWidth: normalized.optional(),
  backgroundColor: z.string().regex(/^#([0-9a-fA-F]{6})$/).optional(),
  borderRadius: z.number().min(0).max(32).default(0),
});

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
  style: textStyleSchema.optional(),
  text: z.string().max(200).optional(),
  progressColors: z
    .object({
      fill: z.string().regex(/^#([0-9a-fA-F]{6})$/),
      track: z.string().regex(/^#([0-9a-fA-F]{6})$/),
      radius: z.number().min(0).max(32).default(8),
    })
    .optional(),
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
      },
    },
    {
      id: "qr-1",
      type: "qr",
      x: 0.72,
      y: 0.12,
      width: 0.22,
      height: 0.22,
      zIndex: 3,
      locked: false,
      hidden: false,
      anchor: "top-left",
    },
    {
      id: "progress-1",
      type: "progressBar",
      x: 0.06,
      y: 0.78,
      width: 0.88,
      height: 0.06,
      zIndex: 2,
      locked: false,
      hidden: false,
      anchor: "top-left",
      progressColors: { fill: "#875BFF", track: "#FFFFFF", radius: 8 },
    },
  ],
});
