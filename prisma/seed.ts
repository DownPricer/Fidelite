import { PrismaClient, MerchantRole, PlatformRole } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

function requiredEnv(name: string, fallback?: string) {
  const value = process.env[name] ?? fallback;
  if (!value) {
    throw new Error(`Variable manquante pour le seed : ${name}`);
  }
  return value;
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

  const employee = await prisma.user.upsert({
    where: { email: employeeEmail },
    update: { isActive: true },
    create: {
      email: employeeEmail,
      passwordHash: await bcrypt.hash(employeePassword, 12),
      firstName: "Hugo",
      lastName: "Bernard",
      platformRole: PlatformRole.CUSTOMER,
      privacyConsentAt: new Date(),
    },
  });

  await prisma.merchantMembership.upsert({
    where: { userId_merchantId: { userId: employee.id, merchantId: merchant.id } },
    update: { role: MerchantRole.EMPLOYEE, isActive: true },
    create: {
      userId: employee.id,
      merchantId: merchant.id,
      role: MerchantRole.EMPLOYEE,
    },
  });

  const customer = await prisma.user.upsert({
    where: { email: customerEmail },
    update: { isActive: true },
    create: {
      email: customerEmail,
      passwordHash: await bcrypt.hash(customerPassword, 12),
      firstName: "Camille",
      lastName: "Petit",
      platformRole: PlatformRole.CUSTOMER,
      privacyConsentAt: new Date(),
    },
  });

  await prisma.customerMembership.upsert({
    where: { userId_merchantId: { userId: customer.id, merchantId: merchant.id } },
    update: {},
    create: {
      userId: customer.id,
      merchantId: merchant.id,
      points: 7,
    },
  });

  await prisma.auditLog.create({
    data: {
      actorId: superAdmin.id,
      merchantId: merchant.id,
      action: "SEED_DEMO",
      metadata: { merchant: "cafe-demo" },
    },
  });

  console.log("Seed FifeLite terminé.");
  console.log("Comptes créés (mots de passe lus depuis les variables d'environnement) :");
  console.log(`  Super-admin : ${superEmail}`);
  console.log(`  Admin Café Demo : ${adminEmail}`);
  console.log(`  Employé Café Demo : ${employeeEmail}`);
  console.log(`  Client démo : ${customerEmail}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
