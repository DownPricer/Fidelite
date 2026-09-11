import { describe, expect, it } from "vitest";
import { NextRequest } from "next/server";
import { MERCHANT_DEMO_COOKIE } from "@/lib/demo-mode";
import { middleware } from "@/middleware";

function request(path: string, cookies: Record<string, string> = {}) {
  const cookieHeader = Object.entries(cookies)
    .map(([key, value]) => `${key}=${value}`)
    .join("; ");
  return new NextRequest(`http://localhost:3000${path}`, {
    headers: cookieHeader ? { cookie: cookieHeader } : {},
  });
}

describe("demo routing middleware", () => {
  it("redirige /app vers /employe/scan quand une session employé est active", () => {
    const response = middleware(request("/app/clients", { fifelite_employee_session: "token" }));
    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toContain("/employe/scan");
  });

  it("laisse /app accessible en mode démo commerçant malgré une session employé", () => {
    const response = middleware(
      request("/app/clients", {
        fifelite_employee_session: "token",
        [MERCHANT_DEMO_COOKIE]: "1",
      }),
    );
    expect(response.status).not.toBe(307);
    expect(response.headers.get("location")).toBeNull();
  });
});
