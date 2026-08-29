import { describe, expect, it } from "vitest";
import { assertCanAddEmployee, canAddEmployee } from "../src/lib/rbac";

describe("limite de 10 employés", () => {
  it("autorise l'ajout tant que le plafond n'est pas atteint", () => {
    expect(canAddEmployee(0)).toBe(true);
    expect(canAddEmployee(9)).toBe(true);
  });

  it("refuse un 11e employé actif", () => {
    expect(canAddEmployee(10)).toBe(false);
    expect(canAddEmployee(12)).toBe(false);
    expect(() => assertCanAddEmployee(10)).toThrow(/10 employés/);
  });
});
