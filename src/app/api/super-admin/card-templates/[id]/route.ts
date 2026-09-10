import type { MerchantCardSlot } from "@prisma/client";

import { requireMutatingRequest, requireSuperAdmin } from "@/lib/api-guard";
import { writeAudit } from "@/lib/audit";
import { cardTemplateConfigSchema } from "@/lib/card-template-schema";
import { validateCardTemplateForPublishDetailed } from "@/lib/card-template-validation";
import { clientIp, jsonError, jsonOk, readJson, userAgent } from "@/lib/http";
import {
  adaptTemplateConfigForCardSlot,
  duplicateTemplateToSlots,
  resetDraftForSlot,
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

  const program = await prisma.loyaltyProgram.findUnique({
    where: { merchantId: existing.merchantId },
    select: { mode: true },
  });
  const previewMode = program?.mode ?? "VISITS";

  if (action === "publish") {
    const configParsed = cardTemplateConfigSchema.safeParse(existing.config);
    if (!configParsed.success) return jsonError("Configuration invalide.");
    const publishValidation = validateCardTemplateForPublishDetailed(
      configParsed.data,
      existing.cardSlot,
    );
    if (!publishValidation.ok) {
      return jsonError(publishValidation.errors.map((e) => e.message).join(" "));
    }

    const updated = await prisma.$transaction(async (tx) => {
      await tx.merchantCardTemplate.updateMany({
        where: {
          merchantId: existing.merchantId,
          cardSlot: existing.cardSlot,
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
      metadata: { templateId: id, cardSlot: existing.cardSlot, version: updated.version },
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

  if (action === "reset-draft") {
    const updated = await resetDraftForSlot(existing.merchantId, existing.cardSlot);
    if (!updated) return jsonError("Aucun brouillon à réinitialiser.", 404);
    return jsonOk({ template: updated });
  }

  if (action === "duplicate") {
    const duplicate = await prisma.merchantCardTemplate.create({
      data: {
        merchantId: existing.merchantId,
        cardSlot: existing.cardSlot,
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

  if (action === "duplicate-to-slots" || action === "duplicate-to-modes") {
    const targetSlots = (body.targetSlots ?? body.targetModes) as MerchantCardSlot[] | undefined;
    if (!Array.isArray(targetSlots) || targetSlots.length === 0) {
      return jsonError("Sélectionnez au moins un emplacement cible.", 400);
    }
    try {
      const created = await duplicateTemplateToSlots(id, targetSlots, admin.user.id);
      return jsonOk({ templates: created }, 201);
    } catch (error) {
      return jsonError(error instanceof Error ? error.message : "Duplication impossible.", 409);
    }
  }

  const parsed = cardTemplateSaveSchema.safeParse(body);
  if (!parsed.success) return jsonError(zodErrorMessage(parsed.error));
  const configParsed = cardTemplateConfigSchema.safeParse(parsed.data.config);
  if (!configParsed.success) return jsonError(zodErrorMessage(configParsed.error));

  if (parsed.data.cardSlot !== existing.cardSlot) {
    return jsonError("L’emplacement de la carte ne peut pas être modifié depuis l’éditeur.", 400);
  }

  const normalizedConfig = adaptTemplateConfigForCardSlot(
    configParsed.data,
    existing.cardSlot,
    previewMode,
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
    metadata: { templateId: id, cardSlot: existing.cardSlot },
    ip: clientIp(req),
    userAgent: userAgent(req),
  });

  return jsonOk({ template: updated });
}
