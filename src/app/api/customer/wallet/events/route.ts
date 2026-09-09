import type { WalletEventType } from "@prisma/client";

import { requireUser } from "@/lib/api-guard";
import { jsonError } from "@/lib/http";
import { prisma } from "@/lib/prisma";
import { logWalletUnlock } from "@/lib/wallet-unlock-log";
import { serializeWalletEvent, UNLOCK_EVENT_TYPES } from "@/lib/wallet-unlock";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const HEARTBEAT_MS = 15_000;
const POLL_MS = 2_000;
const MAX_DURATION_MS = 30_000;

function sseChunk(
  encoder: TextEncoder,
  controller: ReadableStreamDefaultController<Uint8Array>,
  event: {
    id: string;
    type: WalletEventType;
    createdAt: Date;
    merchantId: string | null;
    customerMembershipId: string | null;
    payload: unknown;
    acknowledgedAt?: Date | null;
  },
) {
  const payload = serializeWalletEvent(event);
  const chunk = `id: ${event.id}\nevent: wallet\ndata: ${JSON.stringify(payload)}\n\n`;
  controller.enqueue(encoder.encode(chunk));
}

// SSE pour synchroniser le portefeuille client.
// Les événements de déblocage non acquittés sont renvoyés à la connexion,
// puis le flux poll les nouveaux événements en base.

export async function GET(req: Request) {
  const auth = await requireUser(req);
  if (auth.error || !auth.user) {
    return auth.error ?? jsonError("Connexion requise.", 401);
  }

  const userId = auth.user.id;
  const url = new URL(req.url);
  const lastEventId = url.searchParams.get("lastEventId") ?? undefined;

  const encoder = new TextEncoder();

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const sentIds = new Set<string>();
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

      type StreamEvent = Awaited<
        ReturnType<typeof prisma.walletEvent.findMany>
      >[number];

      async function deliver(events: StreamEvent[]) {
        if (events.length === 0) return;

        for (const event of events) {
          if (sentIds.has(event.id)) continue;
          sentIds.add(event.id);
          sseChunk(encoder, controller, event);
          if (!sinceCreatedAt || event.createdAt > sinceCreatedAt) {
            sinceCreatedAt = event.createdAt;
          }
          if (UNLOCK_EVENT_TYPES.includes(event.type)) {
            logWalletUnlock("événement envoyé", {
              eventId: event.id,
              eventType: event.type,
              merchantId: event.merchantId ?? undefined,
              membershipId: event.customerMembershipId ?? undefined,
              userId,
            });
          }
        }
      }

      async function sendPendingUnlocks() {
        const pending = await prisma.walletEvent.findMany({
          where: {
            userId,
            type: { in: UNLOCK_EVENT_TYPES },
            acknowledgedAt: null,
          },
          orderBy: { createdAt: "asc" },
          take: 20,
        });
        await deliver(pending);
      }

      async function sendNewEvents() {
        const events = await prisma.walletEvent.findMany({
          where: {
            userId,
            ...(sinceCreatedAt ? { createdAt: { gt: sinceCreatedAt } } : {}),
          },
          orderBy: { createdAt: "asc" },
          take: 50,
        });
        await deliver(events);
      }

      const startedAt = Date.now();
      let lastHeartbeat = Date.now();

      try {
        await sendPendingUnlocks();
        if (!sinceCreatedAt) {
          sinceCreatedAt = new Date();
        }
        await sendNewEvents();

        while (Date.now() - startedAt < MAX_DURATION_MS) {
          await new Promise((resolve) => setTimeout(resolve, POLL_MS));
          await sendNewEvents();

          if (Date.now() - lastHeartbeat >= HEARTBEAT_MS) {
            controller.enqueue(encoder.encode(": heartbeat\n\n"));
            lastHeartbeat = Date.now();
          }
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
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
