export class CaisseScanError extends Error {
  readonly code: string;
  readonly status: number;
  readonly details?: Record<string, unknown>;

  constructor(message: string, code: string, status = 400, details?: Record<string, unknown>) {
    super(message);
    this.name = "CaisseScanError";
    this.code = code;
    this.status = status;
    this.details = details;
  }
}

/** Masque un numéro client pour les journaux (jamais le numéro complet). */
export function maskClientNumberForLog(normalized: string): string {
  if (normalized.length <= 2) return "***";
  return `${normalized.slice(0, 2)}***${normalized.slice(-1)}`;
}
