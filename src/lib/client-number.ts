/** Normalise un numéro client saisi (espaces, tirets, #, etc.). */
export function normalizeCustomerNumber(raw: string): string {
  return raw.replace(/[^\d]/g, "");
}

/** Alias historique — même logique que {@link normalizeCustomerNumber}. */
export function normalizeClientNumber(raw: string): string {
  return normalizeCustomerNumber(raw);
}

/** Affichage lisible : 482917 → 482 917 */
export function formatClientNumberDisplay(value: string): string {
  const digits = normalizeClientNumber(value);
  if (!digits) return "";
  return digits.replace(/(\d{3})(?=\d)/g, "$1 ").trim();
}

/** Numéro stable à 6 chiffres dérivé de l'id utilisateur (fallback). */
export function deriveClientNumber(userId: string): string {
  let hash = 0;
  for (let i = 0; i < userId.length; i += 1) {
    hash = (hash * 31 + userId.charCodeAt(i)) >>> 0;
  }
  return String(hash % 1_000_000).padStart(6, "0");
}

export function resolveClientNumber(input: { clientNumber?: string | null; userId: string }): string {
  const stored = input.clientNumber ? normalizeClientNumber(input.clientNumber) : "";
  if (stored.length >= 4) return stored;
  return deriveClientNumber(input.userId);
}
