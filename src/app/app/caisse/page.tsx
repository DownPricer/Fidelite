import { redirect } from "next/navigation";
import { canOpenCaisse, firstActiveStaffMembership } from "@/lib/rbac";
import { getSessionUser } from "@/lib/session";
import { CaisseScreen } from "./ui";

export default async function CaissePage() {
  const user = await getSessionUser();
  if (!user) redirect("/app/connexion");
  const membership = firstActiveStaffMembership(user.merchantMemberships);
  if (!membership || !canOpenCaisse(membership.role)) redirect("/app/connexion");

  return (
    <CaisseScreen
      firstName={user.firstName}
      merchantName={membership.merchant.name}
      role={membership.role}
    />
  );
}
