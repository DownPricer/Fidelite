import { requireMutatingRequest, requireUser } from "@/lib/api-guard";
import {
  generateCustomerQrDataUrl,
  isCustomerQrInfrastructureError,
  tryEnsureCustomerMembershipForSlug,
} from "@/lib/customer-qr";
import { jsonError, jsonOkPrivate, readJson } from "@/lib/http";
import { LIMITS, rateLimit } from "@/lib/rate-limit";
import { z } from "zod";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const schema = z.object({
  slug: z.string().min(1),
});

export async function POST(req: Request) {
  logCustomerQr("requête reçue");

  const csrf = await requireMutatingRequest(req);
  if (csrf.error) return csrf.error;

  const auth = await requireUser(req);
  if (auth.error || !auth.user) return auth.error ?? jsonError("Connexion requise.", 401);

  logCustomerQr("session client validée");
  logCustomerQr("utilisateur trouvé");

  const parsed = schema.safeParse(await readJson(req));
  if (!parsed.success) return jsonError("Commerce manquant.");

  const limited = rateLimit(`qr:${auth.user.id}`, LIMITS.qr.limit, LIMITS.qr.windowMs);
  if (!limited.ok) return jsonError("Trop de demandes. Réessayez dans un instant.", 429);

  await tryEnsureCustomerMembershipForSlug(auth.user.id, parsed.data.slug);

  try {
    const { image } = await generateCustomerQrDataUrl(auth.user.id);
    logCustomerQr("réponse 200");
    return jsonOkPrivate({ image });
  } catch (error) {
    if (isCustomerQrInfrastructureError(error)) {
      console.error("[customer-qr] migration ou table QR manquante", error);
      return jsonError("Service QR temporairement indisponible.", 503);
    }
    console.error("[customer-qr] échec génération QR", error);
    return jsonError("Impossible de générer le QR pour le moment.", 500);
  }
}

function logCustomerQr(step: string) {
  console.info(`[customer-qr] ${step}`);
}
