import { describe, expect, it } from "vitest";
import { createEmployeeSchema } from "../src/lib/validation";

describe("createEmployeeSchema", () => {
  const base = {
    firstName: "Léa",
    lastName: "Martin",
    email: "lea@test.local",
    phone: "",
    password: "Motdepasse1",
    passwordConfirm: "Motdepasse1",
    staffPreset: "CASHIER" as const,
  };

  it("accepte une création directe valide", () => {
    const parsed = createEmployeeSchema.safeParse(base);
    expect(parsed.success).toBe(true);
  });

  it("refuse une confirmation différente", () => {
    const parsed = createEmployeeSchema.safeParse({ ...base, passwordConfirm: "Autre1234" });
    expect(parsed.success).toBe(false);
  });

  it("refuse un mot de passe trop court", () => {
    const parsed = createEmployeeSchema.safeParse({ ...base, password: "court", passwordConfirm: "court" });
    expect(parsed.success).toBe(false);
  });

  it("refuse un e-mail invalide", () => {
    const parsed = createEmployeeSchema.safeParse({ ...base, email: "pas-un-email" });
    expect(parsed.success).toBe(false);
  });

  it("normalise l'e-mail en minuscules via le schéma email", () => {
    const parsed = createEmployeeSchema.safeParse({ ...base, email: "Lea@Test.Local" });
    expect(parsed.success).toBe(true);
    if (parsed.success) expect(parsed.data.email).toBe("lea@test.local");
  });
});

describe("EmployeeCreateError", () => {
  it("encode le statut HTTP", async () => {
    const { EmployeeCreateError } = await import("../src/lib/employee-create");
    const error = new EmployeeCreateError("Doublon", 409);
    expect(error.status).toBe(409);
  });
});

describe("hashPassword", () => {
  it("hache avec bcrypt", async () => {
    const { hashPassword, verifyPassword } = await import("../src/lib/password");
    const hash = await hashPassword("Motdepasse1");
    expect(hash).not.toBe("Motdepasse1");
    expect(hash.startsWith("$2")).toBe(true);
    expect(await verifyPassword("Motdepasse1", hash)).toBe(true);
    expect(await verifyPassword("wrong", hash)).toBe(false);
  });
});
