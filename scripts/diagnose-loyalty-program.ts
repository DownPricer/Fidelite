#!/usr/bin/env npx tsx
/**
 * Diagnostic non destructif d'un commerce sur le VPS.
 * Usage : npx tsx scripts/diagnose-loyalty-program.ts <merchantId|slug>
 */
import { getActiveMerchantLoyaltyContext } from "../src/lib/loyalty-context";
import { prisma } from "../src/lib/prisma";

async function main() {
  const key = process.argv[2];
  if (!key) {
    console.error("Usage: npx tsx scripts/diagnose-loyalty-program.ts <merchantId|slug>");
    process.exit(1);
  }

  const merchant = await prisma.merchant.findFirst({
    where: {
      OR: [{ id: key }, { slug: key }],
    },
    select: { id: true, name: true, slug: true, status: true, isActive: true },
  });

  if (!merchant) {
    console.error("Commerce introuvable:", key);
    process.exit(1);
  }

  const program = await prisma.loyaltyProgram.findUnique({
    where: { merchantId: merchant.id },
    include: {
      rewards: { orderBy: { sortOrder: "asc" } },
      versions: { orderBy: { version: "desc" } },
    },
  });

  const activeContext = await getActiveMerchantLoyaltyContext(merchant.id);

  console.log("=== Commerce ===");
  console.log(JSON.stringify(merchant, null, 2));

  console.log("\n=== Programme en base ===");
  if (!program) {
    console.log("Aucun programme.");
  } else {
    console.log(
      JSON.stringify(
        {
          id: program.id,
          status: program.status,
          mode: program.mode,
          version: program.version,
          publishedAt: program.publishedAt,
          scheduledAt: program.scheduledAt,
          visitsRequired: program.visitsRequired,
          rewardLabel: program.rewardLabel,
          rewardCount: program.rewards.length,
          rewards: program.rewards.map((reward) => ({
            id: reward.id,
            name: reward.name,
            threshold: reward.threshold,
            thresholdUnit: reward.thresholdUnit,
            isActive: reward.isActive,
          })),
        },
        null,
        2,
      ),
    );
  }

  console.log("\n=== Versions publiées ===");
  console.log(
    JSON.stringify(
      program?.versions.map((version) => ({
        version: version.version,
        mode: version.mode,
        publishedAt: version.publishedAt,
        publishedBy: version.publishedBy,
      })) ?? [],
      null,
      2,
    ),
  );

  console.log("\n=== Contexte actif résolu ===");
  console.log(
    JSON.stringify(
      activeContext
        ? {
            programId: activeContext.programId,
            programVersion: activeContext.programVersion,
            mode: activeContext.mode,
            isOperational: activeContext.isOperational,
            programTitle: activeContext.programTitle,
            programDescription: activeContext.programDescription,
            minimumPurchaseLabel: activeContext.minimumPurchaseLabel,
            cardTemplateId: activeContext.cardTemplateMeta?.id ?? null,
            cardSlot: activeContext.cardTemplateMeta?.cardSlot ?? null,
            usedFallback: activeContext.cardTemplateMeta?.usedFallback ?? false,
            filteredRewards: activeContext.rewards.map((reward) => ({
              name: reward.name,
              threshold: reward.threshold,
              thresholdUnit: reward.thresholdUnit,
            })),
          }
        : null,
      null,
      2,
    ),
  );

  await prisma.$disconnect();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
