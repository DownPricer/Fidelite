import { DEMO_EMPLOYEE } from "@/lib/demo-visual";
import { EmployeeScanScreen } from "../../scan/ui";

export default async function EmployeeScanDemoPage({
  searchParams,
}: {
  searchParams: Promise<{ view?: string; mode?: string; reward?: string }>;
}) {
  const params = await searchParams;
  const view = params.view === "result" || params.view === "error" ? params.view : "scan";

  return (
    <EmployeeScanScreen
      demo
      initialView={view}
      initialError="Ce QR n'est pas reconnu."
      profile={{
        firstName: DEMO_EMPLOYEE.firstName,
        merchantName: DEMO_EMPLOYEE.merchantName,
        permissions: DEMO_EMPLOYEE.permissions,
      }}
      demoOptions={{
        amountView: params.mode === "amount",
        forceReward: params.reward === "1",
      }}
    />
  );
}
