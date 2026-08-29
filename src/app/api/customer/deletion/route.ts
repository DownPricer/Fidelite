import { requireMutatingRequest, requireUser } from "@/lib/api-guard";
import { writeAudit } from "@/lib/audit";
import { clientIp, jsonError, jsonOk, readJson, userAgent } from "@/lib/http";
import { prisma } from "@/lib/prisma";
import { deletionRequestSchema, zodErrorMessage } from "@/lib/validation";

export async function POST(req: Request) {
  const csrf = await requireMutatingRequest(req);
  if (csrf.error) return csrf.error;
  const auth = await requireUser(req);
  if (auth.error || !auth.user) return auth.error ?? jsonError("Connexion requise.", 401);

  const parsed = deletionRequestSchema.safeParse((await readJson(req)) ?? {});
  if (!parsed.success) return jsonError(zodErrorMessage(parsed.error));

  await prisma.accountDeletionRequest.create({
    data: {
      userId: auth.user.id,
      message: parsed.data.message,
    },
  });
  await writeAudit({
    actorId: auth.user.id,
    action: "ACCOUNT_DELETION_REQUEST",
    ip: clientIp(req),
    userAgent: userAgent(req),
  });

  return jsonOk({ ok: true });
}
