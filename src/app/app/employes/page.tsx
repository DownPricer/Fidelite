import { redirect } from "next/navigation";
import { AppNav } from "@/components/app-nav";
import { canManageEmployees, firstActiveStaffMembership } from "@/lib/rbac";
import { getSessionUser } from "@/lib/session";
import { EmployeesPanel } from "./ui";

export default async function EmployeesPage() {
  const user = await getSessionUser();
  if (!user) redirect("/app/connexion");
  const membership = firstActiveStaffMembership(user.merchantMemberships);
  if (!membership || !canManageEmployees(membership.role)) redirect("/app");

  return (
    <main className="mx-auto max-w-3xl px-6 py-8">
      <h1 className="text-3xl font-semibold">Employés</h1>
      <AppNav admin />
      <EmployeesPanel />
    </main>
  );
}
