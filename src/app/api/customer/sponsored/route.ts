import { requireUser, requireSuperAdmin, staffContext } from "@/lib/api-guard";
import { jsonError, jsonOkPrivate } from "@/lib/http";
import { resolveSponsoredImageUrl } from "@/lib/sponsored-image";
import { loadAdPreviewCard, parsePlacement, selectSponsoredForCustomer } from "@/lib/sponsored-selection";

function withResolvedImage<T extends { imageUrl: string }>(card: T) {
  return { ...card, imageUrl: resolveSponsoredImageUrl(card.imageUrl) ?? card.imageUrl };
}

/**
 * Bandeau « Sponsorisé » à afficher à ce client dans un emplacement (WALLET_HOME, SEARCH,
 * NOTIFICATIONS). Mêmes vérifications serveur pour les trois : voir sponsored-selection.ts.
 * N'enregistre aucune impression (un aperçu ou une simple sélection ne compte jamais).
 */
export async function GET(req: Request) {
  const previewId = new URL(req.url).searchParams.get("preview");
  if (previewId) return previewResponse(req, previewId);

  const auth = await requireUser(req);
  if (auth.error || !auth.user) return auth.error ?? jsonError("Connexion requise.", 401);

  const placement = parsePlacement(new URL(req.url).searchParams.get("placement"));
  if (!placement) return jsonError("Emplacement invalide.");

  // Campagnes fermées avec la croix pendant cette utilisation : on en propose une autre, jamais un refus définitif.
  const exclude = (new URL(req.url).searchParams.get("exclude") ?? "")
    .split(",")
    .map((value) => value.trim())
    .filter((value) => /^[\w-]{1,40}$/.test(value))
    .slice(0, 20);
  const card = await selectSponsoredForCustomer({ userId: auth.user.id, placement, exclude });
  if (!card) return jsonOkPrivate({ ad: null });
  const { isSponsoredTestBroadcastAd } = await import("@/lib/sponsored-test-broadcast");
  const testBroadcast = await isSponsoredTestBroadcastAd(card.id);
  const enriched = withResolvedImage(card);
  return jsonOkPrivate({
    ad: {
      ...enriched,
      testBroadcast,
      impressionUrl: testBroadcast ? null : `/api/customer/sponsored/${card.id}/impression`,
      clickUrl: testBroadcast ? "#" : `/api/customer/sponsored/${card.id}/ouvrir?placement=${placement}`,
    },
  });
}

/** Aperçu réservé : super-admin, ou administrateur du commerce de la campagne (jamais les autres utilisateurs). */
async function previewResponse(req: Request, adId: string) {
  const placement = parsePlacement(new URL(req.url).searchParams.get("placement"));
  if (!placement) return jsonError("Emplacement invalide.");

  const preview = await loadAdPreviewCard(adId, placement);
  if (!preview) return jsonError("Aperçu indisponible : cette campagne n'a pas encore de visuel.", 404);

  const admin = await requireSuperAdmin(req);
  let allowed = !admin.error;
  if (!allowed) {
    const user = await requireUser(req);
    if (!user.error && user.user) {
      const membership = staffContext(user.user, preview.merchantId);
      allowed = Boolean(membership && membership.role === "MERCHANT_ADMIN");
    }
  }
  if (!allowed) return jsonError("Aperçu réservé au commerçant de cette campagne ou au super-admin.", 403);

  return jsonOkPrivate({
    preview: true,
    simulated: preview.simulated,
    // Aucune URL d'impression : un aperçu ne compte jamais comme une impression.
    ad: { ...withResolvedImage(preview.card), impressionUrl: null, clickUrl: "#" },
  });
}
