import { requireMutatingRequest, requireUser } from "@/lib/api-guard";
import { deleteAvatarFiles, saveAvatar } from "@/lib/avatar-storage";
import { serializeProfile } from "@/lib/customer-profile";
import { writeAudit } from "@/lib/audit";
import { clientIp, jsonError, jsonOk, readJson, userAgent } from "@/lib/http";
import { prisma } from "@/lib/prisma";
import { avatarUploadSchema, zodErrorMessage } from "@/lib/validation";

export async function POST(req: Request) {
  const csrf = await requireMutatingRequest(req);
  if (csrf.error) return csrf.error;
  const auth = await requireUser(req);
  if (auth.error || !auth.user) return auth.error ?? jsonError("Connexion requise.", 401);

  const parsed = avatarUploadSchema.safeParse(await readJson(req));
  if (!parsed.success) return jsonError(zodErrorMessage(parsed.error));

  try {
    const avatarUrl = await saveAvatar(auth.user.id, parsed.data.dataUrl);
    const updated = await prisma.user.update({
      where: { id: auth.user.id },
      data: { avatarUrl },
    });
    await writeAudit({
      actorId: auth.user.id,
      action: "PROFILE_AVATAR_UPDATED",
      ip: clientIp(req),
      userAgent: userAgent(req),
    });
    return jsonOk({ profile: serializeProfile(updated) });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Enregistrement impossible.";
    return jsonError(message);
  }
}

export async function DELETE(req: Request) {
  const csrf = await requireMutatingRequest(req);
  if (csrf.error) return csrf.error;
  const auth = await requireUser(req);
  if (auth.error || !auth.user) return auth.error ?? jsonError("Connexion requise.", 401);

  await deleteAvatarFiles(auth.user.id);
  const updated = await prisma.user.update({
    where: { id: auth.user.id },
    data: { avatarUrl: null },
  });
  await writeAudit({
    actorId: auth.user.id,
    action: "PROFILE_AVATAR_DELETED",
    ip: clientIp(req),
    userAgent: userAgent(req),
  });
  return jsonOk({ profile: serializeProfile(updated) });
}
