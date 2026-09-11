export class CaisseScanError extends Error {
  readonly code: string;

  constructor(message: string, code: string) {
    super(message);
    this.name = "CaisseScanError";
    this.code = code;
  }
}

/** Masque un numéro client pour les journaux (jamais le numéro complet). */
export function maskClientNumberForLog(normalized: string): string {
  if (normalized.length <= 2) return "***";
  return `${normalized.slice(0, 2)}***${normalized.slice(-1)}`;
}
