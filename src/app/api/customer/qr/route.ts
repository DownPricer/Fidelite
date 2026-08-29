import { randomUUID } from "crypto";
import QRCode from "qrcode";
import { requireMutatingRequest, requireUser } from "@/lib/api-guard";
import { env } from "@/lib/env";
import { clientIp, jsonError, jsonOk, readJson } from "@/lib/http";
import { prisma } from "@/lib/prisma";
import { signQrToken } from "@/lib/qr";
import { LIMITS, rateLimit } from "@/lib/rate-limit";
import { z } from "zod";

const schema = z.object({
  slug: z.string().min(1),
});

export async function POST(req: Request) {
  const csrf = await requireMutatingRequest(req);
  if (csrf.error) return csrf.error;
  const auth = await requireUser(req);
  if (auth.error || !auth.user) return auth.error ?? jsonError("Connexion requise.", 401);

  const parsed = schema.safeParse(await readJson(req));
  if (!parsed.success) return jsonError("Commerce manquant.");

  const limited = rateLimit(`qr:${auth.user.id}`, LIMITS.qr.limit, LIMITS.qr.windowMs);
  if (!limited.ok) return jsonError("Trop de demandes. Réessayez dans un instant.", 429);

  const membership = await prisma.customerMembership.findFirst({
    where: {
      userId: auth.user.id,
      merchant: { slug: parsed.data.slug, isActive: true },
    },
  });
  if (!membership) return jsonError("Carte introuvable.", 404);

  const jti = randomUUID();
  const expiresAt = new Date(Date.now() + env.qrTtlSeconds * 1000);
  await prisma.qrToken.create({
    data: {
      jti,
      customerMembershipId: membership.id,
      merchantId: membership.merchantId,
      expiresAt,
    },
  });

  const token = await signQrToken({
    membershipId: membership.id,
    merchantId: membership.merchantId,
    jti,
  });
  const dataUrl = await QRCode.toDataURL(token, {
    errorCorrectionLevel: "M",
    margin: 1,
    width: 320,
    color: { dark: "#0F172A", light: "#FFFFFF" },
  });

  return jsonOk({
    image: dataUrl,
    expiresAt: expiresAt.toISOString(),
    ttlSeconds: env.qrTtlSeconds,
    generatedAt: new Date().toISOString(),
    ipHint: clientIp(req) === "unknown" ? undefined : true,
  });
}
