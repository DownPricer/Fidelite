import { PlatformRole } from "@prisma/client";
import { requireMutatingRequest } from "@/lib/api-guard";
import { writeAudit } from "@/lib/audit";
import {
  createCustomerSession,
  customerPostAuthRedirect,
  sendCustomerFinalizationInvite,
} from "@/lib/customer-onboarding";
import { clientIp, jsonError, jsonOk, readJson, userAgent } from "@/lib/http";
import { hashPassword } from "@/lib/password";
import { prisma } from "@/lib/prisma";
import { LIMITS, rateLimit } from "@/lib/rate-limit";
import { platformCustomerRegisterSchema, zodErrorMessage } from "@/lib/validation";

export async function POST(req: Request) {
  const csrf = await requireMutatingRequest(req);
  if (csrf.error) return csrf.error;

  const body = await readJson<unknown>(req);
  const parsed = platformCustomerRegisterSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError(zodErrorMessage(parsed.error));
  }

  const ip = clientIp(req);
  const limited = rateLimit(`customer-register:${ip}`, LIMITS.register.limit, LIMITS.register.windowMs);
  if (!limited.ok) {
    return jsonError("Trop d'inscriptions. Réessayez plus tard.", 429);
  }

  const existing = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  if (existing) {
    return jsonError(
      "Un compte existe déjà avec cet e-mail. Connectez-vous ou demandez un lien de reprise sécurisé.",
      409,
    );
  }

  const now = new Date();
  const user = await prisma.user.create({
    data: {
      email: parsed.data.email,
      passwordHash: await hashPassword(parsed.data.password),
      firstName: parsed.data.firstName,
      lastName: parsed.data.lastName,
      platformRole: PlatformRole.CUSTOMER,
      privacyConsentAt: now,
      onboardingStartedAt: now,
    },
  });

  await sendCustomerFinalizationInvite(user);
  await createCustomerSession(user.id, { ip, userAgent: userAgent(req) });
  await writeAudit({
    actorId: user.id,
    action: "CUSTOMER_PLATFORM_REGISTER",
    ip,
    userAgent: userAgent(req),
  });

  return jsonOk(
    {
      ok: true,
      redirectTo: customerPostAuthRedirect(user),
      message:
        "Compte créé. Confirmez votre e-mail et complétez votre profil dans les 24 prochaines heures pour conserver l'accès.",
    },
    201,
  );
}
