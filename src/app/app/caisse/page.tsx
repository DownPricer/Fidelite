import { redirect } from "next/navigation";
import { MerchantRole } from "@prisma/client";
import { DEMO_MERCHANT } from "@/lib/demo-visual";
import { resolveMerchantAppAccess } from "@/lib/merchant-app-access";
import { canOpenCaisse } from "@/lib/rbac";
import { CaisseScreen } from "./ui";

export default async function CaissePage() {
  const access = await resolveMerchantAppAccess();

  if (access.access === "MERCHANT_DEMO") {
    return <CaisseScreen merchantName={DEMO_MERCHANT.merchantName} role={DEMO_MERCHANT.role} demo />;
  }

  if (access.access === "EMPLOYEE_ONLY") {
    redirect("/employe/scan");
  }

  if (access.access !== "MERCHANT") {
    redirect("/app/connexion");
  }

  const { user, membership } = access;
  if (!canOpenCaisse(membership)) redirect("/app/connexion");

  const isEmployeeOnly =
    membership.role === MerchantRole.EMPLOYEE &&
    !user.merchantMemberships.some((item) => item.role === MerchantRole.MERCHANT_ADMIN && item.isActive);
  if (isEmployeeOnly) {
    redirect("/employe/connexion");
  }

  return <CaisseScreen merchantName={membership.merchant.name} role={membership.role} />;
}
