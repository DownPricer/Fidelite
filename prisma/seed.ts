import { randomUUID } from "crypto";
import { PrismaClient, MerchantRole, PlatformRole } from "@prisma/client";
import bcrypt from "bcryptjs";
import { signQrToken } from "../src/lib/qr";

const prisma = new PrismaClient();

function requiredEnv(name: string, fallback?: string) {
  const value = process.env[name] ?? fallback;
  if (!value) {
    throw new Error(`Variable manquante pour le seed : ${name}`);
  }
  return value;
}

async function upsertEmployee(input: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  merchantId: string;
}) {
  const user = await prisma.user.upsert({
    where: { email: input.email.toLowerCase() },
    update: { isActive: true },
    create: {
      email: input.email.toLowerCase(),
      passwordHash: await bcrypt.hash(input.password, 12),
      firstName: input.firstName,
      lastName: input.lastName,
      platformRole: PlatformRole.CUSTOMER,
      privacyConsentAt: new Date(),
    },
  });

  await prisma.merchantMembership.upsert({
    where: { userId_merchantId: { userId: user.id, merchantId: input.merchantId } },
    update: {
      role: MerchantRole.EMPLOYEE,
      isActive: true,
      invitationStatus: "ACCEPTED",
      invitationAcceptedAt: new Date(),
      invitationTokenHash: null,
      invitationExpiresAt: null,
    },
    create: {
      userId: user.id,
      merchantId: input.merchantId,
      role: MerchantRole.EMPLOYEE,
      invitationStatus: "ACCEPTED",
      invitationAcceptedAt: new Date(),
    },
  });

  return user;
}

async function main() {
  if (process.env.NODE_ENV === "production" && process.env.SEED_ALLOW_PRODUCTION !== "true") {
    throw new Error(
      "Le seed est refusé en production. Définissez SEED_ALLOW_PRODUCTION=true uniquement si vous savez ce que vous faites.",
    );
  }

  const superEmail = requiredEnv("SEED_SUPERADMIN_EMAIL", "superadmin@fifelite.local").toLowerCase();
  const superPassword = requiredEnv("SEED_SUPERADMIN_PASSWORD", "ChangeMe!SuperAdmin1");
  const adminEmail = requiredEnv("SEED_MERCHANT_ADMIN_EMAIL", "admin@cafe-demo.local").toLowerCase();
  const adminPassword = requiredEnv("SEED_MERCHANT_ADMIN_PASSWORD", "ChangeMe!Merchant1");
  const employeeEmail = requiredEnv("SEED_EMPLOYEE_EMAIL", "employe@cafe-demo.local").toLowerCase();
  const employeePassword = requiredEnv("SEED_EMPLOYEE_PASSWORD", "ChangeMe!Employee1");
  const employee2Email = requiredEnv("SEED_EMPLOYEE2_EMAIL", "sam@cafe-demo.local").toLowerCase();
  const employee2Password = requiredEnv("SEED_EMPLOYEE2_PASSWORD", "ChangeMe!Employee2");
  const employee3Email = requiredEnv("SEED_EMPLOYEE3_EMAIL", "noa@cafe-demo.local").toLowerCase();
  const employee3Password = requiredEnv("SEED_EMPLOYEE3_PASSWORD", "ChangeMe!Employee3");
  const customerEmail = requiredEnv("SEED_CUSTOMER_EMAIL", "client@demo.local").toLowerCase();
  const customerPassword = requiredEnv("SEED_CUSTOMER_PASSWORD", "ChangeMe!Customer1");

  const superAdmin = await prisma.user.upsert({
    where: { email: superEmail },
    update: { platformRole: PlatformRole.SUPER_ADMIN, isActive: true },
    create: {
      email: superEmail,
      passwordHash: await bcrypt.hash(superPassword, 12),
      firstName: "Super",
      lastName: "Admin",
      platformRole: PlatformRole.SUPER_ADMIN,
      privacyConsentAt: new Date(),
    },
  });

  const merchant = await prisma.merchant.upsert({
    where: { slug: "cafe-demo" },
    update: {
      name: "Café Demo",
      primaryColor: "#B45309",
      isActive: true,
    },
    create: {
      name: "Café Demo",
      slug: "cafe-demo",
      primaryColor: "#B45309",
      isActive: true,
    },
  });

  await prisma.loyaltyProgram.upsert({
    where: { merchantId: merchant.id },
    update: {
      visitsRequired: 10,
      rewardLabel: "1 boisson offerte",
    },
    create: {
      merchantId: merchant.id,
      visitsRequired: 10,
      rewardLabel: "1 boisson offerte",
    },
  });

  const merchantAdmin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: { isActive: true },
    create: {
      email: adminEmail,
      passwordHash: await bcrypt.hash(adminPassword, 12),
      firstName: "Léa",
      lastName: "Martin",
      platformRole: PlatformRole.CUSTOMER,
      privacyConsentAt: new Date(),
    },
  });

  await prisma.merchantMembership.upsert({
    where: { userId_merchantId: { userId: merchantAdmin.id, merchantId: merchant.id } },
    update: { role: MerchantRole.MERCHANT_ADMIN, isActive: true },
    create: {
      userId: merchantAdmin.id,
      merchantId: merchant.id,
      role: MerchantRole.MERCHANT_ADMIN,
    },
  });

  await upsertEmployee({
    email: employeeEmail,
    password: employeePassword,
    firstName: "Hugo",
    lastName: "Bernard",
    merchantId: merchant.id,
  });

  await upsertEmployee({
    email: employee2Email,
    password: employee2Password,
    firstName: "Sam",
    lastName: "Durand",
    merchantId: merchant.id,
  });

  await upsertEmployee({
    email: employee3Email,
    password: employee3Password,
    firstName: "Noa",
    lastName: "Petit",
    merchantId: merchant.id,
  });

  const customer = await prisma.user.upsert({
    where: { email: customerEmail },
    update: {
      isActive: true,
      firstName: "Léa",
      lastName: "Martin",
      fifeLifePoints: 180,
      clientNumber: "482917",
    },
    create: {
      email: customerEmail,
      passwordHash: await bcrypt.hash(customerPassword, 12),
      firstName: "Léa",
      lastName: "Martin",
      fifeLifePoints: 180,
      clientNumber: "482917",
      platformRole: PlatformRole.CUSTOMER,
      privacyConsentAt: new Date(),
    },
  });

  await prisma.customerMembership.upsert({
    where: { userId_merchantId: { userId: customer.id, merchantId: merchant.id } },
    update: { points: 7 },
    create: {
      userId: customer.id,
      merchantId: merchant.id,
      points: 7,
    },
  });

  const qrRecord = await prisma.fifeLifeQrToken.upsert({
    where: { userId: customer.id },
    update: {},
    create: {
      id: randomUUID(),
      userId: customer.id,
      jti: randomUUID(),
    },
  });

  const demoQrToken = await signQrToken({ jti: qrRecord.jti });

  await prisma.auditLog.create({
    data: {
      actorId: superAdmin.id,
      merchantId: merchant.id,
      action: "SEED_DEMO",
      metadata: { merchant: "cafe-demo", demoClientNumber: "482917" },
    },
  });

  console.log("Seed Fife Life terminé.");
  console.log("Comptes créés (mots de passe lus depuis les variables d'environnement) :");
  console.log(`  Super-admin : ${superEmail}`);
  console.log(`  Admin Café Demo : ${adminEmail}`);
  console.log(`  Employé caisse (Hugo) : ${employeeEmail}`);
  console.log(`  Employé caisse (Sam) : ${employee2Email}`);
  console.log(`  Employé caisse (Noa) : ${employee3Email}`);
  console.log(`  Client démo (Léa Martin) : ${customerEmail}`);
  console.log("");
  console.log("QR de test client (coller dans le scan caisse) :");
  console.log(`  ${demoQrToken}`);
  console.log("Numéro client affiché sur la carte : 482917");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
