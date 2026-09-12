import { requireMutatingRequest, requireStandardUser } from "@/lib/api-guard";
import {
  GoogleWalletApiError,
  GoogleWalletConfigError,
  createGlobalGoogleWalletSaveUrl,
  isGoogleWalletConfigured,
  publicGoogleWalletError,
} from "@/lib/google-wallet";
import { clientIp, jsonError, jsonOkPrivate } from "@/lib/http";
import { LIMITS, rateLimit } from "@/lib/rate-limit";

export async function POST(req: Request) {
  const csrf = await requireMutatingRequest(req);
  if (csrf.error) return csrf.error;
  const auth = await requireStandardUser(req);
  if (auth.error || !auth.user) return auth.error ?? jsonError("Connexion requise.", 401);
  const limit = rateLimit(`google-wallet:global:${auth.user.id}:${clientIp(req)}`, LIMITS.googleWallet.limit, LIMITS.googleWallet.windowMs);
  if (!limit.ok) return jsonError("Trop de tentatives. Réessayez dans un instant.", 429);
  if (!isGoogleWalletConfigured()) return jsonError("Google Wallet non configuré.", 503);

  try {
    const { saveUrl } = await createGlobalGoogleWalletSaveUrl(auth.user.id);
    return jsonOkPrivate({ saveUrl });
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
