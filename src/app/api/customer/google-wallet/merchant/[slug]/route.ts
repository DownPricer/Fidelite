import { requireMutatingRequest, requireStandardUser } from "@/lib/api-guard";
import {
  GoogleWalletApiError,
  GoogleWalletConfigError,
  createMerchantGoogleWalletSaveUrl,
  isGoogleWalletConfigured,
  publicGoogleWalletError,
} from "@/lib/google-wallet";
import { clientIp, jsonError, jsonOkPrivate } from "@/lib/http";
import { prisma } from "@/lib/prisma";
import { LIMITS, rateLimit } from "@/lib/rate-limit";

export async function POST(req: Request, context: { params: Promise<{ slug: string }> }) {
  const csrf = await requireMutatingRequest(req);
  if (csrf.error) return csrf.error;
  const auth = await requireStandardUser(req);
  if (auth.error || !auth.user) return auth.error ?? jsonError("Connexion requise.", 401);
  const { slug } = await context.params;
  const limit = rateLimit(
    `google-wallet:merchant:${auth.user.id}:${slug}:${clientIp(req)}`,
    LIMITS.googleWallet.limit,
    LIMITS.googleWallet.windowMs,
  );
  if (!limit.ok) return jsonError("Trop de tentatives. Réessayez dans un instant.", 429);
  if (!isGoogleWalletConfigured()) return jsonError("Google Wallet non configuré.", 503);

  const merchant = await prisma.merchant.findUnique({
    where: { slug },
    select: { id: true, isActive: true, status: true, program: { select: { status: true } } },
  });
  if (!merchant || !merchant.isActive) return jsonError("Commerce introuvable.", 404);
  if (merchant.status === "SUSPENDED" || merchant.status === "ARCHIVED" || merchant.program?.status !== "ACTIVE") {
    return jsonError("Programme Google Wallet incohérent.", 409);
  }

  try {
    const result = await createMerchantGoogleWalletSaveUrl({ userId: auth.user.id, slug });
    if ("forbidden" in result) return jsonError("Carte inaccessible.", 403);
    return jsonOkPrivate({ saveUrl: result.saveUrl });
  } catch (error) {
    if (error instanceof GoogleWalletConfigError) {
      return jsonError(publicGoogleWalletError(error), 503);
    }
    if (error instanceof GoogleWalletApiError) {
      return jsonError("Google Wallet est temporairement indisponible.", 502);
    }
    return jsonError("Google Wallet est temporairement indisponible.", 502);
  }
}
