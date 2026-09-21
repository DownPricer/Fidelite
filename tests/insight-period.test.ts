import { describe, expect, it } from "vitest";
import {
  parisDateKey,
  parisWeekdayIndex,
  percentChange,
  resolvePeriod,
  startOfParisWeek,
} from "../src/lib/insight-period";

describe("percentChange", () => {
  it("calcule une évolution normale", () => {
    expect(percentChange(150, 100)).toBe(50);
    expect(percentChange(50, 100)).toBe(-50);
  });

  it("ne renvoie jamais NaN/Infinity quand la valeur précédente est nulle", () => {
    expect(percentChange(10, 0)).toBeNull();
    expect(percentChange(0, 0)).toBe(0);
    expect(Number.isFinite(percentChange(10, 0) ?? 0)).toBe(true);
  });
});

describe("resolvePeriod", () => {
  it("couvre exactement N jours pour 7d/30d/90d", () => {
    const now = new Date("2026-03-18T15:00:00.000Z");
    const range7 = resolvePeriod("7d", now);
    const days = Math.round((range7.end.getTime() - range7.start.getTime()) / 86_400_000);
    expect(days).toBeGreaterThanOrEqual(6);
    expect(days).toBeLessThanOrEqual(7);

    const range30 = resolvePeriod("30d", now);
    expect(range30.start.getTime()).toBeLessThan(range7.start.getTime());
  });

  it("place la comparaison immédiatement avant la période courante", () => {
    const now = new Date("2026-03-18T15:00:00.000Z");
    const range = resolvePeriod("30d", now);
    expect(range.compareEnd.getTime()).toBe(range.start.getTime());
    const currentDuration = range.end.getTime() - range.start.getTime();
    const compareDuration = range.compareEnd.getTime() - range.compareStart.getTime();
    expect(compareDuration).toBe(currentDuration);
  });

  it("bucket mensuel pour 12m", () => {
    const range = resolvePeriod("12m", new Date("2026-03-18T15:00:00.000Z"));
    expect(range.bucket).toBe("month");
  });
});

describe("semaines Europe/Paris démarrant le lundi", () => {
  it("startOfParisWeek retombe toujours sur un lundi", () => {
    const wednesday = new Date("2026-03-18T15:00:00.000Z");
    const weekStart = startOfParisWeek(wednesday);
    expect(parisWeekdayIndex(weekStart)).toBe(0);
    expect(weekStart.getTime()).toBeLessThanOrEqual(wednesday.getTime());
  });

  it("parisDateKey est stable au format YYYY-MM-DD", () => {
    expect(parisDateKey(new Date("2026-01-05T23:30:00.000Z"))).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});
