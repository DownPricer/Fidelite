import { requireMutatingRequest, requireSuperAdmin } from "@/lib/api-guard";
import { writeAudit } from "@/lib/audit";
import { clientIp, jsonOk, userAgent } from "@/lib/http";
import { destroySuperAdminSession, superAdminTokenFromRequest } from "@/lib/super-admin-session";

export async function POST(req: Request) {
  const csrf = await requireMutatingRequest(req);
  if (csrf.error) return csrf.error;
  const admin = await requireSuperAdmin(req);
  const token = superAdminTokenFromRequest(req);
  await destroySuperAdminSession(token ?? undefined);
  if (admin.user) {
    await writeAudit({
      actorId: admin.user.id,
      action: "SUPER_ADMIN_LOGOUT",
      ip: clientIp(req),
      userAgent: userAgent(req),
    });
  }
  return jsonOk({ ok: true });
}
