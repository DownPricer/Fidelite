import { requireMutatingRequest, requireUser } from "@/lib/api-guard";
import { hashToken, tokenFromRequest } from "@/lib/session";
import { jsonError, jsonOk } from "@/lib/http";
import { prisma } from "@/lib/prisma";

function parseUserAgent(ua: string | null) {
  if (!ua) return "Appareil inconnu";
  if (/iphone|ipad|ipod/i.test(ua)) return "iPhone / iPad";
  if (/android/i.test(ua)) return "Android";
  if (/windows/i.test(ua)) return "Windows";
  if (/macintosh|mac os/i.test(ua)) return "Mac";
  if (/linux/i.test(ua)) return "Linux";
  return "Navigateur";
}

export async function GET(req: Request) {
  const auth = await requireUser(req);
  if (auth.error || !auth.user) return auth.error ?? jsonError("Connexion requise.", 401);

  const currentToken = tokenFromRequest(req);
  const currentHash = currentToken ? hashToken(currentToken) : null;

  const sessions = await prisma.session.findMany({
    where: { userId: auth.user.id, expiresAt: { gt: new Date() } },
    orderBy: { createdAt: "desc" },
    select: { id: true, userAgent: true, ip: true, createdAt: true, tokenHash: true },
  });

  return jsonOk({
    sessions: sessions.map((s) => ({
      id: s.id,
      device: parseUserAgent(s.userAgent),
      ip: s.ip,
      createdAt: s.createdAt.toISOString(),
      current: currentHash !== null && s.tokenHash === currentHash,
    })),
  });
}

export async function DELETE(req: Request) {
  const csrf = await requireMutatingRequest(req);
  if (csrf.error) return csrf.error;
  const auth = await requireUser(req);
  if (auth.error || !auth.user) return auth.error ?? jsonError("Connexion requise.", 401);

  const currentToken = tokenFromRequest(req);
  const currentHash = currentToken ? hashToken(currentToken) : null;

  await prisma.session.deleteMany({
    where: {
      userId: auth.user.id,
      ...(currentHash ? { tokenHash: { not: currentHash } } : {}),
    },
  });

  return jsonOk({ ok: true });
}
