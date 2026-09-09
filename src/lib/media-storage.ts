import { mkdir, unlink, writeFile } from "fs/promises";
import { join } from "path";
import { env } from "./env";

/**
 * Stockage persistant des médias uploadés (fonds de cartes, logos locaux).
 * En développement : `data/uploads/` à la racine du projet.
 * En production VPS : bind mount hôte /opt/fifelite/data/uploads → UPLOADS_DIR (/var/lib/fifelite/uploads).
 */
export function getUploadsRoot() {
  if (env.uploadsDir) return env.uploadsDir;
  return join(process.cwd(), "data", "uploads");
}

const CARD_BG_MAX_BYTES = 5 * 1024 * 1024;
const CARD_BG_MAX_DIMENSION = 4096;

const MIME_TO_EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

export type ParsedImage = {
  mime: string;
  buffer: Buffer;
  ext: string;
};

export function parseImageDataUrl(dataUrl: string, maxBytes = CARD_BG_MAX_BYTES) {
  const match = /^data:(image\/(?:jpeg|png|webp));base64,(.+)$/i.exec(dataUrl.trim());
  if (!match) return null;
  const mime = match[1].toLowerCase();
  if (mime === "image/svg+xml") return null;
  const buffer = Buffer.from(match[2], "base64");
  if (buffer.length === 0 || buffer.length > maxBytes) return null;
  return { mime, buffer, ext: MIME_TO_EXT[mime] ?? "webp" };
}

function readPngDimensions(buffer: Buffer) {
  if (buffer.length < 24 || buffer.toString("ascii", 1, 4) !== "PNG") return null;
  return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
}

function readJpegDimensions(buffer: Buffer) {
  let offset = 2;
  while (offset < buffer.length) {
    if (buffer[offset] !== 0xff) return null;
    const marker = buffer[offset + 1];
    const length = buffer.readUInt16BE(offset + 2);
    if (marker === 0xc0 || marker === 0xc2) {
      return { width: buffer.readUInt16BE(offset + 7), height: buffer.readUInt16BE(offset + 9) };
    }
    offset += 2 + length;
  }
  return null;
}

function readWebpDimensions(buffer: Buffer) {
  if (buffer.length < 30 || buffer.toString("ascii", 0, 4) !== "RIFF") return null;
  const chunk = buffer.toString("ascii", 12, 16);
  if (chunk === "VP8 ") {
    return { width: buffer.readUInt16LE(26) & 0x3fff, height: buffer.readUInt16LE(28) & 0x3fff };
  }
  if (chunk === "VP8L") {
    const bits = buffer.readUInt32LE(21);
    return { width: (bits & 0x3fff) + 1, height: ((bits >> 14) & 0x3fff) + 1 };
  }
  if (chunk === "VP8X" && buffer.length >= 30) {
    return {
      width: (buffer[24] | (buffer[25] << 8) | (buffer[26] << 16)) + 1,
      height: (buffer[27] | (buffer[28] << 8) | (buffer[29] << 16)) + 1,
    };
  }
  return null;
}

export function validateImageDimensions(buffer: Buffer, mime: string) {
  let dims: { width: number; height: number } | null = null;
  if (mime === "image/png") dims = readPngDimensions(buffer);
  else if (mime === "image/jpeg") dims = readJpegDimensions(buffer);
  else if (mime === "image/webp") dims = readWebpDimensions(buffer);
  if (!dims || dims.width < 1 || dims.height < 1) return false;
  return dims.width <= CARD_BG_MAX_DIMENSION && dims.height <= CARD_BG_MAX_DIMENSION;
}

export async function saveCardBackground(merchantId: string, dataUrl: string) {
  if (!/^[\w-]+$/.test(merchantId)) {
    throw new Error("Identifiant commerce invalide.");
  }
  const parsed = parseImageDataUrl(dataUrl);
  if (!parsed) throw new Error("Image invalide (PNG, JPEG ou WebP, max 5 Mo).");
  if (!validateImageDimensions(parsed.buffer, parsed.mime)) {
    throw new Error("Dimensions d'image invalides ou trop grandes (max 4096 px).");
  }

  const dir = join(getUploadsRoot(), "card-backgrounds", merchantId);
  await mkdir(dir, { recursive: true });
  const filename = `${Date.now()}-${randomSuffix()}.${parsed.ext}`;
  const filepath = join(dir, filename);
  await writeFile(filepath, parsed.buffer);
  return `/api/media/card-backgrounds/${merchantId}/${filename}`;
}

function randomSuffix() {
  return Math.random().toString(36).slice(2, 10);
}

export async function deleteCardBackground(relativePath: string) {
  const match = /\/api\/media\/card-backgrounds\/([^/]+)\/([^/?]+)/.exec(relativePath);
  if (!match) return;
  const filepath = join(getUploadsRoot(), "card-backgrounds", match[1], match[2]);
  await unlink(filepath).catch(() => undefined);
}

export function resolveMediaFilePath(category: string, ...parts: string[]) {
  const root = getUploadsRoot();
  const filepath = join(root, category, ...parts);
  if (!filepath.startsWith(join(root, category))) {
    throw new Error("Chemin invalide.");
  }
  return filepath;
}
