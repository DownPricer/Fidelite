import { requireCaisse, requireMutatingRequest } from "@/lib/api-guard";
import { processCaisseScan, processCaisseScanByClientNumber } from "@/lib/caisse-scan";
import { CaisseScanError, maskClientNumberForLog } from "@/lib/caisse-scan-errors";
import { normalizeClientNumber } from "@/lib/client-number";
import { writeAudit } from "@/lib/audit";
import { clientIp, jsonError, jsonOk, readJson, userAgent } from "@/lib/http";
import { publicQrErrorMessage } from "@/lib/qr";
import { QrInputError, extractFifeLifeQrToken } from "@/lib/qr-input";
import { LIMITS, rateLimit } from "@/lib/rate-limit";
import { scanSchema, zodErrorMessage } from "@/lib/validation";

function scanVia(input: { inputType: "QR" | "CLIENT_NUMBER" }) {
  return input.inputType === "CLIENT_NUMBER" ? "clientNumber" : "qr";
}

export async function POST(req: Request) {
  const csrf = await requireMutatingRequest(req);
  if (csrf.error) return csrf.error;
  const staff = await requireCaisse(req);
  if (staff.error || !staff.user || !staff.membership) return staff.error ?? jsonError("Accès refusé.", 403);

  const body = await readJson(req);
  const parsed = scanSchema.safeParse(body);
  if (!parsed.success) {
    const inputType =
      body && typeof body === "object" && "inputType" in body ? String(body.inputType) : null;
    const code = inputType === "CLIENT_NUMBER" ? "INVALID_CLIENT_NUMBER" : "INVALID_REQUEST";
    const message =
      inputType === "CLIENT_NUMBER" ? "Numéro client invalide." : zodErrorMessage(parsed.error);
    console.info("[caisse-scan] refus : raison", code);
    return jsonError(message, 400, { code });
  }

  const via = scanVia(parsed.data);

  const limited = rateLimit(`scan:${staff.user.id}`, LIMITS.scan.limit, LIMITS.scan.windowMs);
  if (!limited.ok) {
    await writeAudit({
      actorId: staff.user.id,
      merchantId: staff.membership.merchantId,
      action: "CAISSE_SCAN_DENIED",
      metadata: { reason: "rate_limit", via },
      ip: clientIp(req),
      userAgent: userAgent(req),
    });
    return jsonError("Trop de scans. Patientez un instant.", 429);
  }

  if (parsed.data.inputType === "CLIENT_NUMBER") {
    console.info("[caisse-scan] type numéro client reçu");
    const lookupLimited = rateLimit(
      `scan-client-lookup:${staff.user.id}:${clientIp(req)}`,
      LIMITS.clientNumberLookup.limit,
      LIMITS.clientNumberLookup.windowMs,
    );
    if (!lookupLimited.ok) {
      console.info("[caisse-scan] refus : raison", "RATE_LIMIT");
      return jsonError("Trop de recherches. Patientez un instant.", 429, { code: "RATE_LIMIT" });
    }
  } else {
    console.info("[caisse-scan] type QR reçu");
  }

  const scanKey =
    parsed.data.inputType === "QR"
      ? `scan-token:${staff.user.id}:${parsed.data.value.slice(0, 32)}`
      : `scan-client:${staff.user.id}:${normalizeClientNumber(parsed.data.value)}`;
  const duplicate = rateLimit(scanKey, 1, 2_000);
  if (!duplicate.ok) {
    return jsonError("Scan trop rapproché. Patientez un instant.", 429);
  }

  try {
    const result =
      parsed.data.inputType === "CLIENT_NUMBER"
        ? await processCaisseScanByClientNumber({
            clientNumber: normalizeClientNumber(parsed.data.value),
            merchantId: staff.membership.merchantId,
            actorUserId: staff.user.id,
          })
        : await processCaisseScan({
            token: extractFifeLifeQrToken(parsed.data.value),
            merchantId: staff.membership.merchantId,
            actorUserId: staff.user.id,
          });

    console.info("[caisse-scan] grant créé", { grantId: result.grantId });

    await writeAudit({
      actorId: staff.user.id,
      merchantId: staff.membership.merchantId,
      action: "CAISSE_SCAN",
      metadata: {
        grantId: result.grantId,
        via,
        method: parsed.data.inputType === "CLIENT_NUMBER" ? "manual_client" : "qr",
        pointsBefore: result.points,
        programMode: result.programMode,
        membershipId: "id" in staff.membership ? staff.membership.id : staff.membership.merchantId,
        ...(parsed.data.inputType === "CLIENT_NUMBER"
          ? { clientNumberMasked: maskClientNumberForLog(normalizeClientNumber(parsed.data.value)) }
          : {}),
      },
      ip: clientIp(req),
      userAgent: userAgent(req),
    });

    return jsonOk(result);
  } catch (error) {
    const isCaisseScan = error instanceof CaisseScanError;
    const isQrInput = error instanceof QrInputError;
    const message = isCaisseScan || isQrInput ? error.message : publicQrErrorMessage(error);
    const code = isCaisseScan ? error.code : isQrInput ? "INVALID_QR" : "SCAN_FAILED";

    console.info("[caisse-scan] refus : raison", code);

    await writeAudit({
      actorId: staff.user.id,
      merchantId: staff.membership.merchantId,
      action: "CAISSE_SCAN_DENIED",
      metadata: {
        reason: code,
        via,
        membershipId: "id" in staff.membership ? staff.membership.id : staff.membership.merchantId,
      },
      ip: clientIp(req),
      userAgent: userAgent(req),
    });

    if (isCaisseScan || isQrInput) {
      return jsonError(message, 400, { code });
    }
    return jsonError(message, 400, { code });
  }
}
