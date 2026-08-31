import { redirect } from "next/navigation";
import { DEMO_MERCHANT } from "@/lib/demo-visual";
import { prisma } from "@/lib/prisma";
import { canManageMerchantSettings, firstActiveStaffMembership } from "@/lib/rbac";
import { getSessionUser } from "@/lib/session";
import { SettingsForm } from "./ui";

export default async function SettingsPage() {
  const user = await getSessionUser();
  if (!user) {
    if (process.env.NODE_ENV === "development") {
      return (
        <main className="obsidian-scene mx-auto max-w-7xl px-6 py-8 lg:px-12 lg:py-12">
          <header className="mb-8">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--muted-text)]">Configuration</p>
            <h1 className="mt-1 text-3xl font-black tracking-tight text-[var(--panel-text)] lg:text-4xl">Paramètres</h1>
            <p className="mt-1 text-sm text-[var(--muted)]">{DEMO_MERCHANT.merchantName}</p>
          </header>
          <SettingsForm
            demo
            initial={{
              name: DEMO_MERCHANT.merchantName,
              logoUrl: "",
              primaryColor: "#8557ff",
              visitsRequired: 10,
              rewardLabel: "1 boisson offerte",
            }}
          />
        </main>
      );
    }
    redirect("/app/connexion");
  }
  const membership = firstActiveStaffMembership(user.merchantMemberships);
  if (!membership || !canManageMerchantSettings(membership.role)) redirect("/app");

  const merchant = await prisma.merchant.findUnique({
    where: { id: membership.merchantId },
    include: { program: true },
  });
  if (!merchant || !merchant.program) redirect("/app");

  return (
    <main className="obsidian-scene mx-auto max-w-7xl px-6 py-8 lg:px-12 lg:py-12">
      <header className="mb-8">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--muted-text)]">Configuration</p>
        <h1 className="mt-1 text-3xl font-black tracking-tight text-[var(--panel-text)] lg:text-4xl">Paramètres</h1>
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
