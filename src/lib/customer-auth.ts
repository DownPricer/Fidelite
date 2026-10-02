import { MerchantRole } from "@prisma/client";
import { env } from "./env";
import { verifyPassword } from "./password";
import { prisma } from "./prisma";
import { isSuperAdmin } from "./rbac";
import {
  createCustomerSession,
  customerPostAuthRedirect,
  runCustomerOnboardingSideEffects,
} from "./customer-onboarding";
import { clearEmployeeBrowserSession } from "./session-handoff";

export async function authenticateCustomerWithPassword(
  email: string,
  password: string,
  meta: { ip?: string; userAgent?: string },
) {
  const user = await prisma.user.findUnique({
    where: { email },
    include: {
      merchantMemberships: {
        where: { isActive: true },
        include: { merchant: true },
      },
    },
  });
  const valid = user ? await verifyPassword(password, user.passwordHash) : false;
  if (!user || !user.isActive || !valid) {
    return { ok: false as const, error: "Identifiants incorrects.", status: 401 };
  }

  const isMerchantAdmin = user.merchantMemberships.some(
    (item) => item.role === MerchantRole.MERCHANT_ADMIN && item.merchant.isActive,
  );
  const isEmployeeOnly =
    user.merchantMemberships.some((item) => item.role === MerchantRole.EMPLOYEE) && !isMerchantAdmin;

  if (isEmployeeOnly) {
    return {
      ok: false as const,
      error: `Utilisez l'application employé : ${env.employeeOrigin.replace(/\/$/, "")}`,
      status: 403,
    };
  }

  if (isSuperAdmin(user.platformRole)) {
    return { ok: false as const, error: "Accès réservé à l'espace client.", status: 403 };
  }

  await createCustomerSession(user.id, meta);
  await clearEmployeeBrowserSession();
  await runCustomerOnboardingSideEffects(user.id);

  return {
    ok: true as const,
    redirectTo: customerPostAuthRedirect(user),
    userId: user.id,
  };
}
