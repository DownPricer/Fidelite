import { redirect } from "next/navigation";
import { getSuperAdminSessionUser } from "@/lib/super-admin-session";
import { AuditPage } from "./audit-home";

export default async function SuperAdminAuditPage() {
  const user = await getSuperAdminSessionUser();
  if (!user) redirect("/super-admin/connexion");
  return <AuditPage firstName={user.firstName} />;
}
