import { redirect } from "next/navigation";
import { DEMO_MERCHANT } from "@/lib/demo-visual";
import { resolveMerchantDemo } from "@/lib/merchant-demo-server";
import { canViewAllCustomers, firstActiveStaffMembership } from "@/lib/rbac";
import { CustomersPanel } from "./ui";
import { MerchantPageHeader } from "@/components/merchant/merchant-ui";

export default async function ClientsPage() {
  const { user, demo } = await resolveMerchantDemo();

  if (demo) {
    return (
      <main className="obsidian-scene mx-auto max-w-3xl px-5 py-6">
        <MerchantPageHeader eyebrow="Gestion" title="Clients" subtitle={DEMO_MERCHANT.merchantName} />
        <CustomersPanel demo />
      </main>
    );
  }

  if (!user) redirect("/app/connexion");
  const membership = firstActiveStaffMembership(user.merchantMemberships);
  if (!membership || !canViewAllCustomers(membership)) redirect("/app");

  return (
    <main className="obsidian-scene mx-auto max-w-3xl px-5 py-6">
      <MerchantPageHeader eyebrow="Gestion" title="Clients" />
      <CustomersPanel />
    </main>
  );
}
