import { describe, expect, it } from "vitest";
import {
  MAX_COMPARISON_METRICS,
  MIN_COMPARISON_METRICS,
  toggleComparisonMetric,
} from "../src/app/app/statistiques/statistiques-panel";

describe("toggleComparisonMetric", () => {
  it("ajoute un indicateur sans toucher aux autres", () => {
    const current = ["passages", "scans"];
    const next = toggleComparisonMetric(current, "newClients");
    expect(next).toEqual(["passages", "scans", "newClients"]);
    expect(current).toEqual(["passages", "scans"]);
  });

  it("retire un seul indicateur ciblé sans modifier les autres", () => {
    const current = ["passages", "scans", "newClients"];
    const next = toggleComparisonMetric(current, "scans");
    expect(next).toEqual(["passages", "newClients"]);
  });

  it("refuse d'ajouter un 5e indicateur (maximum 4)", () => {
    const current = ["passages", "scans", "newClients", "returningClients"];
    expect(current.length).toBe(MAX_COMPARISON_METRICS);
    const next = toggleComparisonMetric(current, "rewardsUsed");
    expect(next).toBe(current);
    expect(next.length).toBe(MAX_COMPARISON_METRICS);
  });

  it("refuse de retirer le dernier indicateur restant (minimum 1)", () => {
    const current = ["passages"];
    expect(current.length).toBe(MIN_COMPARISON_METRICS);
    const next = toggleComparisonMetric(current, "passages");
    expect(next).toBe(current);
    expect(next).toEqual(["passages"]);
  });

  it("permet de descendre jusqu'à 1 indicateur", () => {
    let current = ["passages", "scans"];
    current = toggleComparisonMetric(current, "scans");
    expect(current).toEqual(["passages"]);
  });

  it("un clic sur un indicateur non sélectionné ne sélectionne que lui", () => {
    const current = ["passages"];
    const next = toggleComparisonMetric(current, "newClients");
    expect(next.filter((k) => !current.includes(k))).toEqual(["newClients"]);
    expect(next).toContain("passages");
  });
});
