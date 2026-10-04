import { adVisualUrl } from "./ad-visuals";
import { prisma } from "./prisma";
const SPONSORED_TEST_BROADCAST_ROW_ID = "global";

/** Fichier hero Google Wallet validé, diffusable publiquement (Google fetch sans cookie). */
export async function isPublicGoogleWalletHeroMedia(merchantId: string, fileUrl: string) {
  const published = await prisma.adRequest.findFirst({
    where: {
      merchantId,
      googleWalletVisualStatus: "APPROVED",
      googleWalletHeroUrl: fileUrl,
      status: { in: ["SCHEDULED", "LIVE"] },
      OR: [{ fundingMode: null }, { fundingMode: "LIVE" }],
    },
    select: { id: true },
  });
  return Boolean(published);
}

/** Hero Wallet de la campagne en diffusion test globale (sans exiger LIVE / paiement réel). */
export async function isPublicTestBroadcastWalletHeroMedia(merchantId: string, fileUrl: string) {
  const broadcast = await prisma.sponsoredAdTestBroadcast.findUnique({
    where: { id: SPONSORED_TEST_BROADCAST_ROW_ID },
    include: {
      adRequest: {
        select: {
          merchantId: true,
          googleWalletVisualStatus: true,
          googleWalletHeroUrl: true,
        },
      },
    },
  });
  if (!broadcast) return false;
  const ad = broadcast.adRequest;
  if (ad.merchantId !== merchantId) return false;
  if (ad.googleWalletVisualStatus !== "APPROVED") return false;
  return ad.googleWalletHeroUrl === fileUrl;
}

export function isGoogleWalletHeroFilename(filename: string) {
  return filename.startsWith("google-wallet-hero-");
}

export function fileUrlFromMediaPath(merchantId: string, filename: string) {
  return adVisualUrl(merchantId, filename);
}
