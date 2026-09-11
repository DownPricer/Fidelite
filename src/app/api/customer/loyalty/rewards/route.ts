import { NextResponse } from "next/server";

import { requireUser } from "@/lib/api-guard";
import { getCustomerMerchantRewardProgress } from "@/lib/customer-reward-progress";
import { jsonError } from "@/lib/http";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const auth = await requireUser(req);
  if (auth.error || !auth.user) {
    return auth.error ?? jsonError("Connexion requise.", 401);
  }

  const url = new URL(req.url);
  const merchantSlug = url.searchParams.get("merchantSlug") ?? undefined;
  const merchantId = url.searchParams.get("merchantId") ?? undefined;

  try {
    const progress = await getCustomerMerchantRewardProgress({
      userId: auth.user.id,
      merchantSlug,
      merchantId,
    });
    if (!progress) {
      return jsonError("Programme introuvable.", 404);
    }
    return NextResponse.json(progress, {
      status: 200,
      headers: { "Cache-Control": "private, no-store, must-revalidate" },
    });
  } catch (error) {
    console.error("[customer-loyalty-rewards]", error);
    return jsonError("Impossible de charger vos avantages.", 500);
  }
}
