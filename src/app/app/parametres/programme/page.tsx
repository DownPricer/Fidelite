import { redirect } from "next/navigation";
import { ProgramConfigurator } from "./ui";
import { resolveMerchantDemo } from "@/lib/merchant-demo-server";
import { canManageMerchantSettings, firstActiveStaffMembership } from "@/lib/rbac";

export default async function ProgramPage() {
  const { user, demo } = await resolveMerchantDemo();

  if (demo) {
    return (
      <main className="obsidian-scene px-5 py-6">
        <ProgramConfigurator demo />
      </main>
    );
  }

  if (!user) redirect("/app/connexion");
  const membership = firstActiveStaffMembership(user.merchantMemberships);
  if (!membership || !canManageMerchantSettings(membership.role)) redirect("/app");

  return (
    <main className="obsidian-scene px-5 py-6">
      <ProgramConfigurator />
    </main>
  );
}
