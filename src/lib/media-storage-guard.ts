import { prisma } from "./prisma";
import { deleteCardBackground } from "./media-storage";

/** Vérifie si une image est encore référencée par un gabarit ou une version archivée. */
export async function isCardBackgroundInUse(relativePath: string) {
  const [templates, versions] = await Promise.all([
    prisma.merchantCardTemplate.count({ where: { backgroundUrl: relativePath } }),
    prisma.merchantCardTemplateVersion.count({ where: { backgroundUrl: relativePath } }),
  ]);
  return templates + versions > 0;
}

/** Supprime une image uniquement si aucun gabarit ni version ne la référence. */
export async function deleteCardBackgroundIfUnused(relativePath: string) {
  if (await isCardBackgroundInUse(relativePath)) {
    return { deleted: false, reason: "in_use" as const };
  }
  await deleteCardBackground(relativePath);
  return { deleted: true as const };
}
