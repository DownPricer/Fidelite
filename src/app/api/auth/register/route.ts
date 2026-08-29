import { requireMutatingRequest } from "@/lib/api-guard";
import { writeAudit } from "@/lib/audit";
import { clientIp, jsonError, jsonOk, readJson, userAgent } from "@/lib/http";
import { hashPassword } from "@/lib/password";
import { prisma } from "@/lib/prisma";
import { LIMITS, rateLimit } from "@/lib/rate-limit";
import { createSession } from "@/lib/session";
import { customerRegisterSchema, zodErrorMessage } from "@/lib/validation";
import { z } from "zod";

const schema = customerRegisterSchema.extend({
  slug: z.string().min(1),
});

export async function POST(req: Request) {
  const csrf = await requireMutatingRequest(req);
  if (csrf.error) return csrf.error;

  const body = await readJson<unknown>(req);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return jsonError(zodErrorMessage(parsed.error));
  }

  const ip = clientIp(req);
  const limited = rateLimit(`register:${ip}`, LIMITS.register.limit, LIMITS.register.windowMs);
  if (!limited.ok) {
    return jsonError("Trop d'inscriptions. Réessayez plus tard.", 429);
  }

  const merchant = await prisma.merchant.findUnique({
    where: { slug: parsed.data.slug },
    include: { program: true },
  });
  if (!merchant || !merchant.isActive || !merchant.program) {
    return jsonError("Commerce introuvable.", 404);
  }

  const existing = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  if (existing) {
    const alreadyMember = await prisma.customerMembership.findUnique({
      where: { userId_merchantId: { userId: existing.id, merchantId: merchant.id } },
    });
    if (alreadyMember) {
      return jsonError("Un compte existe déjà avec cet e-mail.", 409);
    }
    return jsonError("Un compte existe déjà avec cet e-mail. Connectez-vous pour rejoindre ce commerce.", 409);
  }

  const user = await prisma.user.create({
    data: {
      email: parsed.data.email,
      passwordHash: await hashPassword(parsed.data.password),
      firstName: parsed.data.firstName,
      privacyConsentAt: new Date(),
      customerMemberships: {
        create: { merchantId: merchant.id },
      },
    },
  });

  await createSession(user.id, { ip, userAgent: userAgent(req) });
  await writeAudit({
    actorId: user.id,
    merchantId: merchant.id,
    action: "CUSTOMER_REGISTER",
    ip,
    userAgent: userAgent(req),
  });

  return jsonOk({
    ok: true,
    slug: merchant.slug,
  }, 201);
}
