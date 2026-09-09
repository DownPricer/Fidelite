/**
 * Crée ou met à jour le premier super-administrateur.
 * Usage :
 *   SUPER_ADMIN_EMAIL=... SUPER_ADMIN_PASSWORD=... npx tsx scripts/create-super-admin.ts
 */
import { PlatformRole, PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

function required(name: string) {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`Variable requise : ${name}`);
  return value;
}

async function main() {
  const email = required("SUPER_ADMIN_EMAIL").toLowerCase();
  const password = required("SUPER_ADMIN_PASSWORD");
  const firstName = process.env.SUPER_ADMIN_FIRST_NAME?.trim() || "Super";
  const lastName = process.env.SUPER_ADMIN_LAST_NAME?.trim() || "Admin";

  if (password.length < 12) {
    throw new Error("SUPER_ADMIN_PASSWORD doit contenir au moins 12 caractères.");
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await prisma.user.upsert({
    where: { email },
    update: {
      platformRole: PlatformRole.SUPER_ADMIN,
      passwordHash,
      isActive: true,
      firstName,
      lastName,
    },
    create: {
      email,
      passwordHash,
      firstName,
      lastName,
      platformRole: PlatformRole.SUPER_ADMIN,
      privacyConsentAt: new Date(),
      isActive: true,
    },
  });

  console.log(`Super-admin prêt : ${user.email} (id=${user.id})`);
  console.log("Le mot de passe n'a pas été journalisé.");
}

main()
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
