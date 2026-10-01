/**
 * Diagnostic de diffusion des mises en avant : pour chaque campagne programmée/en cours (ou validée,
 * en attente de paiement), indique si elle peut apparaître chez les clients et, sinon, pourquoi
 * (mode Stripe test/live, paiement, créneaux, audience…). Option --user <email> : vérifie en plus
 * ce que verrait ce client (consentement, zone, historique de fréquence).
 *
 * Lancement : `npx tsx scripts/diagnose-ads.ts [--user client@example.com]`
 */
import { prisma } from "../src/lib/prisma";
import { getActiveStripeMode, isPaymentAllowedForMerchant } from "../src/lib/stripe-mode";
import {
  GLOBAL_COOLDOWN_MS,
  SAME_AD_COOLDOWN_MS,
  SHOW_RATE_PERCENT,
  diagnoseAdDelivery,
  selectSponsoredForCustomerDebug,
} from "../src/lib/sponsored-selection";

async function main() {
  const userIndex = process.argv.indexOf("--user");
  const userEmail = userIndex >= 0 ? process.argv[userIndex + 1] : null;
  const mode = getActiveStripeMode();

  console.log(`Mode Stripe actif : ${mode ?? "INVALIDE"}${mode === "TEST" ? " — les campagnes payées maintenant sont des SIMULATIONS (jamais affichées aux vrais clients)" : ""}`);
  console.log(`Fréquence : 1 bandeau / ${GLOBAL_COOLDOWN_MS / 60000} min par client, même campagne / ${SAME_AD_COOLDOWN_MS / 3600000} h, tirage ${SHOW_RATE_PERCENT} %.\n`);

  const ads = await prisma.adRequest.findMany({
    where: { status: { in: ["APPROVED", "SCHEDULED", "LIVE", "SUSPENDED"] } },
    include: { merchant: { select: { name: true, city: true, postalCode: true } } },
    orderBy: { createdAt: "desc" },
    take: 50,
  });
  if (ads.length === 0) console.log("Aucune campagne validée/programmée.");

  for (const ad of ads) {
    const diagnostic = await diagnoseAdDelivery(ad.id);
    console.log(`── ${ad.merchant.name} (${ad.id}) — statut ${ad.status}, financement ${ad.fundingMode ?? "quota/réel"}`);
    if (mode === "TEST" && isPaymentAllowedForMerchant(ad.merchantId)) console.log("   (commerce de test : ses envois sont simulés en mode test)");
    for (const check of diagnostic?.checks ?? []) console.log(`   ${check.ok ? "✓" : "✗"} ${check.label} — ${check.detail}`);
    console.log(`   => ${diagnostic?.deliverable ? "DIFFUSABLE" : "NON DIFFUSÉE"}\n`);
  }

  if (userEmail) {
    const user = await prisma.user.findUnique({ where: { email: userEmail.toLowerCase() }, select: { id: true } });
    if (!user) {
      console.log(`Client introuvable : ${userEmail}`);
    } else {
      for (const placement of ["WALLET_HOME", "SEARCH", "NOTIFICATIONS"] as const) {
        const result = await selectSponsoredForCustomerDebug({ userId: user.id, placement });
        console.log(`Client ${userEmail} — ${placement} : ${result.card ? `verrait « ${result.card.merchantName} »` : `rien (${result.reason})`}`);
      }
    }
  }
  await prisma.$disconnect();
}

void main();
