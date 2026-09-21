import { requireMutatingRequest, requireSuperAdmin } from "@/lib/api-guard";
import { writeAudit } from "@/lib/audit";
import { clientIp, jsonError, jsonOk, readJson, userAgent } from "@/lib/http";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const bodySchema = z.object({ enabled: z.boolean() });

export async function PATCH(req: Request, context: { params: Promise<{ id: string }> }) {
  const csrf = await requireMutatingRequest(req);
  if (csrf.error) return csrf.error;
  const admin = await requireSuperAdmin(req);
  if (admin.error || !admin.user) return admin.error ?? jsonError("Accès refusé.", 403);
  const { id } = await context.params;

  const parsed = bodySchema.safeParse(await readJson(req));
  if (!parsed.success) return jsonError("Requête invalide.", 400);

  const merchant = await prisma.merchant.findUnique({ where: { id }, select: { id: true } });
  if (!merchant) return jsonError("Commerce introuvable.", 404);

  const now = new Date();
  const subscription = await prisma.merchantSubscription.upsert({
    where: { merchantId: id },
    update: {
      insightEnabled: parsed.data.enabled,
      insightEnabledAt: parsed.data.enabled ? now : null,
    },
    create: {
      merchantId: id,
      insightEnabled: parsed.data.enabled,
      insightEnabledAt: parsed.data.enabled ? now : null,
    },
  });

  await writeAudit({
    actorId: admin.user.id,
    merchantId: id,
    action: parsed.data.enabled ? "INSIGHT_ENABLED" : "INSIGHT_DISABLED",
    ip: clientIp(req),
    userAgent: userAgent(req),
  });

  return jsonOk({ ok: true, insightEnabled: subscription.insightEnabled });
}
