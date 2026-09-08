import { redirect } from "next/navigation";
import { DEMO_EMPLOYEE } from "@/lib/demo-visual";
import { resolveEmployeeDemo } from "@/lib/employee-demo-server";
import { resolvePermissions } from "@/lib/staff-permissions";
import { EmployeeScanScreen } from "./ui";

export default async function EmployeeScanPage() {
  const { session, demo } = await resolveEmployeeDemo();

  if (demo) {
    return (
      <EmployeeScanScreen
        demo
        profile={{
          firstName: DEMO_EMPLOYEE.firstName,
          merchantName: DEMO_EMPLOYEE.merchantName,
          permissions: DEMO_EMPLOYEE.permissions,
        }}
      />
    );
  }

  if (!session) redirect("/employe/connexion");

  return (
    <EmployeeScanScreen
      profile={{
        firstName: session.user.firstName,
        merchantName: session.membership.merchant.name,
        merchantLogoUrl: session.membership.merchant.logoUrl,
        permissions: resolvePermissions(session.membership),
      }}
    />
  );
}
