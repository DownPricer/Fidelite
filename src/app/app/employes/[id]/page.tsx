import { redirect } from "next/navigation";
import { EmployeeDetailPanel } from "../ui";
import { resolveMerchantDemo } from "@/lib/merchant-demo-server";
import { canManageEmployees, firstActiveStaffMembership } from "@/lib/rbac";
import { MerchantPageHeader, MerchantPageShell } from "@/components/merchant/merchant-ui";

export default async function EmployeeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { user, demo } = await resolveMerchantDemo();

  if (demo) {
    const name = id === "e1" ? "Sam Durand" : id === "e2" ? "Noa Petit" : "Employé";
    return (
      <MerchantPageShell>
        <MerchantPageHeader backHref="/app/employes" eyebrow="Équipe" title={name} />
        <EmployeeDetailPanel id={id} demo />
      </MerchantPageShell>
    );
  }

  if (!user) redirect("/app/connexion");
  const membership = firstActiveStaffMembership(user.merchantMemberships);
  if (!membership || !canManageEmployees(membership.role)) redirect("/app");

  return (
    <MerchantPageShell>
      <MerchantPageHeader backHref="/app/employes" eyebrow="Équipe" title="Fiche employé" />
      <EmployeeDetailPanel id={id} />
    </MerchantPageShell>
  );
}
