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
    <main className="px-6 py-8 lg:px-12 lg:py-12 max-w-7xl mx-auto">
      <header className="mb-8">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted/60">Gestion</p>
        <h1 className="mt-1 text-3xl font-black tracking-tight lg:text-4xl">Équipe</h1>
      </header>
      <EmployeesPanel />
    </main>
  );
}
