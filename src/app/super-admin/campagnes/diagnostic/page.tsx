import { redirect } from "next/navigation";
import { getSuperAdminSessionUser } from "@/lib/super-admin-session";
import { DiagnosticPage } from "./diagnostic";

export default async function SuperAdminDiagnosticPage() {
  const user = await getSuperAdminSessionUser();
  if (!user) redirect("/super-admin/connexion");
  return <DiagnosticPage firstName={user.firstName} />;
}
