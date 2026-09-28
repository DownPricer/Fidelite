import { redirect } from "next/navigation";
import { CustomerDetailPanel } from "../ui";
import { resolveMerchantDemo } from "@/lib/merchant-demo-server";
import { canViewAllCustomers, firstActiveStaffMembership } from "@/lib/rbac";

export default async function CustomerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { user, demo } = await resolveMerchantDemo();

  if (demo) {
    return (
      <main className="mq-main">
        <div className="mq-frame">
          <CustomerDetailPanel id={id} demo />
        </div>
      </main>
    );
  }

  if (!user) redirect("/app/connexion");
  const membership = firstActiveStaffMembership(user.merchantMemberships);
  if (!membership || !canViewAllCustomers(membership)) redirect("/app");

  return (
    <main className="mq-main">
      <div className="mq-frame">
        <CustomerDetailPanel id={id} />
      </div>
    </main>
  );
}
