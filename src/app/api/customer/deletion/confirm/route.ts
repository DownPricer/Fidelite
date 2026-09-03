import { requireMutatingRequest, requireUser } from "@/lib/api-guard";
import { writeAudit } from "@/lib/audit";
import { deleteAvatarFiles } from "@/lib/avatar-storage";
import { clientIp, jsonError, jsonOk, readJson, userAgent } from "@/lib/http";
import { verifyPassword } from "@/lib/password";
import { prisma } from "@/lib/prisma";
import { destroySession } from "@/lib/session";
import { deletionConfirmSchema, zodErrorMessage } from "@/lib/validation";

export async function POST(req: Request) {
  const csrf = await requireMutatingRequest(req);
  if (csrf.error) return csrf.error;
  const auth = await requireUser(req);
  if (auth.error || !auth.user) return auth.error ?? jsonError("Connexion requise.", 401);

  const parsed = deletionConfirmSchema.safeParse(await readJson(req));
  if (!parsed.success) return jsonError(zodErrorMessage(parsed.error));

  const user = await prisma.user.findUnique({ where: { id: auth.user.id } });
  if (!user || !(await verifyPassword(parsed.data.password, user.passwordHash))) {
    return jsonError("Mot de passe incorrect.", 401);
  }

  await prisma.$transaction(async (tx) => {
    await tx.accountDeletionRequest.create({
      data: {
        userId: user.id,
        message: "Suppression définitive demandée par l'utilisateur.",
        status: "PENDING",
      },
    });
    await tx.user.update({
      where: { id: user.id },
      data: { isActive: false },
    });
    await tx.session.deleteMany({ where: { userId: user.id } });
  });

  await deleteAvatarFiles(user.id);
  await writeAudit({
    actorId: user.id,
    action: "ACCOUNT_DELETION_CONFIRMED",
    ip: clientIp(req),
    userAgent: userAgent(req),
  });

  await destroySession();

  return jsonOk({
    ok: true,
    redirectTo: "/compte/supprime",
    gracePeriodDays: 14,
    message:
      "Votre compte a été désactivé. Vous disposez de 14 jours pour contacter le support si vous souhaitez annuler cette demande.",
  });
}
