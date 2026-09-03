import { redirect } from "next/navigation";
import { DEMO_MERCHANT } from "@/lib/demo-visual";
import { resolveMerchantDemo } from "@/lib/merchant-demo-server";
import { canOpenCaisse, firstActiveStaffMembership } from "@/lib/rbac";
import { CaisseScreen } from "./ui";

export default async function CaissePage() {
  const { user, demo } = await resolveMerchantDemo();

  if (demo) {
    return <CaisseScreen merchantName={DEMO_MERCHANT.merchantName} role={DEMO_MERCHANT.role} demo />;
  }

  if (!user) redirect("/app/connexion");
  const membership = firstActiveStaffMembership(user.merchantMemberships);
  if (!membership || !canOpenCaisse(membership)) redirect("/app/connexion");

  return <CaisseScreen merchantName={membership.merchant.name} role={membership.role} />;
}
