"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/auth/require-session";
import { eventInput } from "@/lib/validation/schemas";
import { fromZodError, formObject, type FormState } from "./form-state";

function revalidateWorkspace(slug: string): void {
  revalidatePath(`/w/${slug}`, "layout");
  revalidatePath("/agenda");
}

export async function createEvent(
  workspaceId: string,
  slug: string,
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireSession();
  const parsed = eventInput.safeParse(formObject(formData));
  if (!parsed.success) return fromZodError(parsed.error);

  await prisma.event.create({ data: { ...parsed.data, workspaceId } });
  revalidateWorkspace(slug);
  redirect(`/w/${slug}/agenda`);
}

export async function updateEvent(
  id: string,
  slug: string,
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireSession();
  const parsed = eventInput.safeParse(formObject(formData));
  if (!parsed.success) return fromZodError(parsed.error);

  await prisma.event.update({ where: { id }, data: parsed.data });
  revalidateWorkspace(slug);
  redirect(`/w/${slug}/agenda`);
}

export async function deleteEvent(slug: string, formData: FormData): Promise<void> {
  await requireSession();
  const id = String(formData.get("id") ?? "");
  if (!id) throw new Error("deleteEvent: campo 'id' ausente no formulário.");
  await prisma.event.delete({ where: { id } });
  revalidateWorkspace(slug);
  redirect(`/w/${slug}/agenda`);
}
