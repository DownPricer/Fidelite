import { redirect } from "next/navigation";
import { DEMO_MERCHANT } from "@/lib/demo-visual";
import { resolveMerchantDemo } from "@/lib/merchant-demo-server";
import { canManageMerchantSettings, canOpenCaisse, firstActiveStaffMembership } from "@/lib/rbac";
import { MerchantHome } from "./ui";

export default async function MerchantHomePage() {
  const { user, demo } = await resolveMerchantDemo();
  if (demo) {
    return (
      <MerchantHome
        firstName={DEMO_MERCHANT.firstName}
        role={DEMO_MERCHANT.role}
        merchantName={DEMO_MERCHANT.merchantName}
        canAdmin
        demoStats={DEMO_MERCHANT.stats}
      />
    );
  }
  if (!user) redirect("/app/connexion");

  const membership = firstActiveStaffMembership(user.merchantMemberships);
  if (!membership || !canOpenCaisse(membership)) redirect("/app/connexion");
  if (membership.role === "EMPLOYEE") redirect("/app/caisse");

  return (
    <MerchantHome
      firstName={user.firstName}
      role={membership.role}
      merchantName={membership.merchant.name}
      canAdmin={canManageMerchantSettings(membership.role)}
    />
  );
}
