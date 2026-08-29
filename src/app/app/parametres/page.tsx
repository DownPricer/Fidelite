import { redirect } from "next/navigation";
import { AppNav } from "@/components/app-nav";
import { prisma } from "@/lib/prisma";
import { canManageMerchantSettings, firstActiveStaffMembership } from "@/lib/rbac";
import { getSessionUser } from "@/lib/session";
import { SettingsForm } from "./ui";

export default async function SettingsPage() {
  const user = await getSessionUser();
  if (!user) redirect("/app/connexion");
  const membership = firstActiveStaffMembership(user.merchantMemberships);
  if (!membership || !canManageMerchantSettings(membership.role)) redirect("/app");

  const merchant = await prisma.merchant.findUnique({
    where: { id: membership.merchantId },
    include: { program: true },
  });
  if (!merchant || !merchant.program) redirect("/app");

  return (
    <main className="px-6 py-8 lg:px-12 lg:py-12 max-w-7xl mx-auto">
      <header className="mb-8">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted/60">Configuration</p>
        <h1 className="mt-1 text-3xl font-black tracking-tight lg:text-4xl">Paramètres</h1>
      </header>
      <SettingsForm
        initial={{
          name: merchant.name,
          logoUrl: merchant.logoUrl ?? "",
          primaryColor: merchant.primaryColor,
          visitsRequired: merchant.program.visitsRequired,
          rewardLabel: merchant.program.rewardLabel,
        }}
      />
    </main>
  );
}
