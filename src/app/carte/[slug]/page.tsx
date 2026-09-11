import { redirect } from "next/navigation";
import { MerchantCardDetail } from "@/components/fife-life/merchant-detail";
import { PREVIEW_CARDS, PREVIEW_HISTORY } from "@/components/fife-life/preview-data";
import { isClientDemoPage } from "@/lib/demo-visual-server";
import { isGoogleWalletConfigured } from "@/lib/google-wallet";
import {
  buildCustomerProgramView,
  getActiveMerchantLoyaltyContext,
} from "@/lib/loyalty-context";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/session";
import { attachPublishedTemplates } from "@/lib/wallet-cards";
import { getCustomerLoyaltyOverview } from "@/lib/customer-loyalty-overview";

export const dynamic = "force-dynamic";

export default async function CardPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ demo?: string }>;
}) {
  const { slug } = await params;
  const query = await searchParams;
  const user = await getSessionUser();

  if (!user) {
    if (await isClientDemoPage(query)) {
      const card = PREVIEW_CARDS.find((item) => item.slug === slug) ?? PREVIEW_CARDS[0];
      return (
        <MerchantCardDetail
          slug={card.slug}
          preview
          walletEnabled={false}
          merchant={card}
          history={PREVIEW_HISTORY}
        />
      );
    }
    redirect("/connexion");
  }

  const membership = await prisma.customerMembership.findFirst({
    where: { userId: user.id, removedAt: null, merchant: { slug, isActive: true } },
    include: { merchant: true },
  });
  if (!membership) redirect(`/c/${slug}`);

  const loyaltyContext = await getActiveMerchantLoyaltyContext(membership.merchantId);
  if (!loyaltyContext || !loyaltyContext.isOperational) redirect(`/c/${slug}`);

  const programView = buildCustomerProgramView(loyaltyContext, membership.points);

  const history = await prisma.loyaltyTransaction.findMany({
    where: { customerMembershipId: membership.id },
    orderBy: { createdAt: "desc" },
    take: 20,
    select: {
      id: true,
      type: true,
      pointsDelta: true,
      reason: true,
      createdAt: true,
      metadata: true,
      ruleApplied: true,
    },
  });

  const overview = await getCustomerLoyaltyOverview({
    userId: user.id,
    merchantId: membership.merchantId,
    activityLimit: 5,
  });

  const [merchantCard] = await attachPublishedTemplates([
    {
      id: membership.id,
      merchantId: membership.merchantId,
      slug: membership.merchant.slug,
      name: membership.merchant.name,
      logoUrl: membership.merchant.logoUrl,
      primaryColor: membership.merchant.primaryColor,
      points: membership.points,
      visitsRequired: programView.progressTarget,
      rewardLabel: programView.rewards[0]?.name ?? "Avantage",
      loyaltyMode: loyaltyContext.mode,
    },
  ]);

  return (
    <MerchantCardDetail
      slug={slug}
      walletEnabled={isGoogleWalletConfigured()}
      merchant={merchantCard}
      programView={programView}
      nextReward={overview.nextReward}
      recentActivity={overview.recentActivity}
      activityTotal={overview.activityTotal}
      history={history.map((row) => ({
        id: row.id,
        type: row.type,
        pointsDelta: row.pointsDelta,
        reason: row.reason,
        createdAt: row.createdAt.toISOString(),
        metadata: (row.metadata as Record<string, unknown> | null) ?? null,
        ruleApplied: row.ruleApplied,
      }))}
    />
  );
}
