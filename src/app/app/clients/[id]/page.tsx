import { redirect } from "next/navigation";
import { CustomerDetailPanel } from "../ui";
import { resolveMerchantDemo } from "@/lib/merchant-demo-server";
import { canViewAllCustomers, firstActiveStaffMembership } from "@/lib/rbac";
import { MerchantPageHeader, MerchantPageShell } from "@/components/merchant/merchant-ui";

export default async function CustomerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { user, demo } = await resolveMerchantDemo();

  if (demo) {
    return (
      <MerchantPageShell narrow>
        <MerchantPageHeader backHref="/app/clients" eyebrow="Client" title="Fiche client" />
        <CustomerDetailPanel id={id} demo />
      </MerchantPageShell>
    );
  }

  if (!user) redirect("/app/connexion");
  const membership = firstActiveStaffMembership(user.merchantMemberships);
  if (!membership || !canViewAllCustomers(membership)) redirect("/app");

  return (
    <MerchantPageShell narrow>
      <MerchantPageHeader backHref="/app/clients" eyebrow="Client" title="Fiche client" />
      <CustomerDetailPanel id={id} />
    </MerchantPageShell>
  );
}
