import { redirect } from "next/navigation";
import { ProgramConfigurator } from "./ui";
import { resolveMerchantDemo } from "@/lib/merchant-demo-server";
import { canManageMerchantSettings, firstActiveStaffMembership } from "@/lib/rbac";
import { MerchantPageShell } from "@/components/merchant/merchant-ui";

export default async function ProgramPage() {
  const { user, demo } = await resolveMerchantDemo();

  if (demo) {
    return (
      <MerchantPageShell>
        <ProgramConfigurator demo />
      </MerchantPageShell>
    );
  }

  if (!user) redirect("/app/connexion");
  const membership = firstActiveStaffMembership(user.merchantMemberships);
  if (!membership || !canManageMerchantSettings(membership.role)) redirect("/app");

  return (
    <MerchantPageShell>
      <ProgramConfigurator />
    </MerchantPageShell>
  );
}
