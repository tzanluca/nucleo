import "server-only";
import { serverEnv } from "@/lib/env";
import { SecretCipher, keyFromBase64 } from "./secret-cipher";

/**
 * Fornece o SecretCipher configurado com a ENCRYPTION_KEY do ambiente.
 * Cacheado por processo — derivar a chave uma vez basta.
 */
let cached: SecretCipher | undefined;

export function credentialCipher(): SecretCipher {
  if (!cached) {
    cached = new SecretCipher(keyFromBase64(serverEnv.encryptionKey()));
  }
  return cached;
}
