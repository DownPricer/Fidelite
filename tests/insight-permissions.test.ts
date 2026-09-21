import { describe, expect, it } from "vitest";
import { canViewStatistics } from "../src/lib/rbac";

const admin = { role: "MERCHANT_ADMIN" as const, staffPreset: "CASHIER" as const, permissions: null };
const cashier = { role: "EMPLOYEE" as const, staffPreset: "CASHIER" as const, permissions: null };
const manager = { role: "EMPLOYEE" as const, staffPreset: "MANAGER" as const, permissions: null };
const grantedCashier = {
  role: "EMPLOYEE" as const,
  staffPreset: "CASHIER" as const,
  permissions: { viewStatistics: true },
};

describe("canViewStatistics", () => {
  it("autorise toujours l'administrateur du commerce", () => {
    expect(canViewStatistics(admin)).toBe(true);
  });

  it("refuse un employé caisse ou responsable par défaut", () => {
    expect(canViewStatistics(cashier)).toBe(false);
    expect(canViewStatistics(manager)).toBe(false);
  });

  it("autorise un employé seulement si la permission a été explicitement accordée", () => {
    expect(canViewStatistics(grantedCashier)).toBe(true);
  });
});
