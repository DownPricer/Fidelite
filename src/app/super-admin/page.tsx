import { redirect } from "next/navigation";
import { getSuperAdminSessionUser } from "@/lib/super-admin-session";
import { DashboardHome } from "./dashboard-home";

export default async function SuperAdminPage() {
  const user = await getSuperAdminSessionUser();
  if (!user) redirect("/super-admin/connexion");
  return <DashboardHome firstName={user.firstName} />;
}
