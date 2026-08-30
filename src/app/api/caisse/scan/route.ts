import { requireCaisse, requireMutatingRequest } from "@/lib/api-guard";
import { writeAudit } from "@/lib/audit";
import { processCaisseScan } from "@/lib/caisse-scan";
import { clientIp, jsonError, jsonOk, readJson, userAgent } from "@/lib/http";
import { publicQrErrorMessage } from "@/lib/qr";
import { LIMITS, rateLimit } from "@/lib/rate-limit";
import { scanSchema, zodErrorMessage } from "@/lib/validation";

export async function POST(req: Request) {
  const csrf = await requireMutatingRequest(req);
  if (csrf.error) return csrf.error;
  const staff = await requireCaisse(req);
  if (staff.error || !staff.user || !staff.membership) return staff.error ?? jsonError("Accès refusé.", 403);

  const parsed = scanSchema.safeParse(await readJson(req));
  if (!parsed.success) return jsonError(zodErrorMessage(parsed.error));

  const limited = rateLimit(`scan:${staff.user.id}`, LIMITS.scan.limit, LIMITS.scan.windowMs);
  if (!limited.ok) return jsonError("Trop de scans. Patientez un instant.", 429);

  try {
    const result = await processCaisseScan({
      token: parsed.data.token,
      merchantId: staff.membership.merchantId,
      actorUserId: staff.user.id,
    });

    await writeAudit({
      actorId: staff.user.id,
      merchantId: staff.membership.merchantId,
      action: "CAISSE_SCAN",
      metadata: { grantId: result.grantId },
      ip: clientIp(req),
      userAgent: userAgent(req),
    });

    return jsonOk(result);
  } catch (error) {
    return jsonError(publicQrErrorMessage(error), 400);
  }
}
