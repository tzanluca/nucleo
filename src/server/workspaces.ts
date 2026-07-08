"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/auth/require-session";
import { slugify } from "@/lib/slug";
import { workspaceInput } from "@/lib/validation/schemas";
import { fromZodError, formObject, type FormState } from "./form-state";

/** Garante slug único adicionando sufixo -2, -3... quando há colisão. */
async function uniqueSlug(name: string, ignoreId?: string): Promise<string> {
  const base = slugify(name);
  let candidate = base;
  let suffix = 1;
  while (true) {
    const existing = await prisma.workspace.findUnique({
      where: { slug: candidate },
    });
    if (!existing || existing.id === ignoreId) return candidate;
    suffix += 1;
    candidate = `${base}-${suffix}`;
  }
}

export async function createWorkspace(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireSession();
  const parsed = workspaceInput.safeParse(formObject(formData));
  if (!parsed.success) return fromZodError(parsed.error);

  const { name, description, color } = parsed.data;
  const workspace = await prisma.workspace.create({
    data: { name, description, color, slug: await uniqueSlug(name) },
  });
  revalidatePath("/");
  redirect(`/w/${workspace.slug}`);
}

export async function updateWorkspace(
  id: string,
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireSession();
  const parsed = workspaceInput.safeParse(formObject(formData));
  if (!parsed.success) return fromZodError(parsed.error);

  const { name, description, color } = parsed.data;
  const workspace = await prisma.workspace.update({
    where: { id },
    data: { name, description, color, slug: await uniqueSlug(name, id) },
  });
  revalidatePath("/");
  redirect(`/w/${workspace.slug}`);
}

export async function deleteWorkspace(formData: FormData): Promise<void> {
  await requireSession();
  const id = String(formData.get("id") ?? "");
  if (!id) throw new Error("deleteWorkspace: campo 'id' ausente no formulário.");
  await prisma.workspace.delete({ where: { id } });
  revalidatePath("/");
  redirect("/");
}
