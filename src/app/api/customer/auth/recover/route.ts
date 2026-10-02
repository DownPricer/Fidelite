import { NextResponse } from "next/server";
import { CustomerAccessTokenKind } from "@prisma/client";
import { requireMutatingRequest } from "@/lib/api-guard";
import { consumeCustomerAccessToken } from "@/lib/customer-access-token";
import {
  createCustomerSession,
  customerPostAuthRedirect,
  requestAccountRecovery,
} from "@/lib/customer-onboarding";
import { prisma } from "@/lib/prisma";
import { clientIp, jsonError, jsonOk, readJson, userAgent } from "@/lib/http";
import { LIMITS, rateLimit } from "@/lib/rate-limit";
import { customerRecoveryRequestSchema, zodErrorMessage } from "@/lib/validation";
import { writeAudit } from "@/lib/audit";

export async function POST(req: Request) {
  const csrf = await requireMutatingRequest(req);
  if (csrf.error) return csrf.error;

  const body = await readJson<unknown>(req);
  const parsed = customerRecoveryRequestSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError(zodErrorMessage(parsed.error));
  }

  const ip = clientIp(req);
  const limited = rateLimit(`customer-recover:${ip}:${parsed.data.email}`, 5, 15 * 60 * 1000);
  if (!limited.ok) {
    return jsonError("Trop de demandes. Réessayez plus tard.", 429);
  }

  await requestAccountRecovery(parsed.data.email);

  return jsonOk({
    ok: true,
    message:
      "Si un compte client existe avec cet e-mail, un lien sécurisé vient d'être envoyé. Aucun accès n'est accordé sans ce lien.",
  });
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const token = url.searchParams.get("token")?.trim();
  if (!token) {
    return NextResponse.redirect(new URL("/connexion?recover=invalid", url.origin));
  }

  const row = await consumeCustomerAccessToken(token, CustomerAccessTokenKind.ACCOUNT_RECOVERY);
  if (!row) {
    return NextResponse.redirect(new URL("/connexion?recover=invalid", url.origin));
  }

  await createCustomerSession(row.userId, { ip: clientIp(req), userAgent: userAgent(req) });
  await writeAudit({
    actorId: row.userId,
    action: "CUSTOMER_ACCOUNT_RECOVERY",
    ip: clientIp(req),
    userAgent: userAgent(req),
  });

  const user = await prisma.user.findUnique({ where: { id: row.userId } });
  const redirectTo = user ? customerPostAuthRedirect(user) : "/finalisation";
  return NextResponse.redirect(new URL(redirectTo, url.origin));
}
