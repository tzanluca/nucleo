import { createCipheriv, createDecipheriv, randomBytes } from "node:crypto";

/**
 * Cifra simétrica autenticada (AES-256-GCM) para segredos em repouso.
 *
 * O payload serializado é `base64(iv | authTag | ciphertext)`, tudo num campo.
 * A chave é injetada no construtor — nada de ler env aqui, para manter a classe
 * pura e testável.
 *
 * @example
 *   const cipher = new SecretCipher(keyFromBase64(process.env.ENCRYPTION_KEY!));
 *   const box = cipher.encrypt("token-super-secreto");
 *   cipher.decrypt(box); // => "token-super-secreto"
 */
const ALGORITHM = "aes-256-gcm";
const IV_BYTES = 12;
const AUTH_TAG_BYTES = 16;
const KEY_BYTES = 32;

export class SecretCipher {
  private readonly key: Buffer;

  constructor(key: Buffer) {
    if (key.length !== KEY_BYTES) {
      throw new Error(
        `Chave AES inválida: ${key.length} bytes, esperava exatamente ${KEY_BYTES}.`,
      );
    }
    this.key = key;
  }

  encrypt(plaintext: string): string {
    const iv = randomBytes(IV_BYTES);
    const cipher = createCipheriv(ALGORITHM, this.key, iv);
    const body = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
    return Buffer.concat([iv, cipher.getAuthTag(), body]).toString("base64");
  }

  decrypt(payload: string): string {
    const raw = Buffer.from(payload, "base64");
    const minBytes = IV_BYTES + AUTH_TAG_BYTES;
    if (raw.length <= minBytes) {
      throw new Error(
        `Payload cifrado curto demais: ${raw.length} bytes, esperava mais de ${minBytes}.`,
      );
    }
    const iv = raw.subarray(0, IV_BYTES);
    const authTag = raw.subarray(IV_BYTES, minBytes);
    const body = raw.subarray(minBytes);
    const decipher = createDecipheriv(ALGORITHM, this.key, iv);
    decipher.setAuthTag(authTag);
    return Buffer.concat([decipher.update(body), decipher.final()]).toString("utf8");
  }
}

/** Converte a ENCRYPTION_KEY (base64, 32 bytes) num Buffer validado. */
export function keyFromBase64(base64: string): Buffer {
  const key = Buffer.from(base64, "base64");
  if (key.length !== KEY_BYTES) {
    throw new Error(
      `ENCRYPTION_KEY deve decodificar para ${KEY_BYTES} bytes; recebi ${key.length} bytes. ` +
        `Gere uma nova com: npm run gen-keys`,
    );
  }
  return key;
}
