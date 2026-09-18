#!/usr/bin/env npx tsx
/**
 * Génère un lien de connexion QA à usage unique.
 * Usage :
 *   npx tsx scripts/create-qa-login-link.ts merchant
 *   npx tsx scripts/create-qa-login-link.ts employee
 *   npx tsx scripts/create-qa-login-link.ts customer
 *   npx tsx scripts/create-qa-login-link.ts customer --ttl-minutes 90
 */
import {
  QA_LOGIN_DEFAULT_TTL_MINUTES,
  createQaMagicLoginToken,
  parseQaLoginRole,
  parseQaLoginTtlMinutes,
} from "../src/lib/qa-login";
import { prisma } from "../src/lib/prisma";

const USAGE =
  "Usage: npx tsx scripts/create-qa-login-link.ts <merchant|employee|customer> [--ttl-minutes <nombre>]\n" +
  "Exemple: npx tsx scripts/create-qa-login-link.ts customer --ttl-minutes 90";

function parseTtlMinutes(args: string[]) {
  const ttlIndex = args.indexOf("--ttl-minutes");
  if (ttlIndex === -1) {
    return QA_LOGIN_DEFAULT_TTL_MINUTES;
  }
  const raw = args[ttlIndex + 1];
  if (!raw || raw.startsWith("--")) {
    throw new Error("Option --ttl-minutes invalide : indiquez un nombre de minutes.");
  }
  return parseQaLoginTtlMinutes(raw);
}

function assertNoUnknownArgs(args: string[]) {
  const extras = args.slice(1);
  const ttlIndex = extras.indexOf("--ttl-minutes");
  if (ttlIndex === -1) {
    if (extras.length > 0) throw new Error(USAGE);
    return;
  }
  if (ttlIndex !== 0 || extras.length !== 2) {
    throw new Error(USAGE);
  }
}

async function main() {
  const args = process.argv.slice(2);
  const role = parseQaLoginRole(args[0]);
  if (!role) {
    throw new Error(USAGE);
  }
  assertNoUnknownArgs(args);
  const ttlMinutes = parseTtlMinutes(args);

  const result = await createQaMagicLoginToken(
    role,
    {
      ip: "vps-cli",
      userAgent: "scripts/create-qa-login-link.ts",
    },
    { ttlMinutes },
  );

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
