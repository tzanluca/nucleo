import bcrypt from "bcryptjs";

/**
 * Wrapper fino sobre bcrypt (a única fronteira com a lib de hashing).
 * Custo 12 é um bom equilíbrio para um app self-hosted em 2026.
 */
const COST = 12;
const MIN_LENGTH = 8;

export async function hashPassword(plain: string): Promise<string> {
  if (plain.length < MIN_LENGTH) {
    throw new Error(
      `Senha curta demais: ${plain.length} caracteres, mínimo ${MIN_LENGTH}.`,
    );
  }
  return bcrypt.hash(plain, COST);
}

export async function verifyPassword(plain: string, hash: string): Promise<boolean> {
  if (hash.trim() === "") return false;
  return bcrypt.compare(plain, hash);
}
