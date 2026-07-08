import { describe, expect, it } from "vitest";
import { formatBytes } from "@/lib/format/bytes";

describe("formatBytes", () => {
  it("mantém bytes abaixo de 1KB", () => {
    expect(formatBytes(512)).toBe("512 B");
  });

  it("converte para KB e MB", () => {
    expect(formatBytes(1536)).toBe("1.5 KB");
    expect(formatBytes(5 * 1024 * 1024)).toBe("5.0 MB");
  });

  it("rejeita valores negativos", () => {
    expect(() => formatBytes(-1)).toThrow(/-1/);
  });
});
