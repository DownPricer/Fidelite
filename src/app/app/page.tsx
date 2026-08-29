import { redirect } from "next/navigation";
import { canManageMerchantSettings, canOpenCaisse, firstActiveStaffMembership } from "@/lib/rbac";
import { getSessionUser } from "@/lib/session";
import { MerchantHome } from "./ui";

export default async function MerchantHomePage() {
  const user = await getSessionUser();
  if (!user) redirect("/app/connexion");
  const membership = firstActiveStaffMembership(user.merchantMemberships);
  if (!membership || !canOpenCaisse(membership.role)) redirect("/app/connexion");
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
