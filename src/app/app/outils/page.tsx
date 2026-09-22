import { redirect } from "next/navigation";
import { DEMO_MERCHANT } from "@/lib/demo-visual";
import { resolveMerchantDemo } from "@/lib/merchant-demo-server";
import { canManageMerchantSettings, firstActiveStaffMembership } from "@/lib/rbac";
import { OutilsPanel } from "./ui";
import { MerchantPageHeader, MerchantPageShell } from "@/components/merchant/merchant-ui";

export default async function OutilsPage() {
  const { user, demo } = await resolveMerchantDemo();

  if (demo) {
    return (
      <MerchantPageShell>
        <MerchantPageHeader eyebrow="Commerçant" title="Outils" subtitle={DEMO_MERCHANT.merchantName} />
        <OutilsPanel />
      </MerchantPageShell>
    );
  }

  if (!user) redirect("/app/connexion");
  const membership = firstActiveStaffMembership(user.merchantMemberships);
  if (!membership || !canManageMerchantSettings(membership.role)) redirect("/app");

  return (
    <MerchantPageShell>
      <MerchantPageHeader eyebrow="Commerçant" title="Outils" />
      <OutilsPanel />
    </MerchantPageShell>
  );
}
