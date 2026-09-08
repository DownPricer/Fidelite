import { redirect } from "next/navigation";
import { getEmployeeSession } from "@/lib/employee-session";
import { EmployeeLoginScreen } from "./ui";

export default async function EmployeeLoginPage() {
  const session = await getEmployeeSession();
  if (session) redirect("/employe/scan");
  return (
    <EmployeeLoginScreen
      demoHref={process.env.NODE_ENV === "development" ? "/employe/enter-demo" : undefined}
    />
  );
}
