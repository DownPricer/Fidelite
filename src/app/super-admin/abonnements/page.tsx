import { redirect } from "next/navigation";
import { getSuperAdminSessionUser } from "@/lib/super-admin-session";
import { SubscriptionsPage } from "./subscriptions-home";

export default async function SuperAdminSubscriptionsPage() {
  const user = await getSuperAdminSessionUser();
  if (!user) redirect("/super-admin/connexion");
  return <SubscriptionsPage firstName={user.firstName} />;
}
