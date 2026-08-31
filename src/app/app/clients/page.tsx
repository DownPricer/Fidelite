import { redirect } from "next/navigation";
import { DEMO_MERCHANT } from "@/lib/demo-visual";
import { canViewAllCustomers, firstActiveStaffMembership } from "@/lib/rbac";
import { getSessionUser } from "@/lib/session";
import { CustomersPanel } from "./ui";

export default async function ClientsPage() {
  const user = await getSessionUser();
  if (!user) {
    if (process.env.NODE_ENV === "development") {
      return (
        <main className="obsidian-scene mx-auto max-w-7xl px-6 py-8 lg:px-12 lg:py-12">
          <header className="mb-8">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--muted-text)]">Gestion</p>
            <h1 className="mt-1 text-3xl font-black tracking-tight text-[var(--panel-text)] lg:text-4xl">Clients</h1>
            <p className="mt-1 text-sm text-[var(--muted)]">{DEMO_MERCHANT.merchantName}</p>
          </header>
          <CustomersPanel demo />
        </main>
      );
    }
    redirect("/app/connexion");
  }
  const membership = firstActiveStaffMembership(user.merchantMemberships);
  if (!membership || !canViewAllCustomers(membership.role)) redirect("/app");

  return (
    <main className="obsidian-scene mx-auto max-w-7xl px-6 py-8 lg:px-12 lg:py-12">
      <header className="mb-8">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--muted-text)]">Gestion</p>
        <h1 className="mt-1 text-3xl font-black tracking-tight text-[var(--panel-text)] lg:text-4xl">Clients</h1>
      </header>
      <CustomersPanel />
    </main>
  );
}
