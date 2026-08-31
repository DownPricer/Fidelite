import { randomUUID } from "crypto";
import QRCode from "qrcode";
import { requireMutatingRequest, requireUser } from "@/lib/api-guard";
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

  // S'assure qu'une carte existe bien pour ce commerce, sans en déduire le QR.
  const merchant = await prisma.merchant.findUnique({
    where: { slug: parsed.data.slug },
  });
  if (!merchant || !merchant.isActive) return jsonError("Commerce introuvable.", 404);

  await prisma.customerMembership.upsert({
    where: {
      userId_merchantId: {
        userId: auth.user.id,
        merchantId: merchant.id,
      },
    },
    update: {},
    create: {
      userId: auth.user.id,
      merchantId: merchant.id,
    },
  });

  // QR fixe et universel : un seul identifiant opaque (jti) par utilisateur.
  let qr = await prisma.fifeLifeQrToken.findUnique({
    where: { userId: auth.user.id },
  });

  if (!qr) {
    qr = await prisma.fifeLifeQrToken.create({
      data: {
        id: randomUUID(),
        userId: auth.user.id,
        jti: randomUUID(),
      },
    });
  }

  const token = await signQrToken({ jti: qr.jti });
  const dataUrl = await QRCode.toDataURL(token, {
    errorCorrectionLevel: "M",
    margin: 1,
    width: 320,
    color: { dark: "#0F172A", light: "#FFFFFF" },
  });

  return jsonOk({
    image: dataUrl,
    generatedAt: new Date().toISOString(),
    ipHint: clientIp(req) === "unknown" ? undefined : true,
  });
}
