import { jsonError, jsonOk } from "@/lib/http";
import { isGoogleWalletConfigured } from "@/lib/google-wallet";
import { computeLoyalty } from "@/lib/loyalty";
import { prisma } from "@/lib/prisma";
import { getRequestUser } from "@/lib/session";

export async function GET(req: Request) {
  const user = await getRequestUser(req);
  if (!user) return jsonError("Connexion requise.", 401);

  const slug = new URL(req.url).searchParams.get("slug");
  if (!slug) return jsonError("Commerce manquant.");

  const membership = await prisma.customerMembership.findFirst({
    where: {
      userId: user.id,
      merchant: { slug, isActive: true },
    },
    include: {
      merchant: { include: { program: true } },
    },
  });
  if (!membership || !membership.merchant.program) {
    return jsonError("Carte introuvable.", 404);
  }

  const snapshot = computeLoyalty(membership.points, membership.merchant.program.visitsRequired);
  return jsonOk({
    firstName: user.firstName,
    merchant: {
      name: membership.merchant.name,
      slug: membership.merchant.slug,
      logoUrl: membership.merchant.logoUrl,
      primaryColor: membership.merchant.primaryColor,
      rewardLabel: membership.merchant.program.rewardLabel,
    },
    snapshot,
    walletEnabled: isGoogleWalletConfigured(),
  });
}
