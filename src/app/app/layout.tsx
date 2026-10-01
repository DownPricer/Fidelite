import { headers } from "next/headers";
import { redirect } from "next/navigation";
import {
  resolveMerchantAppAccess,
  shouldRedirectAppToEmployeeSpace,
} from "@/lib/merchant-app-access";
import { canViewStatistics } from "@/lib/rbac";
import { DEMO_MERCHANT } from "@/lib/demo-visual";
import DashboardLayoutClient from "./layout-client";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = (await headers()).get("x-pathname") ?? "";
  const access = await resolveMerchantAppAccess();

  if (shouldRedirectAppToEmployeeSpace({ access, pathname })) {
    console.info("[merchant-app-access] layout redirect", "/employe/scan");
    redirect("/employe/scan");
  }

  const admin =
    access.access === "MERCHANT_DEMO" || (access.access === "MERCHANT" && access.admin);
  const statsAccess =
    access.access === "MERCHANT_DEMO" ||
    (access.access === "MERCHANT" && canViewStatistics(access.membership));
  const identity =
    access.access === "MERCHANT_DEMO"
      ? { firstName: DEMO_MERCHANT.firstName, merchantName: DEMO_MERCHANT.merchantName }
      : access.access === "MERCHANT"
        ? { firstName: access.user.firstName, merchantName: access.membership.merchant.name }
        : null;

  return (
    <DashboardLayoutClient
      admin={admin}
      canViewStatistics={statsAccess}
      identity={identity}
      showNotifications={access.access === "MERCHANT" && access.admin}
    >
      {children}
    </DashboardLayoutClient>
  );
}
