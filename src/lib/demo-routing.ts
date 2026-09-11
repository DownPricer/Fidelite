import type { NextRequest } from "next/server";
import {
  CLIENT_DEMO_COOKIE,
  EMPLOYEE_DEMO_COOKIE,
  MERCHANT_DEMO_COOKIE,
  isPublicDemoEnabled,
} from "@/lib/demo-mode";
import { env } from "@/lib/env";

export type DemoRole = "client" | "merchant" | "employee";

export function isMerchantDemoCookieValue(value: string | undefined | null) {
  return isPublicDemoEnabled() && value === "1";
}

export function merchantDemoActiveFromRequest(req: Pick<NextRequest, "cookies">) {
  if (!env.publicDemoMode) return false;
  return isMerchantDemoCookieValue(req.cookies.get(MERCHANT_DEMO_COOKIE)?.value);
}

export function demoEnterTarget(role: DemoRole): string {
  switch (role) {
    case "client":
      return "/carte?demo=1";
    case "merchant":
      return "/app";
    case "employee":
      return "/employe/scan";
  }
}

export function demoCookieNamesForRole(role: DemoRole) {
  return {
    activate:
      role === "client"
        ? CLIENT_DEMO_COOKIE
        : role === "merchant"
          ? MERCHANT_DEMO_COOKIE
          : EMPLOYEE_DEMO_COOKIE,
    deactivate: [CLIENT_DEMO_COOKIE, MERCHANT_DEMO_COOKIE, EMPLOYEE_DEMO_COOKIE].filter(
      (name) =>
        name !==
        (role === "client"
          ? CLIENT_DEMO_COOKIE
          : role === "merchant"
            ? MERCHANT_DEMO_COOKIE
            : EMPLOYEE_DEMO_COOKIE),
    ),
  };
}

export function employeeSessionCookieName() {
  return env.employeeSessionCookie;
}
