import { redirect } from "next/navigation";

import { cardSlotEditorPath, cardSlotForLoyaltyMode } from "@/lib/merchant-card-slots";
import { prisma } from "@/lib/prisma";

export default async function LegacyCardEditorRedirect({
  params,
  searchParams,
}: {
  params: Promise<{ merchantId: string }>;
  searchParams: Promise<{ mode?: string }>;
}) {
  const { merchantId } = await params;
  const query = await searchParams;
  const fromMode = query.mode?.trim().toUpperCase();
  const validModes = ["VISITS", "POINTS_BY_AMOUNT", "FIXED_POINTS", "AMOUNT_TIERS"] as const;

  if (fromMode && validModes.includes(fromMode as (typeof validModes)[number])) {
    redirect(cardSlotEditorPath(merchantId, cardSlotForLoyaltyMode(fromMode as (typeof validModes)[number])));
  }

  const program = await prisma.loyaltyProgram.findUnique({
    where: { merchantId },
    select: { mode: true },
  });
  const slot = program?.mode ? cardSlotForLoyaltyMode(program.mode) : "GENERAL";
  redirect(cardSlotEditorPath(merchantId, slot));
}
