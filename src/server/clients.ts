"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/auth/require-session";
import { clientInput } from "@/lib/validation/schemas";
import { fromZodError, formObject, type FormState } from "./form-state";

function revalidateWorkspace(slug: string): void {
  revalidatePath(`/w/${slug}`, "layout");
}

export async function createClient(
  workspaceId: string,
  slug: string,
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireSession();
  const parsed = clientInput.safeParse(formObject(formData));
  if (!parsed.success) return fromZodError(parsed.error);

  await prisma.client.create({ data: { ...parsed.data, workspaceId } });
  revalidateWorkspace(slug);
  redirect(`/w/${slug}/clients`);
}

export async function updateClient(
  id: string,
  slug: string,
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireSession();
  const parsed = clientInput.safeParse(formObject(formData));
  if (!parsed.success) return fromZodError(parsed.error);

  await prisma.client.update({ where: { id }, data: parsed.data });
  revalidateWorkspace(slug);
  redirect(`/w/${slug}/clients`);
}

export async function deleteClient(slug: string, formData: FormData): Promise<void> {
  await requireSession();
  const id = String(formData.get("id") ?? "");
  if (!id) throw new Error("deleteClient: campo 'id' ausente no formulário.");
  await prisma.client.delete({ where: { id } });
  revalidateWorkspace(slug);
  redirect(`/w/${slug}/clients`);
}
