import { redirect } from "next/navigation";
import { MerchantCardDetail } from "@/components/fife-life/merchant-detail";
import { PREVIEW_CARDS, PREVIEW_HISTORY } from "@/components/fife-life/preview-data";
import { isClientDemoPage } from "@/lib/demo-visual-server";
import { isGoogleWalletConfigured } from "@/lib/google-wallet";
import { loyaltyBalanceForMode } from "@/lib/loyalty-balance";
import {
  buildCustomerProgramView,
  getActiveMerchantLoyaltyContext,
  resolveWalletCardObjective,
} from "@/lib/loyalty-context";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/session";
import { attachPublishedTemplates } from "@/lib/wallet-cards";
import { getCustomerLoyaltyOverview } from "@/lib/customer-loyalty-overview";
import { getCustomerMerchantRewardProgress } from "@/lib/customer-reward-progress";
import { resolveClientNumber } from "@/lib/client-number";

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

  const activeBalance = loyaltyBalanceForMode(membership, loyaltyContext.mode);
  const programView = buildCustomerProgramView(loyaltyContext, activeBalance);

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

  const [overview, rewardProgress] = await Promise.all([
    getCustomerLoyaltyOverview({
      userId: user.id,
      merchantId: membership.merchantId,
      activityLimit: 3,
    }),
    getCustomerMerchantRewardProgress({
      userId: user.id,
      merchantId: membership.merchantId,
    }),
  ]);

  const detailRewardEntry = overview.cardRewards.find((entry) => entry.membershipId === membership.id);
  const detailReward = detailRewardEntry?.nextReward ?? overview.nextReward;
  const objective = resolveWalletCardObjective(programView, activeBalance, detailReward);

  const [merchantCard] = await attachPublishedTemplates([
    {
      id: membership.id,
      merchantId: membership.merchantId,
      slug: membership.merchant.slug,
      name: membership.merchant.name,
      logoUrl: membership.merchant.logoUrl,
      primaryColor: membership.merchant.primaryColor,
      points: activeBalance,
      visitsRequired: objective.visitsRequired,
      rewardLabel: objective.rewardLabel,
      loyaltyMode: loyaltyContext.mode,
      addressLine1: membership.merchant.addressLine1,
      addressLine2: membership.merchant.addressLine2,
      postalCode: membership.merchant.postalCode,
      city: membership.merchant.city,
      country: membership.merchant.country,
      website: membership.merchant.website,
      publicPhone: membership.merchant.publicPhone,
      publicEmail: membership.merchant.publicEmail,
    },
  ]);

  return (
    <MerchantCardDetail
      slug={slug}
      walletEnabled={isGoogleWalletConfigured()}
      merchant={merchantCard}
      programView={programView}
      nextReward={overview.nextReward}
      rewardProgress={rewardProgress}
      clientName={[user.firstName, user.lastName].filter(Boolean).join(" ") || user.firstName}
      clientNumber={resolveClientNumber({ clientNumber: user.clientNumber, userId: user.id })}
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
