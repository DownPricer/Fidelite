import { EMPLOYEE_DEMO_COOKIE, isDemoCookie, isPublicDemoEnabled } from "@/lib/demo-mode";

export { EMPLOYEE_DEMO_COOKIE };

/** Fallback sans session : actif en local ou via cookie démo. */
export function isEmployeeDevDemo(session: unknown) {
  return isPublicDemoEnabled() && !session && process.env.NODE_ENV === "development";
}

export function isEmployeeDemoCookie(value: string | undefined) {
  return isDemoCookie(value);
}
