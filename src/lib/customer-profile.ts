import type { CustomerPreferences, User } from "@prisma/client";
import { prisma } from "./prisma";

export type ProfilePayload = {
  id: string;
  firstName: string;
  lastName: string | null;
  displayName: string | null;
  email: string;
  pendingEmail: string | null;
  avatarUrl: string | null;
  phone: string | null;
  phoneCountryCode: string | null;
  phoneVerified: boolean;
  addressLine1: string | null;
  addressLine2: string | null;
  postalCode: string | null;
  city: string | null;
  country: string | null;
  authMethod: "password";
  hasPassword: true;
};

export type PreferencesPayload = {
  notifyPointsMovements: boolean;
  notifyNewBenefit: boolean;
  notifyBenefitExpiring: boolean;
  notifyNewCard: boolean;
  notifyMerchantOffers: boolean;
  notifyFifeLifeNews: boolean;
  notifySecurity: boolean;
  notifyChannelPush: boolean;
  notifyChannelEmail: boolean;
  notifyChannelSms: boolean;
  consentPersonalizedOffers: boolean;
  consentMarketing: boolean;
  consentAnalytics: boolean;
  language: string;
};

export function displayFullName(user: Pick<User, "firstName" | "lastName" | "displayName">) {
  if (user.displayName?.trim()) return user.displayName.trim();
  return [user.firstName, user.lastName].filter(Boolean).join(" ");
}

export function serializeProfile(user: User): ProfilePayload {
  return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    displayName: user.displayName,
    email: user.email,
    pendingEmail: user.pendingEmail,
    avatarUrl: user.avatarUrl,
    phone: user.phone,
    phoneCountryCode: user.phoneCountryCode,
    phoneVerified: user.phoneVerified,
    addressLine1: user.addressLine1,
    addressLine2: user.addressLine2,
    postalCode: user.postalCode,
    city: user.city,
    country: user.country,
    authMethod: "password",
    hasPassword: true,
  };
}

export function serializePreferences(prefs: CustomerPreferences): PreferencesPayload {
  return {
    notifyPointsMovements: prefs.notifyPointsMovements,
    notifyNewBenefit: prefs.notifyNewBenefit,
    notifyBenefitExpiring: prefs.notifyBenefitExpiring,
    notifyNewCard: prefs.notifyNewCard,
    notifyMerchantOffers: prefs.notifyMerchantOffers,
    notifyFifeLifeNews: prefs.notifyFifeLifeNews,
    notifySecurity: prefs.notifySecurity,
    notifyChannelPush: prefs.notifyChannelPush,
    notifyChannelEmail: prefs.notifyChannelEmail,
    notifyChannelSms: prefs.notifyChannelSms,
    consentPersonalizedOffers: prefs.consentPersonalizedOffers,
    consentMarketing: prefs.consentMarketing,
    consentAnalytics: prefs.consentAnalytics,
    language: prefs.language,
  };
}

export async function ensureCustomerPreferences(userId: string) {
  const existing = await prisma.customerPreferences.findUnique({ where: { userId } });
  if (existing) return existing;
  return prisma.customerPreferences.create({ data: { userId } });
}

export async function getProfileUser(userId: string) {
  return prisma.user.findUnique({
    where: { id: userId },
    include: { preferences: true },
  });
}
