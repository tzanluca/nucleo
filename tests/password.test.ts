import { describe, expect, it } from "vitest";
import { hashPassword, verifyPassword } from "@/lib/auth/password";

describe("password hashing", () => {
  it("verifica a senha correta contra o hash", async () => {
    const hash = await hashPassword("segredo-forte");
    expect(await verifyPassword("segredo-forte", hash)).toBe(true);
  });

  it("rejeita a senha errada", async () => {
    const hash = await hashPassword("segredo-forte");
    expect(await verifyPassword("errada", hash)).toBe(false);
  });

  it("rejeita senha curta ao gerar o hash", async () => {
    await expect(hashPassword("curta")).rejects.toThrow(/5 caracteres/);
  });

  it("retorna false para hash vazio (env não configurado)", async () => {
    expect(await verifyPassword("qualquer", "")).toBe(false);
  });
});
