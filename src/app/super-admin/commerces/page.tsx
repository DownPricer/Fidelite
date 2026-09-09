import { redirect } from "next/navigation";
import { getSuperAdminSessionUser } from "@/lib/super-admin-session";
import { MerchantsListPage } from "./merchants-list";

export default async function SuperAdminMerchantsPage() {
  const user = await getSuperAdminSessionUser();
  if (!user) redirect("/super-admin/connexion");
  return <MerchantsListPage firstName={user.firstName} />;
}
