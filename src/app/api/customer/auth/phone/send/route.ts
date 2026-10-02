import { randomInt } from "crypto";
import { CustomerAccessTokenKind } from "@prisma/client";
import { requireMutatingRequest, requireStandardUser } from "@/lib/api-guard";
import {
  CUSTOMER_TOKEN_TTL,
  createRawCustomerToken,
  invalidateCustomerAccessTokens,
} from "@/lib/customer-access-token";
import { clientIp, jsonError, jsonOk, readJson } from "@/lib/http";
import { rateLimit } from "@/lib/rate-limit";
import { isSmsConfigured, sendSms, smsConfigHint } from "@/lib/sms";
import { customerPhoneSendSchema, zodErrorMessage } from "@/lib/validation";
import { prisma } from "@/lib/prisma";
import { hashToken } from "@/lib/session";

export async function POST(req: Request) {
  const csrf = await requireMutatingRequest(req);
  if (csrf.error) return csrf.error;

  const auth = await requireStandardUser(req);
  if (auth.error || !auth.user) return auth.error;

  if (!isSmsConfigured()) {
    return jsonError(smsConfigHint() ?? "Vérification SMS indisponible.", 503);
  }

  const body = await readJson<unknown>(req);
  const parsed = customerPhoneSendSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError(zodErrorMessage(parsed.error));
  }

  const limited = rateLimit(`customer-phone:${clientIp(req)}:${auth.user.id}`, 5, 15 * 60 * 1000);
  if (!limited.ok) {
    return jsonError("Trop de demandes SMS. Réessayez plus tard.", 429);
  }

  const code = String(randomInt(0, 1_000_000)).padStart(6, "0");
  const challengeToken = createRawCustomerToken();
  const dial = `${parsed.data.phoneCountryCode}${parsed.data.phone}`.replace(/\s/g, "");
  const sms = await sendSms(dial, `Votre code Fideto : ${code}. Valable 10 minutes.`);

  if (!sms.ok) {
    return jsonError(sms.error, 503);
  }

  await invalidateCustomerAccessTokens(auth.user.id, CustomerAccessTokenKind.PHONE_VERIFICATION);
  const expiresAt = new Date(Date.now() + CUSTOMER_TOKEN_TTL.phoneVerificationMs);
  await prisma.customerAccessToken.create({
    data: {
      userId: auth.user.id,
      kind: CustomerAccessTokenKind.PHONE_VERIFICATION,
      tokenHash: hashToken(`${challengeToken}:${code}`),
      expiresAt,
    },
  });

  await prisma.user.update({
    where: { id: auth.user.id },
    data: {
      phone: parsed.data.phone,
      phoneCountryCode: parsed.data.phoneCountryCode,
      phoneVerified: false,
    },
  });

  return jsonOk({
    ok: true,
    challengeToken,
    message: "Code SMS envoyé.",
  });
}
