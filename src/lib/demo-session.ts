import { cookies } from "next/headers";
import { EMPLOYEE_DEMO_COOKIE, MERCHANT_DEMO_COOKIE } from "@/lib/demo-mode";
import { destroyEmployeeSession } from "@/lib/employee-session";

const demoCookieOptions = {
  path: "/",
  httpOnly: true,
  sameSite: "lax" as const,
  maxAge: 60 * 60 * 24 * 7,
};

/** Active le mode démo commerçant en isolant la session employé éventuelle. */
export async function activateMerchantDemoCookie() {
  await destroyEmployeeSession();
  const jar = await cookies();
  jar.delete(EMPLOYEE_DEMO_COOKIE);
  jar.set(MERCHANT_DEMO_COOKIE, "1", demoCookieOptions);
}

/** Active le mode démo employé sans toucher à la session client. */
export async function activateEmployeeDemoCookie() {
  const jar = await cookies();
  jar.delete(MERCHANT_DEMO_COOKIE);
  jar.set(EMPLOYEE_DEMO_COOKIE, "1", demoCookieOptions);
}
