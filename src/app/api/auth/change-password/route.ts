import { requireMutatingRequest, requireUser } from "@/lib/api-guard";
import { jsonError, jsonOk, readJson } from "@/lib/http";
import { hashPassword, verifyPassword } from "@/lib/password";
import { prisma } from "@/lib/prisma";
import { passwordSchema } from "@/lib/validation";
import { z } from "zod";

const schema = z.object({
  currentPassword: z.string().min(1),
  nextPassword: passwordSchema,
});

export async function POST(req: Request) {
  const csrf = await requireMutatingRequest(req);
  if (csrf.error) return csrf.error;
  const auth = await requireUser(req);
  if (auth.error || !auth.user) return auth.error ?? jsonError("Connexion requise.", 401);

  const parsed = schema.safeParse(await readJson(req));
  if (!parsed.success) return jsonError("Mot de passe invalide.");

  const user = await prisma.user.findUnique({ where: { id: auth.user.id } });
  if (!user || !(await verifyPassword(parsed.data.currentPassword, user.passwordHash))) {
    return jsonError("Mot de passe actuel incorrect.", 401);
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      passwordHash: await hashPassword(parsed.data.nextPassword),
      mustChangePassword: false,
    },
  });

  return jsonOk({ ok: true });
}
