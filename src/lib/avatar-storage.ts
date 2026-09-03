import { mkdir, unlink, writeFile } from "fs/promises";
import { join } from "path";

const AVATAR_DIR = join(process.cwd(), "public", "uploads", "avatars");
const MAX_BYTES = 512 * 1024;

const MIME_TO_EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

export function parseAvatarDataUrl(dataUrl: string) {
  const match = /^data:(image\/(?:jpeg|png|webp));base64,(.+)$/i.exec(dataUrl.trim());
  if (!match) return null;
  const mime = match[1].toLowerCase();
  const buffer = Buffer.from(match[2], "base64");
  if (buffer.length === 0 || buffer.length > MAX_BYTES) return null;
  return { mime, buffer, ext: MIME_TO_EXT[mime] ?? "webp" };
}

export async function saveAvatar(userId: string, dataUrl: string) {
  const parsed = parseAvatarDataUrl(dataUrl);
  if (!parsed) throw new Error("Image invalide ou trop volumineuse (max 512 Ko).");

  await mkdir(AVATAR_DIR, { recursive: true });
  const filename = `${userId}.${parsed.ext}`;
  const filepath = join(AVATAR_DIR, filename);
  await writeFile(filepath, parsed.buffer);

  for (const ext of ["jpg", "png", "webp"]) {
    if (ext === parsed.ext) continue;
    await unlink(join(AVATAR_DIR, `${userId}.${ext}`)).catch(() => undefined);
  }

  return `/uploads/avatars/${filename}?v=${Date.now()}`;
}

export async function deleteAvatarFiles(userId: string) {
  for (const ext of ["jpg", "png", "webp"]) {
    await unlink(join(AVATAR_DIR, `${userId}.${ext}`)).catch(() => undefined);
  }
}
