import { cookies } from "next/headers";
import { EMPLOYEE_DEMO_COOKIE, isEmployeeDemoCookie, isEmployeeDevDemo } from "@/lib/employee-demo";
import { getEmployeeSession } from "@/lib/employee-session";

export async function resolveEmployeeDemo() {
  const session = await getEmployeeSession();
  const jar = await cookies();
  const cookieDemo = isEmployeeDemoCookie(jar.get(EMPLOYEE_DEMO_COOKIE)?.value);
  const demo = isEmployeeDevDemo(session) || cookieDemo;
  return { session, demo };
}
