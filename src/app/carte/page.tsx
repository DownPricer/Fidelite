import { redirect } from "next/navigation";
import { WalletHome } from "@/components/fife-life/wallet-home";
import { demoWalletProps } from "@/lib/demo-visual";
import { isClientDemoPage } from "@/lib/demo-visual-server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/session";

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
    where: { userId: user.id, merchant: { isActive: true } },
    include: { merchant: { include: { program: true } } },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <WalletHome
      firstName={user.firstName}
      lastName={user.lastName ?? undefined}
      customerName={[user.firstName, user.lastName].filter(Boolean).join(" ") || user.firstName}
      fifeLifePoints={user.fifeLifePoints}
      initialSheetOpen={params.sheet === "1"}
      initialNewCard={params.toast ?? null}
      cards={memberships
        .filter((item) => item.merchant.program)
        .map((item) => ({
          id: item.id,
          merchantId: item.merchantId,
          slug: item.merchant.slug,
          name: item.merchant.name,
          logoUrl: item.merchant.logoUrl,
          primaryColor: item.merchant.primaryColor,
          points: item.points,
          visitsRequired: item.merchant.program!.visitsRequired,
          rewardLabel: item.merchant.program!.rewardLabel,
        }))}
    />
  );
}
