import { requireMutatingRequest, requireSuperAdmin } from "@/lib/api-guard";
import { GoogleWalletConfigError, publicGoogleWalletError } from "@/lib/google-wallet";
import {
  getSponsoredTestBroadcastAdminStatus,
  startSponsoredTestBroadcast,
  stopSponsoredTestBroadcast,
} from "@/lib/sponsored-test-broadcast";
import { jsonError, jsonOk } from "@/lib/http";

export async function GET(_req: Request, context: { params: Promise<{ id: string }> }) {
  const auth = await requireSuperAdmin(_req);
  if (auth.error || !auth.user) return auth.error ?? jsonError("Accès refusé.", 403);
  const { id } = await context.params;
  return jsonOk({ testBroadcast: await getSponsoredTestBroadcastAdminStatus(id) });
}

export async function POST(req: Request, context: { params: Promise<{ id: string }> }) {
  const csrf = await requireMutatingRequest(req);
  if (csrf.error) return csrf.error;
  const auth = await requireSuperAdmin(req);
  if (auth.error || !auth.user) return auth.error ?? jsonError("Accès refusé.", 403);

  const { id } = await context.params;
  try {
    const { googleSync } = await startSponsoredTestBroadcast({ adRequestId: id, startedById: auth.user.id });
    return jsonOk({
      ok: true,
      googleSync,
      testBroadcast: await getSponsoredTestBroadcastAdminStatus(id),
    });
  } catch (error) {
    if (error instanceof GoogleWalletConfigError) {
      return jsonError(publicGoogleWalletError(error), 503, {
        testBroadcast: await getSponsoredTestBroadcastAdminStatus(id),
      });
    }
    return jsonError(publicGoogleWalletError(error), 502, {
      testBroadcast: await getSponsoredTestBroadcastAdminStatus(id),
    });
  }
}

export async function DELETE(req: Request, context: { params: Promise<{ id: string }> }) {
  const csrf = await requireMutatingRequest(req);
  if (csrf.error) return csrf.error;
  const auth = await requireSuperAdmin(req);
  if (auth.error || !auth.user) return auth.error ?? jsonError("Accès refusé.", 403);

  const { id } = await context.params;
  try {
    const result = await stopSponsoredTestBroadcast({ adRequestId: id });
    return jsonOk({ ok: true, ...result, testBroadcast: await getSponsoredTestBroadcastAdminStatus(id) });
  } catch (error) {
    return jsonError("Arrêt de la diffusion test impossible.", 500);
  }
}
