import { requireMutatingRequest } from "@/lib/api-guard";
import { clientIp, jsonError, jsonOk, readJson } from "@/lib/http";
import { LIMITS, rateLimit } from "@/lib/rate-limit";
import { sendPublicContactEmail, supportEmailConfigHint } from "@/lib/support-contact";
import { publicContactFormSchema, zodErrorMessage } from "@/lib/validation";

export async function POST(req: Request) {
  const csrf = await requireMutatingRequest(req);
  if (csrf.error) return csrf.error;

  const configHint = supportEmailConfigHint();
  if (configHint) {
    return jsonError(configHint, 503);
  }

  const ip = clientIp(req);
  const limited = rateLimit(`public-contact:${ip}`, LIMITS.publicContact.limit, LIMITS.publicContact.windowMs);
  if (!limited.ok) {
    return jsonError("Trop de messages envoyés. Réessayez plus tard.", 429);
  }

  const body = await readJson<unknown>(req);
  const parsed = publicContactFormSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError(zodErrorMessage(parsed.error));
  }

  const result = await sendPublicContactEmail(parsed.data);
  if (!result.ok) {
    return jsonError(result.error, 503);
  }

  return jsonOk({
    ok: true,
    message: "Votre message a bien été envoyé. Nous vous répondrons à l'adresse indiquée.",
  });
}
