import { redirect } from "next/navigation";
import { firstActiveStaffMembership, canManageMerchantSettings } from "@/lib/rbac";
import { getSessionUser } from "@/lib/session";
import DashboardLayoutClient from "./layout-client";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await getSessionUser();
  if (!user) redirect("/app/connexion");
  
  const membership = firstActiveStaffMembership(user.merchantMemberships);
  if (!membership) redirect("/app/connexion");

  const admin = canManageMerchantSettings(membership.role);

  return (
    <DashboardLayoutClient admin={admin}>
      {children}
    </DashboardLayoutClient>
  );
}
