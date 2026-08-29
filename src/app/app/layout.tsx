import { firstActiveStaffMembership, canManageMerchantSettings } from "@/lib/rbac";
import { getSessionUser } from "@/lib/session";
import DashboardLayoutClient from "./layout-client";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await getSessionUser();
  const membership = user ? firstActiveStaffMembership(user.merchantMemberships) : null;
  const admin = membership ? canManageMerchantSettings(membership.role) : false;

  return (
    <DashboardLayoutClient admin={admin}>
      {children}
    </DashboardLayoutClient>
  );
}
