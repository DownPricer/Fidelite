import { requireStandardUser } from "@/lib/api-guard";
import { jsonError, jsonOkPrivate } from "@/lib/http";
import { parsePlacement, selectSponsoredForCustomer } from "@/lib/sponsored-selection";

/**
 * Bandeau « Sponsorisé » à afficher à ce client dans un emplacement (WALLET_HOME, SEARCH,
 * NOTIFICATIONS). Mêmes vérifications serveur pour les trois : voir sponsored-selection.ts.
 * N'enregistre aucune impression (un aperçu ou une simple sélection ne compte jamais).
 */
export async function GET(req: Request) {
  const auth = await requireStandardUser(req);
  if (auth.error || !auth.user) return auth.error ?? jsonError("Connexion requise.", 401);

  const placement = parsePlacement(new URL(req.url).searchParams.get("placement"));
  if (!placement) return jsonError("Emplacement invalide.");

  const card = await selectSponsoredForCustomer({ userId: auth.user.id, placement });
  return jsonOkPrivate({
    ad: card
      ? {
          ...card,
          impressionUrl: `/api/customer/sponsored/${card.id}/impression`,
          clickUrl: `/api/customer/sponsored/${card.id}/ouvrir?placement=${placement}`,
        }
      : null,
  });
}
