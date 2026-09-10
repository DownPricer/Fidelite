import { requireMutatingRequest, requireSuperAdmin } from "@/lib/api-guard";
import { writeAudit } from "@/lib/audit";
import { cardTemplateConfigSchema } from "@/lib/card-template-schema";
import { clientIp, jsonError, jsonOk, readJson, userAgent } from "@/lib/http";
import {
  ALL_MERCHANT_CARD_SLOTS,
  adaptTemplateConfigForCardSlot,
  applySharedBackgroundToModeTemplates,
  summarizeTemplateForSlot,
} from "@/lib/merchant-card-template-service";
import { loyaltyModeForCardSlot } from "@/lib/merchant-card-slots";
import type { LoyaltyMode, MerchantCardSlot } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { cardTemplateSaveSchema, zodErrorMessage } from "@/lib/super-admin-validation";

export async function GET(req: Request) {
  const admin = await requireSuperAdmin(req);
  if (admin.error) return admin.error;

  const url = new URL(req.url);
  const merchantId = url.searchParams.get("merchantId")?.trim();
  if (!merchantId) return jsonError("merchantId requis.", 400);

  const [templates, program] = await Promise.all([
    prisma.merchantCardTemplate.findMany({
      where: { merchantId },
      orderBy: [{ isDefault: "desc" }, { updatedAt: "desc" }],
    }),
    prisma.loyaltyProgram.findUnique({ where: { merchantId }, select: { mode: true } }),
  ]);

  const summaries = ALL_MERCHANT_CARD_SLOTS.map((cardSlot) =>
    summarizeTemplateForSlot(templates, cardSlot, program?.mode ?? null),
  );

  return jsonOk({ templates, summaries });
}

export async function POST(req: Request) {
  const csrf = await requireMutatingRequest(req);
  if (csrf.error) return csrf.error;
  const admin = await requireSuperAdmin(req);
  if (admin.error || !admin.user) return admin.error ?? jsonError("Accès refusé.", 403);

  const body = (await readJson<{ merchantId?: string; action?: string } & Record<string, unknown>>(req)) ?? {};
  const merchantId = body.merchantId;
  if (!merchantId) return jsonError("merchantId requis.", 400);

  if (body.action === "apply-shared-background") {
    const backgroundUrl = typeof body.backgroundUrl === "string" ? body.backgroundUrl : "";
    const activeMode = body.activeMode as LoyaltyMode | undefined;
    if (!backgroundUrl || !activeMode) {
      return jsonError("backgroundUrl et activeMode requis.", 400);
    }
    const templates = await applySharedBackgroundToModeTemplates({
      merchantId,
      activeMode,
      backgroundUrl,
      duplicateToAll: Boolean(body.duplicateToAll),
      authorId: admin.user.id,
    });
    return jsonOk({ templates });
  }

  const parsed = cardTemplateSaveSchema.safeParse(body);
  if (!parsed.success) return jsonError(zodErrorMessage(parsed.error));

  const configParsed = cardTemplateConfigSchema.safeParse(parsed.data.config);
  if (!configParsed.success) return jsonError(zodErrorMessage(configParsed.error));

  const cardSlot = parsed.data.cardSlot as MerchantCardSlot;
  const previewMode =
    (await prisma.loyaltyProgram.findUnique({ where: { merchantId }, select: { mode: true } }))?.mode ??
    "VISITS";

  const existingDraft = await prisma.merchantCardTemplate.findFirst({
    where: { merchantId, cardSlot, status: "DRAFT" },
  });

  if (parsed.data.isDefault) {
    await prisma.merchantCardTemplate.updateMany({
      where: { merchantId, cardSlot },
      data: { isDefault: false },
    });
  }

  const normalizedConfig = adaptTemplateConfigForCardSlot(
    configParsed.data,
    cardSlot,
    previewMode,
  );

  const template = existingDraft
    ? await prisma.merchantCardTemplate.update({
        where: { id: existingDraft.id },
        data: {
          name: parsed.data.name ?? existingDraft.name,
          backgroundUrl: parsed.data.backgroundUrl ?? null,
          config: normalizedConfig,
          isDefault: parsed.data.isDefault ?? existingDraft.isDefault,
        },
      })
    : await prisma.merchantCardTemplate.create({
        data: {
          merchantId,
          cardSlot,
          loyaltyMode: loyaltyModeForCardSlot(cardSlot),
          name: parsed.data.name ?? "Gabarit principal",
          backgroundUrl: parsed.data.backgroundUrl ?? null,
          config: normalizedConfig,
          status: "DRAFT",
          authorId: admin.user.id,
          isDefault: parsed.data.isDefault ?? false,
        },
      });

  await writeAudit({
    actorId: admin.user.id,
    merchantId,
    action: "CARD_TEMPLATE_DRAFT",
    metadata: { templateId: template.id, cardSlot, version: template.version },
    ip: clientIp(req),
    userAgent: userAgent(req),
  });

  return jsonOk({ template }, 201);
}
