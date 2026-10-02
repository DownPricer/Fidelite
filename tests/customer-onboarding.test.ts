import { describe, expect, it } from "vitest";
import {
  FINALIZATION_REMINDER_MS,
  PROVISIONAL_ACCESS_MS,
  isCustomerProfileComplete,
  isCustomerProfileFinalized,
  isWithinProvisionalWindow,
  resolveCustomerAccessLevel,
  customerWalletGuardRedirect,
} from "@/lib/customer-onboarding";

function buildUser(overrides: Partial<typeof baseUser> = {}) {
  return { ...baseUser, ...overrides };
}

const onboardingStartedAt = new Date(Date.now() - 25 * 60 * 60 * 1000);
const baseUser = {
  id: "u1",
  email: "lea@example.com",
  firstName: "Lea",
  lastName: "Martin",
  city: "Lyon",
  phoneVerified: true,
  platformRole: "CUSTOMER" as const,
  onboardingStartedAt,
  emailConfirmedAt: new Date(onboardingStartedAt.getTime() + 5 * 60 * 1000),
  profileFinalizedAt: null as Date | null,
  finalizationReminderSentAt: null as Date | null,
};

describe("customer onboarding access rules", () => {
  it("treats legacy accounts without onboardingStartedAt as finalized", () => {
    const legacy = { ...baseUser, onboardingStartedAt: null, emailConfirmedAt: null, phoneVerified: false };
    expect(isCustomerProfileFinalized(legacy)).toBe(true);
    expect(resolveCustomerAccessLevel(legacy)).toBe("full");
  });

  it("grants provisional access during the first 24 hours", () => {
    const startedAt = new Date(Date.now() - 2 * 60 * 60 * 1000);
    const now = new Date();
    const user = buildUser({
      onboardingStartedAt: startedAt,
      emailConfirmedAt: null,
      phoneVerified: false,
      lastName: null,
      city: null,
    });
    expect(isWithinProvisionalWindow(user, now)).toBe(true);
    expect(resolveCustomerAccessLevel(user, now)).toBe("provisional");
  });

  it("limits wallet routes after 24 hours without finalization", () => {
    const now = new Date();
    const user = buildUser({
      emailConfirmedAt: null,
      phoneVerified: false,
      lastName: null,
      city: null,
    });
    expect(resolveCustomerAccessLevel(user, now)).toBe("limited");
    expect(customerWalletGuardRedirect("/carte", user, now)).toBe("/finalisation");
    expect(customerWalletGuardRedirect("/finalisation", user, now)).toBeNull();
  });

  it("requires email, profile fields and phone verification to complete", () => {
    expect(
      isCustomerProfileComplete({
        ...baseUser,
        emailConfirmedAt: null,
      }),
    ).toBe(false);
    expect(
      isCustomerProfileComplete({
        ...baseUser,
        phoneVerified: false,
      }),
    ).toBe(false);
    expect(isCustomerProfileComplete(baseUser)).toBe(true);
  });

  it("schedules the reminder two hours after signup", () => {
    expect(FINALIZATION_REMINDER_MS).toBe(2 * 60 * 60 * 1000);
    expect(PROVISIONAL_ACCESS_MS).toBe(24 * 60 * 60 * 1000);
  });
});
