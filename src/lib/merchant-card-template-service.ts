import type { CardTemplateStatus, LoyaltyMode, Prisma } from "@prisma/client";

import type { CardTemplateConfig } from "./card-template-schema";
import { defaultCardTemplateConfig } from "./card-template-schema";
import { prisma } from "./prisma";
import { normalizePublishedWalletTemplate, type PublishedWalletTemplate } from "./wallet-card-template";

export const ALL_LOYALTY_MODES: LoyaltyMode[] = [
  "VISITS",
  "POINTS_BY_AMOUNT",
  "FIXED_POINTS",
  "AMOUNT_TIERS",
];

/** Titres affichés dans le super-admin et l’éditeur. */
export const LOYALTY_MODE_CARD_TITLES: Record<LoyaltyMode, string> = {
  VISITS: "Carte par passages",
  POINTS_BY_AMOUNT: "Carte points selon le montant",
  FIXED_POINTS: "Carte points fixes par achat",
  AMOUNT_TIERS: "Carte par paliers de montant",
};

export type MerchantCardTemplateSummary = {
  loyaltyMode: LoyaltyMode;
  title: string;
  templateId: string | null;
  status: "unconfigured" | "DRAFT" | "PUBLISHED" | "ARCHIVED";
  version: number | null;
  backgroundUrl: string | null;
  updatedAt: string | null;
  publishedAt: string | null;
  isActiveProgramMode: boolean;
};

export type ResolvedPublishedCardTemplate = {
  id: string;
  backgroundUrl: string | null;
  config: CardTemplateConfig;
  loyaltyMode: LoyaltyMode;
  version: number;
};

function isPointsMode(mode: LoyaltyMode) {
  return mode !== "VISITS";
}

/** Adapte les éléments dynamiques au mode sans figer de valeurs fictives. */
export function adaptTemplateConfigForLoyaltyMode(
  config: CardTemplateConfig,
  mode: LoyaltyMode,
): CardTemplateConfig {
  const pointsMode = isPointsMode(mode);
  return {
    ...config,
    elements: config.elements.map((element) => {
      if (element.type === "visitsCount") {
        return { ...element, hidden: pointsMode };
      }
      if (element.type === "pointsBalance") {
        return { ...element, hidden: !pointsMode };
      }
      return element;
    }),
  };
}

export function defaultTemplateConfigForMode(
  backgroundUrl: string,
  mode: LoyaltyMode,
): CardTemplateConfig {
  return adaptTemplateConfigForLoyaltyMode(defaultCardTemplateConfig(backgroundUrl), mode);
}

function templateRank(status: CardTemplateStatus) {
  if (status === "PUBLISHED") return 3;
  if (status === "DRAFT") return 2;
  return 1;
}

export function pickCanonicalTemplate<
  T extends {
    loyaltyMode: LoyaltyMode;
    status: CardTemplateStatus;
    isDefault: boolean;
    updatedAt: Date | string;
  },
>(templates: T[], loyaltyMode: LoyaltyMode): T | null {
  const matches = templates.filter((template) => template.loyaltyMode === loyaltyMode);
  if (matches.length === 0) return null;
  const updatedAtMs = (value: Date | string) => new Date(value).getTime();
  return [...matches].sort((a, b) => {
    const rank = templateRank(b.status) - templateRank(a.status);
    if (rank !== 0) return rank;
    if (a.isDefault !== b.isDefault) return a.isDefault ? -1 : 1;
    return updatedAtMs(b.updatedAt) - updatedAtMs(a.updatedAt);
  })[0]!;
}

export function summarizeTemplateForMode(
  templates: Array<{
    id: string;
    loyaltyMode: LoyaltyMode;
    status: CardTemplateStatus;
    version: number;
    backgroundUrl: string | null;
    updatedAt: Date;
    publishedAt: Date | null;
    isDefault: boolean;
  }>,
  loyaltyMode: LoyaltyMode,
  activeProgramMode: LoyaltyMode | null,
): MerchantCardTemplateSummary {
  const canonical = pickCanonicalTemplate(templates, loyaltyMode);
  if (!canonical) {
    return {
      loyaltyMode,
      title: LOYALTY_MODE_CARD_TITLES[loyaltyMode],
      templateId: null,
      status: "unconfigured",
      version: null,
      backgroundUrl: null,
      updatedAt: null,
      publishedAt: null,
      isActiveProgramMode: activeProgramMode === loyaltyMode,
    };
  }
  return {
    loyaltyMode,
    title: LOYALTY_MODE_CARD_TITLES[loyaltyMode],
    templateId: canonical.id,
    status: canonical.status,
    version: canonical.version,
    backgroundUrl: canonical.backgroundUrl,
    updatedAt: canonical.updatedAt.toISOString(),
    publishedAt: canonical.publishedAt?.toISOString() ?? null,
    isActiveProgramMode: activeProgramMode === loyaltyMode,
  };
}

/** Sélection canonique du gabarit publié pour un commerce et un mode actif. */
export async function resolvePublishedMerchantCardTemplate(
  merchantId: string,
  activeLoyaltyMode: LoyaltyMode,
): Promise<ResolvedPublishedCardTemplate | null> {
  const template = await prisma.merchantCardTemplate.findFirst({
    where: {
      merchantId,
      loyaltyMode: activeLoyaltyMode,
      status: "PUBLISHED",
    },
    orderBy: [{ isDefault: "desc" }, { publishedAt: "desc" }],
  });
  if (!template) return null;
  return {
    id: template.id,
    backgroundUrl: template.backgroundUrl,
    config: template.config as CardTemplateConfig,
    loyaltyMode: template.loyaltyMode,
    version: template.version,
  };
}

export async function hasPublishedTemplateForMode(merchantId: string, loyaltyMode: LoyaltyMode) {
  const count = await prisma.merchantCardTemplate.count({
    where: { merchantId, loyaltyMode, status: "PUBLISHED" },
  });
  return count > 0;
}

export function normalizeResolvedPublishedTemplate(
  template: ResolvedPublishedCardTemplate | null,
): PublishedWalletTemplate | null {
  if (!template) return null;
  return normalizePublishedWalletTemplate({
    backgroundUrl: template.backgroundUrl,
    config: adaptTemplateConfigForLoyaltyMode(template.config, template.loyaltyMode),
    loyaltyMode: template.loyaltyMode,
  });
}

export async function getEditableTemplateForMode(merchantId: string, loyaltyMode: LoyaltyMode) {
  const templates = await prisma.merchantCardTemplate.findMany({
    where: { merchantId, loyaltyMode },
    orderBy: [{ status: "asc" }, { updatedAt: "desc" }],
  });
  return (
    templates.find((template) => template.status === "DRAFT") ??
    pickCanonicalTemplate(templates, loyaltyMode)
  );
}

export async function ensureDraftTemplateForMode(
  merchantId: string,
  loyaltyMode: LoyaltyMode,
  source?: { backgroundUrl?: string | null; config: CardTemplateConfig },
  authorId?: string | null,
) {
  const existingDraft = await prisma.merchantCardTemplate.findFirst({
    where: { merchantId, loyaltyMode, status: "DRAFT" },
  });
  if (existingDraft) return existingDraft;

  const backgroundUrl = source?.backgroundUrl ?? null;
  const config = source
    ? adaptTemplateConfigForLoyaltyMode(source.config, loyaltyMode)
    : defaultTemplateConfigForMode(backgroundUrl ?? "", loyaltyMode);

  return prisma.merchantCardTemplate.create({
    data: {
      merchantId,
      loyaltyMode,
      name: LOYALTY_MODE_CARD_TITLES[loyaltyMode],
      backgroundUrl,
      config: config as Prisma.InputJsonValue,
      status: "DRAFT",
      authorId: authorId ?? null,
    },
  });
}

export async function duplicateTemplateToModes(
  sourceTemplateId: string,
  targetModes: LoyaltyMode[],
  authorId: string,
) {
  const source = await prisma.merchantCardTemplate.findUnique({ where: { id: sourceTemplateId } });
  if (!source) throw new Error("Gabarit source introuvable.");

  const created = [];
  for (const loyaltyMode of targetModes) {
    if (loyaltyMode === source.loyaltyMode) continue;
    const draft = await ensureDraftTemplateForMode(source.merchantId, loyaltyMode, {
      backgroundUrl: source.backgroundUrl,
      config: source.config as CardTemplateConfig,
    }, authorId);
    created.push(draft);
  }
  return created;
}

export async function applySharedBackgroundToModeTemplates(input: {
  merchantId: string;
  activeMode: LoyaltyMode;
  backgroundUrl: string;
  duplicateToAll: boolean;
  authorId?: string | null;
}) {
  const baseConfig = defaultTemplateConfigForMode(input.backgroundUrl, input.activeMode);
  const results = [];

  for (const loyaltyMode of ALL_LOYALTY_MODES) {
    const duplicateDesign = input.duplicateToAll || loyaltyMode === input.activeMode;
    if (!duplicateDesign) continue;

    const config = adaptTemplateConfigForLoyaltyMode(baseConfig, loyaltyMode);
    const draft = await ensureDraftTemplateForMode(
      input.merchantId,
      loyaltyMode,
      { backgroundUrl: input.backgroundUrl, config },
      input.authorId ?? null,
    );
    const updated = await prisma.merchantCardTemplate.update({
      where: { id: draft.id },
      data: {
        backgroundUrl: input.backgroundUrl,
        config: config as Prisma.InputJsonValue,
        name: LOYALTY_MODE_CARD_TITLES[loyaltyMode],
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
  const baseConfig = backgroundUrl
    ? defaultTemplateConfigForMode(backgroundUrl, input.activeMode)
    : defaultTemplateConfigForMode("", input.activeMode);

  const results = [];
  for (const loyaltyMode of ALL_LOYALTY_MODES) {
    const existing = await prisma.merchantCardTemplate.findFirst({
      where: { merchantId: input.merchantId, loyaltyMode },
    });
    if (existing) {
      results.push(existing);
      continue;
    }

    const duplicateDesign = Boolean(backgroundUrl) && (input.duplicateToAll || loyaltyMode === input.activeMode);
    const config = duplicateDesign
      ? adaptTemplateConfigForLoyaltyMode(baseConfig, loyaltyMode)
      : defaultTemplateConfigForMode(backgroundUrl ?? "", loyaltyMode);

    const created = await prisma.merchantCardTemplate.create({
      data: {
        merchantId: input.merchantId,
        loyaltyMode,
        name: LOYALTY_MODE_CARD_TITLES[loyaltyMode],
        backgroundUrl: duplicateDesign ? backgroundUrl : null,
        config: config as Prisma.InputJsonValue,
        status: "DRAFT",
        isDefault: loyaltyMode === input.activeMode,
        authorId: input.authorId ?? null,
      },
    });
    results.push(created);
  }
  return results;
}
