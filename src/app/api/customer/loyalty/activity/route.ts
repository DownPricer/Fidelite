import { NextResponse } from "next/server";

import { requireUser } from "@/lib/api-guard";
import { getCustomerLoyaltyActivity } from "@/lib/customer-loyalty-overview";
import { jsonError } from "@/lib/http";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const auth = await requireUser(req);
  if (auth.error || !auth.user) {
    return auth.error ?? jsonError("Connexion requise.", 401);
  }

  const url = new URL(req.url);
  const merchantSlug = url.searchParams.get("merchantSlug") ?? undefined;
  const merchantIdParam = url.searchParams.get("merchantId") ?? undefined;
  const cursor = url.searchParams.get("cursor");
  const limit = Number(url.searchParams.get("limit") ?? 20);

  let merchantId = merchantIdParam;
  if (merchantSlug && !merchantId) {
    const membership = await prisma.customerMembership.findFirst({
      where: {
        userId: auth.user.id,
        removedAt: null,
        merchant: { slug: merchantSlug, isActive: true },
      },
      select: { merchantId: true },
    });
    if (!membership) return jsonError("Commerce introuvable.", 404);
    merchantId = membership.merchantId;
  }

  try {
    const result = await getCustomerLoyaltyActivity({
      userId: auth.user.id,
      merchantId,
      limit: Number.isFinite(limit) ? limit : 20,
      cursor,
    });

    return NextResponse.json(result, {
      status: 200,
      headers: {
        "Cache-Control": "private, no-store, must-revalidate",
      },
    });
  } catch (error) {
    console.error("[loyalty-activity]", error);
    return jsonError("Impossible de charger l'historique.", 500);
  }
}
