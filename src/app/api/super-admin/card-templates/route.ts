import { requireMutatingRequest, requireSuperAdmin } from "@/lib/api-guard";
import { writeAudit } from "@/lib/audit";
import { cardTemplateConfigSchema } from "@/lib/card-template-schema";
import { clientIp, jsonError, jsonOk, readJson, userAgent } from "@/lib/http";
import { prisma } from "@/lib/prisma";
import { cardTemplateSaveSchema, zodErrorMessage } from "@/lib/super-admin-validation";

export async function GET(req: Request) {
  const admin = await requireSuperAdmin(req);
  if (admin.error) return admin.error;

  const url = new URL(req.url);
  const merchantId = url.searchParams.get("merchantId")?.trim();
  if (!merchantId) return jsonError("merchantId requis.", 400);

  const templates = await prisma.merchantCardTemplate.findMany({
    where: { merchantId },
    orderBy: [{ isDefault: "desc" }, { updatedAt: "desc" }],
  });

  return jsonOk({ templates });
}

export async function POST(req: Request) {
  const csrf = await requireMutatingRequest(req);
  if (csrf.error) return csrf.error;
  const admin = await requireSuperAdmin(req);
  if (admin.error || !admin.user) return admin.error ?? jsonError("Accès refusé.", 403);

  const body = (await readJson<{ merchantId?: string } & Record<string, unknown>>(req)) ?? {};
  const merchantId = body.merchantId;
  if (!merchantId) return jsonError("merchantId requis.", 400);

  const parsed = cardTemplateSaveSchema.safeParse(body);
  if (!parsed.success) return jsonError(zodErrorMessage(parsed.error));

  const configParsed = cardTemplateConfigSchema.safeParse(parsed.data.config);
  if (!configParsed.success) return jsonError(zodErrorMessage(configParsed.error));

  if (parsed.data.isDefault) {
    await prisma.merchantCardTemplate.updateMany({
      where: { merchantId },
      data: { isDefault: false },
    });
  }

  const template = await prisma.merchantCardTemplate.create({
    data: {
      merchantId,
      name: parsed.data.name ?? "Gabarit principal",
      loyaltyMode: parsed.data.loyaltyMode,
      backgroundUrl: parsed.data.backgroundUrl ?? null,
      config: configParsed.data,
      status: "DRAFT",
      authorId: admin.user.id,
      isDefault: parsed.data.isDefault ?? false,
    },
  });

  await writeAudit({
    actorId: admin.user.id,
    merchantId,
    action: "CARD_TEMPLATE_DRAFT",
    metadata: { templateId: template.id, version: template.version },
    ip: clientIp(req),
    userAgent: userAgent(req),
  });

  return jsonOk({ template }, 201);
}
