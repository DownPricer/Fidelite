import { resolveMerchantDemo } from "@/lib/merchant-demo-server";import { firstActiveStaffMembership, canManageMerchantSettings } from "@/lib/rbac";
import DashboardLayoutClient from "./layout-client";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, demo } = await resolveMerchantDemo();
  const membership = user ? firstActiveStaffMembership(user.merchantMemberships) : null;
  const admin = demo || (membership ? canManageMerchantSettings(membership.role) : false);

  return (
    <DashboardLayoutClient admin={admin}>
      {children}
    </DashboardLayoutClient>
  );
}
