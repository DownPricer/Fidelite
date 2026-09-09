import { redirect } from "next/navigation";
import { MerchantCardDetail } from "@/components/fife-life/merchant-detail";
import { PREVIEW_CARDS, PREVIEW_HISTORY } from "@/components/fife-life/preview-data";
import { isClientDemoPage } from "@/lib/demo-visual-server";
import { isGoogleWalletConfigured } from "@/lib/google-wallet";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/session";
import { attachPublishedTemplates } from "@/lib/wallet-cards";

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
    where: { userId: user.id, merchant: { slug, isActive: true } },
    include: { merchant: { include: { program: true } } },
  });
  if (!membership || !membership.merchant.program) redirect(`/c/${slug}`);

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
    },
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
      visitsRequired: membership.merchant.program.visitsRequired,
      rewardLabel: membership.merchant.program.rewardLabel,
      loyaltyMode: membership.merchant.program.mode,
    },
  ]);

  return (
    <MerchantCardDetail
      slug={slug}
      walletEnabled={isGoogleWalletConfigured()}
      merchant={merchantCard}
      history={history.map((row) => ({
        id: row.id,
        type: row.type,
        pointsDelta: row.pointsDelta,
        reason: row.reason,
        createdAt: row.createdAt.toISOString(),
      }))}
    />
  );
}
