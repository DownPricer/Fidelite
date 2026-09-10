import { NextResponse } from "next/server";

import { requireUser } from "@/lib/api-guard";
import { jsonError } from "@/lib/http";
import { prisma } from "@/lib/prisma";
import { attachPublishedTemplates } from "@/lib/wallet-cards";
import { normalizePublishedWalletTemplate } from "@/lib/wallet-card-template";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const auth = await requireUser(req);
  if (auth.error || !auth.user) {
    return auth.error ?? jsonError("Connexion requise.", 401);
  }

  const url = new URL(req.url);
  const membershipId = url.searchParams.get("membershipId") ?? undefined;
  const merchantId = url.searchParams.get("merchantId") ?? undefined;

  if (!membershipId && !merchantId) {
    return jsonError("Carte introuvable.", 400);
  }

  const membership = await prisma.customerMembership.findFirst({
    where: {
      userId: auth.user.id,
      removedAt: null,
      merchant: { isActive: true },
      ...(membershipId ? { id: membershipId } : {}),
      ...(merchantId ? { merchantId } : {}),
    },
    include: { merchant: { include: { program: true } } },
  });

  if (!membership || !membership.merchant.program) {
    return jsonError("Carte introuvable.", 404);
  }

  const [cardBase] = await attachPublishedTemplates([
    {
      id: membership.id,
      merchantId: membership.merchantId,
      slug: membership.merchant.slug,
      name: membership.merchant.name,
      logoUrl: membership.merchant.logoUrl,
      primaryColor: membership.merchant.primaryColor,
      points: membership.points,
      visitsRequired: membership.merchant.program.visitsRequired,
      rewardLabel: membership.merchant.program.rewardLabel,
      loyaltyMode: membership.merchant.program.mode,
    },
  ]);

  const cardWithTemplate = cardBase as typeof cardBase & {
    cardTemplate?: Parameters<typeof normalizePublishedWalletTemplate>[0];
  };
  const cardTemplate = normalizePublishedWalletTemplate(cardWithTemplate.cardTemplate ?? null);
  const card = { ...cardWithTemplate, cardTemplate };

  return NextResponse.json(
    { card },
    {
      status: 200,
      headers: {
        "Cache-Control": "private, no-store, must-revalidate",
      },
    },
  );
}
