import { requireMutatingRequest } from "@/lib/api-guard";
import { writeAudit } from "@/lib/audit";
import { authenticateCustomerWithPassword } from "@/lib/customer-auth";
import { clientIp, jsonError, jsonOk, readJson, userAgent } from "@/lib/http";
import { LIMITS, rateLimit } from "@/lib/rate-limit";
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
  const limited = rateLimit(`customer-login:${ip}:${parsed.data.email}`, LIMITS.login.limit, LIMITS.login.windowMs);
  if (!limited.ok) {
    return jsonError("Trop de tentatives. Réessayez plus tard.", 429);
  }

  const meta = { ip, userAgent: userAgent(req) };
  const result = await authenticateCustomerWithPassword(parsed.data.email, parsed.data.password, meta);
  if (!result.ok) {
    return jsonError(result.error, result.status);
  }

  await writeAudit({ actorId: result.userId, action: "CUSTOMER_LOGIN", ip, userAgent: meta.userAgent });

  return jsonOk({ ok: true, redirectTo: result.redirectTo });
}
