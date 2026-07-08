/**
 * Gera segredos aleatórios para SESSION_SECRET e ENCRYPTION_KEY.
 * Uso: npm run gen-keys
 */
import { randomBytes } from "node:crypto";

function main(): void {
  const sessionSecret = randomBytes(48).toString("base64");
  const encryptionKey = randomBytes(32).toString("base64"); // 32 bytes = AES-256

  console.log("\nAdicione ao seu .env (guarde a ENCRYPTION_KEY com cuidado):\n");
  console.log(`SESSION_SECRET='${sessionSecret}'`);
  console.log(`ENCRYPTION_KEY='${encryptionKey}'\n`);
  console.log(
    "AVISO: se você perder a ENCRYPTION_KEY, as credenciais guardadas " +
      "ficam irrecuperáveis.\n",
  );
}

main();
