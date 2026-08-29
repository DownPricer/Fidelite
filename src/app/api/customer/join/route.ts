import { requireMutatingRequest, requireUser } from "@/lib/api-guard";
import { writeAudit } from "@/lib/audit";
import { clientIp, jsonError, jsonOk, readJson, userAgent } from "@/lib/http";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const schema = z.object({ slug: z.string().min(1) });

export async function POST(req: Request) {
  const csrf = await requireMutatingRequest(req);
  if (csrf.error) return csrf.error;
  const auth = await requireUser(req);
  if (auth.error || !auth.user) return auth.error ?? jsonError("Connexion requise.", 401);

  const parsed = schema.safeParse(await readJson(req));
  if (!parsed.success) return jsonError("Commerce manquant.");

  const merchant = await prisma.merchant.findUnique({ where: { slug: parsed.data.slug } });
  if (!merchant || !merchant.isActive) return jsonError("Commerce introuvable.", 404);

  await prisma.customerMembership.upsert({
    where: { userId_merchantId: { userId: auth.user.id, merchantId: merchant.id } },
    update: {},
    create: { userId: auth.user.id, merchantId: merchant.id },
  });
  await writeAudit({
    actorId: auth.user.id,
    merchantId: merchant.id,
    action: "CUSTOMER_JOIN",
    ip: clientIp(req),
    userAgent: userAgent(req),
  });

  return jsonOk({ ok: true });
}
