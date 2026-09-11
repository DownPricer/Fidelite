import { describe, expect, it } from "vitest";
import { formatUnitCount, progressBalanceLabel } from "@/lib/loyalty-labels";

describe("formatUnitCount — singulier / pluriel", () => {
  it("formate passages", () => {
    expect(formatUnitCount(0, "passages")).toBe("0 passage");
    expect(formatUnitCount(1, "passages")).toBe("1 passage");
    expect(formatUnitCount(2, "passages")).toBe("2 passages");
  });

  it("formate points", () => {
    expect(formatUnitCount(0, "points")).toBe("0 point");
    expect(formatUnitCount(1, "points")).toBe("1 point");
    expect(formatUnitCount(2, "points")).toBe("2 points");
  });
});

describe("progressBalanceLabel", () => {
  it("utilise le pluriel pour plusieurs passages", () => {
    expect(progressBalanceLabel("VISITS", 7, 10)).toBe("7 / 10 passages");
  });

  it("utilise le singulier pour un seul passage cible", () => {
    expect(progressBalanceLabel("VISITS", 0, 1)).toBe("0 / 1 passage");
  });
});
