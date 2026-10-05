import { requireMutatingRequest } from "@/lib/api-guard";
import { clientIp, jsonError, jsonOk, readJson, userAgent } from "@/lib/http";
import { readMerchantSignupGrantCookie, clearMerchantSignupGrantCookie } from "@/lib/merchant-signup-grant";
import { completeMerchantSignupAccount, startMerchantSignupCheckout } from "@/lib/merchant-signup-service";
import { merchantSignupCompleteSchema, zodMerchantSignupError } from "@/lib/merchant-signup-validation";
import { createSession } from "@/lib/session";
import { clearEmployeeBrowserSession } from "@/lib/session-handoff";

export async function POST(req: Request) {
  const csrf = await requireMutatingRequest(req);
  if (csrf.error) return csrf.error;

  const grant = await readMerchantSignupGrantCookie();
  if (!grant) {
    return jsonError("Votre session d'inscription a expiré. Saisissez à nouveau votre code.", 403);
  }

  const parsed = merchantSignupCompleteSchema.safeParse(await readJson(req));
  if (!parsed.success) {
    return jsonError(zodMerchantSignupError(parsed.error));
  }

  const completed = await completeMerchantSignupAccount({
    grantRequestId: grant.requestId,
    grantEmail: grant.email,
    mode: parsed.data.mode,
    password: parsed.data.password,
    ip: clientIp(req),
    userAgent: userAgent(req),
  });

  if (!completed.ok) {
    return jsonError(completed.error, 400);
  }

  const user = await (async () => {
    const { prisma } = await import("@/lib/prisma");
    const request = await prisma.merchantSignupRequest.findUnique({ where: { id: grant.requestId } });
    if (!request?.userId) return null;
    return prisma.user.findUnique({ where: { id: request.userId } });
  })();

  if (!user) {
    return jsonError("Compte introuvable après création.", 500);
  }

  await clearEmployeeBrowserSession();
  await createSession(user.id, { ip: clientIp(req), userAgent: userAgent(req) });

  const checkout = await startMerchantSignupCheckout({
    grantRequestId: grant.requestId,
    grantEmail: grant.email,
  });

  if (!checkout.ok) {
    return jsonError(checkout.error, 503);
  }

  await clearMerchantSignupGrantCookie();

  return jsonOk({ ok: true, checkoutUrl: checkout.checkoutUrl });
}
