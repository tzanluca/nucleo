import { describe, expect, it } from "vitest";
import { randomBytes } from "node:crypto";
import { SecretCipher, keyFromBase64 } from "@/lib/crypto/secret-cipher";

function newCipher(): SecretCipher {
  return new SecretCipher(randomBytes(32));
}

describe("SecretCipher", () => {
  it("faz round-trip de encrypt/decrypt", () => {
    const cipher = newCipher();
    const secret = "token-👀-com-acentuação";
    expect(cipher.decrypt(cipher.encrypt(secret))).toBe(secret);
  });

  it("produz ciphertext diferente a cada chamada (IV aleatório)", () => {
    const cipher = newCipher();
    expect(cipher.encrypt("mesmo")).not.toBe(cipher.encrypt("mesmo"));
  });

  it("rejeita chave com tamanho inválido", () => {
    expect(() => new SecretCipher(randomBytes(16))).toThrow(/16 bytes/);
  });

  it("falha ao decifrar payload adulterado (tag GCM)", () => {
    const cipher = newCipher();
    const box = cipher.encrypt("segredo");
    const tampered = box.slice(0, -4) + (box.endsWith("A") ? "B" : "A") + "===";
    expect(() => cipher.decrypt(tampered)).toThrow();
  });

  it("keyFromBase64 rejeita chave curta", () => {
    expect(() => keyFromBase64(randomBytes(8).toString("base64"))).toThrow(/32 bytes/);
  });
});
