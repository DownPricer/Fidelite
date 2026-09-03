import type { MerchantRole, StaffPreset } from "@prisma/client";
import { hasPermission, type PermissionKey } from "./staff-permissions";

export const MAX_ACTIVE_EMPLOYEES = 10;

export type StaffMembership = {
  merchantId: string;
  role: MerchantRole;
  staffPreset?: StaffPreset;
  permissions?: unknown;
  isActive: boolean;
  merchant: { isActive: boolean; name: string; slug: string };
};

export function isSuperAdmin(role: import("@prisma/client").PlatformRole | null | undefined) {
  return role === "SUPER_ADMIN";
}

export function canOpenCaisse(membership: Pick<StaffMembership, "role" | "staffPreset" | "permissions">) {
  return hasPermission(
    { role: membership.role, staffPreset: membership.staffPreset ?? "CASHIER", permissions: membership.permissions },
    "caisse",
  );
}

export function canManageMerchantSettings(role: MerchantRole | null | undefined) {
  return role === "MERCHANT_ADMIN";
}

export function canManageEmployees(role: MerchantRole | null | undefined) {
  return role === "MERCHANT_ADMIN";
}

export function canViewAllCustomers(membership: Pick<StaffMembership, "role" | "staffPreset" | "permissions">) {
  if (membership.role === "MERCHANT_ADMIN") return true;
  return hasPermission(
    { role: membership.role, staffPreset: membership.staffPreset ?? "CASHIER", permissions: membership.permissions },
    "viewCustomers",
  );
}

export function canAdjustPoints(membership: Pick<StaffMembership, "role" | "staffPreset" | "permissions">) {
  if (membership.role === "MERCHANT_ADMIN") return true;
  return hasPermission(
    { role: membership.role, staffPreset: membership.staffPreset ?? "CASHIER", permissions: membership.permissions },
    "correctTransaction",
  );
}

export function staffHasPermission(membership: StaffMembership, key: PermissionKey) {
  return hasPermission(
    { role: membership.role, staffPreset: membership.staffPreset ?? "CASHIER", permissions: membership.permissions },
    key,
  );
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
