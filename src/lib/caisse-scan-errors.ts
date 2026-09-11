export class CaisseScanError extends Error {
  readonly code: string;
  readonly status: number;

  constructor(message: string, code: string, status = 400) {
    super(message);
    this.name = "CaisseScanError";
    this.code = code;
    this.status = status;
  }
}

/** Masque un numéro client pour les journaux (jamais le numéro complet). */
export function maskClientNumberForLog(normalized: string): string {
  if (normalized.length <= 2) return "***";
  return `${normalized.slice(0, 2)}***${normalized.slice(-1)}`;
}
