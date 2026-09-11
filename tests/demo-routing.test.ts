import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest, NextResponse } from "next/server";
import {
  CLIENT_DEMO_COOKIE,
  EMPLOYEE_DEMO_COOKIE,
  MERCHANT_DEMO_COOKIE,
} from "@/lib/demo-mode";
import {
  merchantDemoActiveFromRequest,
  shouldRedirectAppLayoutToEmployee,
  shouldRedirectAppToEmployee,
} from "@/lib/demo-routing";
import {
  applyDemoRoleCookies,
  createDemoEnterResponse,
} from "@/lib/demo-session";
import { middleware } from "@/middleware";

const EMPLOYEE_SESSION_COOKIE = "fifelite_employee_session";

function request(path: string, cookies: Record<string, string> = {}) {
  const cookieHeader = Object.entries(cookies)
    .map(([key, value]) => `${key}=${value}`)
    .join("; ");
  return new NextRequest(`http://localhost:3000${path}`, {
    headers: cookieHeader ? { cookie: cookieHeader } : {},
  });
}

function cookieMap(setCookies: string[]) {
  const map = new Map<string, string>();
  for (const header of setCookies) {
    const [pair] = header.split(";");
    const [name, value] = pair?.split("=") ?? [];
    if (name) map.set(name.trim(), decodeURIComponent(value ?? ""));
  }
  return map;
}

function isExpiredCookie(header: string) {
  return /Max-Age=0|Expires=Thu, 01 Jan 1970/i.test(header);
}

vi.mock("next/headers", () => ({
  cookies: vi.fn(),
}));

vi.mock("@/lib/employee-session", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/employee-session")>();
  return {
    ...actual,
    revokeEmployeeSessionToken: vi.fn(async () => undefined),
  };
});

describe("demo routing decisions", () => {
  it("priorise le mode démo commerçant sur une session employé (middleware)", () => {
    expect(
      shouldRedirectAppToEmployee({
        pathname: "/app/clients",
        merchantDemoActive: true,
        employeeCookiePresent: true,
      }),
    ).toBe(false);
  });

  it("redirige /app quand seule la session employé est active (middleware)", () => {
    expect(
      shouldRedirectAppToEmployee({
        pathname: "/app/clients",
        merchantDemoActive: false,
        employeeCookiePresent: true,
      }),
    ).toBe(true);
  });

  it("priorise le mode démo commerçant sur une session employé (layout)", () => {
    expect(
      shouldRedirectAppLayoutToEmployee({
        merchantDemoActive: true,
        employeeSessionActive: true,
      }),
    ).toBe(false);
  });

  it("redirige le layout quand seule la session employé est active", () => {
    expect(
      shouldRedirectAppLayoutToEmployee({
        merchantDemoActive: false,
        employeeSessionActive: true,
      }),
    ).toBe(true);
  });
});

describe("demo routing middleware", () => {
  it("redirige /app vers /employe/scan quand une session employé est active", () => {
    const response = middleware(request("/app/clients", { [EMPLOYEE_SESSION_COOKIE]: "token" }));
    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toContain("/employe/scan");
  });

  it("laisse /app accessible en mode démo commerçant malgré une session employé", () => {
    const response = middleware(
      request("/app/clients", {
        [EMPLOYEE_SESSION_COOKIE]: "token",
        [MERCHANT_DEMO_COOKIE]: "1",
      }),
    );
    expect(response.status).not.toBe(307);
    expect(response.headers.get("location")).toBeNull();
  });

  it("laisse /app/clients, /app/employes et /app/parametres en mode démo commerçant", () => {
    for (const path of ["/app", "/app/clients", "/app/employes", "/app/parametres"]) {
      const response = middleware(
        request(path, {
          [EMPLOYEE_SESSION_COOKIE]: "token",
          [MERCHANT_DEMO_COOKIE]: "1",
        }),
      );
      expect(response.status).not.toBe(307);
      expect(response.headers.get("location")).toBeNull();
    }
  });

  it("détecte le cookie commerçant démo sur la requête", () => {
    const req = request("/app", { [MERCHANT_DEMO_COOKIE]: "1" });
    expect(merchantDemoActiveFromRequest(req)).toBe(true);
  });
});

describe("demo enter merchant route", () => {
  beforeEach(() => {
    vi.stubEnv("PUBLIC_DEMO_MODE", "true");
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.clearAllMocks();
  });

  it("reproduit Employé → Démo → Commerçant avec cookies sur la même redirection", async () => {
    const { cookies } = await import("next/headers");
    const { revokeEmployeeSessionToken } = await import("@/lib/employee-session");

    vi.mocked(cookies).mockResolvedValue({
      get: (name: string) =>
        name === EMPLOYEE_SESSION_COOKIE ? { value: "employee-token" } : undefined,
    } as Awaited<ReturnType<typeof cookies>>);

    const response = await createDemoEnterResponse(
      new Request("http://localhost:3000/demo/enter/merchant", {
        headers: { cookie: `${EMPLOYEE_SESSION_COOKIE}=employee-token; ${EMPLOYEE_DEMO_COOKIE}=1` },
      }),
      "merchant",
    );

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe("http://localhost:3000/app");
    expect(revokeEmployeeSessionToken).toHaveBeenCalledWith("employee-token");

    const setCookies = response.headers.getSetCookie();
    const activated = setCookies.find((row) => row.startsWith(`${MERCHANT_DEMO_COOKIE}=1`));
    expect(activated).toBeTruthy();

    const employeeDemoCleared = setCookies.find((row) => row.startsWith(`${EMPLOYEE_DEMO_COOKIE}=`));
    expect(employeeDemoCleared).toBeTruthy();
    expect(isExpiredCookie(employeeDemoCleared!)).toBe(true);

    const employeeSessionCleared = setCookies.find((row) => row.startsWith(`${EMPLOYEE_SESSION_COOKIE}=`));
    expect(employeeSessionCleared).toBeTruthy();
    expect(isExpiredCookie(employeeSessionCleared!)).toBe(true);

    const followUp = middleware(
      request("/app/clients", {
        [MERCHANT_DEMO_COOKIE]: "1",
        [EMPLOYEE_SESSION_COOKIE]: "employee-token",
      }),
    );
    expect(followUp.status).not.toBe(307);
    expect(followUp.headers.get("location")).toBeNull();
  });
});

describe("demo role cookie application", () => {
  it("active un seul rôle démo à la fois pour Commerçant", () => {
    const response = NextResponse.redirect("http://localhost:3000/app");
    applyDemoRoleCookies(response, "merchant");
    const map = cookieMap(response.headers.getSetCookie());
    expect(map.get(MERCHANT_DEMO_COOKIE)).toBe("1");
    expect(map.get(EMPLOYEE_DEMO_COOKIE)).toBe("");
    expect(map.get(CLIENT_DEMO_COOKIE)).toBe("");
    expect(map.get(EMPLOYEE_SESSION_COOKIE)).toBe("");
  });

  it("active le rôle employé et retire le mode commerçant", () => {
    const response = NextResponse.redirect("http://localhost:3000/employe/scan");
    applyDemoRoleCookies(response, "employee");
    const map = cookieMap(response.headers.getSetCookie());
    expect(map.get(EMPLOYEE_DEMO_COOKIE)).toBe("1");
    expect(map.get(MERCHANT_DEMO_COOKIE)).toBe("");
  });

  it("active le rôle client et nettoie commerçant/employé", () => {
    const response = NextResponse.redirect("http://localhost:3000/carte?demo=1");
    applyDemoRoleCookies(response, "client");
    const map = cookieMap(response.headers.getSetCookie());
    expect(map.get(CLIENT_DEMO_COOKIE)).toBe("1");
    expect(map.get(MERCHANT_DEMO_COOKIE)).toBe("");
    expect(map.get(EMPLOYEE_DEMO_COOKIE)).toBe("");
    expect(map.get(EMPLOYEE_SESSION_COOKIE)).toBe("");
  });
});
