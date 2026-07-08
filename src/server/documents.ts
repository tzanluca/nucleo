"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/auth/require-session";
import { deleteStored, saveUpload } from "@/lib/storage";
import { documentMetaInput } from "@/lib/validation/schemas";
import { fromZodError, formObject, type FormState } from "./form-state";

function revalidateWorkspace(slug: string): void {
  revalidatePath(`/w/${slug}`, "layout");
}

export async function uploadDocument(
  workspaceId: string,
  slug: string,
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireSession();
  const parsed = documentMetaInput.safeParse(formObject(formData));
  if (!parsed.success) return fromZodError(parsed.error);

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { ok: false, fieldErrors: { file: "Selecione um arquivo." } };
  }

  const stored = await saveUpload(file);
  await prisma.document.create({
    data: {
      workspaceId,
      projectId: parsed.data.projectId,
      description: parsed.data.description,
      originalName: file.name,
      mimeType: file.type || "application/octet-stream",
      storedName: stored.storedName,
      sizeBytes: stored.sizeBytes,
    },
  });
  revalidateWorkspace(slug);
  redirect(`/w/${slug}/documents`);
}

export async function deleteDocument(slug: string, formData: FormData): Promise<void> {
  await requireSession();
  const id = String(formData.get("id") ?? "");
  if (!id) throw new Error("deleteDocument: campo 'id' ausente no formulário.");

  const document = await prisma.document.findUnique({ where: { id } });
  if (document) {
    await deleteStored(document.storedName);
    await prisma.document.delete({ where: { id } });
  }
  revalidateWorkspace(slug);
  redirect(`/w/${slug}/documents`);
}
