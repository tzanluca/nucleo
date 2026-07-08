const UNITS = ["B", "KB", "MB", "GB", "TB"] as const;

/**
 * Formata um tamanho em bytes de forma legível.
 * @example formatBytes(1536) // => "1.5 KB"
 */
export function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes < 0) {
    throw new Error(`Tamanho inválido: ${bytes}. Esperava um número >= 0.`);
  }
  if (bytes < 1024) return `${bytes} B`;

  let value = bytes;
  let unitIndex = 0;
  while (value >= 1024 && unitIndex < UNITS.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }
  return `${value.toFixed(1)} ${UNITS[unitIndex]}`;
}
