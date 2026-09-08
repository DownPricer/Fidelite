#!/usr/bin/env node
import sharp from "sharp";
import { readdir } from "fs/promises";
import { join } from "path";

const INPUT_DIR = join(process.cwd(), "public", "cards");
const files = ["bronze-good.png", "argent-good.png", "or-good.png", "diamant-good.png"];

console.log("🖼️  Recadrage des PNG sur leur canal alpha...\n");

for (const file of files) {
  const inputPath = join(INPUT_DIR, file);
  const outputPath = inputPath; // Écraser l'original

  try {
    // Lire l'image
    const image = sharp(inputPath);
    const metadata = await image.metadata();
    console.log(`📐 ${file}: ${metadata.width}×${metadata.height}px`);

    // Recadrer sur le canal alpha (trim transparent borders)
    await image
      .trim({
        background: { r: 0, g: 0, b: 0, alpha: 0 },
        threshold: 1,
      })
      .toFile(inputPath + ".tmp");

    // Vérifier les nouvelles dimensions
    const trimmed = sharp(inputPath + ".tmp");
    const trimmedMeta = await trimmed.metadata();
    console.log(`   → Recadré: ${trimmedMeta.width}×${trimmedMeta.height}px`);

    // Remplacer l'original
    await sharp(inputPath + ".tmp").toFile(inputPath);
    
    // Supprimer le fichier temporaire
    const fs = await import("fs/promises");
    await fs.unlink(inputPath + ".tmp");

    console.log(`   ✓ ${file} mis à jour\n`);
  } catch (error) {
    console.error(`   ✗ Erreur sur ${file}:`, error.message);
  }
}

console.log("✅ Recadrage terminé");
