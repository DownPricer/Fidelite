import { requireUser } from "@/lib/api-guard";
import { jsonError, jsonOk } from "@/lib/http";
import { prisma } from "@/lib/prisma";
import { logWalletUnlock } from "@/lib/wallet-unlock-log";
import { serializeWalletEvent, UNLOCK_EVENT_TYPES } from "@/lib/wallet-unlock";

export async function GET(req: Request) {
  const auth = await requireUser(req);
  if (auth.error || !auth.user) {
    return auth.error ?? jsonError("Connexion requise.", 401);
  }

  const events = await prisma.walletEvent.findMany({
    where: {
      userId: auth.user.id,
      type: { in: UNLOCK_EVENT_TYPES },
      acknowledgedAt: null,
    },
    orderBy: { createdAt: "asc" },
    take: 10,
  });

  for (const event of events) {
    logWalletUnlock("événement envoyé", {
      eventId: event.id,
      eventType: event.type,
      merchantId: event.merchantId ?? undefined,
      membershipId: event.customerMembershipId ?? undefined,
      userId: auth.user.id,
    });
  }

  return jsonOk({ events: events.map(serializeWalletEvent) });
}
