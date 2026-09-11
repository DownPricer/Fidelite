import { describe, expect, it } from "vitest";
import { MerchantRole } from "@prisma/client";
import {
  hasMerchantStaffAccess,
  shouldRedirectAppToEmployeeSpace,
  type MerchantAppAccess,
} from "@/lib/merchant-app-access";
import { middleware } from "@/middleware";
import { NextRequest } from "next/server";
import { env } from "@/lib/env";

const EMPLOYEE_SESSION_COOKIE = env.employeeSessionCookie;
const MERCHANT_SESSION_COOKIE = env.sessionCookie;

function request(path: string, cookies: Record<string, string> = {}) {
  const cookieHeader = Object.entries(cookies)
    .map(([key, value]) => `${key}=${value}`)
    .join("; ");
  return new NextRequest(`http://localhost:3000${path}`, {
    headers: cookieHeader ? { cookie: cookieHeader } : {},
  });
}

const adminMembership = {
  merchantId: "m1",
  role: MerchantRole.MERCHANT_ADMIN,
  staffPreset: "CASHIER" as const,
  permissions: null,
  isActive: true,
  merchant: { isActive: true, name: "Café Demo", slug: "cafe-demo" },
};

describe("merchant app access decisions", () => {
  it("priorise la session commerçant quand les deux sessions sont actives", () => {
    const access = {
      access: "MERCHANT",
      user: {
        id: "u1",
        merchantMemberships: [adminMembership],
      },
      membership: adminMembership,
      admin: true,
    } satisfies MerchantAppAccess;

    expect(
      shouldRedirectAppToEmployeeSpace({ access, pathname: "/app" }),
    ).toBe(false);
    expect(
      shouldRedirectAppToEmployeeSpace({ access, pathname: "/app/clients" }),
    ).toBe(false);
    expect(
      shouldRedirectAppToEmployeeSpace({ access, pathname: "/app/caisse" }),
    ).toBe(false);
  });

  it("redirige uniquement la session employé seule hors connexion commerçant", () => {
    const access: MerchantAppAccess = { access: "EMPLOYEE_ONLY" };
    expect(shouldRedirectAppToEmployeeSpace({ access, pathname: "/app" })).toBe(true);
    expect(shouldRedirectAppToEmployeeSpace({ access, pathname: "/app/clients" })).toBe(true);
    expect(shouldRedirectAppToEmployeeSpace({ access, pathname: "/app/connexion" })).toBe(false);
  });

  it("accepte un administrateur commerçant actif", () => {
    expect(hasMerchantStaffAccess(adminMembership)).toBe(true);
  });
});

describe("middleware /app routing", () => {
  it("ne redirige plus /app vers /employe/scan sur la seule présence d'un cookie employé", () => {
    const response = middleware(
      request("/app/clients", { [EMPLOYEE_SESSION_COOKIE]: "stale-token" }),
    );
    expect(response.status).not.toBe(307);
    expect(response.headers.get("location")).toBeNull();
  });

  it("laisse /app accessible avec cookies commerçant et employé", () => {
    const response = middleware(
      request("/app/caisse", {
        [EMPLOYEE_SESSION_COOKIE]: "employee-token",
        [MERCHANT_SESSION_COOKIE]: "merchant-token",
      }),
    );
    expect(response.status).not.toBe(307);
    expect(response.headers.get("location")).toBeNull();
  });
});
