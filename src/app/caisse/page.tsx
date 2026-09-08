import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { isEmployeeDemoCookie, EMPLOYEE_DEMO_COOKIE } from "@/lib/employee-demo";
import { env } from "@/lib/env";

export default async function CaisseAliasPage() {
  const jar = await cookies();
  if (jar.get(env.employeeSessionCookie)?.value) {
    redirect("/employe/scan");
  }
  if (isEmployeeDemoCookie(jar.get(EMPLOYEE_DEMO_COOKIE)?.value)) {
    redirect("/employe/scan");
  }
  redirect("/app/caisse");
}
