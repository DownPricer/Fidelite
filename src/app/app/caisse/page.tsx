import { redirect } from "next/navigation";
import { DEMO_MERCHANT } from "@/lib/demo-visual";
import { canOpenCaisse, firstActiveStaffMembership } from "@/lib/rbac";
import { getSessionUser } from "@/lib/session";
import { CaisseScreen } from "./ui";

export default async function CaissePage() {
  const user = await getSessionUser();
  if (!user) {
    if (process.env.NODE_ENV === "development") {
      return <CaisseScreen merchantName={DEMO_MERCHANT.merchantName} role={DEMO_MERCHANT.role} />;
    }
    redirect("/app/connexion");
  }
  const membership = firstActiveStaffMembership(user.merchantMemberships);
  if (!membership || !canOpenCaisse(membership.role)) redirect("/app/connexion");

  return <CaisseScreen merchantName={membership.merchant.name} role={membership.role} />;
}
