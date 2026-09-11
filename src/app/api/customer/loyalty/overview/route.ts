import { NextResponse } from "next/server";

import { requireUser } from "@/lib/api-guard";
import { getCustomerLoyaltyOverview } from "@/lib/customer-loyalty-overview";
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
  const activityLimit = Number(url.searchParams.get("activityLimit") ?? 5);

  try {
    const overview = await getCustomerLoyaltyOverview({
      userId: auth.user.id,
      merchantId,
      merchantSlug,
      activityLimit: Number.isFinite(activityLimit) ? activityLimit : 5,
    });

    return NextResponse.json(overview, {
      status: 200,
      headers: {
        "Cache-Control": "private, no-store, must-revalidate",
      },
    });
  } catch (error) {
    console.error("[loyalty-overview]", error);
    return jsonError("Impossible de charger votre activité.", 500);
  }
}
