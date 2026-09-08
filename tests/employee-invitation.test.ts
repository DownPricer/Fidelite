import { describe, expect, it } from "vitest";
import { canEmployeeAccess, isInvitationExpired } from "../src/lib/employee-invitation";

describe("invitation employé", () => {
  it("bloque les invitations en attente", () => {
    expect(
      canEmployeeAccess({
        userActive: true,
        membershipActive: true,
        invitationStatus: "PENDING",
        merchantActive: true,
      }),
    ).toBe(false);
  });

  it("autorise un employé actif accepté", () => {
    expect(
      canEmployeeAccess({
        userActive: true,
        membershipActive: true,
        invitationStatus: "ACCEPTED",
        merchantActive: true,
      }),
    ).toBe(true);
  });

  it("détecte une invitation expirée", () => {
    expect(isInvitationExpired(new Date(Date.now() - 1000))).toBe(true);
  });
});

describe("durée d'invitation", () => {
  it("expire après 48 heures par défaut", async () => {
    const { invitationExpiryDate } = await import("../src/lib/employee-invitation");
    const now = new Date("2026-01-01T12:00:00.000Z");
    const expiry = invitationExpiryDate(now);
    expect(expiry.getTime() - now.getTime()).toBe(48 * 60 * 60 * 1000);
  });
});
