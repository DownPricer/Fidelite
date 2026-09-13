import type { WalletEventType } from "@prisma/client";

import { requireUser } from "@/lib/api-guard";
import { jsonError } from "@/lib/http";
import { prisma } from "@/lib/prisma";
import { logWalletUnlock } from "@/lib/wallet-unlock-log";
import { shouldSendSseEvent } from "@/lib/wallet-unlock-client";
import { serializeWalletEvent, UNLOCK_EVENT_TYPES } from "@/lib/wallet-unlock";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const HEARTBEAT_MS = 15_000;
const POLL_MS = 2_000;
const MAX_DURATION_MS = 30_000;

function sseChunk(
  encoder: TextEncoder,
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
  return encoder.encode(`id: ${event.id}\nevent: wallet\ndata: ${JSON.stringify(payload)}\n\n`);
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
      let closed = false;
      const timers = new Set<ReturnType<typeof setTimeout>>();

      const cleanup = () => {
        for (const timer of timers) clearTimeout(timer);
        timers.clear();
        req.signal.removeEventListener("abort", onAbort);
      };

      const safeClose = () => {
        if (closed) return;
        closed = true;
        cleanup();
        try {
          controller.close();
        } catch (error) {
          if (!(error instanceof TypeError && String(error.message).includes("Controller is already closed"))) {
            throw error;
          }
        }
      };

      const safeEnqueue = (chunk: Uint8Array) => {
        if (closed || req.signal.aborted) return false;
        try {
          controller.enqueue(chunk);
          return true;
        } catch (error) {
          closed = true;
          cleanup();
          if (error instanceof TypeError && String(error.message).includes("Controller is already closed")) {
            return false;
          }
          throw error;
        }
      };

      const sleep = (ms: number) =>
        new Promise<void>((resolve) => {
          const timer = setTimeout(() => {
            timers.delete(timer);
            resolve();
          }, ms);
          timers.add(timer);
        });

      function onAbort() {
        safeClose();
      }

      req.signal.addEventListener("abort", onAbort, { once: true });
      if (req.signal.aborted) {
        safeClose();
        return;
      }

      if (lastEventId) {
        const existing = await prisma.walletEvent.findUnique({
          where: { id: lastEventId },
          select: { createdAt: true },
        });
        if (closed || req.signal.aborted) {
          safeClose();
          return;
        }
        if (existing) {
          sinceCreatedAt = existing.createdAt;
        }
      }

      type StreamEvent = Awaited<
        ReturnType<typeof prisma.walletEvent.findMany>
      >[number];

      async function deliver(events: StreamEvent[]) {
        if (closed || req.signal.aborted || events.length === 0) return;

        for (const event of events) {
          if (closed || req.signal.aborted) return;
          if (!shouldSendSseEvent(event.id, sentIds)) continue;
          sentIds.add(event.id);
          if (!safeEnqueue(sseChunk(encoder, event))) return;
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
        if (closed || req.signal.aborted) return;
        const pending = await prisma.walletEvent.findMany({
          where: {
            userId,
            type: { in: UNLOCK_EVENT_TYPES },
            acknowledgedAt: null,
          },
          orderBy: { createdAt: "asc" },
          take: 20,
        });
        if (closed || req.signal.aborted) return;
        await deliver(pending);
      }

      async function sendNewEvents() {
        if (closed || req.signal.aborted) return;
        const events = await prisma.walletEvent.findMany({
          where: {
            userId,
            ...(sinceCreatedAt ? { createdAt: { gt: sinceCreatedAt } } : {}),
          },
          orderBy: { createdAt: "asc" },
          take: 50,
        });
        if (closed || req.signal.aborted) return;
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

        while (!closed && !req.signal.aborted && Date.now() - startedAt < MAX_DURATION_MS) {
          await sleep(POLL_MS);
          if (closed || req.signal.aborted) break;
          await sendNewEvents();
          if (closed || req.signal.aborted) break;

          if (Date.now() - lastHeartbeat >= HEARTBEAT_MS) {
            if (!safeEnqueue(encoder.encode(": heartbeat\n\n"))) break;
            lastHeartbeat = Date.now();
          }
        }
      } catch (error) {
        if (!closed && !req.signal.aborted) {
          console.error("[wallet events] stream error", error);
        }
      } finally {
        safeClose();
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
