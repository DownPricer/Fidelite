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
    <main className="mx-auto max-w-3xl px-6 py-8">
      <h1 className="text-3xl font-semibold">Paramètres</h1>
      <AppNav admin />
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
