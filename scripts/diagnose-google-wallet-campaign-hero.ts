/**
 * Diagnostic hero Google Wallet — usage :
 *   npx tsx scripts/diagnose-google-wallet-campaign-hero.ts <campaignId> <loyaltyObjectId>
 * N'affiche aucun secret (pas de clés, tokens, e-mails).
 */
import { prisma } from "../src/lib/prisma";
import {
  approvedGoogleWalletHeroUrl,
  resolveApprovedWalletHeroForGoogle,
  resolveCampaignModuleHeroPathOrUrl,
} from "../src/lib/google-wallet-campaign-hero";
import {
  globalObjectBody,
  getGoogleWalletLoyaltyObject,
  syncGoogleWalletGlobalObject,
} from "../src/lib/google-wallet";
import { resolveGlobalWalletCampaignModule } from "../src/lib/sponsored-test-broadcast";
import { selectSponsoredForGoogleWalletGlobal } from "../src/lib/sponsored-selection";
import { isGoogleWalletConfigured } from "../src/lib/env";

function redactUrl(url: string | null | undefined) {
  if (!url) return null;
  try {
    const u = new URL(url.startsWith("http") ? url : `https://fideto.fr${url}`);
    return `${u.origin}${u.pathname}`;
  } catch {
    return url.split("?")[0];
  }
}

async function probePublicImage(url: string) {
  try {
    const res = await fetch(url, { method: "GET", redirect: "manual" });
    const type = res.headers.get("content-type") ?? "";
    return {
      status: res.status,
      contentType: type,
      ok: res.status === 200 && type.startsWith("image/"),
      redirected: res.status >= 300 && res.status < 400,
    };
  } catch (e) {
    return { status: 0, contentType: "", ok: false, redirected: false, error: e instanceof Error ? e.message : "fetch failed" };
  }
}

async function main() {
  const args = process.argv.slice(2).filter((a) => a !== "--sync");
  const doSync = process.argv.includes("--sync");
  const campaignId = args[0];
  const loyaltyObjectId = args[1];
  if (!campaignId || !loyaltyObjectId) {
    console.error(
      "Usage: npx tsx scripts/diagnose-google-wallet-campaign-hero.ts [--sync] <campaignId|adRequestId> <loyaltyObjectId>",
    );
    process.exit(1);
  }

  const ad =
    (await prisma.adRequest.findFirst({
      where: { OR: [{ id: campaignId }, { campaignId }] },
      include: {
        walletVisualVersions: { orderBy: { number: "desc" }, take: 5 },
      },
    })) ?? null;
  if (!ad) {
    console.error("AdRequest / campagne introuvable.");
    process.exit(1);
  }

  const walletObject = await prisma.googleWalletObject.findFirst({
    where: {
      OR: [{ googleObjectId: loyaltyObjectId }, { id: loyaltyObjectId }],
    },
    select: { id: true, googleObjectId: true, userId: true, syncStatus: true, lastError: true },
  });

  const approvedVersion = ad.walletVisualVersions.find((v) => v.status === "APPROVED") ?? null;
  const proposedVersion = ad.walletVisualVersions.find((v) => v.status === "PROPOSED") ?? null;

  console.log("=== Base de données ===");
  console.log("bandeau finalImageUrl:", redactUrl(ad.finalImageUrl));
  console.log("googleWalletHeroOriginalUrl:", redactUrl(ad.googleWalletHeroOriginalUrl));
  console.log("googleWalletHeroUrl (champ campagne):", redactUrl(ad.googleWalletHeroUrl));
  console.log("googleWalletVisualStatus:", ad.googleWalletVisualStatus);
  console.log("version Wallet APPROVED url:", redactUrl(approvedVersion?.url ?? null));
  console.log("version Wallet PROPOSED url:", redactUrl(proposedVersion?.url ?? null));
  console.log("approvedGoogleWalletHeroUrl():", redactUrl(approvedGoogleWalletHeroUrl(ad)));
  console.log("resolveApprovedWalletHeroForGoogle():", redactUrl(resolveApprovedWalletHeroForGoogle(ad)));

  const userId = walletObject?.userId;
  if (userId) {
    const mod = await resolveGlobalWalletCampaignModule(userId);
    const selected = await selectSponsoredForGoogleWalletGlobal(userId);
    console.log("\n=== Resolver ===");
    console.log("resolveGlobalWalletCampaignModule.imagePathOrUrl:", redactUrl(mod?.imagePathOrUrl ?? null));
    console.log("selectSponsoredForGoogleWalletGlobal.imagePathOrUrl:", redactUrl(selected?.imagePathOrUrl ?? null));
    console.log(
      "resolveCampaignModuleHeroPathOrUrl(module):",
      redactUrl(resolveCampaignModuleHeroPathOrUrl(mod?.imagePathOrUrl ?? "")),
    );

    const qrValue = "diagnostic-qr";
    const body = await globalObjectBody({
      user: {
        id: userId,
        firstName: "Diag",
        lastName: null,
        clientNumber: "000000",
        fifeLifePoints: 10,
        isActive: true,
      },
      objectId: walletObject?.googleObjectId ?? loyaltyObjectId,
      qrValue,
      activeCardCount: 1,
      nextReward: null,
      availableRewardsCount: 0,
      campaignModule: mod,
    });
    const patchHero = body.heroImage?.sourceUri?.uri ?? null;
    console.log("\n=== Payload PATCH (heroImage.sourceUri.uri) ===");
    console.log(redactUrl(patchHero));

    if (patchHero) {
      const probe = await probePublicImage(patchHero);
      console.log("\n=== Probe URL hero (sans cookie) ===");
      console.log(JSON.stringify(probe, null, 2));
    }
  } else {
    console.log("\n(Aucun GoogleWalletObject local — étapes resolver/PATCH/Google GET ignorées.)");
  }

  if (doSync && userId && isGoogleWalletConfigured()) {
    console.log("\n=== PATCH Google (syncGoogleWalletGlobalObject) ===");
    try {
      await syncGoogleWalletGlobalObject(userId);
      console.log("sync: ok");
    } catch (e) {
      console.log("sync: échec —", e instanceof Error ? e.message : String(e));
    }
  }

  if (isGoogleWalletConfigured() && walletObject?.googleObjectId) {
    try {
      const remote = await getGoogleWalletLoyaltyObject(walletObject.googleObjectId);
      const remoteHero = (remote as { heroImage?: { sourceUri?: { uri?: string } } }).heroImage?.sourceUri?.uri ?? null;
      console.log("\n=== GET Google LoyaltyObject (après sync) ===");
      console.log("heroImage.sourceUri.uri:", redactUrl(remoteHero));
    } catch (e) {
      console.log("\n=== GET Google LoyaltyObject ===");
      console.log("échec:", e instanceof Error ? e.message : String(e));
    }
  } else {
    console.log("\n(Google Wallet non configuré ou objet inconnu — GET API ignoré.)");
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
