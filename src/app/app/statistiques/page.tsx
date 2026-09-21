import { redirect } from "next/navigation";
import { resolveMerchantDemo } from "@/lib/merchant-demo-server";
import { canViewStatistics, firstActiveStaffMembership } from "@/lib/rbac";
import { StatistiquesPanel } from "./statistiques-panel";
import { INSIGHT_DEMO_RESPONSE } from "./insight-demo-data";

export default async function StatistiquesPage() {
  const { user, demo } = await resolveMerchantDemo();

  if (demo) {
    return <StatistiquesPanel canManageInsight demoData={INSIGHT_DEMO_RESPONSE} />;
  }

  if (!user) redirect("/app/connexion");
  const membership = firstActiveStaffMembership(user.merchantMemberships);
  if (!membership || !canViewStatistics(membership)) redirect("/app");

  return <StatistiquesPanel canManageInsight={membership.role === "MERCHANT_ADMIN"} />;
}
