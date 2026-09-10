import { requireMutatingRequest, requireUser } from "@/lib/api-guard";
import { ensureCustomerMembershipForSlug, generateCustomerQrDataUrl } from "@/lib/customer-qr";
import { clientIp, jsonError, jsonOkPrivate, readJson } from "@/lib/http";
import { LIMITS, rateLimit } from "@/lib/rate-limit";
import { z } from "zod";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const schema = z.object({
  slug: z.string().min(1),
});

export async function POST(req: Request) {
  const csrf = await requireMutatingRequest(req);
  if (csrf.error) return csrf.error;

  const auth = await requireUser(req);
  if (auth.error || !auth.user) return auth.error ?? jsonError("Connexion requise.", 401);

  const parsed = schema.safeParse(await readJson(req));
  if (!parsed.success) return jsonError("Commerce manquant.");

  const limited = rateLimit(`qr:${auth.user.id}`, LIMITS.qr.limit, LIMITS.qr.windowMs);
  if (!limited.ok) return jsonError("Trop de demandes. Réessayez dans un instant.", 429);

  const membership = await ensureCustomerMembershipForSlug(auth.user.id, parsed.data.slug);
  if (membership.error) return jsonError(membership.error, 404);

  const { image } = await generateCustomerQrDataUrl(auth.user.id);

  return jsonOkPrivate({
    image,
    generatedAt: new Date().toISOString(),
    ipHint: clientIp(req) === "unknown" ? undefined : true,
  });
}
