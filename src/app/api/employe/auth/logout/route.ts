import { requireMutatingRequest } from "@/lib/api-guard";
import { writeAudit } from "@/lib/audit";
import { destroyEmployeeSession, getRequestEmployee } from "@/lib/employee-session";
import { clientIp, jsonError, jsonOk, userAgent } from "@/lib/http";

export async function POST(req: Request) {
  const csrf = await requireMutatingRequest(req);
  if (csrf.error) return csrf.error;

  const session = await getRequestEmployee(req);
  if (session) {
    await destroyEmployeeSession();
    await writeAudit({
      actorId: session.user.id,
      merchantId: session.membership.merchantId,
      action: "EMPLOYEE_LOGOUT",
      ip: clientIp(req),
      userAgent: userAgent(req),
    });
  }

  return jsonOk({ ok: true });
}

export async function GET() {
  return jsonError("Méthode non autorisée.", 405);
}
