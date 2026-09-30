import { describe, expect, it } from "vitest";
import { computeAdLifecycleStatus } from "@/lib/ad-lifecycle-worker";

describe("computeAdLifecycleStatus", () => {
  const intervals = [
    { start: "2026-09-30T18:00:00.000Z", end: "2026-09-30T19:00:00.000Z" },
    { start: "2026-10-01T18:00:00.000Z", end: "2026-10-01T19:00:00.000Z" },
  ];

  it("est SCHEDULED avant le premier créneau", () => {
    const status = computeAdLifecycleStatus(
      { startDate: new Date(intervals[0].start), endDate: new Date(intervals[1].end), hourlyIntervals: intervals },
      new Date("2026-09-30T10:00:00.000Z"),
    );
    expect(status).toBe("SCHEDULED");
  });

  it("est LIVE pendant un créneau", () => {
    const status = computeAdLifecycleStatus(
      { startDate: new Date(intervals[0].start), endDate: new Date(intervals[1].end), hourlyIntervals: intervals },
      new Date("2026-09-30T18:30:00.000Z"),
    );
    expect(status).toBe("LIVE");
  });

  it("repasse SCHEDULED entre deux créneaux (pas encore ENDED)", () => {
    const status = computeAdLifecycleStatus(
      { startDate: new Date(intervals[0].start), endDate: new Date(intervals[1].end), hourlyIntervals: intervals },
      new Date("2026-09-30T20:00:00.000Z"),
    );
    expect(status).toBe("SCHEDULED");
  });

  it("est ENDED après le dernier créneau", () => {
    const status = computeAdLifecycleStatus(
      { startDate: new Date(intervals[0].start), endDate: new Date(intervals[1].end), hourlyIntervals: intervals },
      new Date("2026-10-02T00:00:00.000Z"),
    );
    expect(status).toBe("ENDED");
  });

  it("gère les anciennes demandes sans hourlyIntervals via startDate/endDate (diffusion continue)", () => {
    const start = new Date("2026-09-30T00:00:00.000Z");
    const end = new Date("2026-10-02T00:00:00.000Z");
    expect(computeAdLifecycleStatus({ startDate: start, endDate: end, hourlyIntervals: null }, new Date("2026-09-29T00:00:00.000Z"))).toBe(
      "SCHEDULED",
    );
    expect(computeAdLifecycleStatus({ startDate: start, endDate: end, hourlyIntervals: null }, new Date("2026-10-01T00:00:00.000Z"))).toBe(
      "LIVE",
    );
    expect(computeAdLifecycleStatus({ startDate: start, endDate: end, hourlyIntervals: null }, new Date("2026-10-03T00:00:00.000Z"))).toBe(
      "ENDED",
    );
  });
});
