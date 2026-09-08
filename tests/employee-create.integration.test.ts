/**
 * Test d'intégration création employé directe (nécessite PostgreSQL).
 * Exécution : npm run test:employee-create
 */
import { randomUUID } from "crypto";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { createDirectEmployee, EmployeeCreateError } from "../src/lib/employee-create";
import { verifyPassword } from "../src/lib/password";
import { prisma } from "../src/lib/prisma";

describe("création employé directe (PostgreSQL)", () => {
  let merchantId = "";
  const testEmail = `employe-direct-${randomUUID().slice(0, 8)}@test.local`;
  const testPassword = "TestEmploye1!";
  let dbReady = false;

  beforeAll(async () => {
    if (!process.env.DATABASE_URL) return;
    try {
      await prisma.$queryRaw`SELECT 1`;
      const merchant = await prisma.merchant.findFirst({ where: { isActive: true } });
      if (!merchant) return;
      merchantId = merchant.id;
      dbReady = true;
    } catch {
      // PostgreSQL indisponible — les tests seront ignorés individuellement.
    }
  });

  afterAll(async () => {
    if (!dbReady) return;
    const user = await prisma.user.findUnique({ where: { email: testEmail } });
    if (user) {
      await prisma.merchantMembership.deleteMany({ where: { userId: user.id } });
      await prisma.user.delete({ where: { id: user.id } });
    }
    await prisma.$disconnect();
  });

  it("crée un employé actif avec mot de passe haché", async (ctx) => {
    if (!dbReady) ctx.skip();
    const membership = await createDirectEmployee({
      merchantId,
      data: {
        firstName: "Test",
        lastName: "Direct",
        email: testEmail,
        phone: "",
        password: testPassword,
        passwordConfirm: testPassword,
        staffPreset: "CASHIER",
      },
    });

    expect(membership.invitationStatus).toBe("ACCEPTED");
    expect(membership.isActive).toBe(true);

    const user = await prisma.user.findUniqueOrThrow({ where: { id: membership.userId } });
    expect(user.passwordHash).not.toBe(testPassword);
    expect(await verifyPassword(testPassword, user.passwordHash)).toBe(true);
  });

  it("refuse un doublon dans le même commerce", async (ctx) => {
    if (!dbReady) ctx.skip();
    await expect(
      createDirectEmployee({
        merchantId,
        data: {
          firstName: "Test",
          email: testEmail,
          phone: "",
          password: testPassword,
          passwordConfirm: testPassword,
          staffPreset: "CASHIER",
        },
      }),
    ).rejects.toMatchObject({ message: expect.stringMatching(/déjà/i), status: 409 });
  });

  it("refuse un compte Fife Life existant", async (ctx) => {
    if (!dbReady) ctx.skip();
    const admin = await prisma.user.findFirst({
      where: { merchantMemberships: { some: { role: "MERCHANT_ADMIN" } } },
    });
    if (!admin) return;

    await expect(
      createDirectEmployee({
        merchantId,
        data: {
          firstName: "Hack",
          email: admin.email,
          phone: "",
          password: "AutreMotdepasse1!",
          passwordConfirm: "AutreMotdepasse1!",
          staffPreset: "CASHIER",
        },
      }),
    ).rejects.toBeInstanceOf(EmployeeCreateError);
  });
});
