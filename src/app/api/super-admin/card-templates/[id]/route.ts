import type { LoyaltyMode } from "@prisma/client";

import { requireMutatingRequest, requireSuperAdmin } from "@/lib/api-guard";
import { writeAudit } from "@/lib/audit";
import { cardTemplateConfigSchema } from "@/lib/card-template-schema";
import { validateCardTemplateForPublishDetailed } from "@/lib/card-template-validation";
import { clientIp, jsonError, jsonOk, readJson, userAgent } from "@/lib/http";
import {
  adaptTemplateConfigForLoyaltyMode,
  duplicateTemplateToModes,
} from "@/lib/merchant-card-template-service";
import { prisma } from "@/lib/prisma";
import { cardTemplateSaveSchema, zodErrorMessage } from "@/lib/super-admin-validation";

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> },
) {
  const csrf = await requireMutatingRequest(req);
  if (csrf.error) return csrf.error;
  const admin = await requireSuperAdmin(req);
  if (admin.error || !admin.user) return admin.error ?? jsonError("Accès refusé.", 403);
  const { id } = await context.params;

  const body = (await readJson<Record<string, unknown>>(req)) ?? {};
  const action = body.action as string | undefined;

  const existing = await prisma.merchantCardTemplate.findUnique({ where: { id } });
  if (!existing) return jsonError("Gabarit introuvable.", 404);

  if (action === "publish") {
    const configParsed = cardTemplateConfigSchema.safeParse(existing.config);
    if (!configParsed.success) return jsonError("Configuration invalide.");
    const publishValidation = validateCardTemplateForPublishDetailed(
      configParsed.data,
      existing.loyaltyMode,
    );
    if (!publishValidation.ok) {
      return jsonError(publishValidation.errors.map((e) => e.message).join(" "));
    }

    const updated = await prisma.$transaction(async (tx) => {
      await tx.merchantCardTemplate.updateMany({
        where: {
          merchantId: existing.merchantId,
          loyaltyMode: existing.loyaltyMode,
          status: "PUBLISHED",
        },
        data: { status: "ARCHIVED" },
      });
      const next = await tx.merchantCardTemplate.update({
        where: { id },
        data: {
          status: "PUBLISHED",
          publishedAt: new Date(),
          version: { increment: 1 },
        },
      });
      await tx.merchantCardTemplateVersion.create({
        data: {
          templateId: id,
          version: next.version,
          config: configParsed.data,
          backgroundUrl: existing.backgroundUrl,
          authorId: admin.user!.id,
        },
      });
      return next;
    });

    await writeAudit({
      actorId: admin.user.id,
      merchantId: existing.merchantId,
      action: "CARD_TEMPLATE_PUBLISH",
      metadata: { templateId: id, version: updated.version },
      ip: clientIp(req),
      userAgent: userAgent(req),
    });

    return jsonOk({ template: updated });
  }

  if (action === "restore-previous") {
    const previous = await prisma.merchantCardTemplateVersion.findFirst({
      where: { templateId: id },
      orderBy: { version: "desc" },
      skip: 1,
    });
    if (!previous) return jsonError("Aucune version précédente.", 404);

    const updated = await prisma.merchantCardTemplate.update({
      where: { id },
      data: {
        config: previous.config ?? undefined,
        backgroundUrl: previous.backgroundUrl,
        status: "DRAFT",
        version: { increment: 1 },
      },
    });

    await writeAudit({
      actorId: admin.user.id,
      merchantId: existing.merchantId,
      action: "CARD_TEMPLATE_RESTORE",
      metadata: { templateId: id, restoredVersion: previous.version },
      ip: clientIp(req),
      userAgent: userAgent(req),
    });

    return jsonOk({ template: updated });
  }

  if (action === "archive") {
    const updated = await prisma.merchantCardTemplate.update({
      where: { id },
      data: { status: "ARCHIVED" },
    });
    return jsonOk({ template: updated });
  }

  if (action === "duplicate") {
    const duplicate = await prisma.merchantCardTemplate.create({
      data: {
        merchantId: existing.merchantId,
        loyaltyMode: existing.loyaltyMode,
        name: `${existing.name} (copie)`,
        backgroundUrl: existing.backgroundUrl,
        config: existing.config ?? {},
        status: "DRAFT",
        authorId: admin.user.id,
      },
    });
    return jsonOk({ template: duplicate }, 201);
  }

  if (action === "duplicate-to-modes") {
    const targetModes = body.targetModes as LoyaltyMode[] | undefined;
    if (!Array.isArray(targetModes) || targetModes.length === 0) {
      return jsonError("Sélectionnez au moins un mode cible.", 400);
    }
    const created = await duplicateTemplateToModes(id, targetModes, admin.user.id);
    return jsonOk({ templates: created }, 201);
  }

  const parsed = cardTemplateSaveSchema.safeParse(body);
  if (!parsed.success) return jsonError(zodErrorMessage(parsed.error));
  const configParsed = cardTemplateConfigSchema.safeParse(parsed.data.config);
  if (!configParsed.success) return jsonError(zodErrorMessage(configParsed.error));

  if (parsed.data.loyaltyMode !== existing.loyaltyMode) {
    return jsonError("Le mode de fidélité du gabarit ne peut pas être modifié depuis l’éditeur.", 400);
  }

  const normalizedConfig = adaptTemplateConfigForLoyaltyMode(
    configParsed.data,
    existing.loyaltyMode,
  );

  const updated = await prisma.merchantCardTemplate.update({
    where: { id },
    data: {
      name: parsed.data.name,
      backgroundUrl: parsed.data.backgroundUrl,
      config: normalizedConfig,
      isDefault: parsed.data.isDefault,
    },
  });

  await writeAudit({
    actorId: admin.user.id,
    merchantId: existing.merchantId,
    action: "CARD_TEMPLATE_UPDATE",
    metadata: { templateId: id },
    ip: clientIp(req),
    userAgent: userAgent(req),
  });

  return jsonOk({ template: updated });
}
