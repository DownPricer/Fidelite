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

describe("contrôle des rôles", () => {
  it("réserve le super-admin à la plateforme", () => {
    expect(isSuperAdmin("SUPER_ADMIN")).toBe(true);
    expect(isSuperAdmin("CUSTOMER")).toBe(false);
  });

  it("autorise admin et employé à ouvrir la caisse", () => {
    expect(canOpenCaisse("MERCHANT_ADMIN")).toBe(true);
    expect(canOpenCaisse("EMPLOYEE")).toBe(true);
  });

  it("interdit à l'employé les réglages, clients et employés", () => {
    expect(canManageMerchantSettings("EMPLOYEE")).toBe(false);
    expect(canManageEmployees("EMPLOYEE")).toBe(false);
    expect(canViewAllCustomers("EMPLOYEE")).toBe(false);
    expect(canAdjustPoints("EMPLOYEE")).toBe(false);
  });

  it("autorise l'admin commerçant à gérer son commerce", () => {
    expect(canManageMerchantSettings("MERCHANT_ADMIN")).toBe(true);
    expect(canManageEmployees("MERCHANT_ADMIN")).toBe(true);
    expect(canViewAllCustomers("MERCHANT_ADMIN")).toBe(true);
    expect(canAdjustPoints("MERCHANT_ADMIN")).toBe(true);
    expect(MAX_ACTIVE_EMPLOYEES).toBe(10);
  });
});
