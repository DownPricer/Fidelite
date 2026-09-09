import { requireMutatingRequest, requireUser } from "@/lib/api-guard";
import { jsonError, jsonOk } from "@/lib/http";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  req: Request,
  context: { params: Promise<{ slug: string }> },
) {
  const csrf = await requireMutatingRequest(req);
  if (csrf.error) return csrf.error;

  const auth = await requireUser(req);
  if (auth.error || !auth.user) return auth.error ?? jsonError("Connexion requise.", 401);

  const { slug } = await context.params;

  const membership = await prisma.customerMembership.findFirst({
    where: {
      userId: auth.user.id,
      removedAt: null,
      merchant: { slug, isActive: true },
    },
    include: { merchant: true },
  });

  if (!membership) {
    return jsonError("Carte introuvable dans votre portefeuille.", 404);
  }

  await prisma.$transaction(async (tx) => {
    await tx.customerMembership.update({
      where: { id: membership.id },
      data: { removedAt: new Date() },
    });
    await tx.walletEvent.create({
      data: {
        userId: auth.user!.id,
        merchantId: membership.merchantId,
        customerMembershipId: membership.id,
        type: "CARD_REMOVED",
        payload: {
          merchantName: membership.merchant.name,
          slug: membership.merchant.slug,
        },
      },
    });
  });

  return jsonOk({ ok: true });
}
