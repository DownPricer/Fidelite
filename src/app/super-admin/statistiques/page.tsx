import { redirect } from "next/navigation";
import { getSuperAdminSessionUser } from "@/lib/super-admin-session";
import { StatisticsPage } from "./statistics-home";

export default async function SuperAdminStatsPage() {
  const user = await getSuperAdminSessionUser();
  if (!user) redirect("/super-admin/connexion");
  return <StatisticsPage firstName={user.firstName} />;
}
