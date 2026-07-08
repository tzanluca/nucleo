import { describe, expect, it } from "vitest";
import { slugify } from "@/lib/slug";

describe("slugify", () => {
  it("remove acentos e normaliza espaços", () => {
    expect(slugify("Cliente Açaí & Cia")).toBe("cliente-acai-cia");
  });

  it("corta hifens das pontas", () => {
    expect(slugify("  ...Olá!!!  ")).toBe("ola");
  });

  it("lança erro quando não sobra nada útil", () => {
    expect(() => slugify("!!!")).toThrow(/slug/);
  });
});
