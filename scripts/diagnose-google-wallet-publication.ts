/**
 * Diagnostic post-approbation Issuer Google Wallet.
 * Lit les LoyaltyClass connues via l'API Google — ne recrée rien, ne soumet pas à révision.
 *
 * Usage (VPS, avec .env + compte de service monté) :
 *   npm run diagnose:wallet-publication
 *   # ou dans le conteneur :
 *   docker compose exec web npx tsx scripts/diagnose-google-wallet-publication.ts
 */
import { existsSync, readFileSync } from "fs";
import { resolve } from "path";

function loadDotEnv(filePath: string) {
  if (!existsSync(filePath)) return;
  for (const raw of readFileSync(filePath, "utf8").split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || line.startsWith("#")) continue;
    const eq = line.indexOf("=");
    if (eq <= 0) continue;
    const key = line.slice(0, eq).trim();
    let value = line.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (process.env[key] === undefined) process.env[key] = value;
  }
}

loadDotEnv(resolve(process.cwd(), ".env"));

function fail(message: string): never {
  console.error(message.replace(/private_key|access_token|refresh_token|BEGIN PRIVATE KEY/gi, "[redacted]"));
  process.exit(1);
}

async function main() {
  const { diagnoseGoogleWalletLoyaltyClasses } = await import("../src/lib/google-wallet-class-diagnostic");
  const { env } = await import("../src/lib/env");

  console.log("=== Diagnostic Google Wallet — accès publication ===");
  console.log(`Issuer ID configuré : ${env.googleWalletIssuerId || "(défaut code)"}`);
  console.log(`Classe globale configurée : ${env.googleWalletGlobalClassId || "(défaut code)"}`);
  console.log(`STRIPE_MODE (indépendant) : ${env.stripeMode}`);
  console.log(`GOOGLE_WALLET_ENABLED : ${env.googleWalletEnabled}`);

  const report = await diagnoseGoogleWalletLoyaltyClasses();
  if (!report.googleWalletConfigured) {
    fail(
      "Google Wallet non configuré (variables manquantes). Sur le VPS : npm run diagnose:wallet-publication (ou docker compose exec web …).",
    );
  }

  console.log("");
  console.log(`Issuer effectif : ${report.issuerId}`);
  console.log(`Classes analysées : ${report.classes.length}`);
  console.log("");

  let submitNeeded = 0;
  for (const row of report.classes) {
    console.log("---");
    console.log(`ID complet     : ${row.googleClassId}`);
    console.log(`Nom            : ${row.name ?? "—"}`);
    console.log(`Type           : ${row.type === "global" ? "globale Fideto" : "commerce"}`);
    console.log(`reviewStatus   : ${row.reviewStatus ?? "—"}`);
    console.log(`Présente Google: ${row.presentInGoogle ? "oui" : "non"}`);
    console.log(`Objets associés: ${row.associatedObjectCount}`);
    console.log(`Sync DB        : ${row.dbSyncStatus ?? "—"}`);
    if (row.error) console.log(`Erreur         : ${row.error}`);
    if (row.submitForReviewRecommended) {
      submitNeeded += 1;
      console.log("Action         : soumission à révision recommandée (DRAFT/REJECTED)");
    } else {
      console.log("Action         : aucune soumission (état OK ou déjà en revue/approuvé)");
    }
  }

  const global = report.classes.filter((c) => c.type === "global");
  const merchant = report.classes.filter((c) => c.type === "merchant");
  const approved = report.classes.filter((c) => c.reviewStatus === "APPROVED");
  const globalObjects = global.reduce((n, c) => n + c.associatedObjectCount, 0);

  console.log("");
  console.log("=== Synthèse ===");
  console.log(`Classes globales : ${global.length} (objets: ${globalObjects})`);
  console.log(`Classes commerce : ${merchant.length}`);
  console.log(`APPROVED         : ${approved.length}/${report.classes.length}`);
  console.log(`À soumettre      : ${submitNeeded}`);
  console.log(`STRIPE_MODE      : ${report.stripeMode} (inchangé)`);
  console.log("");
  console.log(
    "Note : un compte Google non-testeur peut ajouter une carte si l'Issuer est en publication et la LoyaltyClass est APPROVED.",
  );
}

main().catch((error) => fail(error instanceof Error ? error.message : "Erreur inconnue."));
