import { describe, expect, it } from "vitest";
import {
  MAX_ACTIVE_EMPLOYEES,
  canAdjustPoints,
  canManageEmployees,
  canManageMerchantSettings,
  canOpenCaisse,
  canViewAllCustomers,
  isSuperAdmin,
} from "../src/lib/rbac";

const admin = { role: "MERCHANT_ADMIN" as const, staffPreset: "CASHIER" as const, permissions: null };
const employee = { role: "EMPLOYEE" as const, staffPreset: "CASHIER" as const, permissions: null };
const manager = { role: "EMPLOYEE" as const, staffPreset: "MANAGER" as const, permissions: null };

describe("contrôle des rôles", () => {
  it("réserve le super-admin à la plateforme", () => {
    expect(isSuperAdmin("SUPER_ADMIN")).toBe(true);
    expect(isSuperAdmin("CUSTOMER")).toBe(false);
  });

  it("autorise admin et employé à ouvrir la caisse", () => {
    expect(canOpenCaisse(admin)).toBe(true);
    expect(canOpenCaisse(employee)).toBe(true);
  });

  it("interdit à l'employé caisse les réglages, clients et employés", () => {
    expect(canManageMerchantSettings("EMPLOYEE")).toBe(false);
    expect(canManageEmployees("EMPLOYEE")).toBe(false);
    expect(canViewAllCustomers(employee)).toBe(false);
    expect(canAdjustPoints(employee)).toBe(false);
  });

  it("autorise le responsable à consulter les clients", () => {
    expect(canViewAllCustomers(manager)).toBe(true);
  });

  it("autorise l'admin commerçant à gérer son commerce", () => {
    expect(canManageMerchantSettings("MERCHANT_ADMIN")).toBe(true);
    expect(canManageEmployees("MERCHANT_ADMIN")).toBe(true);
    expect(canViewAllCustomers(admin)).toBe(true);
    expect(canAdjustPoints(admin)).toBe(true);
    expect(MAX_ACTIVE_EMPLOYEES).toBe(10);
  });
});
