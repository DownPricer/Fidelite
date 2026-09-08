import { DEMO_EMPLOYEE } from "@/lib/demo-visual";
import { EmployeeScanScreen } from "../../scan/ui";

export default async function EmployeeScanDemoPage({
  searchParams,
}: {
  searchParams: Promise<{ view?: string }>;
}) {
  const params = await searchParams;
  const view = params.view === "result" || params.view === "error" ? params.view : "scan";

  return (
    <EmployeeScanScreen
      demo
      initialView={view}
      profile={{
        firstName: DEMO_EMPLOYEE.firstName,
        merchantName: DEMO_EMPLOYEE.merchantName,
        permissions: DEMO_EMPLOYEE.permissions,
      }}
    />
  );
}
