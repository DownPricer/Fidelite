import { redirect } from "next/navigation";
import { resolveMerchantDemo } from "@/lib/merchant-demo-server";
import { canManageMerchantSettings, firstActiveStaffMembership } from "@/lib/rbac";
import { CampagnesPanel } from "./ui";
import { MerchantPageHeader, MerchantPageShell } from "@/components/merchant/merchant-ui";

export default async function CampagnesPage() {
  const { user, demo } = await resolveMerchantDemo();

  if (demo) {
    return (
      <MerchantPageShell>
        <MerchantPageHeader
          eyebrow="Outils · Communication"
          title="Campagnes"
          subtitle="Envoyez une annonce à vos clients ou mettez votre commerce en avant dans Fidelo."
          backHref="/app/outils"
        />
        <CampagnesPanel demo />
      </MerchantPageShell>
    );
  }

  if (!user) redirect("/app/connexion");
  const membership = firstActiveStaffMembership(user.merchantMemberships);
  if (!membership || !canManageMerchantSettings(membership.role)) redirect("/app");

  return (
    <MerchantPageShell>
      <MerchantPageHeader
        eyebrow="Outils · Communication"
        title="Campagnes"
        subtitle="Envoyez une annonce à vos clients ou mettez votre commerce en avant dans Fidelo."
        backHref="/app/outils"
      />
      <CampagnesPanel />
    </MerchantPageShell>
  );
}
