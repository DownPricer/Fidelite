import { describe, expect, it } from "vitest";
import {
  isCancellable,
  isDuplicable,
  requiresModeration,
  statusAfterFundingConfirmed,
  statusAfterModerationApproved,
  statusAfterModerationRejected,
} from "../src/lib/campaign-lifecycle";

describe("requiresModeration", () => {
  it("une campagne vers ses propres membres n'a jamais besoin de modération", () => {
    expect(requiresModeration("IN_APP_PUSH", "MERCHANT_MEMBERS")).toBe(false);
    expect(requiresModeration("EMAIL", "MERCHANT_MEMBERS")).toBe(false);
  });

  it("une campagne réseau (audience locale) requiert toujours la modération", () => {
    expect(requiresModeration("IN_APP_PUSH", "NETWORK_LOCAL")).toBe(true);
    expect(requiresModeration("EMAIL", "NETWORK_LOCAL")).toBe(true);
  });

  it("une publicité sponsorisée requiert toujours la modération", () => {
    expect(requiresModeration("SPONSORED_AD", null)).toBe(true);
  });
});

describe("transitions de statut", () => {
  it("financement confirmé → SCHEDULED direct pour une campagne membres", () => {
    expect(statusAfterFundingConfirmed({ channel: "EMAIL", audienceType: "MERCHANT_MEMBERS" })).toBe("SCHEDULED");
  });

  it("financement confirmé → PENDING_REVIEW pour une campagne réseau ou publicité", () => {
    expect(statusAfterFundingConfirmed({ channel: "EMAIL", audienceType: "NETWORK_LOCAL" })).toBe(
      "PENDING_REVIEW",
    );
    expect(statusAfterFundingConfirmed({ channel: "SPONSORED_AD", audienceType: null })).toBe("PENDING_REVIEW");
  });

  it("modération approuvée/refusée", () => {
    expect(statusAfterModerationApproved()).toBe("SCHEDULED");
    expect(statusAfterModerationRejected()).toBe("REJECTED");
  });
});

describe("annulation / duplication", () => {
  it("annulable uniquement avant le début d'envoi", () => {
    expect(isCancellable("DRAFT")).toBe(true);
    expect(isCancellable("SCHEDULED")).toBe(true);
    expect(isCancellable("SENDING")).toBe(false);
    expect(isCancellable("SENT")).toBe(false);
  });

  it("dupliquable sauf en cours d'envoi", () => {
    expect(isDuplicable("SENDING")).toBe(false);
    expect(isDuplicable("SENT")).toBe(true);
    expect(isDuplicable("REJECTED")).toBe(true);
  });
});
