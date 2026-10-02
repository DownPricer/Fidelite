import { requireMutatingRequest, requireStandardUser } from "@/lib/api-guard";
import { sendCustomerFinalizationInvite } from "@/lib/customer-onboarding";
import { jsonError, jsonOk } from "@/lib/http";
import { LIMITS, rateLimit } from "@/lib/rate-limit";
import { clientIp } from "@/lib/http";

export async function POST(req: Request) {
  const csrf = await requireMutatingRequest(req);
  if (csrf.error) return csrf.error;

  const auth = await requireStandardUser(req);
  if (auth.error || !auth.user) return auth.error;

  const limited = rateLimit(`customer-resend:${clientIp(req)}:${auth.user.id}`, 3, 60 * 60 * 1000);
  if (!limited.ok) {
    return jsonError("Trop de demandes. Réessayez plus tard.", 429);
  }

  const result = await sendCustomerFinalizationInvite(auth.user);
  if (!result.ok) {
    return jsonError(result.error, 503);
  }

  return jsonOk({ ok: true, message: "Un nouveau lien de confirmation vient d'être envoyé." });
}
