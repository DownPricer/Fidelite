import { redirect } from "next/navigation";
import { WalletHome } from "@/components/fife-life/wallet-home";
import { demoWalletProps } from "@/lib/demo-visual";
import { isClientDemoPage } from "@/lib/demo-visual-server";
import { resolveClientNumber } from "@/lib/client-number";
import {
  buildCustomerProgramView,
  getActiveMerchantLoyaltyContext,
} from "@/lib/loyalty-context";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/session";
import { attachPublishedTemplates } from "@/lib/wallet-cards";
import { getCustomerLoyaltyOverview } from "@/lib/customer-loyalty-overview";

export const dynamic = "force-dynamic";

export default async function CarteIndexPage({
  searchParams,
}: {
  searchParams: Promise<{ demo?: string; sheet?: string; toast?: string }>;
}) {
  const params = await searchParams;
  const user = await getSessionUser();

  if (!user) {
    if (await isClientDemoPage(params)) {
      return <WalletHome {...demoWalletProps(params)} />;
    }
    redirect("/connexion");
  }

  const memberships = await prisma.customerMembership.findMany({
    where: { userId: user.id, removedAt: null, merchant: { isActive: true } },
    include: { merchant: true },
    orderBy: { updatedAt: "desc" },
  });

  const baseCards = (
    await Promise.all(
      memberships.map(async (item) => {
        const loyaltyContext = await getActiveMerchantLoyaltyContext(item.merchantId);
        if (!loyaltyContext || !loyaltyContext.isOperational) return null;
        const programView = buildCustomerProgramView(loyaltyContext, item.points);
        return {
          id: item.id,
          merchantId: item.merchantId,
          slug: item.merchant.slug,
          name: item.merchant.name,
          logoUrl: item.merchant.logoUrl,
          primaryColor: item.merchant.primaryColor,
          points: item.points,
          visitsRequired: programView.progressTarget,
          rewardLabel: programView.rewards[0]?.name ?? "Avantage",
          loyaltyMode: loyaltyContext.mode,
        };
      }),
    )
  ).filter((card): card is NonNullable<typeof card> => card !== null);

  const cards = await attachPublishedTemplates(baseCards);
  const overview = await getCustomerLoyaltyOverview({ userId: user.id, activityLimit: 5 });

  return (
    <WalletHome
      firstName={user.firstName}
      lastName={user.lastName ?? undefined}
      customerName={[user.firstName, user.lastName].filter(Boolean).join(" ") || user.firstName}
      clientNumber={resolveClientNumber({ clientNumber: user.clientNumber, userId: user.id })}
      fifeLifePoints={user.fifeLifePoints}
      initialSheetOpen={params.sheet === "1"}
      initialNewCard={params.toast ?? null}
      cards={cards}
      initialOverview={overview}
    />
  );
}
