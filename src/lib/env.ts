/**
 * Acesso tipado e preguiçoso às variáveis de ambiente.
 *
 * Preguiçoso de propósito: `next build` não deve quebrar só porque um segredo
 * de runtime ainda não foi definido. A validação acontece no primeiro uso.
 *
 * @example
 *   const key = serverEnv.encryptionKey(); // lança erro claro se ausente
 */

function requireEnv(name: string): string {
  const value = process.env[name];
  if (value === undefined || value.trim() === "") {
    throw new Error(
      `Variável de ambiente ausente: ${name}. Defina-a no .env (veja .env.example).`,
    );
  }
  return value;
}

function optionalEnv(name: string, fallback: string): string {
  const value = process.env[name];
  return value === undefined || value.trim() === "" ? fallback : value;
}

function requirePositiveInt(name: string, fallback: number): number {
  const raw = process.env[name];
  if (raw === undefined || raw.trim() === "") return fallback;
  const parsed = Number(raw);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new Error(
      `Variável ${name} inválida: recebi "${raw}", esperava um inteiro positivo.`,
    );
  }
  return parsed;
}

export const serverEnv = {
  authEmail: (): string => requireEnv("AUTH_EMAIL").trim().toLowerCase(),
  authPasswordHash: (): string => requireEnv("AUTH_PASSWORD_HASH"),
  sessionSecret: (): string => requireEnv("SESSION_SECRET"),
  encryptionKey: (): string => requireEnv("ENCRYPTION_KEY"),
  storageDir: (): string => optionalEnv("STORAGE_DIR", "storage"),
  maxUploadBytes: (): number => requirePositiveInt("MAX_UPLOAD_BYTES", 26_214_400),
} as const;
