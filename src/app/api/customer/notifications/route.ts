import { requireMutatingRequest, requireUser } from "@/lib/api-guard";
import { jsonError, jsonOk, readJson } from "@/lib/http";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

/** Centre de notifications client (Partie 5) : liste paginée + état lu/non lu. */
export async function GET(req: Request) {
  const auth = await requireUser(req);
  if (auth.error || !auth.user) return auth.error ?? jsonError("Connexion requise.", 401);

  const url = new URL(req.url);
  const cursor = url.searchParams.get("cursor");
  const filter = url.searchParams.get("filter"); // "offers" | "info" | null (tout)
  const limit = 20;

  const where = {
    userId: auth.user.id,
    ...(filter === "offers" ? { kind: { in: ["MERCHANT_OFFER", "NETWORK_DEAL"] as const } } : {}),
    ...(filter === "info" ? { kind: "SERVICE" as const } : {}),
  };

  const [items, unreadCount] = await Promise.all([
    prisma.inAppNotification.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: limit + 1,
      ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
    }),
    prisma.inAppNotification.count({ where: { userId: auth.user.id, readAt: null } }),
  ]);

  const hasMore = items.length > limit;
  const page = hasMore ? items.slice(0, limit) : items;

  return jsonOk({
    notifications: page,
    nextCursor: hasMore ? page[page.length - 1]?.id : null,
    unreadCount,
  });
}

const markReadSchema = z.object({
  id: z.string().min(1).optional(),
  all: z.boolean().optional(),
});

/** Marque une notification (ou toutes) comme lue. */
export async function PATCH(req: Request) {
  const csrf = await requireMutatingRequest(req);
  if (csrf.error) return csrf.error;
  const auth = await requireUser(req);
  if (auth.error || !auth.user) return auth.error ?? jsonError("Connexion requise.", 401);

  const parsed = markReadSchema.safeParse(await readJson(req));
  if (!parsed.success) return jsonError("Requête invalide.");

  if (parsed.data.all) {
    await prisma.inAppNotification.updateMany({
      where: { userId: auth.user.id, readAt: null },
      data: { readAt: new Date() },
    });
    return jsonOk({ ok: true });
  }

  if (!parsed.data.id) return jsonError("Identifiant requis.");

  await prisma.inAppNotification.updateMany({
    where: { id: parsed.data.id, userId: auth.user.id },
    data: { readAt: new Date() },
  });
  return jsonOk({ ok: true });
}
