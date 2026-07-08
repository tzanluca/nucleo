import { describe, expect, it } from "vitest";
import { signSession, verifySession } from "@/lib/auth/session";

const SECRET = "test-secret-para-assinatura-hs256-com-tamanho-ok";

describe("session JWT", () => {
  it("assina e verifica um token válido", async () => {
    const token = await signSession({ email: "a@b.com" }, SECRET);
    const payload = await verifySession(token, SECRET);
    expect(payload?.email).toBe("a@b.com");
  });

  it("rejeita token assinado com outro segredo", async () => {
    const token = await signSession({ email: "a@b.com" }, SECRET);
    expect(await verifySession(token, "outro-segredo-diferente")).toBeNull();
  });

  it("rejeita lixo", async () => {
    expect(await verifySession("nao-e-um-jwt", SECRET)).toBeNull();
  });
});
