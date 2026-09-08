import { randomBytes } from "crypto";
import { env } from "./env";
import { employeeInvitationUrl } from "./hosts";
import { hashToken } from "./session";

export const INVITATION_ERROR = {
  invalid: "Invitation invalide ou déjà utilisée.",
  expired: "Cette invitation a expiré. Demandez une nouvelle invitation à votre responsable.",
  cancelled: "Cette invitation a été annulée.",
} as const;

export function invitationExpiryDate(now = new Date()) {
  return new Date(now.getTime() + env.invitationDays * 24 * 60 * 60 * 1000);
}

export function createInvitationToken() {
  return randomBytes(32).toString("hex");
}

export function hashInvitationToken(token: string) {
  return hashToken(token);
}

export function buildInvitationLink(token: string) {
  return employeeInvitationUrl(token);
}

export function isInvitationExpired(expiresAt: Date | null | undefined, now = new Date()) {
  return !expiresAt || expiresAt <= now;
}

export function canEmployeeAccess(input: {
  userActive: boolean;
  membershipActive: boolean;
  invitationStatus: string;
  merchantActive: boolean;
}) {
  if (!input.userActive || !input.membershipActive || !input.merchantActive) return false;
  if (input.invitationStatus === "PENDING") return false;
  if (input.invitationStatus === "CANCELLED") return false;
  return input.invitationStatus === "ACCEPTED" || input.invitationStatus === "NONE";
}
