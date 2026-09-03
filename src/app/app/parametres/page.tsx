import { redirect } from "next/navigation";
import { DEMO_MERCHANT } from "@/lib/demo-visual";
import { prisma } from "@/lib/prisma";
import { resolveMerchantDemo } from "@/lib/merchant-demo-server";
import { canManageMerchantSettings, firstActiveStaffMembership } from "@/lib/rbac";
import { SettingsPanel } from "./ui";
import { MerchantPageHeader } from "@/components/merchant/merchant-ui";

export default async function SettingsPage() {
  const { user, demo } = await resolveMerchantDemo();

  if (demo) {
    return (
      <main className="obsidian-scene mx-auto max-w-3xl px-5 py-6">
        <MerchantPageHeader eyebrow="Configuration" title="Réglages" subtitle={DEMO_MERCHANT.merchantName} />
        <SettingsPanel demo merchantName={DEMO_MERCHANT.merchantName} programSummary="10 passages = 1 boisson offerte" />
      </main>
    );
  }

  if (!user) redirect("/app/connexion");
  const membership = firstActiveStaffMembership(user.merchantMemberships);
  if (!membership || !canManageMerchantSettings(membership.role)) redirect("/app");

  let merchant;
  try {
    merchant = await prisma.merchant.findUnique({
      where: { id: membership.merchantId },
      include: { program: { include: { rewards: { where: { isActive: true }, orderBy: { sortOrder: "asc" }, take: 1 } } } },
    });
  } catch (error) {
    console.error("[parametres] DB error:", error);
    redirect("/app/enter-demo");
  }
  if (!merchant?.program) redirect("/app");

  const firstReward = merchant.program.rewards[0];
  const summary = firstReward
    ? `${firstReward.threshold} ${firstReward.thresholdUnit === "points" ? "points" : "passages"} = ${firstReward.name}`
    : `${merchant.program.visitsRequired} passages = ${merchant.program.rewardLabel}`;

  return (
    <main className="obsidian-scene mx-auto max-w-3xl px-5 py-6">
      <MerchantPageHeader eyebrow="Configuration" title="Réglages" subtitle={merchant.name} />
      <SettingsPanel merchantName={merchant.name} programSummary={summary} />
    </main>
  );
}
