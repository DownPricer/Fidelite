import { z } from "zod";
import { requireMutatingRequest, requireUser } from "@/lib/api-guard";
import { jsonError, jsonOk, readJson } from "@/lib/http";
import { isAdEligibleForCustomer, parsePlacement, recordImpression } from "@/lib/sponsored-selection";

const schema = z.object({ placement: z.string() });

/**
 * Impression : appelée uniquement quand le bandeau est réellement visible à l'écran. Revérifie
 * toute l'éligibilité (créneau, paiement, suspension, audience) puis compte au plus une fois par
 * client / campagne / 10 min, avec le placement d'origine.
 */
export async function POST(req: Request, context: { params: Promise<{ id: string }> }) {
  const csrf = await requireMutatingRequest(req);
  if (csrf.error) return csrf.error;
  const auth = await requireUser(req);
  if (auth.error || !auth.user) return auth.error ?? jsonError("Connexion requise.", 401);

  const { id } = await context.params;
  const parsed = schema.safeParse(await readJson(req));
  const placement = parsePlacement(parsed.success ? parsed.data.placement : null);
  if (!placement) return jsonError("Emplacement invalide.");

  const ad = await isAdEligibleForCustomer(id, auth.user.id);
  if (!ad) return jsonError("Publicité introuvable.", 404);

  const counted = await recordImpression({ adId: id, userId: auth.user.id, placement });
  return jsonOk({ ok: true, counted });
}
