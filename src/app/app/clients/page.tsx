import { redirect } from "next/navigation";
import { resolveMerchantDemo } from "@/lib/merchant-demo-server";
import { canViewAllCustomers, firstActiveStaffMembership } from "@/lib/rbac";
import { CustomersPanel } from "./ui";

function ClientsHeader() {
  return (
    <header className="mq-page-head">
      <div>
        <div className="mq-eyebrow">GESTION · RELATION CLIENT</div>
        <h1 className="mq-h1">Clients</h1>
        <p className="mq-intro">Retrouvez les membres de votre programme et leur activité.</p>
      </div>
    </header>
  );
}

export default async function ClientsPage() {
  const { user, demo } = await resolveMerchantDemo();

  if (demo) {
    return (
      <main className="mq-main">
        <div className="mq-frame">
          <ClientsHeader />
          <CustomersPanel demo />
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
        <ClientsHeader />
        <CustomersPanel />
      </div>
    </main>
  );
}
