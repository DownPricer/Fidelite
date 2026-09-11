import { redirect } from "next/navigation";
import { MerchantRole } from "@prisma/client";
import { DEMO_MERCHANT } from "@/lib/demo-visual";
import { getEmployeeSession } from "@/lib/employee-session";
import { resolveMerchantDemo } from "@/lib/merchant-demo-server";
import { canOpenCaisse, firstActiveStaffMembership } from "@/lib/rbac";
import { CaisseScreen } from "./ui";

export default async function CaissePage() {
  const { user, demo } = await resolveMerchantDemo();
  if (!demo) {
    const employeeSession = await getEmployeeSession();
    if (employeeSession) {
      redirect("/employe/scan");
    }
  }

  if (demo) {
    return <CaisseScreen merchantName={DEMO_MERCHANT.merchantName} role={DEMO_MERCHANT.role} demo />;
  }

  if (!user) redirect("/app/connexion");
  const membership = firstActiveStaffMembership(user.merchantMemberships);
  if (!membership || !canOpenCaisse(membership)) redirect("/app/connexion");

  const isEmployeeOnly =
    membership.role === MerchantRole.EMPLOYEE &&
    !user.merchantMemberships.some((item) => item.role === MerchantRole.MERCHANT_ADMIN && item.isActive);
  if (isEmployeeOnly) {
    redirect("/employe/connexion");
  }

  return <CaisseScreen merchantName={membership.merchant.name} role={membership.role} />;
}