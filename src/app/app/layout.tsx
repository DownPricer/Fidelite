import { headers } from "next/headers";
import { redirect } from "next/navigation";
import {
  resolveMerchantAppAccess,
  shouldRedirectAppToEmployeeSpace,
} from "@/lib/merchant-app-access";
import { canViewStatistics } from "@/lib/rbac";
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

  return (
    <DashboardLayoutClient admin={admin} canViewStatistics={statsAccess}>
      {children}
    </DashboardLayoutClient>
  );
}
