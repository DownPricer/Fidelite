import { getEmployeeSession } from "./employee-session";
import { firstActiveStaffMembership } from "./rbac";
import { getSessionUser } from "./session";

export type LandingAuthTargets = {
  /** Destination for a "client" sign-in action. */
  clientHref: string;
  /** Destination for a "professional" (merchant/employee) sign-in action. */
  proHref: string;
};

/**
 * Route buttons never trust a client-supplied role: destinations always come from
 * the server-verified session (and each target page re-checks the role itself).
 */
export async function resolveLandingAuthTargets(): Promise<LandingAuthTargets> {
  const [user, employeeSession] = await Promise.all([getSessionUser(), getEmployeeSession()]);

  let clientHref = "/connexion";
  let proHref = "/pro";

  if (user) {
    clientHref = "/carte";
    const membership = firstActiveStaffMembership(user.merchantMemberships);
    if (membership) {
      proHref = membership.role === "EMPLOYEE" ? "/app/caisse" : "/app";
    }
  }

  if (employeeSession) {
    proHref = "/employe/scan";
  }

  return { clientHref, proHref };
}
