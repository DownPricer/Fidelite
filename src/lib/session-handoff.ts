import { cookies } from "next/headers";
import type { NextResponse } from "next/server";
import { EMPLOYEE_DEMO_COOKIE } from "@/lib/demo-mode";
import { clearCookieOnResponse } from "@/lib/demo-session";
import { employeeSessionCookieName, revokeEmployeeSessionToken } from "@/lib/employee-session";

/** Retire la session employé du navigateur après une connexion commerçant. */
export async function clearEmployeeBrowserSession() {
  const jar = await cookies();
  const token = jar.get(employeeSessionCookieName())?.value;
  if (token) {
    try {
      await revokeEmployeeSessionToken(token);
      console.info("[merchant-app-access] session employé supprimée à la connexion commerçant");
    } catch (error) {
      console.warn("[merchant-app-access] révocation session employé ignorée", error);
    }
  }
  jar.set(employeeSessionCookieName(), "", {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 0,
    expires: new Date(0),
  });
  jar.delete(EMPLOYEE_DEMO_COOKIE);
}

export function applyEmployeeSessionClearance(response: NextResponse) {
  clearCookieOnResponse(response, employeeSessionCookieName());
  clearCookieOnResponse(response, EMPLOYEE_DEMO_COOKIE);
}
