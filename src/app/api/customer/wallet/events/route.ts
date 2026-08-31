import { requireUser } from "@/lib/api-guard";
import { jsonError } from "@/lib/http";
import { prisma } from "@/lib/prisma";

// SSE léger pour synchroniser le portefeuille client.
// Le flux reste ouvert au maximum ~30s puis se ferme ; le client peut se reconnecter
// uniquement lorsque l’application est visible.

export async function GET(req: Request) {
  const auth = await requireUser(req);
  if (auth.error || !auth.user) {
    // SSE attend toujours un 200, mais on préfère renvoyer une réponse JSON standard
    // si l’utilisateur n’est pas connecté.
    return auth.error ?? jsonError("Connexion requise.", 401);
  }

  const url = new URL(req.url);
  const lastEventId = url.searchParams.get("lastEventId") ?? undefined;

  const encoder = new TextEncoder();

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      let sinceCreatedAt: Date | null = null;

      if (lastEventId) {
        const existing = await prisma.walletEvent.findUnique({
          where: { id: lastEventId },
          select: { createdAt: true },
        });
        if (existing) {
          sinceCreatedAt = existing.createdAt;
        }
      }

      const startedAt = Date.now();
      const maxDurationMs = 30_000;

      async function sendEventsOnce() {
        const events = await prisma.walletEvent.findMany({
          where: {
            userId: auth.user!.id,
            ...(sinceCreatedAt
              ? { createdAt: { gt: sinceCreatedAt } }
              : {}),
          },
          orderBy: { createdAt: "asc" },
          take: 50,
        });

        if (events.length === 0) return;

        for (const event of events) {
          const payload = {
            id: event.id,
            type: event.type,
            createdAt: event.createdAt.toISOString(),
            merchantId: event.merchantId,
            customerMembershipId: event.customerMembershipId,
            payload: event.payload,
          };
          const chunk = `id: ${event.id}\nevent: wallet\ndata: ${JSON.stringify(payload)}\n\n`;
          controller.enqueue(encoder.encode(chunk));
          sinceCreatedAt = event.createdAt;
        }
      }

      try {
        // Première livraison immédiate.
        await sendEventsOnce();

        // Rafraîchis toutes les 3 secondes pendant ~30 secondes maximum.
        while (Date.now() - startedAt < maxDurationMs) {
          await new Promise((resolve) => setTimeout(resolve, 3_000));
          await sendEventsOnce();
        }
      } catch (error) {
        // En cas d’erreur inattendue, on ferme simplement le flux côté serveur.
        console.error("[wallet events] stream error", error);
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-store",
      Connection: "keep-alive",
    },
  });
}

