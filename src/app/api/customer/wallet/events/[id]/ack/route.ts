import { requireUser } from "@/lib/api-guard";
import { jsonError, jsonOk } from "@/lib/http";
import { prisma } from "@/lib/prisma";
import { logWalletUnlock } from "@/lib/wallet-unlock-log";
import { isUnlockEventType } from "@/lib/wallet-unlock";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireUser(req);
  if (auth.error || !auth.user) {
    return auth.error ?? jsonError("Connexion requise.", 401);
  }

  const { id } = await params;
  const event = await prisma.walletEvent.findFirst({
    where: { id, userId: auth.user.id },
  });

  if (!event) {
    return jsonError("Événement introuvable.", 404);
  }

  if (!isUnlockEventType(event.type)) {
    return jsonError("Cet événement ne peut pas être acquitté.", 400);
  }

  if (event.acknowledgedAt) {
    return jsonOk({ ok: true, alreadyAcknowledged: true });
  }

  await prisma.walletEvent.update({
    where: { id: event.id },
    data: { acknowledgedAt: new Date() },
  });

  logWalletUnlock("événement acquitté", {
    eventId: event.id,
    eventType: event.type,
    merchantId: event.merchantId ?? undefined,
    membershipId: event.customerMembershipId ?? undefined,
    userId: auth.user.id,
  });

  return jsonOk({ ok: true });
}
