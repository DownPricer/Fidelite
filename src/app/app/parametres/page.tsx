import { redirect } from "next/navigation";
import { DEMO_MERCHANT } from "@/lib/demo-visual";
import { prisma } from "@/lib/prisma";
import { resolveMerchantDemo } from "@/lib/merchant-demo-server";
import { canManageMerchantSettings, firstActiveStaffMembership } from "@/lib/rbac";
import { SettingsPanel } from "./ui";
import { MerchantPageHeader, MerchantPageShell } from "@/components/merchant/merchant-ui";

export default async function SettingsPage() {
  const { user, demo } = await resolveMerchantDemo();

  if (demo) {
    return (
      <MerchantPageShell narrow>
        <MerchantPageHeader eyebrow="Configuration" title="Paramètres" subtitle={DEMO_MERCHANT.merchantName} />
        <SettingsPanel merchantName={DEMO_MERCHANT.merchantName} />
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
      include: { program: { select: { id: true } } },
    });
  } catch (error) {
    console.error("[parametres] DB error:", error);
    redirect("/app/enter-demo");
  }
  if (!merchant?.program) redirect("/app");

  return (
    <MerchantPageShell narrow>
      <MerchantPageHeader eyebrow="Configuration" title="Paramètres" subtitle={merchant.name} />
      <SettingsPanel merchantName={merchant.name} />
    </MerchantPageShell>
  );
}
