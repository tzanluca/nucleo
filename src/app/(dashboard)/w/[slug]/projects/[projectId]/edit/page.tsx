import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/ui/PageHeader";
import { DeleteButton } from "@/components/ui/DeleteButton";
import { requireWorkspaceBySlug } from "@/lib/workspace-context";
import { deleteProject, updateProject } from "@/server/projects";
import { ProjectForm } from "../../ProjectForm";

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ slug: string; projectId: string }>;
}) {
  const { slug, projectId } = await params;
  const workspace = await requireWorkspaceBySlug(slug);
  const [project, clients] = await Promise.all([
    prisma.project.findFirst({
      where: { id: projectId, workspaceId: workspace.id },
    }),
    prisma.client.findMany({
      where: { workspaceId: workspace.id },
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
  ]);
  if (!project) notFound();

  const update = updateProject.bind(null, project.id, slug);
  const remove = deleteProject.bind(null, slug);

  return (
    <>
      <PageHeader
        title={`Editar ${project.name}`}
        actions={<DeleteButton id={project.id} action={remove} />}
      />
      <ProjectForm action={update} clients={clients} project={project} />
    </>
  );
}
