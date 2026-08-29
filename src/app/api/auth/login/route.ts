import { requireMutatingRequest } from "@/lib/api-guard";
import { writeAudit } from "@/lib/audit";
import { clientIp, jsonError, jsonOk, readJson, userAgent } from "@/lib/http";
import { LIMITS, rateLimit } from "@/lib/rate-limit";
import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/password";
import { createSession } from "@/lib/session";
import { loginSchema, zodErrorMessage } from "@/lib/validation";

export async function POST(req: Request) {
  const csrf = await requireMutatingRequest(req);
  if (csrf.error) return csrf.error;

  const body = await readJson<unknown>(req);
  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError(zodErrorMessage(parsed.error));
  }

  const ip = clientIp(req);
  const limited = rateLimit(`login:${ip}:${parsed.data.email}`, LIMITS.login.limit, LIMITS.login.windowMs);
  if (!limited.ok) {
    return jsonError("Trop de tentatives. Réessayez plus tard.", 429);
  }

  const user = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  const valid = user ? await verifyPassword(parsed.data.password, user.passwordHash) : false;
  if (!user || !user.isActive || !valid) {
    return jsonError("Identifiants incorrects.", 401);
  }

  await createSession(user.id, { ip, userAgent: userAgent(req) });
  await writeAudit({
    actorId: user.id,
    action: "LOGIN",
    ip,
    userAgent: userAgent(req),
  });

  return jsonOk({
    ok: true,
    user: {
      id: user.id,
      firstName: user.firstName,
      email: user.email,
      platformRole: user.platformRole,
      mustChangePassword: user.mustChangePassword,
    },
  });
}
