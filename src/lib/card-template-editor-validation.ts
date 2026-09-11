import type { MerchantCardSlot } from "@prisma/client";
import type { CardTemplateConfig } from "./card-template-schema";
import { validateCardTemplateForPublishDetailed, type PublishValidationResult } from "./card-template-validation";
import {
  createDefaultLoyaltyWidgetElement,
  findLegacyLoyaltyElements,
  LOYALTY_WIDGET_LABELS,
  loyaltyWidgetModeForCardSlot,
  migrateLegacyLoyaltyElements,
  sanitizeLoyaltyWidgetsForSlot,
} from "./loyalty-widget";

export type EditorValidationIssue = {
  message: string;
  elementId?: string;
  elementIds?: string[];
  code?: "legacy_loyalty_elements" | "missing_loyalty_widget" | string;
  autoFix?: "migrate_legacy" | "add_loyalty_widget";
};

export type EditorValidationSummary = {
  ok: boolean;
  issues: EditorValidationIssue[];
};

function dedupeIssues(issues: EditorValidationIssue[]): EditorValidationIssue[] {
  const seen = new Set<string>();
  const result: EditorValidationIssue[] = [];
  for (const issue of issues) {
    const key = issue.code ?? issue.message;
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(issue);
  }
  return result;
}

export function summarizeEditorValidation(
  config: CardTemplateConfig,
  cardSlot: MerchantCardSlot,
): EditorValidationSummary {
  const raw = validateCardTemplateForPublishDetailed(config, cardSlot);
  const issues: EditorValidationIssue[] = raw.errors.map((error) => {
    const issue: EditorValidationIssue = {
      message: error.message,
      elementId: error.elementId,
      elementIds: (error as { elementIds?: string[] }).elementIds,
      code: (error as { code?: string }).code,
    };
    if (issue.code === "legacy_loyalty_elements") {
      issue.autoFix = "migrate_legacy";
    }
    if (issue.code === "missing_loyalty_widget") {
      issue.autoFix = "add_loyalty_widget";
    }
    return issue;
  });

  return { ok: raw.ok, issues: dedupeIssues(issues) };
}

export function applyEditorAutoFix(
  config: CardTemplateConfig,
  cardSlot: MerchantCardSlot,
  fix: EditorValidationIssue["autoFix"],
): CardTemplateConfig {
  if (fix === "migrate_legacy") {
    return sanitizeLoyaltyWidgetsForSlot(config, cardSlot);
  }
  if (fix === "add_loyalty_widget") {
    const widget = createDefaultLoyaltyWidgetElement(
      cardSlot,
      Math.max(...config.elements.map((el) => el.zIndex), 0) + 1,
    );
    if (!widget) return config;
    return sanitizeLoyaltyWidgetsForSlot(
      { ...config, elements: [...config.elements, widget] },
      cardSlot,
    );
  }
  return config;
}

export function migrateLegacyOnLoad(
  config: CardTemplateConfig,
  cardSlot: MerchantCardSlot,
): { config: CardTemplateConfig; migrated: boolean } {
  const legacyBefore = findLegacyLoyaltyElements(config).length;
  const next = sanitizeLoyaltyWidgetsForSlot(config, cardSlot);
  const legacyAfter = findLegacyLoyaltyElements(next).length;
  return {
    config: next,
    migrated: legacyBefore > 0 || legacyAfter < legacyBefore,
  };
}

export function missingWidgetLabel(cardSlot: MerchantCardSlot): string | null {
  const mode = loyaltyWidgetModeForCardSlot(cardSlot);
  return mode ? LOYALTY_WIDGET_LABELS[mode] : null;
}

export function publishValidationResult(
  config: CardTemplateConfig,
  cardSlot: MerchantCardSlot,
): PublishValidationResult {
  return validateCardTemplateForPublishDetailed(config, cardSlot);
}
