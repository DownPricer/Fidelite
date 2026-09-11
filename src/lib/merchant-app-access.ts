import { getEmployeeSession } from "@/lib/employee-session";
import { resolveMerchantDemo } from "@/lib/merchant-demo-server";
import {
  canManageMerchantSettings,
  canOpenCaisse,
  firstActiveStaffMembership,
  type StaffMembership,
} from "@/lib/rbac";
import type { SessionUser } from "@/lib/session";

export type MerchantAppAccess =
  | { access: "MERCHANT_DEMO" }
  | { access: "MERCHANT"; user: SessionUser; membership: StaffMembership; admin: boolean }
  | { access: "EMPLOYEE_ONLY" }
  | { access: "UNAUTHENTICATED" };

const MERCHANT_APP_PUBLIC_PATHS = ["/app/connexion", "/app/enter-demo", "/app/exit-demo"];

export function hasMerchantStaffAccess(membership: StaffMembership | null): membership is StaffMembership {
  if (!membership) return false;
  return canManageMerchantSettings(membership.role) || canOpenCaisse(membership);
}

export async function resolveMerchantAppAccess(): Promise<MerchantAppAccess> {
  const { user, demo } = await resolveMerchantDemo();
  if (demo) {
    console.info("[merchant-app-access] décision", "MERCHANT_DEMO");
    return { access: "MERCHANT_DEMO" };
  }

  if (user) {
    const membership = firstActiveStaffMembership(user.merchantMemberships);
    if (hasMerchantStaffAccess(membership)) {
      console.info("[merchant-app-access] décision", "MERCHANT");
      return {
        access: "MERCHANT",
        user,
        membership,
        admin: canManageMerchantSettings(membership.role),
      };
    }
  }

  const employee = await getEmployeeSession();
  if (employee) {
    console.info("[merchant-app-access] décision", "EMPLOYEE_ONLY");
    return { access: "EMPLOYEE_ONLY" };
  }

  console.info("[merchant-app-access] décision", "UNAUTHENTICATED");
  return { access: "UNAUTHENTICATED" };
}

export function isMerchantAppPublicPath(pathname: string) {
  return MERCHANT_APP_PUBLIC_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );
}

/** Redirige vers l'espace employé uniquement sans session commerçant utilisable. */
export function shouldRedirectAppToEmployeeSpace(input: {
  access: MerchantAppAccess;
  pathname: string;
}): boolean {
  if (input.access.access === "MERCHANT" || input.access.access === "MERCHANT_DEMO") {
    return false;
  }
  if (input.access.access !== "EMPLOYEE_ONLY") return false;
  if (isMerchantAppPublicPath(input.pathname)) return false;
  return true;
}
