import { requireMutatingRequest, requireUser } from "@/lib/api-guard";
import {
  createSaveToWalletUrl,
  ensureLoyaltyClass,
  isGoogleWalletConfigured,
  upsertLoyaltyObject,
  walletIds,
} from "@/lib/google-wallet";
import { jsonError, jsonOk, readJson } from "@/lib/http";
import { computeLoyalty } from "@/lib/loyalty";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const schema = z.object({ slug: z.string().min(1) });

export async function POST(req: Request) {
  const csrf = await requireMutatingRequest(req);
  if (csrf.error) return csrf.error;
  const auth = await requireUser(req);
  if (auth.error || !auth.user) return auth.error ?? jsonError("Connexion requise.", 401);
  if (!isGoogleWalletConfigured()) {
    return jsonError("Google Wallet n'est pas encore configuré.", 503);
  }

  const parsed = schema.safeParse(await readJson(req));
  if (!parsed.success) return jsonError("Commerce manquant.");

  const membership = await prisma.customerMembership.findFirst({
    where: { userId: auth.user.id, merchant: { slug: parsed.data.slug, isActive: true } },
    include: { merchant: { include: { program: true } }, user: true },
  });
  if (!membership || !membership.merchant.program) return jsonError("Carte introuvable.", 404);

  try {
    const classId = await ensureLoyaltyClass({
      merchantId: membership.merchantId,
      slug: membership.merchant.slug,
      name: membership.merchant.name,
      logoUrl: membership.merchant.logoUrl,
      primaryColor: membership.merchant.primaryColor,
      rewardLabel: membership.merchant.program.rewardLabel,
      visitsRequired: membership.merchant.program.visitsRequired,
    });
    if (!classId) return jsonError("Google Wallet n'est pas encore configuré.", 503);

    const snapshot = computeLoyalty(membership.points, membership.merchant.program.visitsRequired);
    const objectId = await upsertLoyaltyObject({
      membershipId: membership.id,
      classId,
      firstName: membership.user.firstName,
      points: membership.points,
      visitsRequired: membership.merchant.program.visitsRequired,
      rewardAvailable: snapshot.rewardAvailable,
      merchantName: membership.merchant.name,
    });
    if (!objectId) return jsonError("Google Wallet n'est pas encore configuré.", 503);

    await prisma.customerMembership.update({
      where: { id: membership.id },
      data: { googleWalletClassId: classId, googleWalletObjectId: objectId },
    });

    const ids = walletIds(membership.id, membership.merchant.slug);
    const url = await createSaveToWalletUrl({ classId: ids.classId, objectId: ids.objectId });
    return jsonOk({ url });
  } catch (error) {
    console.error("[wallet] save url", error);
    return jsonError("Google Wallet est temporairement indisponible.", 503);
  }
}
