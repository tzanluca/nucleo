import "server-only";
import { notFound } from "next/navigation";
import type { Workspace } from "@prisma/client";
import { prisma } from "@/lib/prisma";

/** Resolve uma workspace pelo slug ou dispara 404. Usado pelas páginas. */
export async function requireWorkspaceBySlug(slug: string): Promise<Workspace> {
  const workspace = await prisma.workspace.findUnique({ where: { slug } });
  if (!workspace) notFound();
  return workspace;
}
