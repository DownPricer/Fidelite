import { requireMutatingRequest, requireUser } from "@/lib/api-guard";
import { writeAudit } from "@/lib/audit";
import { clientIp, jsonError, jsonOk, readJson, userAgent } from "@/lib/http";
import { verifyPassword } from "@/lib/password";
import { prisma } from "@/lib/prisma";
import { serializeProfile } from "@/lib/customer-profile";
import { emailChangeSchema, zodErrorMessage } from "@/lib/validation";

export async function POST(req: Request) {
  const csrf = await requireMutatingRequest(req);
  if (csrf.error) return csrf.error;
  const auth = await requireUser(req);
  if (auth.error || !auth.user) return auth.error ?? jsonError("Connexion requise.", 401);

  const parsed = emailChangeSchema.safeParse(await readJson(req));
  if (!parsed.success) return jsonError(zodErrorMessage(parsed.error));

  const user = await prisma.user.findUnique({ where: { id: auth.user.id } });
  if (!user || !(await verifyPassword(parsed.data.password, user.passwordHash))) {
    return jsonError("Mot de passe incorrect.", 401);
  }

  if (parsed.data.newEmail === user.email) {
    return jsonError("Cette adresse est déjà votre e-mail actuel.");
  }

  const taken = await prisma.user.findUnique({ where: { email: parsed.data.newEmail } });
  if (taken) return jsonError("Cette adresse est déjà utilisée.");

  const updated = await prisma.user.update({
    where: { id: user.id },
    data: { pendingEmail: parsed.data.newEmail },
  });

  await writeAudit({
    actorId: user.id,
    action: "EMAIL_CHANGE_REQUESTED",
    metadata: { pendingEmail: parsed.data.newEmail },
    ip: clientIp(req),
    userAgent: userAgent(req),
  });

  return jsonOk({
    profile: serializeProfile(updated),
    status: "pending_verification",
    message:
      "Un lien de vérification sera envoyé à la nouvelle adresse. L'ancienne adresse reste active tant que la vérification n'est pas terminée.",
    emailVerificationAvailable: false,
  });
}
