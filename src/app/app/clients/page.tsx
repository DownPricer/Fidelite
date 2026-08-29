import { redirect } from "next/navigation";
import { AppNav } from "@/components/app-nav";
import { canViewAllCustomers, firstActiveStaffMembership } from "@/lib/rbac";
import { getSessionUser } from "@/lib/session";
import { CustomersPanel } from "./ui";

export default async function ClientsPage() {
  const user = await getSessionUser();
  if (!user) redirect("/app/connexion");
  const membership = firstActiveStaffMembership(user.merchantMemberships);
  if (!membership || !canViewAllCustomers(membership.role)) redirect("/app");

  return (
    <main className="mx-auto max-w-3xl px-6 py-8">
      <h1 className="text-3xl font-semibold">Clients</h1>
      <AppNav admin />
      <CustomersPanel />
    </main>
  );
}
