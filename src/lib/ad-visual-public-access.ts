import { adVisualUrl } from "./ad-visuals";
import { prisma } from "./prisma";

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

export function isGoogleWalletHeroFilename(filename: string) {
  return filename.startsWith("google-wallet-hero-");
}

export function fileUrlFromMediaPath(merchantId: string, filename: string) {
  return adVisualUrl(merchantId, filename);
}
