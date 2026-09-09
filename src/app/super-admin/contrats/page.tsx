import { redirect } from "next/navigation";
import { getSuperAdminSessionUser } from "@/lib/super-admin-session";
import { ContractsPage } from "./contracts-home";

export default async function SuperAdminContractsPage() {
  const user = await getSuperAdminSessionUser();
  if (!user) redirect("/super-admin/connexion");
  return <ContractsPage firstName={user.firstName} />;
}
