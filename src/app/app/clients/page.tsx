import { redirect } from "next/navigation";
import { DEMO_MERCHANT } from "@/lib/demo-visual";
import { resolveMerchantDemo } from "@/lib/merchant-demo-server";
import { canViewAllCustomers, firstActiveStaffMembership } from "@/lib/rbac";
import { CustomersPanel } from "./ui";
import { MerchantPageHeader, MerchantPageShell } from "@/components/merchant/merchant-ui";

export default async function ClientsPage() {
  const { user, demo } = await resolveMerchantDemo();

  if (demo) {
    return (
      <MerchantPageShell>
        <MerchantPageHeader eyebrow="Gestion" title="Clients" subtitle={DEMO_MERCHANT.merchantName} />
        <CustomersPanel demo />
      </MerchantPageShell>
    );
  }

  if (!user) redirect("/app/connexion");
  const membership = firstActiveStaffMembership(user.merchantMemberships);
  if (!membership || !canViewAllCustomers(membership)) redirect("/app");

  return (
    <MerchantPageShell>
      <MerchantPageHeader eyebrow="Gestion" title="Clients" />
      <CustomersPanel />
    </MerchantPageShell>
  );
}
