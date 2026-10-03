import { redirect } from "next/navigation";
import { WalletAvantagesPage } from "@/components/fife-life/wallet-avantages-page";
import { isClientDemoPage } from "@/lib/demo-visual-server";
import { getCustomerLoyaltyOverview } from "@/lib/customer-loyalty-overview";
import { getSessionUser } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function CarteAvantagesPage({
  searchParams,
}: {
  searchParams: Promise<{ demo?: string; apercu?: string }>;
}) {
  const params = await searchParams;
  const user = await getSessionUser();

  if (!user) {
    if (await isClientDemoPage(params)) {
      return <WalletAvantagesPage preview cardRewards={[]} />;
    }
    redirect("/connexion");
  }

  const overview = await getCustomerLoyaltyOverview({ userId: user.id, activityLimit: 0 });
  return <WalletAvantagesPage cardRewards={overview.cardRewards} />;
}
