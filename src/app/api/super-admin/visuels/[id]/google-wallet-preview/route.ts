import { requireMutatingRequest, requireSuperAdmin } from "@/lib/api-guard";
import { GoogleWalletApiError, GoogleWalletConfigError, publicGoogleWalletError } from "@/lib/google-wallet";
import {
  getGoogleWalletPreviewAdminStatus,
  startGoogleWalletGlobalAdPreview,
  stopGoogleWalletGlobalAdPreview,
} from "@/lib/google-wallet-global-preview";
import { jsonError, jsonOk } from "@/lib/http";

export async function GET(_req: Request, context: { params: Promise<{ id: string }> }) {
  const auth = await requireSuperAdmin(_req);
  if (auth.error || !auth.user) return auth.error ?? jsonError("Accès refusé.", 403);
  const { id } = await context.params;
  return jsonOk({ walletPreview: await getGoogleWalletPreviewAdminStatus(id) });
}

export async function POST(req: Request, context: { params: Promise<{ id: string }> }) {
  const csrf = await requireMutatingRequest(req);
  if (csrf.error) return csrf.error;
  const auth = await requireSuperAdmin(req);
  if (auth.error || !auth.user) return auth.error ?? jsonError("Accès refusé.", 403);

  const { id } = await context.params;
  try {
    const result = await startGoogleWalletGlobalAdPreview({ adRequestId: id, startedById: auth.user.id });
    if (result.needsWalletSave) {
      return jsonOk({
        ok: false,
        needsWalletSave: true,
        message: result.message,
        walletPreview: await getGoogleWalletPreviewAdminStatus(id),
      });
    }
    return jsonOk({
      ok: true,
      expiresAt: result.expiresAt,
      googleSync: result.googleSync,
      walletPreview: await getGoogleWalletPreviewAdminStatus(id),
    });
  } catch (error) {
    if (error instanceof GoogleWalletConfigError) {
      return jsonError(publicGoogleWalletError(error), 503);
    }
    if (error instanceof GoogleWalletApiError) {
      return jsonError(publicGoogleWalletError(error), 502, {
        walletPreview: await getGoogleWalletPreviewAdminStatus(id),
      });
    }
    return jsonError("Aperçu Google Wallet impossible.", 500);
  }
}

export async function DELETE(req: Request, context: { params: Promise<{ id: string }> }) {
  const csrf = await requireMutatingRequest(req);
  if (csrf.error) return csrf.error;
  const auth = await requireSuperAdmin(req);
  if (auth.error || !auth.user) return auth.error ?? jsonError("Accès refusé.", 403);

  const { id } = await context.params;
  try {
    const result = await stopGoogleWalletGlobalAdPreview({ adRequestId: id });
    return jsonOk({ ok: true, ...result, walletPreview: await getGoogleWalletPreviewAdminStatus(id) });
  } catch (error) {
    if (error instanceof GoogleWalletConfigError) {
      return jsonError(publicGoogleWalletError(error), 503);
    }
    return jsonError("Arrêt de l'aperçu impossible.", 500);
  }
}
