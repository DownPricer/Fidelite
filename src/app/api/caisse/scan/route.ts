import { requireCaisse, requireMutatingRequest } from "@/lib/api-guard";
import { processCaisseScan, processCaisseScanByClientNumber } from "@/lib/caisse-scan";
import { normalizeClientNumber } from "@/lib/client-number";
import { writeAudit } from "@/lib/audit";
import { clientIp, jsonError, jsonOk, readJson, userAgent } from "@/lib/http";
import { publicQrErrorMessage } from "@/lib/qr";
import { QrInputError, extractFifeLifeQrToken } from "@/lib/qr-input";
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
  if (!limited.ok) {
    await writeAudit({
      actorId: staff.user.id,
      merchantId: staff.membership.merchantId,
      action: "CAISSE_SCAN_DENIED",
      metadata: { reason: "rate_limit", via: parsed.data.clientNumber ? "clientNumber" : "qr" },
      ip: clientIp(req),
      userAgent: userAgent(req),
    });
    return jsonError("Trop de scans. Patientez un instant.", 429);
  }

  const scanKey = parsed.data.token
    ? `scan-token:${staff.user.id}:${parsed.data.token.slice(0, 32)}`
    : `scan-client:${staff.user.id}:${normalizeClientNumber(parsed.data.clientNumber!)}`;
  const duplicate = rateLimit(scanKey, 1, 2_000);
  if (!duplicate.ok) {
    return jsonError("Scan trop rapproché. Patientez un instant.", 429);
  }

  try {
    const result = parsed.data.clientNumber
      ? await processCaisseScanByClientNumber({
          clientNumber: normalizeClientNumber(parsed.data.clientNumber),
          merchantId: staff.membership.merchantId,
          actorUserId: staff.user.id,
        })
      : await processCaisseScan({
          token: extractFifeLifeQrToken(parsed.data.token!),
          merchantId: staff.membership.merchantId,
          actorUserId: staff.user.id,
        });

    await writeAudit({
      actorId: staff.user.id,
      merchantId: staff.membership.merchantId,
      action: "CAISSE_SCAN",
      metadata: {
        grantId: result.grantId,
        via: parsed.data.clientNumber ? "clientNumber" : "qr",
        method: parsed.data.clientNumber ? "manual_client" : "qr",
        pointsBefore: result.points,
        programMode: result.programMode,
        membershipId: "id" in staff.membership ? staff.membership.id : staff.membership.merchantId,
      },
      ip: clientIp(req),
      userAgent: userAgent(req),
    });

    return jsonOk(result);
  } catch (error) {
    const message = error instanceof QrInputError ? error.message : publicQrErrorMessage(error);
    await writeAudit({
      actorId: staff.user.id,
      merchantId: staff.membership.merchantId,
      action: "CAISSE_SCAN_DENIED",
      metadata: {
        reason: message,
        via: parsed.data.clientNumber ? "clientNumber" : "qr",
        membershipId: "id" in staff.membership ? staff.membership.id : staff.membership.merchantId,
      },
      ip: clientIp(req),
      userAgent: userAgent(req),
    });
    if (error instanceof QrInputError) return jsonError(error.message, 400);
    return jsonError(message, 400);
  }
}
