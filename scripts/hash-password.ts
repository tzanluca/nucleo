/**
 * Gera o hash bcrypt de uma senha para colar em AUTH_PASSWORD_HASH.
 * Uso: npm run hash-password -- "minhaSenhaForte"
 */
import { hashPassword } from "../src/lib/auth/password";

async function main(): Promise<void> {
  const password = process.argv[2];
  if (!password) {
    console.error('Uso: npm run hash-password -- "suaSenha"');
    process.exit(1);
  }
  const hash = await hashPassword(password);
  console.log("\nAdicione ao seu .env:\n");
  console.log(`AUTH_PASSWORD_HASH='${hash}'\n`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
