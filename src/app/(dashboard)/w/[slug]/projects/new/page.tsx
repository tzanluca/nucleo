import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/ui/PageHeader";
import { requireWorkspaceBySlug } from "@/lib/workspace-context";
import { createProject } from "@/server/projects";
import { ProjectForm } from "../ProjectForm";

export default async function NewProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const workspace = await requireWorkspaceBySlug(slug);
  const clients = await prisma.client.findMany({
    where: { workspaceId: workspace.id },
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });
  const action = createProject.bind(null, workspace.id, slug);

  return (
    <>
      <PageHeader title="Novo projeto" />
      <ProjectForm action={action} clients={clients} />
    </>
  );
}
