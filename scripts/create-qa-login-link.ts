#!/usr/bin/env npx tsx
/**
 * Génère un lien de connexion QA à usage unique.
 * Usage :
 *   npx tsx scripts/create-qa-login-link.ts merchant
 *   npx tsx scripts/create-qa-login-link.ts employee
 *   npx tsx scripts/create-qa-login-link.ts customer
 */
import { createQaMagicLoginToken, parseQaLoginRole } from "../src/lib/qa-login";
import { prisma } from "../src/lib/prisma";

async function main() {
  const role = parseQaLoginRole(process.argv[2]);
  if (!role) {
    throw new Error("Usage: npx tsx scripts/create-qa-login-link.ts <merchant|employee|customer>");
  }

  const result = await createQaMagicLoginToken(role, {
    ip: "vps-cli",
    userAgent: "scripts/create-qa-login-link.ts",
  });

  console.log(result.url);
}

main()
  .catch((error) => {
    console.error(error instanceof Error ? error.message : "Création du lien QA impossible.");
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
