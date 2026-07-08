import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/ui/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { requireWorkspaceBySlug } from "@/lib/workspace-context";
import { isProjectStatus } from "@/lib/constants/project-status";

export default async function ProjectsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const workspace = await requireWorkspaceBySlug(slug);
  const projects = await prisma.project.findMany({
    where: { workspaceId: workspace.id },
    orderBy: { updatedAt: "desc" },
    include: { client: { select: { name: true } } },
  });
  const base = `/w/${slug}`;

  return (
    <>
      <PageHeader
        title="Projetos"
        subtitle={`${projects.length} no total`}
        actions={
          <Link href={`${base}/projects/new`} className="btn-primary">
            Novo projeto
          </Link>
        }
      />

      {projects.length === 0 ? (
        <EmptyState
          title="Nenhum projeto"
          description="Crie um projeto para acompanhar prazos, documentos e credenciais."
          action={
            <Link href={`${base}/projects/new`} className="btn-primary">
              Criar projeto
            </Link>
          }
        />
      ) : (
        <ul className="space-y-2">
          {projects.map((project) => (
            <li key={project.id}>
              <Link
                href={`${base}/projects/${project.id}`}
                className="card flex items-center justify-between gap-4 transition-colors hover:border-accent"
              >
                <div className="flex items-center gap-3">
                  <span
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: project.color }}
                  />
                  <div>
                    <p className="font-medium text-white">{project.name}</p>
                    {project.client ? (
                      <p className="text-xs text-muted">{project.client.name}</p>
                    ) : null}
                  </div>
                </div>
                {isProjectStatus(project.status) ? (
                  <StatusBadge status={project.status} />
                ) : null}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
