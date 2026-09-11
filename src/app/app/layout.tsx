import { redirect } from "next/navigation";
import { shouldRedirectAppLayoutToEmployee } from "@/lib/demo-routing";
import { getEmployeeSession } from "@/lib/employee-session";
import { resolveMerchantDemo } from "@/lib/merchant-demo-server";
import { firstActiveStaffMembership, canManageMerchantSettings } from "@/lib/rbac";
import DashboardLayoutClient from "./layout-client";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, demo } = await resolveMerchantDemo();
  const employee = demo ? null : await getEmployeeSession();
  if (
    shouldRedirectAppLayoutToEmployee({
      merchantDemoActive: demo,
      employeeSessionActive: Boolean(employee),
    })
  ) {
    console.info("[demo-routing] décision layout", "redirect-employee");
    redirect("/employe/scan");
  }
  if (demo) {
    console.info("[demo-routing] décision layout", "allow-merchant-demo");
  }
  const membership = user ? firstActiveStaffMembership(user.merchantMemberships) : null;
  const admin = demo || (membership ? canManageMerchantSettings(membership.role) : false);

  return (
    <DashboardLayoutClient admin={admin}>
      {children}
    </DashboardLayoutClient>
  );
}
