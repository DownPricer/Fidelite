import { describe, expect, it } from "vitest";
import { validateInvitationLookup } from "../src/lib/employee-invitation-service";

const baseLookup = {
  invitation: {
    id: "inv1",
    expiresAt: new Date(Date.now() + 60_000),
    usedAt: null,
    revokedAt: null,
  },
  membership: {
    id: "m1",
    userId: "u1",
    merchantId: "mer1",
    invitationStatus: "PENDING",
    isActive: true,
    inviteMessage: null,
    user: { firstName: "Léa", lastName: "Martin", email: "lea@demo.local", isActive: true },
    merchant: { name: "Café Demo", isActive: true },
  },
};

describe("validateInvitationLookup", () => {
  it("accepte une invitation valide", () => {
    const result = validateInvitationLookup(baseLookup);
    expect(result.ok).toBe(true);
  });

  it("refuse une invitation révoquée", () => {
    const result = validateInvitationLookup({
      ...baseLookup,
      invitation: { ...baseLookup.invitation, revokedAt: new Date() },
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toMatch(/annulée/i);
  });

  it("refuse une invitation déjà utilisée", () => {
    const result = validateInvitationLookup({
      ...baseLookup,
      invitation: { ...baseLookup.invitation, usedAt: new Date() },
      membership: { ...baseLookup.membership, invitationStatus: "ACCEPTED" },
    });
    expect(result.ok).toBe(false);
  });

  it("refuse une invitation expirée", () => {
    const result = validateInvitationLookup({
      ...baseLookup,
      invitation: { ...baseLookup.invitation, expiresAt: new Date(Date.now() - 1000) },
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toMatch(/expiré/i);
  });

  it("refuse un commerce inactif", () => {
    const result = validateInvitationLookup({
      ...baseLookup,
      membership: {
        ...baseLookup.membership,
        merchant: { name: "Café Demo", isActive: false },
      },
    });
    expect(result.ok).toBe(false);
  });
});
