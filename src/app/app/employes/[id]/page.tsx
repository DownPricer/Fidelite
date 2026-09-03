import { redirect } from "next/navigation";
import { EmployeeDetailPanel } from "../ui";
import { resolveMerchantDemo } from "@/lib/merchant-demo-server";
import { canManageEmployees, firstActiveStaffMembership } from "@/lib/rbac";

export default async function EmployeeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { user, demo } = await resolveMerchantDemo();

  if (demo) {
    return (
      <main className="obsidian-scene mx-auto max-w-3xl px-5 py-6">
        <EmployeeDetailPanel id={id} demo />
      </main>
    );
  }

  if (!user) redirect("/app/connexion");
  const membership = firstActiveStaffMembership(user.merchantMemberships);
  if (!membership || !canManageEmployees(membership.role)) redirect("/app");

  return (
    <main className="obsidian-scene mx-auto max-w-3xl px-5 py-6">
      <EmployeeDetailPanel id={id} />
    </main>
  );
}
