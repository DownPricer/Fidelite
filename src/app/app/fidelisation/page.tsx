import { redirect } from "next/navigation";
import { DEMO_MERCHANT } from "@/lib/demo-visual";
import { prisma } from "@/lib/prisma";
import { resolveMerchantDemo } from "@/lib/merchant-demo-server";
import { canManageMerchantSettings, firstActiveStaffMembership } from "@/lib/rbac";
import { FidelisationPanel } from "./ui";
import { MerchantPageHeader, MerchantPageShell } from "@/components/merchant/merchant-ui";

export default async function FidelisationPage() {
  const { user, demo } = await resolveMerchantDemo();

  if (demo) {
    return (
      <MerchantPageShell narrow>
        <MerchantPageHeader eyebrow="Programme" title="Fidélisation" subtitle={DEMO_MERCHANT.merchantName} />
        <FidelisationPanel programSummary="10 passages = 1 boisson offerte" activeRewardsCount={3} />
      </MerchantPageShell>
    );
  }

  if (!user) redirect("/app/connexion");
  const membership = firstActiveStaffMembership(user.merchantMemberships);
  if (!membership || !canManageMerchantSettings(membership.role)) redirect("/app");

  let merchant;
  try {
    merchant = await prisma.merchant.findUnique({
      where: { id: membership.merchantId },
      include: {
        program: {
          include: {
            rewards: { where: { isActive: true }, orderBy: { sortOrder: "asc" } },
          },
        },
      },
    });
  } catch (error) {
    console.error("[fidelisation] DB error:", error);
    redirect("/app/enter-demo");
  }
  if (!merchant?.program) redirect("/app");

  const activeRewards = merchant.program.rewards;
  const firstReward = activeRewards[0];
  const summary = firstReward
    ? `${firstReward.threshold} ${firstReward.thresholdUnit === "points" ? "points" : "passages"} = ${firstReward.name}`
    : `${merchant.program.visitsRequired} passages = ${merchant.program.rewardLabel}`;

  return (
    <MerchantPageShell narrow>
      <MerchantPageHeader eyebrow="Programme" title="Fidélisation" subtitle={merchant.name} />
      <FidelisationPanel programSummary={summary} activeRewardsCount={activeRewards.length} />
    </MerchantPageShell>
  );
}
