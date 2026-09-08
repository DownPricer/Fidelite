import { describe, expect, it } from "vitest";
import { employeeTokenFromRequest } from "../src/lib/employee-cookie";

describe("isolation session employé", () => {
  it("détecte le cookie employé dans une requête", () => {
    const req = new Request("http://localhost/app", {
      headers: {
        cookie: "fifelite_employee_session=abc123; other=1",
      },
    });
    expect(employeeTokenFromRequest(req)).toBe("abc123");
  });

  it("ignore l'absence de cookie employé", () => {
    const req = new Request("http://localhost/app", {
      headers: { cookie: "fifelite_session=standard" },
    });
    expect(employeeTokenFromRequest(req)).toBeNull();
  });
});

describe("canEmployeeAccess", () => {
  it("refuse un employé suspendu", async () => {
    const { canEmployeeAccess } = await import("../src/lib/employee-invitation");
    expect(
      canEmployeeAccess({
        userActive: false,
        membershipActive: true,
        invitationStatus: "ACCEPTED",
        merchantActive: true,
      }),
    ).toBe(false);
  });

  it("refuse une invitation en attente", async () => {
    const { canEmployeeAccess } = await import("../src/lib/employee-invitation");
    expect(
      canEmployeeAccess({
        userActive: true,
        membershipActive: true,
        invitationStatus: "PENDING",
        merchantActive: true,
      }),
    ).toBe(false);
  });
});

describe("assertEarnProgramRules", () => {
  it("refuse un montant manquant pour points selon achat", async () => {
    const { assertEarnProgramRules } = await import("../src/lib/caisse-program");
    await expect(
      assertEarnProgramRules({
        customerMembershipId: "cm1",
        merchantId: "m1",
        mode: "POINTS_BY_AMOUNT",
        rules: { requirePurchaseAmount: true },
      }),
    ).rejects.toThrow(/montant/i);
  });
});
