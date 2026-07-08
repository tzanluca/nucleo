import "server-only";
import { randomUUID } from "node:crypto";
import { mkdir, readFile, unlink, writeFile } from "node:fs/promises";
import { extname, join, resolve } from "node:path";
import { serverEnv } from "@/lib/env";

/**
 * Armazenamento de arquivos no filesystem local. Guardamos só metadados no
 * banco; o binário vive em STORAGE_DIR sob um nome opaco (uuid + extensão).
 */
export interface StoredFile {
  storedName: string;
  sizeBytes: number;
}

function storageRoot(): string {
  return resolve(process.cwd(), serverEnv.storageDir());
}

function resolveStoredPath(storedName: string): string {
  // storedName é gerado por nós, mas validamos contra path traversal por garantia.
  if (/[\\/]|\.\./.test(storedName)) {
    throw new Error(`Nome de arquivo inválido: "${storedName}".`);
  }
  return join(storageRoot(), storedName);
}

export async function saveUpload(file: File): Promise<StoredFile> {
  const buffer = Buffer.from(await file.arrayBuffer());
  const max = serverEnv.maxUploadBytes();
  if (buffer.length === 0) {
    throw new Error("Arquivo vazio: selecione um arquivo com conteúdo.");
  }
  if (buffer.length > max) {
    throw new Error(
      `Arquivo grande demais: ${buffer.length} bytes, máximo permitido ${max}.`,
    );
  }
  const storedName = `${randomUUID()}${extname(file.name).toLowerCase()}`;
  await mkdir(storageRoot(), { recursive: true });
  await writeFile(resolveStoredPath(storedName), buffer);
  return { storedName, sizeBytes: buffer.length };
}

export async function readStored(storedName: string): Promise<Buffer> {
  return readFile(resolveStoredPath(storedName));
}

export async function deleteStored(storedName: string): Promise<void> {
  // Idempotente: se o arquivo já sumiu, seguimos em frente.
  await unlink(resolveStoredPath(storedName)).catch(() => undefined);
}
