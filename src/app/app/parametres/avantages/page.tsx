import { redirect } from "next/navigation";
import { MerchantPageShell } from "@/components/merchant/merchant-ui";
import { canManageMerchantSettings, firstActiveStaffMembership } from "@/lib/rbac";
import { resolveMerchantDemo } from "@/lib/merchant-demo-server";
import { ProgramConfigurator } from "../programme/ui";

export default async function AdvantagesPage() {
  const { user, demo } = await resolveMerchantDemo();

  if (demo) {
    return (
      <MerchantPageShell>
        <ProgramConfigurator demo view="advantages" />
      </MerchantPageShell>
    );
  }

  if (!user) redirect("/app/connexion");
  const membership = firstActiveStaffMembership(user.merchantMemberships);
  if (!membership || !canManageMerchantSettings(membership.role)) redirect("/app");

  return (
    <MerchantPageShell>
      <ProgramConfigurator view="advantages" />
    </MerchantPageShell>
  );
}
