import type { MerchantRole, PlatformRole } from "@prisma/client";

export const MAX_ACTIVE_EMPLOYEES = 10;

export type StaffMembership = {
  merchantId: string;
  role: MerchantRole;
  isActive: boolean;
  merchant: { isActive: boolean; name: string; slug: string };
};

export function isSuperAdmin(role: PlatformRole | null | undefined) {
  return role === "SUPER_ADMIN";
}

export function canOpenCaisse(role: MerchantRole | null | undefined) {
  return role === "MERCHANT_ADMIN" || role === "EMPLOYEE";
}

export function canManageMerchantSettings(role: MerchantRole | null | undefined) {
  return role === "MERCHANT_ADMIN";
}

export function canManageEmployees(role: MerchantRole | null | undefined) {
  return role === "MERCHANT_ADMIN";
}

export function canViewAllCustomers(role: MerchantRole | null | undefined) {
  return role === "MERCHANT_ADMIN";
}

export function canAdjustPoints(role: MerchantRole | null | undefined) {
  return role === "MERCHANT_ADMIN";
}

export function canAddEmployee(activeEmployeeCount: number) {
  return activeEmployeeCount < MAX_ACTIVE_EMPLOYEES;
}

export function assertCanAddEmployee(activeEmployeeCount: number) {
  if (!canAddEmployee(activeEmployeeCount)) {
    throw new Error(`La limite de ${MAX_ACTIVE_EMPLOYEES} employés actifs est atteinte.`);
  }
}

export function membershipForMerchant(
  memberships: StaffMembership[],
  merchantId: string,
) {
  return memberships.find((item) => item.merchantId === merchantId && item.isActive) ?? null;
}

export function firstActiveStaffMembership(memberships: StaffMembership[]) {
  return memberships.find((item) => item.isActive && item.merchant.isActive) ?? null;
}
