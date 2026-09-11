import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest, NextResponse } from "next/server";
import {
  CLIENT_DEMO_COOKIE,
  EMPLOYEE_DEMO_COOKIE,
  MERCHANT_DEMO_COOKIE,
} from "@/lib/demo-mode";
import { env } from "@/lib/env";
import {
  applyDemoRoleCookies,
  createDemoEnterResponse,
} from "@/lib/demo-session";
import { middleware } from "@/middleware";

const EMPLOYEE_SESSION_COOKIE = env.employeeSessionCookie;

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

describe("demo routing middleware", () => {
  it("ne redirige pas /app sur un cookie employé seul", () => {
    const response = middleware(request("/app/clients", { [EMPLOYEE_SESSION_COOKIE]: "token" }));
    expect(response.status).not.toBe(307);
    expect(response.headers.get("location")).toBeNull();
  });

  it("laisse /app accessible en mode démo commerçant", () => {
    const response = middleware(
      request("/app/clients", {
        [EMPLOYEE_SESSION_COOKIE]: "token",
        [MERCHANT_DEMO_COOKIE]: "1",
      }),
    );
    expect(response.status).not.toBe(307);
    expect(response.headers.get("location")).toBeNull();
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

  it("pose les cookies commerçant et expire les cookies employé sur la même redirection", async () => {
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
    expect(setCookies.some((row) => row.startsWith(`${MERCHANT_DEMO_COOKIE}=1`))).toBe(true);
    expect(setCookies.some((row) => row.startsWith(`${EMPLOYEE_DEMO_COOKIE}=`) && isExpiredCookie(row))).toBe(true);
    expect(
      setCookies.some((row) => row.startsWith(`${EMPLOYEE_SESSION_COOKIE}=`) && isExpiredCookie(row)),
    ).toBe(true);
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
});
