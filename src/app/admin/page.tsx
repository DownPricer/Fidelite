import { redirect } from "next/navigation";
import { isSuperAdmin } from "@/lib/rbac";
import { getSessionUser } from "@/lib/session";
import { AdminHome } from "./ui";

export default async function AdminPage() {
  const user = await getSessionUser();
  if (!user || !isSuperAdmin(user.platformRole)) redirect("/admin/connexion");
  return <AdminHome firstName={user.firstName} />;
}
