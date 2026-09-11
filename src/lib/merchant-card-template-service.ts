import type { CardTemplateStatus, LoyaltyMode, MerchantCardSlot, Prisma } from "@prisma/client";

import type { CardTemplateConfig } from "./card-template-schema";
import { defaultCardTemplateConfig } from "./card-template-schema";
import { normalizeCardTemplateForSlot } from "./card-template-normalize";
import { defaultNextRewardStyle } from "./next-reward-styles";
import { qrNormalizedHeight } from "./card-template-qr-geometry";
import {
  convertConfigForTargetSlot,
  createDefaultLoyaltyWidgetElement,
  sanitizeLoyaltyWidgetsForSlot,
} from "./loyalty-widget";
import {
  ALL_MERCHANT_CARD_SLOTS,
  CARD_SLOT_TITLES,
  cardSlotForLoyaltyMode,
  isLoyaltyProgramSlot,
  loyaltyModeForCardSlot,
} from "./merchant-card-slots";
import { logMerchantCardSwitch } from "./merchant-card-switch-log";
import { prisma } from "./prisma";
import { normalizePublishedWalletTemplate, type PublishedWalletTemplate } from "./wallet-card-template";

type TemplateDbClient = Pick<typeof prisma, "merchantCardTemplate">;

export {
  ALL_MERCHANT_CARD_SLOTS,
  CARD_SLOT_TITLES,
  cardSlotEditorPath,
  merchantCardsGalleryPath,
} from "./merchant-card-slots";

/** @deprecated Utiliser ALL_MERCHANT_CARD_SLOTS (sans GENERAL) pour les modes programme */
export const ALL_LOYALTY_MODES = ALL_MERCHANT_CARD_SLOTS.filter(
  (slot): slot is LoyaltyMode => slot !== "GENERAL",
);

/** @deprecated Utiliser CARD_SLOT_TITLES */
export const LOYALTY_MODE_CARD_TITLES: Record<LoyaltyMode, string> = {
  VISITS: CARD_SLOT_TITLES.VISITS,
  POINTS_BY_AMOUNT: CARD_SLOT_TITLES.POINTS_BY_AMOUNT,
  FIXED_POINTS: CARD_SLOT_TITLES.FIXED_POINTS,
  AMOUNT_TIERS: CARD_SLOT_TITLES.AMOUNT_TIERS,
};

export type MerchantCardSlotSummary = {
  cardSlot: MerchantCardSlot;
  title: string;
  templateId: string | null;
  status: "unconfigured" | "DRAFT" | "PUBLISHED" | "ARCHIVED";
  displayStatus: "Carte à créer" | "Brouillon" | "Publiée" | "Actuellement utilisée";
  version: number | null;
  backgroundUrl: string | null;
  updatedAt: string | null;
  publishedAt: string | null;
  isCurrentlyUsed: boolean;
};

export type ResolvedPublishedCardTemplate = {
  id: string;
  backgroundUrl: string | null;
  config: CardTemplateConfig;
  cardSlot: MerchantCardSlot;
  loyaltyMode: LoyaltyMode;
  version: number;
  usedFallback: boolean;
};

export function adaptTemplateConfigForLoyaltyMode(
  config: CardTemplateConfig,
  mode: LoyaltyMode,
): CardTemplateConfig {
  return sanitizeLoyaltyWidgetsForSlot(config, mode);
}

/** Présentation neutre pour la carte générale. */
export function adaptTemplateConfigForGeneralSlot(config: CardTemplateConfig): CardTemplateConfig {
  return sanitizeLoyaltyWidgetsForSlot(config, "GENERAL");
}

export function adaptTemplateConfigForCardSlot(
  config: CardTemplateConfig,
  cardSlot: MerchantCardSlot,
  _activeLoyaltyMode: LoyaltyMode,
): CardTemplateConfig {
  return normalizeCardTemplateForSlot(config, cardSlot);
}

function mandatoryElementsForSlot(cardSlot: MerchantCardSlot, maxZ: number): CardTemplateConfig["elements"] {
  const extras: CardTemplateConfig["elements"] = [];

  extras.push({
    id: `clientName-fresh-${cardSlot}`,
    type: "clientName",
    label: "Identité client",
    x: 0.06,
    y: 0.28,
    width: 0.52,
    height: 0.08,
    zIndex: maxZ + 1,
    locked: false,
    hidden: false,
    anchor: "top-left",
    style: {
      fontFamily: "system",
      fontSize: 16,
      fontWeight: "600",
      color: "#FFFFFF",
      textAlign: "left",
      opacity: 1,
      lineHeight: 1.2,
      shadow: true,
      borderRadius: 0,
      fitMode: "autoShrink",
      minFontSize: 10,
      maxLines: 2,
    },
  });

  if (isLoyaltyProgramSlot(cardSlot)) {
    extras.push({
      id: `nextReward-fresh-${cardSlot}`,
      type: "nextReward",
      label: "Prochain avantage",
      x: 0.06,
      y: 0.86,
      width: 0.88,
      height: 0.08,
      zIndex: maxZ + 2,
      locked: false,
      hidden: false,
      anchor: "top-left",
      nextRewardStyle: defaultNextRewardStyle(),
    });
  }

  return extras;
}

export function defaultTemplateConfigForSlot(
  backgroundUrl: string,
  cardSlot: MerchantCardSlot,
): CardTemplateConfig {
  const base = defaultCardTemplateConfig(backgroundUrl);
  if (cardSlot === "GENERAL") {
    const withoutWidget = {
      ...base,
      elements: [
        ...base.elements.filter((el) => el.type !== "loyaltyWidget"),
        ...mandatoryElementsForSlot("GENERAL", base.elements.length),
      ],
    };
    return normalizeCardTemplateForSlot(withoutWidget, "GENERAL");
  }
  const widget = createDefaultLoyaltyWidgetElement(cardSlot, 3);
  const filtered = base.elements.filter((el) => el.type !== "loyaltyWidget");
  const elements = widget
    ? [...filtered, ...mandatoryElementsForSlot(cardSlot, filtered.length), widget]
    : [...filtered, ...mandatoryElementsForSlot(cardSlot, filtered.length)];
  return normalizeCardTemplateForSlot({ ...base, elements }, cardSlot);
}

/** Brouillon vierge avec uniquement les éléments techniques obligatoires pour l’emplacement. */
export function freshDraftConfigForSlot(cardSlot: MerchantCardSlot): CardTemplateConfig {
  const qrWidth = 0.18;
  const config = defaultTemplateConfigForSlot("", cardSlot);
  return normalizeCardTemplateForSlot(
    {
      ...config,
      background: {
        ...config.background,
        url: "",
        fit: "cover",
        position: { x: 0.5, y: 0.5 },
        scale: 1,
      },
      elements: config.elements
        .filter((el) => el.type !== "decorative" && el.type !== "staticText")
        .map((el) => {
          if (el.type === "qr") {
            return {
              ...el,
              width: qrWidth,
              height: qrNormalizedHeight(qrWidth),
              lockAspectRatio: true,
            };
          }
          return el;
        }),
    },
    cardSlot,
  );
}

function templateRank(status: CardTemplateStatus) {
  if (status === "PUBLISHED") return 3;
  if (status === "DRAFT") return 2;
  return 1;
}

export function pickCanonicalTemplate<
  T extends {
    cardSlot: MerchantCardSlot;
    status: CardTemplateStatus;
    isDefault: boolean;
    updatedAt: Date | string;
  },
>(templates: T[], cardSlot: MerchantCardSlot): T | null {
  const matches = templates.filter((template) => template.cardSlot === cardSlot);
  if (matches.length === 0) return null;
  const updatedAtMs = (value: Date | string) => new Date(value).getTime();
  return [...matches].sort((a, b) => {
    const rank = templateRank(b.status) - templateRank(a.status);
    if (rank !== 0) return rank;
    if (a.isDefault !== b.isDefault) return a.isDefault ? -1 : 1;
    return updatedAtMs(b.updatedAt) - updatedAtMs(a.updatedAt);
  })[0]!;
}

/** @deprecated */
export function pickCanonicalTemplateByMode<
  T extends {
    loyaltyMode: LoyaltyMode | null;
    cardSlot?: MerchantCardSlot;
    status: CardTemplateStatus;
    isDefault: boolean;
    updatedAt: Date | string;
  },
>(templates: T[], loyaltyMode: LoyaltyMode): T | null {
  return pickCanonicalTemplate(
    templates.map((t) => ({
      ...t,
      cardSlot: t.cardSlot ?? cardSlotForLoyaltyMode(loyaltyMode),
    })),
    cardSlotForLoyaltyMode(loyaltyMode),
  );
}

function resolveCurrentlyUsedSlot(
  templates: Array<{
    cardSlot: MerchantCardSlot;
    status: CardTemplateStatus;
    isDefault: boolean;
    updatedAt: Date | string;
  }>,
  activeProgramMode: LoyaltyMode | null,
): MerchantCardSlot | null {
  if (!activeProgramMode) {
    const general = pickCanonicalTemplate(templates, "GENERAL");
    return general?.status === "PUBLISHED" ? "GENERAL" : null;
  }
  const programSlot = cardSlotForLoyaltyMode(activeProgramMode);
  const specific = pickCanonicalTemplate(templates, programSlot);
  if (specific?.status === "PUBLISHED") return programSlot;
  const general = pickCanonicalTemplate(templates, "GENERAL");
  if (general?.status === "PUBLISHED") return "GENERAL";
  return null;
}

function displayStatusForSlot(
  summary: Omit<MerchantCardSlotSummary, "displayStatus">,
): MerchantCardSlotSummary["displayStatus"] {
  if (summary.isCurrentlyUsed) return "Actuellement utilisée";
  if (summary.status === "unconfigured") return "Carte à créer";
  if (summary.status === "DRAFT") return "Brouillon";
  if (summary.status === "PUBLISHED") return "Publiée";
  return "Carte à créer";
}

export function summarizeTemplateForSlot(
  templates: Array<{
    id: string;
    cardSlot: MerchantCardSlot;
    status: CardTemplateStatus;
    version: number;
    backgroundUrl: string | null;
    updatedAt: Date;
    publishedAt: Date | null;
    isDefault: boolean;
  }>,
  cardSlot: MerchantCardSlot,
  activeProgramMode: LoyaltyMode | null,
): MerchantCardSlotSummary {
  const currentlyUsed = resolveCurrentlyUsedSlot(templates, activeProgramMode);
  const canonical = pickCanonicalTemplate(templates, cardSlot);
  if (!canonical) {
    const base = {
      cardSlot,
      title: CARD_SLOT_TITLES[cardSlot],
      templateId: null,
      status: "unconfigured" as const,
      version: null,
      backgroundUrl: null,
      updatedAt: null,
      publishedAt: null,
      isCurrentlyUsed: currentlyUsed === cardSlot,
    };
    return { ...base, displayStatus: displayStatusForSlot(base) };
  }
  const base = {
    cardSlot,
    title: CARD_SLOT_TITLES[cardSlot],
    templateId: canonical.id,
    status: canonical.status,
    version: canonical.version,
    backgroundUrl: canonical.backgroundUrl,
    updatedAt: canonical.updatedAt.toISOString(),
    publishedAt: canonical.publishedAt?.toISOString() ?? null,
    isCurrentlyUsed: currentlyUsed === cardSlot,
  };
  return { ...base, displayStatus: displayStatusForSlot(base) };
}

/** @deprecated */
export function summarizeTemplateForMode(
  templates: Parameters<typeof summarizeTemplateForSlot>[0],
  loyaltyMode: LoyaltyMode,
  activeProgramMode: LoyaltyMode | null,
) {
  const summary = summarizeTemplateForSlot(templates, cardSlotForLoyaltyMode(loyaltyMode), activeProgramMode);
  return {
    loyaltyMode,
    title: summary.title,
    templateId: summary.templateId,
    status: summary.status,
    version: summary.version,
    backgroundUrl: summary.backgroundUrl,
    updatedAt: summary.updatedAt,
    publishedAt: summary.publishedAt,
    isActiveProgramMode: summary.isCurrentlyUsed,
  };
}

async function findPublishedForSlot(
  merchantId: string,
  cardSlot: MerchantCardSlot,
  db: TemplateDbClient = prisma,
) {
  return db.merchantCardTemplate.findFirst({
    where: { merchantId, cardSlot, status: "PUBLISHED" },
    orderBy: [{ isDefault: "desc" }, { publishedAt: "desc" }],
  });
}

/** Sélection canonique : variante du programme actif, sinon carte générale publiée. */
export async function resolvePublishedMerchantCardTemplate(
  merchantId: string,
  activeLoyaltyMode: LoyaltyMode,
  db: TemplateDbClient = prisma,
): Promise<ResolvedPublishedCardTemplate | null> {
  const programSlot = cardSlotForLoyaltyMode(activeLoyaltyMode);
  logMerchantCardSwitch("variante demandée", {
    merchantId,
    mode: activeLoyaltyMode,
    cardSlot: programSlot,
  });

  const specific = await findPublishedForSlot(merchantId, programSlot, db);
  if (specific) {
    logMerchantCardSwitch("gabarit trouvé", {
      merchantId,
      mode: activeLoyaltyMode,
      cardSlot: programSlot,
      templateId: specific.id,
      templateVersion: specific.version,
      usedFallback: false,
    });
    return {
      id: specific.id,
      backgroundUrl: specific.backgroundUrl,
      config: specific.config as CardTemplateConfig,
      cardSlot: specific.cardSlot,
      loyaltyMode: activeLoyaltyMode,
      version: specific.version,
      usedFallback: false,
    };
  }

  const general = await findPublishedForSlot(merchantId, "GENERAL", db);
  if (!general) {
    logMerchantCardSwitch("gabarit trouvé", {
      merchantId,
      mode: activeLoyaltyMode,
      cardSlot: programSlot,
      templateId: null,
      usedFallback: false,
    });
    return null;
  }

  logMerchantCardSwitch("gabarit trouvé", {
    merchantId,
    mode: activeLoyaltyMode,
    cardSlot: "GENERAL",
    templateId: general.id,
    templateVersion: general.version,
    usedFallback: true,
  });

  return {
    id: general.id,
    backgroundUrl: general.backgroundUrl,
    config: general.config as CardTemplateConfig,
    cardSlot: "GENERAL",
    loyaltyMode: activeLoyaltyMode,
    version: general.version,
    usedFallback: true,
  };
}

export async function hasPublishedTemplateForMode(_merchantId: string, _loyaltyMode: LoyaltyMode) {
  return true;
}

export function normalizeResolvedPublishedTemplate(
  template: ResolvedPublishedCardTemplate | null,
): PublishedWalletTemplate | null {
  if (!template) return null;
  const config =
    template.cardSlot === "GENERAL"
      ? adaptTemplateConfigForGeneralSlot(template.config)
      : adaptTemplateConfigForCardSlot(template.config, template.cardSlot, template.loyaltyMode);

  return normalizePublishedWalletTemplate({
    backgroundUrl: template.backgroundUrl,
    config,
    loyaltyMode: template.loyaltyMode,
  });
}

export async function getEditableTemplateForSlot(merchantId: string, cardSlot: MerchantCardSlot) {
  const templates = await prisma.merchantCardTemplate.findMany({
    where: { merchantId, cardSlot },
    orderBy: [{ status: "asc" }, { updatedAt: "desc" }],
  });
  return (
    templates.find((template) => template.status === "DRAFT") ??
    pickCanonicalTemplate(templates, cardSlot)
  );
}

export async function ensureDraftTemplateForSlot(
  merchantId: string,
  cardSlot: MerchantCardSlot,
  source?: { backgroundUrl?: string | null; config: CardTemplateConfig },
  authorId?: string | null,
) {
  const existingDraft = await prisma.merchantCardTemplate.findFirst({
    where: { merchantId, cardSlot, status: "DRAFT" },
  });
  if (existingDraft) return existingDraft;

  const backgroundUrl = source?.backgroundUrl ?? null;
  const config = source
    ? adaptTemplateConfigForCardSlot(
        source.config,
        cardSlot,
        isLoyaltyProgramSlot(cardSlot) ? cardSlot : "VISITS",
      )
    : defaultTemplateConfigForSlot(backgroundUrl ?? "", cardSlot);

  return prisma.merchantCardTemplate.create({
    data: {
      merchantId,
      cardSlot,
      loyaltyMode: loyaltyModeForCardSlot(cardSlot),
      name: CARD_SLOT_TITLES[cardSlot],
      backgroundUrl,
      config: config as Prisma.InputJsonValue,
      status: "DRAFT",
      authorId: authorId ?? null,
    },
  });
}

export async function duplicateTemplateToSlots(
  sourceTemplateId: string,
  targetSlots: MerchantCardSlot[],
  authorId: string,
) {
  const source = await prisma.merchantCardTemplate.findUnique({ where: { id: sourceTemplateId } });
  if (!source) throw new Error("Gabarit source introuvable.");

  const created = [];
  for (const cardSlot of targetSlots) {
    if (cardSlot === source.cardSlot) continue;

    const publishedTarget = await prisma.merchantCardTemplate.findFirst({
      where: { merchantId: source.merchantId, cardSlot, status: "PUBLISHED" },
    });
    if (publishedTarget) {
      throw new Error(
        `La carte « ${CARD_SLOT_TITLES[cardSlot]} » possède déjà une version publiée. Archivez-la avant de dupliquer.`,
      );
    }

    const converted = convertConfigForTargetSlot(source.config as CardTemplateConfig, cardSlot);
    const draft = await ensureDraftTemplateForSlot(
      source.merchantId,
      cardSlot,
      {
        backgroundUrl: source.backgroundUrl,
        config: converted,
      },
      authorId,
    );
    created.push(draft);
  }
  return created;
}

/** @deprecated */
export async function duplicateTemplateToModes(
  sourceTemplateId: string,
  targetModes: LoyaltyMode[],
  authorId: string,
) {
  return duplicateTemplateToSlots(
    sourceTemplateId,
    targetModes.map((mode) => cardSlotForLoyaltyMode(mode)),
    authorId,
  );
}

export async function applySharedBackgroundToModeTemplates(input: {
  merchantId: string;
  activeMode: LoyaltyMode;
  backgroundUrl: string;
  duplicateToAll: boolean;
  authorId?: string | null;
}) {
  const slots: MerchantCardSlot[] = input.duplicateToAll
    ? [...ALL_MERCHANT_CARD_SLOTS]
    : ["GENERAL", cardSlotForLoyaltyMode(input.activeMode)];

  const results = [];
  for (const cardSlot of slots) {
    const config = defaultTemplateConfigForSlot(input.backgroundUrl, cardSlot);
    const draft = await ensureDraftTemplateForSlot(
      input.merchantId,
      cardSlot,
      { backgroundUrl: input.backgroundUrl, config },
      input.authorId ?? null,
    );
    const updated = await prisma.merchantCardTemplate.update({
      where: { id: draft.id },
      data: {
        backgroundUrl: input.backgroundUrl,
        config: config as Prisma.InputJsonValue,
        name: CARD_SLOT_TITLES[cardSlot],
      },
    });
    results.push(updated);
  }
  return results;
}

export async function createAllModeTemplatesForMerchant(input: {
  merchantId: string;
  activeMode: LoyaltyMode;
  backgroundUrl?: string | null;
  authorId?: string | null;
  duplicateToAll?: boolean;
}) {
  const backgroundUrl = input.backgroundUrl ?? null;
  const results = [];

  for (const cardSlot of ALL_MERCHANT_CARD_SLOTS) {
    const existing = await prisma.merchantCardTemplate.findFirst({
      where: { merchantId: input.merchantId, cardSlot },
    });
    if (existing) {
      results.push(existing);
      continue;
    }

    const duplicateDesign =
      Boolean(backgroundUrl) &&
      (input.duplicateToAll || cardSlot === "GENERAL" || cardSlot === cardSlotForLoyaltyMode(input.activeMode));
    const config = duplicateDesign
      ? defaultTemplateConfigForSlot(backgroundUrl!, cardSlot)
      : defaultTemplateConfigForSlot("", cardSlot);

    const created = await prisma.merchantCardTemplate.create({
      data: {
        merchantId: input.merchantId,
        cardSlot,
        loyaltyMode: loyaltyModeForCardSlot(cardSlot),
        name: CARD_SLOT_TITLES[cardSlot],
        backgroundUrl: duplicateDesign ? backgroundUrl : null,
        config: config as Prisma.InputJsonValue,
        status: "DRAFT",
        isDefault: cardSlot === cardSlotForLoyaltyMode(input.activeMode),
        authorId: input.authorId ?? null,
      },
    });
    results.push(created);
  }
  return results;
}

export async function resetDraftForSlot(merchantId: string, cardSlot: MerchantCardSlot) {
  const draft = await prisma.merchantCardTemplate.findFirst({
    where: { merchantId, cardSlot, status: "DRAFT" },
  });
  if (!draft) return null;

  const emptyConfig = freshDraftConfigForSlot(cardSlot);
  return prisma.merchantCardTemplate.update({
    where: { id: draft.id },
    data: {
      backgroundUrl: null,
      config: emptyConfig as Prisma.InputJsonValue,
      version: { increment: 1 },
    },
  });
}

export async function restoreDraftFromPublished(merchantId: string, cardSlot: MerchantCardSlot) {
  const published = await prisma.merchantCardTemplate.findFirst({
    where: { merchantId, cardSlot, status: "PUBLISHED" },
    orderBy: [{ publishedAt: "desc" }, { version: "desc" }],
  });
  if (!published) return { error: "no_published" as const, template: null };

  let draft = await prisma.merchantCardTemplate.findFirst({
    where: { merchantId, cardSlot, status: "DRAFT" },
  });

  const config = normalizeCardTemplateForSlot(
    published.config as CardTemplateConfig,
    cardSlot,
  );

  if (draft) {
    const updated = await prisma.merchantCardTemplate.update({
      where: { id: draft.id },
      data: {
        backgroundUrl: published.backgroundUrl,
        config: config as Prisma.InputJsonValue,
        version: { increment: 1 },
      },
    });
    return { error: null, template: updated };
  }

  draft = await prisma.merchantCardTemplate.create({
    data: {
      merchantId,
      cardSlot,
      loyaltyMode: loyaltyModeForCardSlot(cardSlot),
      name: CARD_SLOT_TITLES[cardSlot],
      backgroundUrl: published.backgroundUrl,
      config: config as Prisma.InputJsonValue,
      status: "DRAFT",
      authorId: published.authorId,
    },
  });
  return { error: null, template: draft };
}
