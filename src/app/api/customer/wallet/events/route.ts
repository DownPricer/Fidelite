import { requireUser } from "@/lib/api-guard";
import { jsonError } from "@/lib/http";
import { prisma } from "@/lib/prisma";

// SSE léger pour synchroniser le portefeuille client.
// Sans lastEventId, seuls les événements émis après l’ouverture du flux sont renvoyés.

export async function GET(req: Request) {
  const auth = await requireUser(req);
  if (auth.error || !auth.user) {
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
      } else {
        sinceCreatedAt = new Date();
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
        await sendEventsOnce();

        while (Date.now() - startedAt < maxDurationMs) {
          await new Promise((resolve) => setTimeout(resolve, 3_000));
          await sendEventsOnce();
        }
      } catch (error) {
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
