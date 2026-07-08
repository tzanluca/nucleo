"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/auth/require-session";
import { contactInput } from "@/lib/validation/schemas";
import { fromZodError, formObject, type FormState } from "./form-state";

function revalidateWorkspace(slug: string): void {
  revalidatePath(`/w/${slug}`, "layout");
}

export async function createContact(
  workspaceId: string,
  slug: string,
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireSession();
  const parsed = contactInput.safeParse(formObject(formData));
  if (!parsed.success) return fromZodError(parsed.error);

  await prisma.contact.create({ data: { ...parsed.data, workspaceId } });
  revalidateWorkspace(slug);
  redirect(`/w/${slug}/contacts`);
}

export async function updateContact(
  id: string,
  slug: string,
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireSession();
  const parsed = contactInput.safeParse(formObject(formData));
  if (!parsed.success) return fromZodError(parsed.error);

  await prisma.contact.update({ where: { id }, data: parsed.data });
  revalidateWorkspace(slug);
  redirect(`/w/${slug}/contacts`);
}

export async function deleteContact(slug: string, formData: FormData): Promise<void> {
  await requireSession();
  const id = String(formData.get("id") ?? "");
  if (!id) throw new Error("deleteContact: campo 'id' ausente no formulário.");
  await prisma.contact.delete({ where: { id } });
  revalidateWorkspace(slug);
  redirect(`/w/${slug}/contacts`);
}
