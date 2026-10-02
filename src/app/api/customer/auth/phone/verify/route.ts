import { requireMutatingRequest, requireStandardUser } from "@/lib/api-guard";
import { markCustomerProfileFinalized } from "@/lib/customer-onboarding";
import { jsonError, jsonOk, readJson } from "@/lib/http";
import { prisma } from "@/lib/prisma";
import { hashToken } from "@/lib/session";
import { customerPhoneVerifySchema, zodErrorMessage } from "@/lib/validation";
import { z } from "zod";

const schema = customerPhoneVerifySchema.extend({
  challengeToken: z.string().min(16),
});

export async function POST(req: Request) {
  const csrf = await requireMutatingRequest(req);
  if (csrf.error) return csrf.error;

  const auth = await requireStandardUser(req);
  if (auth.error || !auth.user) return auth.error;

  const body = await readJson<unknown>(req);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return jsonError(zodErrorMessage(parsed.error));
  }

  const tokenHash = hashToken(`${parsed.data.challengeToken}:${parsed.data.code}`);
  const row = await prisma.customerAccessToken.findUnique({ where: { tokenHash } });
  if (!row || row.userId !== auth.user.id || row.usedAt || row.expiresAt <= new Date()) {
    return jsonError("Code invalide ou expiré.", 400);
  }

  await prisma.customerAccessToken.update({
    where: { id: row.id },
    data: { usedAt: new Date() },
  });
  await prisma.user.update({
    where: { id: auth.user.id },
    data: { phoneVerified: true },
  });
  await markCustomerProfileFinalized(auth.user.id);

  return jsonOk({ ok: true, message: "Téléphone vérifié." });
}
