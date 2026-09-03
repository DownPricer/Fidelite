import { redirect } from "next/navigation";
import { DEMO_MERCHANT } from "@/lib/demo-visual";
import { resolveMerchantDemo } from "@/lib/merchant-demo-server";
import { canManageEmployees, firstActiveStaffMembership } from "@/lib/rbac";
import { EmployeesPanel } from "./ui";
import { MerchantPageHeader } from "@/components/merchant/merchant-ui";

export default async function EmployeesPage() {
  const { user, demo } = await resolveMerchantDemo();

  if (demo) {
    return (
      <main className="obsidian-scene mx-auto max-w-3xl px-5 py-6">
        <MerchantPageHeader eyebrow="Gestion" title="Équipe" subtitle={`${DEMO_MERCHANT.merchantName} · 2 actifs`} />
        <EmployeesPanel demo />
      </main>
    );
  }

  if (!user) redirect("/app/connexion");
  const membership = firstActiveStaffMembership(user.merchantMemberships);
  if (!membership || !canManageEmployees(membership.role)) redirect("/app");

  return (
    <main className="obsidian-scene mx-auto max-w-3xl px-5 py-6">
      <MerchantPageHeader eyebrow="Gestion" title="Équipe" />
      <EmployeesPanel />
    </main>
  );
}
