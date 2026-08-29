import { requireCaisse, requireMutatingRequest } from "@/lib/api-guard";
import { writeAudit } from "@/lib/audit";
import { clientIp, jsonError, jsonOk, readJson, userAgent } from "@/lib/http";
import { computeLoyalty } from "@/lib/loyalty";
import { prisma } from "@/lib/prisma";
import { QrError, publicQrErrorMessage, verifyQrToken } from "@/lib/qr";
import { LIMITS, rateLimit } from "@/lib/rate-limit";
import { scanSchema, zodErrorMessage } from "@/lib/validation";

export async function POST(req: Request) {
  const csrf = await requireMutatingRequest(req);
  if (csrf.error) return csrf.error;
  const staff = await requireCaisse(req);
  if (staff.error || !staff.user || !staff.membership) return staff.error ?? jsonError("Accès refusé.", 403);

  const parsed = scanSchema.safeParse(await readJson(req));
  if (!parsed.success) return jsonError(zodErrorMessage(parsed.error));

  const limited = rateLimit(`scan:${staff.user.id}`, LIMITS.scan.limit, LIMITS.scan.windowMs);
  if (!limited.ok) return jsonError("Trop de scans. Patientez un instant.", 429);

  try {
    const payload = await verifyQrToken(parsed.data.token.trim());
    const stored = await prisma.qrToken.findUnique({ where: { jti: payload.jti } });
    if (!stored) {
      return jsonError("QR invalide.", 400);
    }

    // Vérifie que le QR appartient bien au commerce actuel.
    if (stored.merchantId !== staff.membership.merchantId) {
      throw new QrError("Ce QR n'appartient pas à ce commerce.");
    }

    const membership = await prisma.customerMembership.findFirst({
      where: { id: stored.customerMembershipId, merchantId: staff.membership.merchantId },
      include: {
        user: true,
        merchant: { include: { program: true } },
      },
    });
    if (!membership || !membership.merchant.program) {
      return jsonError("Carte introuvable.", 404);
    }

    const now = new Date();
    // On conserve la trace d'utilisation sans bloquer les scans ultérieurs.
    await prisma.qrToken.update({
      where: { id: stored.id },
      data: { usedAt: now },
    });

    const grant = await prisma.caisseGrant.create({
      data: {
        qrTokenId: stored.id,
        customerMembershipId: membership.id,
        merchantId: staff.membership.merchantId,
        actorUserId: staff.user.id,
        expiresAt: new Date(now.getTime() + 90_000),
      },
    });

    await writeAudit({
      actorId: staff.user.id,
      merchantId: staff.membership.merchantId,
      action: "CAISSE_SCAN",
      metadata: { membershipId: membership.id, grantId: grant.id },
      ip: clientIp(req),
      userAgent: userAgent(req),
    });

    const snapshot = computeLoyalty(membership.points, membership.merchant.program.visitsRequired);
    return jsonOk({
      grantId: grant.id,
      firstName: membership.user.firstName,
      points: membership.points,
      visitsRequired: membership.merchant.program.visitsRequired,
      rewardLabel: membership.merchant.program.rewardLabel,
      rewardAvailable: snapshot.rewardAvailable,
      progressLabel: snapshot.progressLabel,
      expiresAt: grant.expiresAt.toISOString(),
    });
  } catch (error) {
    return jsonError(publicQrErrorMessage(error), 400);
  }
}
