"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/auth/require-session";
import { projectInput } from "@/lib/validation/schemas";
import { fromZodError, formObject, type FormState } from "./form-state";

function revalidateWorkspace(slug: string): void {
  revalidatePath(`/w/${slug}`, "layout");
}

export async function createProject(
  workspaceId: string,
  slug: string,
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireSession();
  const parsed = projectInput.safeParse(formObject(formData));
  if (!parsed.success) return fromZodError(parsed.error);

  const project = await prisma.project.create({
    data: { ...parsed.data, workspaceId },
  });
  revalidateWorkspace(slug);
  redirect(`/w/${slug}/projects/${project.id}`);
}

export async function updateProject(
  id: string,
  slug: string,
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireSession();
  const parsed = projectInput.safeParse(formObject(formData));
  if (!parsed.success) return fromZodError(parsed.error);

  await prisma.project.update({ where: { id }, data: parsed.data });
  revalidateWorkspace(slug);
  redirect(`/w/${slug}/projects/${id}`);
}

export async function deleteProject(slug: string, formData: FormData): Promise<void> {
  await requireSession();
  const id = String(formData.get("id") ?? "");
  if (!id) throw new Error("deleteProject: campo 'id' ausente no formulário.");
  await prisma.project.delete({ where: { id } });
  revalidateWorkspace(slug);
  redirect(`/w/${slug}/projects`);
}
