"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/auth/require-session";
import { credentialCipher } from "@/lib/crypto/credential-cipher";
import { credentialInput } from "@/lib/validation/schemas";
import { fromZodError, formObject, type FormState } from "./form-state";

function revalidateWorkspace(slug: string): void {
  revalidatePath(`/w/${slug}`, "layout");
}

export async function createCredential(
  workspaceId: string,
  slug: string,
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireSession();
  const parsed = credentialInput.safeParse(formObject(formData));
  if (!parsed.success) return fromZodError(parsed.error);

  const { secret, ...rest } = parsed.data;
  await prisma.credential.create({
    data: {
      ...rest,
      workspaceId,
      secretCiphertext: credentialCipher().encrypt(secret),
    },
  });
  revalidateWorkspace(slug);
  redirect(`/w/${slug}/credentials`);
}

export async function updateCredential(
  id: string,
  slug: string,
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireSession();
  const parsed = credentialInput.safeParse(formObject(formData));
  if (!parsed.success) return fromZodError(parsed.error);

  const { secret, ...rest } = parsed.data;
  await prisma.credential.update({
    where: { id },
    data: { ...rest, secretCiphertext: credentialCipher().encrypt(secret) },
  });
  revalidateWorkspace(slug);
  redirect(`/w/${slug}/credentials`);
}

/** Descriptografa e devolve o segredo sob demanda (ex.: botão "revelar"). */
export async function revealSecret(id: string): Promise<string> {
  await requireSession();
  const credential = await prisma.credential.findUnique({
    where: { id },
    select: { secretCiphertext: true },
  });
  if (!credential) {
    throw new Error(`Credencial não encontrada: ${id}.`);
  }
  return credentialCipher().decrypt(credential.secretCiphertext);
}

export async function deleteCredential(slug: string, formData: FormData): Promise<void> {
  await requireSession();
  const id = String(formData.get("id") ?? "");
  if (!id) throw new Error("deleteCredential: campo 'id' ausente no formulário.");
  await prisma.credential.delete({ where: { id } });
  revalidateWorkspace(slug);
  redirect(`/w/${slug}/credentials`);
}
