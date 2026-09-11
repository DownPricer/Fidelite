import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { isPublicDemoEnabled } from "@/lib/demo-mode";
import {
  demoCookieNamesForRole,
  demoEnterTarget,
  employeeSessionCookieName,
  type DemoRole,
} from "@/lib/demo-routing";
import { isProduction } from "@/lib/env";
import { revokeEmployeeSessionToken } from "@/lib/employee-session";

const DEMO_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;

function sharedCookieOptions() {
  return {
    path: "/",
    httpOnly: true,
    sameSite: "lax" as const,
    secure: isProduction(),
  };
}

export function setDemoCookieOnResponse(response: NextResponse, name: string, value: string) {
  response.cookies.set(name, value, {
    ...sharedCookieOptions(),
    maxAge: DEMO_COOKIE_MAX_AGE,
  });
}

export function clearCookieOnResponse(response: NextResponse, name: string) {
  response.cookies.set(name, "", {
    ...sharedCookieOptions(),
    maxAge: 0,
    expires: new Date(0),
  });
}

export function applyDemoRoleCookies(response: NextResponse, role: DemoRole) {
  const { activate, deactivate } = demoCookieNamesForRole(role);
  for (const name of deactivate) {
    clearCookieOnResponse(response, name);
  }
  setDemoCookieOnResponse(response, activate, "1");

  if (role === "merchant" || role === "client") {
    clearCookieOnResponse(response, employeeSessionCookieName());
  }
}

export async function createDemoEnterResponse(request: Request, role: DemoRole) {
  console.info("[demo-routing] rôle demandé", role);

  if (!isPublicDemoEnabled()) {
    const fallback =
      role === "client" ? "/connexion" : role === "merchant" ? "/app/connexion" : "/employe/connexion";
    return NextResponse.redirect(new URL(fallback, request.url));
  }

  const jar = await cookies();
  const employeeToken = jar.get(employeeSessionCookieName())?.value;
  if ((role === "merchant" || role === "client") && employeeToken) {
    try {
      await revokeEmployeeSessionToken(employeeToken);
      console.info("[demo-routing] session employé supprimée");
    } catch (error) {
      console.warn("[demo-routing] révocation session employé en base ignorée", error);
    }
  }

  const response = NextResponse.redirect(new URL(demoEnterTarget(role), request.url));
  applyDemoRoleCookies(response, role);

  if (role === "merchant") {
    console.info("[demo-routing] mode commerçant activé");
  }

  return response;
}
