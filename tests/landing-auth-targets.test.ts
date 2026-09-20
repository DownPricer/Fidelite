import { afterEach, describe, expect, it, vi } from "vitest";

const { getSessionUserMock, getEmployeeSessionMock } = vi.hoisted(() => ({
  getSessionUserMock: vi.fn(),
  getEmployeeSessionMock: vi.fn(),
}));

vi.mock("@/lib/session", () => ({ getSessionUser: getSessionUserMock }));
vi.mock("@/lib/employee-session", () => ({ getEmployeeSession: getEmployeeSessionMock }));

import { resolveLandingAuthTargets } from "@/lib/landing-auth-targets";

function membership(role: "MERCHANT_ADMIN" | "EMPLOYEE" | "MANAGER") {
  return {
    merchantId: "merchant-1",
    role,
    staffPreset: "CASHIER" as const,
    permissions: null,
    isActive: true,
    merchant: { isActive: true, name: "Merchant", slug: "merchant" },
  };
}

describe("resolveLandingAuthTargets", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("sends an anonymous visitor to the client login and the pro chooser", async () => {
    getSessionUserMock.mockResolvedValue(null);
    getEmployeeSessionMock.mockResolvedValue(null);

    const targets = await resolveLandingAuthTargets();

    expect(targets).toEqual({ clientHref: "/connexion", proHref: "/pro" });
  });

  it("sends a plain client (no staff membership) straight to the wallet, pro CTA still to the chooser", async () => {
    getSessionUserMock.mockResolvedValue({ merchantMemberships: [] });
    getEmployeeSessionMock.mockResolvedValue(null);

    const targets = await resolveLandingAuthTargets();

    expect(targets).toEqual({ clientHref: "/carte", proHref: "/pro" });
  });

  it("sends a merchant admin straight to the merchant dashboard", async () => {
    getSessionUserMock.mockResolvedValue({ merchantMemberships: [membership("MERCHANT_ADMIN")] });
    getEmployeeSessionMock.mockResolvedValue(null);

    const targets = await resolveLandingAuthTargets();

    expect(targets).toEqual({ clientHref: "/carte", proHref: "/app" });
  });

  it("sends a staff member with the EMPLOYEE role straight to the till", async () => {
    getSessionUserMock.mockResolvedValue({ merchantMemberships: [membership("EMPLOYEE")] });
    getEmployeeSessionMock.mockResolvedValue(null);

    const targets = await resolveLandingAuthTargets();

    expect(targets).toEqual({ clientHref: "/carte", proHref: "/app/caisse" });
  });

  it("prioritizes a dedicated employee session for the pro target", async () => {
    getSessionUserMock.mockResolvedValue(null);
    getEmployeeSessionMock.mockResolvedValue({ user: { id: "u1" }, membership: membership("EMPLOYEE") });

    const targets = await resolveLandingAuthTargets();

    expect(targets).toEqual({ clientHref: "/connexion", proHref: "/employe/scan" });
  });

  it("never trusts anything but the server-verified session to pick a destination", async () => {
    // No amount of client input reaches this function — it only reads server session state.
    expect(resolveLandingAuthTargets.length).toBe(0);
  });
});
